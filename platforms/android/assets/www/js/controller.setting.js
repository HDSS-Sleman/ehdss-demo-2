(function() {
    angular.module('ehdss')
        .controller('SettingCtrl', SettingCtrl);

    SettingCtrl.$inject = ['$scope', '$http', '$ionicLoading', '$ionicPopup', 'AppService', '$rootScope', '$timeout', '$cordovaFile'];

    function SettingCtrl($scope, $http, $ionicLoading, $ionicPopup, AppService, $rootScope, $timeout, $cordovaFile) {
        var lf = localforage,
            _tgl;
        $scope.show = function() {
            $ionicLoading.show({
                template: '<p>Load data...</p><ion-spinner></ion-spinner>'
            });
        };

        // $scope.version = '1.20.31';
        $scope.version = '1.0.0'; 

        $scope.hide = function() {
            $ionicLoading.hide();
        };

        // Set Tanggal Wawancara, ambil dari localStorage jika ada
        // jika belum set Today
        lf.getItem('options', function(err, val) {
            var tgl;
            if (val && val.tglWawancara) {
                tgl = AppService.stringToDate(val.tglWawancara);
            }

            tgl = tgl || new Date();
            $scope.tglMaxToday = AppService.getToday();
            $scope.mdTglWawancara = tgl;
        });


        $scope.saveTgl = function(tgl) {
            // simpan dulu di variabel global scope agar bisa diakses asynchronous setelah getItem
            _tgl = tgl;
            lf.getItem('options', function(err, val) {
                val = val || {};
                val.tglWawancara = AppService.dateToString(_tgl);
                lf.setItem('options', val).then(function(val) {
                    $rootScope.tglWawancara = val.tglWawancara;
                });
            });
        };

        // getBaselineAvailable();

        var getBaselineAvailable = function() {
            // check baselines yg sudah tersedia di localforage
            AppService.getBaselineAvailable().then(function(data) {
                $scope.baselines = data;
                getDataKelAvailable();
            });
        };

        var getDataKelAvailable = function() {
            AppService.getDataKelAvailable().then(function(data) {
                $scope.baselines.forEach(function(val) {
                    data.forEach(function(d, i, e) {
                        if (val.list_idrt) {
                            if (val.list_idrt.indexOf(parseInt(d.idrt)) !== -1) {
                                e[i]['enumerator'] = val.username;
                            }
                        }
                    });
                });
                $scope.dataKels = data;
            });
        };

        getBaselineAvailable();

        $scope.getBaseline = function(username, password) {
            $scope.show($ionicLoading);
            // AppService.getDataARTpindah(username); //ambil data ART pindah pecah/gabung lebih dulu dan masukkan ke localforage

            $timeout(function() {
                
                AppService.getBaselineData(username, password).then(function(data) {
                    $scope.baselines = data;
                    // menampilkan misal username: "afifah", jml_rt: 258, jml_art: 1066, list_idrt: Array(258), $$hashKey: "object:1446"}
                    getDataKelAvailable();
                    AppService.getStatusUploadData(username); //ambil status upload DATA dari server dan masukkan ke localforage
                    AppService.getDataCatatanEnum(username); //ambil data catatan dan masukkan ke localforage
                    AppService.getStatusUploadCke(username); //ambil status upload CATATAN dari server dan masukkan ke localforage
                    AppService.getDataARTpindah(username); // ambil daftar art yg sudah dipindah dari server, masukan ke localforage
                    
                    $scope.hide($ionicLoading);
                }, function(error) {
                    $scope.hide($ionicLoading);
                    $ionicPopup.alert({
                        title: 'Gagal Mengambil Baseline',
                        template: error
                    });
                });
                
            }, 500);

            
        };

        $scope.delBaseline = function(username) {
            // A confirm dialog
            $ionicPopup.confirm({
                title: 'Hapus Baseline',
                template: 'Yakin akan menghapus baseline ' +
                    'untuk user "' + username + '""?'
            }).then(function(res) {
                if (res) {
                    lf.removeItem('baseline:' + username).then(function() {
                        getBaselineAvailable();
                    });
                }
            });
        };

        $scope.delDataKel = function(idrt) {
            // A confirm dialog
            $ionicPopup.confirm({
                title: 'Hapus Data Lokal',
                template: 'Yakin akan menghapus data lokal ' +
                    'untuk ID RT "' + idrt + '""?'
            }).then(function(res) {
                if (res) {
                    lf.removeItem('datakel:' + idrt).then(function() {
                        getDataKelAvailable();
                    });
                }
            });
        };

        /* Backup data */
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        var H = String(today.getHours()).padStart(2, '0');
        var m = String(today.getMinutes()).padStart(2, '0');
        var s = String(today.getSeconds()).padStart(2, '0');

        today = mm + '_' + dd + '_' + yyyy + '_' + H + '_' + m + '_' + s;

        $scope.backup = function() {
            
            // AppService.getLocalforageData().then(function(data) {
            //     data.forEach(function(val,idx){
            //         console.log(val.key); return false;
            //     });
            // });
            

            window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function(dir) {
                console.log("Export: goto sdcard",dir);
                dir.getFile("Backup_data_"+ today +".txt", {create:true}, function(file) {
                    console.log("create file", file);
                    
                    $rootScope.$broadcast('loading:show');
                    $timeout(function() {
                        $rootScope.$broadcast('loading:hide');
                        // ambil data dari localforage
                        AppService.getLocalforageData().then(function(data) {
                            
                            $scope.exportObject = {};
                            $scope.exportObject.backup = data;

                            file.createWriter(function(fileWriter) {
                                // use to append
                                //fileWriter.seek(fileWriter.length);
                                var blob = new Blob([JSON.stringify($scope.exportObject)], {type:'text/plain'});
                                fileWriter.write(blob);
                                console.log("File wrote");
                                
                                $ionicPopup.alert({
                                    title: 'Backup Data',
                                    template: 'Berhasil Backup Data'
                                });

                            }, function(error) {
                                console.log("Error: " + JSON.stringify(error));
                                $ionicPopup.alert({
                                    title: 'Gagal Backup Data',
                                    template: error
                                });
                            });

                        });

                        
                        
                    }, 300);

                });
            });

        };
        /* End of Backup data */

    }
})();
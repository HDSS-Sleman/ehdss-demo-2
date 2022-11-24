(function() {
    angular.module('ehdss')
        .controller('HomeCtrl', HomeCtrl);

    HomeCtrl.$inject = ['$scope', '$state', '$rootScope', 'AppService', '$ionicHistory', '$ionicModal', '$ionicPopup', '$http', '$timeout'];

    function HomeCtrl($scope, $state, $rootScope, AppService, $ionicHistory, $ionicModal, $ionicPopup, $http, $timeout) {

        $rootScope.titleApp = 'eHDSS Sleman';

        $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams, options) {
                if (toState.name === 'app.home') {
                    updateUserList();
                }
            });

        $ionicModal.fromTemplateUrl('info-kel.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });

        // init aplikasi (ambil data-data yg dibutuhkan)
        localforage.getItem('options', function(err, val) {
            if (val) {
                $rootScope.tglWawancara = AppService.stringToDate(val.tglWawancara);
            }
        });

        // Ambil daftar user/enumerator yg tersedia di localStorage
        var updateUserList = function() {
            AppService.getBaselineUsers().then(function(data) {
                $scope.users = data;
            });
        };
        updateUserList();

        $scope.doRefresh = function(username) {
            updateUserList();
            if(username) {
                $scope.listKK(username);
            }
            $scope.$broadcast('scroll.refreshComplete');
        };

        /* mengambil dataKK dg USERNAME yg dipilih */
        $scope.listKK = function(username) { 
            $rootScope.$broadcast('loading:show');
            $rootScope.username = username;
            AppService.getBaselineKel(username).then(function(data) {
                $rootScope.$broadcast('loading:hide');
                $scope.dataKK = data; // dataKK yg diambil dari USERNAME

                $scope.dataKK.forEach(function(val, idx, el) {
                    $scope.dataKK[idx].alamat_home = (val.kl01 || '')+' '+(val.kl02 || '')+' '+(val.kl03 || '')+' RT '+(val.kl05 || '-')+' RW '+(val.kl04 || '-')+' '+(val.kl08 || '');
                });
                // paginasi
                $scope.currentPage = 0;
                $scope.pageSize = 10;
                $scope.numberOfPages=function(){
                    return Math.ceil($scope.dataKK.length/$scope.pageSize);                
                }
            });
        };

        $scope.jmlArtClass = function(jml_art) {
            if (jml_art > 2) {
                return 'ion-ios-people';
            } else if (jml_art > 1) {
                return 'ion-person-stalker';
            } else {
                return 'ion-ios-person';
            }
        };

        $scope.listART = function(username, selectedRT) {
            $rootScope.$broadcast('loading:show');
            $rootScope.username = username;
            $rootScope.dataRT = selectedRT;

            /* masuk modul RT dulu untuk ruta refresh dan pecah*/
            $timeout(function() {
                $rootScope.$broadcast('loading:hide');
                $rootScope.editStatusRT = 'edit';
                $rootScope.curRT = selectedRT;
                $state.go('app.rt');
            }, 1000);
            

        };

        // An alert dialog
        $scope.showAlert = function(title, msg) {
            $ionicPopup.alert({
                title: title || 'Upload Data',
                template: msg || 'Berhasil Menyimpan Data'
            });
        };

        $scope.uploadDataKel = function(username, kel) {
            // A confirm dialog
            var confirmPopup = $ionicPopup.confirm({
                title: 'Upload Data Keluarga',
                template: 'Yakin akan meng-upload data Keluaga berikut ke Server?<br>' +
                    'No. Reg : <b>' + kel.id01 + '</b><br>' +
                    'Nama : <b><span class="nama">' + kel.id04 + '</span></b><br>' +
                    'Alamat: <span class="alamat">' + kel.id23 + '</span>'
            });

            $rootScope.username = username;
            $rootScope.dataRT = kel;

            confirmPopup.then(function(res) {
                if (res) {
                    $rootScope.$broadcast('loading:show');
                    AppService.getDataKel($rootScope.dataRT.idrt).then(function(data) {
                        
                        var obj = {};
                        if(data != ""){
                            data = data;
                            if (data.pb) {obj.pb = data.pb} else {obj.pb = {}}
                        }else{
                            //jika data kosong, data dibuat object supaya bisa diupload
                            data = {}; obj.pb = {};
                        }
                        var postData = {
                            idrt: $rootScope.dataRT.idrt,
                            hash: md5(JSON.stringify(data)),
                            data: data
                        };
                        /*data PB*/
                        var postData_pb = {
                            idrt: $rootScope.dataRT.idrt,
                            hash: md5(JSON.stringify(obj)),
                            data: obj
                        };
                        var config = {
                            headers : {
                                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                            }
                        };
                        /*upload data all*/
                        $http.post($rootScope.serverUrlUpload + '?module=data', postData, config)
                        .then(
                            function successCallback(resp) {
                                $rootScope.$broadcast('loading:hide');
                                if (resp.data.success) {
                                    $scope.showAlert();
                                    // jika upload sukses, kasih tanda ke tombol sudah upload
                                    localforage.setItem('uploadData:'+kel.idrt, {'hash':md5(JSON.stringify(data)), 'upload':'1'});
                                } else {
                                    $scope.showAlert('', resp.data.msg);
                                }
                            },
                            function errorCallback(resp) {
                                $rootScope.$broadcast('loading:hide');
                            });
                        /*upload data Perbaikan Baseline only*/
                        // $http.post($rootScope.serverUrlUpload + '?module=data&method=upload_data_pb', postData_pb, config)
                        // .then(
                        //     function successCallback(resp) {
                        //         $rootScope.$broadcast('loading:hide');
                        //         if (resp.data.success) {
                        //             $scope.showAlert('', resp.data.msg);
                        //         } else {
                        //             $scope.showAlert('', resp.data.msg);
                        //         }
                        //     },
                        //     function errorCallback(resp) {
                        //         $rootScope.$broadcast('loading:hide');
                        //     });
                    });
                } else {
                    $rootScope.$broadcast('loading:hide');
                    // console.log('Upload Canceled');
                }
            });
        };

        $scope.uploadDataKel_VA = function(username, kel) {
            // A confirm dialog
            var confirmPopup = $ionicPopup.confirm({
                title: 'Upload Data InterVA',
                template: 'Yakin akan meng-upload data Keluaga berikut ke Server?<br>' +
                    'ID RT : <b>' + kel.idrt + '</b><br>' +
                    'Nama Kepala Keluarga: <b><span class="nama">' + kel.krt01 + '</span></b><br>' +
                    'Alamat: <span class="alamat">' + kel.kl08 + '</span>'
            });

            $rootScope.username = username;
            $rootScope.dataRT = kel;

            confirmPopup.then(function(res) {
                if (res) {
                    $rootScope.$broadcast('loading:show');
                    AppService.getDataKel($rootScope.dataRT.idrt).then(function(data) {
                        var obj = {}; //ambil hanya data VA saja dan HT
                        if(data != ""){
                            obj.va = data.va;
                            obj.ht = data.ht;
                        }else{
                            //jika data kosong, data dibuat object supaya bisa diupload jika datakel nya masih kosong
                            obj.va = JSON.parse('{"0":{"va":1}}');
                        }
                        //Data VA
                        var postData_va = {
                            idrt: $rootScope.dataRT.idrt,
                            hash: md5(JSON.stringify(obj)),
                            data: obj
                        };
                        //Data All
                        var postData = {
                            idrt: $rootScope.dataRT.idrt,
                            hash: md5(JSON.stringify(data)),
                            data: data
                        };
                        var config = {
                            headers : {
                                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                            }
                        }
                        
                        //upload data VA Only
                        $http.post($rootScope.serverUrlUpload + '?module=data&method=upload_data_va', postData_va, config)
                        .then(
                            function successCallback(resp) {
                                $rootScope.$broadcast('loading:hide');
                                if (resp.data.success) {
                                    $scope.showAlert('', resp.data.msg);
                                } else {
                                    $scope.showAlert('', resp.data.msg);
                                }
                            },
                            function errorCallback(resp) {
                                $rootScope.$broadcast('loading:hide');
                            });
                        //upload All data
                        $http.post($rootScope.serverUrlUpload + '?module=data', postData, config)
                        .then(
                            function successCallback(resp) {
                                $rootScope.$broadcast('loading:hide');
                                if (resp.data.success) {
                                    $scope.showAlert('', resp.data.msg);
                                } else {
                                    $scope.showAlert('', resp.data.msg);
                                }
                            },
                            function errorCallback(resp) {
                                $rootScope.$broadcast('loading:hide');
                            });
                    });
                } else {
                    $rootScope.$broadcast('loading:hide');
                    // console.log('Upload Canceled');
                }
            });
        };

        $scope.uploadCKE = function(username, kel) {
            // A confirm dialog
            var confirmPopup = $ionicPopup.confirm({
                title: 'Upload Catatan Kunjungan',
                template: 'Yakin akan meng-upload data kunjungan berikut ke Server?<br>' +
                    'ID RT : <b>' + kel.idrt + '</b><br>'
            });

            confirmPopup.then(function(res) {
                if (res) {
                    $rootScope.$broadcast('loading:show');
                    AppService.getCatatanEnum(kel.idrt).then(function(data) {
                        if (data) {
                            data.enum = username; //untuk menambahkan nama enum ke catatan enum
                            var postData = {
                                idrt: kel.idrt,
                                hash: md5(JSON.stringify(data)),
                                data: data
                            };

                            var config = {
                                headers : {
                                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                                }
                            }
                            $http.post($rootScope.serverUrlUpload + '?module=data&method=upload_catatan_enum', postData, config)
                            .then(
                                function successCallback(resp) {
                                    $rootScope.$broadcast('loading:hide');
                                    if (resp.data.success) {
                                        $scope.showAlert();
                                        // jika upload sukses, kasih tanda ke tombol sudah upload
                                        // data hash tanpa nama enum
                                        var data_hash = data;
                                        delete data_hash.enum;
                                        localforage.setItem('uploadCke:'+kel.idrt, {'hash':md5(JSON.stringify(data_hash)), 'upload':'1'});
                                    } else {
                                        $scope.showAlert('', resp.data.msg);
                                    }
                                },
                                function errorCallback(resp) {
                                    $rootScope.$broadcast('loading:hide');
                            });
                        }else{
                            $scope.showAlert('', 'Belum ada data');
                            $rootScope.$broadcast('loading:hide');
                        }
                            
                    });
                        
                } else {
                    $rootScope.$broadcast('loading:hide');
                    // console.log('Upload Canceled');
                }
            });
        };

        $scope.infoDataKel = function(username, kel) {
            $scope.idrt = kel.idrt;
            $scope.kepala_kel = kel.krt01;
            $rootScope.$broadcast('loading:show');
            $http.get($rootScope.serverUrl + '?module=data&method=info_kel&idrt=' +
            kel.idrt, {timeout:7000}).then(
                function successCallback(resp) {
                    $rootScope.$broadcast('loading:hide');
                    $scope.infoKel = resp.data;
                    $scope.infoKelEmpty = resp.data.length === 0;
                    $scope.modal.show();
                },
                function errorCallback(resp) {
                    $rootScope.$broadcast('loading:hide');
                });

            // get Status Upload data catatan CKE
            $http.get($rootScope.serverUrl + '?module=data&method=statUploadCke&idrt=' +
            $scope.idrt, {timeout:7000}).then(
                function successCallback(resp) {
                    $scope.kosongCke = resp.data.length === 0;
                    $scope.statUploadCke = $scope.kosongCke ? 'Belum upload data catatan enum' : 'Sudah upload data catatan enum';
                },
                function errorCallback(resp) {
                }
            );
        };

        $rootScope.rutaCov = true;

        // tambah ruta baru
        $scope.tambahRT = function(username) {
            $rootScope.username = username;

            $rootScope.editStatusRT = 'new';
            $rootScope.$broadcast('loading:show');
            $timeout(function() {
                $rootScope.$broadcast('loading:hide');
                $state.go('app.rt');
            }, 300);
        };

        // edit tambah ruta baru yg baru ditambahkan
        $scope.edit = function(username, selectedRT) {
            $rootScope.username = username;
            var goto = 'rt',
                editStatus = 'edit';
            $rootScope.curRT = selectedRT;
            $rootScope.$broadcast('loading:show');
            
            $timeout(function() {
                $state.go('app.' + goto);
                $rootScope.editStatusRT = editStatus;
                $rootScope.$broadcast('loading:hide');
            }, 100);
        };
        
        $scope.listSiklus = function(siklus) {
            $rootScope.$broadcast('loading:show');

            var jenis_siklus = {
                s6:false, s7:false, ichc:false,
            };

            $rootScope.j_siklus = {};
            for(var key_siklus in jenis_siklus){
                $rootScope.j_siklus[key_siklus] = (key_siklus == siklus) ? true : false;
            }
            var title_siklus = {s7:"7", ichc:"ICHC"};
            for(var key_title in title_siklus){
                if (key_title == siklus) {
                    $rootScope.t_siklus = title_siklus[key_title];
                }
            }

            $rootScope.titleApp = 'eHDSS Sleman '+$rootScope.t_siklus;
            $rootScope.$broadcast('loading:hide');
        };

        $scope.random = function(idrt){
            $rootScope.$broadcast('loading:show');
            var dt_idrt = {
                "idrt" : idrt
            }
            $rootScope.dataRT = dt_idrt;
            $rootScope.Random = true;
            $rootScope.r_dataArt = [];
            $timeout(function() {
                $state.go('app.art');
                $rootScope.$broadcast('loading:hide');
            }, 100);
        };

        $scope.history = function(){
            $rootScope.$broadcast('loading:show');
            $timeout(function() {
                $state.go('app.hrn');
                $rootScope.$broadcast('loading:hide');
            }, 100);
        };

        // ke ART Temp
        $scope.goArtTemp = function(param) {
            $rootScope.param_temp = param;
            $rootScope.$broadcast('loading:show');
            $timeout(function() {
                $state.go('app.art_temp');
                $rootScope.$broadcast('loading:hide');
            }, 100);
        };

    }
})();

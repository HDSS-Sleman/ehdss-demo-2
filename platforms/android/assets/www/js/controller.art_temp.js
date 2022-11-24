(function() {
    angular.module('ehdss')
        .controller('ArtTempCtrl', ArtTempCtrl);

    ArtTempCtrl.$inject = ['$scope', '$rootScope', '$state', '$ionicModal', 'AppService', '$http','$timeout','$ionicPopup'];

    function ArtTempCtrl($scope, $rootScope, $state, $ionicModal, AppService, $http, $timeout, $ionicPopup) {
        
        /* tampilkan hanya list ART temp saja jika diakses melalui Home */
        if ($rootScope.param_temp == 'only_list') {
            $scope.dataART = '';
        }else{
            AppService.getDataART().then(function(data) {
                $scope.dataART = data.filter(function(item) {
                    return item; // ambil semua ART baik ARTB maupun yg sudah tidak ada
                });
                $rootScope.dataART = $scope.dataART;

                // get no urut next ART, dari max no urut +1
                $scope.art00 = AppService.getNextNoUrutARTpecah($rootScope.dataART);

            });
        }

        $rootScope.idart_terpakai; // list idrt yang sudah terpakai di ruta (ambil dari art.js)
        
        
        /* list art temporary yg sudah di pindah*/
        AppService.getlistARTtemp().then(function(data) {
            $scope.listARTtemp = data;
            // paginasi
            $scope.currentPage = 0;
            $scope.pageSize = 10;
            $scope.numberOfPages=function(){
                return Math.ceil($scope.listARTtemp.length/$scope.pageSize);                
            }
        });
        
        /*Ganti alur
        Masukkan ART ke temp data dulu, baru diambil oleh RUTA Baru*/
        $scope.pindah = function(art){
            // pindah art ke temp
            AppService.moveARTtoTemp(art).then(function(data) {
                if (data.success) {
                    $ionicPopup.alert({
                        title: 'Pindah ART',
                        template: data.msg
                    });
                     $timeout(function() {
                            $state.go('app.art');
                        }, 300);
                }else{
                    $ionicPopup.alert({
                        title: 'Gabung ART',
                        template: data.msg
                    });
                    $timeout(function() {
                            $state.go('app.art');
                        }, 300);
                }
                
            });
        }

        var initModal = function() {
            $scope.temp_data = true;
        };
        $ionicModal.fromTemplateUrl('templates/art_temp-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function() {
            initModal();
            $scope.modal.show();
        };

        $scope.listARTAvailable = function(noIDART){
            $rootScope.$broadcast('loading:show');
            AppService.getARTtemp(noIDART).then(function(data) {
                $scope.ARTAvailable = []; // dataKK yg diambil dari USERNAME
                if (data && JSON.stringify(data) === JSON.stringify({})) {
                    $rootScope.$broadcast('loading:hide');
                }else{
                    $scope.ARTAvailable.push(data);
                    $rootScope.$broadcast('loading:hide');
                }
            });
        }

        $scope.addARTtoRT = function(idart){
            $rootScope.$broadcast('loading:show');
            var toIDRT = $rootScope.dataRT.idrt;
            AppService.changeDataART(idart, toIDRT, $scope.art00).then(function(data) {
                $timeout(function() {
                    if (data.success) {
                        $ionicPopup.alert({
                            title: 'Gabung ART',
                            template: data.msg
                        });
                    }
                    $rootScope.$broadcast('loading:hide');
                }, 500);
                $scope.modal.hide();
                /* goto art */
                $timeout(function() {
                    $state.go('app.art');
                }, 1000);
            });
        }

        $scope.selesai = function() {
            $rootScope.$broadcast('loading:show');
            $timeout(function() {
                $rootScope.$broadcast('loading:hide');
                $state.go('app.art');
            }, 300);
        };

        $scope.uploadARTtemp = function(art, username) {
            // A confirm dialog
            var confirmPopup = $ionicPopup.confirm({
                title: 'Upload Data ART Pecah/Gabung',
                template: 'Yakin akan meng-upload data ART berikut ke Server?<br>' +
                    'ID ART : <b>' + art.idart + '</b><br>'+
                    'Enum : <b>' + username + '</b>'
            });

            confirmPopup.then(function(res) {
                if (res) {
                    $rootScope.$broadcast('loading:show');
                    AppService.getARTtemp(art.idart).then(function(data) {
                        if (data) {
                            delete data._noArt;
                            delete data._nama;
                            delete data._tglLahir;
                            delete data.umur;
                            delete data.idSedangHamil;
                            delete data.sedangHamil;
                            delete data.statusKawin;
                            delete data.idStatusKawin;
                            delete data.statusIkutSerta;
                        }
                        if (data.part) {
                            delete data.part;
                        }

                        data.enum = username; //untuk menambahkan nama enum ke data
                        var postData = {
                            idart: art.idart,
                            hash: md5(JSON.stringify(data)),
                            data: data
                        };
                        var config = {
                            headers : {
                                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                            }
                        }
                        
                        $http.post($rootScope.serverUrlUpload + '?module=data&method=upload_pecah_gabung', postData, config)
                        .then(
                            function successCallback(resp) {
                                $rootScope.$broadcast('loading:hide');
                                if (resp.data.success) {
                                    $scope.showAlert();
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

        // An alert dialog
        $scope.showAlert = function(title, msg) {
            $ionicPopup.alert({
                title: title || 'Upload Data',
                template: msg || 'Berhasil Menyimpan Data'
            });
        };
    }
})();
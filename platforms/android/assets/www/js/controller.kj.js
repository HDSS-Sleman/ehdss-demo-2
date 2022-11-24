(function() {
    angular.module('ehdss')
        .controller('KjCtrl', KjCtrl);

    KjCtrl.$inject = ['$scope', '$rootScope', '$state', '$ionicModal', '$window', '$ionicLoading', '$timeout', 'AppService', '$ionicPopup'];

    function KjCtrl($scope, $rootScope, $state, $ionicModal, $window, $ionicLoading, $timeout, AppService, $ionicPopup) {

        $scope.kj = $rootScope.dataRT.kj || {};
        $scope.idrt = $rootScope.dataRT.idrt || {}; 

        // reset dulu ke empty object
        // $scope.kj = {};
        AppService.getDataART().then(function(data) {
            $scope.dataART = data.filter(function(item) {
                return !item.artTdkAda;
            });
        });
        /* set value default modul*/
        $scope.Kj01 = true;
        /* set value default modal*/
        $scope.tipeModal = {
            modalKj01: false
        };

        $scope.Kj05items = {
            1: 'Sering lupa',
            2: 'Tidak mampu membeli obat secara rutin',
            3: 'Obat tidak tersedia di fasilitas pelayanan kesehatan ',
            4: 'Tidak rutin berobat ke fasilitas pelayanan kesehatan',
            5: 'Tidak tahan efek samping obat',
            6: 'Merasa dosis tidak sesuai',
            7: 'Merasa sudah sehat/tidak merasa sakit',
            95: 'Lainnya, sebutkan',
            98: 'Tidak Tahu'
        };

        // apakah form di modal di save ?
        var modalSaved = false;
        // simpan variabel terakhir yg tersimpan
        var lastKj = angular.copy($scope.kj);

        $scope.go = function(toMenu, curMenu) {
            $scope.save().then(function() {
                $scope[toMenu] = true;
                $scope[curMenu] = false;
                lastKj = angular.copy($scope.kj);
            });
        };

        // Display/Tidak Tombol simpan
        $scope.KjAllowSave = function() {
            var kj = $scope.kj,
                // kj01 harus terisi
                kj01 = kj.kj01, kj01z = false;

            if (kj.kj01 == 2 || kj.kj01 == 98) {
                return true
            }
            if (kj.kj01 == '1') {
                $scope.dataART.forEach(function(d) {
                    // harus diisi semua agar true
                    kj01 = kj01 && kj.kj01ls && kj.kj01ls[d.idart];
                });
                // harus ada salah satu yg nilainya = 1
                $scope.dataART.forEach(function(d) {
                    kj01z = kj01z || (kj.kj01ls && kj.kj01ls[d.idart] == 1);
                });
                kj01 = kj01 && kj01z;
            }

            return kj01;
        };

        $scope.modalAllowSave = function() {
            var kj = $scope.kj,
                allow = true;
            var idart = $scope.idart;

            if ($scope.tipeModal.modalKj01 == true) {
                allow = allow && (kj.kj02a && kj.kj02a[idart]) && (kj.kj06a && kj.kj06a[idart]);
                        if (kj.kj02a && kj.kj02a[idart] == 1) {
                            allow = allow && kj.kj03 && kj.kj03[idart];
                            if (kj.kj03 && kj.kj03[idart] == 1) { //jika Menerima perawatan
                                allow = allow && (kj.kj04 && kj.kj04[idart]);
                                if ((kj.kj04 && kj.kj04[idart] == 2) || (kj.kj04 && kj.kj04[idart] == 98)) {
                                    allow = allow && (kj.kj05 && kj.kj05[idart]); //alasan tidak minum obat
                                    if (kj.kj05 && kj.kj05[idart] == 95) {
                                        allow = allow && (kj.kj05b && kj.kj05b[idart]); //alasan tidak minum obat rutin lainnya
                                    }
                                }
                            }
                        }
                        
                        if (kj.kj06a && kj.kj06a[idart] == 1) {
                            allow = allow && (kj.kj07a && kj.kj07a[idart]);
                        }
            }

            return allow;
        };

        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
            if (!modalSaved) {
                $scope.kj = angular.copy(lastKj);
            }
        });

        //controller modal
        $ionicModal.fromTemplateUrl('templates/kj-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });

        $scope.openModal = function(open, art, tipe) {
            /* set default value kj */
            if (!$scope.kj.kj) {
                $scope.kj.kj = {};
            }
            if (open == 1) {
                $scope.kj.kj[art.idart] = 1;
            }else{
                if ($scope.kj.kj[art.idart] == 1) {
                    $scope.kj.kj[art.idart] = 1;
                }else{
                    $scope.kj.kj[art.idart] = 0;
                }
            }
            
            // tutup modal selain modal yg dibuka
            for (var key in $scope.tipeModal) {
                if (key == tipe) {
                    $scope.tipeModal[key] = true;
                }else{
                    $scope.tipeModal[key] = false;
                }
            }
            $scope.nama = art._nama;
            $scope.umur = art.umur;
            $scope.jk = art._jk;
            $scope.idart = art.idart;
            if (open == 1) {
                modalSaved = false;
                $scope.modal.show();
            }
        };

        $scope.defkj = function(val,idart){
            /* set default value kj */
            if (!$scope.kj.kj) {
                $scope.kj.kj = {};
            }
            if (val == 1) {
                $scope.kj.kj[idart] = 1;
            }else{
                if ($scope.kj.kj[idart] == 1) {
                    $scope.kj.kj[idart] = 1;
                }else{
                    $scope.kj.kj[idart] = 0;
                }
            }
            
        };

        $scope.save = function(finish) {
            // AppService.saveCatatanKelompok('utama',$scope.idrt);
            var goTo = finish ? 'app.krp' : ''; //setelah KJ ke KRP

            // simpan model, termasuk yg hidden dg ng-show, exclude hidden dg ng-if
            return AppService.saveDataKelMasked('kj', $scope.kj, true, goTo);
        };

        //Contoh pengambilan data (nama bisa diganti dengan id yg unik)
        $scope.saveModal = function(kj, nama) {
            // simpan model, termasuk yg hidden dg ng-show, exclude hidden dg ng-if
            AppService.saveDataKelMasked('kj', $scope.kj, true, 'app.kj').then(function() {
                modalSaved = true;
                lastKj = angular.copy($scope.kj);
                $scope.modal.hide();
            });

        };
    }
})();

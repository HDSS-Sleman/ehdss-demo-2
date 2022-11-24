(function() {
    angular.module('ehdss')
        .controller('KrpCtrl', KrpCtrl);

    KrpCtrl.$inject = ['$scope', '$state', '$rootScope', '$timeout', '$ionicModal', 'AppService', '$document'];

    function KrpCtrl($scope, $state, $rootScope, $timeout, $ionicModal, AppService, $document) {
        // untuk menyimpan data KRP
        $scope.krp = $rootScope.dataRT.krp || {};
        $scope.idrt = $rootScope.dataRT.idrt || {};
        
        // KRP hanya mengambil yg umurnya 15-49 tahun
        // dan ART masih ada (tidak meninggal ata migrasi)
        var refreshDataART = function() {
            AppService.getDataART().then(function(data) {
                $scope.dataART = data.filter(function(item) {
                    var umur = parseInt(item.umur);
                    // kondisi yg harus terpenuhi jika KRP siklus 6 birt_his, usia 15-49, perempuan, artb, art baru dari RT baru, status menikah: selain yg belum menikah
                    if ($rootScope.j_siklus.s7) {
                        return !item.artTdkAda && 
                        (
                            item.birth_hist == 1 || 
                            (
                                (umur > 14) && 
                                (umur < 50) && 
                                (item._jk == 'P') && 
                                (item.artb == true || item.start_in_wave_art) && 
                                (item.artb07 > 1 || item.art07 > 1)
                            )
                        );
                    }
                
                });
                $scope.krp_terisi = [];
                $scope.dataART.forEach(function(val){
                    if (val.krp) {
                        $scope.krp_terisi.push(val.krp);
                    }
                });
                
            });
        };
        refreshDataART();

        $scope.edit = function(art) {
            $rootScope.curART = art;

            $scope.art = art;
            $scope.art = art;
            $scope.jk = art._jk;
            $scope.ARTBpernahhamil = (art.umur > 14) &&  (art.umur < 50) &&  (art._jk == 'P') &&  (art.artb == true || art.start_in_wave_art) &&  (art.artb07 > 1 || art.art07 > 1) // kriteria untuk ditanyai KRP
            $scope.pertanyaanKB = art.artb07 > 1 || art.art07 > 1; // jika status kawin selain belum menikah

            if (!art.krp) {
                $scope.krp = {};
            } else {
                $scope.krp = art.krp;
            }
            $scope.modal.show();
        };

        // Agar ketika di klik back button (android), modal hidden
        $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            if ($scope.modal && $scope.modal.isShown()) {
                event.preventDefault();
                $scope.modal.hide();
            }
        });

        $ionicModal.fromTemplateUrl('templates/krp-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });

        $scope.krpModalAllowSave = function(art) {
            if (art) {
                var // idart = art.idart,
                // ambil krp untuk current ART // art.krp || 
                krp = $scope.krp || {},
                //default true, karena selainnya sudah dihandle myForm
                isAllow = true;
                $scope.krp.krp = 1;
            }
            
            if ($scope.pernahhamil) {
                isAllow = isAllow && krp.krp01 >= 0 && krp.krp02 >= 0 && krp.krp03 >= 0 && krp.krp04 >= 0 && krp.krp05 >= 0;
            }   

            if ($scope.statusKawinYa) {
                if (krp.krp06 < 3) {
                    isAllow = isAllow; 
                            if ($scope.jk == 'P') {
                                isAllow = krp.krp07a2 && krp.krp07a3 && krp.krp07a4 &&
                                            krp.krp07a5 && krp.krp07a6  && krp.krp07a8 && krp.krp07a9 &&
                                            krp.krp07a10 && krp.krp07a11 && krp.krp07a12 && krp.krp07a13 && krp.krp07a98;
                            }else if($scope.jk == 'L'){
                                isAllow = krp.krp07a1 && krp.krp07a7 && krp.krp07a11 && krp.krp07a12 && krp.krp07a13 && krp.krp07a98;
                            }
                              
                    // Tempat mendapatkan pelayanan KB
                    $scope.tempatPelayananKB = krp.krp07a1 == 1 || krp.krp07a2 == 1 || krp.krp07a3 == 1 || krp.krp07a4 == 1 ||
                               krp.krp07a5 == 1 || krp.krp07a6 == 1 || krp.krp07a7 == 1 || krp.krp07a8 == 1 || 
                               krp.krp07a9 == 1 || krp.krp07a11 == 1;

                    if ($scope.tempatPelayananKB) {
                        // Tempat mendapatkan pelayanan KB
                        isAllow = isAllow && (krp.krp08a1 && krp.krp08a2 && krp.krp08a3 && krp.krp08a4 &&
                            krp.krp08a5 && krp.krp08a6 && krp.krp08a7 && krp.krp08a8 && krp.krp08a9 &&
                            krp.krp08a10 && krp.krp08a11 && krp.krp08a12 && krp.krp08a13 && krp.krp08a14 &&
                            krp.krp08a95 && krp.krp08a98);

                        if (krp.krp08a95 == 1) {
                            isAllow = isAllow && krp.krp08a95l;
                        }
                        // Pemberi Pelayanan KB
                        isAllow = isAllow && (krp.krp09a1 && krp.krp09a2 && krp.krp09a3 && krp.krp09a4 &&
                                  krp.krp09a95 && krp.krp09a98);
                        if (krp.krp09a95 == 1) {
                            isAllow = isAllow && krp.krp09a95a;
                        }
                        // Cara Pembayaran
                        isAllow = isAllow && (krp.krp10a1 && krp.krp10a2 && krp.krp10a3 && krp.krp10a98);
                    }
                }
            }
            
            return isAllow;
        };

        $scope.save = function(param) {
            var clsParent = '.modal ion-content.krp';
            AppService.saveDataKelMasked('krp', $scope.krp, true, 'app.krp', clsParent).then(function() {
                AppService.getDataART().then(function(data) {
                    $rootScope.dataART = data;
                    refreshDataART();
                });
            });
            $scope.modal.hide();
                
        };

        $scope.goto = function(dest) {
            if (dest == 'utama') {
                /* Jika wawancara berhenti di tengah jalan*/
                $rootScope.catatanModulUtama = true; //param untuk catatan modul utama
                $rootScope.catatanModulB = false; //param untuk catatan modul B
                $rootScope.tab_catatan = true; // langsung buka tab catatan
                $rootScope.tab_cover = false; // tab cover di hide dulu
                $state.go('app.art_cover'); // ke laporan waancara utama
            }
            $rootScope.$broadcast('loading:show');
            $timeout(function() {
                $rootScope.$broadcast('loading:hide');
                $state.go('app.' + dest);
            }, 200);
        };
    }
})();
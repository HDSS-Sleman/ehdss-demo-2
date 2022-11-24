(function() {
    angular.module('ehdss')
        .controller('KtlpiCtrl', KtlpiCtrl);

    KtlpiCtrl.$inject = ['$scope', '$state', '$rootScope', '$timeout', 'AppService'];

    function KtlpiCtrl($scope, $state, $rootScope, $timeout, AppService) {      

        $scope.curART = $rootScope.curART;
        $scope.idrt = $scope.curART.idrt || $rootScope.dataRT.idrt;
        $scope.idart = $scope.curART.art03b || $scope.curART.artb03b;
        $scope.curART._nama = $scope.curART.art01;
        $scope.ktlpi = {};

        $scope.tab_konfirmasi = $scope.tab_konfirmasi_individu || false;
        $scope.tab_laporan = $scope.tab_laporan_individu || false;

        AppService.getDataKel($scope.idrt, 'ktlpi', $scope.idart).then(function(data) {
            $scope.ktlpi = data || {};
            AppService.getLaporanTelepon($rootScope.dataRT.idrt).then(function(ktlp) {
                $scope.ktlpi.ktlpi00 = $scope.ktlpi.ktlpi00 || ktlp.ktlp00;
            });
        });

        AppService.getTglWawancaraPlusSatu(true).then(function(val) {
            $scope.tglMaxEntry = val;
        })

        $scope.konfirmasiAllowSave = function(myForm) {
            var ktlpi = $scope.ktlpi;
            var allow = ktlpi.ktlpi00 && ktlpi.ktlpi01; // catat no kontak & tanyakan keikutsertaan
                if (ktlpi.ktlpi01 == 2) {
                    allow = allow && ktlpi.ktlpi02 && ktlpi.ktlpi03; // tanggal & jam jika janjian
                }

            return allow && myForm.$valid;
        };

        $scope.laporanAllowSave = function(){
            var ktlpi = $scope.ktlpi;
            var allow = ktlpi.ltlpi00;
                if (ktlpi.ltlpi00 == 1) {
                    allow = allow && ktlpi.ltlpi1a && ktlpi.ltlpi1b && ktlpi.ltlpi1c && ktlpi.ltlpi1d && ktlpi.ltlpi1g;
                            if (ktlpi.ltlpi1d == 2) {
                                allow = allow && ktlpi.ltlpi1e && ktlpi.ltlpi1f;
                            }
                }
                if (ktlpi.ltlpi00 == 2) {
                    allow = allow && ktlpi.ltlpi2a && ktlpi.ltlpi2b && ktlpi.ltlpi2c && ktlpi.ltlpi2d && ktlpi.ltlpi2g;
                            if (ktlpi.ltlpi2d == 2) {
                                allow = allow && ktlpi.ltlpi2e && ktlpi.ltlpi2f;
                            }
                }
                if (ktlpi.ltlpi00 == 3) {
                    allow = allow && ktlpi.ltlpi3a && ktlpi.ltlpi3b && ktlpi.ltlpi3c && ktlpi.ltlpi3d && ktlpi.ltlpi3g;
                            if (ktlpi.ltlpi3d == 2) {
                                allow = allow && ktlpi.ltlpi3e && ktlpi.ltlpi3f;
                            }
                }
                if (ktlpi.ltlpi00 == 4) {
                    allow = allow && ktlpi.ltlpi4a && ktlpi.ltlpi4b && ktlpi.ltlpi4c && ktlpi.ltlpi4d && ktlpi.ltlpi4g;
                            if (ktlpi.ltlpi4d == 2) {
                                allow = allow && ktlpi.ltlpi4e && ktlpi.ltlpi4f;
                            }
                }
                if (ktlpi.ltlpi00 == 5) {
                    allow = allow && ktlpi.ltlpi5a && ktlpi.ltlpi5b && ktlpi.ltlpi5c && ktlpi.ltlpi5d && ktlpi.ltlpi5g;
                            if (ktlpi.ltlpi5d == 2) {
                                allow = allow && ktlpi.ltlpi5e && ktlpi.ltlpi5f;
                            }
                }
            return allow;
        }

        $scope.save = function(curMenu, toMenu, ktlpi) {
            $rootScope.$broadcast('saving:show');
            AppService.saveDataKel('ktlpi', ktlpi).then(function(data) {
                $rootScope.$broadcast('saving:hide');
                $rootScope.$broadcast('loading:show');

                $timeout(function() {
                    $rootScope.$broadcast('loading:hide');
                    if(curMenu == 'kontak' && toMenu == 'icfti'){ // Ya, bersedia langsung wawancara
                        $state.go('app.icfti');
                    }else if(curMenu == 'kontak' && toMenu == 'janjian'){ // Ya, bersedia janjian
                        $state.go('app.art');
                    }else if(curMenu == 'kontak' && toMenu == 'gagal'){ // gagal 
                        $state.go('app.art');
                    }else if (curMenu == 'laporan' && toMenu == 'art') { // reward
                        $scope.tab_laporan = false;
                        $state.go('app.art');
                    }else{
                        $scope[curMenu] = false;
                        $scope[toMenu] = true;
                    }
                }, 300);
            });
        };
    }
})();
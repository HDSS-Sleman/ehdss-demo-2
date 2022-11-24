(function() {
    angular.module('ehdss')
        .controller('AksiCtrl', AksiCtrl);

    AksiCtrl.$inject = ['$scope', '$state', '$rootScope', '$timeout', 'AppService'];

    function AksiCtrl($scope, $state, $rootScope, $timeout, AppService) {      

        $scope.curART = $rootScope.curART;
        $scope.idrt = $scope.curART.idrt || $rootScope.dataRT.idrt;
        $scope.idart = $scope.curART.art03b || $scope.curART.artb03b;
        $scope.curART._nama = $scope.curART.art01;
        $scope.aksi = {};

        AppService.getDataKel($scope.idrt, 'aksi', $scope.idart).then(function(data) {
            $scope.aksi = data || {};

            // recall data asuransi PART 
            AppService.getDataKel($scope.idrt, 'part', $scope.idart).then(function(data_part) {

                AppService.getDataKel($scope.idrt, 'art_kart', $scope.idart).then(function(data_art_kart) {
                    $scope.aksi.aks7cov03_1 = $scope.aksi.aks7cov03_1 || data_part.part2201 || data_art_kart.art20_01;
                    $scope.aksi.aks7cov03_2 = $scope.aksi.aks7cov03_2 || data_part.part2202 || data_art_kart.art20_02;
                    $scope.aksi.aks7cov03_3 = $scope.aksi.aks7cov03_3 || data_part.part2203 || data_art_kart.art20_03;
                    $scope.aksi.aks7cov03_4 = $scope.aksi.aks7cov03_4 || data_part.part2204 || data_art_kart.art20_04;
                    $scope.aksi.aks7cov03_5 = $scope.aksi.aks7cov03_5 || data_part.part2205 || data_art_kart.art20_05;
                    $scope.aksi.aks7cov03_6 = $scope.aksi.aks7cov03_6 || data_part.part2206 || data_art_kart.art20_06;
                    $scope.aksi.aks7cov03_7 = $scope.aksi.aks7cov03_7 || data_part.part2207 || data_art_kart.art20_07;
                    $scope.aksi.aks7cov03_8 = $scope.aksi.aks7cov03_8 || data_part.part2208 || data_art_kart.art20_08;
                    $scope.aksi.aks7cov03_9 = $scope.aksi.aks7cov03_9 || data_part.part2209 || data_art_kart.art20_09;
                    $scope.aksi.aks7cov03_10 = $scope.aksi.aks7cov03_10 || data_part.part2210 || data_art_kart.art20_10;
                    $scope.aksi.aks7cov03_11 = $scope.aksi.aks7cov03_11 || data_part.part2211 || data_art_kart.art20_11;
                });

            });
        });

        AppService.getTglWawancaraPlusSatu(true).then(function(val) {
            $scope.tglMaxEntry = val;
        })

        $scope.cekJKN = function(param){
            if (param == 'akscov03_1') {
                $scope.aksi.aks7cov03_2 = '2'; $scope.aksi.aks7cov03_3 = '2'; $scope.aksi.aks7cov03_4 = '2'; $scope.aksi.aks7cov03_5 = '2';
            }else  if (param == 'akscov03_2') {
                $scope.aksi.aks7cov03_1 = '2'; $scope.aksi.aks7cov03_3 = '2'; $scope.aksi.aks7cov03_4 = '2'; $scope.aksi.aks7cov03_5 = '2';
            }else if (param == 'akscov03_3') {
                $scope.aksi.aks7cov03_1 = '2'; $scope.aksi.aks7cov03_2 = '2'; $scope.aksi.aks7cov03_4 = '2'; $scope.aksi.aks7cov03_5 = '2';
            }else if (param == 'akscov03_4') {
                $scope.aksi.aks7cov03_1 = '2'; $scope.aksi.aks7cov03_2 = '2'; $scope.aksi.aks7cov03_3 = '2'; $scope.aksi.aks7cov03_5 = '2';
            }else if (param == 'akscov03_5' == 1) {
                $scope.aksi.aks7cov03_1 = '2'; $scope.aksi.aks7cov03_2 = '2'; $scope.aksi.aks7cov03_3 = '2'; $scope.aksi.aks7cov03_4 = '2';
            }
        }

        $scope.save = function(param) {

            if (param == 'individu') {
                /* Jika wawancara berhenti di tengah jalan*/
                $rootScope.catatanModulUtama = false; $rootScope.catatanModulB = true;
                $rootScope.tab_catatan = true; // langsung buka tab catatan
                $rootScope.tab_cover = false; // tab cover di hide dulu
                var goTo = 'app.art_cover';
            }else{
                var goTo = 'app.vac';
            }

            $scope.aksi.aksi = 1;
            $rootScope.$broadcast('saving:show');
            AppService.saveDataKel('aksi', $scope.aksi).then(function(data) {
                $rootScope.$broadcast('saving:hide');
                $rootScope.$broadcast('loading:show');
                $timeout(function() {
                    $rootScope.$broadcast('loading:hide');
                        $state.go(goTo);
                }, 300);
            });
        };

        $scope.allowSave = function(myForm) {
            var aksi = $scope.aksi;
            var allow = aksi.aks7cov01;
                        if (aksi.aks7cov01 == 1) {
                            allow = allow && aksi.aks7cov02 && aksi.aks7cov05 && aksi.aks7cov07 && aksi.aks7cov09 && aksi.aks7cov11;
                                    
                                    if (aksi.aks7cov02 == 95) {
                                        allow = allow && aksi.aks7cov02_95a;
                                    }

                                    if (aksi.aks7cov02 != 13) { // jika pergi berobat
                                        allow = allow && aksi.aks7cov03_1 && aksi.aks7cov03_2 && aksi.aks7cov03_3 && 
                                                aksi.aks7cov03_4 && aksi.aks7cov03_5 && aksi.aks7cov03_6 && aksi.aks7cov03_7 && aksi.aks7cov03_8 && 
                                                aksi.aks7cov03_9 && aksi.aks7cov03_10 && aksi.aks7cov03_11 && aksi.aks7cov03_12 && aksi.aks7cov03_95;
                                                if (aksi.aks7cov03_95 == 1) {
                                                    allow = allow && aksi.aks7cov03_95a;
                                                }
                                    }

                                    if (aksi.aks7cov02 == 13) { // jika tidak pergi berobat
                                        allow = allow && aksi.aks7cov04_1 && aksi.aks7cov04_2 && aksi.aks7cov04_3 && 
                                                aksi.aks7cov04_4 && aksi.aks7cov04_5 && aksi.aks7cov04_6 && aksi.aks7cov04_95;
                                                if (aksi.aks7cov04_95 == 1) {
                                                    allow = allow && aksi.aks7cov04_95a;
                                                }
                                    }

                                    if (aksi.aks7cov05 == 1) { // Jika menggunakan fasilitas konsultasi kesehatan online
                                        allow = allow && aksi.aks7cov06_1 && aksi.aks7cov06_2 && aksi.aks7cov06_3 && aksi.aks7cov06_4 && aksi.aks7cov06_5 && aksi.aks7cov06_95;
                                                if (aksi.aks7cov06_95 == 1) {
                                                    allow = allow && aksi.aks7cov06_95a;
                                                }
                                    }

                                    if (aksi.aks7cov05 == 2) { // Jika tidak menggunakan fasilitas konsultasi kesehatan online
                                        allow = allow && aksi.aks7cov06a;
                                    }

                                    if (aksi.aks7cov07 == 1) { // jika Pengobatan alternatif lain
                                        allow = allow && aksi.aks7cov08;
                                        if (aksi.aks7cov08 == 95) {
                                            allow = allow && aksi.aks7cov08_95a;
                                        }
                                    }

                                    if (aksi.aks7cov09 == 1) { // jika menunda/mengurungkan mendapatkan pelayanan kesehatan karena wabah COVID-19
                                        allow = allow && aksi.aks7cov10_1 && aksi.aks7cov10_2 && aksi.aks7cov10_3 && aksi.aks7cov10_4 &&
                                                        aksi.aks7cov10_5 && aksi.aks7cov10_6 && aksi.aks7cov10_7 && aksi.aks7cov10_8 &&
                                                        aksi.aks7cov10_9;
                                    }

                                    if (aksi.aks7cov11 == 1) {
                                        allow = allow && aksi.aks7cov12_1 && aksi.aks7cov12_2 && aksi.aks7cov12_3 && aksi.aks7cov12_4 &&
                                                        aksi.aks7cov12_5 && aksi.aks7cov12_6 && aksi.aks7cov12_7 && aksi.aks7cov12_8 &&
                                                        aksi.aks7cov12_9;
                                    }

                                        
                        }

            return allow && myForm.$valid;
        };
    }
})();
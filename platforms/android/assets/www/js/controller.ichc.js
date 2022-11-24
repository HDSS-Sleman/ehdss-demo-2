(function() {
    angular.module('ehdss')
        .controller('IchcCtrl', IchcCtrl);

    IchcCtrl.$inject = ['$scope', '$state', '$rootScope', '$timeout', 'AppService', '$ionicPopup', '$http'];

    function IchcCtrl($scope, $state, $rootScope, $timeout, AppService, $ionicPopup, $http) {
        
        $scope.ichc = {};
        AppService.getDataART().then(function(data) {
            $scope.dataART = data.filter(function(item) {
                return !item.artTdkAda;
            });
            $scope.ichc = $rootScope.dataRT.ichc || {};
            if ($scope.ichc) {
                $scope.ichc = AppService.deNormalisasiData($scope.ichc);
            }
        });

        // ambil data kabupaten untuk menentukan imunisasi  Polio
        AppService.getCurentRT($rootScope.curRT.idrt).then(function(data2) {
            $scope.rt = data2;
        });

        AppService.getTglWawancaraPlusSatu(true).then(function(val) {
            $scope.tglWawancara = val;
        });

        $scope.penilaian_awal = true;
        $scope.cek_perkembangan = false;
        $scope.antropometri = false;
        $scope.pemeriksaan_klinis = false;
        $scope.hasil_akhir = false;

        $scope.mpAsiList = {
            '1': '1. Karbohidrat (Nasi, Jagung, Kentang, Lainnya)',
            '2': '2. Protein hewani (Daging, Ayam, Ikan, Telur, Lainnya)',
            '3': '3. Protein nabati (kacang-kacangan, Lainnya)',
            '4': '4. Sayuran',
            '5': '5. Buah',
            '6': '6. MP ASI Lainnya',
        }

        $scope.pengasuhList = {
            '1': 'Ibu',
            '2': 'Ayah',
            '3': 'Pengasuh',
        }

        $scope.epaList = {
            '1': 'Imunisasi ',
            '2': 'Nutrisi ',
            '3': 'Pengasuhan/Lingkungan',
        }

        $scope.perkembanganList = {
            '1': '1. Apakah bayi dapat mengikuti gerakan anda dengan menggerakkan kepala sepenuhnya dari satu sisi ke sisi yang lain?',
            '2': '2. Apakah bayi dapat mengangkat kepalanya dengan kuat?',
            '3': '3. Ketika bayi telungkup di atas alas datar, apakah ia dapat mengangkat dada dengan kedua lengannya sebagai penyangga?',
            '4': '4. Apakah bayi dapat mempertahankan posisi kepala dalam keadaan tegak dan stabil?',
            '5': '5. Apakah bayi dapat menggenggam sebuah pensil untuk selama beberapa detik?',
            '6': '6. Apakah bayi dapat mengarahkan matanya pada benda kecil?',
            '7': '7. Apakah bayi dapat meraih sebuah mainan yang diletakkan agak jauh di depannya namun masih dalam jangkauan tangannya?',
            '8': '8. Apakah bayi pernah mengeluarkan suara gembira bernada tinggi atau memekik tetapi bukan menangis?',
            '9': '9. Apakah bayi pernah berbalik paling sedikit dua kali, dari terlentang ke telungkup atau sebaliknya?',
            '10': '10. Apakah bayi pernah tersenyum ketika melihat mainan yang lucu, gambar atau binatang peliharaan pada saat ia bermain sendiri?',
        }

        $scope.antropometriList = {
            'a': 'Saat lahir ',
            'b': '1 bulan ',
            'c': '2 bulan',
            'd': '3 bulan',
            'e': '4 bulan',
            'f': '5 bulan',
            'g': '6 bulan',
        }

        $scope.penilaianAllowSave = function() {
            var ichc = $scope.ichc;
            allow = ichc.ichc1_1a && ichc.ichc1_1b && (ichc.ichc1_1c || ichc.ichc1_1d) && ichc.ichc1_1e &&
                    ichc.ichc1_2a && ichc.ichc1_2b && ichc.ichc1_2e && ichc.ichc1_2f >= 0 && ichc.ichc1_2g &&
                    ichc.ichc1_3a >= 0 && ichc.ichc1_3b >= 0 && ichc.ichc1_3c && ichc.ichc1_3d &&
                    ichc.ichc1_3e >= 0 && ichc.ichc1_3f >= 0 && ichc.ichc1_3g >= 0 && ichc.ichc1_3h >= 0 && 
                    ichc.ichc1_3i >= 0 && ichc.ichc1_eva;

                    if (ichc.ichc1_2b == 0 || ichc.ichc1_2b == 1) { // jika diberi MP ASI
                        allow = allow && ichc.ichc1_2c && ichc.ichc1_2d && ichc.ichc1_2h;
                                  
                            if (ichc.ichc1_2d == 1) { // jika ada mp-asi
                                allow = allow && ichc.ichc1_2d1 >= 0 && ichc.ichc1_2d2 >= 0 && ichc.ichc1_2d3 >= 0 &&
                                        ichc.ichc1_2d4 >= 0&& ichc.ichc1_2d5 >= 0 && ichc.ichc1_2d6 >= 0;

                                    if (ichc.ichc1_2d6 == 1) { // MP ASI lainnya
                                        allow = allow && ichc.ichc1_2d6a;
                                    }
                            }
                    }

                    if (ichc.ichc1_2e == 1) { // jika diberi Vitamin A
                        allow = allow && ichc.ichc1_2e1;
                    }

                    if (ichc.ichc1_3c == 4) { // jika pengasuh lain
                        allow = allow && ichc.ichc1_3ca;
                    }

                    if (ichc.ichc1_3f == 1) { // jika merokok
                        allow = allow && ichc.ichc1_3fa;
                    }

                    if (ichc.ichc1_eva == 2) { // jika ada tindak lanjut
                        allow = allow && ichc.ichc1_eva1 && ichc.ichc1_eva2 && ichc.ichc1_eva3;
                    }

            return allow;
        };

        $scope.perkembanganAllowSave = function() {
            var ichc = $scope.ichc;
            allow = ichc.ichc2_1 >= 0 && ichc.ichc2_2 >= 0 && ichc.ichc2_3 >= 0 && ichc.ichc2_4 >= 0 && 
                    ichc.ichc2_5 >= 0 && ichc.ichc2_6 >= 0 && ichc.ichc2_7 >= 0 && ichc.ichc2_8 >= 0 && 
                    ichc.ichc2_9 >= 0 && ichc.ichc2_10 >= 0;

            return allow;
        }

        $scope.antropometriAllowSave = function(formAntropometri) {
            var ichc = $scope.ichc;
            allow = ichc.ichc3_a1 && ichc.ichc3_a2 && ichc.ichc3_a3 && ichc.ichc3_a4 &&
                    ichc.ichc3_b1 && ichc.ichc3_b2 && ichc.ichc3_b3 && ichc.ichc3_b4 &&
                    ichc.ichc3_c1 && ichc.ichc3_c2 && ichc.ichc3_c3 && ichc.ichc3_c4 &&
                    ichc.ichc3_d1 && ichc.ichc3_d2 && ichc.ichc3_d3 && ichc.ichc3_d4 &&
                    ichc.ichc3_e1 && ichc.ichc3_e2 && ichc.ichc3_e3 && ichc.ichc3_e4 &&
                    ichc.ichc3_f1 && ichc.ichc3_f2 && ichc.ichc3_f3 && ichc.ichc3_f4 &&
                    ichc.ichc3_g1 && ichc.ichc3_g2 && ichc.ichc3_g3 && ichc.ichc3_g4 &&
                    ichc.ichc3_eva;

                    if (ichc.ichc3_eva == 2) {
                        allow = allow && ichc.ichc3_eva1 >= 0;
                        if (ichc.ichc3_eva1 == 2) {
                            allow = allow && ichc.ichc3_eva2;
                        }
                    }

            return allow && formAntropometri.$valid;
        }

        $scope.klinisAllowSave = function() {
            var ichc = $scope.ichc;
            allow = ichc.ichc4_1 >= 0 && ichc.ichc4_2 >= 0 && ichc.ichc4_3 >= 0 && ichc.ichc4_4 >= 0 && 
                    ichc.ichc4_5 >= 0 && ichc.ichc4_6 >= 0 && ichc.ichc4_7 >= 0 && ichc.ichc4_8 >= 0 && 
                    ichc.ichc4_9 >= 0 && ichc.ichc4_10 >= 0 && ichc.ichc4_11 >= 0 && ichc.ichc4_eva;

                    // if (ichc.ichc4_1 == 2) {
                    //     allow = allow && ichc.ichc4_1a;
                    //     if (ichc.ichc4_1a == 95) {
                    //         allow = allow && ichc.ichc4_1b;
                    //     }
                    // }

                    // if (ichc.ichc4_2 == 2) {
                    //     allow = allow && ichc.ichc4_2a;
                    //     if (ichc.ichc4_2a == 95) {
                    //         allow = allow && ichc.ichc4_2b;
                    //     }
                    // }

                    // if (ichc.ichc4_3 == 2) {
                    //     allow = allow && ichc.ichc4_3a;
                    //     if (ichc.ichc4_3a == 95) {
                    //         allow = allow && ichc.ichc4_3b;
                    //     }
                    // }

                    // if (ichc.ichc4_4 == 2) {
                    //     allow = allow && ichc.ichc4_4a;
                    //     if (ichc.ichc4_4a == 95) {
                    //         allow = allow && ichc.ichc4_4b;
                    //     }
                    // }

                    // if (ichc.ichc4_5 == 2) {
                    //     allow = allow && ichc.ichc4_5a;
                    //     if (ichc.ichc4_5a == 95) {
                    //         allow = allow && ichc.ichc4_5b;
                    //     }
                    // }

                    // if (ichc.ichc4_6 == 2) {
                    //     allow = allow && ichc.ichc4_6a;
                    //     if (ichc.ichc4_6a == 95) {
                    //         allow = allow && ichc.ichc4_6b;
                    //     }
                    // }

                    // if (ichc.ichc4_7 == 2) {
                    //     allow = allow && ichc.ichc4_7a;
                    //     if (ichc.ichc4_7a == 95) {
                    //         allow = allow && ichc.ichc4_7b;
                    //     }
                    // }

                    // if (ichc.ichc4_8 == 2) {
                    //     allow = allow && ichc.ichc4_8a;
                    //     if (ichc.ichc4_8a == 95) {
                    //         allow = allow && ichc.ichc4_8b;
                    //     }
                    // }

                    // if (ichc.ichc4_9 == 2) {
                    //     allow = allow && ichc.ichc4_9a;
                    //     if (ichc.ichc4_9a == 95) {
                    //         allow = allow && ichc.ichc4_9b;
                    //     }
                    // }

                    // if (ichc.ichc4_10 == 2) {
                    //     allow = allow && ichc.ichc4_10a;
                    //     if (ichc.ichc4_10a == 95) {
                    //         allow = allow && ichc.ichc4_10b;
                    //     }
                    // }

                    // if (ichc.ichc4_11 == 2) {
                    //     allow = allow && ichc.ichc4_11a;
                    //     if (ichc.ichc4_11a == 95) {
                    //         allow = allow && ichc.ichc4_11b;
                    //     }
                    // }

                    if (ichc.ichc4_eva == 2) {
                        allow = allow && ichc.ichc4_eva1 >= 0;
                            if (ichc.ichc4_eva1 == 2) {
                                allow = allow && ichc.ichc4_eva2;
                            }
                    }

            return allow;
        }

        $scope.hasilAkhirAllowSave = function() {
            var ichc = $scope.ichc;
            allow = ichc.ichc5;

                    if (ichc.ichc5 == 2) {
                        // kunjungan rumah
                        allow = allow && ichc.ichc5a >= 0;
                        if (ichc.ichc5a == 1) {
                            allow = allow && ichc.ichc5a1;
                        }
                        
                        // kunjungan puskesmas
                        allow = allow && ichc.ichc5b >= 0;
                        if (ichc.ichc5b == 1) {
                            allow = allow && ichc.ichc5b1;
                        }

                        // kunjungan lainnya
                        allow = allow && ichc.ichc5e >= 0;
                        if (ichc.ichc5e == 1) {
                            allow = allow && ichc.ichc5e1;
                        }  
                    }

                    if (ichc.ichc5 == 3) {
                        allow = allow && ichc.ichc5c && ichc.ichc5d;
                    }

            return allow;
        }        
        

        // Skor
        $scope.skor = function(){
            
            if ($scope.ichc.ichc2_1 == 1) { var ichc2_1 = parseInt($scope.ichc.ichc2_1); } else { var ichc2_1 = 0 }
            if ($scope.ichc.ichc2_2 == 1) { var ichc2_2 = parseInt($scope.ichc.ichc2_2); } else { var ichc2_2 = 0 }
            if ($scope.ichc.ichc2_3 == 1) { var ichc2_3 = parseInt($scope.ichc.ichc2_3); } else { var ichc2_3 = 0 }
            if ($scope.ichc.ichc2_4 == 1) { var ichc2_4 = parseInt($scope.ichc.ichc2_4); } else { var ichc2_4 = 0 }
            if ($scope.ichc.ichc2_5 == 1) { var ichc2_5 = parseInt($scope.ichc.ichc2_5); } else { var ichc2_5 = 0 }
            if ($scope.ichc.ichc2_6 == 1) { var ichc2_6 = parseInt($scope.ichc.ichc2_6); } else { var ichc2_6 = 0 }
            if ($scope.ichc.ichc2_7 == 1) { var ichc2_7 = parseInt($scope.ichc.ichc2_7); } else { var ichc2_7 = 0 }
            if ($scope.ichc.ichc2_8 == 1) { var ichc2_8 = parseInt($scope.ichc.ichc2_8); } else { var ichc2_8 = 0 }
            if ($scope.ichc.ichc2_9 == 1) { var ichc2_9 = parseInt($scope.ichc.ichc2_9); } else { var ichc2_9 = 0 }
            if ($scope.ichc.ichc2_10 == 1) { var ichc2_10 = parseInt($scope.ichc.ichc2_10); } else { var ichc2_10 = 0 }            

            var nilai = ichc2_1 + ichc2_2 + ichc2_3 + ichc2_4 + ichc2_5 + ichc2_6 + ichc2_7 + ichc2_8 + ichc2_9 + ichc2_10;

            if (nilai >= 9 && nilai <= 10) {
                $scope.ichc.ichc2_eva = '1';
            } else if (nilai >= 7 && nilai <= 8) {
                $scope.ichc.ichc2_eva = '2';
            } else if (nilai > 0 && nilai <= 6) {
                $scope.ichc.ichc2_eva = '3';
            } else if (nilai == 0) {
                $scope.ichc.ichc2_eva = '0';
            }
        }

        $scope.harusKoma = true;
        $scope.koma = function() {
            var str_a2 = str_b2 = str_c2 = str_d2 = str_e2 = str_f2 = str_g2 = "";
            if ($scope.ichc.ichc3_a2) { var str_a2 = ''+$scope.ichc.ichc3_a2; } 
            if ($scope.ichc.ichc3_b2) { var str_b2 = ''+$scope.ichc.ichc3_b2; } 
            if ($scope.ichc.ichc3_c2) { var str_c2 = ''+$scope.ichc.ichc3_c2; } 
            if ($scope.ichc.ichc3_d2) { var str_d2 = ''+$scope.ichc.ichc3_d2; } 
            if ($scope.ichc.ichc3_e2) { var str_e2 = ''+$scope.ichc.ichc3_e2; } 
            if ($scope.ichc.ichc3_f2) { var str_f2 = ''+$scope.ichc.ichc3_f2; } 
            if ($scope.ichc.ichc3_g2) { var str_g2 = ''+$scope.ichc.ichc3_g2; } 

            $scope.harusKoma2 = str_a2.includes(".") && str_b2.includes(".") && str_c2.includes(".") && str_d2.includes(".") && 
                                str_e2.includes(".") && str_f2.includes(".") && str_g2.includes(".");

            var str_a3 = str_b3 = str_c3 = str_d3 = str_e3 = str_f3 = str_g3 = "";
            if ($scope.ichc.ichc3_a3) { var str_a3 = ''+$scope.ichc.ichc3_a3; } 
            if ($scope.ichc.ichc3_b3) { var str_b3 = ''+$scope.ichc.ichc3_b3; } 
            if ($scope.ichc.ichc3_c3) { var str_c3 = ''+$scope.ichc.ichc3_c3; } 
            if ($scope.ichc.ichc3_d3) { var str_d3 = ''+$scope.ichc.ichc3_d3; } 
            if ($scope.ichc.ichc3_e3) { var str_e3 = ''+$scope.ichc.ichc3_e3; } 
            if ($scope.ichc.ichc3_f3) { var str_f3 = ''+$scope.ichc.ichc3_f3; } 
            if ($scope.ichc.ichc3_g3) { var str_g3 = ''+$scope.ichc.ichc3_g3; } 

            $scope.harusKoma3 = str_a3.includes(".") && str_b3.includes(".") && str_c3.includes(".") && str_d3.includes(".") && 
                                str_e3.includes(".") && str_f3.includes(".") && str_g3.includes(".");

            var str_a4 = str_b4 = str_c4 = str_d4 = str_e4 = str_f4 = str_g4 = "";
            if ($scope.ichc.ichc3_a4) { var str_a4 = ''+$scope.ichc.ichc3_a4; } 
            if ($scope.ichc.ichc3_b4) { var str_b4 = ''+$scope.ichc.ichc3_b4; } 
            if ($scope.ichc.ichc3_c4) { var str_c4 = ''+$scope.ichc.ichc3_c4; } 
            if ($scope.ichc.ichc3_d4) { var str_d4 = ''+$scope.ichc.ichc3_d4; } 
            if ($scope.ichc.ichc3_e4) { var str_e4 = ''+$scope.ichc.ichc3_e4; } 
            if ($scope.ichc.ichc3_f4) { var str_f4 = ''+$scope.ichc.ichc3_f4; } 
            if ($scope.ichc.ichc3_g4) { var str_g4 = ''+$scope.ichc.ichc3_g4; } 

            $scope.harusKoma4 = str_a4.includes(".") && str_b4.includes(".") && str_c4.includes(".") && str_d4.includes(".") && 
                                str_e4.includes(".") && str_f4.includes(".") && str_g4.includes(".");

            $scope.harusKoma = $scope.harusKoma2 && $scope.harusKoma3 && $scope.harusKoma4;
            
        };

        $scope.go = function(toMenu, curMenu) {
            $scope.save().then(function() {
                $scope[toMenu] = true;
                $scope[curMenu] = false;
            });
        };
        
        // Save
        $scope.save = function(finish) {
            var goTo = finish ? 'app.art' : '';
            // simpan model, termasuk yg hidden dg ng-show, exclude hidden dg ng-if
            return AppService.saveDataKelMasked('ichc', $scope.ichc, true, goTo);
        };

    }
})();
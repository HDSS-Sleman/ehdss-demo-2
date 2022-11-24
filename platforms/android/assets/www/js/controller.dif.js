(function() {
    angular.module('ehdss')
        .controller('DifCtrl', DifCtrl);

    DifCtrl.$inject = ['$scope', '$rootScope', '$state', 'AppService', '$ionicModal'];

    function DifCtrl($scope, $rootScope, $state, AppService, $ionicModal) {
        $scope.dif = $rootScope.dataRT.dif || {};
        $scope.AlldataART = $rootScope.AlldataART;
        AppService.getDataART().then(function(data) {
            $scope.dataART = data.filter(function(item) {
                return !item.artTdkAda;
            });
        });
        $scope.dataChanged = false;
        //controller modal di Dif03
        $ionicModal.fromTemplateUrl('templates/dif-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });
        // apakah form di modal di save ?
        var modalSaved = false;
        // simpan variabel terakhir yg tersimpan
        var lastDif = angular.copy($scope.dif);
        $scope.edit = function(checked, art) {
            if (checked == 1) {
                $scope.dif[art.idart] = $scope.dif[art.idart] || {};
                $scope.nama = art._nama;
                $scope.umur = art.umur;
                $scope.idart = art.idart;
                modalSaved = false;
                $scope.modal.show();
            }

            /* set default value dif */
            if (!$scope.dif.dif) {
                $scope.dif.dif = {};
            }
            if (checked == 1) {
                $scope.dif.dif[art.idart] = 1;
            }else{
                if ($scope.dif.dif[art.idart] == 1) {
                    $scope.dif.dif[art.idart] = 1;
                }else{
                    $scope.dif.dif[art.idart] = 0;
                }
            }
        };

        $scope.saveModal = function() {
            AppService.saveDataKelMasked('dif', $scope.dif, true, 'app.dif').then(function() {
                modalSaved = true;
                lastDif = angular.copy($scope.dif);
                $scope.modal.hide();
            })
        };

        // jika performance melambat, fungsi ini mungkin perlu  dihilangkan
        // atau dicari alternatif lainnya..
        // $scope.$watch('dif', function(newV, oldV) {
        //     dataChanged = !angular.equals(lastDif, $scope.dif);
        //     if (dataChanged) {
        //         $scope.dataChanged = true;
        //         $scope.btnSaveTitle = 'Simpan';
        //     } else {
        //         $scope.dataChanged = false;
        //         $scope.btnSaveTitle = 'Simpan';
        //     }
        // }, true);

        $scope.$on('modal.hidden', function() {
            if (!modalSaved) {
                $scope.dif = angular.copy(lastDif);
            }
        });

        $scope.allowSave = function() {
            var dif = $scope.dif;
                dif01 = dif.dif01, dif01z = false;
            if (dif.dif01 == '1') {
                $scope.dataART.forEach(function(d) {
                    dif01 = dif01 && dif.dif01a && dif.dif01a[d.idart];
                });
                // harus ada salah satu yg nilainya = 1
                $scope.dataART.forEach(function(d) {
                    dif01z = dif01z || (dif.dif01a && dif.dif01a[d.idart] == 1);
                });
                allow = dif01 && dif01z;
            } else if (dif01 == 2 || dif01 == 98) {
                allow = dif01;
            }
            return allow;
        };

        $scope.modalAllowSave = function() {
            var dif = $scope.dif,
                allow = false;
            var idart = $scope.idart;

            allow = dif.dif02a && dif.dif02a[idart] && // apakah memiliki disabilitas
                    dif.dif02b && dif.dif02b[idart] &&
                    dif.dif02c && dif.dif02c[idart] && 
                    dif.dif02d && dif.dif02d[idart] &&
                    dif.dif02e && dif.dif02e[idart] &&
                    dif.dif02f && dif.dif02f[idart] &&
                    // dif.dif02g && dif.dif02g[idart] &&
                    dif.dif03 && dif.dif03[idart] &&
                    dif.dif04 && dif.dif04[idart] &&
                    dif.dif05b && dif.dif05b[idart] &&
                    dif.dif05c && dif.dif05c[idart] &&
                    dif.dif06 && dif.dif06[idart] && // pertanyaan diagnosa medis
                    dif.dif09a && dif.dif09a[idart] && // kemampuan difabel melakukan aktivitas sehari-hari
                    dif.dif09b && dif.dif09b[idart] &&
                    dif.dif09c && dif.dif09c[idart] &&
                    dif.dif09d && dif.dif09d[idart] &&
                    dif.dif09e && dif.dif09e[idart] &&
                    dif.dif09f && dif.dif09f[idart] &&
                    dif.dif09g && dif.dif09g[idart] &&
                    // dif.dif09h && dif.dif09h[idart] &&
                    dif.dif10a_1 && dif.dif10a_1[idart] && // pertanyaan kursi roda
                    dif.dif10b_1 && dif.dif10b_1[idart] && // pertanyaan walker
                    dif.dif10c_1 && dif.dif10c_1[idart] && // pertanyaan kruk
                    dif.dif10d_1 && dif.dif10d_1[idart] && // pertanyaan kaki palsu
                    dif.dif10e_1 && dif.dif10e_1[idart] && // pertanyaan tongkat canadian
                    dif.dif10f_1 && dif.dif10f_1[idart] && // pertanyaan alat bantu dengar
                    dif.dif10g_1 && dif.dif10g_1[idart] && // pertanyaan alat bantu tongkat
                    dif.dif10ln && dif.dif10ln[idart] &&
                    dif.dif11a && dif.dif11a[idart] && // pertanyaan jaminan sosial
                    dif.dif11b && dif.dif11b[idart] &&
                    dif.dif11c && dif.dif11c[idart] &&
                    dif.dif11d && dif.dif11d[idart] &&
                    dif.dif11e && dif.dif11e[idart] &&
                    dif.dif11f && dif.dif11f[idart]
                    ;

                    if (dif.dif02a && dif.dif02a[idart] == 1) {
                        allow = allow && (dif.dif02a_1 && dif.dif02a_1[idart]);
                    }
                    if (dif.dif02b && dif.dif02b[idart] == 1) {
                        allow = allow && (dif.dif02b_1 && dif.dif02b_1[idart]);
                    }
                    if (dif.dif02c && dif.dif02c[idart] == 1) {
                        allow = allow && (dif.dif02c_1 && dif.dif02c_1[idart]);
                    }
                    if (dif.dif02d && dif.dif02d[idart] == 1) {
                        allow = allow && (dif.dif02d_1 && dif.dif02d_1[idart]);
                    }
                    if (dif.dif02e && dif.dif02e[idart] == 1) {
                        allow = allow && (dif.dif02e_1 && dif.dif02e_1[idart]);
                    }
                    if (dif.dif02f && dif.dif02f[idart] == 1) {
                        allow = allow && (dif.dif02f_1 && dif.dif02f_1[idart]) &&
                                    (dif.dif09h && dif.dif09h[idart]);
                    }
                    // if (dif.dif02g && dif.dif02g[idart] == 1) {
                    //     allow = allow && (dif.dif02g_1 && dif.dif02g_1[idart]);
                    // }

                    if (dif.dif04 && dif.dif04[idart] == 1) {
                        allow = allow && dif.dif04a && dif.dif04a[idart];
                    }else if(dif.dif04 && dif.dif04[idart] == 2){
                        allow = allow && dif.dif05a && dif.dif05a[idart];
                    }

                    if (dif.dif06 && dif.dif06[idart] == 1) {
                        allow = allow && dif.dif06a && dif.dif06a[idart] && // tempat melakukan pengobatan/perawatan/rehabilitasi
                                        dif.dif07a && dif.dif07a[idart] &&
                                        dif.dif07b && dif.dif07b[idart] &&
                                        dif.dif07c && dif.dif07c[idart] &&
                                        dif.dif07d && dif.dif07d[idart] &&
                                        dif.dif07e && dif.dif07e[idart];
                        if (dif.dif07a && dif.dif07a[idart] == 1) {
                            allow = allow && dif.dif08a && dif.dif08a[idart] && // Bila di rumah, siapa yang melakukan pengobatan atau perawatan?
                                            dif.dif08b && dif.dif08b[idart] &&
                                            dif.dif08c && dif.dif08c[idart] &&
                                            dif.dif08d && dif.dif08d[idart] &&
                                            dif.dif08e && dif.dif08e[idart];
                            if (dif.dif08e && dif.dif08e[idart] == 1) {
                                allow = allow && dif.dif08e_1 && dif.dif08e_1[idart];
                            }
                        }
                    }

                    if (dif.dif10a_1 && dif.dif10a_1[idart] == 1) { // jika punya kursi roda
                        allow = allow && dif.dif10a_2 && dif.dif10a_2[idart] && dif.dif10a_3 && dif.dif10a_3[idart];
                    }
                    if (dif.dif10b_1 && dif.dif10b_1[idart] == 1) { // jika punya walker
                        allow = allow && dif.dif10b_2 && dif.dif10b_2[idart] && dif.dif10b_3 && dif.dif10b_3[idart];
                    }
                    if (dif.dif10c_1 && dif.dif10c_1[idart] == 1) { // jika punya kruk
                        allow = allow && dif.dif10c_2 && dif.dif10c_2[idart] && dif.dif10c_3 && dif.dif10c_3[idart];
                    }
                    if (dif.dif10d_1 && dif.dif10d_1[idart] == 1) { // jika punya kaki palsu
                        allow = allow && dif.dif10d_2 && dif.dif10d_2[idart] && dif.dif10d_3 && dif.dif10d_3[idart];
                    }
                    if (dif.dif10e_1 && dif.dif10e_1[idart] == 1) { // jika punya tongkat canadian
                        allow = allow && dif.dif10e_2 && dif.dif10e_2[idart] && dif.dif10e_3 && dif.dif10e_3[idart];
                    }
                    if (dif.dif10f_1 && dif.dif10f_1[idart] == 1) { // jika punya alat bantu dengar
                        allow = allow && dif.dif10f_2 && dif.dif10f_2[idart] && dif.dif10f_3 && dif.dif10f_3[idart];
                    }
                    if (dif.dif10g_1 && dif.dif10g_1[idart] == 1) { // jika punya alat bantu tongkat
                        allow = allow && dif.dif10g_2 && dif.dif10g_2[idart] && dif.dif10g_3 && dif.dif10g_3[idart];
                    }
                    if (dif.dif10ln && dif.dif10ln[idart] == 1) { // jika punya alat bantu tongkat
                        allow = allow && dif.dif10ln_1 && dif.dif10ln_1[idart] && dif.dif10ln_2 && dif.dif10ln_2[idart] && dif.dif10ln_3 && dif.dif10ln_3[idart];
                    }

            return allow;
        };

        $scope.save = function(finish, art) {
            $rootScope.modulUtamaSelesai = true;
            var goTo = finish ? 'app.art' : '';
            // simpan semua model (termasuk hidden ngShow), kecuali yg hidden by ng-if
            return AppService.saveDataKelMasked('dif', $scope.dif, true, goTo);
            
        };
    }
})();

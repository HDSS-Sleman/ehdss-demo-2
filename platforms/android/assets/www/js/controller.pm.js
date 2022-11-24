(function() {
    angular.module('ehdss')
        .controller('PmnCtrl', PmnCtrl);

    PmnCtrl.$inject = ['$scope', '$rootScope', '$state', '$ionicModal', '$window', '$ionicLoading', '$timeout', 'AppService', '$ionicPopup'];

    function PmnCtrl($scope, $rootScope, $state, $ionicModal, $window, $ionicLoading, $timeout, AppService, $ionicPopup) {

        $scope.pm = $rootScope.dataRT.pm || {};     
        $scope.idrt = $rootScope.dataRT.idrt || {}; 
        // reset dulu ke empty object
        // $scope.pm = {};
        AppService.getDataART().then(function(data) {
             $rootScope.dataARTpm = $scope.dataART = data.filter(function(item) {
                return !item.artTdkAda;
            });
        });

        AppService.getDataART().then(function(data) {
             $rootScope.dataARTvac = $scope.dataARTvac = data.filter(function(item) {
                var umur = parseInt(item.umur);
                return !item.artTdkAda && (umur >= 12);
            });
        });

        

        $scope.vaksin = true;
        $scope.ispa = false;
        $scope.malaria = false;
        $scope.demam = false;
        $scope.leptospirosis = false;
        $scope.tuberkolusis = false;
        $scope.tuberkolusisModal1 = false;
        $scope.tuberkolusisModal2 = false;
        $scope.typhoid = false;
        $scope.diare_modal = false; $scope.diare_modal_gejala = false; $scope.diare_modal_obat = false;
        $scope.hepatitis = false;

        // apakah form di modal di save ?
        var modalSaved = false;
        // simpan variabel terakhir yg tersimpan
        var lastPm = angular.copy($scope.pm);

        $scope.go = function(toMenu, curMenu) {
            $scope.save().then(function() {
                $scope[toMenu] = true;
                $scope[curMenu] = false;
                lastPm = angular.copy($scope.pm);
            });
        };

        // Display/Tidak tombol selanjutnya ke ISPA
        $scope.vaksinAllowSave = function() {
            var pm = $scope.pm,
                // vac99 harus terisi
                vac99 = pm.vac99, vac99z = false;

            if (pm.vac99 == '1') {
                $scope.dataART.forEach(function(d) {
                    // harus diisi semua agar true
                    vac99 = vac99 && pm.vac99ls && pm.vac99ls[d.idart];
                });
                // harus ada salah satu yg nilainya = 1
                $scope.dataART.forEach(function(d) {
                    vac99z = vac99z || (pm.vac99ls && (pm.vac99ls[d.idart] == 1 || pm.vac99ls[d.idart] == 2));
                });
                vac99 = vac99 && vac99z;
            }

            return vac99;
        };

        // Display/Tidak Tombol selanjutnya (malaria)
        $scope.ispaAllowSave = function() {
            var pm = $scope.pm,
                // pm01 dan pm02 harus terisi
                pm01 = pm.pm01, pm01z = false,
                pm02 = pm.pm02, pm02z = false;

            if (pm.pm01 == '1') {
                $scope.dataART.forEach(function(d) {
                    // harus diisi semua agar true
                    pm01 = pm01 && pm.pm01ls && pm.pm01ls[d.idart];
                });
                // harus ada salah satu yg nilainya = 1
                $scope.dataART.forEach(function(d) {
                    pm01z = pm01z || (pm.pm01ls && pm.pm01ls[d.idart] == 1);
                });
                pm01 = pm01 && pm01z;
            }

            if (pm.pm02 == '1') {
                $scope.dataART.forEach(function(d) {
                    // jika ada salah satu yang terisi/checked, set true
                    pm02 = pm02 && pm.pm02ls && pm.pm02ls[d.idart];
                });
                // harus ada salah satu yg nilainya = 1
                $scope.dataART.forEach(function(d) {
                    pm02z = pm02z || (pm.pm02ls && (pm.pm02ls[d.idart] == 1 || pm.pm02ls[d.idart] == 2));
                });
                pm02 = pm02 && pm02z;
            }

            return pm01 && pm02;
        };

        $scope.malariaAllowSave = function() {
            var pm = $scope.pm,
                pm03 = pm.pm03, pm03z = false,
                pm04 = pm.pm04, pm04z = false;
            if (pm.pm03 == '1') {
                $scope.dataART.forEach(function(d) {
                    pm03 = pm03 && pm.pm03ls && pm.pm03ls[d.idart];
                });
                // harus ada salah satu yg nilainya = 1
                $scope.dataART.forEach(function(d) {
                    pm03z = pm03z || (pm.pm03ls && pm.pm03ls[d.idart] == 1);
                });
                pm03 = pm03 && pm03z;
            }

            if (pm.pm04 == '1') {
                // definisikan dulu supaya tidak undefinied
                if(!pm.pm04ls) {pm.pm04ls = {};}
                // setiap ART harus terisi
                $scope.dataART.forEach(function(d) {
                    pm04 = pm04 && pm.pm04ls && pm.pm04ls[d.idart];
                });

                // harus ada salah satu yg nilainya = 1 atau 2
                $scope.dataART.forEach(function(d) {
                    pm04z = pm04z || (pm.pm04ls && (pm.pm04ls[d.idart] == 1 || pm.pm04ls[d.idart] == 2));
                });
                pm04 = pm04 && pm04z;
            }

            return pm03 && pm04;
        };

        $scope.dbAllowSave = function() {
            var pm = $scope.pm,
                pm08 = pm.pm08, pm08z = false;
            if (pm.pm08 == '1') {
                // harus terisi semua ART
                $scope.dataART.forEach(function(d) {
                    pm08 = pm08 && pm.pm08ls && pm.pm08ls[d.idart];
                });
                // harus ada salah satu yg nilainya = 1
                $scope.dataART.forEach(function(d) {
                    pm08z = pm08z || (pm.pm08ls && pm.pm08ls[d.idart] == 1);
                });
                pm08 = pm08 && pm08z;
            }
            return pm08;
        };

        $scope.leptoAllowSave = function() {
            var pm = $scope.pm,
                pm09 = pm.pm09, pm09z = false;
            if (pm.pm09 == '1') {
                $scope.dataART.forEach(function(d) {
                    pm09 = pm09 && pm.pm09ls && pm.pm09ls[d.idart];
                });
                // harus ada salah satu yg nilainya = 1
                $scope.dataART.forEach(function(d) {
                    pm09z = pm09z || (pm.pm09ls && pm.pm09ls[d.idart] == 1);
                });
                pm09 = pm09 && pm09z;
            }
            return pm09;
        };

        $scope.tuberkolusisAllowSave = function() {
            var pm = $scope.pm,
                pm10 = pm.pm10, pm10z = false,
                pm12 = pm.pm12, pm12z = false;
            if (pm.pm10 == '1') {
                // semua ART harus diisi semua
                $scope.dataART.forEach(function(d) {
                    pm10 = pm10 && pm.pm10ls && pm.pm10ls[d.idart];
                });
                // harus ada salah satu yg nilainya = 1
                $scope.dataART.forEach(function(d) {
                    pm10z = pm10z || (pm.pm10ls && pm.pm10ls[d.idart] == 1);
                });
                pm10 = pm10 && pm10z;
            }

            if(pm.pm12 == 1) {
                // semua ART harus diisi semua
                $scope.dataART.forEach(function(d) {
                    pm12 = pm12 && pm.pm12a && pm.pm12a[d.idart];
                });
                // harus ada salah satu yg nilainya = 1 atau 2
                $scope.dataART.forEach(function(d) {
                    pm12z = pm12z || (pm.pm12a && (pm.pm12a[d.idart] == 1 || pm.pm12a[d.idart] == 2));
                });
                pm12 = pm12 && pm12z;
            }
            return pm10 && pm12;
        };

        $scope.typhoidAllowSave = function() {
            var pm = $scope.pm,
                pm15 = pm.pm15, pm15z = false,
                pm16 = pm.pm16, pm16z = false;

            if (pm.pm15 == '1') {
                $scope.dataART.forEach(function(d) {
                    pm15 = pm15 && pm.pm15ls && pm.pm15ls[d.idart];
                });
                // harus ada salah satu yg nilainya = 1
                $scope.dataART.forEach(function(d) {
                    pm15z = pm15z || (pm.pm15ls && pm.pm15ls[d.idart] == 1);
                });
                pm15 = pm15 && pm15z;
            }else if (pm.pm15 == '2' || pm.pm15 == '98') {
                pm15 = pm.pm15;
            }
            
            if (pm.pm16 == '1') {
                // definisikan dulu supaya tidak undefinied
                if(!pm.pm16ls) {pm.pm16ls = {};}
                // setiap ART harus terisi
                $scope.dataART.forEach(function(d) {
                    pm16 = pm16 && pm.pm16ls && pm.pm16ls[d.idart];
                });

                // harus ada salah satu yg nilainya = 1
                $scope.dataART.forEach(function(d) {
                    pm16z = pm16z || (pm.pm16ls && pm.pm16ls[d.idart] == 1);
                });
                pm16 = pm16 && pm16z;
            }else if (pm.pm16 == '2' || pm.pm16 == '98') {
                pm16 = pm.pm16;
            }

            return pm15 && pm16;

        };

        $scope.diareAllowSave = function() {
            var pm = $scope.pm,
                pm17 = pm.pm17, pm17z = false,
                pm18 = pm.pm18, pm18z = false;

            if (pm.pm17 == '1') {
                $scope.dataART.forEach(function(d) {
                    pm17 = pm17 && pm.pm17ls && pm.pm17ls[d.idart];
                });
                // harus ada salah satu yg nilainya = 1 atau 2
                $scope.dataART.forEach(function(d) {
                    pm17z = pm17z || (pm.pm17ls && pm.pm17ls[d.idart] == 1);
                });
                pm17 = pm17 && pm17z;
            }else if(pm.pm17 == '2'){
                pm17 = pm.pm17;
            }

            if (pm.pm18 == '1') {
                $scope.dataART.forEach(function(d) {
                    pm18 = pm18 && pm.pm18ls && pm.pm18ls[d.idart];
                });
                // harus ada salah satu yg nilainya = 1 atau 2
                $scope.dataART.forEach(function(d) {
                    pm18z = pm18z || (pm.pm18ls && pm.pm18ls[d.idart] == 1);
                });
                pm18 = pm18 && pm18z;
            }else if(pm.pm18 == '2'){
                pm18 = pm.pm18;
            }

            return pm17 && pm18;

        };

        $scope.hepatitisAllowSave = function() {
            var pm = $scope.pm,
                pm20 = pm.pm20, pm20z = false,
                pm21 = pm.pm21, pm21z = false;
            if (pm.pm20 == '1') {
                $scope.dataART.forEach(function(d) {
                    pm20 = pm20 && pm.pm20ls && pm.pm20ls[d.idart];
                });
                // harus ada salah satu yg nilainya = 1
                $scope.dataART.forEach(function(d) {
                    pm20z = pm20z || (pm.pm20ls && pm.pm20ls[d.idart] == 1);
                });
                pm20 = pm20 && pm20z;
            }else if (pm.pm20 == '2' || pm.pm20 == '98') {
                pm20 = pm.pm20;
            }

            if (pm.pm21 == '1') {
                $scope.dataART.forEach(function(d) {
                    pm21 = pm21 && pm.pm21ls && pm.pm21ls[d.idart];
                });
                // harus ada salah satu yg nilainya = 1
                $scope.dataART.forEach(function(d) {
                    pm21z = pm21z || (pm.pm21ls && pm.pm21ls[d.idart] == 1);
                });
                pm21 = pm21 && pm21z;
            }else if (pm.pm21 == '2' || pm.pm21 == '98') {
                pm21 = pm.pm21;
            }

            return pm20 && pm21;

        };

        $scope.modalAllowSave = function() {
            var pm = $scope.pm,
                allow = false;
            var idart = $scope.idart;

            if ($scope.malaria) {
                var pm05 = pm.pm05 && parseInt(pm.pm05[idart]);
                allow = !!(pm.pm07 && pm.pm07[idart]);
                if (pm05 === 1) {
                    // ..
                } else if (pm05 === 2 || pm05 === 98) {
                    allow = true;
                }
            } else if ($scope.tuberkolusisModal1) {
                allow = (pm.pm11a && pm.pm11a[idart]) &&
                    (pm.pm11b && pm.pm11b[idart]) &&
                    (pm.pm11c && pm.pm11c[idart]) &&
                    (pm.pm11d && pm.pm11d[idart]) &&
                    (pm.pm11e && pm.pm11e[idart]) &&
                    (pm.pm11f && pm.pm11f[idart]) &&
                    (pm.pm11g && pm.pm11g[idart]) &&
                    (pm.pm11h && pm.pm11h[idart]);
            } else if ($scope.tuberkolusisModal2) {
                allow = (pm.pm13a && pm.pm13a[idart]) &&
                    (pm.pm13b && pm.pm13b[idart]) &&
                    (pm.pm13c && pm.pm13c[idart]);
            } else if ($scope.typhoid){
                allow = (pm.pm16a && pm.pm16a[idart]) &&
                        (pm.pm16b && pm.pm16b[idart]) &&
                        (pm.pm16c && pm.pm16c[idart]) &&
                        (pm.pm16d && pm.pm16d[idart]);
                
            } else if ($scope.hepatitis){
                allow = // (pm.pm21a && pm.pm21a[idart]) &&
                        (pm.pm22a && pm.pm22a[idart]) &&
                        (pm.pm22b && pm.pm22b[idart]) &&
                        (pm.pm22c && pm.pm22c[idart]) &&
                        (pm.pm22d && pm.pm22d[idart]);
                            
            }else if ($scope.diare_modal){
                allow = true;
                     
                if ($scope.diare_modal_obat && $scope.diare_modal_gejala) { // jika minum obat dan ada gejala
                    if (pm.pm19 && pm.pm19[idart] == 1) { // jika minum obat diare
                            allow = allow && (pm.pm19a && pm.pm19a[idart]) &&
                                    (pm.pm19b && pm.pm19b[idart]) &&
                                    (pm.pm19c && pm.pm19c[idart]) &&
                                    (pm.pm19d && pm.pm19d[idart]) &&
                                    (pm.pm19a[idart] == 1 || pm.pm19b[idart] == 1 || pm.pm19c[idart] == 1 || pm.pm19d[idart] == 1)
                                    ;
                                    // (pm.pm19e && pm.pm19e[idart]);
                            // tambahkan validasi gejala jika ada gejala
                            allow = allow && (pm.pm18a && pm.pm18a[idart] >= 1) &&
                                (pm.pm18b && pm.pm18b[idart] >= 1) &&
                                (pm.pm18c && pm.pm18c[idart] >= 1);

                    }else if(pm.pm19 && (pm.pm19[idart] == 2 || pm.pm19[idart] == 98)){
                        // hapus pilihan obat yg terpilih sebelumnya
                        if($scope.pm.pm19a && $scope.pm.pm19a[idart]){delete $scope.pm.pm19a[idart]};
                        if($scope.pm.pm19b && $scope.pm.pm19b[idart]){delete $scope.pm.pm19b[idart]};
                        if($scope.pm.pm19c && $scope.pm.pm19c[idart]){delete $scope.pm.pm19c[idart]};
                        if($scope.pm.pm19d && $scope.pm.pm19d[idart]){delete $scope.pm.pm19d[idart]};
                        
                        // tambahkan validasi gejala jika ada gejala
                        allow = allow && (pm.pm18a && pm.pm18a[idart] >= 1) &&
                            (pm.pm18b && pm.pm18b[idart] >= 1) &&
                            (pm.pm18c && pm.pm18c[idart] >= 1);
                    }
                }

                if ($scope.diare_modal_obat && !$scope.diare_modal_gejala) {
                    allow = pm.pm19 && pm.pm19[idart];
                    if (pm.pm19 && pm.pm19[idart] == 1) { // jika minum obat diare
                            allow = allow && (pm.pm19a && pm.pm19a[idart]) &&
                                    (pm.pm19b && pm.pm19b[idart]) &&
                                    (pm.pm19c && pm.pm19c[idart]) &&
                                    (pm.pm19d && pm.pm19d[idart]) &&
                                    (pm.pm19a[idart] == 1 || pm.pm19b[idart] == 1 || pm.pm19c[idart] == 1 || pm.pm19d[idart] == 1)
                                    ;
                                    // (pm.pm19e && pm.pm19e[idart]);
                    }else if(pm.pm19 && (pm.pm19[idart] == 2 || pm.pm19[idart] == 98)){
                        // hapus pilihan obat yg terpilih sebelumnya
                        if($scope.pm.pm19a && $scope.pm.pm19a[idart]){delete $scope.pm.pm19a[idart]};
                        if($scope.pm.pm19b && $scope.pm.pm19b[idart]){delete $scope.pm.pm19b[idart]};
                        if($scope.pm.pm19c && $scope.pm.pm19c[idart]){delete $scope.pm.pm19c[idart]};
                        if($scope.pm.pm19d && $scope.pm.pm19d[idart]){delete $scope.pm.pm19d[idart]};
                        allow = true; // jika tidak minum obat diare, langsung bisa di save
                    }
                } 
                        
            }else {
                allow = true;
            }

            return allow;
        };

        // Model yang berefek ke model di bawahnya di set empty manual
        $scope.$watch('pm.pm04ls[idart]', function(newVal, oldVal) {
            var idart = $scope.idart;
            // Jika PM04 empty (bukan 1 atau 2), empty pm05 dan pm07 [idart]
            if (!newVal && idart) {
                delete $scope.pm.pm05[idart];
                delete $scope.pm.pm07[idart];
            }
        });
        $scope.$watch('pm.pm10ls[idart]', function(newVal, oldVal) {
            var idart = $scope.idart;
            // Jika PM10ls empty, empty pm11a - pm11h [idart]
            if (!newVal && idart) {
                delete $scope.pm.pm11a[idart];
                delete $scope.pm.pm11b[idart];
                delete $scope.pm.pm11c[idart];
                delete $scope.pm.pm11d[idart];
                delete $scope.pm.pm11e[idart];
                delete $scope.pm.pm11f[idart];
                delete $scope.pm.pm11g[idart];
                delete $scope.pm.pm11h[idart];
            }
        });
        $scope.$watch('pm.pm12a[idart]', function(newVal, oldVal) {
            var idart = $scope.idart;
            // Jika PM12a empty, empty pm13a - pm13c [idart]
            if (!newVal && idart) {
                delete $scope.pm.pm13a[idart];
                delete $scope.pm.pm13b[idart];
                delete $scope.pm.pm13c[idart];
            }
        });

        /* set lv ART kosong, jika lv RT tidak sakit */
        $scope.setTidakSakit = function(param, val1){
            if (val1 == 2 || val1 == 98) {
                $rootScope.dataARTpm.forEach(function(val2){
                    if (param == 'pm01') { delete $scope.pm.pm01ls[val2.idart]; }
                    if (param == 'pm02') { delete $scope.pm.pm02ls[val2.idart]; }
                    if (param == 'pm03') { delete $scope.pm.pm03ls[val2.idart]; }
                    if (param == 'pm04') { 
                        delete $scope.pm.pm04ls[val2.idart];
                        delete $scope.pm.pm05[val2.idart];
                        delete $scope.pm.pm07[val2.idart];
                    }
                    if (param == 'pm08') { if ($scope.pm.pm08ls && $scope.pm.pm08ls[val2.idart]) {delete $scope.pm.pm08ls[val2.idart];} }
                    if (param == 'pm09') { delete $scope.pm.pm09ls[val2.idart]; }
                    if (param == 'pm10') { 
                        delete $scope.pm.pm10ls[val2.idart];
                        delete $scope.pm.pm11a[val2.idart];
                        delete $scope.pm.pm11b[val2.idart];
                        delete $scope.pm.pm11c[val2.idart];
                        delete $scope.pm.pm11d[val2.idart];
                        delete $scope.pm.pm11e[val2.idart];
                        delete $scope.pm.pm11f[val2.idart];
                        delete $scope.pm.pm11g[val2.idart];
                        delete $scope.pm.pm11h[val2.idart];
                    }
                    if (param == 'pm12') { 
                        delete $scope.pm.pm12a[val2.idart];
                        delete $scope.pm.pm13a[val2.idart];
                        delete $scope.pm.pm13b[val2.idart];
                        delete $scope.pm.pm13c[val2.idart];
                    }
                    if (param == 'pm15') { 
                        delete $scope.pm.pm15ls[val2.idart];
                    }
                    if (param == 'pm16') { 
                        delete $scope.pm.pm16ls[val2.idart];
                        delete $scope.pm.pm16a[val2.idart];
                        delete $scope.pm.pm16b[val2.idart];
                        delete $scope.pm.pm16c[val2.idart];
                        delete $scope.pm.pm16d[val2.idart];
                    }
                    if (param == 'pm17') { 
                        delete $scope.pm.pm17ls[val2.idart];
                    }
                    if (param == 'pm18') { 
                        delete $scope.pm.pm18ls[val2.idart];
                        delete $scope.pm.pm18a[val2.idart];
                        delete $scope.pm.pm18b[val2.idart];
                        delete $scope.pm.pm18c[val2.idart];
                    }
                    if (param == 'pm19') { 
                        delete $scope.pm.pm19ls[val2.idart];
                        delete $scope.pm.pm19a[val2.idart];
                        delete $scope.pm.pm19b[val2.idart];
                        delete $scope.pm.pm19c[val2.idart];
                        delete $scope.pm.pm19d[val2.idart];
                        delete $scope.pm.pm19e[val2.idart];
                    }
                    if (param == 'pm20') { 
                        delete $scope.pm.pm20ls[val2.idart];
                    }
                    if (param == 'pm20') { 
                        delete $scope.pm.pm21ls[val2.idart];
                        delete $scope.pm.pm21a[val2.idart];
                        delete $scope.pm.pm21b[val2.idart];
                        delete $scope.pm.pm21c[val2.idart];
                        delete $scope.pm.pm21d[val2.idart];
                    }
                });
            }
            
        }


        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
            // stop interval
            clearInterval($scope.timerEditPm10);
            $scope.countDownEditPm10 = 0;

            if (!modalSaved) {
                $scope.pm = angular.copy(lastPm);
            }
        });

        //controller modal di PM03
        $ionicModal.fromTemplateUrl('templates/pm-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });

        $scope.openModal = function(open, art) {
            /* set default value pm */
            if (!$scope.pm.pm) {
                $scope.pm.pm = {};
            }      
            if (open == 1 || open == 2) {
                $scope.pm.pm[art.idart] = 1;
            }else{
                if ($scope.pm.pm[art.idart] == 1) {
                    $scope.pm.pm[art.idart] = 1;
                }else{
                    $scope.pm.pm[art.idart] = 0;
                }
            }

            // tutup modal dari tuberkolusis
            $scope.tuberkolusisModal1 = false;
            $scope.tuberkolusisModal2 = false;

            $scope.nama = art._nama;
            $scope.umur = art.umur;
            $scope.jk = art._jk;
            $scope.idart = art.idart;
            $scope.pernahhamil = art._jk === 'P';
            if (open == 1 || open == 2) {
                modalSaved = false;
                $scope.modal.show();
            }
        };

        $scope.defpm = function(val,idart){
            /* set default value pm */
            if (!$scope.pm.pm) {
                $scope.pm.pm = {};
            }
            if (val == 1) {
                $scope.pm.pm[idart] = 1;
            }else{
                if ($scope.pm.pm[idart] == 1) {
                    $scope.pm.pm[idart] = 1;
                }else{
                    $scope.pm.pm[idart] = 0;
                }
            }
            
        };

        $scope.editPm10 = function(open, art) {
            /* set default value pm */
            if (!$scope.pm.pm) {
                $scope.pm.pm = {};
            }
            if (open == 1) {
                $scope.pm.pm[art.idart] = 1;
            }else{
                if ($scope.pm.pm[art.idart] == 1) {
                    $scope.pm.pm[art.idart] = 1;
                }else{
                    $scope.pm.pm[art.idart] = 0;
                }
            }

            /* timer */
            $scope.countDownEditPm10 = 10;    
                $scope.timerEditPm10 = setInterval(function(){$scope.countDownEditPm10--; /*console.log($scope.countDownEditPm10)*/ },1000);
            /* end of timer */

            $scope.tuberkolusisModal1 = true;
            $scope.tuberkolusisModal2 = false;
            $scope.typhoid = false;
            $scope.hepatitis = false;
            $scope.diare_modal = false; $scope.diare_modal_gejala = false; $scope.diare_modal_obat = false;
            $scope.pm[art.idart] = $scope.pm[art.idart] || {};
            $scope.nama = art._nama;
            $scope.umur = art.umur;
            $scope.idart = art.idart;
            if (open == 1) {
                modalSaved = false;
                $scope.modal.show();
            }
        };

        $scope.editPm12 = function(open, art) {
            /* set default value pm */
            if (!$scope.pm.pm) {
                $scope.pm.pm = {};
            }      
            if (open == 1) {
                $scope.pm.pm[art.idart] = 1;
            }else{
                if ($scope.pm.pm[art.idart] == 1) {
                    $scope.pm.pm[art.idart] = 1;
                }else{
                    $scope.pm.pm[art.idart] = 0;
                }
            }

            $scope.tuberkolusisModal1 = false;
            $scope.tuberkolusisModal2 = true;
            $scope.typhoid = false;
            $scope.hepatitis = false;
            $scope.diare_modal = false; $scope.diare_modal_gejala = false; $scope.diare_modal_obat = false;
            $scope.pm[art.idart] = $scope.pm[art.idart] || {};
            $scope.nama = art._nama;
            $scope.umur = art.umur;
            $scope.idart = art.idart;
            if (open == 1) {
                modalSaved = false;
                $scope.modal.show();
            }
        };

        $scope.editPm16 = function(open, art) {
            /* set default value pm */
            if (!$scope.pm.pm) {
                $scope.pm.pm = {};
            }      
            if (open == 1) {
                $scope.pm.pm[art.idart] = 1;
            }else{
                if ($scope.pm.pm[art.idart] == 1) {
                    $scope.pm.pm[art.idart] = 1;
                }else{
                    $scope.pm.pm[art.idart] = 0;
                }
            }

            $scope.tuberkolusisModal1 = false;
            $scope.tuberkolusisModal2 = false;
            $scope.typhoid = true;
            $scope.diare_modal = false; $scope.diare_modal_gejala = false; $scope.diare_modal_obat = false;
            $scope.hepatitis = false;
            
            $scope.pm[art.idart] = $scope.pm[art.idart] || {};
            $scope.nama = art._nama;
            $scope.umur = art.umur;
            $scope.idart = art.idart;
            if (open == 1) {
                modalSaved = false;
                $scope.modal.show();
            }
        };

        $scope.editPm17 = function(open, art) {
            /* set default value pm */
            if (!$scope.pm.pm) {
                $scope.pm.pm = {};
            }      
            if (open == 1 || open == 2) {
                $scope.pm.pm[art.idart] = 1;
            }else{
                if ($scope.pm.pm[art.idart] == 1) {
                    $scope.pm.pm[art.idart] = 1;
                }else{
                    $scope.pm.pm[art.idart] = 0;
                }
            }

            $scope.tuberkolusisModal1 = false;
            $scope.tuberkolusisModal2 = false;
            $scope.typhoid = false;
            $scope.diare_modal = true; $scope.diare_modal_gejala = false; $scope.diare_modal_obat = true;
            $scope.hepatitis = false;
            
            $scope.pm[art.idart] = $scope.pm[art.idart] || {};
            $scope.nama = art._nama;
            $scope.umur = art.umur;
            $scope.idart = art.idart;
            if (open == 1) {
                modalSaved = false;
                $scope.modal.show();
            }
        };

        $scope.editPm18 = function(open, art) {
            /* set default value pm */
            if (!$scope.pm.pm) {
                $scope.pm.pm = {};
            }      
            if (open == 1 || open == 2) {
                $scope.pm.pm[art.idart] = 1;
            }else{
                if ($scope.pm.pm[art.idart] == 1) {
                    $scope.pm.pm[art.idart] = 1;
                }else{
                    $scope.pm.pm[art.idart] = 0;
                }
            }

            $scope.tuberkolusisModal1 = false;
            $scope.tuberkolusisModal2 = false;
            $scope.typhoid = false;
            $scope.diare_modal = true; $scope.diare_modal_gejala = true; $scope.diare_modal_obat = true;
            $scope.hepatitis = false;
            
            $scope.pm[art.idart] = $scope.pm[art.idart] || {};
            $scope.nama = art._nama;
            $scope.umur = art.umur;
            $scope.idart = art.idart;
            if (open == 1) {
                modalSaved = false;
                $scope.modal.show();
            }
        };

        $scope.editPm21 = function(open, art) {
            /* set default value pm */
            if (!$scope.pm.pm) {
                $scope.pm.pm = {};
            }      
            if (open == 1) {
                $scope.pm.pm[art.idart] = 1;
            }else{
                if ($scope.pm.pm[art.idart] == 1) {
                    $scope.pm.pm[art.idart] = 1;
                }else{
                    $scope.pm.pm[art.idart] = 0;
                }
            }

            $scope.tuberkolusisModal1 = false;
            $scope.tuberkolusisModal2 = false;
            $scope.typhoid = false;
            $scope.diare_modal = false; $scope.diare_modal_gejala = false; $scope.diare_modal_obat = false;
            $scope.hepatitis = true;
            
            $scope.pm[art.idart] = $scope.pm[art.idart] || {};
            $scope.nama = art._nama;
            $scope.umur = art.umur;
            $scope.idart = art.idart;
            if (open == 1) {
                modalSaved = false;
                $scope.modal.show();
            }
        };

        

        $scope.save = function(finish) {
            // AppService.saveCatatanKelompok('utama',$scope.idrt);
            if (finish == 'utama') {
            /* Jika wawancara berhenti di tengah jalan*/
                $rootScope.catatanModulUtama = true; //param untuk catatan modul utama
                $rootScope.catatanModulB = false; //param untuk catatan modul B
                $rootScope.tab_catatan = true; // langsung buka tab catatan
                $rootScope.tab_cover = false; // tab cover di hide dulu
                var goTo = finish ? 'app.art_cover' : '';
            }else{
                var goTo = finish ? 'app.ptm' : '';
            }

            // simpan model, termasuk yg hidden dg ng-show, exclude hidden dg ng-if
            return AppService.saveDataKelMasked('pm', $scope.pm, true, goTo);
                
        };

        //Contoh pengambilan data (nama bisa diganti dengan id yg unik)
        $scope.saveModal = function(pm, nama) {
            // simpan model, termasuk yg hidden dg ng-show, exclude hidden dg ng-if
        
            if ($scope.countDownEditPm10) {
                if ($scope.countDownEditPm10 > 0) {
                    $ionicPopup.alert({
                        title: 'Error',
                        template: 'Anda mengisi terlalu cepat.<br>Pastikan semua pertanyaan sudah ditanyakan'
                    });
                }else{
                    // AppService.saveCatatanKelompok('utama',$scope.idrt);
                    AppService.saveDataKelMasked('pm', $scope.pm, true, 'app.pm').then(function() {
                        modalSaved = true;
                        lastPm = angular.copy($scope.pm);
                        $scope.modal.hide();
                    });
                }
            }else{
                // AppService.saveCatatanKelompok('utama',$scope.idrt);
                AppService.saveDataKelMasked('pm', $scope.pm, true, 'app.pm').then(function() {
                    modalSaved = true;
                    lastPm = angular.copy($scope.pm);
                    $scope.modal.hide();
                });
            }

        };
    }
})();

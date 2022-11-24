(function() {
    angular.module('ehdss')
        .controller('KtlpCtrl', KtlpCtrl);

    KtlpCtrl.$inject = ['$scope', '$state', '$rootScope', '$timeout', 'AppService', '$ionicPopup', '$http'];

    function KtlpCtrl($scope, $state, $rootScope, $timeout, AppService, $ionicPopup, $http) {

        // tab responden utama
        $scope.tab_sms =  true;
        $scope.tab_wa = false;
        $scope.tab_tlp_1 = false;
        $scope.tab_tlp_2 = false;
        $scope.tab_tlp_3 = false;
        $scope.tab_tlp_4 = false;
        $scope.tab_tlp_5 = false;
        $scope.tab_ltlp_1 = false;
        $scope.tab_ltlp_2 = false;
        $scope.tab_ltlp_3 = false;
        $scope.tab_ltlp_4 = false;
        $scope.tab_ltlp_5 = false;
        $scope.tab_reward = false;

        // tab responden individu
        $scope.tab_sms_i =  false;
        $scope.tab_wa_i = false;
        $scope.tab_tlp_1_i = false;
        $scope.tab_tlp_2_i = false;
        $scope.tab_tlp_3_i = false;
        $scope.tab_tlp_4_i = false;
        $scope.tab_tlp_5_i = false;
        $scope.tab_ltlp_1_i = false;
        $scope.tab_ltlp_2_i = false;
        $scope.tab_ltlp_3_i = false;
        $scope.tab_ltlp_4_i = false;
        $scope.tab_ltlp_5_i = false;

        
        $scope.ktlp = {};
        $scope.ktlp.idrt = $rootScope.dataRT.idrt;
        
        // ambil data yg tersimpan di localforage
        AppService.getDataART().then(function(data) {
            $scope.dataART = data.filter(function(item) {
                return !item.artTdkAda;
            });
            // cari data default responden utama
            $scope.dataART.forEach(function(val, idx) {
                if (val.art01 === $rootScope.dataRT.krt02) { // jika nama ART = nama responden utama di baseline
                    $scope.ktlp.ltlp05 = $scope.ktlp.ltlp05 || parseInt(val.umur); // Umur
                    $scope.ktlp.ltlp06 = $scope.ktlp.ltlp06 || ''+val.art04; // JK
                    $scope.ktlp.ltlp04 = $scope.ktlp.ltlp04 || ''+val.lokasi; // lokasi
                }
            });
        });

        // ambil catatan enum di localforage
        AppService.getLaporanTelepon($scope.ktlp.idrt).then(function(data) {
            $scope.ktlp = data || {};
            if (data) {
                for(var key in data){
                    // selain data idrt, idart, usia, dan object dibuat string agar bisa dibaca di form
                    if (key!='idrt' && key!='idart' && key!='ltlp05'  && key!='ltlp05_i' && typeof(data[key])!='object') {
                        // console.log($scope.ktlp[key]+' - '+data[key]);
                        $scope.ktlp[key] = ''+data[key];
                    }
                    // console.log($scope.ktlp);
                }
                
            }

            // default value responden utama
            $scope.ktlp.sms02 = "1"; // jenis responden utama
            $scope.ktlp.wa02 = "1"; // jenis responden utama
            $scope.ktlp.tlp02 = "1"; // jenis responden utama
            $scope.ktlp.ltlp01 = "1"; // jenis responden utama
            $scope.ktlp.ltlp07 = $scope.ktlp.ltlp07 || $rootScope.dataRT.krt03; // no telp

            // data default responden utama
            $scope.ktlp.sms04 = $scope.ktlp.sms04 || $rootScope.dataRT.krt02;
            $scope.ktlp.wa04 = $scope.ktlp.wa04 || $rootScope.dataRT.krt02;
            $scope.ktlp.tlp04 = $scope.ktlp.tlp04 || $rootScope.dataRT.krt02;
            $scope.ktlp.tlp10 = $scope.ktlp.tlp10 || $rootScope.dataRT.krt02;
            $scope.ktlp.tlp16 = $scope.ktlp.tlp16 || $rootScope.dataRT.krt02;
            $scope.ktlp.tlp22 = $scope.ktlp.tlp22 || $rootScope.dataRT.krt02;
            $scope.ktlp.tlp28 = $scope.ktlp.tlp28 || $rootScope.dataRT.krt02;
            $scope.ktlp.ltlp03 = $scope.ktlp.ltlp03 || $rootScope.dataRT.krt02;            

            // ubah data tanggal ke object dan data jam ke object
            // if($scope.ktlp.sms01) {$scope.ktlp.sms01 = new Date($scope.ktlp.sms01); }
            // if($scope.ktlp.sms05a) {$scope.ktlp.sms05a = new Date($scope.ktlp.sms05a); }
            // if($scope.ktlp.sms05b) {$scope.ktlp.sms05b = AppService.deNormalisasiDataJam($scope.ktlp.sms05b);}

            // if($scope.ktlp.wa01) {$scope.ktlp.wa01 = new Date($scope.ktlp.wa01); }
            // if($scope.ktlp.wa05a) {$scope.ktlp.wa05a = new Date($scope.ktlp.wa05a); }
            // if($scope.ktlp.wa05b) {$scope.ktlp.wa05b = AppService.deNormalisasiDataJam($scope.ktlp.wa05b);}

            // if($scope.ktlp.tlp01) {$scope.ktlp.tlp01 = new Date($scope.ktlp.tlp01); }
            // if($scope.ktlp.tlp05a) {$scope.ktlp.tlp05a = new Date($scope.ktlp.tlp05a); }
            // if($scope.ktlp.tlp05b) {$scope.ktlp.tlp05b = AppService.deNormalisasiDataJam($scope.ktlp.tlp05b);}

            // if($scope.ktlp.tlp08) {$scope.ktlp.tlp08 = new Date($scope.ktlp.tlp08); }
            // if($scope.ktlp.tlp11a) {$scope.ktlp.tlp11a = new Date($scope.ktlp.tlp11a); }
            // if($scope.ktlp.tlp11b) {$scope.ktlp.tlp11b = AppService.deNormalisasiDataJam($scope.ktlp.tlp11b);}

            // if($scope.ktlp.tlp14) {$scope.ktlp.tlp14 = new Date($scope.ktlp.tlp14); }
            // if($scope.ktlp.tlp17a) {$scope.ktlp.tlp17a = new Date($scope.ktlp.tlp17a); }
            // if($scope.ktlp.tlp17b) {$scope.ktlp.tlp17b = AppService.deNormalisasiDataJam($scope.ktlp.tlp17b);}

            // if($scope.ktlp.tlp20) {$scope.ktlp.tlp20 = new Date($scope.ktlp.tlp20); }
            // if($scope.ktlp.tlp23a) {$scope.ktlp.tlp23a = new Date($scope.ktlp.tlp23a); }
            // if($scope.ktlp.tlp23b) {$scope.ktlp.tlp23b = AppService.deNormalisasiDataJam($scope.ktlp.tlp23b);}

            // if($scope.ktlp.tlp26) {$scope.ktlp.tlp26 = new Date($scope.ktlp.tlp26); }
            // if($scope.ktlp.tlp29a) {$scope.ktlp.tlp29a = new Date($scope.ktlp.tlp29a); }
            // if($scope.ktlp.tlp29b) {$scope.ktlp.tlp29b = AppService.deNormalisasiDataJam($scope.ktlp.tlp29b);}

            // if($scope.ktlp.ltlp02a) {$scope.ktlp.ltlp02a = new Date($scope.ktlp.ltlp02a); }
            // if($scope.ktlp.ltlp02b) {$scope.ktlp.ltlp02b = AppService.deNormalisasiDataJam($scope.ktlp.ltlp02b);}
            // if($scope.ktlp.ltlp09a) {$scope.ktlp.ltlp09a = new Date($scope.ktlp.ltlp09a); }
            // if($scope.ktlp.ltlp09b) {$scope.ktlp.ltlp09b = AppService.deNormalisasiDataJam($scope.ktlp.ltlp09b);}

            // if($scope.ktlp.ltlp11a) {$scope.ktlp.ltlp11a = new Date($scope.ktlp.ltlp11a); }
            // if($scope.ktlp.ltlp11b) {$scope.ktlp.ltlp11b = AppService.deNormalisasiDataJam($scope.ktlp.ltlp11b);}
            // if($scope.ktlp.ltlp15a) {$scope.ktlp.ltlp15a = new Date($scope.ktlp.ltlp15a); }
            // if($scope.ktlp.ltlp15b) {$scope.ktlp.ltlp15b = AppService.deNormalisasiDataJam($scope.ktlp.ltlp15b);}

            // if($scope.ktlp.ltlp17a) {$scope.ktlp.ltlp17a = new Date($scope.ktlp.ltlp17a); }
            // if($scope.ktlp.ltlp17b) {$scope.ktlp.ltlp17b = AppService.deNormalisasiDataJam($scope.ktlp.ltlp17b);}
            // if($scope.ktlp.ltlp21a) {$scope.ktlp.ltlp21a = new Date($scope.ktlp.ltlp21a); }
            // if($scope.ktlp.ltlp21b) {$scope.ktlp.ltlp21b = AppService.deNormalisasiDataJam($scope.ktlp.ltlp21b);}

            // if($scope.ktlp.ltlp23a) {$scope.ktlp.ltlp23a = new Date($scope.ktlp.ltlp23a); }
            // if($scope.ktlp.ltlp23b) {$scope.ktlp.ltlp23b = AppService.deNormalisasiDataJam($scope.ktlp.ltlp23b);}
            // if($scope.ktlp.ltlp27a) {$scope.ktlp.ltlp27a = new Date($scope.ktlp.ltlp27a); }
            // if($scope.ktlp.ltlp27b) {$scope.ktlp.ltlp27b = AppService.deNormalisasiDataJam($scope.ktlp.ltlp27b);}

            // if($scope.ktlp.ltlp29a) {$scope.ktlp.ltlp29a = new Date($scope.ktlp.ltlp29a); }
            // if($scope.ktlp.ltlp29b) {$scope.ktlp.ltlp29b = AppService.deNormalisasiDataJam($scope.ktlp.ltlp29b);}
            // if($scope.ktlp.ltlp33a) {$scope.ktlp.ltlp33a = new Date($scope.ktlp.ltlp33a); }
            // if($scope.ktlp.ltlp33b) {$scope.ktlp.ltlp33b = AppService.deNormalisasiDataJam($scope.ktlp.ltlp33b);}

            $scope.ktlp.idrt = $rootScope.dataRT.idrt;
        });

        AppService.getTglWawancaraPlusSatu(true).then(function(val) {
            $scope.tglWawancara = val;
        });

        $scope.cekNoTelpResponden = function(val) {
            if (val == 1) {
                $scope.ktlp.rww03 = $rootScope.dataRT.krt03; // no telp
            }
        }

        /* Validasi Allow Save*/
        $scope.kSmsAllowSave = function(){
            var ktlp = $scope.ktlp;
            var allow = ktlp.idrt && ktlp.sms01 && ktlp.sms02 && ktlp.sms03 && ktlp.sms04 && ktlp.status_sms;
                        // jika berhasil
                        if (ktlp.sms03 == 1) { allow = allow && ktlp.sms05a && ktlp.sms05b; }
                        // jika menolak
                        if (ktlp.sms03 == 2) { allow = allow && ktlp.sms06; }
                        // jika tidak merespon
                        if (ktlp.sms03 == 3) {
                            allow = allow && ktlp.sms07;
                            if (ktlp.sms07 == 98) { allow = ktlp.sms07a; }
                        }
                        
            return allow;
        }

        $scope.kWaAllowSave = function(){
            var ktlp = $scope.ktlp;
            var allow = ktlp.idrt && ktlp.wa01 && ktlp.wa02 && ktlp.wa03 && ktlp.wa04 && ktlp.status_wa;
                        // jika berhasil
                        if (ktlp.wa03 == 1) { allow = allow && ktlp.wa05a && ktlp.wa05b; }
                        // jika menolak
                        if (ktlp.wa03 == 2) { allow = allow && ktlp.wa06; }
                        // jika tidak merespon
                        if (ktlp.wa03 == 3) {
                            allow = allow && ktlp.wa07;
                            if (ktlp.wa07 == 98) { allow = ktlp.wa07a; }
                        }
                        
            return allow;
        }

        $scope.kT1AllowSave = function(){
            var ktlp = $scope.ktlp;
            var allow = ktlp.idrt && ktlp.tlp01 && ktlp.tlp02 && ktlp.tlp03 && ktlp.tlp04 && ktlp.status_telp_1;
                        // jika berhasil
                        if (ktlp.tlp03 == 1) { allow = allow && ktlp.tlp05a && ktlp.tlp05b; }
                        // jika menolak
                        if (ktlp.tlp03 == 2) { allow = allow && ktlp.tlp06; }
                        // jika tidak merespon
                        if (ktlp.tlp03 == 3) {
                            allow = allow && ktlp.tlp07;
                            if (ktlp.tlp07 == 98) { allow = ktlp.tlp07a; }
                        }
                        
            return allow;
        }

        $scope.kT2AllowSave = function(){
            var ktlp = $scope.ktlp;
            var allow = ktlp.idrt && ktlp.tlp08 && ktlp.tlp09 && ktlp.tlp10 && ktlp.status_telp_2;
                        // jika berhasil
                        if (ktlp.tlp09 == 1) { allow = allow && ktlp.tlp11a && ktlp.tlp11b; }
                        // jika menolak
                        if (ktlp.tlp09 == 2) { allow = allow && ktlp.tlp12; }
                        // jika tidak merespon
                        if (ktlp.tlp09 == 3) {
                            allow = allow && ktlp.tlp13;
                            if (ktlp.tlp13 == 98) { allow = ktlp.tlp13a; }
                        }
                        
            return allow;
        }

        $scope.kT3AllowSave = function(){
            var ktlp = $scope.ktlp;
            var allow = ktlp.idrt && ktlp.tlp14 && ktlp.tlp15 && ktlp.tlp16 && ktlp.status_telp_3;
                        // jika berhasil
                        if (ktlp.tlp15 == 1) { allow = allow && ktlp.tlp17a && ktlp.tlp17b; }
                        // jika menolak
                        if (ktlp.tlp15 == 2) { allow = allow && ktlp.tlp18; }
                        // jika tidak merespon
                        if (ktlp.tlp15 == 3) {
                            allow = allow && ktlp.tlp19;
                            if (ktlp.tlp19 == 98) { allow = ktlp.tlp19a; }
                        }
                        
            return allow;
        }

        $scope.kT4AllowSave = function(){
            var ktlp = $scope.ktlp;
            var allow = ktlp.idrt && ktlp.tlp20 && ktlp.tlp21 && ktlp.tlp22 && ktlp.status_telp_4;
                        // jika berhasil
                        if (ktlp.tlp21 == 1) { allow = allow && ktlp.tlp23a && ktlp.tlp23b; }
                        // jika menolak
                        if (ktlp.tlp21 == 2) { allow = allow && ktlp.tlp24; }
                        // jika tidak merespon
                        if (ktlp.tlp21 == 3) {
                            allow = allow && ktlp.tlp25;
                            if (ktlp.tlp25 == 98) { allow = ktlp.tlp25a; }
                        }
                        
            return allow;
        }

        $scope.kT5AllowSave = function(){
            var ktlp = $scope.ktlp;
            var allow = ktlp.idrt && ktlp.tlp26 && ktlp.tlp27 && ktlp.tlp28 && ktlp.status_telp_5;
                        // jika berhasil
                        if (ktlp.tlp27 == 1) { allow = allow && ktlp.tlp29a && ktlp.tlp29b; }
                        // jika menolak
                        if (ktlp.tlp27 == 2) { allow = allow && ktlp.tlp30; }
                        // jika tidak merespon
                        if (ktlp.tlp27 == 3) {
                            allow = allow && ktlp.tlp31;
                            if (ktlp.tlp31 == 98) { allow = ktlp.tlp30a; }
                        }
                        
            return allow;
        }

        $scope.lTLP1AllowSave = function(){
            var ktlp = $scope.ktlp;
            var allow = ktlp.idrt && ktlp.ltlp01 && ktlp.ltlp02a && ktlp.ltlp02b && ktlp.ltlp03 &&
                        ktlp.ltlp04 && ktlp.ltlp05 && ktlp.ltlp06 && ktlp.ltlp07 && ktlp.ltlp08 && ktlp.ltlp10;
                        //jika wawancara reschedule
                        if (ktlp.ltlp08 == 2) {
                            allow = allow && ktlp.ltlp09a && ktlp.ltlp09b;
                        }
                        
            return allow;
        }

        $scope.lTLP2AllowSave = function(){
            var ktlp = $scope.ktlp;
            var allow = ktlp.ltlp11a && ktlp.ltlp11b && ktlp.ltlp12 && 
                        ktlp.ltlp13 && ktlp.ltlp14 && ktlp.ltlp16;
                        //jika wawancara reschedule
                        if (ktlp.ltlp14 == 2) {
                            allow = allow && ktlp.ltlp15a && ktlp.ltlp15b;
                        }
                        
            return allow;
        }

        $scope.lTLP3AllowSave = function(){
            var ktlp = $scope.ktlp;
            var allow = ktlp.ltlp17a && ktlp.ltlp17b && ktlp.ltlp18 && 
                        ktlp.ltlp19 && ktlp.ltlp20 && ktlp.ltlp22;
                        //jika wawancara reschedule
                        if (ktlp.ltlp20 == 2) {
                            allow = allow && ktlp.ltlp21a && ktlp.ltlp21b;
                        }
                        
            return allow;
        }

        $scope.lTLP4AllowSave = function(){
            var ktlp = $scope.ktlp;
            var allow = ktlp.ltlp23a && ktlp.ltlp23b && ktlp.ltlp24 && 
                        ktlp.ltlp25 && ktlp.ltlp26 && ktlp.ltlp28;
                        //jika wawancara reschedule
                        if (ktlp.ltlp26 == 2) {
                            allow = allow && ktlp.ltlp27a && ktlp.ltlp27b;
                        }
                        
            return allow;
        }

        $scope.lTLP5AllowSave = function(){
            var ktlp = $scope.ktlp;
            var allow = ktlp.ltlp29a && ktlp.ltlp29b && ktlp.ltlp30 && 
                        ktlp.ltlp31 && ktlp.ltlp32 && ktlp.ltlp34;
                        //jika wawancara reschedule
                        if (ktlp.ltlp32 == 2) {
                            allow = allow && ktlp.ltlp33a && ktlp.ltlp33b;
                        }
                        
            return allow;
        }

        $scope.rewardAllowSave = function(){
            var ktlp = $scope.ktlp;
            var allow = ktlp.rww01 && ktlp.rww04 && ktlp.rww02 && ktlp.rww03;
                        
            return allow;
        }

        

        /* Kesimpulan Konfirmasi SMS */
        $scope.status_konfirmasi_sms = function(val){
            var ktlp = $scope.ktlp;
            if (val == 1) {
                $scope.ktlp.status_sms = 'berhasil';
            }else if (val == 2) {
                $scope.ktlp.status_sms = 'responden menolak';
            }else if (val == 3) {
                $scope.ktlp.status_sms = 'tidak ada respon';
            }
        };

        /* Kesimpulan Konfirmasi WA */
        $scope.status_konfirmasi_wa = function(val){
            var ktlp = $scope.ktlp;
            if (val == 1) {
                $scope.ktlp.status_wa = 'berhasil';
            }else if (val == 2) {
                $scope.ktlp.status_wa = 'responden menolak';
            }else if (val == 3) {
                $scope.ktlp.status_wa = 'tidak ada respon';
            }
        };

        /* Kesimpulan Konfirmasi Telpon #1*/
        $scope.status_konfirmasi_telp_1 = function(val){
            var ktlp = $scope.ktlp;
            if (val == 1) {
                $scope.ktlp.status_telp_1 = 'berhasil';
            }else if (val == 2) {
                $scope.ktlp.status_telp_1 = 'responden menolak';
            }else if (val == 3) {
                $scope.ktlp.status_telp_1 = 'tidak ada respon pada telepon pertama';
            }
        };

        /* Kesimpulan Konfirmasi Telpon #2*/
        $scope.status_konfirmasi_telp_2 = function(val){
            var ktlp = $scope.ktlp;
            if (val == 1) {
                $scope.ktlp.status_telp_2 = 'berhasil';
            }else if (val == 2) {
                $scope.ktlp.status_telp_2 = 'responden menolak';
            }else if (val == 3) {
                $scope.ktlp.status_telp_2 = 'tidak ada respon pada telepon kedua';
            }
        };

        /* Kesimpulan Konfirmasi Telpon #3*/
        $scope.status_konfirmasi_telp_3 = function(val){
            var ktlp = $scope.ktlp;
            if (val == 1) {
                $scope.ktlp.status_telp_3 = 'berhasil';
            }else if (val == 2) {
                $scope.ktlp.status_telp_3 = 'responden menolak';
            }else if (val == 3) {
                $scope.ktlp.status_telp_3 = 'tidak ada respon pada telepon ketiga';
            }
        };

        /* Kesimpulan Konfirmasi Telpon #4*/
        $scope.status_konfirmasi_telp_4 = function(val){
            var ktlp = $scope.ktlp;
            if (val == 1) {
                $scope.ktlp.status_telp_4 = 'berhasil';
            }else if (val == 2) {
                $scope.ktlp.status_telp_4 = 'responden menolak';
            }else if (val == 3) {
                $scope.ktlp.status_telp_4 = 'tidak ada respon pada telepon keempat';
            }
        };

        /* Kesimpulan Konfirmasi Telpon #5*/
        $scope.status_konfirmasi_telp_5 = function(val){
            var ktlp = $scope.ktlp;
            if (val == 1) {
                $scope.ktlp.status_telp_5 = 'berhasil';
            }else if (val == 2) {
                $scope.ktlp.status_telp_5 = 'responden menolak';
            }else if (val == 3) {
                $scope.ktlp.status_telp_5 = 'tidak ada respon pada telepon kelima';
            }
        };


        $scope.saveKonfirmasi = function(curMenu, toMenu, ktlp) {
            $rootScope.$broadcast('saving:show');
            AppService.saveKonfirmasiEnum(ktlp).then(function(data) {
                $rootScope.$broadcast('saving:hide');
                $rootScope.$broadcast('loading:show');
                $timeout(function() {
                    $rootScope.$broadcast('loading:hide');
                    if ($rootScope.dataRT.start_in_wave_rt === 5) {
                        $state.go('app.art'); // jika RUTA baru, Cover di skip
                    }else if(curMenu == 'sms' && toMenu == 'berhasil'){ // setuju wawancara
                        $scope.tab_sms = false;
                        $scope.tab_ltlp_1 = true;
                    }else if(curMenu == 'sms' && toMenu == 'gagal'){ // menolak wawancara
                        $scope.tab_sms = false;
                        $state.go('app.home');
                    }else if(curMenu == 'sms' && toMenu == 'no respon'){ // no respon
                        $scope.tab_sms =  false;
                        $scope.tab_wa = true;
                    }else if(curMenu == 'wa' && toMenu == 'berhasil'){ // setuju wawancara
                        $scope.tab_wa = false;
                        $scope.tab_ltlp_1 = true;
                    }else if(curMenu == 'wa' && toMenu == 'gagal'){ // menolak wawancara
                        $scope.tab_wa = false;
                        $state.go('app.home');
                    }else if(curMenu == 'wa' && toMenu == 'no respon'){ // no respon
                        $scope.tab_wa = false;
                        $scope.tab_tlp_1 = true;
                    }else if(curMenu == 'telp1' && toMenu == 'berhasil'){ // setuju wawancara
                        $scope.tab_tlp_1 = false;
                        $scope.tab_ltlp_1 = true;
                    }else if(curMenu == 'telp1' && toMenu == 'gagal'){ // menolak wawancara
                        $scope.tab_tlp_1 = false;
                        $state.go('app.home');
                    }else if(curMenu == 'telp1' && toMenu == 'no respon'){ // no respon
                        $scope.tab_tlp_1 = false;
                        $scope.tab_tlp_2 = true;
                    }else if(curMenu == 'telp2' && toMenu == 'berhasil'){ // setuju wawancara
                        $scope.tab_tlp_2 = false;
                        $scope.tab_ltlp_1 = true;
                    }else if(curMenu == 'telp2' && toMenu == 'gagal'){ // menolak wawancara
                        $scope.tab_tlp_2 = false;
                        $state.go('app.home');
                    }else if(curMenu == 'telp2' && toMenu == 'no respon'){ // no respon
                        $scope.tab_tlp_2 = false;
                        $scope.tab_tlp_3 = true;
                    }else if(curMenu == 'telp3' && toMenu == 'berhasil'){ // setuju wawancara
                        $scope.tab_tlp_3 = false;
                        $scope.tab_ltlp_1 = true;
                    }else if(curMenu == 'telp3' && toMenu == 'gagal'){ // menolak wawancara
                        $scope.tab_tlp_3 = false;
                        $state.go('app.home');
                    }else if(curMenu == 'telp3' && toMenu == 'no respon'){ // no respon
                        $scope.tab_tlp_3 = false;
                        $scope.tab_tlp_4 = true;
                    }else if(curMenu == 'telp4' && toMenu == 'berhasil'){ // setuju wawancara
                        $scope.tab_tlp_4 = false;
                        $scope.tab_ltlp_1 = true;
                    }else if(curMenu == 'telp4' && toMenu == 'gagal'){ // menolak wawancara
                        $scope.tab_tlp_4 = false;
                        $state.go('app.home');
                    }else if(curMenu == 'telp4' && toMenu == 'no respon'){ // no respon
                        $scope.tab_tlp_4 = false;
                        $scope.tab_tlp_5 = true;
                    }else if(curMenu == 'telp5' && toMenu == 'berhasil'){ // setuju wawancara
                        $scope.tab_tlp_5 = false;
                        $scope.tab_ltlp_1 = true;
                    }else if(curMenu == 'telp5' && toMenu == 'gagal'){ // menolak wawancara
                        $scope.tab_tlp_5 = false;
                        $state.go('app.home');
                    }else if(curMenu == 'telp5' && toMenu == 'no respon'){ // no respon
                        $scope.tab_tlp_5 = false;
                        $state.go('app.home');
                    }

                    if (curMenu == 'ltlp1' && toMenu == 'berhasil') { // berhasil
                        $scope.tab_ltlp_1 = false;
                        $scope.tab_reward = true;
                    }if (curMenu == 'ltlp1' && toMenu == 'reschedule') { // reschedule
                        $scope.tab_ltlp_1 = false;
                        $scope.tab_ltlp_2 = true;
                        // defaul data responden di telepon #2
                        $scope.ktlp.ltlp12 = $scope.ktlp.ltlp12 || $rootScope.dataRT.krt02;
                        $scope.ktlp.ltlp13 = $scope.ktlp.ltlp13 || $rootScope.dataRT.krt03;
                        
                    }if (curMenu == 'ltlp1' && toMenu == 'menolak') { // menolak
                        $scope.tab_ltlp_1 = false;
                        $state.go('app.home');
                    }

                    if (curMenu == 'ltlp2' && toMenu == 'berhasil') { // berhasil
                        $scope.tab_ltlp_2 = false;
                        $scope.tab_reward = true;
                    }if (curMenu == 'ltlp2' && toMenu == 'reschedule') { // reschedule
                        $scope.tab_ltlp_2 = false;
                        $scope.tab_ltlp_3 = true;
                        // defaul data responden di telepon #3
                        $scope.ktlp.ltlp18 = $scope.ktlp.ltlp18 || $rootScope.dataRT.krt02;
                        $scope.ktlp.ltlp19 = $scope.ktlp.ltlp19 || $rootScope.dataRT.krt03;
                    }if (curMenu == 'ltlp2' && toMenu == 'menolak') { // menolak
                        $scope.tab_ltlp_2 = false;
                        $state.go('app.home');
                    }

                    if (curMenu == 'ltlp3' && toMenu == 'berhasil') { // berhasil
                        $scope.tab_ltlp_3 = false;
                        $scope.tab_reward = true;
                    }if (curMenu == 'ltlp3' && toMenu == 'reschedule') { // reschedule
                        $scope.tab_ltlp_3 = false;
                        $scope.tab_ltlp_4 = true;
                        // defaul data responden di telepon #4
                        $scope.ktlp.ltlp24 = $scope.ktlp.ltlp24 || $rootScope.dataRT.krt02;
                        $scope.ktlp.ltlp25 = $scope.ktlp.ltlp25 || $rootScope.dataRT.krt03;
                    }if (curMenu == 'ltlp3' && toMenu == 'menolak') { // menolak
                        $scope.tab_ltlp_3 = false;
                        $state.go('app.home');
                    }

                    if (curMenu == 'ltlp4' && toMenu == 'berhasil') { // berhasil
                        $scope.tab_ltlp_4 = false;
                        $scope.tab_reward = true;
                    }if (curMenu == 'ltlp4' && toMenu == 'reschedule') { // reschedule
                        $scope.tab_ltlp_4 = false;
                        $scope.tab_ltlp_5 = true;
                        // defaul data responden di telepon #4
                        $scope.ktlp.ltlp30 = $scope.ktlp.ltlp30 || $rootScope.dataRT.krt02;
                        $scope.ktlp.ltlp31 = $scope.ktlp.ltlp31 || $rootScope.dataRT.krt03;
                    }if (curMenu == 'ltlp4' && toMenu == 'menolak') { // menolak
                        $scope.tab_ltlp_4 = false;
                        $state.go('app.home');
                    }

                    if (curMenu == 'ltlp5' && toMenu == 'berhasil') { // berhasil
                        $scope.tab_ltlp_5 = false;
                        $scope.tab_reward = true;
                    }if (curMenu == 'ltlp5' && toMenu == 'reschedule') { // reschedule
                        $scope.tab_ltlp_5 = false;
                        // defaul data responden di telepon #5
                        $scope.ktlp.ltlp30 = $scope.ktlp.ltlp30 || $rootScope.dataRT.krt02;
                        $scope.ktlp.ltlp31 = $scope.ktlp.ltlp31 || $rootScope.dataRT.krt03;
                        $state.go('app.home');
                    }if (curMenu == 'ltlp5' && toMenu == 'menolak') { // menolak
                        $scope.tab_ltlp_5 = false;
                        $state.go('app.home');
                    }

                    if (curMenu == 'reward' && toMenu == 'reward') { // reward
                        $state.go('app.icftu');
                    }else{
                        $scope[curMenu] = false;
                        $scope[toMenu] = true;
                    }
                }, 300);
            });
        };

        $scope.goART = function(){
            $state.go('app.art');
        }

    }
})();
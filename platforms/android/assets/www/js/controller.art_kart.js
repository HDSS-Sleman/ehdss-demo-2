(function() {
    angular.module('ehdss')
        .controller('ArtKartCtrl', ArtKartCtrl);

    ArtKartCtrl.$inject = ['$scope', '$state', '$rootScope', '$timeout', 'AppService'];

    function ArtKartCtrl($scope, $state, $rootScope, $timeout, AppService) {
        var art_kart = {};
        $scope.art_kart = art_kart;
        $scope.agama = AppService.listAgama();
        $scope.pekerjaan = AppService.listPekerjaan();
        $scope.listpendidikan = AppService.listPendidikan();
        $scope.suku = AppService.listSuku();
        $scope.statusKawin = AppService.listStatusKawin();
        $scope.listHubRT = AppService.listHubRT();
        $scope.pendidikan = true;

        if ($rootScope.editStatus === 'new') {
            // inisialisasi data
            $scope.art_kart.art36 = 1;
            $scope.art_kart.art00 = AppService.getNextNoUrutARTB($rootScope.dataART);
            $scope.art_kart.art03b = parseInt($rootScope.dataRT.idrt + '' + AppService.zeroPad($scope.art_kart.art00, 2)); //no id individu dikasih zero pad (angka 0 di depan)
            
            $scope.allListIDART = $rootScope.idart_terpakai || []; // list idrt yang sudah terpakai di ruta (ambil dari art.js)
            for(var key in $scope.allListIDART){
                $scope.allListIDART[key] = Number($scope.allListIDART[key]); // ubah IDART menjadi int
            }

            $scope.idart_tersedia = !$scope.allListIDART.includes($scope.art_kart.art03b);

            $scope.art_kart.idrt = $rootScope.dataRT.idrt;
            // cek listHubRT
            var dataART = $rootScope.dataART;
                dataART.forEach(function(val,idx){
                    if ($scope.art_kart.art03b != val.art03b && val.art02 == 1) { //jika ada ART lain yg sudah jadi KK
                        $scope.listHubRT = AppService.listHubRT2();
                    }
                });
        } else {
            $scope.idart_tersedia = true;
            idrt = $rootScope.curART.idrt;
            idart = $rootScope.curART.art03b;
            AppService.getDataKel(idrt, 'art_kart', idart).then(function(data) {
                // cek listHubRT
                var dataART = $rootScope.dataART;
                    dataART.forEach(function(val,idx){
                        if (idart != val.art03b && val.art02 == 1) { //jika ada ART lain yg sudah jadi KK
                            $scope.listHubRT = AppService.listHubRT2();
                        }
                    });
                $scope.art_kart = data || {};
                $scope.art_kart.art09 = ''+$scope.art_kart.art09; // No. Urut Pasangan Pertama 
                $scope.art_kart.art10 = ''+$scope.art_kart.art10; // No. Urut Pasangan Kedua
                $scope.art_kart.art11 = ''+$scope.art_kart.art11; // No. Urut Ayah
                $scope.art_kart.art12 = ''+$scope.art_kart.art12; // No. Urut Ibu

                // Jika Tidak tahu tgl lahir
                if ($scope.art_kart.art05a == 2) {
                    if ($scope.art_kart.art06a) { // thn diisi
                        $scope.umur = $scope.art_kart.art06a;
                    } else {
                        $scope.umur = 0;
                    }
                } else {
                    if ($scope.art_kart.art05) {
                        var thn = AppService.getAge($scope.art_kart.art05);
                        // artb.artb06a = thn;
                        $scope.umur = thn;
                    } else {
                        $scope.umur = '';
                    }
                }
            });
            $scope.idart_tersedia = true; // jika edit, status idart dibuat true
        }

        var show_start_in_wave_art = false;
        
        $scope.generateIdartNew = function(art03b) {
            $scope.art_kart.art03b = art03b + 1;
            $scope.idart_tersedia = !$rootScope.idart_terpakai.includes($scope.art_kart.art03b);
            console.log($scope.idart_tersedia);
        };

        // $scope.curART = $rootScope.curART;
        $scope.calcUmur = function() {
            // Jika Tidak tahu tgl lahir
            if ($scope.art_kart.art05a == 2) {
                if ($scope.art_kart.art06a) { // thn diisi
                    $scope.umur = $scope.art_kart.art06a;
                } else {
                    $scope.umur = 0;
                }
            } else {
                if ($scope.art_kart.art05) {
                    var thn = AppService.getAge($scope.art_kart.art05);
                    // artb.artb06a = thn;
                    $scope.umur = thn;
                } else {
                    $scope.umur = '';
                }
            }
        };

        $scope.waktuPendidikan = function(waktu){
            $scope.pendidikan = waktu <= $scope.umur && waktu > 0;
        }

        $scope.cekJKN = function(param){
            if (param == 'art20_01') {
                $scope.art_kart.art20_02 = '2'; $scope.art_kart.art20_03 = '2'; $scope.art_kart.art20_04 = '2'; $scope.art_kart.art20_05 = '2';
            }else  if (param == 'art20_02') {
                $scope.art_kart.art20_01 = '2'; $scope.art_kart.art20_03 = '2'; $scope.art_kart.art20_04 = '2'; $scope.art_kart.art20_05 = '2';
            }else if (param == 'art20_03') {
                $scope.art_kart.art20_02 = '2'; $scope.art_kart.art20_01 = '2'; $scope.art_kart.art20_04 = '2'; $scope.art_kart.art20_05 = '2';
            }else if (param == 'art20_04') {
                $scope.art_kart.art20_02 = '2'; $scope.art_kart.art20_03 = '2'; $scope.art_kart.art20_01 = '2'; $scope.art_kart.art20_05 = '2';
            }else if (param == 'art20_05' == 1) {
                $scope.art_kart.art20_02 = '2'; $scope.art_kart.art20_03 = '2'; $scope.art_kart.art20_04 = '2'; $scope.art_kart.art20_01 = '2';
            }
        }
        
        AppService.getTglWawancaraPlusSatu(true).then(function(val) {
            $scope.tglMaxEntry = val;
            $scope.tglLhrMax = val;
        });
        
        //Agar tidak bisa mengetik '*','+' dan '-'//
        // $scope.onlyNumber = function() {
        //     var onlyNumber = event.charCode >= 48 && event.charCode <= 57;
        //     return onlyNumber;
        // }
        //
        // $scope.getIDI = function(no_urut) {
        //     artb.artb03b = $rootScope.dataRT.idrt + '' + AppService.zeroPad(no_urut, 2);
        // };
        $scope.save = function(param,art_kart) {
            $rootScope.$broadcast('saving:show');
            $scope.art_kart.start_in_wave_art = parseInt($rootScope.t_siklus);
            
            AppService.saveDataKelSikSatu('art_kart', $scope.art_kart).then(function(data) {
                $rootScope.$broadcast('saving:hide');
                $rootScope.$broadcast('loading:show');
                $timeout(function() {
                    $rootScope.$broadcast('loading:hide');
                    if (param === 'utama') {
                        /* Jika wawancara berhenti di tengah jalan*/
                        $rootScope.catatanModulUtama = true; //param untuk catatan modul utama
                        $rootScope.catatanModulB = false; //param untuk catatan modul B
                        $rootScope.tab_catatan = true; // langsung buka tab catatan
                        $rootScope.tab_cover = false; // tab cover di hide dulu
                        $state.go('app.art_cover'); // ke laporan waancara utama
                    }else{
                        $state.go('app.art');
                    }
                    
                }, 300);
            });
        };

        $scope.allowSave = function(myForm) {
            var art_kart = $scope.art_kart || {};
            var allow = art_kart.idrt && art_kart.art00 && art_kart.art03b && art_kart.art04 && art_kart.art01 && art_kart.art02 && art_kart.art24;
                        
                        // jika ART merupakan bayi lahir hidup/mati dari ART HDSS
                        if (art_kart.art24 == 3) { 
                            allow = allow && art_kart.art21a;
                            if (art_kart.art21a == 2) { // jika bayi meninggal
                                allow = allow && art_kart.art21b && art_kart.art21ex && art_kart.art04 && art_kart.art11 && art_kart.art12 && art_kart.art14 && art_kart.art15;
                                if (art_kart.art21ex == 1) {
                                    allow = allow && art_kart.art21e;
                                }else if (art_kart.art21ex == 2) {
                                    allow = allow && art_kart.art21ep;
                                }
                            }
                        }

                        // jika ART bukan bayi lahir hidup/mati dari ART HDSS 
                        // atau jika keberadaan bayi lahir hidup/mati dari ART HDSS ada
                        if (art_kart.art24 == '0' || art_kart.art21a == 1) {
                            allow = art_kart.art03a && (art_kart.art05 || art_kart.art05a) && 
                                    art_kart.art16a && art_kart.art16 && art_kart.art18 && 
                                    art_kart.art19 && art_kart.art23;
                            // jika perempuan & umur 10-54 maka harus isi status kehamilan
                            if ((art_kart.art04 == 2) && ($scope.umur >= 10) && ($scope.umur <= 54)) {
                                allow = allow && art_kart.art22;
                            }
                            // jika tgl lahir tahu
                            if(art_kart.art05a == 1){
                                allow = allow && art_kart.art05b;
                            }
                            // jika sumber informasi tgl lahir lainnya, sebutkan
                            if (art_kart.art05b == 5) {
                                allow = allow && art_kart.art05b1;
                            }
                            // jika tgl lahir tidak tahu
                            if(art_kart.art05a == 2){
                                allow = allow && (art_kart.art06a || art_kart.art06b || art_kart.art06c);
                            }
                            // jika status belum kawin
                            if(art_kart.art07 == 1){
                                allow = allow && art_kart.art11 && art_kart.art12 && art_kart.art13 && art_kart.art14 && art_kart.art15;
                            }
                            // jika status kawin, cerai hidup, cerai mati
                            if(art_kart.art07 > 1 && art_kart.art07 < 98){
                                allow = allow && art_kart.art08b && art_kart.art08d
                                        && art_kart.art11 && art_kart.art12 && art_kart.art13 && art_kart.art14 && art_kart.art15;
                                        
                                        if (art_kart.art08b == 1) {
                                            allow = allow && art_kart.art08a;
                                        }else if (art_kart.art08b == 2) {
                                            allow = allow && art_kart.art08ap;
                                        }

                                        if (art_kart.art08d == 1) {
                                            allow = allow && art_kart.art08c;
                                        }
                                        // jika status kawin
                                        if(art_kart.art07 == 2){
                                            allow = allow && art_kart.art09 && art_kart.art10;
                                        }
                            }
                            // jika ada riwayat pendidikan
                            if(art_kart.art16 > 1 && art_kart.art16 < 98){
                                allow = allow && art_kart.art17;
                            }
                            // jika pekerjaan utama lainnya
                            if(art_kart.art18 == 95){
                                allow = allow && art_kart.art18a;
                            }
                            // jika memiliki pekerjaan
                            if(art_kart.art18 > 1){
                                allow = allow && art_kart.art18b;
                            }
                            // jika memiliki asuransi kesehatan
                            if(art_kart.art19 == 1){
                                allow = allow && (art_kart.art20_01 && art_kart.art20_02 && art_kart.art20_03 && art_kart.art20_04 && art_kart.art20_05 && art_kart.art20_06 && art_kart.art20_07 && art_kart.art20_08 && art_kart.art20_09 && art_kart.art20_10 && art_kart.art20_11 && art_kart.art20_95 && art_kart.art20_98);
                                // jika asuransi kesehatan lainnya
                                if(art_kart.art20_95 == 1){
                                    allow = allow && art_kart.art20_95a;
                                }
                            }
                        }

                            
            return allow && myForm.$valid && $scope.idart_tersedia == true;
        };

        $scope.cariPekerjaan = function(filterPekerjaan){
            $scope.listPekerjaanNew = AppService.cariListPekerjaan(filterPekerjaan);
            $scope.listPekerjaanNew = $scope.listPekerjaanNew.slice(0, 5);
            $scope.tampilkan_list = true; // tampilkan list
        }

        $scope.setPekerjaan = function(val){
            $scope.tampilkan_list = false; // hidden list
            $scope.art_kart.art18a = val;
        }
        
    }
})();
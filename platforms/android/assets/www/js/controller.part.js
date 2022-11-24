(function() {
    angular.module('ehdss')
        .controller('PartCtrl', PartCtrl);

    PartCtrl.$inject = ['$scope', '$state', '$rootScope', '$timeout', 'AppService'];

    function PartCtrl($scope, $state, $rootScope, $timeout, AppService) {

        $scope.agama = AppService.listAgama();
        $scope.pekerjaan = AppService.listPekerjaan();
        $scope.listpendidikan = AppService.listPendidikan();
        $scope.suku = AppService.listSuku();
        $scope.statusKawin = AppService.listStatusKawin();
        $scope.listHubRT = AppService.listHubRT();
        
        var curART = $rootScope.curART;
        var idrt = curART.idrt;
        var idart = curART.art03b;
        $scope.intdate = AppService.getTglIndo(curART.intdate);
        $scope.tglWwnTerakhir = curART.intdate;
        $scope.ada_umur = !isNaN(curART.umur) ? 1 : 2;

        $scope.curART = curART;
        $scope.curART._nama = curART.art01;

        // untuk menyingkat penulisan di HTML
        $scope.idKwn = curART.idStatusKawin;
        $scope.statusKawin = curART.statusKawin;

        // jika ada sumber informasi tgl lahir
        if (curART.art05b) {
            $scope.infoTglLahir = AppService.getSumberTglLahir(curART.art05b);
        }

        if (curART.sedangHamil == 'Ya') {
            $scope.statusHamil = 'Hamil';
        }else{
            $scope.statusHamil = 'Tidak Hamil';
        }
        
        $scope.part = {};
        $scope.pb = {};

        AppService.getDataKel(idrt, 'part', idart).then(function(data) {
            
            // cek listHubRT
            $scope.listHubRT = AppService.listHubRT();
            var dataART = $rootScope.dataART;
                dataART.forEach(function(val,idx){
                    idart_val = val.art03b || val.artb03b;
                    hubrt_val = val.art02 || val.artb02;
                    if ((idart != idart_val) && (hubrt_val == 1)) { //jika ada ART lain yg sudah jadi KK
                        $scope.listHubRT = AppService.listHubRT2();
                    }
                });
            // jika tanggal lahir ada
            if ($scope.curART.art05) {
                $scope.tglLahir = AppService.getTglIndo($scope.curART.art05);
            }else{
                $scope.tglLahir = '(Tanggal lahir belum tercatat. Pilih jawaban tidak, lalu tanyakan tanggal lahir)';
            }
            
            $scope.part = data || {};

            $scope.part.art00 = curART.art00;
            $scope.part.part02 = '' + curART.art02;
            $scope.ada = (curART.ket_kbr == 1) || false;
            // jika belum ada data part, ambil dari curART
            $scope.part.part03 = $scope.part.part03 || $scope.curART.art21a;
            $scope.part.part16a = $scope.part.part16a || $scope.curART.art16a;
            $scope.part.part18 = $scope.part.part18 || ''+$scope.curART.art16;
            $scope.part.part18b = $scope.part.part18b || ''+$scope.curART.art18b;
            $scope.part.part19 = $scope.part.part19 || $scope.curART.art17;
            if ($scope.part.part20) {
                $scope.part.part20 = ''+$scope.part.part20; // AppService.getPekerjaan($scope.part.part20);
            }else{
                $scope.part.part20 = ''+$scope.curART.art18; // AppService.getPekerjaan($scope.curART.art18);
            }
            
            $scope.part.part20lain = $scope.part.part20lain || $scope.curART.art18a;
            $scope.part.part21 = $scope.part.part21 || ''+$scope.curART.art19;
            $scope.part.part04a = ($scope.part.part04a) || ''+$scope.curART.art21b;
            $scope.part.part04b = ($scope.part.part04b) || ''+$scope.curART.art21c;
            $scope.part.part04c = ($scope.part.part04c) || ''+$scope.curART.art21d;

            // jika tahu tanggal kejadian migrasi
            if (!$scope.part.part04d && !$scope.curART.art21e) {
                $scope.part.part04dx = '2';
            }else{
                $scope.part.part04d = ($scope.part.part04d) || (new Date($scope.curART.art21e));
                $scope.part.part04dx = '1';
            }

            $scope.part.part2201 = $scope.part.part2201 || $scope.curART.art20_01;
            $scope.part.part2202 = $scope.part.part2202 || $scope.curART.art20_02;
            $scope.part.part2203 = $scope.part.part2203 || $scope.curART.art20_03;
            $scope.part.part2204 = $scope.part.part2204 || $scope.curART.art20_04;
            $scope.part.part2205 = $scope.part.part2205 || $scope.curART.art20_05;
            $scope.part.part2206 = $scope.part.part2206 || $scope.curART.art20_06;
            $scope.part.part2207 = $scope.part.part2207 || $scope.curART.art20_07;
            $scope.part.part2208 = $scope.part.part2208 || $scope.curART.art20_08;
            $scope.part.part2209 = $scope.part.part2209 || $scope.curART.art20_09;
            $scope.part.part2210 = $scope.part.part2210 || $scope.curART.art20_10;
            $scope.part.part2211 = $scope.part.part2211 || $scope.curART.art20_11;
            $scope.part.part2295 = $scope.part.part2295 || $scope.curART.art20_95;
            $scope.part.part2295a = $scope.part.part2295a || $scope.curART.art20_95a;
            $scope.part.part2298 = $scope.part.part2298 || $scope.curART.art20_98;
            $scope.part.part40 = $scope.part.part40 || $scope.curART.art22;
            if ($scope.part.part19) {
                $scope.pendidikan = ($scope.curART.umur >= $scope.part.part19)|| ($scope.part.part19 == 98) || (part.part03 == 2) || (part.part06a) || (part.part06a1) || (part.part06ax);
            }

            // jika ada tanggal kejadian meninggal/migrasi
            if ($scope.part.part04d || $scope.part.part04dp) {
                var tglKejadian = $scope.part.part04d || $scope.part.part04dp;
                var lastWawancara = new Date(curART.intdate);
                if (tglKejadian < lastWawancara) {
                    $scope.tglKejadianArtTidakAda = false;
                }else{
                    $scope.tglKejadianArtTidakAda = true;
                }

                $scope.tglKejadian = AppService.getTglIndo(AppService.normalisasiData__(tglKejadian));

            }
   
        });

        // get data PB untuk mengeluarkan tgl lahir
        AppService.getDataKel(idrt, 'pb', idart).then(function(data) {
                $scope.pb = data || {};
            });
        // simpan perubahan tgl lahir ke PB
        $scope.savePB = function(art05_ed,art05b_ed,art05b1_ed){
            AppService.getDataKel(idrt, 'pb', idart).then(function(data) {
                $scope.pb = data || {};
                if (art05_ed) { $scope.pb.art05_ed = art05_ed; }
                if (art05b_ed) { $scope.pb.art05b_ed = art05b_ed; }
                if (art05b1_ed) { $scope.pb.art05b1_ed = art05b1_ed; }

                AppService.saveDataKel('pb', $scope.pb, false).then(function(data) { /*filter dibuat false*/
                
                });
            });

        }

        AppService.getTglWawancaraNow(true).then(function(val) {
            $scope.tglMaxEntry = val;
        })

        $scope.cekTglKejadianArtTidakAda = function(){
            if ($scope.part.part04d || $scope.part.part04dp) {
                var tglKejadian = $scope.part.part04d || $scope.part.part04dp;
                var lastWawancara = new Date(curART.intdate);
                if (tglKejadian < lastWawancara) {
                    $scope.tglKejadianArtTidakAda = false;
                }else{
                    $scope.tglKejadianArtTidakAda = true;
                }

                $scope.tglKejadian = AppService.getTglIndo(AppService.normalisasiData__(tglKejadian));

            }
        }

        $scope.cekJKN = function(param){
            if (param == 'part2201') {
                $scope.part.part2202 = '2'; $scope.part.part2203 = '2'; $scope.part.part2204 = '2'; $scope.part.part2205 = '2';
            }else  if (param == 'part2202') {
                $scope.part.part2201 = '2'; $scope.part.part2203 = '2'; $scope.part.part2204 = '2'; $scope.part.part2205 = '2';
            }else if (param == 'part2203') {
                $scope.part.part2202 = '2'; $scope.part.part2201 = '2'; $scope.part.part2204 = '2'; $scope.part.part2205 = '2';
            }else if (param == 'part2204') {
                $scope.part.part2202 = '2'; $scope.part.part2203 = '2'; $scope.part.part2201 = '2'; $scope.part.part2205 = '2';
            }else if (param == 'part2205' == 1) {
                $scope.part.part2202 = '2'; $scope.part.part2203 = '2'; $scope.part.part2204 = '2'; $scope.part.part2201 = '2';
            }
        }
        $scope.updateUmur = function(umurTaksiran){
            if ($scope.part.part19) {
                $scope.pendidikan = (umurTaksiran >= $scope.part.part19) && umurTaksiran > 0;
            }else{
                $scope.pendidikan = true;
            }
        }
        $scope.waktuPendidikan = function(waktu){
            if ($scope.pb.art05_ed) {
                $scope.pendidikan = (AppService.getAge($scope.pb.art05_ed) >= waktu) && waktu > 0;
                console.log(AppService.getAge($scope.pb.art05_ed));
            }else{
                $scope.pendidikan = ($scope.curART.umur >= waktu) && waktu > 0;
            }
            
        }
        $scope.save = function(param) {
            $scope.part.part = 1;
            // $scope.part.part20 = parseInt($scope.part.part20);
            $rootScope.$broadcast('saving:show');
            AppService.saveDataKel('part', $scope.part).then(function(data) {
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

        /* validasi data*/
        $scope.allowSave = function(myForm) {
            var part = $scope.part;
            var allow = part.jnsResp && part.part03;

            // jika ada perbaikan umur
            if ($scope.ada_umur == 2) {
                allow = allow && part.part06a2 && ( !isNaN(part.part06a) || !isNaN(part.part06a1) || 
                        !isNaN(part.part06ax) );
            }
            
            // jika keberadaan ada di atidak milih apakah ada perubahan
            if (curART.ket_kbr == 1) { //ket_kbr 1 ada, 2 meninggal
                allow = allow;
            }else{
                allow = allow; // part99x sudah dihapus
            }

            // ART sudah tidak ada
            if (part.part03 == 2) {
                allow = allow && part.part04a;
                // Migrasi keluar
                if (part.part04a == 2) {
                    allow = allow && part.part04b;
                    // migrasi di dalam sleman
                    if (part.part04b == 2) {
                        allow = allow && part.part04c;
                    }
                }
                // Tanggal kejadian
                allow = allow && part.part04dx;
                if (part.part04dx == 1) {
                    allow = allow && part.part04d;
                }else if (part.part04dx == 2) {
                    allow = allow && part.part04dp;
                }
                $scope.pendidikan = true;
            }
            // Jika baseline ART status sebelumnya tidak ada dan migrasi
            if ($scope.curART.art21a == 2 && $scope.curART.art21b == 2) {
                allow = allow && part.part41;
            }
            // ART masih ada
            if (part.part03 == 1) {
                allow = allow && part.part02 && part.part05 && part.part16a;

                // jika sudah bekerja
                if (part.part20 > 1) {
                    allow = allow && part.part18b;
                }

                // Ada perubahan status perkawinan
                if (part.part05 == 1) {
                    allow = allow && part.part39; 
                    if (part.part39 == 1) {
                        // status perkawinan saat ini & tgl kejadian
                        allow = allow && part.part05a && part.part05bx;  
                                if (part.part05bx == 1) {
                                    allow = allow && part.part05b;
                                }else if (part.part05bx == 2) {
                                    allow = allow && part.part05bp;
                                }
                    }else if(part.part39 == 2) {
                        //status sebelumnya dan saat ini beserta tgl kejadian
                        allow = allow && part.part05a_1 && part.part05bx_1 && part.part05a && part.part05bx;
                                if (part.part05bx == 1) {
                                    allow = allow && part.part05b;
                                }
                                if (part.part05bx_1 == 1) {
                                    allow = allow && part.part05b_1;
                                }else if (part.part05bx_1 == 2) {
                                    allow = allow && part.part05bp_1;
                                }
                    }else if(part.part39 == 3) {
                        //status paling lama, dan saat ini beserta tgl kejadian
                        allow = allow && part.part05a_2 && part.part05bx_2 &&
                                         part.part05a_1 && part.part05bx_1 &&
                                         part.part05a && part.part05bx;
                                if (part.part05bx == 1) {
                                    allow = allow && part.part05b;
                                }
                                if (part.part05bx_1== 1) {
                                    allow = allow && part.part05b_1;
                                }
                                if (part.part05bx_2 == 1) {
                                    allow = allow && part.part05b_2;
                                }else if (part.part05bx_2 == 2) {
                                    allow = allow && part.part05bp_2;
                                }
                    }
                        
                }

                // Jika Perempuan dan usia produktif konfirmasi kejadian kehamilan pada kunjungan terakhir
                if (($scope.curART._JK == 'P' || $scope.curART._jk == 'P') && ($scope.curART.umur >= 10) && ($scope.curART.umur <= 54)) {
                    allow = allow && part.part40;

                    if (part.part40 == 1) { // jika pada kungjungan HDSS kemarin hamil
                        // kehamilan sudah berakhir ?
                        allow = allow && part.part07;
                        // kehamilan berakhir
                        if (part.part07 == 1) {
                            allow = allow && part.part08a && part.part08bx &&  // kejadian berakhirnya kehamilan, apakah tau tgl
                                (part.part08b || part.part08bp); // tgl kejadian tahu / tgl kejadian perkiraan
                            // umur kehamilan
                            allow = allow && part.part08c &&
                                // penolong persalinan && metode persalinan
                                part.part09 && part.part10;

                            // Keterangan lahir hidup/mati/abrtus untuk wanita tercatat hamil Saat kunjungan terakhir dan kehamilan sudah berakhir
                            // jika lahir hidup/mati/abrtus tanyakan BB dan PB
                            if (part.part08a == 1 || part.part08a == 2 || part.part08a == 3) { 
                                // Berat badan lahir
                                allow = allow && part.part11ax; // BBL, apakah tau BBL
                                    if (part.part11ax == 1) {
                                        allow = allow && part.part11a;
                                    }
                                // Panjang badan
                                allow = allow && part.part11bx; // PBL, apakah tau PBL
                                    if (part.part11bx == 1) {
                                        allow = allow && part.part11b;
                                    }

                                allow = allow && part.part11c;
                                
                                if (part.part11c == 1) { // Jika anak yg dilahirkan lebih dari 1
                                    allow = allow && part.part11d;
                                    // anak yg dilahirkan 2 orang
                                    if (part.part11d == 2) {
                                        // Berat Badan Lahir
                                        allow = allow && part.part11ca1x;
                                        if (part.part11ca1x == 1) {
                                            allow = allow && part.part11ca1;
                                        }
                                        // Panjang badan lahir
                                        allow = allow && part.part11ca2x;
                                        if (part.part11ca2x == 1) {
                                            allow = allow && part.part11ca2;
                                        }
                                    }
                                    // anak yg dilahirkan 3 orang
                                    if (part.part11d == 3) {
                                        // Berat Badan Lahir
                                        allow = allow && part.part11cb1x;
                                        if (part.part11cb1x == 1) {
                                            allow = allow && part.part11cb1;
                                        }
                                        // Panjang badan lahir
                                        allow = allow && part.part11cb2x;
                                        if (part.part11cb2x == 1) {
                                            allow = allow && part.part11cb2;
                                        }
                                    }    
                                }
                            }
                            
                        }
                    }
                    
                    /* Setelah kunjungan terakhir apakah hamil? */    
                    allow = allow && part.part47;
                    if (part.part47 == 1) { // jika hamil, berapa kali kejadian kehamilan?
                        allow = allow && part.part48;

                        if (part.part48 == 1 || part.part48 == 2 || part.part48 == 3 || part.part48 == 4) { /* Kejadian kehamilan 1 */
                            allow = allow && part.part12_1;
                            // Saat ini masih hamil
                            if (part.part12_1 == 1) {
                                allow = allow && part.part13_1;
                                // saat ini tidak hamil (Kejadian berakhirnya kehamilan)
                                if (part.part13_1 == 2) {
                                    // mulai pengecekan
                                    allow = allow && part.part14a_1 && part.part14bx_1 && 
                                        // tanggal kejadian tahu / tanggal kejadian perkiraan
                                        (part.part14b_1 || part.part14bp_1) &&
                                        // Umur kehamilan
                                        part.part14c_1 &&
                                        // Penolong persalinan
                                        part.part15_1 &&
                                        // Metode persalinan
                                        part.part16_1;
                                    
                                    // Keterangan lahir hidup/mati/abrtus
                                    if (part.part14a_1 == 1 || part.part14a_1 == 2 || part.part14a_1 == 3) {
                                        // Berat badan lahir
                                        allow = allow && part.part17ax_1; // BBL, apakah tau BBL
                                            if (part.part17ax_1 == 1) {
                                                allow = allow && part.part17a_1;
                                            } 
                                        // Panjang badan
                                        allow = allow && part.part17bx_1; // // PBL, apakah tau PBL
                                            if (part.part17bx_1 == 1) {
                                                allow = allow && part.part17b_1;
                                            }

                                        allow = allow && part.part17c_1;
                                        
                                        if (part.part17c_1 == 1) { // Jika anak yg dilahirkan lebih dari 1
                                            allow = allow && part.part17d_1;
                                            // anak yg dilahirkan 2 orang
                                            if (part.part17d_1 == 2) {
                                                // Berat Badan Lahir
                                                allow = allow && part.part17ca1x_1;
                                                if (part.part17ca1x_1 == 1) {
                                                    allow = allow && part.part17ca1_1;
                                                }
                                                // Panjang badan lahir
                                                allow = allow && part.part17ca2x_1;
                                                if (part.part17ca2x_1 == 1) {
                                                    allow = allow && part.part17ca2_1;
                                                }
                                            }
                                            // anak yg dilahirkan 3 orang
                                            if (part.part17d_1 == 3) {
                                                // Berat Badan Lahir
                                                allow = allow && part.part17cb1x_1;
                                                if (part.part17cb1x_1 == 1) {
                                                    allow = allow && part.part17cb1_1;
                                                }
                                                // Panjang badan lahir
                                                allow = allow && part.part17cb2x_1;
                                                if (part.part17cb2x_1 == 1) {
                                                    allow = allow && part.part17cb2_1;
                                                }
                                            }  
                                        }
                                    }   
                                    
                                }
                            }
                        }

                        if (part.part48 == 2 || part.part48 == 3 || part.part48 == 4) { /* Kejadian kehamilan 2 */
                            allow = allow && part.part12_2;
                            // Saat ini masih hamil
                            if (part.part12_2 == 1) {
                                allow = allow && part.part13_2;
                                // saat ini tidak hamil (Kejadian berakhirnya kehamilan)
                                if (part.part13_2 == 2) {
                                    // mulai pengecekan
                                    allow = allow && part.part14a_2 && part.part14bx_2 && 
                                        // tanggal kejadian tahu / tanggal kejadian perkiraan
                                        (part.part14b_2 || part.part14bp_2) &&
                                        // Umur kehamilan
                                        part.part14c_2 &&
                                        // Penolong persalinan
                                        part.part15_2 &&
                                        // Metode persalinan
                                        part.part16_2;
                                    
                                    // Keterangan lahir hidup/mati/abrtus
                                    if (part.part14a_2 == 1 || part.part14a_2 == 2 || part.part14a_2 == 3) {
                                        // Berat badan lahir
                                        allow = allow && part.part17ax_2; // BBL, apakah tau BBL
                                            if (part.part17ax_2 == 1) {
                                                allow = allow && part.part17a_2;
                                            } 
                                        // Panjang badan
                                        allow = allow && part.part17bx_2; // // PBL, apakah tau PBL
                                            if (part.part17bx_2 == 1) {
                                                allow = allow && part.part17b_2;
                                            }

                                        allow = allow && part.part17c_2;
                                        
                                        if (part.part17c_2 == 1) { // Jika anak yg dilahirkan lebih dari 1
                                            allow = allow && part.part17d_2;
                                            // anak yg dilahirkan 2 orang
                                            if (part.part17d_2 == 2) {
                                                // Berat Badan Lahir
                                                allow = allow && part.part17ca1x_2;
                                                if (part.part17ca1x_2 == 1) {
                                                    allow = allow && part.part17ca1_2;
                                                }
                                                // Panjang badan lahir
                                                allow = allow && part.part17ca2x_2;
                                                if (part.part17ca2x_2 == 1) {
                                                    allow = allow && part.part17ca2_2;
                                                }
                                            }
                                            // anak yg dilahirkan 3 orang
                                            if (part.part17d_2 == 3) {
                                                // Berat Badan Lahir
                                                allow = allow && part.part17cb1x_2;
                                                if (part.part17cb1x_2 == 1) {
                                                    allow = allow && part.part17cb1_2;
                                                }
                                                // Panjang badan lahir
                                                allow = allow && part.part17cb2x_2;
                                                if (part.part17cb2x_2 == 1) {
                                                    allow = allow && part.part17cb2_2;
                                                }
                                            }  
                                        }
                                    }   
                                    
                                }
                            }
                        }

                        if (part.part48 == 3 || part.part48 == 4) { /* Kejadian kehamilan 3 */
                            allow = allow && part.part12_3;
                            // Saat ini masih hamil
                            if (part.part12_3 == 1) {
                                allow = allow && part.part13_3;
                                // saat ini tidak hamil (Kejadian berakhirnya kehamilan)
                                if (part.part13_3 == 2) {
                                    // mulai pengecekan
                                    allow = allow && part.part14a_3 && part.part14bx_3 && 
                                        // tanggal kejadian tahu / tanggal kejadian perkiraan
                                        (part.part14b_3 || part.part14bp_3) &&
                                        // Umur kehamilan
                                        part.part14c_3 &&
                                        // Penolong persalinan
                                        part.part15_3 &&
                                        // Metode persalinan
                                        part.part16_3;
                                    
                                    // Keterangan lahir hidup/mati/abrtus
                                    if (part.part14a_3 == 1 || part.part14a_3 == 2 || part.part14a_3 == 3) {
                                        // Berat badan lahir
                                        allow = allow && part.part17ax_3; // BBL, apakah tau BBL
                                            if (part.part17ax_3 == 1) {
                                                allow = allow && part.part17a_3;
                                            } 
                                        // Panjang badan
                                        allow = allow && part.part17bx_3; // // PBL, apakah tau PBL
                                            if (part.part17bx_3 == 1) {
                                                allow = allow && part.part17b_3;
                                            }

                                        allow = allow && part.part17c_3;
                                        
                                        if (part.part17c_3 == 1) { // Jika anak yg dilahirkan lebih dari 1
                                            allow = allow && part.part17d_3;
                                            // anak yg dilahirkan 2 orang
                                            if (part.part17d_3 == 2) {
                                                // Berat Badan Lahir
                                                allow = allow && part.part17ca1x_3;
                                                if (part.part17ca1x_3 == 1) {
                                                    allow = allow && part.part17ca1_3;
                                                }
                                                // Panjang badan lahir
                                                allow = allow && part.part17ca2x_3;
                                                if (part.part17ca2x_3 == 1) {
                                                    allow = allow && part.part17ca2_3;
                                                }
                                            }
                                            // anak yg dilahirkan 3 orang
                                            if (part.part17d_3 == 3) {
                                                // Berat Badan Lahir
                                                allow = allow && part.part17cb1x_3;
                                                if (part.part17cb1x_3 == 1) {
                                                    allow = allow && part.part17cb1_3;
                                                }
                                                // Panjang badan lahir
                                                allow = allow && part.part17cb2x_3;
                                                if (part.part17cb2x_3 == 1) {
                                                    allow = allow && part.part17cb2_3;
                                                }
                                            }  
                                        }
                                    }   
                                    
                                }
                            }
                        }

                        if (part.part48 == 4) { /* Kejadian kehamilan 4 */
                            allow = allow && part.part12_4;
                            // Saat ini masih hamil
                            if (part.part12_4 == 1) {
                                allow = allow && part.part13_4;
                                // saat ini tidak hamil (Kejadian berakhirnya kehamilan)
                                if (part.part13_4 == 2) {
                                    // mulai pengecekan
                                    allow = allow && part.part14a_4 && part.part14bx_4 && 
                                        // tanggal kejadian tahu / tanggal kejadian perkiraan
                                        (part.part14b_4 || part.part14bp_4) &&
                                        // Umur kehamilan
                                        part.part14c_4 &&
                                        // Penolong persalinan
                                        part.part15_4 &&
                                        // Metode persalinan
                                        part.part16_4;
                                    
                                    // Keterangan lahir hidup/mati/abrtus
                                    if (part.part14a_4 == 1 || part.part14a_4 == 2 || part.part14a_4 == 3) {
                                        // Berat badan lahir
                                        allow = allow && part.part17ax_4; // BBL, apakah tau BBL
                                            if (part.part17ax_4 == 1) {
                                                allow = allow && part.part17a_4;
                                            } 
                                        // Panjang badan
                                        allow = allow && part.part17bx_4; // // PBL, apakah tau PBL
                                            if (part.part17bx_4 == 1) {
                                                allow = allow && part.part17b_4;
                                            }

                                        allow = allow && part.part17c_4;
                                        
                                        if (part.part17c_4 == 1) { // Jika anak yg dilahirkan lebih dari 1
                                            allow = allow && part.part17d_4;
                                            // anak yg dilahirkan 2 orang
                                            if (part.part17d_4 == 2) {
                                                // Berat Badan Lahir
                                                allow = allow && part.part17ca1x_4;
                                                if (part.part17ca1x_4 == 1) {
                                                    allow = allow && part.part17ca1_4;
                                                }
                                                // Panjang badan lahir
                                                allow = allow && part.part17ca2x_4;
                                                if (part.part17ca2x_4 == 1) {
                                                    allow = allow && part.part17ca2_4;
                                                }
                                            }
                                            // anak yg dilahirkan 3 orang
                                            if (part.part17d_4 == 3) {
                                                // Berat Badan Lahir
                                                allow = allow && part.part17cb1x_4;
                                                if (part.part17cb1x_4 == 1) {
                                                    allow = allow && part.part17cb1_4;
                                                }
                                                // Panjang badan lahir
                                                allow = allow && part.part17cb2x_4;
                                                if (part.part17cb2x_4 == 1) {
                                                    allow = allow && part.part17cb2_4;
                                                }
                                            }  
                                        }
                                    }   
                                    
                                }
                            }
                        }
                    }

                }
                // Perempuan tercatat hamil
                if (part.jnsResp == 2) {
                   
                }

                // Perempuan Tidak tercatat hamil
                if (part.jnsResp == 3) {

                }

                // Tambahan part18 - part22
                allow = allow && part.part18;
                if (part.part18 > 1 && part.part18 < 8) {
                    allow = allow && part.part19;
                }else{
                    $scope.pendidikan = true;
                }

                allow = allow && part.part20 && part.part21;
                if (part.part21 == 1) {
                    allow = allow && part.part2201 && part.part2202 && part.part2203 &&
                        part.part2204 && part.part2205 && part.part2206 && part.part2207 &&
                        part.part2208 && part.part2209 && part.part2210 && part.part2211 &&
                        part.part2295 && part.part2298;

                    if (part.part2295 == 1) {
                        allow = allow && part.part2295a;
                    }
                }
                // jika pekerjaan lainnya
                if (part.part20=='95' || part.part20=='95. lainnya') {
                    allow = allow && part.part20lain;
                }
            }

            return allow && myForm.$valid && $scope.pendidikan;
        };

        $scope.getSelResponden = function(idx) {
            /* ambil data curART untuk part*/ 
            var art = $rootScope.curART;
                        
            if (!art) return 0;
            var ok = true;
            if (idx === 1) {
                ok = art._jk === 'L';
            } else if (idx === 2) {
                ok = art._jk === 'P' &&  parseInt(art.idSedangHamil) === 1;
            } else if (idx === 3) {
                ok = art._jk === 'P' && parseInt(art.idSedangHamil) !== 1;
            }
            if (ok) {
                $scope.part.jnsResp = '' + idx;
            }
            return ok;
        };

        // list pekerjaan lain
        $scope.cariPekerjaan = function(filterPekerjaan){
            $scope.listPekerjaanNew = AppService.cariListPekerjaan(filterPekerjaan);
            $scope.listPekerjaanNew = $scope.listPekerjaanNew.slice(0, 5);
            $scope.tampilkan_list = true; // tampilkan list
        }
        // pilih pekerjaan lain
        $scope.setPekerjaan = function(val){
            $scope.tampilkan_list = false; // hidden list
            $scope.part.part20lain = val;
        }
    }
})();
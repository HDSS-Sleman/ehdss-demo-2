(function() {
    angular.module('ehdss')
        .controller('KtlpCtrl', KtlpCtrl);

    KtlpCtrl.$inject = ['$scope', '$state', '$rootScope', '$timeout', 'AppService', '$ionicPopup', '$http', '$ionicScrollDelegate'];

    function KtlpCtrl($scope, $state, $rootScope, $timeout, AppService, $ionicPopup, $http, $ionicScrollDelegate) {

        // tab responden utama
        $scope.tab_konfirmasi =  $rootScope.tab_konfirmasi || false;
        $scope.tab_laporan = $rootScope.tab_laporan || false;
        $scope.tab_reward = $rootScope.tab_reward || false;

        // tab responden individu
        $scope.tab_konfirmasi_i =  $rootScope.tab_konfirmasi_i || false;
        $scope.tab_laporan_i = $rootScope.tab_laporan_i || false;
        $scope.tab_reward_i = $rootScope.tab_reward_i || false;

        
        $scope.ktlp = {};
        $scope.ktlp.idrt = $rootScope.dataRT.idrt;

        $scope.scrollTop = function() {
            $ionicScrollDelegate.scrollTop();
          };
        
        // ambil data yg tersimpan di localforage
        AppService.getDataART().then(function(data) {
            $scope.dataART = data.filter(function(item) {
                return !item.artTdkAda;
            });
            // cari data default responden utama (TIDAK DIPAKAI DI KONTAK AWAL YG BARU)
            // $scope.dataART.forEach(function(val, idx) {
            //     if (val.art01 === $rootScope.dataRT.krt02) { // jika nama ART = nama responden utama di baseline
            //         $scope.ktlp.ltlp05 = $scope.ktlp.ltlp05 || parseInt(val.umur); // Umur
            //         $scope.ktlp.ltlp06 = $scope.ktlp.ltlp06 || ''+val.art04; // JK
            //         $scope.ktlp.ltlp04 = $scope.ktlp.ltlp04 || ''+val.lokasi; // lokasi
            //     }
            // });
        });

        // ambil data konfirmasi di localforage
        AppService.getLaporanTelepon($scope.ktlp.idrt).then(function(data) {
            $scope.ktlp = data || {};
            if (data) {
                for(var key in data){
                    // selain data idrt, idart, usia, dan object dibuat string agar bisa dibaca di form
                    if (key!='idrt' && key!='idart' && typeof(data[key])!='object') {
                        
                        $scope.ktlp[key] = ''+data[key];
                    }
                }
                
            }

            // default value responden utama
            var telp = $rootScope.dataRT.krt03.replace(/^"(.*)"$/, '$1'); // hilangkan quotation dari no hp
            $scope.ktlp.ktlp00 = $scope.ktlp.ktlp00 || telp; // no telp

            if (!$scope.ktlp.kl01 || $scope.ktlp.kl01 == "undefined") { // kecamatan
                $scope.ktlp.kl01 = $rootScope.dataRT.kl01;
            }else{
                $scope.ktlp.kl01 = $scope.ktlp.kl01;
            }

            if (!$scope.ktlp.kl02 || $scope.ktlp.kl02 == "undefined") { // desa/kelurahan
                $scope.ktlp.kl02 = $rootScope.dataRT.kl02;
            }else{
                $scope.ktlp.kl02 = $scope.ktlp.kl02;
            }

            if (!$scope.ktlp.kl03 || $scope.ktlp.kl03 == "undefined") { // dusun
                $scope.ktlp.kl03 = $rootScope.dataRT.kl03;
            }else{
                $scope.ktlp.kl03 = $scope.ktlp.kl03;
            }

            if (!$scope.ktlp.kl04 || $scope.ktlp.kl04 == "undefined") { // rw
                $scope.ktlp.kl04 = $rootScope.dataRT.kl04;
            }else{
                $scope.ktlp.kl04 = $scope.ktlp.kl04;
            }

            if (!$scope.ktlp.kl05 || $scope.ktlp.kl05 == "undefined") { // rt
                $scope.ktlp.kl05 = $rootScope.dataRT.kl05;
            }else{
                $scope.ktlp.kl05 = $scope.ktlp.kl05;
            }

            if (!$scope.ktlp.kl08 || $scope.ktlp.kl08 == "undefined") { // alamat
                $scope.ktlp.kl08 = $rootScope.dataRT.kl08;
            }else{
                $scope.ktlp.kl08 = $scope.ktlp.kl08;
            }

            // $scope.ktlp.kl01 = $scope.ktlp.kl01 || $rootScope.dataRT.kl01; // kecamatan
            // $scope.ktlp.kl02 = $scope.ktlp.kl02 || $rootScope.dataRT.kl02; // desa/kelurahan
            // $scope.ktlp.kl03 = $scope.ktlp.kl03 || $rootScope.dataRT.kl03; // dusun
            // $scope.ktlp.kl04 = $scope.ktlp.kl04 || $rootScope.dataRT.kl04; // rw
            // $scope.ktlp.kl05 = $scope.ktlp.kl05 || $rootScope.dataRT.kl05; // rt
            // $scope.ktlp.kl08 = $scope.ktlp.kl08 || $rootScope.dataRT.kl08; // alamat   

            $scope.ktlp.idrt = $rootScope.dataRT.idrt;
        });

        AppService.getTglWawancaraPlusSatu(true).then(function(val) {
            $scope.tglWawancara = val;
        });

        $scope.cekNoTelpResponden = function(val) {
            if (val == 1) {
                // default value responden utama
                var telp_reward = $rootScope.dataRT.krt03.replace(/^"(.*)"$/, '$1'); // hilangkan quotation dari no hp
                $scope.ktlp.rww03 = telp_reward; // no telp
            }
        }

        /* Validasi Allow Save*/
        $scope.konfirmasiAllowSave = function(){
            var ktlp = $scope.ktlp;
            var allow = ktlp.idrt && ktlp.ktlp00 && ktlp.ktlp01 && ktlp.ktlp02
                        ;
                        // jika kontak via pesan SMS / WA
                        if (ktlp.ktlp01 == 1 || ktlp.ktlp01 == 2) {
                            allow = allow && ktlp.ktlp03; // isi status pesan
                            if (ktlp.ktlp03 == 4) { // jika Pesan terkirim dan calon responden menolak berpartisipasi. Jelaskan tujuan HDSS dan kerahasiaan data
                                allow = allow && ktlp.ktlp05; // tanggapan responden
                            }
                        }
                        // jika kontak via telepon
                        if (ktlp.ktlp01 == 3) {
                            allow = allow && ktlp.ktlp04; // isi status telepon
                            if (ktlp.ktlp04 == 2) { // jika Telepon aktif tetapi tidak direspon
                                allow = allow && ktlp.ktlp06; // Telpon dengan jam yang berbeda-beda hingga maksimal 3 kali
                            }
                        }
                        // jika ada respon positif dari responden
                        if (ktlp.ktlp03 == 1 || ktlp.ktlp04 == 1 || ktlp.ktlp05 == 1 || ktlp.ktlp06 == 1) {
                            allow = allow && ktlp.ktlp07;
                                if (ktlp.ktlp07 == 1) { // jika responden mengenali nama anggota keluarga
                                    allow = allow && ktlp.ktlp08 && ktlp.ktlp10;
                                    if (ktlp.ktlp08 == 97) { // Jika tidak ada dalam list ART, isikan nama lengkap responden
                                        allow = allow && ktlp.ktlp09;
                                    }

                                    // Alamat tidak sama dengan data HDSS, tanyakan alasan
                                    if (ktlp.ktlp10 == 3) {
                                        allow = allow && ktlp.ktlp11; // Alasan alamat tidak sama dengan data HDSS
                                        if (ktlp.ktlp11 == 3) { // Hanya calon responden yang pindah alamat
                                            allow = allow && ktlp.ktlp12; // Tanyakan nomor kontak ART yang masih tinggal di Ruta lama
                                            // if (ktlp.ktlp12 == 1) { // mau memberikan kontak
                                                // allow = allow && ktlp.ktlp12a; // nomor kontak
                                            // }
                                        }
                                        if (ktlp.ktlp11 == 2) { // Jika satu Ruta pindah alamat, dalam/luar sleman
                                            allow = allow && ktlp.ktlp13;
                                        }
                                        if (ktlp.ktlp11 == 1 || ktlp.ktlp11 == 2) { // Alamat hanya berbeda sedikit || satu Ruta pindah alamat 
                                            allow = allow && ktlp.kl01 && ktlp.kl02 && ktlp.kl03 && ktlp.kl04 && ktlp.kl05 && ktlp.kl08; // Catat pembaharuan alamat
                                        }
                                        if (ktlp.ktlp11 == 1 || (ktlp.ktlp11 == 2 && ktlp.ktlp13 == 1)) { // Jika alamat masih di dalam sleman -> ikuti
                                            allow = allow && ktlp.ktlp14;
                                        }
                                    }

                                    // Alamat sama namun usia < dari 18 tahun
                                    if (ktlp.ktlp10 == 2 || (((ktlp.ktlp10 == 3 && ktlp.ktlp11 == 2 && ktlp.ktlp13 == 1) || (ktlp.ktlp10 == 3 && ktlp.ktlp11 == 1)) && ktlp.ktlp14 == 2) ) {
                                        allow = allow && ktlp.ktlp15;
                                    }

                                    //tanyakan kesediaan berpartisipasi
                                    if (ktlp.ktlp10 == 1 || ktlp.ktlp15 == 1 || ktlp.ktlp14 == 1) {
                                        allow = allow && ktlp.ktlp16;
                                        if (ktlp.ktlp16 == 3) { // menolak
                                            allow = allow && ktlp.ktlp17; // Menolak tahun ini / seterusnya
                                        }
                                        if (ktlp.ktlp16 == 2) { // mau wawancara tp janjian dulu
                                            // catat tgl janjian, jam janjian, nama yg akan diwawancara, moda wawancara
                                            allow = allow && ktlp.ktlp18 && ktlp.ktlp19 && ktlp.ktlp20 && ktlp.ktlp21;
                                        }
                                        if (ktlp.ktlp16 == 1 || ktlp.ktlp16 == 2) { // moda wawancara jika bersedia
                                            allow = allow && ktlp.ktlp21;
                                        }
                                    }
                                }
                                    
                        }
            return allow;
        }

        $scope.laporanAllowSave = function(){
            var ktlp = $scope.ktlp;
            var allow = ktlp.idrt && ktlp.ltlp00;
                if (ktlp.ltlp00 == 1) {
                    allow = allow && ktlp.ltlp1a && ktlp.ltlp1b && ktlp.ltlp1c && ktlp.ltlp1d && ktlp.ltlp1g;
                            if (ktlp.ltlp1d == 2) {
                                allow = allow && ktlp.ltlp1e && ktlp.ltlp1f;
                            }
                }
                if (ktlp.ltlp00 == 2) {
                    allow = allow && ktlp.ltlp2a && ktlp.ltlp2b && ktlp.ltlp2c && ktlp.ltlp2d && ktlp.ltlp2g;
                            if (ktlp.ltlp2d == 2) {
                                allow = allow && ktlp.ltlp2e && ktlp.ltlp2f;
                            }
                }
                if (ktlp.ltlp00 == 3) {
                    allow = allow && ktlp.ltlp3a && ktlp.ltlp3b && ktlp.ltlp3c && ktlp.ltlp3d && ktlp.ltlp3g;
                            if (ktlp.ltlp3d == 2) {
                                allow = allow && ktlp.ltlp3e && ktlp.ltlp3f;
                            }
                }
                if (ktlp.ltlp00 == 4) {
                    allow = allow && ktlp.ltlp4a && ktlp.ltlp4b && ktlp.ltlp4c && ktlp.ltlp4d && ktlp.ltlp4g;
                            if (ktlp.ltlp4d == 2) {
                                allow = allow && ktlp.ltlp4e && ktlp.ltlp4f;
                            }
                }
                if (ktlp.ltlp00 == 5) {
                    allow = allow && ktlp.ltlp5a && ktlp.ltlp5b && ktlp.ltlp5c && ktlp.ltlp5d && ktlp.ltlp5g;
                            if (ktlp.ltlp5d == 2) {
                                allow = allow && ktlp.ltlp5e && ktlp.ltlp5f;
                            }
                }
            return allow;
        }

        $scope.rewardAllowSave = function(){
            var ktlp = $scope.ktlp;
            var allow = ktlp.rww01 && ktlp.rww04 && ktlp.rww02 && ktlp.rww03;
                        
            return allow;
        }        

        /* Kesimpulan Konfirmasi SMS */
        $scope.status_konfirmasi = function(val){
            var ktlp = $scope.ktlp;

            // history kontak #1
            if (ktlp.hst00 == 1) { 
                if (ktlp.ktlp03 == 5) { // jika 5. Pesan terkirim dan calon responden menyatakan identitas berbeda dengn list HDSS. Catat sebagai gagal kontak awal. Alasan: Nomor Telpon Salah
                    $scope.ktlp.hst1a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst1c = "1"; // status
                } else
                if (ktlp.ktlp05 == 2) { // jika 2. Tetap Menolak. Catat sebagai gagal kontak awal. Alasan: Calon Responden Menolak 
                    $scope.ktlp.hst1a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst1c = "2"; // status
                } else
                if (ktlp.ktlp04 == 3) { // jika 3. Nomor yg ditelfon tidak aktif -> Catat sebagai gagal kontak awal. Alasan: Nomor Tidak Aktif
                    // jika ada ktlp.ktlp06, hapus ktlp.ktlp06
                    if (ktlp.ktlp06) {delete $scope.ktlp.ktlp06;}
                    $scope.ktlp.hst1a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst1c = "3"; // status
                } else
                if (ktlp.ktlp06 == 2) { // jika 2. Tidak ada respon -> Catat sebagai gagal kontak awal. Alasan: Nomor Aktif namun Tidak Ada Tanggapan
                    $scope.ktlp.hst1a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst1c = "4"; // status
                } else
                if (ktlp.ktlp07 == 2) { // jika 2. Tidak. Catat sebagai gagal kontak awal. Alasan: Nomor Telpon Salah
                    $scope.ktlp.hst1a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst1c = "1"; // status
                } else
                if (ktlp.ktlp12 == 2) { // jika 2. Tidak mau memberikan. Catat gagal kontak awal. Alasan: Tidak mendapatkan nomor telpon
                    $scope.ktlp.hst1a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst1c = "5"; // status
                } else
                if (ktlp.ktlp12 == 1) { // 1. Ya mau memberikan. Catat nomor dan lakukan kontak awal dari Langkah START
                    $scope.ktlp.hst1a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst1c = "7"; // status
                } else
                if (ktlp.ktlp10 == 3 && ktlp.ktlp11 == 2 && ktlp.ktlp13 == 2) { // 2. Luar Sleman. Jelaskan survei hanya untuk yang bertempat tinggal di Kab Sleman. Catat gagal kontak awalAlasan: Migrasi keluar
                    $scope.ktlp.hst1a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst1c = "6"; // status
                } else
                if (ktlp.ktlp15 == 2) { // 2. Ya dengan nomor berbeda. Catat nama dan nomor telepon yang dberikan. Lakukan kontak awal dari Langkah START 
                    $scope.ktlp.hst1a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst1c = "7"; // status
                } else
                if (ktlp.ktlp15 == 3) { // 3. Tidak bersedia. Catat gagal kontak awal. Alasan: Tidak mendapatkan nomor telpon
                    $scope.ktlp.hst1a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst1c = "5"; // status
                } else
                if (ktlp.ktlp17 == 1) { // 1. Ya. Catat gagal wawancara. Alasan: Menolak tahun ini
                    $scope.ktlp.hst1a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst1c = "8"; // status
                } else
                if (ktlp.ktlp17 == 2) { // 2. Tidak. Catat gagal wawancara. Alasan: Menolak seterusnya 
                    $scope.ktlp.hst1a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst1c = "9"; // status
                } else
                if ((ktlp.ktlp16 == 1) && (ktlp.ktlp21 == 1 || ktlp.ktlp21 == 2)) { // moda wawancara jika bersedia wawancara langsung
                    $scope.ktlp.hst1a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst1c = "10"; // status
                } else
                if ((ktlp.ktlp16 == 2) && (ktlp.ktlp21 == 1 || ktlp.ktlp21 == 2)) { // moda wawancara jika bersedia janjian
                    $scope.ktlp.hst1a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst1c = "11"; // status
                }
            }

            // history kontak #2
            if (ktlp.hst00 == 2) { 
                if (ktlp.ktlp03 == 5) { // jika 5. Pesan terkirim dan calon responden menyatakan identitas berbeda dengn list HDSS. Catat sebagai gagal kontak awal. Alasan: Nomor Telpon Salah
                    $scope.ktlp.hst2a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst2c = "1"; // status
                } else
                if (ktlp.ktlp05 == 2) { // jika 2. Tetap Menolak. Catat sebagai gagal kontak awal. Alasan: Calon Responden Menolak 
                    $scope.ktlp.hst2a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst2c = "2"; // status
                } else
                if (ktlp.ktlp04 == 3) { // jika 3. Nomor yg ditelfon tidak aktif -> Catat sebagai gagal kontak awal. Alasan: Nomor Tidak Aktif
                    // jika ada ktlp.ktlp06, hapus ktlp.ktlp06
                    if (ktlp.ktlp06) {delete $scope.ktlp.ktlp06;}
                    $scope.ktlp.hst2a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst2c = "3"; // status
                } else
                if (ktlp.ktlp06 == 2) { // jika 2. Tidak ada respon -> Catat sebagai gagal kontak awal. Alasan: Nomor Aktif namun Tidak Ada Tanggapan
                    $scope.ktlp.hst2a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst2c = "4"; // status
                } else
                if (ktlp.ktlp07 == 2) { // jika 2. Tidak. Catat sebagai gagal kontak awal. Alasan: Nomor Telpon Salah
                    $scope.ktlp.hst2a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst2c = "1"; // status
                } else
                if (ktlp.ktlp12 == 2) { // jika 2. Tidak mau memberikan. Catat gagal kontak awal. Alasan: Tidak mendapatkan nomor telpon
                    $scope.ktlp.hst2a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst2c = "5"; // status
                } else
                if (ktlp.ktlp12 == 1) { // 1. Ya mau memberikan. Catat nomor dan lakukan kontak awal dari Langkah START
                    $scope.ktlp.hst2a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst2c = "7"; // status
                } else
                if (ktlp.ktlp10 == 3 && ktlp.ktlp11 == 2 && ktlp.ktlp13 == 2) { // 2. Luar Sleman. Jelaskan survei hanya untuk yang bertempat tinggal di Kab Sleman. Catat gagal kontak awalAlasan: Migrasi keluar
                    $scope.ktlp.hst2a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst2c = "6"; // status
                } else
                if (ktlp.ktlp15 == 2) { // 2. Ya dengan nomor berbeda. Catat nama dan nomor telepon yang dberikan. Lakukan kontak awal dari Langkah START 
                    $scope.ktlp.hst2a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst2c = "7"; // status
                } else
                if (ktlp.ktlp15 == 3) { // 3. Tidak bersedia. Catat gagal kontak awal. Alasan: Tidak mendapatkan nomor telpon
                    $scope.ktlp.hst2a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst2c = "5"; // status
                } else
                if (ktlp.ktlp17 == 1) { // 1. Ya. Catat gagal wawancara. Alasan: Menolak tahun ini
                    $scope.ktlp.hst2a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst2c = "8"; // status
                } else
                if (ktlp.ktlp17 == 2) { // 2. Tidak. Catat gagal wawancara. Alasan: Menolak seterusnya 
                    $scope.ktlp.hst2a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst2c = "9"; // status
                } else
                if ((ktlp.ktlp16 == 1) && (ktlp.ktlp21 == 1 || ktlp.ktlp21 == 2)) { // moda wawancara jika bersedia wawancara langsung
                    $scope.ktlp.hst2a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst2c = "10"; // status
                } else
                if ((ktlp.ktlp16 == 2) && (ktlp.ktlp21 == 1 || ktlp.ktlp21 == 2)) { // moda wawancara jika bersedia janjian
                    $scope.ktlp.hst2a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst2c = "11"; // status
                }
            }

            // history kontak #3
            if (ktlp.hst00 == 3) { 
                if (ktlp.ktlp03 == 5) { // jika 5. Pesan terkirim dan calon responden menyatakan identitas berbeda dengn list HDSS. Catat sebagai gagal kontak awal. Alasan: Nomor Telpon Salah
                    $scope.ktlp.hst3a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst3c = "1"; // status
                } else
                if (ktlp.ktlp05 == 2) { // jika 2. Tetap Menolak. Catat sebagai gagal kontak awal. Alasan: Calon Responden Menolak 
                    $scope.ktlp.hst3a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst3c = "2"; // status
                } else
                if (ktlp.ktlp04 == 3) { // jika 3. Nomor yg ditelfon tidak aktif -> Catat sebagai gagal kontak awal. Alasan: Nomor Tidak Aktif
                    // jika ada ktlp.ktlp06, hapus ktlp.ktlp06
                    if (ktlp.ktlp06) {delete $scope.ktlp.ktlp06;}
                    $scope.ktlp.hst3a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst3c = "3"; // status
                } else
                if (ktlp.ktlp06 == 2) { // jika 2. Tidak ada respon -> Catat sebagai gagal kontak awal. Alasan: Nomor Aktif namun Tidak Ada Tanggapan
                    $scope.ktlp.hst3a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst3c = "4"; // status
                } else
                if (ktlp.ktlp07 == 2) { // jika 2. Tidak. Catat sebagai gagal kontak awal. Alasan: Nomor Telpon Salah
                    $scope.ktlp.hst3a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst3c = "1"; // status
                } else
                if (ktlp.ktlp12 == 2) { // jika 2. Tidak mau memberikan. Catat gagal kontak awal. Alasan: Tidak mendapatkan nomor telpon
                    $scope.ktlp.hst3a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst3c = "5"; // status
                } else
                if (ktlp.ktlp12 == 1) { // 1. Ya mau memberikan. Catat nomor dan lakukan kontak awal dari Langkah START
                    $scope.ktlp.hst3a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst3c = "7"; // status
                } else
                if (ktlp.ktlp10 == 3 && ktlp.ktlp11 == 2 && ktlp.ktlp13 == 2) { // 2. Luar Sleman. Jelaskan survei hanya untuk yang bertempat tinggal di Kab Sleman. Catat gagal kontak awalAlasan: Migrasi keluar
                    $scope.ktlp.hst3a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst3c = "6"; // status
                } else
                if (ktlp.ktlp15 == 2) { // 2. Ya dengan nomor berbeda. Catat nama dan nomor telepon yang dberikan. Lakukan kontak awal dari Langkah START 
                    $scope.ktlp.hst3a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst3c = "7"; // status
                } else
                if (ktlp.ktlp15 == 3) { // 3. Tidak bersedia. Catat gagal kontak awal. Alasan: Tidak mendapatkan nomor telpon
                    $scope.ktlp.hst3a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst3c = "5"; // status
                } else
                if (ktlp.ktlp17 == 1) { // 1. Ya. Catat gagal wawancara. Alasan: Menolak tahun ini
                    $scope.ktlp.hst3a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst3c = "8"; // status
                } else
                if (ktlp.ktlp17 == 2) { // 2. Tidak. Catat gagal wawancara. Alasan: Menolak seterusnya 
                    $scope.ktlp.hst3a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst3c = "9"; // status
                } else
                if ((ktlp.ktlp16 == 1) && (ktlp.ktlp21 == 1 || ktlp.ktlp21 == 2)) { // moda wawancara jika bersedia wawancara langsung
                    $scope.ktlp.hst3a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst3c = "10"; // status
                } else
                if ((ktlp.ktlp16 == 2) && (ktlp.ktlp21 == 1 || ktlp.ktlp21 == 2)) { // moda wawancara jika bersedia janjian
                    $scope.ktlp.hst3a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst3c = "11"; // status
                }
            }

            // history kontak #4
            if (ktlp.hst00 == 4) { 
                if (ktlp.ktlp03 == 5) { // jika 5. Pesan terkirim dan calon responden menyatakan identitas berbeda dengn list HDSS. Catat sebagai gagal kontak awal. Alasan: Nomor Telpon Salah
                    $scope.ktlp.hst4a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst4c = "1"; // status
                } else
                if (ktlp.ktlp05 == 2) { // jika 2. Tetap Menolak. Catat sebagai gagal kontak awal. Alasan: Calon Responden Menolak 
                    $scope.ktlp.hst4a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst4c = "2"; // status
                } else
                if (ktlp.ktlp04 == 3) { // jika 3. Nomor yg ditelfon tidak aktif -> Catat sebagai gagal kontak awal. Alasan: Nomor Tidak Aktif
                    // jika ada ktlp.ktlp06, hapus ktlp.ktlp06
                    if (ktlp.ktlp06) {delete $scope.ktlp.ktlp06;}
                    $scope.ktlp.hst4a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst4c = "3"; // status
                } else
                if (ktlp.ktlp06 == 2) { // jika 2. Tidak ada respon -> Catat sebagai gagal kontak awal. Alasan: Nomor Aktif namun Tidak Ada Tanggapan
                    $scope.ktlp.hst4a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst4c = "4"; // status
                } else
                if (ktlp.ktlp07 == 2) { // jika 2. Tidak. Catat sebagai gagal kontak awal. Alasan: Nomor Telpon Salah
                    $scope.ktlp.hst4a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst4c = "1"; // status
                } else
                if (ktlp.ktlp12 == 2) { // jika 2. Tidak mau memberikan. Catat gagal kontak awal. Alasan: Tidak mendapatkan nomor telpon
                    $scope.ktlp.hst4a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst4c = "5"; // status
                } else
                if (ktlp.ktlp12 == 1) { // 1. Ya mau memberikan. Catat nomor dan lakukan kontak awal dari Langkah START
                    $scope.ktlp.hst4a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst4c = "7"; // status
                } else
                if (ktlp.ktlp10 == 3 && ktlp.ktlp11 == 2 && ktlp.ktlp13 == 2) { // 2. Luar Sleman. Jelaskan survei hanya untuk yang bertempat tinggal di Kab Sleman. Catat gagal kontak awalAlasan: Migrasi keluar
                    $scope.ktlp.hst4a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst4c = "6"; // status
                } else
                if (ktlp.ktlp15 == 2) { // 2. Ya dengan nomor berbeda. Catat nama dan nomor telepon yang dberikan. Lakukan kontak awal dari Langkah START 
                    $scope.ktlp.hst4a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst4c = "7"; // status
                } else
                if (ktlp.ktlp15 == 3) { // 3. Tidak bersedia. Catat gagal kontak awal. Alasan: Tidak mendapatkan nomor telpon
                    $scope.ktlp.hst4a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst4c = "5"; // status
                } else
                if (ktlp.ktlp17 == 1) { // 1. Ya. Catat gagal wawancara. Alasan: Menolak tahun ini
                    $scope.ktlp.hst4a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst4c = "8"; // status
                } else
                if (ktlp.ktlp17 == 2) { // 2. Tidak. Catat gagal wawancara. Alasan: Menolak seterusnya 
                    $scope.ktlp.hst4a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst4c = "9"; // status
                } else
                if ((ktlp.ktlp16 == 1) && (ktlp.ktlp21 == 1 || ktlp.ktlp21 == 2)) { // moda wawancara jika bersedia wawancara langsung
                    $scope.ktlp.hst4a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst4c = "10"; // status
                } else
                if ((ktlp.ktlp16 == 2) && (ktlp.ktlp21 == 1 || ktlp.ktlp21 == 2)) { // moda wawancara jika bersedia janjian
                    $scope.ktlp.hst4a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst4c = "11"; // status
                }
            }

            // history kontak #5
            if (ktlp.hst00 == 5) { 
                if (ktlp.ktlp03 == 5) { // jika 5. Pesan terkirim dan calon responden menyatakan identitas berbeda dengn list HDSS. Catat sebagai gagal kontak awal. Alasan: Nomor Telpon Salah
                    $scope.ktlp.hst5a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst5c = "1"; // status
                } else
                if (ktlp.ktlp05 == 2) { // jika 2. Tetap Menolak. Catat sebagai gagal kontak awal. Alasan: Calon Responden Menolak 
                    $scope.ktlp.hst5a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst5c = "2"; // status
                } else
                if (ktlp.ktlp04 == 3) { // jika 3. Nomor yg ditelfon tidak aktif -> Catat sebagai gagal kontak awal. Alasan: Nomor Tidak Aktif
                    // jika ada ktlp.ktlp06, hapus ktlp.ktlp06
                    if (ktlp.ktlp06) {delete $scope.ktlp.ktlp06;}
                    $scope.ktlp.hst5a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst5c = "3"; // status
                } else
                if (ktlp.ktlp06 == 2) { // jika 2. Tidak ada respon -> Catat sebagai gagal kontak awal. Alasan: Nomor Aktif namun Tidak Ada Tanggapan
                    $scope.ktlp.hst5a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst5c = "4"; // status
                } else
                if (ktlp.ktlp07 == 2) { // jika 2. Tidak. Catat sebagai gagal kontak awal. Alasan: Nomor Telpon Salah
                    $scope.ktlp.hst5a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst5c = "1"; // status
                } else
                if (ktlp.ktlp12 == 2) { // jika 2. Tidak mau memberikan. Catat gagal kontak awal. Alasan: Tidak mendapatkan nomor telpon
                    $scope.ktlp.hst5a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst5c = "5"; // status
                } else
                if (ktlp.ktlp12 == 1) { // 1. Ya mau memberikan. Catat nomor dan lakukan kontak awal dari Langkah START
                    $scope.ktlp.hst5a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst5c = "7"; // status
                } else
                if (ktlp.ktlp10 == 3 && ktlp.ktlp11 == 2 && ktlp.ktlp13 == 2) { // 2. Luar Sleman. Jelaskan survei hanya untuk yang bertempat tinggal di Kab Sleman. Catat gagal kontak awalAlasan: Migrasi keluar
                    $scope.ktlp.hst5a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst5c = "6"; // status
                } else
                if (ktlp.ktlp15 == 2) { // 2. Ya dengan nomor berbeda. Catat nama dan nomor telepon yang dberikan. Lakukan kontak awal dari Langkah START 
                    $scope.ktlp.hst5a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst5c = "7"; // status
                } else
                if (ktlp.ktlp15 == 3) { // 3. Tidak bersedia. Catat gagal kontak awal. Alasan: Tidak mendapatkan nomor telpon
                    $scope.ktlp.hst5a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst5c = "5"; // status
                } else
                if (ktlp.ktlp17 == 1) { // 1. Ya. Catat gagal wawancara. Alasan: Menolak tahun ini
                    $scope.ktlp.hst5a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst5c = "8"; // status
                } else
                if (ktlp.ktlp17 == 2) { // 2. Tidak. Catat gagal wawancara. Alasan: Menolak seterusnya 
                    $scope.ktlp.hst5a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst5c = "9"; // status
                } else
                if ((ktlp.ktlp16 == 1) && (ktlp.ktlp21 == 1 || ktlp.ktlp21 == 2)) { // moda wawancara jika bersedia wawancara langsung
                    $scope.ktlp.hst5a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst5c = "10"; // status
                } else
                if ((ktlp.ktlp16 == 2) && (ktlp.ktlp21 == 1 || ktlp.ktlp21 == 2)) { // moda wawancara jika bersedia janjian
                    $scope.ktlp.hst5a = ktlp.ktlp00; // no hp
                    $scope.ktlp.hst5c = "11"; // status
                }
            }

        };

        
        $scope.resetKetersediaan = function(){
            if ($scope.ktlp.ktlp17) { delete $scope.ktlp.ktlp17; }
            if ($scope.ktlp.ktlp18) { delete $scope.ktlp.ktlp18; }
            if ($scope.ktlp.ktlp19) { delete $scope.ktlp.ktlp19; }
            if ($scope.ktlp.ktlp20) { delete $scope.ktlp.ktlp20; }
            if ($scope.ktlp.ktlp21) { delete $scope.ktlp.ktlp21; }
        }

        $scope.saveKonfirmasi = function(curMenu, toMenu, ktlp) {

            // hilangkan data kontak awal versi lama
            if (ktlp.ltlp04) { delete ktlp.ltlp04;}
            if (ktlp.ltlp05) { delete ktlp.ltlp05;}
            if (ktlp.ltlp06) { delete ktlp.ltlp06;}

            // reset dulu sebelum mengisi form dengan nomor yg baru didapat
            if(curMenu == 'kontak' && toMenu == 'reset'){
                ktlp.ktlp00 = '';
                ktlp.ktlp01 = '';
                ktlp.ktlp02 = '';
                ktlp.ktlp03 = '';
                ktlp.ktlp04 = '';
                ktlp.ktlp05 = '';
                ktlp.ktlp06 = '';
                ktlp.ktlp07 = '';
                ktlp.ktlp08 = '';
                ktlp.ktlp09 = '';
                ktlp.ktlp10 = '';
                ktlp.ktlp11 = '';
                ktlp.ktlp12 = '';
                ktlp.ktlp13 = '';
                ktlp.ktlp14 = '';
                ktlp.ktlp15 = '';
                ktlp.ktlp16 = '';
                ktlp.ktlp17 = '';
                ktlp.ktlp18 = '';
                ktlp.ktlp19 = '';
                ktlp.ktlp20 = '';
                ktlp.ktlp21 = '';
            }

            $rootScope.$broadcast('saving:show');
            AppService.saveKonfirmasiEnum(ktlp).then(function(data) {
                $rootScope.$broadcast('saving:hide');
                $rootScope.$broadcast('loading:show');
                $timeout(function() {
                    $rootScope.$broadcast('loading:hide');
                    if ($rootScope.dataRT.start_in_wave_rt === 5) {
                        $state.go('app.art'); // jika RUTA baru, Cover di skip
                    }else if(curMenu == 'kontak' && toMenu == 'gagal'){ // gagal kontak awal
                        $state.go('app.home');
                    }else if(curMenu == 'kontak' && toMenu == 'reset'){ // reset semua kecuali histori kontak
                        $state.go('app.ktlp');
                    }else if(curMenu == 'kontak' && toMenu == 'icf'){ // ke icf
                        $state.go('app.icftu');
                    }else if(curMenu == 'kontak' && toMenu == 'janjian'){ // ke home dulu karena janjian
                        $state.go('app.home');
                    }else if (curMenu == 'reward' && toMenu == 'art') { // reward
                        $scope.tab_reward = false;
                        $state.go('app.art');
                    }else if (curMenu == 'icftu' && toMenu == 'icftu') { // shortcut ke icf
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
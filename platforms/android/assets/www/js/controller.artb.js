(function() {
    angular.module('ehdss')
        .controller('ArtbCtrl', ArtbCtrl);

    ArtbCtrl.$inject = ['$scope', '$state', '$rootScope', '$timeout', 'AppService'];

    function ArtbCtrl($scope, $state, $rootScope, $timeout, AppService) {
        var artb = {};
        $scope.agama = AppService.listAgama();
        $scope.pekerjaan = AppService.listPekerjaan();
        $scope.listpendidikan = AppService.listPendidikan();
        $scope.suku = AppService.listSuku();
        $scope.statusKawin = AppService.listStatusKawin();
        $scope.listHubRT = AppService.listHubRT();
        $scope.pendidikan = true;

        if ($rootScope.editStatus === 'new') {
            $scope.artb = artb;
            $scope.artb.artb = 1;
            // inisialisasi data
            // artb.artb36 = 2; // tidak dari ruta pengganti

            $rootScope.idart_terpakai; // list idrt yang sudah terpakai di ruta (ambil dari art.js)
            // console.log($rootScope.idart_terpakai);
            var str = ''+$rootScope.dataRT.hist_idart;
            // console.log($rootScope.dataRT.hist_idart);
            
            $scope.hist_idart = [];
            // jika list idart yang sudah ada banyak
            if (str.match(/[\,]/g)) {
                $scope.hist_idart = $rootScope.dataRT.hist_idart.split(',') ; // list idrt yang sudah terpakai (dari baseline)                                         
            }else{ // jika idart hanya ada 1, jadikan array
                $scope.hist_idart[0] = $rootScope.dataRT.hist_idart;
            }

            // console.log($scope.hist_idart);
            
            

            $scope.allListIDART = AppService.merge_array($rootScope.idart_terpakai,$scope.hist_idart); // merge array dan remove duplikat value
            for(var key in $scope.allListIDART){
                $scope.allListIDART[key] = Number($scope.allListIDART[key]); // ubah IDART menjadi int
            }

            // console.log($rootScope.idart_terpakai);
            // console.log($scope.hist_idart);
            // console.log($scope.allListIDART);

            // get no urut next ART, dari max no urut +1
            artb.artb00 = AppService.getNextNoUrutARTB($rootScope.dataART);

            // artb.artb03b = 400100509; // untuk testing artb generate tombol di bapak jawadi
            artb.artb03b = parseInt($rootScope.dataRT.idrt + '' + AppService.zeroPad(artb.artb00, 2));

            $scope.idart_tersedia = !$scope.allListIDART.includes(artb.artb03b);


            // cek listHubRT
            idart = artb.artb03b;
            var dataART = $rootScope.dataART;
                dataART.forEach(function(val,idx){
                    idart_val = val.art03b || val.artb03b;
                    hubrt_val = val.art02 || val.artb02;
                    if ((idart != idart_val) && (hubrt_val == 1)) { //jika ada ART lain yg sudah jadi KK
                        $scope.listHubRT = AppService.listHubRT2();
                    }
                });
        } else {
            $scope.idart_tersedia = true;
            artb = $rootScope.curART;
            $scope.artb = artb;
            $scope.artb.artb09 = ''+$scope.artb.artb09; // pilihan no urut dibuat string
            $scope.artb.artb10 = ''+$scope.artb.artb10; // pilihan no urut dibuat string
            $scope.artb.artb11 = ''+$scope.artb.artb11; // pilihan no urut dibuat string
            $scope.artb.artb12 = ''+$scope.artb.artb12; // pilihan no urut dibuat string
            $scope.artb.artb = 1;
            // $scope.artb.artb36 = 2;

            // jika lahir dari ART HDSS dan tahu tgl masuk
            if ($scope.artb.artb24 == 3 && $scope.artb.artb37a == 1) {
                $scope.artb.artb05 = $scope.artb.artb37;
                // hitung usia
                if (artb.artb05) {
                    var thn = AppService.getAge(artb.artb05);
                    $scope.umur = thn;
                }
            }

            // jika lahir dari ART HDSS dan tahu PERKIRAAN tgl masuk
            if ($scope.artb.artb24 == 3 && $scope.artb.artb37a == 2) {
                $scope.artb.artb05 = $scope.artb.artb38;
                // hitung usia
                if (artb.artb05) {
                    var thn = AppService.getAge(artb.artb05);
                    $scope.umur = thn;
                }
                
            }

            //jika lahir di dalam sleman atau luar sleman
            if (artb.artb24 == 1 || artb.artb24 == 2) {
                // Jika Tidak tahu tgl lahir
                if (artb.artb05a == 2) {
                    if (artb.artb06a) { // thn diisi
                        $scope.umur = artb.artb06a;
                    } else {
                        $scope.umur = 0;
                    }
                } else {
                    if (artb.artb05) {
                        var thn = AppService.getAge(artb.artb05);
                        // artb.artb06a = thn;
                        $scope.umur = thn;
                    } else {
                        $scope.umur = '';
                    }
                }
            }
            
            // cek listHubRT
            idart = $scope.artb.artb03b;
            var dataART = $rootScope.dataART;
                dataART.forEach(function(val,idx){
                    idart_val = val.art03b || val.artb03b;
                    hubrt_val = val.art02 || val.artb02;
                    if ((idart != idart_val) && (hubrt_val == 1)) { //jika ada ART lain yg sudah jadi KK
                        $scope.listHubRT = AppService.listHubRT2();
                    }
                });
        }
        
        $scope.cekJKN = function(param){
            if (param == 'artb2001') {
                $scope.artb.artb2002 = '2'; $scope.artb.artb2003 = '2'; $scope.artb.artb2004 = '2'; $scope.artb.artb2005 = '2';
            }else  if (param == 'artb2002') {
                $scope.artb.artb2001 = '2'; $scope.artb.artb2003 = '2'; $scope.artb.artb2004 = '2'; $scope.artb.artb2005 = '2';
            }else if (param == 'artb2003') {
                $scope.artb.artb2002 = '2'; $scope.artb.artb2001 = '2'; $scope.artb.artb2004 = '2'; $scope.artb.artb2005 = '2';
            }else if (param == 'artb2004') {
                $scope.artb.artb2002 = '2'; $scope.artb.artb2003 = '2'; $scope.artb.artb2001 = '2'; $scope.artb.artb2005 = '2';
            }else if (param == 'artb2005' == 1) {
                $scope.artb.artb2002 = '2'; $scope.artb.artb2003 = '2'; $scope.artb.artb2004 = '2'; $scope.artb.artb2001 = '2';
            }
        }

        $scope.calcUmur = function() {
            // jika lahir di luar/dalam sleman
            if (artb.artb24 == 1 || artb.artb24 == 2) {
                // Jika Tidak tahu tgl lahir
                if (artb.artb05a == 2) {
                    if (artb.artb06a) { // thn diisi
                        $scope.umur = artb.artb06a;
                    } else {
                        $scope.umur = 0;
                    }
                } else {
                    if (artb.artb05) {
                        var thn = AppService.getAge(artb.artb05);
                        // artb.artb06a = thn;
                        $scope.umur = thn;
                    } else {
                        $scope.umur = '';
                    }
                }
            }

            // jika lahir dari ART HDSS
            if ($scope.artb.artb24 == 3) {
                // tahu tgl masuk
                if ($scope.artb.artb37a == 1) {
                    $scope.artb.artb05 = $scope.artb.artb37;
                    // hitung usia
                    if (artb.artb05) {
                        var thn = AppService.getAge(artb.artb05);
                        $scope.umur = thn;
                    }

                }
                // tahu PERKIRAAN tgl masuk
                if ($scope.artb.artb37a == 2) {
                    $scope.artb.artb05 = $scope.artb.artb38;
                    // hitung usia
                    if (artb.artb05) {
                        var thn = AppService.getAge(artb.artb05);
                        $scope.umur = thn;
                    }

                }
            }
                
        };

        AppService.getTglWawancaraNow(true).then(function(val) {
            $scope.tglMaxEntry = val;
            $scope.tglLhrMax = val;
        });

        $scope.waktuPendidikan = function(waktu){
            $scope.pendidikan = waktu <= $scope.umur && waktu > 0;
        }

        $scope.generateIdartNew = function(artb03b) {
            $scope.artb.artb03b = artb03b + 1;
            $scope.idart_tersedia = !$scope.allListIDART.includes($scope.artb.artb03b);
            console.log($scope.idart_tersedia);
        };

        $scope.migrasiARTBmeninggal = function(artb21b){
            if (artb21b == 1) {
                $scope.artb.artb24 = '3';
            }
        }

        //Agar tidak bisa mengetik '*','+' dan '-'//
        // $scope.onlyNumber = function() {
        //     var onlyNumber = event.charCode >= 48 && event.charCode <= 57;
        //     return onlyNumber;
        // }
        //
        
        $scope.save = function(param,artb) {
            $scope.artb.start_in_wave_art = parseInt($rootScope.t_siklus);
            $rootScope.$broadcast('saving:show');
            AppService.saveDataKel('artb', $scope.artb).then(function(data) {
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

        /* validasi data ARTB*/
        $scope.allowSave = function(myForm) {
            var artb = $scope.artb;
            var allow = artb.artb01 && artb.artb02 && artb.artb04 && artb.artb21a && artb.artb24;

                        // jika asal migrasi dalam sleman
                        if (artb.artb24 == 2) {
                            allow = allow && artb.artb24a;
                        }

                        // jika keberadaan tidak ada
                        if (artb.artb21a == 2) {
                            allow = allow && artb.artb21b && artb.artb21ex &&
                                    artb.artb11 && artb.artb12 && artb.artb14 && artb.artb15;
                            if (artb.artb21ex == 1) {
                                allow = allow && artb.artb21e;
                            }else if (artb.artb21ex == 2) {
                                allow = allow && artb.artb21ep;
                            }
                        }

                        // jika keberadaan ada
                        if (artb.artb21a == 1) {
                            allow = allow && artb.artb03a && artb.artb16a && artb.artb16 && artb.artb18 && artb.artb19
                                    artb.artb23 && artb.artb37a && artb.artb07;

                                                        // jika perempuan & umur 10-54 maka harus isi status kehamilan
                            if ((artb.artb04 == 2) && ($scope.umur >= 10) && ($scope.umur <= 54) && (artb.artb21a == 1)) {
                                allow = allow && artb.artb22;
                            }

                            // asal migrasi dalam/luar sleman tanyakan: Apakah tahu tanggal lahir?
                            if (artb.artb24 == 1 || artb.artb24 == 2) {
                                // apakah tahu tgl lahir
                                allow = allow && artb.artb05a;
                                // jika tgl lahir tahu
                                if(artb.artb05a == 1){
                                    allow = allow && artb.artb05 && artb.artb05b;
                                }
                                // jika sumber informasi tgl lahir lainnya, sebutkan
                                if (artb.artb05b == 5) {
                                    allow = allow && artb.artb05b1;
                                }
                                // jika tgl lahir tidak tahu, isi usia dalam tahun dan bulan
                                if(artb.artb05a == 2){
                                    allow = allow && (artb.artb06a >= 0 && artb.artb06b >= 0);
                                }
                            }

                            // jika status belum kawin
                            if(artb.artb07 == 1){
                                allow = allow && artb.artb11 && artb.artb12 && artb.artb13 && artb.artb14 && artb.artb15;
                            }
                            // jika status kawin, cerai hidup, cerai mati, dll
                            if(artb.artb07 > 1){
                                allow = allow && artb.artb08ax && artb.artb08bx
                                        && artb.artb11 && artb.artb12 && artb.artb13 && artb.artb14 && artb.artb15;
                                        if (artb.artb08ax == 1) {
                                            allow = allow && artb.artb08a;
                                        }
                                        if (artb.artb08bx == 1) {
                                            allow = allow && artb.artb08b;
                                        }
                                        // jika status kawin
                                        if(artb.artb07 == 2){
                                            allow = allow && artb.artb09 && artb.artb10;
                                        }
                            }
                            // jika ada riwayat pendidikan
                            if(artb.artb16 > 1 && artb.artb16 < 98){
                                allow = allow && artb.artb17;
                            }else{
                                $scope.pendidikan = true;
                            }
                            // jika pekerjaan utama lainnya
                            if(artb.artb18 == 95){
                                allow = allow && artb.artb18a;
                            }
                            // jika sudah bekerja, isi deskripsi pekerjaan
                            if(artb.artb18 > 1){
                                allow = allow && artb.artb18b;
                            }
                            // jika memiliki asuransi kesehatan
                            if(artb.artb19 == 1){
                                allow = allow && artb.artb2001 && artb.artb2002 && artb.artb2003 && artb.artb2004 && artb.artb2005 && artb.artb2006 && artb.artb2007 && artb.artb2008 && artb.artb2009 && artb.artb2010 && artb.artb2011 && artb.artb2095 && artb.artb2098;
                                // jika asuransi kesehatan lainnya
                                if(artb.artb2095 == 1){
                                    allow = allow && artb.artb2095a;
                                }
                            }
                            //apakah tahu tgl masuk ARTB
                            if (artb.artb21a == 1 && artb.artb37a == 1) { allow = allow && artb.artb37; }
                            //jika tahu, isi perkiraan tgl masuk ARTB
                            if (artb.artb21a == 1 && artb.artb37a == 2) { allow = allow && artb.artb38; }

                            // hanya boleh isi tahun/bulan saja
                            // if (artb.artb06a || artb.artb06b) {
                            //     var usia_a = artb.artb06a && artb.artb06b;
                            //     allow = allow && !usia_a;
                            // }
                            
                        }                            
                    
            return allow && myForm.$valid && $scope.idart_tersedia && $scope.pendidikan;
        };

        $scope.cariPekerjaan = function(filterPekerjaan){
            $scope.listPekerjaanNew = AppService.cariListPekerjaan(filterPekerjaan);
            $scope.listPekerjaanNew = $scope.listPekerjaanNew.slice(0, 5);
            $scope.tampilkan_list = true; // tampilkan list
        }

        $scope.setPekerjaan = function(val){
            $scope.tampilkan_list = false; // hidden list
            $scope.artb.artb18a = val;
        }
    }
})();
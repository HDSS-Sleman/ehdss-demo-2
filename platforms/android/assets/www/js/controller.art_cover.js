(function() {
    angular.module('ehdss')
        .controller('ArtCoverCtrl', ArtCoverCtrl);

    ArtCoverCtrl.$inject = ['$scope', '$state', '$rootScope', '$timeout', 'AppService', '$ionicPopup', '$http'];

    function ArtCoverCtrl($scope, $state, $rootScope, $timeout, AppService, $ionicPopup, $http) {
        
        // $scope.no_cov = false; // hide cover yg tidak terpakai ketika covid 
        $scope.tab_catatan =  $rootScope.tab_catatan;
        $scope.tab_cover = $rootScope.tab_cover;
        $scope.cke = {};
        $scope.cke.idrt = $rootScope.dataRT.idrt;
        
        // ambil data yg tersimpan di localforage
        AppService.getDataART().then(function(data) {
            $scope.dataART = data.filter(function(item) {
                return !item.artTdkAda && !item.artb;
            });
            
            // cover ambil dari data baseline untuk beebrapa variabel
            $scope.cover = $rootScope.dataRT.cover || {};
            $scope.cover.kl00 = $scope.cover.kl00 || $rootScope.dataRT.kl00;
            $scope.cover.kl01 = $scope.cover.kl01 || $rootScope.dataRT.kl01;
            $scope.cover.kl02 = $scope.cover.kl02 || $rootScope.dataRT.kl02;
            $scope.cover.kl03 = $scope.cover.kl03 || $rootScope.dataRT.kl03;
            $scope.cover.kl04 = $scope.cover.kl04 || $rootScope.dataRT.kl04;
            $scope.cover.kl05 = $scope.cover.kl05 || $rootScope.dataRT.kl05;
            $scope.cover.kl08 = $scope.cover.kl08 || $rootScope.dataRT.kl08;
            // $scope.cover.kl08 = $scope.cover.kl08 ? $scope.cover.kl08 : $rootScope.dataRT.kl08.replace(/,/g, ' '); //replace all koma dg spasi
            


            // if ($rootScope.dataRT.rRefresh || $rootScope.dataRT.rPecah) {
            //     $scope.cover.kl08a = $scope.cover.kl08a || $scope.dataRT.kl08a;
            //     $scope.cover.krt01_1 = $scope.cover.krt01_1 || $scope.dataRT.krt01;
            //     $scope.cover.krt02 = $scope.cover.krt02 || $scope.dataRT.krt02;
            //     $scope.cover.krt04 = $scope.cover.krt04 || $scope.dataRT.krt04;
            //     $scope.cover.krt05 = $scope.cover.krt05 || $scope.dataRT.krt05;

            // }
            
        });

        // ambil catatan enum di localforage
        AppService.getCatatanEnum($rootScope.dataRT.idrt).then(function(data) {
            $scope.cke = data || {};
            
            if (String($rootScope.dataRT.krt03).match(/^"(.*)"$/)) {
                var telp = $rootScope.dataRT.krt03.replace(/^"(.*)"$/, '$1'); // hilangkan quotation dari no HP
            }else{
                var telp = $rootScope.dataRT.krt03;
            }
                
            // jika no telp ada banyak
            if (String(telp).match(/[\,]/)) {
                var telpArr = telp.split(',');
                if (telpArr[0]) { 
                    if ($scope.cke.kontak1_m1) {
                        $scope.cke.kontak1_m1 = ''+$scope.cke.kontak1_m1;
                    }else{
                        $scope.cke.kontak1_m1 = ''+telpArr[0]; 
                    }
                    
                }
                if (telpArr[1]) { 
                    if ($scope.cke.kontak2_m1) {
                        $scope.cke.kontak2_m1 = ''+$scope.cke.kontak2_m1;
                    }else{
                        $scope.cke.kontak2_m1 = ''+telpArr[1];
                    }
                     
                }
                if (telpArr[2]) { 
                    if ($scope.cke.kontak3_m1) {
                        $scope.cke.kontak3_m1 = ''+$scope.cke.kontak3_m1;
                    }else{
                        $scope.cke.kontak3_m1 = ''+telpArr[2]; 
                    }
                    
                }
            }else{
                if ($scope.cke.kontak1_m1) {
                    $scope.cke.kontak1_m1 = ''+$scope.cke.kontak1_m1;
                }else{
                    $scope.cke.kontak1_m1 = ''+telp;
                }
            }
            

            /*ubah semua value data ke string kecuali yg date*/
            for (var key in $scope.cke) {
                if (key != 'idrt') {
                    $scope.cke[key] = ''+$scope.cke[key];
                }
            }
            $scope.cke.idrt = $rootScope.dataRT.idrt;

            if ($scope.cke.tglcke1_m1) {$scope.cke.tglcke1_m1 = new Date($scope.cke.tglcke1_m1);}
            if ($scope.cke.tglcke2_m1) {$scope.cke.tglcke2_m1 = new Date($scope.cke.tglcke2_m1);}
            if ($scope.cke.tglcke3_m1) {$scope.cke.tglcke3_m1 = new Date($scope.cke.tglcke3_m1);}

            if ($scope.cke.tglcke1_m2) {$scope.cke.tglcke1_m2 = new Date($scope.cke.tglcke1_m2);}
            if ($scope.cke.tglcke2_m2) {$scope.cke.tglcke2_m2 = new Date($scope.cke.tglcke2_m2);}
            if ($scope.cke.tglcke3_m2) {$scope.cke.tglcke3_m2 = new Date($scope.cke.tglcke3_m2);}

            if ($scope.cke.tglj_m1) {$scope.cke.tglj_m1 = new Date($scope.cke.tglj_m1);}
            if ($scope.cke.jamj_m1) {$scope.cke.jamj_m1 = AppService.deNormalisasiDataJam($scope.cke.jamj_m1);}
            if ($scope.cke.jaminput_m1) { $scope.cke.jaminput_m1 = AppService.deNormalisasiDataJam($scope.cke.jaminput_m1); }

            if ($scope.cke.tglj_m2) {$scope.cke.tglj_m2 = new Date($scope.cke.tglj_m2);}
            if ($scope.cke.jamj_m2) {$scope.cke.jamj_m2 = AppService.deNormalisasiDataJam($scope.cke.jamj_m2);}
            if ($scope.cke.jaminput_m2) { $scope.cke.jaminput_m2 = AppService.deNormalisasiDataJam($scope.cke.jaminput_m2); }
        });

        $scope.kode_enum = AppService.listKodeEnum();
        $scope.kode_spv = AppService.listKodeSPV();
        $scope.kode_pos = AppService.listKodePos();

        AppService.getTglWawancaraPlusSatu(true).then(function(val) {
            $scope.tglWawancara = val;
        });

        $scope.CatatanAllowSave = function(ctForm){
            var cke = $scope.cke;
            var allow = cke.idrt;
                    /* jika modul utama*/
                    if ($rootScope.catatanModulUtama == true) {
                        /* jika kunjungan berhasil*/
                        if (cke.statuscke1_m1 == 1 || cke.statuscke2_m1 == 1 || cke.statuscke3_m1 == 1) {
                            allow = allow && 
                                (
                                    (cke.tglcke1_m1 && cke.statuscke1_m1 == 1 && cke.ketcke1_m1) || 
                                    (cke.tglcke2_m1 && cke.statuscke2_m1 == 1 && cke.ketcke2_m1) || 
                                    (cke.tglcke3_m1 && cke.statuscke3_m1 == 1 && cke.ketcke3_m1)
                                ); 
                        }
                        if (cke.statuscke1_m1 == 1 || cke.statuscke2_m1 == 1 || cke.statuscke3_m1 == 1) {
                            allow = allow && cke.statuscke_m1a; // jika berhasil, tanyakan keikutsertaan tahun berikutnya
                        }
                        
                        /* jika kunjungan gagal*/
                        if (cke.statuscke1_m1 == 2) {
                            allow = allow && cke.agglcke1_m1 && cke.agglcke1_m1 != 'undefined' && cke.ketcke1_m1;
                            if (cke.agglcke1_m1 == 3) {
                                allow = allow && cke.agglcke1_m1a;
                            }
                        }
                        if (cke.statuscke2_m1 == 2) {
                            allow = allow && cke.agglcke2_m1 && cke.agglcke2_m1 != 'undefined' && cke.ketcke2_m1;
                            if (cke.agglcke2_m1 == 3) {
                                allow = allow && cke.agglcke2_m1a;
                            }
                        }
                        if (cke.statuscke3_m1 == 2) {
                            allow = allow && cke.agglcke3_m1 && cke.agglcke3_m1 != 'undefined' && cke.ketcke3_m1;
                            if (cke.agglcke3_m1 == 3) {
                                allow = allow && cke.agglcke3_m1a;
                            }
                        }

                        //tanyakan moda wawancara, jika berhasil mau wawancara
                        if ($scope.cke.status_final_cke_m1 == 'berhasil') {
                            allow = cke.moda_m1 && (cke.kontak1_m1 || cke.kontak2_m1 || cke.kontak3_m1);
                            if (cke.moda_m1 == 2) {
                                allow = allow && cke.tglj_m1 && cke.jamj_m1 != null;
                            }
                            if (cke.kontak1_m1) { // jika ada no HP, tanyakan status aktif/tidak
                                allow = allow && cke.skontak1_m1;
                            }
                            if (cke.kontak2_m1) { // jika ada no HP, tanyakan status aktif/tidak
                                allow = allow && cke.skontak2_m1;
                            }
                            if (cke.kontak3_m1) { // jika ada no HP, tanyakan status aktif/tidak
                                allow = allow && cke.skontak3_m1;
                            }
                        }

                    }
                    /* jika modul B*/
                    if ($rootScope.catatanModulB == true) {
                        /* jika kunjungan berhasil*/
                        if (cke.statuscke1_m2 == 1 || cke.statuscke2_m2 == 1 || cke.statuscke3_m2 == 1) {
                            allow = allow && 
                                (
                                    (cke.tglcke1_m2 && cke.statuscke1_m2 == 1 && cke.ketcke1_m2) || 
                                    (cke.tglcke2_m2 && cke.statuscke2_m2 == 1 && cke.ketcke2_m2) || 
                                    (cke.tglcke3_m2 && cke.statuscke3_m2 == 1 && cke.ketcke3_m2)
                                ); 
                        }
                        
                        /* jika kunjungan gagal*/
                        if (cke.statuscke1_m2 == 2) {
                            allow = allow && cke.agglcke1_m2 && cke.agglcke1_m2 != 'undefined' && cke.ketcke1_m2;
                        }
                        if (cke.statuscke2_m2 == 2) {
                            allow = allow && cke.agglcke2_m2 && cke.agglcke2_m2 != 'undefined' && cke.ketcke2_m2;
                        }
                        if (cke.statuscke3_m2 == 2) {
                            allow = allow && cke.agglcke3_m2 && cke.agglcke3_m2 != 'undefined' && cke.ketcke3_m2;
                        }

                        //tanyakan moda wawancara, jika berhasil mau wawancara
                        if ($scope.cke.status_final_cke_m2 == 'berhasil') {
                            allow = cke.moda_m2 && (cke.kontak1_m2 || cke.kontak2_m2 || cke.kontak3_m2);
                            if (cke.moda_m2 == 2) {
                                allow = allow && cke.tglj_m2 && cke.jamj_m2 != null;
                            }
                            if (cke.kontak1_m2) { // jika ada no HP, tanyakan status aktif/tidak
                                allow = allow && cke.skontak1_m2;
                            }
                            if (cke.kontak2_m2) { // jika ada no HP, tanyakan status aktif/tidak
                                allow = allow && cke.skontak2_m2;
                            }
                            if (cke.kontak3_m2) { // jika ada no HP, tanyakan status aktif/tidak
                                allow = allow && cke.skontak3_m2;
                            }
                        }

                    }
                        
            return allow && ctForm.$valid;
        }

        $scope.CoverAllowSave = function(cvForm) {
            if ($scope.cover) {
                var cover = $scope.cover;
                var allow = cover.kl00 && cover.kl08a && cover.krt01_1 && cover.krt02 &&
                            cover.krt04 && cover.krt05 && cover.kpd01 && cover.kpd04;
                return allow && cvForm.$valid;
            }
            
        };

        /* Kesimpulan final Modul Utama */
        $scope.status_final_cke_m1 = function(param){
            var cke = $scope.cke;

            if (param == 'gagal1m1') {
                if (cke.tglcke2_m1) { delete $scope.cke.tglcke2_m1; }
                if (cke.statuscke2_m1) { delete $scope.cke.statuscke2_m1;}
                if (cke.agglcke2_m1) { delete $scope.cke.agglcke2_m1;}
                if (cke.ketcke2_m1) { delete $scope.cke.ketcke2_m1; }

                if (cke.tglcke3_m1) { delete $scope.cke.tglcke3_m1; }
                if (cke.statuscke3_m1) { delete $scope.cke.statuscke3_m1;}
                if (cke.agglcke3_m1) { delete $scope.cke.agglcke3_m1;}
                if (cke.ketcke3_m1) { delete $scope.cke.ketcke3_m1; }
            }

            if (param == 'gagal2m1') {
                if (cke.tglcke3_m1) { delete $scope.cke.tglcke3_m1; }
                if (cke.statuscke3_m1) { delete $scope.cke.statuscke3_m1; }
                if (cke.agglcke3_m1) { delete $scope.cke.agglcke3_m1; }
                if (cke.ketcke3_m1) { delete $scope.cke.ketcke3_m1; }
            }

            var  berhasil = false, gagal = false, pending = false; 
            berhasil = (cke.statuscke1_m1 == 1 || cke.statuscke2_m1 == 1 || cke.statuscke3_m1 == 1);
            gagal = ( (cke.agglcke1_m1 == 1) || (cke.agglcke1_m1 == 2) || (cke.agglcke1_m1 == 3) || (cke.agglcke1_m1 == 5) || (cke.agglcke1_m1 == 6) || (cke.agglcke1_m1 == 7) || (cke.agglcke1_m1 == 8))
                        ||
                    ( (cke.agglcke2_m1 == 1) || (cke.agglcke2_m1 == 2) || (cke.agglcke2_m1 == 3) || (cke.agglcke2_m1 == 5) || (cke.agglcke2_m1 == 6) || (cke.agglcke2_m1 == 7) || (cke.agglcke2_m1 == 8))
                        ||
                    ( (cke.agglcke3_m1 == 1) || (cke.agglcke3_m1 == 2) || (cke.agglcke3_m1 == 3) || (cke.agglcke3_m1 == 5) || (cke.agglcke3_m1 == 6) || (cke.agglcke3_m1 == 7) || (cke.agglcke3_m1 == 8))
                        || 
                    ( (cke.agglcke1_m1 == 4) && (cke.agglcke2_m1 == 4) && (cke.agglcke3_m1 == 4 || cke.agglcke3_m1 == 6) )
                    ;
            pending = ( (cke.agglcke1_m1 == 4) || (cke.agglcke2_m1 == 4) );
            if (berhasil == true) {
                $scope.cke.status_final_cke_m1 = 'berhasil';
            }else if (gagal == true) {

                // untuk yg menolak menjadi responden
                if (cke.agglcke1_m1==3 || cke.agglcke2_m1==3 || cke.agglcke3_m1==3) {
                    $scope.cke.status_final_cke_m1 = 'menolak menjadi responden';
                }else{
                    $scope.cke.status_final_cke_m1 = 'gagal';
                }

                
            }else if (pending == true) {
                $scope.cke.status_final_cke_m1 = 'pending';
            }


        };

        /* Kesimpulan final Modul B */
        $scope.status_final_cke_m2 = function(){
            var cke = $scope.cke;
            var  berhasil = false, gagal = false, pending = false; 
            berhasil = (cke.statuscke1_m2 == 1 || cke.statuscke2_m2 == 1 || cke.statuscke3_m2 == 1);
            gagal = ( cke.agglcke1_m2 == 1 || cke.agglcke1_m2 == 3 )
                        ||
                    ( cke.agglcke2_m2 == 1 || cke.agglcke2_m2 == 3 ) 
                        ||
                    ( cke.agglcke3_m2 == 1 || cke.agglcke3_m2 == 3)
                        || 
                    ( cke.agglcke1_m2 == 2 && cke.agglcke2_m2 == 2 && cke.agglcke3_m2 == 2)
                    ;
            pending = ( (cke.agglcke1_m2 == 2) || (cke.agglcke2_m2 == 2) );
            if (berhasil == true) {
                $scope.cke.status_final_cke_m2 = 'berhasil';
            }else if (gagal == true) {
                $scope.cke.status_final_cke_m2 = 'gagal';
            }else if (pending == true) {
                $scope.cke.status_final_cke_m2 = 'pending';
            }
        };

        $scope.saveCatatan = function(curMenu, toMenu, cke) {
            $rootScope.$broadcast('saving:show');
            AppService.saveCatatanEnum(cke).then(function(data) {
                $rootScope.$broadcast('saving:hide');
                $rootScope.$broadcast('loading:show');
                $timeout(function() {
                    $rootScope.$broadcast('loading:hide');
                    if ($rootScope.dataRT.start_in_wave_rt === 5) {
                        $state.go('app.art'); // jika RUTA baru, Cover di skip
                    }else if(curMenu == 'utama' && toMenu == 'berhasil_icf'){
                        $state.go('app.icf'); // jika kunjungan berhasil, ke ICF
                    }else if(curMenu == 'utama' && toMenu == 'berhasil_art'){
                        $state.go('app.home'); // simpan kunjungan dengan jam dan tgl janjian
                    }else if(curMenu == 'utama' && toMenu == 'gagal'){ 
                        $state.go('app.home'); // jika Gagal, langsung ke HOME
                    }else if(curMenu == 'utama' && toMenu == 'gagal_icf'){ 
                        $state.go('app.icf'); // jika Gagal dan menolak jadi responden, langsung ke HOME
                    }else if(curMenu == 'utama' && toMenu == 'pending'){
                        $state.go('app.home'); // jika Pending, langsung ke HOME
                    }else if(curMenu == 'B' && toMenu == 'berhasil'){
                        $state.go('app.hl'); // jika catatan modul B berhasil, langsung ke modul B
                    }else if(curMenu == 'B' && toMenu == 'gagal'){
                        $state.go('app.art'); // jika catatan modul B gagal, langsung ke HOME
                    }else if(curMenu == 'B' && toMenu == 'pending'){
                        $state.go('app.art'); // jika catatan modul B Pending, langsung ke HOME
                    }else{
                        $scope[curMenu] = false;
                        $scope[toMenu] = true;
                    }
                }, 300);
            });
        };

        // Save
        $scope.saveCover = function(finish) {
            var goTo = finish ? 'app.art' : '';
            // simpan model, termasuk yg hidden dg ng-show, exclude hidden dg ng-if
            return AppService.saveDataKelMasked('cover', $scope.cover, true, goTo);
        };

        // An alert dialog
        $scope.showAlert = function(title, msg) {
            $ionicPopup.alert({
                title: title || 'Upload Data',
                template: msg || 'Berhasil Menyimpan Data'
            });
        };
        $scope.uploadCKE = function(cke) {
            // A confirm dialog
            var confirmPopup = $ionicPopup.confirm({
                title: 'Upload Catatan Kunjungan',
                template: 'Yakin akan meng-upload data kunjungan berikut ke Server?<br>' +
                    'ID RT : <b>' + cke.idrt + '</b><br>'
            });

            confirmPopup.then(function(res) {
                if (res) {
                    $rootScope.$broadcast('loading:show');
                    AppService.getCatatanEnum(cke.idrt).then(function(data) {
                        var username = $rootScope.username;
                            data.enum = username; //untuk menambahkan data enum ke catatan enum
                        var postData = {
                            idrt: cke.idrt,
                            hash: md5(JSON.stringify(data)),
                            data: data
                        };
                        var config = {
                            headers : {
                                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                            }
                        }
                        $http.post($rootScope.serverUrlUpload + '?module=data&method=upload_catatan_enum', postData, config)
                        .then(
                            function successCallback(resp) {
                                $rootScope.$broadcast('loading:hide');
                                if (resp.data.success) {
                                    $scope.showAlert();
                                } else {
                                    $scope.showAlert('', resp.data.msg);
                                }
                            },
                            function errorCallback(resp) {
                                $rootScope.$broadcast('loading:hide');
                            });
                    });
                } else {
                    $rootScope.$broadcast('loading:hide');
                    // console.log('Upload Canceled');
                }
            });
        };

    }
})();
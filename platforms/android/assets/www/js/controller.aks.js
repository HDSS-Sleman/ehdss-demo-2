(function() {
    angular.module('ehdss')
        .controller('AksCtrl', AksCtrl);

    AksCtrl.$inject = ['$scope', '$rootScope', '$state', '$ionicModal', 'AppService'];

    function AksCtrl($scope, $rootScope, $state, $ionicModal, AppService) {
        $scope.aks = $rootScope.dataRT.aks || {};
        $scope.idrt = $rootScope.dataRT.idrt || {}; 
        // simpan variabel terakhir yg tersimpan
        var lastAks = angular.copy($scope.aks);
        $scope.dataChanged = false;
        // apakah form di modal di save ?
        var modalSaved = false;

        // $scope.curART = $rootScope.cutART;
        AppService.getDataART().then(function(data) {
            $scope.dataART = data.filter(function(item) {
                return !item.artTdkAda;
            });
            $scope.dataART.forEach(function(val,idx){ //masukkan param ptm tiap ART
                var ptm = val.dm + val.hiper + val.stroke + val.pjan + 
                          val.cancer_w2 + val.asma_w2 + val.ppok_w2 + 
                          val.ppok;
                $scope.dataART[idx].param_ptm = ptm;
            });
        });

        $scope.tabel = true;
        $scope.pelayanan = false;

        $scope.jenisPembayaran = {
            '1': 'JKN PBI',
            '2': 'JKN Non-PBI : PNS, POLRI, Pejabat Negara, Pegawai Pemerintah Non-PNS',
            '3': 'JKN Non-PBI: Peserta Mandiri',
            '4': 'JKN Non-PBI: Bukan Pekerja',
            '5': 'JKN Non PBI: Pegawai Swasta',
            '6': 'Jamkesda Sleman',
            '7': 'Jamkesda Sleman Mandiri',
            '8': 'Jamkesta Mandiri',
            '9': 'Jamkesos',
            '10': 'Asuransi Swasta',
            '11': 'Perusahaan',
            '12': 'Bayar Sendiri',
            '98': 'Tidak tahu',
            '95': 'Lainnya'
        };

        $scope.jenisPenyakit = {
            'a': 'dm_w2',
            'b': 'dm_w3',
            'c': 'hiper_w2',
            'd': 'hiper_w3',
            'e': 'stroke_w2',
            'f': 'stroke_w3',
            'g': 'pjk_w2',
            'h': 'cancer_w2',
            'i': 'asma_w2',
            'j': 'ppok_w2',
            'k': 'ppok_w3',
            'l': 'angina_w3',
        };

        // jika performance melambat, fungsi ini mungkin perlu  dihilangkan
        // atau dicari alternatif lainnya..
        $scope.$watch('aks', function() {
            $scope.dataChanged = !angular.equals(lastAks, $scope.aks);
            if ($scope.dataChanged) {
                $scope.dataChanged = true;
                $scope.btnSaveTitle = 'Simpan';
            } else {
                $scope.dataChanged = false;
                $scope.btnSaveTitle = 'Selanjutnya';
            }
        }, true);

        $scope.back = function() {
            $scope.save().then(function() {
                $scope.tabel = true;
                $scope.pelayanan = false;
            });
        };

        $scope.next = function() {
            $scope.save().then(function() {
                $scope.tabel = false;
                $scope.pelayanan = true;
            });
        };
        $scope.tipe = {
            aks01ls: false,
            konfirmasi: false,

        };
        $scope.openModal = function(open, art, tipemodal) {
            $scope.nama = art._nama;
            $scope.umur = art.umur;
            $scope.jk = art._jk;
            $scope.idart = art.idart;
            $scope.dm = art.dm ? 'Ya' : 'Tidak';
            $scope.hiper = art.hiper ? 'Ya' : 'Tidak';
            $scope.stroke = art.stroke ? 'Ya' : 'Tidak';
            $scope.pjan = art.pjan ? 'Ya' : 'Tidak';
            $scope.cancer_w2 = art.cancer_w2 ? 'Ya' : 'Tidak';
            $scope.asma_w2 = art.asma_w2 ? 'Ya' : 'Tidak';
            $scope.ppok = art.ppok ? 'Ya' : 'Tidak';
            
            for (var key in $scope.tipe) {
                if (key == tipemodal) {
                    $scope.tipe[key] = true;
                }else{
                    $scope.tipe[key] = false;
                }  
            }
            // console.log($scope.tipe.aks01ls);
            if (open) {
                $scope.modal.show();
            }
        };

        $scope.defaks = function(idart, val, art, tipemodal){
            /* set default value aks */
            if (!$scope.aks.aks) {
                $scope.aks.aks = {};
            }
            if (val == 1 || val == 3) { // Ya atau Sudah konfirmasi
                $scope.aks.aks[idart] = 1;
            }else{
                if ($scope.aks.aks[idart] == 1) {
                    $scope.aks.aks[idart] = 1;
                }else{
                    $scope.aks.aks[idart] = 0;
                }
            }

            // open modal atau tidak
            $scope.nama = art._nama;
            $scope.umur = art.umur;
            $scope.jk = art._jk;
            $scope.idart = art.idart;
                        
            for (var key in $scope.tipe) {
                if (key == tipemodal) {
                    $scope.tipe[key] = true;
                }else{
                    $scope.tipe[key] = false;
                }  
            }
            
            // open modal jika val = 1
            if (val == 1) {
                $scope.modal.show();
            }
            
        };

        $scope.checkAllowSaveModal = function() {
            var aks = $scope.aks,
                allow = true,
                idart = $scope.idart;
                if ($rootScope.j_siklus.s4) { //jika siklus 4 ada aks2 dan aks3
                    allow = aks.aks02 && aks.aks02[idart]; //pilih tempat berobat
                    if (aks.aks02 && aks.aks02[idart] == 95) { //jika tempat berobat lainnya
                        allow = allow && aks.aks02lain && aks.aks02lain[idart];
                    }
                    if (aks.aks02 && aks.aks02[idart] != 12) { // jika selain tidak pergi berobat, cara Pembayaran berobat 
                        allow = allow && (
                            (aks.aks0301 && aks.aks0301[idart]) &&
                            (aks.aks0302 && aks.aks0302[idart]) &&
                            (aks.aks0303 && aks.aks0303[idart]) &&
                            (aks.aks0304 && aks.aks0304[idart]) &&
                            (aks.aks0305 && aks.aks0305[idart]) &&
                            (aks.aks0306 && aks.aks0306[idart]) &&
                            (aks.aks0307 && aks.aks0307[idart]) &&
                            (aks.aks0308 && aks.aks0308[idart]) &&
                            (aks.aks0309 && aks.aks0309[idart]) &&
                            (aks.aks0310 && aks.aks0310[idart]) &&
                            (aks.aks0311 && aks.aks0311[idart]) &&
                            (aks.aks0312 && aks.aks0312[idart]) &&
                            (aks.aks0313 && aks.aks0313[idart])
                        );

                        if (aks.aks0313 && aks.aks0313[idart] == 1) {
                            allow = allow && aks.aks0313lain && aks.aks0313lain[idart];
                        }

                    }
                }

                if ($scope.tipe.konfirmasi == true) {
                    allow = allow && (aks.aks17 && aks.aks17[idart]);
                            if (aks.aks17 && aks.aks17[idart] == 2) {
                                allow = allow && (aks.aks32a && aks.aks32a[idart]) && (aks.aks32b && aks.aks32b[idart]) &&
                                                 (aks.aks32c && aks.aks32c[idart]) && (aks.aks32d && aks.aks32d[idart]) &&
                                                 (aks.aks32e && aks.aks32e[idart]) && (aks.aks32f && aks.aks32f[idart]) &&
                                                 (aks.aks32g && aks.aks32g[idart]) && (aks.aks32h && aks.aks32h[idart]) &&
                                                 (aks.aks32i && aks.aks32i[idart]) && (aks.aks32j && aks.aks32j[idart]) &&
                                                 (aks.aks32k && aks.aks32k[idart]) && (aks.aks32l && aks.aks32l[idart]) &&
                                                (aks.aks18 && aks.aks18[idart]) && (aks.aks19 && aks.aks19[idart]); 
                            }
                            if (aks.aks17 && aks.aks17[idart] == 3) {
                                allow = allow && (aks.aks18 && aks.aks18[idart]) && (aks.aks19 && aks.aks19[idart]); 
                            }
                            if ((aks.aks17 && aks.aks17[idart] == 1) || (aks.aks17 && aks.aks17[idart] == 2)) {
                                allow = allow && (aks.aks20 && aks.aks20[idart]) && (aks.aks21 && aks.aks21[idart]);
                                if (aks.aks20 && aks.aks20[idart] == 95) {
                                    allow = allow && (aks.aks20a && aks.aks20a[idart]);
                                }
                            }
                }

                if ($scope.tipe.aks01ls == true || (((aks.aks17 && aks.aks17[idart] == 1) || (aks.aks17 && aks.aks17[idart] == 2)) && (aks.aks21 && aks.aks21[idart] == 1)) ) {
                    allow = allow && (aks.aks22 && aks.aks22[idart]) && (aks.aks27 && aks.aks27[idart]);
                    if (aks.aks22 && aks.aks22[idart] == 1) { //jika rawat inap
                        allow = allow && (aks.aks23a && aks.aks23a[idart]) && (aks.aks23b && aks.aks23b[idart]) &&
                                (aks.aks23c && aks.aks23c[idart]) && (aks.aks23d && aks.aks23d[idart]) &&
                                (aks.aks23e && aks.aks23e[idart]) && (aks.aks23f && aks.aks23f[idart]) &&
                                (aks.aks23g && aks.aks23g[idart]) && (aks.aks23h && aks.aks23h[idart]) &&
                                (aks.aks23i && aks.aks23i[idart]) && (aks.aks23j && aks.aks23j[idart]) &&
                                (aks.aks23k && aks.aks23k[idart]) && (aks.aks23l && aks.aks23l[idart]);
                        if (aks.aks23a && aks.aks23a[idart] == 1) { //jika RS Pemerintah
                            allow = allow && (aks.aks24a && aks.aks24a[idart]) && (aks.aks25a && aks.aks25a[idart]) && (aks.aks26a1 && aks.aks26a1[idart]) &&
                                    (aks.aks26a2 && aks.aks26a2[idart]) && (aks.aks26a3 && aks.aks26a3[idart]) && (aks.aks26a4 && aks.aks26a4[idart]) &&
                                    (aks.aks26a5 && aks.aks26a5[idart]) && (aks.aks26a6 && aks.aks26a6[idart]) && (aks.aks26a7 && aks.aks26a7[idart]) &&
                                    (aks.aks26a8 && aks.aks26a8[idart]) && (aks.aks26a9 && aks.aks26a9[idart]) && (aks.aks26a10 && aks.aks26a10[idart]) &&
                                    (aks.aks26a11 && aks.aks26a11[idart]) && (aks.aks26a12 && aks.aks26a12[idart]) && (aks.aks26a95 && aks.aks26a95[idart]) && 
                                    (aks.aks26a98 && aks.aks26a98[idart]);
                                    if (aks.aks26a95 && aks.aks26a95[idart] == 1) {allow = allow && (aks.aks26a95lain && aks.aks26a95lain[idart]);}
                            ;
                        }if (aks.aks23b && aks.aks23b[idart] == 1) { //jika RS Swasta
                            allow = allow && (aks.aks24b && aks.aks24b[idart]) && (aks.aks25b && aks.aks25b[idart]) && (aks.aks26b1 && aks.aks26b1[idart]) &&
                                    (aks.aks26b2 && aks.aks26b2[idart]) && (aks.aks26b3 && aks.aks26b3[idart]) && (aks.aks26b4 && aks.aks26b4[idart]) &&
                                    (aks.aks26b5 && aks.aks26b5[idart]) && (aks.aks26b6 && aks.aks26b6[idart]) && (aks.aks26b7 && aks.aks26b7[idart]) &&
                                    (aks.aks26b8 && aks.aks26b8[idart]) && (aks.aks26b9 && aks.aks26b9[idart]) && (aks.aks26b10 && aks.aks26b10[idart]) &&
                                    (aks.aks26b11 && aks.aks26b11[idart]) && (aks.aks26b12 && aks.aks26b12[idart]) && (aks.aks26b95 && aks.aks26b95[idart]) && 
                                    (aks.aks26b98 && aks.aks26b98[idart]);
                                    if (aks.aks26b95 && aks.aks26b95[idart] == 1) {allow = allow && (aks.aks26b95lain && aks.aks26b95lain[idart]);}
                            ;
                        }if (aks.aks23c && aks.aks23c[idart] == 1) { //jika RS Bersalin
                            allow = allow && (aks.aks24c && aks.aks24c[idart]) && (aks.aks25c && aks.aks25c[idart]) && (aks.aks26c1 && aks.aks26c1[idart]) &&
                                    (aks.aks26c2 && aks.aks26c2[idart]) && (aks.aks26c3 && aks.aks26c3[idart]) && (aks.aks26c4 && aks.aks26c4[idart]) &&
                                    (aks.aks26c5 && aks.aks26c5[idart]) && (aks.aks26c6 && aks.aks26c6[idart]) && (aks.aks26c7 && aks.aks26c7[idart]) &&
                                    (aks.aks26c8 && aks.aks26c8[idart]) && (aks.aks26c9 && aks.aks26c9[idart]) && (aks.aks26c10 && aks.aks26c10[idart]) &&
                                    (aks.aks26c11 && aks.aks26c11[idart]) && (aks.aks26c12 && aks.aks26c12[idart]) && (aks.aks26c95 && aks.aks26c95[idart]) && 
                                    (aks.aks26c98 && aks.aks26c98[idart]);
                                    if (aks.aks26c95 && aks.aks26c95[idart] == 1) {allow = allow && (aks.aks26c95lain && aks.aks26c95lain[idart]);}
                            ;
                        }if (aks.aks23d && aks.aks23d[idart] == 1) { //jika Puskesmas/Pustu
                            allow = allow && (aks.aks24d && aks.aks24d[idart]) && (aks.aks25d && aks.aks25d[idart]) && (aks.aks26d1 && aks.aks26d1[idart]) &&
                                    (aks.aks26d2 && aks.aks26d2[idart]) && (aks.aks26d3 && aks.aks26d3[idart]) && (aks.aks26d4 && aks.aks26d4[idart]) &&
                                    (aks.aks26d5 && aks.aks26d5[idart]) && (aks.aks26d6 && aks.aks26d6[idart]) && (aks.aks26d7 && aks.aks26d7[idart]) &&
                                    (aks.aks26d8 && aks.aks26d8[idart]) && (aks.aks26d9 && aks.aks26d9[idart]) && (aks.aks26d10 && aks.aks26d10[idart]) &&
                                    (aks.aks26d11 && aks.aks26d11[idart]) && (aks.aks26d12 && aks.aks26d12[idart]) && (aks.aks26d95 && aks.aks26d95[idart]) && 
                                    (aks.aks26d98 && aks.aks26d98[idart]);
                                    if (aks.aks26d95 && aks.aks26d95[idart] == 1) {allow = allow && (aks.aks26d95lain && aks.aks26d95lain[idart]);}
                            ;
                        }if (aks.aks23e && aks.aks23e[idart] == 1) { //jika praktek dokter umum
                            allow = allow && (aks.aks24e && aks.aks24e[idart]) && (aks.aks25e && aks.aks25e[idart]) && (aks.aks26e1 && aks.aks26e1[idart]) &&
                                    (aks.aks26e2 && aks.aks26e2[idart]) && (aks.aks26e3 && aks.aks26e3[idart]) && (aks.aks26e4 && aks.aks26e4[idart]) &&
                                    (aks.aks26e5 && aks.aks26e5[idart]) && (aks.aks26e6 && aks.aks26e6[idart]) && (aks.aks26e7 && aks.aks26e7[idart]) &&
                                    (aks.aks26e8 && aks.aks26e8[idart]) && (aks.aks26e9 && aks.aks26e9[idart]) && (aks.aks26e10 && aks.aks26e10[idart]) &&
                                    (aks.aks26e11 && aks.aks26e11[idart]) && (aks.aks26e12 && aks.aks26e12[idart]) && (aks.aks26e95 && aks.aks26e95[idart]) && 
                                    (aks.aks26e98 && aks.aks26e98[idart]);
                                    if (aks.aks26e95 && aks.aks26e95[idart] == 1) {allow = allow && (aks.aks26e95lain && aks.aks26e95lain[idart]);}
                            ;
                        }if (aks.aks23f && aks.aks23f[idart] == 1) { //jika Praktek dokter spesialis
                            allow = allow && (aks.aks24f && aks.aks24f[idart]) && (aks.aks25f && aks.aks25f[idart]) && (aks.aks26f1 && aks.aks26f1[idart]) &&
                                    (aks.aks26f2 && aks.aks26f2[idart]) && (aks.aks26f3 && aks.aks26f3[idart]) && (aks.aks26f4 && aks.aks26f4[idart]) &&
                                    (aks.aks26f5 && aks.aks26f5[idart]) && (aks.aks26f6 && aks.aks26f6[idart]) && (aks.aks26f7 && aks.aks26f7[idart]) &&
                                    (aks.aks26f8 && aks.aks26f8[idart]) && (aks.aks26f9 && aks.aks26f9[idart]) && (aks.aks26f10 && aks.aks26f10[idart]) &&
                                    (aks.aks26f11 && aks.aks26f11[idart]) && (aks.aks26f12 && aks.aks26f12[idart]) && (aks.aks26f95 && aks.aks26f95[idart]) && 
                                    (aks.aks26f98 && aks.aks26f98[idart]);
                                    if (aks.aks26f95 && aks.aks26f95[idart] == 1) {allow = allow && (aks.aks26f95lain && aks.aks26f95lain[idart]);}
                            ;
                        }if (aks.aks23g && aks.aks23g[idart] == 1) { //jika Praktek bidan
                            allow = allow && (aks.aks24g && aks.aks24g[idart]) && (aks.aks25g && aks.aks25g[idart]) && (aks.aks26g1 && aks.aks26g1[idart]) &&
                                    (aks.aks26g2 && aks.aks26g2[idart]) && (aks.aks26g3 && aks.aks26g3[idart]) && (aks.aks26g4 && aks.aks26g4[idart]) &&
                                    (aks.aks26g5 && aks.aks26g5[idart]) && (aks.aks26g6 && aks.aks26g6[idart]) && (aks.aks26g7 && aks.aks26g7[idart]) &&
                                    (aks.aks26g8 && aks.aks26g8[idart]) && (aks.aks26g9 && aks.aks26g9[idart]) && (aks.aks26g10 && aks.aks26g10[idart]) &&
                                    (aks.aks26g11 && aks.aks26g11[idart]) && (aks.aks26g12 && aks.aks26g12[idart]) && (aks.aks26g95 && aks.aks26g95[idart]) && 
                                    (aks.aks26g98 && aks.aks26g98[idart]);
                                    if (aks.aks26g95 && aks.aks26g95[idart] == 1) {allow = allow && (aks.aks26g95lain && aks.aks26g95lain[idart]);}
                            ;
                        }if (aks.aks23h && aks.aks23h[idart] == 1) { //jika praktek perawat
                            allow = allow && (aks.aks24h && aks.aks24h[idart]) && (aks.aks25h && aks.aks25h[idart]) && (aks.aks26h1 && aks.aks26h1[idart]) &&
                                    (aks.aks26h2 && aks.aks26h2[idart]) && (aks.aks26h3 && aks.aks26h3[idart]) && (aks.aks26h4 && aks.aks26h4[idart]) &&
                                    (aks.aks26h5 && aks.aks26h5[idart]) && (aks.aks26h6 && aks.aks26h6[idart]) && (aks.aks26h7 && aks.aks26h7[idart]) &&
                                    (aks.aks26h8 && aks.aks26h8[idart]) && (aks.aks26h9 && aks.aks26h9[idart]) && (aks.aks26h10 && aks.aks26h10[idart]) &&
                                    (aks.aks26h11 && aks.aks26h11[idart]) && (aks.aks26h12 && aks.aks26h12[idart]) && (aks.aks26h95 && aks.aks26h95[idart]) && 
                                    (aks.aks26h98 && aks.aks26h98[idart]);
                                    if (aks.aks26h95 && aks.aks26h95[idart] == 1) {allow = allow && (aks.aks26h95lain && aks.aks26h95lain[idart]);}
                            ;
                        }if (aks.aks23i && aks.aks23i[idart] == 1) { //jika polindes/poskesdes
                            allow = allow && (aks.aks24i && aks.aks24i[idart]) && (aks.aks25i && aks.aks25i[idart]) && (aks.aks26i1 && aks.aks26i1[idart]) &&
                                    (aks.aks26i2 && aks.aks26i2[idart]) && (aks.aks26i3 && aks.aks26i3[idart]) && (aks.aks26i4 && aks.aks26i4[idart]) &&
                                    (aks.aks26i5 && aks.aks26i5[idart]) && (aks.aks26i6 && aks.aks26i6[idart]) && (aks.aks26i7 && aks.aks26i7[idart]) &&
                                    (aks.aks26i8 && aks.aks26i8[idart]) && (aks.aks26i9 && aks.aks26i9[idart]) && (aks.aks26i10 && aks.aks26i10[idart]) &&
                                    (aks.aks26i11 && aks.aks26i11[idart]) && (aks.aks26i12 && aks.aks26i12[idart]) && (aks.aks26i95 && aks.aks26i95[idart]) && 
                                    (aks.aks26i98 && aks.aks26i98[idart]);
                                    if (aks.aks26i95 && aks.aks26i95[idart] == 1) {allow = allow && (aks.aks26i95lain && aks.aks26i95lain[idart]);}
                            ;
                        }if (aks.aks23j && aks.aks23j[idart] == 1) { //jika pengobatan tradisional
                            allow = allow && (aks.aks24j && aks.aks24j[idart]) && (aks.aks25j && aks.aks25j[idart]) && (aks.aks26j1 && aks.aks26j1[idart]) &&
                                    (aks.aks26j2 && aks.aks26j2[idart]) && (aks.aks26j3 && aks.aks26j3[idart]) && (aks.aks26j4 && aks.aks26j4[idart]) &&
                                    (aks.aks26j5 && aks.aks26j5[idart]) && (aks.aks26j6 && aks.aks26j6[idart]) && (aks.aks26j7 && aks.aks26j7[idart]) &&
                                    (aks.aks26j8 && aks.aks26j8[idart]) && (aks.aks26j9 && aks.aks26j9[idart]) && (aks.aks26j10 && aks.aks26j10[idart]) &&
                                    (aks.aks26j11 && aks.aks26j11[idart]) && (aks.aks26j12 && aks.aks26j12[idart]) && (aks.aks26j95 && aks.aks26j95[idart]) && 
                                    (aks.aks26j98 && aks.aks26j98[idart]);
                                    if (aks.aks26j95 && aks.aks26j95[idart] == 1) {allow = allow && (aks.aks26j95lain && aks.aks26j95lain[idart]);}
                            ;
                        }if (aks.aks23k && aks.aks23k[idart] == 1) { //jika fasilitas kes di luar negeri
                            allow = allow && (aks.aks24k && aks.aks24k[idart]) && (aks.aks25k && aks.aks25k[idart]) && (aks.aks26k1 && aks.aks26k1[idart]) &&
                                    (aks.aks26k2 && aks.aks26k2[idart]) && (aks.aks26k3 && aks.aks26k3[idart]) && (aks.aks26k4 && aks.aks26k4[idart]) &&
                                    (aks.aks26k5 && aks.aks26k5[idart]) && (aks.aks26k6 && aks.aks26k6[idart]) && (aks.aks26k7 && aks.aks26k7[idart]) &&
                                    (aks.aks26k8 && aks.aks26k8[idart]) && (aks.aks26k9 && aks.aks26k9[idart]) && (aks.aks26k10 && aks.aks26k10[idart]) &&
                                    (aks.aks26k11 && aks.aks26k11[idart]) && (aks.aks26k12 && aks.aks26k12[idart]) && (aks.aks26k95 && aks.aks26k95[idart]) && 
                                    (aks.aks26k98 && aks.aks26k98[idart]);
                                    if (aks.aks26k95 && aks.aks26k95[idart] == 1) {allow = allow && (aks.aks26k95lain && aks.aks26k95lain[idart]);}
                            ;
                        }if (aks.aks23l && aks.aks23l[idart] == 1) { //jika faskes lainnya
                            allow = allow && (aks.aks23llain && aks.aks23llain[idart]) &&
                                    (aks.aks24l && aks.aks24l[idart]) && (aks.aks25l && aks.aks25l[idart]) && (aks.aks26l1 && aks.aks26l1[idart]) &&
                                    (aks.aks26l2 && aks.aks26l2[idart]) && (aks.aks26l3 && aks.aks26l3[idart]) && (aks.aks26l4 && aks.aks26l4[idart]) &&
                                    (aks.aks26l5 && aks.aks26l5[idart]) && (aks.aks26l6 && aks.aks26l6[idart]) && (aks.aks26l7 && aks.aks26l7[idart]) &&
                                    (aks.aks26l8 && aks.aks26l8[idart]) && (aks.aks26l9 && aks.aks26l9[idart]) && (aks.aks26l10 && aks.aks26l10[idart]) &&
                                    (aks.aks26l11 && aks.aks26l11[idart]) && (aks.aks26l12 && aks.aks26l12[idart]) && (aks.aks26l95 && aks.aks26l95[idart]) && 
                                    (aks.aks26l98 && aks.aks26l98[idart]);
                                    if (aks.aks26l95 && aks.aks26l95[idart] == 1) {allow = allow && (aks.aks26l95lain && aks.aks26l95lain[idart]);}
                            ;
                        }
                    }
                    if (aks.aks27 && aks.aks27[idart] == 1) { //jika rawat jalan
                        //pilih semua biaya berobat diperoleh
                        allow = allow && (aks.aks28a && aks.aks28a[idart]) && (aks.aks28b && aks.aks28b[idart]) &&
                                (aks.aks28c && aks.aks28c[idart]) && (aks.aks28d && aks.aks28d[idart]) &&
                                (aks.aks28e && aks.aks28e[idart]) && (aks.aks28f && aks.aks28f[idart]) &&
                                (aks.aks28g && aks.aks28g[idart]) && (aks.aks28h && aks.aks28h[idart]) &&
                                (aks.aks28i && aks.aks28i[idart]) && (aks.aks28j && aks.aks28j[idart]) &&
                                (aks.aks28k && aks.aks28k[idart]) && (aks.aks28l && aks.aks28l[idart]) && (aks.aks28m && aks.aks28m[idart]);
                        if (aks.aks28a && aks.aks28a[idart] == 1) { //jika RS Pemerintah
                            allow = allow && (aks.aks29a && aks.aks29a[idart]) && (aks.aks30a && aks.aks30a[idart]) && (aks.aks31a1 && aks.aks31a1[idart]) &&
                                    (aks.aks31a2 && aks.aks31a2[idart]) && (aks.aks31a3 && aks.aks31a3[idart]) && (aks.aks31a4 && aks.aks31a4[idart]) &&
                                    (aks.aks31a5 && aks.aks31a5[idart]) && (aks.aks31a6 && aks.aks31a6[idart]) && (aks.aks31a7 && aks.aks31a7[idart]) &&
                                    (aks.aks31a8 && aks.aks31a8[idart]) && (aks.aks31a9 && aks.aks31a9[idart]) && (aks.aks31a10 && aks.aks31a10[idart]) &&
                                    (aks.aks31a11 && aks.aks31a11[idart]) && (aks.aks31a12 && aks.aks31a12[idart]) && (aks.aks31a95 && aks.aks31a95[idart]) &&
                                    (aks.aks31a98 && aks.aks31a98[idart]);
                                    if (aks.aks31a95 && aks.aks31a95[idart] == 1) {allow = allow && (aks.aks31a95lain && aks.aks31a95lain[idart]);}
                            ;
                        }if (aks.aks28b && aks.aks28b[idart] == 1) { //jika RS Swasta
                            allow = allow && (aks.aks29b && aks.aks29b[idart]) && (aks.aks30b && aks.aks30b[idart]) && (aks.aks31b1 && aks.aks31b1[idart]) &&
                                    (aks.aks31b2 && aks.aks31b2[idart]) && (aks.aks31b3 && aks.aks31b3[idart]) && (aks.aks31b4 && aks.aks31b4[idart]) &&
                                    (aks.aks31b5 && aks.aks31b5[idart]) && (aks.aks31b6 && aks.aks31b6[idart]) && (aks.aks31b7 && aks.aks31b7[idart]) &&
                                    (aks.aks31b8 && aks.aks31b8[idart]) && (aks.aks31b9 && aks.aks31b9[idart]) && (aks.aks31b10 && aks.aks31b10[idart]) &&
                                    (aks.aks31b11 && aks.aks31b11[idart]) && (aks.aks31b12 && aks.aks31b12[idart]) && (aks.aks31b95 && aks.aks31b95[idart]) &&
                                    (aks.aks31b98 && aks.aks31b98[idart]);
                                    if (aks.aks31b95 && aks.aks31b95[idart] == 1) {allow = allow && (aks.aks31b95lain && aks.aks31b95lain[idart]);}
                            ;
                        }if (aks.aks28c && aks.aks28c[idart] == 1) { //jika RS Bersalin
                            allow = allow && (aks.aks29c && aks.aks29c[idart]) && (aks.aks30c && aks.aks30c[idart]) && (aks.aks31c1 && aks.aks31c1[idart]) &&
                                    (aks.aks31c2 && aks.aks31c2[idart]) && (aks.aks31c3 && aks.aks31c3[idart]) && (aks.aks31c4 && aks.aks31c4[idart]) &&
                                    (aks.aks31c5 && aks.aks31c5[idart]) && (aks.aks31c6 && aks.aks31c6[idart]) && (aks.aks31c7 && aks.aks31c7[idart]) &&
                                    (aks.aks31c8 && aks.aks31c8[idart]) && (aks.aks31c9 && aks.aks31c9[idart]) && (aks.aks31c10 && aks.aks31c10[idart]) &&
                                    (aks.aks31c11 && aks.aks31c11[idart]) && (aks.aks31c12 && aks.aks31c12[idart]) && (aks.aks31c95 && aks.aks31c95[idart]) &&
                                    (aks.aks31c98 && aks.aks31c98[idart]);
                                    if (aks.aks31c95 && aks.aks31c95[idart] == 1) {allow = allow && (aks.aks31c95lain && aks.aks31c95lain[idart]);}
                            ;
                        }if (aks.aks28d && aks.aks28d[idart] == 1) { //jika Puskesmas/Pustu
                            allow = allow && (aks.aks29d && aks.aks29d[idart]) && (aks.aks30d && aks.aks30d[idart]) && (aks.aks31d1 && aks.aks31d1[idart]) &&
                                    (aks.aks31d2 && aks.aks31d2[idart]) && (aks.aks31d3 && aks.aks31d3[idart]) && (aks.aks31d4 && aks.aks31d4[idart]) &&
                                    (aks.aks31d5 && aks.aks31d5[idart]) && (aks.aks31d6 && aks.aks31d6[idart]) && (aks.aks31d7 && aks.aks31d7[idart]) &&
                                    (aks.aks31d8 && aks.aks31d8[idart]) && (aks.aks31d9 && aks.aks31d9[idart]) && (aks.aks31d10 && aks.aks31d10[idart]) &&
                                    (aks.aks31d11 && aks.aks31d11[idart]) && (aks.aks31d12 && aks.aks31d12[idart]) && (aks.aks31d95 && aks.aks31d95[idart]) &&
                                    (aks.aks31d98 && aks.aks31d98[idart]);
                                    if (aks.aks31d95 && aks.aks31d95[idart] == 1) {allow = allow && (aks.aks31d95lain && aks.aks31d95lain[idart]);}
                            ;
                        }if (aks.aks28e && aks.aks28e[idart] == 1) { //jika praktek dokter umum
                            allow = allow && (aks.aks29e && aks.aks29e[idart]) && (aks.aks30e && aks.aks30e[idart]) && (aks.aks31e1 && aks.aks31e1[idart]) &&
                                    (aks.aks31e2 && aks.aks31e2[idart]) && (aks.aks31e3 && aks.aks31e3[idart]) && (aks.aks31e4 && aks.aks31e4[idart]) &&
                                    (aks.aks31e5 && aks.aks31e5[idart]) && (aks.aks31e6 && aks.aks31e6[idart]) && (aks.aks31e7 && aks.aks31e7[idart]) &&
                                    (aks.aks31e8 && aks.aks31e8[idart]) && (aks.aks31e9 && aks.aks31e9[idart]) && (aks.aks31e10 && aks.aks31e10[idart]) &&
                                    (aks.aks31e11 && aks.aks31e11[idart]) && (aks.aks31e12 && aks.aks31e12[idart]) && (aks.aks31e95 && aks.aks31e95[idart]) &&
                                    (aks.aks31e98 && aks.aks31e98[idart]);
                                    if (aks.aks31e95 && aks.aks31e95[idart] == 1) {allow = allow && (aks.aks31e95lain && aks.aks31e95lain[idart]);}
                            ;
                        }if (aks.aks28f && aks.aks28f[idart] == 1) { //jika Praktek dokter spesialis
                            allow = allow && (aks.aks29f && aks.aks29f[idart]) && (aks.aks30f && aks.aks30f[idart]) && (aks.aks31f1 && aks.aks31f1[idart]) &&
                                    (aks.aks31f2 && aks.aks31f2[idart]) && (aks.aks31f3 && aks.aks31f3[idart]) && (aks.aks31f4 && aks.aks31f4[idart]) &&
                                    (aks.aks31f5 && aks.aks31f5[idart]) && (aks.aks31f6 && aks.aks31f6[idart]) && (aks.aks31f7 && aks.aks31f7[idart]) &&
                                    (aks.aks31f8 && aks.aks31f8[idart]) && (aks.aks31f9 && aks.aks31f9[idart]) && (aks.aks31f10 && aks.aks31f10[idart]) &&
                                    (aks.aks31f11 && aks.aks31f11[idart]) && (aks.aks31f12 && aks.aks31f12[idart]) && (aks.aks31f95 && aks.aks31f95[idart]) &&
                                    (aks.aks31f98 && aks.aks31f98[idart]);
                                    if (aks.aks31f95 && aks.aks31f95[idart] == 1) {allow = allow && (aks.aks31f95lain && aks.aks31f95lain[idart]);}
                            ;
                        }if (aks.aks28g && aks.aks28g[idart] == 1) { //jika Praktek bidan
                            allow = allow && (aks.aks29g && aks.aks29g[idart]) && (aks.aks30g && aks.aks30g[idart]) && (aks.aks31g1 && aks.aks31g1[idart]) &&
                                    (aks.aks31g2 && aks.aks31g2[idart]) && (aks.aks31g3 && aks.aks31g3[idart]) && (aks.aks31g4 && aks.aks31g4[idart]) &&
                                    (aks.aks31g5 && aks.aks31g5[idart]) && (aks.aks31g6 && aks.aks31g6[idart]) && (aks.aks31g7 && aks.aks31g7[idart]) &&
                                    (aks.aks31g8 && aks.aks31g8[idart]) && (aks.aks31g9 && aks.aks31g9[idart]) && (aks.aks31g10 && aks.aks31g10[idart]) &&
                                    (aks.aks31g11 && aks.aks31g11[idart]) && (aks.aks31g12 && aks.aks31g12[idart]) && (aks.aks31g95 && aks.aks31g95[idart]) &&
                                    (aks.aks31g98 && aks.aks31g98[idart]);
                                    if (aks.aks31g95 && aks.aks31g95[idart] == 1) {allow = allow && (aks.aks31g95lain && aks.aks31g95lain[idart]);}
                            ;
                        }if (aks.aks28h && aks.aks28h[idart] == 1) { //jika praktek perawat
                            allow = allow && (aks.aks29h && aks.aks29h[idart]) && (aks.aks30h && aks.aks30h[idart]) && (aks.aks31h1 && aks.aks31h1[idart]) &&
                                    (aks.aks31h2 && aks.aks31h2[idart]) && (aks.aks31h3 && aks.aks31h3[idart]) && (aks.aks31h4 && aks.aks31h4[idart]) &&
                                    (aks.aks31h5 && aks.aks31h5[idart]) && (aks.aks31h6 && aks.aks31h6[idart]) && (aks.aks31h7 && aks.aks31h7[idart]) &&
                                    (aks.aks31h8 && aks.aks31h8[idart]) && (aks.aks31h9 && aks.aks31h9[idart]) && (aks.aks31h10 && aks.aks31h10[idart]) &&
                                    (aks.aks31h11 && aks.aks31h11[idart]) && (aks.aks31h12 && aks.aks31h12[idart]) && (aks.aks31h95 && aks.aks31h95[idart]) &&
                                    (aks.aks31h98 && aks.aks31h98[idart]);
                                    if (aks.aks31h95 && aks.aks31h95[idart] == 1) {allow = allow && (aks.aks31h95lain && aks.aks31h95lain[idart]);}
                            ;
                        }if (aks.aks28i && aks.aks28i[idart] == 1) { //jika polindes/poskesdes
                            allow = allow && (aks.aks29i && aks.aks29i[idart]) && (aks.aks30i && aks.aks30i[idart]) && (aks.aks31i1 && aks.aks31i1[idart]) &&
                                    (aks.aks31i2 && aks.aks31i2[idart]) && (aks.aks31i3 && aks.aks31i3[idart]) && (aks.aks31i4 && aks.aks31i4[idart]) &&
                                    (aks.aks31i5 && aks.aks31i5[idart]) && (aks.aks31i6 && aks.aks31i6[idart]) && (aks.aks31i7 && aks.aks31i7[idart]) &&
                                    (aks.aks31i8 && aks.aks31i8[idart]) && (aks.aks31i9 && aks.aks31i9[idart]) && (aks.aks31i10 && aks.aks31i10[idart]) &&
                                    (aks.aks31i11 && aks.aks31i11[idart]) && (aks.aks31i12 && aks.aks31i12[idart]) && (aks.aks31i95 && aks.aks31i95[idart]) &&
                                    (aks.aks31i98 && aks.aks31i98[idart]);
                                    if (aks.aks31i95 && aks.aks31i95[idart] == 1) {allow = allow && (aks.aks31i95lain && aks.aks31i95lain[idart]);}
                            ;
                        }if (aks.aks28j && aks.aks28j[idart] == 1) { //jika apotek
                            allow = allow && (aks.aks29j && aks.aks29j[idart]) && (aks.aks30j && aks.aks30j[idart]) && (aks.aks31j1 && aks.aks31j1[idart]) &&
                                    (aks.aks31j2 && aks.aks31j2[idart]) && (aks.aks31j3 && aks.aks31j3[idart]) && (aks.aks31j4 && aks.aks31j4[idart]) &&
                                    (aks.aks31j5 && aks.aks31j5[idart]) && (aks.aks31j6 && aks.aks31j6[idart]) && (aks.aks31j7 && aks.aks31j7[idart]) &&
                                    (aks.aks31j8 && aks.aks31j8[idart]) && (aks.aks31j9 && aks.aks31j9[idart]) && (aks.aks31j10 && aks.aks31j10[idart]) &&
                                    (aks.aks31j11 && aks.aks31j11[idart]) && (aks.aks31j12 && aks.aks31j12[idart]) && (aks.aks31j95 && aks.aks31j95[idart]) &&
                                    (aks.aks31j98 && aks.aks31j98[idart]);
                                    if (aks.aks31j95 && aks.aks31j95[idart] == 1) {allow = allow && (aks.aks31j95lain && aks.aks31j95lain[idart]);}
                            ;
                        }if (aks.aks28k && aks.aks28k[idart] == 1) { //jika pengobatan tradisional
                            allow = allow && (aks.aks29k && aks.aks29k[idart]) && (aks.aks30k && aks.aks30k[idart]) && (aks.aks31k1 && aks.aks31k1[idart]) &&
                                    (aks.aks31k2 && aks.aks31k2[idart]) && (aks.aks31k3 && aks.aks31k3[idart]) && (aks.aks31k4 && aks.aks31k4[idart]) &&
                                    (aks.aks31k5 && aks.aks31k5[idart]) && (aks.aks31k6 && aks.aks31k6[idart]) && (aks.aks31k7 && aks.aks31k7[idart]) &&
                                    (aks.aks31k8 && aks.aks31k8[idart]) && (aks.aks31k9 && aks.aks31k9[idart]) && (aks.aks31k10 && aks.aks31k10[idart]) &&
                                    (aks.aks31k11 && aks.aks31k11[idart]) && (aks.aks31k12 && aks.aks31k12[idart]) && (aks.aks31k95 && aks.aks31k95[idart]) &&
                                    (aks.aks31k98 && aks.aks31k98[idart]);
                                    if (aks.aks31k95 && aks.aks31k95[idart] == 1) {allow = allow && (aks.aks31k95lain && aks.aks31k95lain[idart]);}
                            ;
                        }if (aks.aks28l && aks.aks28l[idart] == 1) { //jika faskes luar negeri
                            allow = allow && (aks.aks29l && aks.aks29l[idart]) && (aks.aks30l && aks.aks30l[idart]) && (aks.aks31l1 && aks.aks31l1[idart]) &&
                                    (aks.aks31l2 && aks.aks31l2[idart]) && (aks.aks31l3 && aks.aks31l3[idart]) && (aks.aks31l4 && aks.aks31l4[idart]) &&
                                    (aks.aks31l5 && aks.aks31l5[idart]) && (aks.aks31l6 && aks.aks31l6[idart]) && (aks.aks31l7 && aks.aks31l7[idart]) &&
                                    (aks.aks31l8 && aks.aks31l8[idart]) && (aks.aks31l9 && aks.aks31l9[idart]) && (aks.aks31l10 && aks.aks31l10[idart]) &&
                                    (aks.aks31l11 && aks.aks31l11[idart]) && (aks.aks31l12 && aks.aks31l12[idart]) && (aks.aks31l95 && aks.aks31l95[idart]) &&
                                    (aks.aks31l98 && aks.aks31l98[idart]);
                                    if (aks.aks31l95 && aks.aks31l95[idart] == 1) {allow = allow && (aks.aks31l95lain && aks.aks31l95lain[idart]);}
                            ;
                        }if (aks.aks28m && aks.aks28m[idart] == 1) { //jika faskes lainnya
                            allow = allow && (aks.aks28mlain && aks.aks28mlain[idart]) &&
                                    (aks.aks29m && aks.aks29m[idart]) && (aks.aks30m && aks.aks30m[idart]) && (aks.aks31m1 && aks.aks31m1[idart]) &&
                                    (aks.aks31m2 && aks.aks31m2[idart]) && (aks.aks31m3 && aks.aks31m3[idart]) && (aks.aks31m4 && aks.aks31m4[idart]) &&
                                    (aks.aks31m5 && aks.aks31m5[idart]) && (aks.aks31m6 && aks.aks31m6[idart]) && (aks.aks31m7 && aks.aks31m7[idart]) &&
                                    (aks.aks31m8 && aks.aks31m8[idart]) && (aks.aks31m9 && aks.aks31m9[idart]) && (aks.aks31m10 && aks.aks31m10[idart]) &&
                                    (aks.aks31m11 && aks.aks31m11[idart]) && (aks.aks31m12 && aks.aks31m12[idart]) && (aks.aks31m95 && aks.aks31m95[idart]) &&
                                    (aks.aks31m98 && aks.aks31m98[idart]);
                                    if (aks.aks31m95 && aks.aks31m95[idart] == 1) {allow = allow && (aks.aks31m95lain && aks.aks31m95lain[idart]);}
                            ;
                        }
                    }
                }

                if (
                    (aks.aks02 && aks.aks02[idart] == 12) || 
                    (((aks.aks17 && aks.aks17[idart] == 1) || (aks.aks17 && aks.aks17[idart] == 2)) && (aks.aks21 && aks.aks21[idart] == 2)) ||
                    ($scope.tipe.aks01ls && (aks.aks22 && aks.aks22[idart] == 2) && (aks.aks27 && aks.aks27[idart] == 2))
                    ) { // Tidak Pergi Berobat
                    allow = allow && (
                        (aks.aks0401 && aks.aks0401[idart]) &&
                        (aks.aks0402 && aks.aks0402[idart]) &&
                        (aks.aks0403 && aks.aks0403[idart]) &&
                        (aks.aks0404 && aks.aks0404[idart]) &&
                        (aks.aks0405 && aks.aks0405[idart])
                    );
                    if (aks.aks0405 && aks.aks0405[idart] == 1) {
                        allow = allow && aks.aks0405lain && aks.aks0405lain[idart];
                    }
                } else if (aks.aks02 && aks.aks02[idart] == 98) { // 98 = tidak tahu

                }
            return allow;
        };

        $scope.keluargaHaveJKN = function() {
            var aks = $scope.aks,
                aks02, allow = false;

            $scope.dataART.forEach(function(d) {
                aks02 = aks.aks02 && parseInt(aks.aks02[d.idart]);
                if (aks02 && aks02 !== 12) {
                    allow = allow ||
                        (aks.aks0301 && aks.aks0301[d.idart]) ||
                        (aks.aks0302 && aks.aks0302[d.idart]) ||
                        (aks.aks0303 && aks.aks0303[d.idart]) ||
                        (aks.aks0304 && aks.aks0304[d.idart]) ||
                        (aks.aks0305 && aks.aks0305[d.idart]);
                }
            });
            return allow;
        };

        $scope.tabelAllowNext = function() {
            var aks = $scope.aks,
                aks01 = aks.aks01 && parseInt(aks.aks01),
                allow = false;
            if (aks01 == 1) {
                $scope.dataART.forEach(function(d) {
                    allow = allow || (aks.aks01ls && aks.aks01ls[d.idart]);
                });
            } else if (aks01 == 2 || aks01 == 98) {
                allow = true;
            }
            return allow;
        };
        $scope.pelayananAllowSave = function() {
            var aks = $scope.aks,
                aks05 = aks.aks05 && parseInt(aks.aks05),
                aks08 = aks.aks08 && parseInt(aks.aks08),
                aks11 = aks.aks11 && parseInt(aks.aks11),
                allow = aks05;

            if (aks05 && aks05 !== 98) {
                allow = allow && aks.aks06 && aks.aks07;
            } else {
                allow = aks05;
            }


            if (aks08 && aks08 !== 98) {
                allow = allow && aks.aks09 && aks.aks10;
            } else {
                allow = allow && aks08;
            }

            if (aks11 && aks11 !== 98) {
                allow = allow && aks.aks12 && aks.aks13;
            } else {
                allow = allow && aks11;
            }

            if ($scope.keluargaHaveJKN()) {
                allow = allow && aks.aks14 && aks.aks15 && aks.aks16;
            }

            return allow;
        };

        $ionicModal.fromTemplateUrl('templates/aks-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });

        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
            if (!modalSaved) {
                $scope.aks = angular.copy(lastAks);
            }
        });

        $scope.edit = function(checked, art) {
            if (checked) {
                $scope.aks[art.idart] = $scope.aks[art.idart] || {};
                $scope.nama = art._nama;
                $scope.umur = art.umur;
                $scope.idart = art.idart;
                modalSaved = false;
                $scope.modal.show();
            }
        };
        $scope.allowSaveModal = function() {
            var aks = $scope.aks,
                allow = false;
            var idart = $scope.idart;
            if (aks.aks02[idart] == 12) {
                allow = (aks.aks0401[idart] || aks.aks0402[idart] || aks.aks0403[idart] || aks.aks0404[idart] || aks.aks0405[idart]);
            } else {
                allow = (aks.aks0301[idart] || aks.aks0302[idart] || aks.aks0303[idart] || aks.aks0304[idart] ||
                    aks.aks0305[idart] || aks.aks0306[idart] || aks.aks0307[idart] || aks.aks0308[idart] ||
                    aks.aks0309[idart] || aks.aks0310[idart] || aks.aks0311[idart] || aks.aks0312[idart] || aks.aks0313);
            }
            return allow;
        };

        $scope.saveModal = function() {
            AppService.saveDataKelMasked('aks', $scope.aks, true, 'app.aks').then(function() {
                modalSaved = true;
                lastAks = angular.copy($scope.aks);
                $scope.modal.hide();
            });
        };
        $ionicModal.fromTemplateUrl('templates/aks-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.save = function(finish) {
            // AppService.saveCatatanKelompok('utama',$scope.idrt);
            var goTo = finish ? 'app.kj' : '';
            // simpan semua model (termasuk hidden ng-show), kecuali yg hidden ng-if
            return AppService.saveDataKelMasked('aks', $scope.aks, true, goTo);
        };

    }
})();

(function() {
    angular.module('ehdss')
        .controller('KaiCtrl', KaiCtrl);

    KaiCtrl.$inject = ['$scope', '$rootScope', '$state', '$ionicModal', 'AppService', '$timeout'];

    function KaiCtrl($scope, $rootScope, $state, $ionicModal, AppService, $timeout) {

        // $scope.no_cov = false; // hide cover yg tidak terpakai ketika covid 

        // ambil semua data kai, kim, asm
        $scope.kai = $rootScope.dataRT.kai || {};
        $scope.kim = $rootScope.dataRT.kim || {};
        $scope.asm = $rootScope.dataRT.asm || {};
        $scope.idrt = $rootScope.dataRT.idrt || {};

        // simpan variabel terakhir yg tersimpan
        var lastKai = angular.copy($scope.kai);
        var lastKim = angular.copy($scope.kim);
        var lastAsm = angular.copy($scope.asm);

        // apakah form di modal di save ?
        var modalSaved = false;
        var refreshDataART = function(){
            // KAI hanya mengambil yg umurnya 0-5 tahun
            AppService.getDataART().then(function(data) {
                $scope.dataART = data.filter(function(item) {
                    var umur = parseInt(item.umur);
                    
                    if ($rootScope.j_siklus.s6) { // hanya untuk artb
                        return !item.artTdkAda && ((item.antro == 1) || (umur >= 0 && umur < 5 && (item.start_in_wave_art || item.artb == true))) ;
                    }else{
                        return !item.artTdkAda && (umur >= 0) && (umur < 5); // siklus 7 KAI untuk ARTB dan ART lama
                    }
                });

                //tambahkan param kai di dataART
                $scope.dataART.forEach(function(val,idx){
                    for (var key_kai in $scope.kai.kai01) {
                        if (val.idart == key_kai) {
                            $scope.dataART[idx].kai = '1';
                        }
                    }
                });
                $scope.kai_terisi = [];
                $scope.dataART.forEach(function(val){
                    if (val.kai) {
                        $scope.kai_terisi.push(val.kai);
                    }
                });

                //tambahkan param kim di dataART
                $scope.dataART.forEach(function(val,idx){
                    for (var key_kim in $scope.kim.kim10) {
                        if (val.idart == key_kim) {
                            $scope.dataART[idx].kim = '1';
                        }
                    }
                });
                $scope.kim_terisi = [];
                $scope.dataART.forEach(function(val){
                    if (val.kim) {
                        $scope.kim_terisi.push(val.kim);
                    }
                });

                
            });
        };
            
        refreshDataART();

        AppService.getTglWawancaraPlusSatu(true).then(function(val) {
            $scope.tglMaxEntry = val;
        })

        var initModal = function() {
            $scope.kesehatan = true;
            $scope.imunisasi = false;
            $scope.imunisasi2 = false;
            $scope.imunisasi3 = false;
            $scope.imunisasi4 = false;
            $scope.imunisasi5 = false;
            $scope.imunisasi6 = false;
            $scope.imunisasi7 = false;
            $scope.asi = false;
        };

        $scope.go = function(curMenu, toMenu) {
            var obj = 'kim'; // 'imunisasi';
            if (curMenu === 'kesehatan') {
                obj = 'kai';
            }

            //default value untuk yg sudah mengisi modul KAI
            var idart = $scope.idart;
            if (!$scope.kai.kai) {
                $scope.kai.kai = {};
            }
            if ($scope.kai.kai01 && $scope.kai.kai01[idart] > 0){
                $scope.kai.kai[idart] = 1;
            }

            AppService.saveDataKelMasked(obj, $scope[obj], true).then(function() {
                $scope[curMenu] = false;
                $scope[toMenu] = true;
            });
        };

        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
            // var idart = $scope.idart;
            if (!modalSaved) {
                $scope.kai = angular.copy(lastKai);
                $scope.kim = angular.copy(lastKim);
                $scope.asm = angular.copy(lastAsm);
            }
        });

        $scope.jenisImunisasi = {
            a: 'Hepatitis B0',
            b: 'BCG',
            c: 'DPT-HB Combo 1 / DPT-HB - Hib 1',
            d: 'DPT HB Combo 2 / DPT-HB - Hib 2',
            e: 'DPT HB Combo 3 / DPT-HB - Hib 3',
            f: 'Polio 1 (OPV/Oral)',
            g: 'Polio 2 (OPV/Oral)',
            h: 'Polio 3 (OPV/Oral)',
            i: 'Polio 4 (OPV/Oral)',
            j: 'Campak/MR',
            k: 'IPV Polio 1 (Suntik)',
            l: 'IPV Polio 2 (Suntik)',
            m: 'IPV Polio 3 (Suntik)',
            n: 'IPV Polio 4 (Suntik)',
            o: 'DPT-HB - Hib lanjutan',
            p: 'Campak/MR lanjutan'
        };
        $scope.jenisImunisasi2 = {
            a: 'Pnemococcus',
            b: 'Rotavirus',
            c: 'Influenza',
            d: 'Typhoid',
            e: 'Hepatitis A',
            f: 'Varicella'
        };

        $scope.allowNextKesehatan = function() {
            var kai = $scope.kai,
                idart = $scope.idart,
                kai01 = kai.kai01,
                kai04 = kai.kai04,
                kai07 = kai.kai07,
                kai01art = kai01 ? parseInt(kai01[idart]) : 0,
                kai04art = kai04 ? parseInt(kai04[idart]) : 0,
                kai07art = kai07 ? parseInt(kai07[idart]) : 0,
                allow = (
                    (kai01art === 1 && kai.kai02 && kai.kai02[idart]) || (kai01art === 1 && kai.kai02a && kai.kai02a[idart]) ||
                    (kai01art === 2 && kai.kai03a && kai.kai03a[idart] == 1 && kai.kai03 && kai.kai03[idart]) || (kai01art === 2 && kai.kai03a && kai.kai03a[idart] == 1 && kai.kai03aa && kai.kai03aa[idart]) ||
                    (kai01art === 98 && kai.kai03a && kai.kai03a[idart] == 1 && kai.kai03 && kai.kai03[idart]) || (kai01art === 98 && kai.kai03a && kai.kai03a[idart] == 1 && kai.kai03aa && kai.kai03aa[idart]) ||
                    (kai01art === 2 && kai.kai03a && kai.kai03a[idart] == 2) ||
                    (kai01art === 98 && kai.kai03a && kai.kai03a[idart] == 2)
                )&&(
                    (kai04art === 1 && kai.kai05 && kai.kai05[idart]) || (kai04art === 1 && kai.kai05a && kai.kai05a[idart]) ||
                    (kai04art === 2 && kai.kai06a && kai.kai06a[idart] == 1 && kai.kai06 && kai.kai06[idart]) || (kai04art === 2 && kai.kai06a && kai.kai06a[idart] == 1 && kai.kai06aa && kai.kai06aa[idart]) ||
                    (kai04art === 98 && kai.kai06a && kai.kai06a[idart] == 1 && kai.kai06 && kai.kai06[idart]) || (kai04art === 98 && kai.kai06a && kai.kai06a[idart] == 1 && kai.kai06aa && kai.kai06aa[idart]) ||
                    (kai04art === 2 && kai.kai06a && kai.kai06a[idart] == 2) ||
                    (kai04art === 98 && kai.kai06a && kai.kai06a[idart] == 2)
                )&&(
                    (kai07art === 1 && kai.kai08 && kai.kai08[idart]) || (kai07art === 1 && kai.kai08a && kai.kai08a[idart]) ||
                    (kai07art === 2 && kai.kai09a && kai.kai09a[idart] == 1 && kai.kai09 && kai.kai09[idart]) || (kai07art === 2 && kai.kai09a && kai.kai09a[idart] == 1 && kai.kai09aa && kai.kai09aa[idart]) ||
                    (kai07art === 98 && kai.kai09a && kai.kai09a[idart] == 1 && kai.kai09 && kai.kai09[idart]) || (kai07art === 98 && kai.kai09a && kai.kai09a[idart] == 1 && kai.kai09aa && kai.kai09aa[idart]) ||
                    (kai07art === 2 && kai.kai09a && kai.kai09a[idart] == 2) ||
                    (kai07art === 98 && kai.kai09a && kai.kai09a[idart] == 2)
                ) && (kai.kai10 && kai.kai10[idart]);
            return allow;
        };
        $scope.allowNextImunisasi = function() {
            var x, y, i, allow,
                idart = $scope.idart,
                kim = $scope.kim,
                kim01 = kim.kim01 && kim.kim01[idart] && parseInt(kim.kim01[idart]);
            allow = false;
            if (kim01 == 1) {
                allow = true;
                for (var prop in $scope.jenisImunisasi) {
                    x = 'kim02' + prop + '1';
                    y = 'kim02' + prop + '2';
                    i = parseInt(kim[x] && kim[x][idart]);
                    // allow jika semua keterangan terisi
                    allow = allow && (kim[x] && kim[x][idart]);
                    // jika keterangan isinya 1 (diberikan imunisasi)
                    if (allow && i === 1) {
                        // Waktu atau tanggal harus terisi
                        allow = allow && kim[y] && kim[y][idart];
                    }
                }
            } else if (kim01 == 2 || kim01 == 98) {
                allow = true;
            }
            return allow;
        };
        $scope.allowNextImunisasi2 = function() {
            var allow = true, idart = $scope.idart,
                kim = $scope.kim;
            //     kim03a = kim.kim03a && parseInt(kim.kim03a[idart]),
            //     kim03c = kim.kim03c && parseInt(kim.kim03c[idart]),
            //     kim03e = kim.kim03e && parseInt(kim.kim03e[idart]),
            //     kim03ea = kim.kim03ea && parseInt(kim.kim03ea[idart]),
            //     kim03h = kim.kim03h && parseInt(kim.kim03h[idart]);
            // allow = false ||
            //     (kim03a && kim03a !== 1 || (kim03a && kim03a == 1 && kim.kim03b && kim.kim03b[idart])) &&
            //     (kim03c && kim03c !== 1 || (kim03c && kim03c == 1 && kim.kim03d && kim.kim03d[idart])) &&
            //     (kim03e && kim03e !== 1 || (kim03e && kim03e == 1 && kim.kim03f && kim.kim03f[idart] && kim.kim03g && kim.kim03g[idart])) &&
            //     (kim03e && kim03ea !== 1 || (kim03ea && kim03ea == 1 && kim.kim03fa && kim.kim03fa[idart] && kim.kim03ga && kim.kim03ga[idart])) &&
            //     (kim03h && kim03h !== 1 || (kim03h && kim03h == 1 && kim.kim03i && kim.kim03i[idart] && kim.kim03j && kim.kim03j[idart])) &&
            //     (kim.kim03k && kim.kim03k[idart]);

            // Hepatitis B0
            if (kim.kim02a1 && kim.kim02a1[idart] != 1) {
                allow = allow && (kim.kim03a && kim.kim03a[idart]) 
                if (kim.kim03a && kim.kim03a[idart]==1) {
                    allow = allow && (kim.kim03b && kim.kim03b[idart]);
                }
                
            }
            // BCG
            if (kim.kim02b1 && kim.kim02b1[idart] != 1) {
                allow = allow && (kim.kim03c && kim.kim03c[idart]);
                if (kim.kim03c && kim.kim03c[idart]==1) {
                    allow = allow && (kim.kim03d && kim.kim03d[idart]);
                }
            }
            // Polio (OPV/Oral)
            if ((kim.kim02f1 && kim.kim02f1[idart] != 1) || (kim.kim02g1 && kim.kim02g1[idart] != 1) || (kim.kim02h1 && kim.kim02h1[idart] != 1) || (kim.kim02i1 && kim.kim02i1[idart] != 1)) {
                allow = allow && (kim.kim03e && kim.kim03e[idart]);
                if (kim.kim03e && kim.kim03e[idart] == 1) {
                    allow = allow && (kim.kim03f && kim.kim03f[idart]) && (kim.kim03g && kim.kim03g[idart]);
                }
            }
            // Polio (Suntik)
            if ((kim.kim02k1 && kim.kim02k1[idart] != 1) || (kim.kim02l1 && kim.kim02l1[idart] != 1) || (kim.kim02m1 && kim.kim02m1[idart] != 1) || (kim.kim02n1 && kim.kim02n1[idart] != 1)) {
                allow = allow && (kim.kim03ea && kim.kim03ea[idart]);
                if (kim.kim03ea && kim.kim03ea[idart]==1) {
                    allow = allow && (kim.kim03fa && kim.kim03fa[idart]) && (kim.kim03ga && kim.kim03ga[idart]);
                }
            }
            // DPT-HB Combo
            if ((kim.kim02c1 && kim.kim02c1[idart] != 1) || (kim.kim02d1 && kim.kim02d1[idart] != 1) || (kim.kim02e1 && kim.kim02e1[idart] != 1)) {
                allow = allow && (kim.kim03h && kim.kim03h[idart]);
                if (kim.kim03h && kim.kim03h[idart]==1) {
                    allow = allow && (kim.kim03i && kim.kim03i[idart]) && (kim.kim03j && kim.kim03j[idart]);
                }
            }
            // campak
            if (kim.kim02j1 && kim.kim02j1[idart] != 1) {
                allow = allow && (kim.kim03k && kim.kim03k[idart]);
            }
            return allow;
        };

        // Jika isiannya 1,4,3 dan 1 KIM04 tidak tampil, selain itu tampil
        $scope.checkAllowKim04 = function() {
            var idart = $scope.idart,
                kim = $scope.kim,
                valid = (kim.jumlahkim01 && kim.jumlahkim01[idart] == 1) &&
                (kim.jumlahkim02 && kim.jumlahkim02[idart] == 4) &&
                (kim.jumlahkim03 && kim.jumlahkim03[idart] == 3) &&
                (kim.jumlahkim04 && kim.jumlahkim04[idart] == 1);
            return !valid;
        };

        $scope.allowNextImunisasi3 = function() {
            var idart = $scope.idart,
                kim = $scope.kim,
                k1 = kim.jumlahkim01 ? parseInt(kim.jumlahkim01[idart]) : -1,
                k2 = kim.jumlahkim02 ? parseInt(kim.jumlahkim02[idart]) : -1,
                k3 = kim.jumlahkim03 ? parseInt(kim.jumlahkim03[idart]) : -1,
                k4 = kim.jumlahkim04 ? parseInt(kim.jumlahkim04[idart]) : -1;
            return (k1 === 98 || (k1 >= 0 && k1 <= 1)) &&
                (k2 === 98 || (k2 >= 0 && k2 <= 4)) &&
                (k3 === 98 || (k3 >= 0 && k3 <= 3)) &&
                (k4 === 98 || (k4 >= 0 && k4 <= 1));
        };

        $scope.allowNextImunisasi4 = function() {
            var idart = $scope.idart,
                kim = $scope.kim,
                allow = true && (kim.kim10 && kim.kim10[idart]) && (kim.kim05 && kim.kim05[idart]) &&
                        (kim.kim11 && kim.kim11[idart]);
               
                if (kim.kim05 && kim.kim05[idart] == 1) {
                    allow = allow && 
                    (kim.kim0501 && kim.kim0501[idart]) && (kim.kim0502 && kim.kim0502[idart]) && 
                    (kim.kim0503 && kim.kim0503[idart]) && (kim.kim0504 && kim.kim0504[idart]) && 
                    (kim.kim0505 && kim.kim0505[idart]) && (kim.kim0506 && kim.kim0506[idart]) &&
                    (kim.kim0595 && kim.kim0595[idart]);
                    if (kim.kim0595 && kim.kim0595[idart] == 1) {
                        allow = allow && kim.kim0595l && kim.kim0595l[idart];
                    }
                }

                if((kim.kim10 && kim.kim10[idart] == 2) || (kim.kim10 && kim.kim10[idart] == 98)){
                    allow = allow && (kim.kim04 && kim.kim04[idart]);
                    if (kim.kim04 && kim.kim04[idart] == 95) {
                        allow = allow && (kim.kim04l && kim.kim04l[idart]);
                    }
                }
            
            return allow;
        };
        $scope.allowNextImunisasi5 = function() {
            var allow, kim = $scope.kim,
                kim06 = kim.kim06,
                idart = $scope.idart;
            allow = (kim06 && parseInt(kim06[idart]) === 1 && kim.kim07 && kim.kim07[idart]) ||
                (kim06 && (parseInt(kim06[idart]) === 2 || (parseInt(kim06[idart]) === 98)) &&
                    ((kim.kim08 && parseInt(kim.kim08[idart]) !== 95) ||
                        (kim.kim08 && parseInt(kim.kim08[idart]) === 95 && kim.kim08l && kim.kim08l[idart])));
            return allow;
        };
        $scope.allowNextImunisasi6 = function() {
            var allow, kim = $scope.kim,
                idart = $scope.idart;
            allow = true && (kim.kim09 && kim.kim09[idart]);
            return allow;
        };
        $scope.allowNextImunisasi7 = function() {
            var allow, kim = $scope.kim,
                idart = $scope.idart;
            allow = true && (kim.kim12 && kim.kim12[idart]) && (kim.kim13 && kim.kim13[idart]);
            if (kim.kim13 && kim.kim13[idart] == 1) {
                allow = true;
                for (var prop in $scope.jenisImunisasi2) {
                    a = 'kim14' + prop + '1';
                    b = 'kim14' + prop + '2';
                    c = 'kim14' + prop + '3';
                    d = 'kim14' + prop + '4';
                    i = parseInt(kim[a] && kim[a][idart]);
                    // allow jika semua keterangan terisi
                    allow = allow && (kim[a] && kim[a][idart]);
                    // jika keterangan isinya 1 (diberikan imunisasi)
                    if (allow && i === 1) {
                        // Waktu atau tanggal harus terisi
                        allow = allow && kim[b] && kim[b][idart] &&
                                         kim[c] && kim[c][idart] &&
                                         kim[d] && kim[d][idart];
                    }
                }
            }
            return allow;
        };

        $scope.asm03Item = {
            a: 'Susu formula',
            b: 'Susu non-formula',
            c: 'Madu / Madu + air',
            d: 'Air gula',
            e: 'Air tajin',
            f: 'Air kelapa',
            g: 'Kopi',
            h: 'Teh Manis',
            i: 'Air putih',
            j: 'Bubur tepung / Bubur saring',
            k: 'Pisang dihaluskan',
            l: 'Nasi dihaluskan',
            m: 'lainnya'
        };
        $scope.asm08Item = {
            a: 'Susu formula',
            b: 'Susu non-formula',
            c: 'Bubur formula',
            d: 'Biscuit',
            e: 'Bubur tepung/ bubur sarin',
            f: 'Air Tajin',
            g: 'Pisang dihaluskan',
            h: 'Bubur nasi / nasi tim / nasi dihaluskan',
            i: 'Lainnya',
            k: 'Tidak tahu'
        };

        $scope.asmAllowSave = function() {
            var asm = $scope.asm,
                tmp = true,
                idart = $scope.idart;
            var allow = true;

            allow = allow && (asm.asm10 && asm.asm10[idart]) && (asm.asm01 && asm.asm01[idart]) &&
                    (asm.asm16 && asm.asm16[idart]) && (asm.asm09 && asm.asm09[idart]) &&
                    (asm.asm17 && asm.asm17[idart]) && (asm.asm19 && asm.asm19[idart]) &&
                    (asm.asm21 && asm.asm21[idart]) && (asm.asm23 && asm.asm23[idart]) &&
                    (asm.asm25 && asm.asm25[idart])
                    ;

                    /*pemberian susu formula*/
                    if (asm.asm17 && asm.asm17[idart] == 95) {
                        allow = allow && (asm.asm17lain && asm.asm17lain[idart]);
                    }
                    if (asm.asm17 && asm.asm17[idart] < 4) {
                        allow = allow && (asm.asm18 && asm.asm18[idart]);
                    }
                    /*pemberian buah*/
                    if (asm.asm19 && asm.asm19[idart] == 95) {
                        allow = allow && (asm.asm19lain && asm.asm19lain[idart]);
                    }
                    /*pemberian bubur susu*/
                    if (asm.asm21 && asm.asm21[idart] < 5) {
                        allow = allow && (asm.asm22 && asm.asm22[idart]);
                    }
                    /*pemberian makanan lembek*/
                    if (asm.asm23 && asm.asm23[idart] < 5) {
                        allow = allow && (asm.asm24 && asm.asm24[idart]);
                    }
                    /*pemberian nasi/makanan keluarga*/
                    if (asm.asm25 && asm.asm25[idart] < 5) {
                        allow = allow && (asm.asm26 && asm.asm26[idart]);
                    }

                    if (asm.asm19 && asm.asm19[idart] < 5) {
                        allow = allow && (asm.asm20 && asm.asm20[idart]);
                    }

                    if (asm.asm10 && asm.asm10[idart] == 1) { /*jika anak ditempel di dada/perut ibu*/
                        allow = allow && (asm.asm11 && asm.asm11[idart] >= 0) && (asm.asm12 && asm.asm12[idart]);
                    }

                    if (asm.asm01 && (asm.asm01[idart] == 2 || asm.asm01[idart] == 98)) { /*jika anak tidak disusui*/
                        allow = allow && (asm.asm13 && asm.asm13[idart]);
                        if (asm.asm13 && asm.asm13[idart] == 95) {
                            allow = allow && (asm.asm13a && asm.asm13a[idart]);
                        }
                    }

                    if (asm.asm01 && asm.asm01[idart] == 1) { /*jika anak disusui*/
                        allow = allow && (asm.asm14 && asm.asm14[idart]) && (asm.asm15 && asm.asm15[idart]) &&
                                (asm.asm02 && asm.asm02[idart]) && (asm.asm04 && asm.asm04[idart]) && 
                                (asm.asm06 && asm.asm06[idart]);
                            if (asm.asm14 && asm.asm14[idart] == 2) {
                                allow = allow && (asm.asm14b && asm.asm14b[idart]); //jam
                            }else if (asm.asm14 && asm.asm14[idart] == 3){
                                allow = allow && (asm.asm14c && asm.asm14c[idart]); //hari
                            }

                            if (asm.asm02 && asm.asm02[idart] == 1) {
                                // Jenis manakan/minuman yg pernah diberikan
                                for (var key in $scope.asm03Item) {
                                    if ($scope.asm03Item.hasOwnProperty(key)) {
                                        tmp = tmp && (asm['asm03' + key] && asm['asm03' + key][idart]);
                                    }
                                }
                                allow = allow && tmp;
                                    if (asm.asm03 && asm.asm03m[idart] == 1) {
                                        allow = allow && (asm.asm03lain && asm.asm03lain[idart]);
                                    }
                            }
                            if (asm.asm04 && (asm.asm04[idart] == 2 || asm.asm04[idart] == 98)) {
                                allow = allow && (asm.asm05 && asm.asm05[idart] >= 0); //bila sudah tidak disusui
                            }
                        
                    }


            return allow;
        };

        $scope.selesai = function(dest) {
            $rootScope.$broadcast('loading:show');
            $timeout(function() {
                $rootScope.$broadcast('loading:hide');
                if (dest == 'utama') {
                    /* Jika wawancara berhenti di tengah jalan*/
                    $rootScope.catatanModulUtama = true; //param untuk catatan modul utama
                    $rootScope.catatanModulB = false; //param untuk catatan modul B
                    $rootScope.tab_catatan = true; // langsung buka tab catatan
                    $rootScope.tab_cover = false; // tab cover di hide dulu
                    $state.go('app.art_cover'); // ke laporan waancara utama
                }else{
                    $state.go('app.' + dest); // setelah KAI ke PM
                }
                
            }, 500);
        };
        $scope.goto = function(dest) {
            // debugger;
            $rootScope.$broadcast('loading:show');
            $timeout(function() {
                $rootScope.$broadcast('loading:hide');
                $state.go('app.' + dest);
            }, 200);
        };
        $ionicModal.fromTemplateUrl('templates/kai-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function(art) {
            initModal();
            $scope.nama = art._nama;
            $scope.umur = art.umur;
            $scope.idart = art.idart;

            if (art.start_in_wave_art || art.artb) { // apakah balita ARTB
                $scope.artb = art.start_in_wave_art || art.artb; // ARTB
            }else{
                $scope.artb = false; // ART lama
            }
            
            $scope.modal.show();
        };

        //Contoh pengambilan data (nama bisa diganti dengan id yg unik)
        $scope.saveModal = function(obj, hide) {
            // AppService.saveCatatanKelompok('balita',$scope.idrt);
            if (obj == 'kai') {
                var idart = $scope.idart;
                if (!$scope.kai.kai) {
                    $scope.kai.kai = {};
                }
                if ($scope.kai.kai01 && $scope.kai.kai01[idart] > 0){
                    $scope.kai.kai[idart] = 1;
                }
                
                AppService.saveDataKelMasked('kai', $scope.kai, true, 'app.kai').then(function() {
                    modalSaved = true;
                    lastKai = angular.copy($scope.kai);
                   
                    if(hide){ // jika siklus 7, hide sampai KIM imunisasi4
                        refreshDataART();
                        $scope.modal.hide();
                    }
                });
            } else if (obj == 'kim') {
                var idart = $scope.idart;
                if (!$scope.kim.kim) {
                    $scope.kim.kim = {};
                }
                if ($scope.kim.kim10 && $scope.kim.kim10[idart] > 0){
                    $scope.kim.kim[idart] = 1;
                }

                AppService.saveDataKelMasked('kim', $scope.kim, true, 'app.kai').then(function() {
                    modalSaved = true;
                    lastKim = angular.copy($scope.kim);

                    AppService.getDataART().then(function(data) {
                        $rootScope.dataART = data;
                        refreshDataART();
                    });

                    if (hide) {
                        $scope.modal.hide();
                    } else {
                        $scope.imunisasi7 = false;
                        $scope.asi = true;
                    }
                });

            } else if (obj == 'asm') {
                AppService.saveDataKelMasked('asm', $scope.asm, true, 'app.kai').then(function() {
                    modalSaved = true;
                    lastAsm = angular.copy($scope.asm);
                    $scope.modal.hide();
                });
            } else if (obj == 'utama_kai') { // jika wawancara berhenti di tengah modul
                var idart = $scope.idart;
                if (!$scope.kai.kai) {
                    $scope.kai.kai = {};
                }
                if ($scope.kai.kai01 && $scope.kai.kai01[idart] > 0){
                    $scope.kai.kai[idart] = 1;
                }

                AppService.saveDataKelMasked('kai', $scope.kai, true, 'app.kai').then(function() {
                    modalSaved = true;
                    lastKai = angular.copy($scope.kai);
                    
                    AppService.getDataART().then(function(data) {
                        $rootScope.dataART = data;
                        refreshDataART();
                    });

                    if(hide){
                        $scope.modal.hide();
                    }
                });

            } else if (obj == 'utama_kim') { // jika wawancara berhenti di tengah modul
                var idart = $scope.idart;
                if (!$scope.kim.kim) {
                    $scope.kim.kim = {};
                }
                if ($scope.kim.kim10 && $scope.kim.kim10[idart] > 0){
                    $scope.kim.kim[idart] = 1;
                }

                AppService.saveDataKelMasked('kim', $scope.kim, true, 'app.kai').then(function() {
                    modalSaved = true;
                    lastKim = angular.copy($scope.kim);

                    AppService.getDataART().then(function(data) {
                        $rootScope.dataART = data;
                        refreshDataART();
                    });

                    if (hide) {
                        $scope.modal.hide();
                    }
                });

            }
        };

    }
})();
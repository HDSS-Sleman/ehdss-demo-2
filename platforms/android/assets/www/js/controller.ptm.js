(function() {
    angular.module('ehdss')
        .controller('PtmCtrl', PtmCtrl);

    PtmCtrl.$inject = ['$rootScope', '$scope', '$state', '$ionicModal', '$window', '$ionicLoading', '$timeout', 'AppService'];

    function PtmCtrl($rootScope, $scope, $state, $ionicModal, $window, $ionicLoading, $timeout, AppService) {
        $scope.ptm = $rootScope.dataRT.ptm || {};
        $scope.idrt = $rootScope.dataRT.idrt || {}; 
        // untuk mereset dulu ke empty object
        // $scope.ptm = {};
        AppService.getDataART().then(function(data) {
            $scope.dataART = data.filter(function(item) {
                return !item.artTdkAda;
            });
        });
        
        if ($rootScope.j_siklus.s7 == true) {
            $scope.cedera = true;
        }
        $scope.diabetes = false;
        $scope.stroke = false;
        $scope.jantung = false;
        $scope.kanker = false;
        $scope.asma = false;
        
        $scope.lainnya = false;

        $scope.ptm15Item = {
            a: 'Terpapar udara dingin/debu',
            b: 'Debu',
            c: 'Asap Rokok',
            d: 'Stress',
            e: 'Flu atau Infeksi ',
            f: 'Kelelahan',
            g: 'Alergi Obat',
            h: 'Alergi Makanan',
            v: 'Lainnya'
        };

        $scope.ptm16Item = {
            a: 'Mengi',
            b: 'Sesak nafas berkurang atau hilang dengan pengobatan',
            c: 'Sesak nafas berkurang atau hilang tanpa pengobatan',
            d: 'Sesak nafas lebih berat dirasakan pd malam hari / menjelang pagi'
        };

        $scope.ptm23Item = {
            a: 'Kepala',
            b: 'Dada',
            c: 'Punggung',
            d: 'Perut / Organ dalam',
            e: 'Anggota Gerak Atas',
            f: 'Anggota Gerak Bawah'
        };

        $scope.ptm24Item = {
            a: 'Lecet, lebam, memar',
            b: 'Luka iris / robek',
            c: 'Patah tulang',
            d: 'Terkilir / teregang',
            e: 'Anggota tubuh terputus',
            f: 'Cedera mata',
            g: 'Gegar otak',
            h: 'Luka bakar',
            v: 'Lainnya'
        };

        // apakah form di modal di save ?
        var modalSaved = false;
        // simpan agar jika edit cancel bisa di revert
        var lastPtm = angular.copy($scope.ptm);

        $scope.go = function(toMenu, curMenu) {
            $scope.save().then(function() {
                $scope[toMenu] = true;
                $scope[curMenu] = false;
            });
        };

        // Mirip dengan go, hanya saja tidak menyimpan ng-model
        $scope.goBack = function(toMenu, curMenu) {
            $scope[toMenu] = true;
            $scope[curMenu] = false;
        };

        $scope.save = function(finish, param) {

            if (param == 'utama') {
            /* Jika wawancara berhenti di tengah jalan*/
                $rootScope.catatanModulUtama = true; //param untuk catatan modul utama
                $rootScope.catatanModulB = false; //param untuk catatan modul B
                $rootScope.tab_catatan = true; // langsung buka tab catatan
                $rootScope.tab_cover = false; // tab cover di hide dulu
                var goto = finish ? 'app.art_cover' : '';
            }else{
                // simpan model, termasuk yg hidden dg ng-show, exclude hidden dg ng-if
                var goto = finish ? 'app.akk' : 'app.ptm';
            }
                
            // AppService.saveCatatanKelompok('utama',$scope.idrt);
            return AppService.saveDataKelMasked('ptm', $scope.ptm, true, goto).then(function() {
                modalSaved = true;
                lastPtm = angular.copy($scope.ptm);
                // if (finish) {
                //     $rootScope.$broadcast('loading:show');
                //     $timeout(function() {
                //         $rootScope.$broadcast('loading:hide');
                //         $state.go('app.aks');
                //     }, 300);
                // }
            });
        };

        $scope.saveModal = function() {
            // simpan semua model, baik yg hidden ataupun tidak
            $scope.save(false).then(function() {
                $scope.modal.hide();
            });
        };

        $scope.checkAllowSave = function(sub, f1, f2) {
            var ptm = $scope.ptm;
            var allow = false;
            if (sub === 'hipertensi' || sub === 'diabetes' || sub === 'stroke') {
                var v1 = parseInt(ptm[f1]);
                if (v1 === 1) {
                    $scope.dataART.forEach(function(d) {
                        allow = allow || (ptm[f2] && ptm[f2][d.idart]);
                    });
                } else if (v1 === 2 || v1 === 98) {
                    allow = true;
                }
            } else {
                allow = true;
            }
            return allow;
        };

        $scope.checkAllowSaveModal = function() {
            var ptm = $scope.ptm,
                idart = $scope.idart,
                allow = false;
            if ($scope.asma && $scope.modal2) {
                allow = ptm.ptm16a && ptm.ptm16a[idart] &&
                    ptm.ptm16b && ptm.ptm16b[idart] &&
                    ptm.ptm16c && ptm.ptm16c[idart] &&
                    ptm.ptm16d && ptm.ptm16d[idart] &&
                    ptm.ptm17 && (ptm.ptm17[idart] || ptm.ptm17[idart] == '0') &&
                    ptm.ptm17bln && (ptm.ptm17bln[idart] || ptm.ptm17bln[idart] == '0') &&
                    ptm.ptm18 && ptm.ptm18[idart];
                // Tampilkan jika umur >= 30 tahun
                if ($scope.umur >= 30) {
                    allow = allow && ptm.ptm19a && ptm.ptm19a[idart] &&
                        ptm.ptm19b && ptm.ptm19b[idart] &&
                        ptm.ptm19c && ptm.ptm19c[idart];
                }
            } else if ($scope.cedera) {
                var x, ptm27,
                    ptm21 = ptm.ptm21 && ptm.ptm21[idart],
                    ptm22a = parseInt(ptm.ptm22a && ptm.ptm22a[idart]),
                    ptm22ba1 = (ptm.ptm22ba1 && (ptm.ptm22ba1[idart] || ptm.ptm22ba1[idart] == 0)),
                    ptm22ba2 = (ptm.ptm22ba2 && (ptm.ptm22ba2[idart] || ptm.ptm22ba2[idart] == 0))
                    // ptm22bb1 = (ptm.ptm22bb1 && (ptm.ptm22bb1[idart] || ptm.ptm22bb1[idart] == 0)), //hilangkan rawat inap dan jalan pada pengobatan tradisional
                    // ptm22bb2 = (ptm.ptm22bb2 && (ptm.ptm22bb2[idart] || ptm.ptm22bb2[idart] == 0))
                    ;
                allow = ptm.ptm20;

                if (ptm22a === 1) {
                    x = parseInt(ptm.ptm22ba && ptm.ptm22ba[idart]);
                    allow = allow && x;
                    if (allow && x === 1) {
                        allow = allow && ptm22ba1 && ptm22ba2;
                    }

                    x = parseInt(ptm.ptm22bb && ptm.ptm22bb[idart]);
                    allow = allow && x;
                    if (allow && x === 1) {
                        // allow = allow && ptm22bb1 && ptm22bb2; //hilangkan rawat inap dan jalan pada pengobatan tradisional
                    }
                    allow = allow && ptm.ptm22bc && ptm.ptm22bc[idart];

                    for (var prop in $scope.ptm23Item) {
                        x = 'ptm23' + prop;
                        allow = allow && ptm[x] && ptm[x][idart];
                    }

                    for (prop in $scope.ptm24Item) {
                        x = 'ptm24' + prop;
                        allow = allow && ptm[x] && ptm[x][idart];
                        if (prop === 'v' && ptm[x] && ptm[x][idart] == '1') {
                            allow = allow && ptm['ptm24lainnya'] && ptm['ptm24lainnya'][idart];
                        }
                    }

                    allow = allow && ptm.ptm25a && ptm.ptm25a[idart] &&
                        ptm.ptm25b && ptm.ptm25b[idart] &&
                        ptm.ptm25c && ptm.ptm25c[idart] &&
                        ptm.ptm25d && ptm.ptm25d[idart] &&
                        ptm.ptm26 && ptm.ptm26[idart] &&
                        ptm.ptm27 && ptm.ptm27[idart] &&
                        ptm.ptm29 && ptm.ptm29[idart];

                    x = ptm.ptm26 && parseInt(ptm.ptm26[idart]);
                    if (x === 95) {
                        allow = allow && ptm.ptm26lainnya && ptm.ptm26lainnya[idart];
                    }

                    ptm27 = ptm.ptm27 && parseInt(ptm.ptm27[idart]);
                    if (ptm27 === 95) {
                        allow = allow && ptm.ptm27lainnya && ptm.ptm27lainnya[idart];
                    }

                    if (ptm27 === 1) {
                        allow = allow && ptm.ptm28 && ptm.ptm28[idart];
                    }

                    x = ptm.ptm29 && parseInt(ptm.ptm29[idart]);
                    if (x === 95) {
                        allow = allow && ptm.ptm29lainnya && ptm.ptm29lainnya[idart];
                    }
                }

                allow = ptm21 && ptm22a && allow;
            }

            return allow;
        };

        $scope.lainnyaAllowSave = function() {
            var ptm = $scope.ptm,
                x, // ptm31, ptm32,
                ptm30 = parseInt(ptm.ptm30),
                ptm33 = parseInt(ptm.ptm33),
                ptm34 = parseInt(ptm.ptm34),
                allow = ptm30 && ptm33 && ptm34;

            if (ptm33 === 1) {
                x = false;
                $scope.dataART.forEach(function(d) {
                    x = x || (ptm.ptm33ls && ptm.ptm33ls[d.idart]);
                });
                allow = allow && x;
            }

            if (ptm34 === 1) {
                x = false;
                $scope.dataART.forEach(function(d) {
                    x = x || (ptm.ptm34ls && ptm.ptm34ls[d.idart]);
                });
                allow = allow && x;
            }

            if (ptm30 === 1) {
                x = false;
                $scope.dataART.forEach(function(d) {
                    x = x || ((ptm.ptm31 && ptm.ptm31[d.idart]) && (ptm.ptm32 && ptm.ptm32[d.idart]));
                });
                allow = allow && x;
            }

            return allow;
        };

        $scope.jantungAllowSave = function() {
            var ptm = $scope.ptm,
                // ptm07 dan ptm08 harus terisi
                allow1 = ptm.ptm07 && ptm.ptm08,
                allow2 = false;
            if (parseInt(ptm.ptm09) === 1) {
                $scope.dataART.forEach(function(d) {
                    allow2 = allow2 || (ptm.ptm10 && ptm.ptm10[d.idart]);
                });
            } else {
                allow2 = ptm.ptm09;
            }
            return allow1 && allow2;
        };

        $scope.kankerAllowSave = function() {
            var ptm = $scope.ptm,
                // terisi = ada salah satu row yg sudah diisi
                // jika semua row valid & terisi salah satu atau lebih return true
                terisi = false,
                // rowValid = isian row valid (terisi semua atau empty semua)
                // Jika ada salah satu row invalid, return selalu invalid
                rowValid = true,
                ptm11 = ptm.ptm11 && parseInt(ptm.ptm11),
                ptm12a, ptm12b, ptm13;
            if (ptm11 === 1) {
                $scope.dataART.forEach(function(d) {
                    ptm12a = ptm.ptm12a && ptm.ptm12a[d.idart];
                    ptm12b = ptm.ptm12b && ptm.ptm12b[d.idart];
                    ptm13 = ptm.ptm13 && ptm.ptm13[d.idart];

                    // Jika pilihannya Kanker Lainnya (true jika lainnya diisi)
                    if (parseInt(ptm12a) === 95) {
                        // jika isian lainnya empty (belum diisi)
                        if (!ptm12b) {
                            terisi = terisi || false;
                            rowValid = false;
                        } else {
                            // terisi jika ptm13 juga terisi
                            terisi = terisi || ptm13;
                            // valid jika sebelumnya valid dan ptm13 terisi
                            rowValid = rowValid && ptm13;
                        }
                    } else if (ptm12a) {
                        terisi = terisi || ptm13;
                        rowValid = rowValid && ptm13;
                    } else {
                        terisi = terisi || false;
                        // jika ptm12a empty dan ptm13 empty -> rowValid
                        rowValid = rowValid && !ptm13;
                    }
                });
            } else if (ptm11 === 2 || ptm11 === 98) {
                return true;
            }
            return rowValid && terisi;
        };

        $scope.asmaAllowSave = function() {
            var ptm = $scope.ptm,
                // terisi = ada salah satu row yg sudah diisi
                // jika semua row valid & terisi salah satu atau lebih return true
                terisi = true,
                // rowValid = isian row valid (terisi semua atau empty semua)
                // Jika ada salah satu row invalid, return selalu invalid
                rowValid = true,
                ptm14 = ptm.ptm14;
            if (ptm14 === 1) {
                $scope.dataART.forEach(function(d) {
                    ptm14ls = ptm.ptm14ls && ptm.ptm14ls[d.idart];

                    terisi = terisi && ptm14ls;
                });
            } else if (ptm14 === 2 || ptm14 === 98) {
                return true;
            }
            return rowValid && terisi;
        };

        $scope.cederaAllowSave = function() {
            var ptm = $scope.ptm,
                // terisi = ada salah satu row yg sudah diisi
                // jika semua row valid & terisi salah satu atau lebih return true
                terisi = true,
                // rowValid = isian row valid (terisi semua atau empty semua)
                // Jika ada salah satu row invalid, return selalu invalid
                rowValid = true,
                ptm20 = ptm.ptm20;
            if (ptm20 === 1) {
                $scope.dataART.forEach(function(d) {
                    ptm20ls = ptm.ptm20ls && ptm.ptm20ls[d.idart];

                    terisi = terisi && ptm20ls;
                });
            } else if (ptm20 === 2 || ptm20 === 98) {
                return true;
            }
            return rowValid && terisi;
        };

        //controller modal di PM03
        $ionicModal.fromTemplateUrl('templates/ptm-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });

        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
            if (!modalSaved) {
                $scope.ptm = angular.copy(lastPtm);
            }
        });

        $scope.checkPtm20 = function(art, checked) {
            var ptm = $scope.ptm;
            if (checked == 1 
                // &&
                //     ptm.ptm16c && ptm.ptm16c[art.idart] &&
                //     ptm.ptm16d && ptm.ptm16d[art.idart] &&
                // ini ambil dari checkAllowSaveModal()
                // !(ptm.ptm16a && ptm.ptm16a[art.idart] &&
                //     ptm.ptm16b && ptm.ptm16b[art.idart] &&
                //     ptm.ptm17 && (ptm.ptm17[art.idart] || ptm.ptm17[art.idart] == '0') &&
                //     ptm.ptm17bln && (ptm.ptm17bln[art.idart] || ptm.ptm17bln[art.idart] == '0') &&
                //     ptm.ptm18 && ptm.ptm18[art.idart])
            ){
                $scope.editPtm(art, 'cedera', checked);
            }
        };

        $scope.editPtm = function(art, sub, val) {
            if (sub === 'asma') {
                $scope.modal1 = true;
                $scope.modal2 = false;
                $scope.titleModal = 'Asma / Bengek / Mengi';
            } else if (sub === 'cedera') {
                /* set default value ptm */
                if (!$scope.ptm.ptm) {
                    $scope.ptm.ptm = {};
                }
                if (val == 1) {
                    $scope.ptm.ptm[art.idart] = 1;
                }else{
                    if ($scope.ptm.ptm[art.idart] == 1) {
                        $scope.ptm.ptm[art.idart] = 1;
                    }else{
                        $scope.ptm.ptm[art.idart] = 0;
                    }
                }
                $scope.titleModal = 'Cedera';
            }

            $scope.nama = art._nama;
            $scope.umur = art.umur;
            $scope.idart = art.idart;
            modalSaved = false;
            $scope.modal.show();
        };

        $scope.defptm = function(val,idart){
            /* set default value ptm */
            if (!$scope.ptm.ptm) {
                $scope.ptm.ptm = {};
            }      
            if (val == 1) {
                $scope.ptm.ptm[idart] = 1;
            }else{
                if ($scope.ptm.ptm[idart] == 1) {
                    $scope.ptm.ptm[idart] = 1;
                }else{
                    $scope.ptm.ptm[idart] = 0;
                }
            }
        };

        $scope.nextModal2 = function() {
            $scope.modal1 = false;
            $scope.modal2 = true;
        };

        $scope.backModal1 = function() {
            $scope.modal1 = true;
            $scope.modal2 = false;
        };
    }
})();

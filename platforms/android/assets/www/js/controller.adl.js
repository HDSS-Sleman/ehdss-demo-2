(function() {
    angular.module('ehdss')
        .controller('AdlCtrl', AdlCtrl);

    AdlCtrl.$inject = ['$scope', '$rootScope', '$state', '$ionicModal', 'AppService', '$timeout'];

    function AdlCtrl($scope, $rootScope, $state, $ionicModal, AppService, $timeout) {

        $scope.s1 = $rootScope.j_siklus.s1;
        $scope.s2 = $rootScope.j_siklus.s2;
        $scope.s3 = $rootScope.j_siklus.s3;
        $scope.s4 = $rootScope.j_siklus.s4;
        
        $scope.ir = $rootScope.dataRT.ir || {};
        // var idart = $scope.idart;
        //$scope.ir.jam_mulai_ir = new Date(1970, 0, 1, 0, 0, 0) || {};
              
        // $scope.adl = {};
        $scope.sf12 = $rootScope.dataRT.sf12 || {};
        $scope.adl = $rootScope.dataRT.adl || {};
        $scope.iadl = $rootScope.dataRT.iadl || {};
        $scope.fmbs = $rootScope.dataRT.fmbs || {};
        $scope.cane = $rootScope.dataRT.cane || {};
        $scope.gds = $rootScope.dataRT.gds || {};
        $scope.mmse = $rootScope.dataRT.mmse || {};
        $scope.mna = $rootScope.dataRT.mna || {};
        $scope.csdd = $rootScope.dataRT.csdd || {};
        // check if object is empty
        var kosong = function isEmpty(obj) {
            for(var key in obj) {
                if(obj.hasOwnProperty(key))
                    return false;
            }
            return JSON.stringify(obj) === JSON.stringify({});
        }

        // status jika sudah terisi true/false
        $scope.status_sf12 = kosong($scope.dataRT.sf12);
        $scope.status_adl = kosong($scope.dataRT.adl);
        $scope.status_iadl = kosong($scope.dataRT.iadl);
        $scope.status_fmbs = kosong($scope.dataRT.fmbs);
        $scope.status_cane = kosong($scope.dataRT.cane);
        $scope.status_gds = kosong($scope.dataRT.gds);
        $scope.status_mmse = kosong($scope.dataRT.mmse);
        $scope.status_mna = kosong($scope.dataRT.mna);
        $scope.status_csdd = kosong($scope.dataRT.csdd);
        
        // $scope.segilima = 'img/segilima.png';
        // $scope.pensil_arloji = 'img/pensil_arloji.png';

        // simpan variabel terakhir yg tersimpan
        var lastIr = angular.copy($scope.ir);
        var lastSf12 = angular.copy($scope.sf12);
        var lastAdl = angular.copy($scope.adl);
        var lastIadl = angular.copy($scope.iadl);
        var lastFmbs = angular.copy($scope.fmbs);
        var lastCane = angular.copy($scope.cane);
        var lastGds = angular.copy($scope.gds);
        var lastMmse = angular.copy($scope.mmse);
        var lastMna = angular.copy($scope.mna);
        var lastCsdd = angular.copy($scope.csdd);

        // apakah form di modal di save ?
        var modalSaved = false;

        // ADL hanya mengambil yg umurnya lebih dari 60 tahun
        AppService.getDataART().then(function(data) {
            $scope.dataART = data.filter(function(item) {
                var umur = parseInt(item.umur);
                var umur_rev = parseInt(item.umur_th_rev);
                if ($rootScope.jenisSiklus == '4_rm') {
                    return !item.artTdkAda && (umur > 55 || umur_rev > 55);
                }
            });
        });
        AppService.getTglWawancaraMinSatu(true).then(function(val) {
            $scope.tglMaxEntry = val;
        })

        var initModal = function() {
            $scope.modal_ir = true;
            $scope.modal_sf12_1 = false;
            $scope.modal_sf12_2 = false;
            $scope.modal_adl = false;
            $scope.modal_iadl = false;
            $scope.modal_fmbs = false;
            // $scope.modal_cane = false;
            $scope.modal_gds = false;
            $scope.modal_mmse = false;
            $scope.modal_mna = false;
            $scope.modal_csdd = false;
        };

        $scope.cek_mmse = function(){
            var mmse = $scope.mmse,
                idart = $scope.idart,
                y = mmse.mmse1[idart],
                x = parseInt(mmse.mmse1[idart]),
             mmse1art = mmse.mmse1 ? parseInt(mmse.mmse1[idart]) : 0;
        };

        $scope.go = function(curMenu, toMenu, obj) {
            AppService.saveDataKelMasked(obj, $scope[obj], true).then(function() {
                $scope[curMenu] = false;
                $scope[toMenu] = true;
                if (obj == 'ir') {
                    // normalisasi data setelah di save supaya kembali menjadi Date object
                    var data_jam_mulai, data_jam_selesai, data_tgl = {};
                        data_jam_mulai = $scope.ir.jam_mulai_ir;
                        data_jam_selesai = $scope.ir.jam_selesai_ir;
                        data_tgl = $scope.ir.tglinput_ir;
                        data_usia = $scope.ir.tgllahir_ir;
                        if (data_jam_mulai) {
                            for (var idart in data_jam_mulai) {
                                var jam = new Date();
                                if (data_jam_mulai.hasOwnProperty(idart)) {
                                    // jika tanggal bukan string
                                    if (angular.isDate(data_jam_mulai[idart])) {
                                        data_jam_mulai[idart] = $scope.ir.jam_mulai_ir[idart];
                                    }else{
                                        var jam_string = data_jam_mulai[idart];
                                        var jam_arr = jam_string.split(":");
                                        //set jam string ke Date object                                        
                                        data_jam_mulai[idart] = new Date(1970, 0, 1, jam_arr[0], jam_arr[1], 0);
                                    }
                                    
                                }
                            }
                            $scope.ir.jam_mulai_ir = data_jam_mulai;
                        }
                        if (data_jam_selesai) {
                            for (var idart in data_jam_selesai) {
                                var jam = new Date();
                                if (data_jam_selesai.hasOwnProperty(idart)) {
                                    // jika tanggal bukan string
                                    if (angular.isDate(data_jam_selesai[idart])) {
                                        data_jam_selesai[idart] = $scope.ir.jam_selesai_ir[idart];
                                    }else{
                                        var jam_string = data_jam_selesai[idart];
                                        var jam_arr = jam_string.split(":");
                                        //set jam string ke Date object                                        
                                        data_jam_selesai[idart] = new Date(1970, 0, 1, jam_arr[0], jam_arr[1], 0);
                                    }
                                    
                                }
                            }
                            $scope.ir.jam_selesai_ir = data_jam_selesai;
                        }
                        if (data_tgl) {
                            for (var idart in data_tgl) {
                                var tgl = new Date();
                                if (data_tgl.hasOwnProperty(idart)) {
                                    // jika tanggal bukan string
                                    if (angular.isDate(data_tgl[idart])) {
                                        data_tgl[idart] = $scope.ir.tglinput_ir[idart];
                                    }else{
                                        //set tgl string ke Date object                                        
                                        data_tgl[idart] = new Date(data_tgl[idart]);
                                    }
                                    
                                }
                            }
                            $scope.ir.tglinput_ir = data_tgl;
                        }
                        if (data_usia) {
                            for (var idart in data_usia) {
                                var tgl = new Date();
                                if (data_usia.hasOwnProperty(idart)) {
                                    // jika tanggal bukan string
                                    if (angular.isDate(data_usia[idart])) {
                                        data_usia[idart] = $scope.ir.tgllahir_ir[idart];
                                    }else{
                                        //set tgl string ke Date object                                        
                                        data_usia[idart] = new Date(data_usia[idart]);
                                    }
                                    
                                }
                            }
                            $scope.ir.tgllahir_ir = data_usia;
                        }
                    modalSaved = true;
                    lastIr = angular.copy($scope.ir); //nanti dibuat datte format untuk IR

                }else if (obj == 'sf12') {
                    modalSaved = true;
                    lastSf12 = angular.copy($scope.sf12);
                }else if (obj == 'adl') {
                    modalSaved = true;
                    lastAdl = angular.copy($scope.adl);
                }else if (obj == 'iadl') {
                    modalSaved = true;
                    lastIadl = angular.copy($scope.iadl);
                }else if (obj == 'fmbs') {
                    modalSaved = true;
                    lastFmbs = angular.copy($scope.fmbs);
                }else if (obj == 'cane') {
                    modalSaved = true;
                    lastCane = angular.copy($scope.cane);
                }else if (obj == 'gds') {
                    modalSaved = true;
                    lastGds = angular.copy($scope.gds);
                }else if (obj == 'mmse') {
                    modalSaved = true;
                    lastMmse = angular.copy($scope.mmse);
                }else if (obj == 'mna') {
                    modalSaved = true;
                    lastMna = angular.copy($scope.mna);
                }else if(obj == 'csdd'){
                    modalSaved = true;
                    lastCsdd = angular.copy($scope.csdd);
                }
            });
        };

        $scope.go_to = function(curMenu, toMenu) {
                $scope[curMenu] = false;
                $scope[toMenu] = true;
        };

        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
            // var idart = $scope.idart;
            if (!modalSaved) {
                $scope.ir = angular.copy(lastIr); //harus dirubah ke Date object dulu
                $scope.sf12 = angular.copy(lastSf12);
                $scope.adl = angular.copy(lastAdl);
                $scope.iadl = angular.copy(lastIadl);
                $scope.fmbs = angular.copy($scope.fmbs);
                $scope.cane = angular.copy($scope.cane);
                $scope.gds = angular.copy($scope.gds);
                $scope.mmse = angular.copy($scope.mmse);
                $scope.mna = angular.copy($scope.mna);
                $scope.csdd = angular.copy($scope.csdd);
            }
        });

        $scope.jenisKesulitanADl = {
            1: '1. Tidak ada masalah',
            2: '2. Ringan',
            3: '3. Sedang',
            4: '4. Berat',
            5: '5. Sangat berat/tidak bisa'
        };

        $scope.seberapaSeringSF = {
            1: '1. Selalu',
            2: '2. Hampir selalu',
            3: '3. Kadang-kadang',
            4: '4. Jarang',
            5: '5. atau Tidak pernah'
        };

        $scope.seberapaSeringFMBS = {
            1: '1. Tidak pernah',
            2: '2. Jarang',
            3: '3. Kadang-kadang',
            4: '4. Sering',
            5: '5. Selalu'
        };

        $scope.seberapaSeringFMBSx = {
            1: '1. Tidak pernah',
            2: '2. Jarang',
            3: '3. Kadang-kadang',
            4: '4. Sering',
            5: '5. Selalu',
            9: '9. N/A'
        };

        $scope.kebutuhanCANE = {
            1: '1. no need',
            2: '2. meet need',
            3: '3. unmeet need'
        };

        $scope.skoringCSDD = {
            'a': 'a. tidak dapat dievaluasi',
            '0': '0. tidak ada',
            '1': '1. ringan atau kadang-kadang',
            '2': '2. parah'
        };

        $scope.allowNextIr = function() {
            var ir = $scope.ir,
                idart = $scope.idart,
                allow = (ir.tglinput_ir && ir.tglinput_ir[idart]) &&
                        (ir.jam_mulai_ir && ir.jam_mulai_ir[idart]) &&
                        (ir.nama_ir && ir.nama_ir[idart]) &&
                        (ir.tempatlahir_ir && ir.tempatlahir_ir[idart]) &&
                        (ir.tgllahir_ir && ir.tgllahir_ir[idart]) &&
                        (ir.usia_ir && ir.usia_ir[idart]) &&
                        (ir.alamat_ir && ir.alamat_ir[idart]) &&
                        (ir.telp_ir && ir.telp_ir[idart]) &&
                        (ir.jk_ir && ir.jk_ir[idart]) &&
                        (ir.statusmarital_ir && ir.statusmarital_ir[idart]) &&
                        (ir.suku_ir && ir.suku_ir[idart]) &&
                        (ir.pendidikan_ir && ir.pendidikan_ir[idart]) &&
                        (ir.pekerjaan_ir && ir.pekerjaan_ir[idart]) &&
                        (ir.pendapatan_ir && ir.pendapatan_ir[idart]) &&
                        (ir.pengeluaran_ir && ir.pengeluaran_ir[idart]) &&
                        (ir.sistolik_1 && ir.sistolik_1[idart]) &&
                        (ir.distolik_1 && ir.distolik_1[idart])
                        ;
                        ir.pekerjaan_ir = ir.pekerjaan_ir ? ir.pekerjaan_ir : {};
                        if (ir.pekerjaan_ir[idart] == '95') {
                            allow = allow && (ir.pekerjaan_lainnya_ir && ir.pekerjaan_lainnya_ir[idart]);
                        }
            return allow;
        };

        $scope.allowSaveIr = function() {
            var ir = $scope.ir,
                idart = $scope.idart,
                allow = (ir.tglinput_ir && ir.tglinput_ir[idart]) &&
                        (ir.jam_mulai_ir && ir.jam_mulai_ir[idart]) &&
                        (ir.nama_ir && ir.nama_ir[idart]) &&
                        (ir.tempatlahir_ir && ir.tempatlahir_ir[idart]) &&
                        (ir.tgllahir_ir && ir.tgllahir_ir[idart]) &&
                        (ir.usia_ir && ir.usia_ir[idart]) &&
                        (ir.alamat_ir && ir.alamat_ir[idart]) &&
                        (ir.telp_ir && ir.telp_ir[idart]) &&
                        (ir.jk_ir && ir.jk_ir[idart]) &&
                        (ir.statusmarital_ir && ir.statusmarital_ir[idart]) &&
                        (ir.suku_ir && ir.suku_ir[idart]) &&
                        (ir.pendidikan_ir && ir.pendidikan_ir[idart]) &&
                        (ir.pekerjaan_ir && ir.pekerjaan_ir[idart]) &&
                        (ir.pendapatan_ir && ir.pendapatan_ir[idart]) &&
                        (ir.pengeluaran_ir && ir.pengeluaran_ir[idart]) &&
                        (ir.sistolik_1 && ir.sistolik_1[idart]) &&
                        (ir.distolik_1 && ir.distolik_1[idart]) &&
                        (ir.sistolik_2 && ir.sistolik_2[idart]) &&
                        (ir.distolik_2 && ir.distolik_2[idart]) &&
                        (ir.sistolik_3 && ir.sistolik_3[idart]) &&
                        (ir.distolik_3 && ir.distolik_3[idart]) &&
                        (ir.jam_selesai_ir && ir.jam_selesai_ir[idart]) 
                        ;
                        ir.pekerjaan_ir = ir.pekerjaan_ir ? ir.pekerjaan_ir : {};
                        if (ir.pekerjaan_ir[idart] == '95') {
                            allow = allow && (ir.pekerjaan_lainnya_ir && ir.pekerjaan_lainnya_ir[idart]);
                        }
            return allow;
        };

        $scope.allowNextSf12_1 = function() {
            var sf12 = $scope.sf12,
                idart = $scope.idart,
                sf121art = sf12.sf121 ? parseInt(sf12.sf121[idart]) : 0,
                sf122aart = sf12.sf122a ? parseInt(sf12.sf122a[idart]) : 0,
                sf122bart = sf12.sf122b ? parseInt(sf12.sf122b[idart]) : 0,
                sf123aart = sf12.sf123a ? parseInt(sf12.sf123a[idart]) : 0,
                sf123bart = sf12.sf123b ? parseInt(sf12.sf123b[idart]) : 0,
                sf124aart = sf12.sf124a ? parseInt(sf12.sf124a[idart]) : 0,
                sf124bart = sf12.sf124b ? parseInt(sf12.sf124b[idart]) : 0,

                allow = (sf121art && sf12.sf121 && sf12.sf121[idart]) &&
                        (sf122aart && sf12.sf122a && sf12.sf122a[idart]) &&
                        (sf122bart && sf12.sf122b && sf12.sf122b[idart]) &&
                        (sf123aart && sf12.sf123a && sf12.sf123a[idart]) &&
                        (sf123bart && sf12.sf123b && sf12.sf123b[idart]) &&
                        (sf124aart && sf12.sf124a && sf12.sf124a[idart]) &&
                        (sf124bart && sf12.sf124b && sf12.sf124b[idart])
                        ;
                $scope.total_sf12_1 = sf121art + sf122aart + sf122bart + sf123aart + sf123bart +
                                      sf124aart + sf124bart;
            return allow;
        };

        $scope.allowNextSf12_2 = function() {
            var sf12 = $scope.sf12,
                idart = $scope.idart,
                sf125art = sf12.sf125 ? parseInt(sf12.sf125[idart]) : 0,
                sf126aart = sf12.sf126a ? parseInt(sf12.sf126a[idart]) : 0,
                sf126bart = sf12.sf126b ? parseInt(sf12.sf126b[idart]) : 0,
                sf126cart = sf12.sf126c ? parseInt(sf12.sf126c[idart]) : 0,
                sf127art = sf12.sf127 ? parseInt(sf12.sf127[idart]) : 0,

                allow = (sf125art && sf12.sf125 && sf12.sf125[idart]) &&
                        (sf126aart && sf12.sf126a && sf12.sf126a[idart]) &&
                        (sf126bart && sf12.sf126b && sf12.sf126b[idart]) &&
                        (sf126cart && sf12.sf126c && sf12.sf126c[idart]) &&
                        (sf127art && sf12.sf127 && sf12.sf127[idart])
                        ;
                $scope.total_sf12_2 = sf125art + sf126aart + sf126bart + sf126cart + sf127art;
                sf12.sf12_total = sf12.sf12_total ? sf12.sf12_total : {};
                sf12.sf12_total[idart] = $scope.total_sf12_1 + $scope.total_sf12_2;
            return allow;
        };

        $scope.allowNextAdl = function() {
            var adl = $scope.adl,
                idart = $scope.idart,
                adl1art = adl.adl1 ? parseInt(adl.adl1[idart]) : 0,
                adl2art = adl.adl2 ? parseInt(adl.adl2[idart]) : 0,
                adl3art = adl.adl3 ? parseInt(adl.adl3[idart]) : 0,
                adl4art = adl.adl4 ? parseInt(adl.adl4[idart]) : 0,
                adl5art = adl.adl5 ? parseInt(adl.adl5[idart]) : 0,
                allow = (adl1art >=1 && adl1art <= 5 && adl.adl1 && adl.adl1[idart]) &&
                        (adl2art >=1 && adl2art <= 5 && adl.adl2 && adl.adl2[idart]) &&
                        (adl3art >=1 && adl3art <= 5 && adl.adl3 && adl.adl3[idart]) &&
                        (adl4art >=1 && adl4art <= 5 && adl.adl4 && adl.adl4[idart]) &&
                        (adl5art >=1 && adl5art <= 5 && adl.adl5 && adl.adl5[idart])
                        ;
                adl.adl_total = adl.adl_total ? adl.adl_total : {};
                adl.adl_total[idart] = adl1art + adl2art + adl3art + adl4art + adl5art;
            return allow;
        };

        $scope.allowNextIadl = function() {
            var iadl = $scope.iadl,
                idart = $scope.idart,
                iadl1art = iadl.iadl1 ? parseInt(iadl.iadl1[idart]) : 0,
                iadl2art = iadl.iadl2 ? parseInt(iadl.iadl2[idart]) : 0,
                iadl3art = iadl.iadl3 ? parseInt(iadl.iadl3[idart]) : 0,
                iadl4art = iadl.iadl4 ? parseInt(iadl.iadl4[idart]) : 0,
                allow = (iadl1art >=1 && iadl1art <= 5 && iadl.iadl1 && iadl.iadl1[idart]) &&
                        (iadl2art >=1 && iadl2art <= 5 && iadl.iadl2 && iadl.iadl2[idart]) &&
                        (iadl3art >=1 && iadl3art <= 5 && iadl.iadl3 && iadl.iadl3[idart]) &&
                        (iadl4art >=1 && iadl4art <= 5 && iadl.iadl4 && iadl.iadl4[idart])
                        ;
                iadl.iadl_total = iadl.iadl_total ? iadl.iadl_total : {};
                iadl.iadl_total[idart] = iadl1art + iadl2art + iadl3art + iadl4art;
            return allow;
        };

        $scope.allowNextFmbs = function() {
            var fmbs = $scope.fmbs,
                idart = $scope.idart,
                fmbs1art = fmbs.fmbs1 ? parseInt(fmbs.fmbs1[idart]) : 0,
                fmbs2art = fmbs.fmbs2 ? parseInt(fmbs.fmbs2[idart]) : 0,
                fmbs3art = fmbs.fmbs3 ? parseInt(fmbs.fmbs3[idart]) : 0,
                fmbs4art = fmbs.fmbs4 ? parseInt(fmbs.fmbs4[idart]) : 0,
                fmbs5art = fmbs.fmbs5 ? parseInt(fmbs.fmbs5[idart]) : 0,
                fmbs6art = fmbs.fmbs6 ? parseInt(fmbs.fmbs6[idart]) : 0,
                fmbs7art = fmbs.fmbs7 ? parseInt(fmbs.fmbs7[idart]) : 0,
                fmbs8art = fmbs.fmbs8 ? parseInt(fmbs.fmbs8[idart]) : 0,
                fmbs9art = fmbs.fmbs9 ? parseInt(fmbs.fmbs9[idart]) : 0,
                fmbs10art = fmbs.fmbs10 ? parseInt(fmbs.fmbs10[idart]) : 0,
                fmbs11art = fmbs.fmbs11 ? parseInt(fmbs.fmbs11[idart]) : 0,
                fmbs12art = fmbs.fmbs12 ? parseInt(fmbs.fmbs12[idart]) : 0,
                fmbs13art = fmbs.fmbs13 ? parseInt(fmbs.fmbs13[idart]) : 0,
                fmbs14art = fmbs.fmbs14 ? parseInt(fmbs.fmbs14[idart]) : 0,
                fmbs15art = fmbs.fmbs15 ? parseInt(fmbs.fmbs15[idart]) : 0,
                allow = (fmbs1art && fmbs.fmbs1 && fmbs.fmbs1[idart]) &&
                        (fmbs2art && fmbs.fmbs2 && fmbs.fmbs2[idart]) &&
                        (fmbs3art && fmbs.fmbs3 && fmbs.fmbs3[idart]) &&
                        (fmbs4art && fmbs.fmbs4 && fmbs.fmbs4[idart]) &&
                        (fmbs5art && fmbs.fmbs5 && fmbs.fmbs5[idart]) &&
                        (fmbs6art && fmbs.fmbs6 && fmbs.fmbs6[idart]) &&
                        (fmbs7art && fmbs.fmbs7 && fmbs.fmbs7[idart]) &&
                        (fmbs8art && fmbs.fmbs8 && fmbs.fmbs8[idart]) &&
                        (fmbs9art && fmbs.fmbs9 && fmbs.fmbs9[idart]) &&
                        (fmbs10art && fmbs.fmbs10 && fmbs.fmbs10[idart]) &&
                        (fmbs11art && fmbs.fmbs11 && fmbs.fmbs11[idart]) &&
                        (fmbs12art && fmbs.fmbs12 && fmbs.fmbs12[idart]) &&
                        (fmbs13art && fmbs.fmbs13 && fmbs.fmbs13[idart]) &&
                        (fmbs14art && fmbs.fmbs14 && fmbs.fmbs14[idart]) &&
                        (fmbs15art && fmbs.fmbs15 && fmbs.fmbs15[idart])
                        ;
                fmbs.fmbs5 = fmbs.fmbs5 ? fmbs.fmbs5 : {};
                fmbs.fmbs6 = fmbs.fmbs6 ? fmbs.fmbs6 : {};
                fmbs.fmbs7 = fmbs.fmbs7 ? fmbs.fmbs7 : {};
                // if (fmbs.fmbs5[idart] == '9') {
                //     fmbs.fmbs6[idart] = '9', fmbs.fmbs7[idart] = '9';
                // } 
                fmbs.fmbs_total = fmbs.fmbs_total ? fmbs.fmbs_total : {};
                fmbs.fmbs_total[idart] = fmbs1art + fmbs2art + fmbs3art + fmbs4art + fmbs5art +
                                         fmbs6art + fmbs7art + fmbs8art + fmbs9art + fmbs10art +
                                         fmbs11art + fmbs12art + fmbs13art + fmbs14art + fmbs15art;
            return allow;
        };
        $scope.NA = function(key){
            var idart = $scope.idart;
            if (key === '9') {
                    $scope.fmbs.fmbs6[idart] = '9'; 
                    $scope.fmbs.fmbs7[idart] = '9';
                } 
        }
        $scope.allowNextCane = function() {
            var cane = $scope.cane,
                idart = $scope.idart,
                cane1art = cane.cane1 ? parseInt(cane.cane1[idart]) : 0,
                cane2art = cane.cane2 ? parseInt(cane.cane2[idart]) : 0,
                cane3art = cane.cane3 ? parseInt(cane.cane3[idart]) : 0,
                cane4art = cane.cane4 ? parseInt(cane.cane4[idart]) : 0,
                cane5art = cane.cane5 ? parseInt(cane.cane5[idart]) : 0,
                cane6art = cane.cane6 ? parseInt(cane.cane6[idart]) : 0,
                cane7art = cane.cane7 ? parseInt(cane.cane7[idart]) : 0,
                cane8art = cane.cane8 ? parseInt(cane.cane8[idart]) : 0,
                cane9art = cane.cane9 ? parseInt(cane.cane9[idart]) : 0,
                cane10art = cane.cane10 ? parseInt(cane.cane10[idart]) : 0,
                cane11art = cane.cane11 ? parseInt(cane.cane11[idart]) : 0,
                cane12art = cane.cane12 ? parseInt(cane.cane12[idart]) : 0,
                cane13art = cane.cane13 ? parseInt(cane.cane13[idart]) : 0,
                cane14art = cane.cane14 ? parseInt(cane.cane14[idart]) : 0,
                cane15art = cane.cane15 ? parseInt(cane.cane15[idart]) : 0,
                cane16art = cane.cane16 ? parseInt(cane.cane16[idart]) : 0,
                cane17art = cane.cane17 ? parseInt(cane.cane17[idart]) : 0,
                cane18art = cane.cane18 ? parseInt(cane.cane18[idart]) : 0,
                cane19art = cane.cane19 ? parseInt(cane.cane19[idart]) : 0,
                cane20art = cane.cane20 ? parseInt(cane.cane20[idart]) : 0,
                cane21art = cane.cane21 ? parseInt(cane.cane21[idart]) : 0,
                cane22art = cane.cane22 ? parseInt(cane.cane22[idart]) : 0,
                cane23art = cane.cane23 ? parseInt(cane.cane23[idart]) : 0,
                cane24art = cane.cane24 ? parseInt(cane.cane24[idart]) : 0,
                allow = (cane1art && cane.cane1 && cane.cane1[idart]) &&
                        (cane2art && cane.cane2 && cane.cane2[idart]) &&
                        (cane3art && cane.cane3 && cane.cane3[idart]) &&
                        (cane4art && cane.cane4 && cane.cane4[idart]) &&
                        (cane5art && cane.cane5 && cane.cane5[idart]) &&
                        (cane6art && cane.cane6 && cane.cane6[idart]) &&
                        (cane7art && cane.cane7 && cane.cane7[idart]) &&
                        (cane8art && cane.cane8 && cane.cane8[idart]) &&
                        (cane9art && cane.cane9 && cane.cane9[idart]) &&
                        (cane10art && cane.cane10 && cane.cane10[idart]) &&
                        (cane11art && cane.cane11 && cane.cane11[idart]) &&
                        (cane12art && cane.cane12 && cane.cane12[idart]) &&
                        (cane13art && cane.cane13 && cane.cane13[idart]) &&
                        (cane14art && cane.cane14 && cane.cane14[idart]) &&
                        (cane15art && cane.cane15 && cane.cane15[idart]) &&
                        (cane16art && cane.cane16 && cane.cane16[idart]) &&
                        (cane17art && cane.cane17 && cane.cane17[idart]) &&
                        (cane18art && cane.cane18 && cane.cane18[idart]) &&
                        (cane19art && cane.cane19 && cane.cane19[idart]) &&
                        (cane20art && cane.cane20 && cane.cane20[idart]) &&
                        (cane21art && cane.cane21 && cane.cane21[idart]) &&
                        (cane22art && cane.cane22 && cane.cane22[idart]) &&
                        (cane23art && cane.cane23 && cane.cane23[idart]) &&
                        (cane24art && cane.cane24 && cane.cane24[idart])
                        ;
            return allow;
        };

        $scope.allowNextGds = function() {
            var gds = $scope.gds,
                idart = $scope.idart,
                gds1art = gds.gds1 ? parseInt(gds.gds1[idart]) : 0,
                gds2art = gds.gds2 ? parseInt(gds.gds2[idart]) : 0,
                gds3art = gds.gds3 ? parseInt(gds.gds3[idart]) : 0,
                gds4art = gds.gds4 ? parseInt(gds.gds4[idart]) : 0,
                gds5art = gds.gds5 ? parseInt(gds.gds5[idart]) : 0,
                gds6art = gds.gds6 ? parseInt(gds.gds6[idart]) : 0,
                gds7art = gds.gds7 ? parseInt(gds.gds7[idart]) : 0,
                gds8art = gds.gds8 ? parseInt(gds.gds8[idart]) : 0,
                gds9art = gds.gds9 ? parseInt(gds.gds9[idart]) : 0,
                gds10art = gds.gds10 ? parseInt(gds.gds10[idart]) : 0,
                gds11art = gds.gds11 ? parseInt(gds.gds11[idart]) : 0,
                gds12art = gds.gds12 ? parseInt(gds.gds12[idart]) : 0,
                gds13art = gds.gds13 ? parseInt(gds.gds13[idart]) : 0,
                gds14art = gds.gds14 ? parseInt(gds.gds14[idart]) : 0,
                gds15art = gds.gds15 ? parseInt(gds.gds15[idart]) : 0,
                allow = ( !isNaN(gds1art) && gds.gds1 && gds.gds1[idart]) &&
                        ( !isNaN(gds2art) && gds.gds2 && gds.gds2[idart]) &&
                        ( !isNaN(gds3art) && gds.gds3 && gds.gds3[idart]) &&
                        ( !isNaN(gds4art) && gds.gds4 && gds.gds4[idart]) &&
                        ( !isNaN(gds5art) && gds.gds5 && gds.gds5[idart]) &&
                        ( !isNaN(gds6art) && gds.gds6 && gds.gds6[idart]) &&
                        ( !isNaN(gds7art) && gds.gds7 && gds.gds7[idart]) &&
                        ( !isNaN(gds8art) && gds.gds8 && gds.gds8[idart]) &&
                        ( !isNaN(gds9art) && gds.gds9 && gds.gds9[idart]) &&
                        ( !isNaN(gds10art) && gds.gds10 && gds.gds10[idart]) &&
                        ( !isNaN(gds11art) && gds.gds11 && gds.gds11[idart]) &&
                        ( !isNaN(gds12art) && gds.gds12 && gds.gds12[idart]) &&
                        ( !isNaN(gds13art) && gds.gds13 && gds.gds13[idart]) &&
                        ( !isNaN(gds14art) && gds.gds14 && gds.gds14[idart]) &&
                        ( !isNaN(gds15art) && gds.gds15 && gds.gds15[idart])
                        ;
                gds.gds_total = gds.gds_total ? gds.gds_total : {};
                gds.gds_total[idart] = gds1art + gds2art + gds3art + gds4art + gds5art + 
                                       gds6art + gds7art + gds8art + gds9art + gds10art +
                                       gds11art + gds12art + gds13art + gds14art + gds15art;
            return allow;
        };

        $scope.allowNextMmse = function() {
            var mmse = $scope.mmse,
                idart = $scope.idart,
                mmse1art = mmse.mmse1 ? parseInt(mmse.mmse1[idart]) : 0,
                mmse2art = mmse.mmse2 ? parseInt(mmse.mmse2[idart]) : 0,
                mmse3art = mmse.mmse3 ? parseInt(mmse.mmse3[idart]) : 0,
                mmse4art = mmse.mmse4 ? parseInt(mmse.mmse4[idart]) : 0,
                mmse5art = mmse.mmse5 ? parseInt(mmse.mmse5[idart]) : 0,
                mmse6art = mmse.mmse6 ? parseInt(mmse.mmse6[idart]) : 0,
                mmse7art = mmse.mmse7 ? parseInt(mmse.mmse7[idart]) : 0,
                mmse8art = mmse.mmse8 ? parseInt(mmse.mmse8[idart]) : 0,
                mmse9art = mmse.mmse9 ? parseInt(mmse.mmse9[idart]) : 0,
                mmse10art = mmse.mmse10 ? parseInt(mmse.mmse10[idart]) : 0,
                mmse11art = mmse.mmse11 ? parseInt(mmse.mmse11[idart]) : 0,
                mmse12art = mmse.mmse12 ? parseInt(mmse.mmse12[idart]) : 0,
                mmse13art = mmse.mmse13 ? parseInt(mmse.mmse13[idart]) : 0,
                pengulanganart = mmse.pengulangan ? parseInt(mmse.pengulangan[idart]) : 0,
                mmse_angka_kataart = mmse.mmse_angka_kata ? parseInt(mmse.mmse_angka_kata[idart]) : 0,
                mmse14_aart = mmse.mmse14_a ? parseInt(mmse.mmse14_a[idart]) : 0,
                mmse15_aart = mmse.mmse15_a ? parseInt(mmse.mmse15_a[idart]) : 0,
                mmse16_aart = mmse.mmse16_a ? parseInt(mmse.mmse16_a[idart]) : 0,
                mmse17_aart = mmse.mmse17_a ? parseInt(mmse.mmse17_a[idart]) : 0,
                mmse18_aart = mmse.mmse18_a ? parseInt(mmse.mmse18_a[idart]) : 0,
                mmse14_kart = mmse.mmse14_k ? parseInt(mmse.mmse14_k[idart]) : 0,
                mmse15_kart = mmse.mmse15_k ? parseInt(mmse.mmse15_k[idart]) : 0,
                mmse16_kart = mmse.mmse16_k ? parseInt(mmse.mmse16_k[idart]) : 0,
                mmse17_kart = mmse.mmse17_k ? parseInt(mmse.mmse17_k[idart]) : 0,
                mmse18_kart = mmse.mmse18_k ? parseInt(mmse.mmse18_k[idart]) : 0,
                mmse19art = mmse.mmse19 ? parseInt(mmse.mmse19[idart]) : 0,
                mmse20art = mmse.mmse20 ? parseInt(mmse.mmse20[idart]) : 0,
                mmse21art = mmse.mmse21 ? parseInt(mmse.mmse21[idart]) : 0,
                mmse22art = mmse.mmse22 ? parseInt(mmse.mmse22[idart]) : 0,
                mmse23art = mmse.mmse23 ? parseInt(mmse.mmse23[idart]) : 0,
                mmse24art = mmse.mmse24 ? parseInt(mmse.mmse24[idart]) : 0,
                mmse25art = mmse.mmse25 ? parseInt(mmse.mmse25[idart]) : 0,
                mmse26art = mmse.mmse26 ? parseInt(mmse.mmse26[idart]) : 0,
                mmse27art = mmse.mmse27 ? parseInt(mmse.mmse27[idart]) : 0,
                mmse28art = mmse.mmse28 ? parseInt(mmse.mmse28[idart]) : 0,
                mmse29art = mmse.mmse29 ? parseInt(mmse.mmse29[idart]) : 0,
                mmse30art = mmse.mmse30 ? parseInt(mmse.mmse30[idart]) : 0,
                mmse_totalart = mmse.mmse_total ? parseInt(mmse.mmse_total[idart]) : 0,
                allow = (!isNaN(mmse1art) && mmse.mmse1) &&
                        (!isNaN(mmse2art) && mmse.mmse2) &&
                        (!isNaN(mmse3art) && mmse.mmse3) &&
                        (!isNaN(mmse4art) && mmse.mmse4) &&
                        (!isNaN(mmse5art) && mmse.mmse5) &&
                        (!isNaN(mmse6art) && mmse.mmse6) &&
                        (!isNaN(mmse7art) && mmse.mmse7) &&
                        (!isNaN(mmse8art) && mmse.mmse8) &&
                        (!isNaN(mmse9art) && mmse.mmse9) &&
                        (!isNaN(mmse10art) && mmse.mmse10) &&
                        (!isNaN(mmse11art) && mmse.mmse11) &&
                        (!isNaN(mmse12art) && mmse.mmse12) &&
                        (!isNaN(mmse13art) && mmse.mmse13) &&
                        (!isNaN(pengulanganart) && mmse.pengulangan) &&
                        (!isNaN(mmse_angka_kataart) && mmse.mmse_angka_kata) &&
                        (!isNaN(mmse14_aart) && mmse.mmse14_a) &&
                        (!isNaN(mmse15_aart) && mmse.mmse15_a) &&
                        (!isNaN(mmse16_aart) && mmse.mmse16_a) &&
                        (!isNaN(mmse17_aart) && mmse.mmse17_a) &&
                        (!isNaN(mmse18_aart) && mmse.mmse18_a) &&
                        (!isNaN(mmse14_kart) && mmse.mmse14_k) &&
                        (!isNaN(mmse15_kart) && mmse.mmse15_k) &&
                        (!isNaN(mmse16_kart) && mmse.mmse16_k) &&
                        (!isNaN(mmse17_kart) && mmse.mmse17_k) &&
                        (!isNaN(mmse18_kart) && mmse.mmse18_k) &&
                        (!isNaN(mmse19art) && mmse.mmse19) &&
                        (!isNaN(mmse20art) && mmse.mmse20) &&
                        (!isNaN(mmse21art) && mmse.mmse21) &&
                        (!isNaN(mmse22art) && mmse.mmse22) &&
                        (!isNaN(mmse23art) && mmse.mmse23) &&
                        (!isNaN(mmse24art) && mmse.mmse24) &&
                        (!isNaN(mmse25art) && mmse.mmse25) &&
                        (!isNaN(mmse26art) && mmse.mmse26) &&
                        (!isNaN(mmse27art) && mmse.mmse27) &&
                        (!isNaN(mmse28art) && mmse.mmse28) &&
                        (!isNaN(mmse29art) && mmse.mmse29) &&
                        (!isNaN(mmse30art) && mmse.mmse30)                     
                        ;
                mmse.mmse_angka_kata = mmse.mmse_angka_kata ? mmse.mmse_angka_kata : {};
                mmse.mmse14_k = mmse.mmse14_k ? mmse.mmse14_k : {}; mmse.mmse14_a = mmse.mmse14_a ? mmse.mmse14_a : {};
                mmse.mmse15_k = mmse.mmse15_k ? mmse.mmse15_k : {}; mmse.mmse15_a = mmse.mmse15_a ? mmse.mmse15_a : {};
                mmse.mmse16_k = mmse.mmse16_k ? mmse.mmse16_k : {}; mmse.mmse16_a = mmse.mmse16_a ? mmse.mmse16_a : {};
                mmse.mmse17_k = mmse.mmse17_k ? mmse.mmse17_k : {}; mmse.mmse17_a = mmse.mmse17_a ? mmse.mmse17_a : {};
                mmse.mmse18_k = mmse.mmse18_k ? mmse.mmse18_k : {}; mmse.mmse18_a = mmse.mmse18_a ? mmse.mmse18_a : {};
                if (mmse.mmse_angka_kata[idart] == 1) {mmse.mmse14_k[idart] = 0, mmse.mmse15_k[idart] = 0, mmse.mmse16_k[idart] = 0, mmse.mmse17_k[idart] = 0, mmse.mmse18_k[idart] = 0;}
                if (mmse.mmse_angka_kata[idart] == 2) {mmse.mmse14_a[idart] = 0, mmse.mmse15_a[idart] = 0, mmse.mmse16_a[idart] = 0, mmse.mmse17_a[idart] = 0, mmse.mmse18_a[idart] = 0;}
                // hitung total MMSE
                mmse.mmse_total = mmse.mmse_total ? mmse.mmse_total : {};
                mmse.mmse_total[idart] = mmse1art + mmse2art + mmse3art + mmse4art + mmse5art + mmse6art + mmse7art + mmse8art + mmse9art +
                            mmse10art + mmse11art + mmse12art + mmse13art + mmse14_aart + mmse15_aart + mmse16_aart +
                            mmse17_aart + mmse18_aart + mmse14_kart + mmse15_kart + mmse16_kart + mmse17_kart + mmse18_kart +
                            mmse19art + mmse20art + mmse21art + mmse22art + mmse23art + mmse24art + mmse25art + mmse26art +
                            mmse27art + mmse28art + mmse29art + mmse30art;
                //goto ADL or GDS
                $scope.gotoGDS = (mmse.mmse_total[idart] >= 10) ? 1 : 0;
                $scope.gotoADL = (mmse.mmse_total[idart] < 10) ? 1 : 0;

            return allow;
        };
        
        // Estimasi Tinggi Badan berdasarkan Tinggi Lutut
        $scope.getTbTl = function(tl,bb){
            var mna = $scope.mna,
                idart = $scope.idart,
                umur = ($scope.umur > 55) ? $scope.umur : $scope.umur_rev;
            mna.tb_tl = {};
            mna.imt_tl = {};
            // hitung Tinggi Badan berdasarkan Tinggu Lutut
            if ($scope.jk == 'L') {
                mna.tb_tl[idart] = 64.19 + (2.02*tl) - (0.04*umur);
            }else if($scope.jk == 'P'){
                mna.tb_tl[idart] = 84.88 + (1.83*tl) - (0.24*umur);
            }
            // hitung IMT berdasarkan Tinggu Lutut
            if (mna.tb_tl[idart] && bb) {
                mna.imt_tl[idart] = bb / ((mna.tb_tl[idart] * 0.01)*(mna.tb_tl[idart] * 0.01)); // perbaikan mnt T Lutut
            }
            
        };

        $scope.get_imt_tb_sebenarnya = function(tb_sebenarnya, bb){
            var mna = $scope.mna,
                idart = $scope.idart;
                mna.imt_tb_sebenarnya = {};
            if (tb_sebenarnya && bb) {
                mna.imt_tb_sebenarnya[idart] = bb / ((tb_sebenarnya * 0.01)*(tb_sebenarnya * 0.01)); //perbaikan mnt T sebenarnya
            }
        }

        $scope.allowSaveMna = function() {
            var mna = $scope.mna,
                idart = $scope.idart;
                mna.mna_total_skrining = mna.mna_total_skrining ? mna.mna_total_skrining : {};
                mna.mna_total_penilaian = mna.mna_total_penilaian ? mna.mna_total_penilaian : {};
                mna.mna_total = mna.mna_total ? mna.mna_total : {};
                mna.mna5 = mna.mna5 ? mna.mna5 : {};
                mna.mna6 = mna.mna6 ? mna.mna6 : {};
                mna.mna17 = mna.mna17 ? mna.mna17 : {};
                mna.mna18 = mna.mna18 ? mna.mna18 : {};
                mna.imt_tl = mna.imt_tl ? mna.imt_tl : {};
                mna.ll = mna.ll ? mna.ll : {};
                mna.lb = mna.lb ? mna.lb : {};
                //jawaban mna5 berdasarkan total MMSE dan/atau GDS
                if ( $scope.mmse.mmse_total[idart] || $scope.gds.gds_total[idart] ) {
                    if ($scope.mmse.mmse_total[idart] < 10 || ($scope.gds.gds_total[idart] >= 12 &&  $scope.gds.gds_total[idart] <= 15) ) {
                        mna.mna5[idart] = '0';
                    }else if($scope.mmse.mmse_total[idart] >= 10 && $scope.mmse.mmse_total[idart] <= 18){
                        mna.mna5[idart] = '1';
                    }else if($scope.mmse.mmse_total[idart] > 18){
                        mna.mna5[idart] = '2';
                    }
                }
                //jawaban mna6 berdasarkan IMT tinggi lutut
                if ($scope.mna.imt_tl[idart]) {
                    if ($scope.mna.imt_tl[idart] < 19) {
                        mna.mna6[idart] = '0';
                    }else if ($scope.mna.imt_tl[idart] >= 19 && $scope.mna.imt_tl[idart] < 21) {
                        mna.mna6[idart] = '1';
                    }else if ($scope.mna.imt_tl[idart] >= 21 && $scope.mna.imt_tl[idart] < 23) {
                        mna.mna6[idart] = '2';
                    }else if ($scope.mna.imt_tl[idart] >= 23){
                        mna.mna6[idart] = '3';
                    }
                }
                //jawaban mna17 berdasarkan lingkar lengan responden
                if ($scope.mna.ll[idart]) {
                    if ($scope.mna.ll[idart] < 21) { 
                        mna.mna17[idart] =  '0';
                    }else if ($scope.mna.ll[idart] >= 21 && $scope.mna.ll[idart] <= 22) {
                        mna.mna17[idart] =  '0.5';
                    }else if ($scope.mna.ll[idart] > 22) {
                        mna.mna17[idart] =  '1';
                    } 
                }
                //jawaban mna18 berdasarkan lingkar betis
                if ($scope.mna.lb[idart]) {
                    if ($scope.mna.lb[idart] < 31) {
                        mna.mna18[idart] = '0';
                    }else if ($scope.mna.lb[idart] >= 31){
                        mna.mna18[idart] = '2';
                    }
                }
                
            var bbart = mna.bb ? parseInt(mna.bb[idart]) : 0,
                tlart = mna.tl ? parseInt(mna.tl[idart]) : 0,
                tb_tlart = mna.tb_tl ? parseInt(mna.tb_tl[idart]) : 0,
                imt_tlart = mna.imt_tl ? parseInt(mna.imt_tl[idart]) : 0,
                tb_sebenarnyaart = mna.tb_sebenarnya ? parseInt(mna.tb_sebenarnya[idart]) : 0,
                imt_tb_sebenarnyaart = mna.imt_tb_sebenarnya ? parseInt(mna.imt_tb_sebenarnya[idart]) : 0,
                llart = mna.ll ? parseInt(mna.ll[idart]) : 0,
                lbart = mna.lb ? parseInt(mna.lb[idart]) : 0,
                mna1art = mna.mna1 ? parseInt(mna.mna1[idart]) : 0,
                mna2art = mna.mna2 ? parseInt(mna.mna2[idart]) : 0,
                mna3art = mna.mna3 ? parseInt(mna.mna3[idart]) : 0,
                mna4art = mna.mna4 ? parseInt(mna.mna4[idart]) : 0,
                mna5art = mna.mna5 ? parseInt(mna.mna5[idart]) : 0,
                mna6art = mna.mna6 ? parseInt(mna.mna6[idart]) : 0,
                allow = ( !isNaN(bbart) && mna.bb && mna.bb[idart]) &&
                        ( !isNaN(tlart) && mna.tl && mna.tl[idart]) &&
                        ( !isNaN(tb_tlart) && mna.tb_tl && mna.tb_tl[idart]) &&
                        ( !isNaN(imt_tlart) && mna.imt_tl && mna.imt_tl[idart]) &&
                        ( !isNaN(tb_sebenarnyaart) && mna.tb_sebenarnya && mna.tb_sebenarnya[idart]) &&
                        ( !isNaN(imt_tb_sebenarnyaart) && mna.imt_tb_sebenarnya && mna.imt_tb_sebenarnya[idart]) &&
                        ( !isNaN(llart) && mna.ll && mna.ll[idart]) &&
                        ( !isNaN(lbart) && mna.lb && mna.lb[idart]) &&
                        ( !isNaN(mna1art) && mna.mna1 && mna.mna1[idart]) &&
                        ( !isNaN(mna2art) && mna.mna2 && mna.mna2[idart]) &&
                        ( !isNaN(mna3art) && mna.mna3 && mna.mna3[idart]) &&
                        ( !isNaN(mna4art) && mna.mna4 && mna.mna4[idart]) &&
                        ( !isNaN(mna5art) && mna.mna5 && mna.mna5[idart]) &&
                        ( !isNaN(mna6art) && mna.mna6 && mna.mna6[idart])
                        ;
                        //total skrining
                        mna.mna_total_skrining[idart] = mna1art + mna2art + mna3art + mna4art + mna5art + mna6art;
                        $scope.malnutrisi = (mna.mna_total_skrining[idart] <= 11) ? true : false;
                        // if ($scope.malnutrisi == false) {
                        //     allow = allow;
                        // }
                        if ($scope.malnutrisi) {
                            var mna7art = mna.mna7 ? parseInt(mna.mna7[idart]) : 0,
                                mna8art = mna.mna8 ? parseInt(mna.mna8[idart]) : 0,
                                mna9art = mna.mna9 ? parseInt(mna.mna9[idart]) : 0,
                                mna10art = mna.mna10 ? parseInt(mna.mna10[idart]) : 0,
                                mna11aart = mna.mna11a ? parseInt(mna.mna11a[idart]) : 0,
                                mna11bart = mna.mna11b ? parseInt(mna.mna11b[idart]) : 0,
                                mna11cart = mna.mna11c ? parseInt(mna.mna11c[idart]) : 0,
                                mna12art = mna.mna12 ? parseInt(mna.mna12[idart]) : 0,
                                mna13art = mna.mna13 ? parseInt(mna.mna13[idart]) : 0,
                                mna14art = mna.mna14 ? parseInt(mna.mna14[idart]) : 0,
                                mna15art = mna.mna15 ? parseInt(mna.mna15[idart]) : 0,
                                mna16art = mna.mna16 ? parseInt(mna.mna16[idart]) : 0,
                                mna17art = mna.mna17 ? parseInt(mna.mna17[idart]) : 0,
                                mna18art = mna.mna18 ? parseInt(mna.mna18[idart]) : 0;

                            allow = (!isNaN(mna7art) && mna.mna7 && mna.mna7[idart]) &&
                                    (!isNaN(mna8art) && mna.mna8 && mna.mna8[idart]) &&
                                    (!isNaN(mna9art) && mna.mna9 && mna.mna9[idart]) &&
                                    (!isNaN(mna10art) && mna.mna10 && mna.mna10[idart]) &&
                                    (!isNaN(mna11aart) && mna.mna11a && mna.mna11a[idart]) &&
                                    (!isNaN(mna11bart) && mna.mna11b && mna.mna11b[idart]) &&
                                    (!isNaN(mna11cart) && mna.mna11c && mna.mna11c[idart]) &&
                                    (!isNaN(mna12art) && mna.mna12 && mna.mna12[idart]) &&
                                    (!isNaN(mna13art) && mna.mna13 && mna.mna13[idart]) &&
                                    (!isNaN(mna14art) && mna.mna14 && mna.mna14[idart]) &&
                                    (!isNaN(mna15art) && mna.mna15 && mna.mna15[idart]) &&
                                    (!isNaN(mna16art) && mna.mna16 && mna.mna16[idart]) &&
                                    (!isNaN(mna17art) && mna.mna17 && mna.mna17[idart]) &&
                                    (!isNaN(mna18art) && mna.mna18 && mna.mna18[idart]);
                            // otomatis variabe mna11 
                            var k = (mna11aart+mna11bart+mna11cart == 1) ? "0.0" : (
                                                 (mna11aart+mna11bart+mna11cart == 2) ? "0.5" : 
                                                    ( (mna11aart+mna11bart+mna11cart == 3) ? "1" : "0.0") 
                                                );
                            mna.mna11 = mna.mna11 ? mna.mna11 : {};
                            
                            mna.mna11[idart] = parseInt(k);
                            if ( mna.mna11[idart] >= 0 ){ // total penilaian
                                mna.mna_total_penilaian[idart] = mna7art + mna8art + mna9art + mna10art + mna.mna11[idart] + mna12art +
                                                             mna13art + mna14art + mna15art + mna16art + mna17art + mna18art;
                            }
                        }
                    
                    //total skrining + penilaian
                    if (mna.mna_total_skrining[idart] >= 0 && ($scope.malnutrisi && mna.mna_total_penilaian[idart] >= 0)) {
                        mna.mna_total[idart] = mna.mna_total_skrining[idart] + mna.mna_total_penilaian[idart];
                    }else if(mna.mna_total_skrining[idart] >= 0){
                        mna.mna_total[idart] = mna.mna_total_skrining[idart];
                    }
                    $scope.gotoGDS = ($scope.mmse.mmse_total[idart] >= 10) ? 1 : 0;
                    $scope.gotoADL = ($scope.mmse.mmse_total[idart] < 10) ? 1 : 0;
            return allow;
        };

        $scope.allowSaveCsdd = function() {
            var csdd = $scope.csdd,
                idart = $scope.idart,
                allow = (csdd.csdda1 && csdd.csdda1[idart]) &&
                        (csdd.csdda2 && csdd.csdda2[idart]) &&
                        (csdd.csdda3 && csdd.csdda3[idart]) &&
                        (csdd.csdda4 && csdd.csdda4[idart]) &&
                        (csdd.csddb1 && csdd.csddb1[idart]) &&
                        (csdd.csddb2 && csdd.csddb2[idart]) &&
                        (csdd.csddb3 && csdd.csddb3[idart]) &&
                        (csdd.csddb4 && csdd.csddb4[idart]) &&
                        (csdd.csddc1 && csdd.csddc1[idart]) &&
                        (csdd.csddc2 && csdd.csddc2[idart]) &&
                        (csdd.csddc3 && csdd.csddc3[idart]) &&
                        (csdd.csddd1 && csdd.csddd1[idart]) &&
                        (csdd.csddd2 && csdd.csddd2[idart]) &&
                        (csdd.csddd3 && csdd.csddd3[idart]) &&
                        (csdd.csddd4 && csdd.csddd4[idart]) &&
                        (csdd.csdde1 && csdd.csdde1[idart]) &&
                        (csdd.csdde2 && csdd.csdde2[idart]) &&
                        (csdd.csdde3 && csdd.csdde3[idart]) &&
                        (csdd.csdde4 && csdd.csdde4[idart])
                        ;
            return allow;
        };

        $scope.selesai = function() {
            $rootScope.$broadcast('loading:show');
            $timeout(function() {
                $rootScope.$broadcast('loading:hide');
                $state.go('app.art');
            }, 500);
        };
        $ionicModal.fromTemplateUrl('templates/adl-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function(art) {
            initModal();
            $scope.nama = art._nama;
            $scope.umur = (art.umur > 55 ) ? art.umur : art.umur_th_rev;
            $scope.idart = art.idart;
            $scope.jk = art._jk;

            // default value
            $scope.ir.nama_ir=$scope.ir.nama_ir||{}, $scope.ir.tgllahir_ir=$scope.ir.tgllahir_ir||{}, 
            $scope.ir.usia_ir=$scope.ir.usia_ir||{}, $scope.ir.alamat_ir=$scope.ir.alamat_ir||{}, 
            $scope.ir.telp_ir=$scope.ir.telp_ir||{}, $scope.ir.jk_ir=$scope.ir.jk_ir||{}, 
            $scope.ir.statusmarital_ir=$scope.ir.statusmarital_ir||{}, $scope.ir.pendidikan_ir=$scope.ir.pendidikan_ir||{},
            $scope.ir.suku_ir=$scope.ir.suku_ir||{}, $scope.ir.pekerjaan_ir=$scope.ir.pekerjaan_ir||{}, $scope.ir.pekerjaan_lainnya_ir=$scope.ir.pekerjaan_lainnya_ir||{};

            $scope.ir.nama_ir[$scope.idart] = $scope.ir.nama_ir[$scope.idart] || $scope.nama;
            $scope.ir.tgllahir_ir[$scope.idart] = $scope.ir.tgllahir_ir[$scope.idart] ? new Date($scope.ir.tgllahir_ir[$scope.idart]) : new Date(art._tglLahir);
            $scope.ir.usia_ir[$scope.idart] = $scope.ir.usia_ir[$scope.idart] || $scope.umur;
            $scope.ir.alamat_ir[$scope.idart] = $scope.ir.alamat_ir[$scope.idart] || $rootScope.dataRT.kl08;
            $scope.ir.telp_ir[$scope.idart] = $scope.ir.telp_ir[$scope.idart] || $rootScope.dataRT.krt03;
            $scope.ir.jk_ir[$scope.idart] = $scope.ir.jk_ir[$scope.idart] || ''+art.art04;
            $scope.ir.statusmarital_ir[$scope.idart] = $scope.ir.statusmarital_ir[$scope.idart] || ''+art.art02;
            $scope.ir.suku_ir[$scope.idart] = $scope.ir.suku_ir[$scope.idart] || ''+art.art14;
            $scope.ir.pendidikan_ir[$scope.idart] = $scope.ir.pendidikan_ir[$scope.idart] || ''+art.art16;
            $scope.ir.pekerjaan_ir[$scope.idart] = $scope.ir.pekerjaan_ir[$scope.idart] || ''+art.art18;
            $scope.modal.show();
        };

        //Contoh pengambilan data (nama bisa diganti dengan id yg unik)
        $scope.saveModal = function(obj, hide) {
            AppService.saveDataKelMasked(obj, $scope[obj], true, 'app.adl').then(function() {
                modalSaved = true;
                lastMna = angular.copy($scope.mna);
                lastCsdd = angular.copy($scope.csdd);
                lastCsdd = angular.copy($scope.ir);
                if (hide) {
                    $scope.modal.hide();
                }
            });
        };

    }
})();
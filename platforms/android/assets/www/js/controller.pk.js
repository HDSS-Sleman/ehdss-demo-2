(function() {
    angular.module('ehdss')
        .controller('PkCtrl', PkCtrl);

    PkCtrl.$inject = ['$scope', '$rootScope', '$state', '$ionicModal', '$window', '$ionicLoading', '$timeout', 'AppService', '$ionicPopup'];

    function PkCtrl($scope, $rootScope, $state, $ionicModal, $window, $ionicLoading, $timeout, AppService, $ionicPopup) {

        $scope.pk = $rootScope.dataRT.pk || {};     
        $scope.idrt = $rootScope.dataRT.idrt || {}; 
        // reset dulu ke empty object
        // $scope.pk = {};
        AppService.getDataART().then(function(data) {

            data.forEach(function(val,idx){
                // cek apakah ada umur dalam tahun/bulan
                if (val.artb06a || val.artb06b) {
                    data[idx].umur_dlm_tahun = val.artb06a;
                    data[idx].umur_dlm_bulan = val.artb06b;  
                }else if(val._tglLahir){ // jika ada tgl lahir 
                    var umur = AppService.getAgeDetail(val._tglLahir);
                    var umurArr = umur.split('/');
                    data[idx].umur_dlm_tahun = parseInt(umurArr[0]);
                    data[idx].umur_dlm_bulan = parseInt(umurArr[1]);
                }
                console.log('tgl lahir '+data[idx]._tglLahir);
                console.log('umur dalam tahun '+data[idx].umur_dlm_tahun+' - umur dalam bulan '+data[idx].umur_dlm_bulan);
            });

             $rootScope.dataARTpk = $scope.dataART = data.filter(function(item,idx) {
                return !item.artTdkAda && 
                        ((item.umur_dlm_tahun >= 0 && item.umur_dlm_tahun < 13) || (item.umur_dlm_tahun == 0 && item.umur_dlm_bulan >= 2));
            });

        });
        $scope.dermatitis = true;

        // apakah form di modal di save ?
        var modalSaved = false;
        // simpan variabel terakhir yg tersimpan
        var lastPk = angular.copy($scope.pk);

        $scope.go = function(toMenu, curMenu) {
            $scope.save().then(function() {
                $scope[toMenu] = true;
                $scope[curMenu] = false;
                lastPk = angular.copy($scope.pk);
            });
        };

        // Display/Tidak Tombol selanjutnya (malaria)
        $scope.dermatitisAllowSave = function() {
            var pk = $scope.pk,
                // pm01 dan pm02 harus terisi
                pk01 = pk.pk01, pk01z = false;

            if (pk.pk01 == '1') {
                $scope.dataART.forEach(function(d) {
                    // harus diisi semua agar true
                    pk01 = pk01 && pk.pk01ls && pk.pk01ls[d.idart];
                });
                // harus ada salah satu yg nilainya = 1
                $scope.dataART.forEach(function(d) {
                    pk01z = pk01z || (pk.pk01ls && pk.pk01ls[d.idart] == 1);
                });
                pk01 = pk01 && pk01z;
            }

            return pk01;
        };

        // $scope.modalAllowSave = function() {
        //     var pm = $scope.pm,
        //         allow = false;
        //     var idart = $scope.idart;

        //     if ($scope.malaria) {
        //         var pm05 = pm.pm05 && parseInt(pm.pm05[idart]);
        //         allow = !!(pm.pm07 && pm.pm07[idart]);
        //         if (pm05 === 1) {
        //             // ..
        //         } else if (pm05 === 2 || pm05 === 98) {
        //             allow = true;
        //         }
        //     } else {
        //         allow = true;
        //     }

        //     return allow;
        // };

        /* set lv ART kosong, jika lv RT tidak sakit */
        $scope.setTidakSakit = function(param, val1){
            if (val1 == 2 || val1 == 98) {
                $rootScope.dataARTpk.forEach(function(val2){
                    if (param == 'pk01') { 
                        if ($scope.pk.pk01ls[val2.idart]) { delete $scope.pk.pk01ls[val2.idart]; } 
                    }
                });
            }
            
        }


        // Execute action on hide modal
        // $scope.$on('modal.hidden', function() {
        //     // stop interval
        //     clearInterval($scope.timerEditPm10);
        //     $scope.countDownEditPm10 = 0;

        //     if (!modalSaved) {
        //         $scope.pm = angular.copy(lastPm);
        //     }
        // });

        //controller modal di PM03
        // $ionicModal.fromTemplateUrl('templates/pm-modal.html', {
        //     scope: $scope,
        //     animation: 'slide-in-up'
        // }).then(function(modal) {
        //     $scope.modal = modal;
        // });

        // $scope.openModal = function(open, art) {
        //     /* set default value pm */
        //     if (!$scope.pm.pm) {
        //         $scope.pm.pm = {};
        //     }      
        //     if (open == 1 || open == 2) {
        //         $scope.pm.pm[art.idart] = 1;
        //     }else{
        //         if ($scope.pm.pm[art.idart] == 1) {
        //             $scope.pm.pm[art.idart] = 1;
        //         }else{
        //             $scope.pm.pm[art.idart] = 0;
        //         }
        //     }

        //     // tutup modal dari tuberkolusis
        //     $scope.tuberkolusisModal1 = false;
        //     $scope.tuberkolusisModal2 = false;

        //     $scope.nama = art._nama;
        //     $scope.umur = art.umur;
        //     $scope.jk = art._jk;
        //     $scope.idart = art.idart;
        //     $scope.pernahhamil = art._jk === 'P';
        //     if (open == 1 || open == 2) {
        //         modalSaved = false;
        //         $scope.modal.show();
        //     }
        // };

        $scope.defpk = function(val,idart){
            /* set default value pk */
            if (!$scope.pk.pk) {
                $scope.pk.pk = {};
            }
            if (val == 1) {
                $scope.pk.pk[idart] = 1;
            }else{
                if ($scope.pk.pk[idart] == 1) {
                    $scope.pk.pk[idart] = 1;
                }else{
                    $scope.pk.pk[idart] = 0;
                }
            }
            
        };        

        $scope.save = function(finish) {
            // AppService.saveCatatanKelompok('utama',$scope.idrt);
            if (finish == 'ktlp') {
                $rootScope.tab_konfirmasi = false;
                $rootScope.tab_laporan = true;
                $rootScope.tab_reward = false;
                $state.go('app.ktlp');
            }else{
                var goTo = finish ? 'app.art' : '';

                // simpan model, termasuk yg hidden dg ng-show, exclude hidden dg ng-if
                return AppService.saveDataKelMasked('pk', $scope.pk, true, goTo);
            }
                
        };

        //Contoh pengambilan data (nama bisa diganti dengan id yg unik)
        $scope.saveModal = function(pk, nama) {
            // simpan model, termasuk yg hidden dg ng-show, exclude hidden dg ng-if
            // AppService.saveCatatanKelompok('utama',$scope.idrt);
            AppService.saveDataKelMasked('pk', $scope.pk, true, 'app.pk').then(function() {
                modalSaved = true;
                lastPk = angular.copy($scope.pk);
                $scope.modal.hide();
            });
            

        };
    }
})();

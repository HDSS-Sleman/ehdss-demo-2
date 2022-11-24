(function() {
    angular.module('ehdss')
        .controller('PhCtrl', PhCtrl);

    PhCtrl.$inject = ['$scope', '$rootScope', '$state', '$ionicModal', '$window', '$ionicLoading', '$timeout', 'AppService', '$ionicPopup'];

    function PhCtrl($scope, $rootScope, $state, $ionicModal, $window, $ionicLoading, $timeout, AppService, $ionicPopup) {

        $scope.ph = $rootScope.dataRT.ph || {};
        $scope.idrt = $rootScope.dataRT.idrt || {};

        // reset dulu ke empty object
        // $scope.ph = {};
        AppService.getDataART().then(function(data) {
            $scope.dataART = data.filter(function(item) {
                var umur = parseInt(item.umur);
                var umur_th_rev = parseInt(item.umur_th_rev)
                if (umur >= 0) {
                    return !item.artTdkAda && (umur < 5);
                }else if (umur_th_rev >= 0) {
                    return !item.artTdkAda && (umur < 5);
                }
                
            });
            $scope.jumART = $scope.dataART.length;
        });
        /* set value default modul*/
        $scope.Ph01 = true;
        $scope.Ph02 = true;
        $scope.Ph03 = true;
        /* set value default modal*/
        $scope.tipeModal = {
            modalPh01: false,
            modalPh02: false,
            modalPh03: false
        };

        // apakah form di modal di save ?
        var modalSaved = false;
        // simpan variabel terakhir yg tersimpan
        var lastPh = angular.copy($scope.ph);

        $scope.go = function(toMenu, curMenu) {
            $scope.save().then(function() {
                $scope[toMenu] = true;
                $scope[curMenu] = false;
                lastPh = angular.copy($scope.ph);
            });
        };

        // Display/Tidak Tombol selanjutnya
        $scope.PhAllowSave = function() {
            var ph = $scope.ph,
                // ph01 dan ph02 harus terisi
                ph01 = ph.ph01, ph01z = false,
                ph02 = ph.ph02, ph02z = false;
                ph03 = ph.ph03, ph03z = false;

            if (ph.ph01 == 2 || ph.ph01 == 98) {
                return true
            }
            if (ph.ph01 == '1') {
                $scope.dataART.forEach(function(d) {
                    // harus diisi semua agar true
                    ph01 = ph01 && ph.ph01ls && ph.ph01ls[d.idart];
                });
                // harus ada salah satu yg nilainya = 1
                $scope.dataART.forEach(function(d) {
                    ph01z = ph01z || (ph.ph01ls && ph.ph01ls[d.idart] == 1);
                });
                ph01 = ph01 && ph01z;
            }
            if (ph.ph02 == '1') {
                $scope.dataART.forEach(function(d) {
                    // jika ada salah satu yang terisi/checked, set true
                    ph02 = ph02 && ph.ph02ls && ph.ph02ls[d.idart];
                });
                // harus ada salah satu yg nilainya = 1
                $scope.dataART.forEach(function(d) {
                    ph02z = ph02z || (ph.ph02ls && ph.ph02ls[d.idart] == 1);
                });
                ph02 = ph02 && ph02z;
            }

            if (ph.ph03 == '1') {
                $scope.dataART.forEach(function(d) {
                    // jika ada salah satu yang terisi/checked, set true
                    ph03 = ph03 && ph.ph03ls && ph.ph03ls[d.idart];
                });
                // harus ada salah satu yg nilainya = 1
                $scope.dataART.forEach(function(d) {
                    ph03z = ph03z || (ph.ph03ls && ph.ph03ls[d.idart] == 1);
                });
                ph03 = ph03 && ph03z;
            }

            
            return ph01 && ph02 && ph03;
            
        };

        $scope.modalAllowSave = function() {
            var ph = $scope.ph,
                allow = true;
            var idart = $scope.idart;

            if ($scope.tipeModal.modalPh01a == true) {
                var ph01a = ph.ph01a && parseInt(ph.ph01a[idart]);
                allow = allow && ph01a;
            }else if ($scope.tipeModal.modalPh02a == true) {
                var ph02a = ph.ph02a && parseInt(ph.ph02a[idart]);
                allow = allow && ph02a;
            }else if ($scope.tipeModal.modalPh03a == true) {
                var ph03a = ph.ph03a && parseInt(ph.ph03a[idart]),
                    ph04 = ph.ph04 && parseInt(ph.ph04[idart]);
                allow = allow && ph03a && (ph04 >= 0);
            }else{
                allow = true;
            }

            return allow;
        };

        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
            if (!modalSaved) {
                $scope.ph = angular.copy(lastPh);
            }
        });

        //controller modal
        $ionicModal.fromTemplateUrl('templates/ph-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });

        $scope.openModal = function(open, art, tipe) {
            /* set default value ph */
            if (!$scope.ph.ph) {
                $scope.ph.ph = {};
            }      
            if (open == 1) {
                $scope.ph.ph[art.idart] = 1;
            }else{
                if ($scope.ph.ph[art.idart] == 1) {
                    $scope.ph.ph[art.idart] = 1;
                }else{
                    $scope.ph.ph[art.idart] = 0;
                }
            }

            // tutup modal selain modal yg dibuka
            for (var key in $scope.tipeModal) {
                if (key == tipe) {
                    $scope.tipeModal[key] = true;
                }else{
                    $scope.tipeModal[key] = false;
                }
            }
            $scope.nama = art._nama;
            $scope.umur = art.umur;
            $scope.jk = art._jk;
            $scope.idart = art.idart;
            if (open == 1) {
                modalSaved = false;
                $scope.modal.show();
            }
        };

        $scope.defph = function(val,idart){
            /* set default value ph */
            if (!$scope.ph.ph) {
                $scope.ph.ph = {};
            }      
            if (open == 1) {
                $scope.ph.ph[idart] = 1;
            }else{
                if ($scope.ph.ph[idart] == 1) {
                    $scope.ph.ph[idart] = 1;
                }else{
                    $scope.ph.ph[idart] = 0;
                }
            }
        };

        $scope.save = function(finish) {
            // AppService.saveCatatanKelompok('balita',$scope.idrt);
            var goTo = finish ? 'app.art' : '';

            // simpan model, termasuk yg hidden dg ng-show, exclude hidden dg ng-if
            return AppService.saveDataKelMasked('ph', $scope.ph, true, goTo);
        };

        //Contoh pengambilan data (nama bisa diganti dengan id yg unik)
        $scope.saveModal = function(ph, nama) {
            // simpan model, termasuk yg hidden dg ng-show, exclude hidden dg ng-if
            AppService.saveDataKelMasked('ph', $scope.ph, true, 'app.ph').then(function() {
                modalSaved = true;
                lastPh = angular.copy($scope.ph);
                $scope.modal.hide();
            });

        };
        $scope.go = function(module) {
            $rootScope.$broadcast('loading:show');
            $timeout(function() {
                $state.go('app.' + module);
                $rootScope.$broadcast('loading:hide');
            }, 100);
        };
    }
})();

(function() {
    angular.module('ehdss')
        .controller('IcfCtrl', IcfCtrl);

    IcfCtrl.$inject = ['$scope', '$state', '$rootScope', '$timeout', 'AppService', '$ionicPopup', '$http'];

    function IcfCtrl($scope, $state, $rootScope, $timeout, AppService, $ionicPopup, $http) {
        
        AppService.getDataART().then(function(data) {
            $scope.dataART = data.filter(function(item) {
                return !item.artTdkAda;
            });

            $scope.icf = $rootScope.dataRT.icf || {};

            // ambil catatan enum di localforage
            AppService.getCatatanEnum($rootScope.dataRT.idrt).then(function(data_cke) {
                $scope.cke = data_cke || {};
                if ($scope.cke.status_final_cke_m1 == 'menolak menjadi responden') {
                    $scope.icf.icf01 = '2';
                }

            });


            
        });

            

        AppService.getTglWawancaraPlusSatu(true).then(function(val) {
            $scope.tglWawancara = val;
        });

        $scope.IcfAllowSave = function(myForm) {

                var icf = $scope.icf;
                if (icf) {
                    allow = icf.icf01;
                            if (icf.icf01 == 1) { // jika bersedia
                                allow = allow && icf.icf01a && icf.icf01b && icf.icf01c &&
                                        icf.icf01d && icf.icf01e && icf.icf01f;
                            }
                            if (icf.icf01 == 2) { // jika tidak bersedia
                                allow = allow && icf.icf02a;
                            }
                    return allow && myForm.$valid;
                }
            
        };

        // Save
        $scope.save = function(finish) {
            $rootScope.tab_catatan = false; // catatan di hide
            $rootScope.tab_cover = true; // tab cover buka

            if ($scope.icf.icf01 == 2) { // jika ICF gagal
                    var goTo = finish ? 'app.home' : '';    
            }else if ($rootScope.dataRT.rRefresh == '1' || $rootScope.dataRT.rPecah == '1') { // jika ruta pecah/refresh langgsung ke ART
                var goTo = finish ? 'app.art' : '';    
            }else{
                var goTo = finish ? 'app.art_cover' : '';  
            }
                
            
            // simpan model, termasuk yg hidden dg ng-show, exclude hidden dg ng-if
            return AppService.saveDataKelMasked('icf', $scope.icf, true, goTo);
        };

    }
})();
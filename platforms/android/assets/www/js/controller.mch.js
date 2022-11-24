(function() {
    angular.module('ehdss')
        .controller('MchCtrl', MchCtrl);

    MchCtrl.$inject = ['$scope', '$state', '$rootScope', '$timeout', 'AppService', '$ionicPopup', '$http'];

    function MchCtrl($scope, $state, $rootScope, $timeout, AppService, $ionicPopup, $http) {
        
        $scope.mch = {};
        AppService.getDataART().then(function(data) {
            $scope.dataART = data.filter(function(item) {
                return !item.artTdkAda;
            });
            $scope.mch = $rootScope.dataRT.mch || {};
            if ($scope.mch) {
                $scope.mch = AppService.deNormalisasiData($scope.mch);

                AppService.getCurentRT($rootScope.curRT.idrt).then(function(data2) {
                    $scope.rt = data2;
                    if ($scope.rt.id27 == 1) { // kabupaten 1. Sleman, 2. Solo
                        $scope.mch.mch02c1 = '3'; // jika di Sleman, tidak diberikan
                        $scope.mch.mch02j1 = '3'; // jika di Sleman, tidak diberikan
                    }
                });
            }
        });

        AppService.getTglWawancaraPlusSatu(true).then(function(val) {
            $scope.tglWawancara = val;
        });

        $scope.mch01List = {
            'a': 'a. 0-6 jam',
            'b': 'b. 6-48 jam (KN1)',
            'c': 'c. 3-7 hari (KN2)',
            'd': 'd. 8-28 hari (KN3)',
        }

        $scope.mchOptionList = {
            '0': '0. Tidak terisi',
            '1': '1. Lengkap',
            '2': '2. Tidak lengkap',
            '3': '3. Tidak tersedia di buku',
        }

        $scope.mch02List = {
            'a': 'a. Hepatitis B 0',
            'b': 'b. BCG',
            'c': 'c. OPV 1 (tidak diberikan jika di Sleman)',
            'd': 'd. DPT-HB-HIB 1',
            'e': 'e. DPT-HB-HIB 2',
            'f': 'f. DPT-HB-HIB 3',
            'g': 'g. OPV 2 / IPV 1',
            'h': 'h. OPV 3 / IPV 2',
            'i': 'i. OPV 4 / IPV 3',
            'j': 'j. IPV 1 (tidak diberikan jika di Sleman)',
        }

        $scope.mchAllowSave = function(myForm) {
            var mch = $scope.mch;
            allow = mch.mch01 && mch.mch02 &&
                    mch.mch03a && mch.mch03b && mch.mch03c && mch.mch03d && 
                    mch.mch03e && mch.mch03f && mch.mch03g
                    mch.mch04a && mch.mch04b && mch.mch04c && mch.mch04d &&
                    mch.mch05a && mch.mch05b &&
                    mch.mch06 && mch.mch07 && mch.mch08;

                if (mch.mch01 == 1) {
                    allow = allow && mch.mch01a && mch.mch01b && mch.mch01c && mch.mch01d;
                }
                if (mch.mch02 == 1) {
                    allow = allow && mch.mch02a1 && mch.mch02b1 && mch.mch02c1 && mch.mch02d1 &&
                            mch.mch02e1 && mch.mch02f1 && mch.mch02g1 && mch.mch02h1 &&
                            mch.mch02i1 && mch.mch02j1;
                }

            return allow && myForm.$valid;
        };

        // Save
        $scope.save = function(finish) {
            var goTo = finish ? 'app.art' : '';
            // simpan model, termasuk yg hidden dg ng-show, exclude hidden dg ng-if
            return AppService.saveDataKelMasked('mch', $scope.mch, true, goTo);
        };

    }
})();
(function() {
    angular.module('ehdss')
        .controller('BkiaCtrl', BkiaCtrl);

    BkiaCtrl.$inject = ['$scope', '$state', '$rootScope', '$timeout', 'AppService', '$ionicPopup', '$http'];

    function BkiaCtrl($scope, $state, $rootScope, $timeout, AppService, $ionicPopup, $http) {
        
        $scope.bkia = {};
        AppService.getDataART().then(function(data) {
            $scope.dataART = data.filter(function(item) {
                return !item.artTdkAda;
            });
            $scope.bkia = $rootScope.dataRT.bkia || {};
            if ($scope.bkia) {
                $scope.bkia = AppService.deNormalisasiData($scope.bkia);
            }
        });

        AppService.getTglWawancaraPlusSatu(true).then(function(val) {
            $scope.tglWawancara = val;
        });

        $scope.bkiaOption1 = {
            '1': 'Tidak pernah',
            '2': 'Kadang-kadang',
            '3': 'Sering',
            '4': 'Selalu'
        }

        $scope.bkiaOption2 = {
            '1': 'Tidak pernah',
            '2': 'Sebagian saja',
            '3': 'Hampir semua',
            '4': 'Semua halaman'
        }

        $scope.bkiaOption3 = {
            '1': 'Sangat setuju',
            '2': 'Setuju',
            '3': 'Tidak setuju',
            '4': 'Sangat tidak setuju'
        }

        $scope.bkiaAllowSave = function(myForm) {
            var bkia = $scope.bkia;
            allow = bkia.bkia1 && bkia.bkia2 && bkia.bkia3 && bkia.bkia4 &&
                    bkia.bkia5 && bkia.bkia6 && bkia.bkia7;

                    if (bkia.bkia1 == 2) {
                        allow = allow && bkia.bkia1a;
                    }

            return allow && myForm.$valid;
        };

        // Save
        $scope.save = function(finish) {
            var goTo = finish ? 'app.art' : '';
            // simpan model, termasuk yg hidden dg ng-show, exclude hidden dg ng-if
            return AppService.saveDataKelMasked('bkia', $scope.bkia, true, goTo);
        };

    }
})();
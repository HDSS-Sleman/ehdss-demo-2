(function() {
    angular.module('ehdss')
        .controller('IchcpCtrl', IchcpCtrl);

    IchcpCtrl.$inject = ['$scope', '$state', '$rootScope', '$timeout', 'AppService', '$ionicPopup', '$http'];

    function IchcpCtrl($scope, $state, $rootScope, $timeout, AppService, $ionicPopup, $http) {
        
        $scope.ichcp = {};
        AppService.getDataART().then(function(data) {
            $scope.dataART = data.filter(function(item) {
                return !item.artTdkAda;
            });
            $scope.ichcp = $rootScope.dataRT.ichcp || {};
            if ($scope.ichcp) {
                $scope.ichcp = AppService.deNormalisasiData($scope.ichcp);
            }
        });

        AppService.getTglWawancaraPlusSatu(true).then(function(val) {
            $scope.tglWawancara = val;
        });

        $scope.ichcpAllowSave = function(myForm) {
            var ichcp = $scope.ichcp;
            allow = true;

                    
                    if (ichcp.ichcp1 == 1) {
                        allow = allow && ichcp.ichcp1a;
                    }

                    if (ichcp.ichcp3 == 1) {
                        allow = allow && ichcp.ichcp3a;
                    }

                    if (ichcp.ichcp4 == 1) {
                        allow = allow && ichcp.ichcp4a;
                    }      

            return allow && myForm.$valid;
        };

        // Save
        $scope.save = function(finish) {
            var goTo = finish ? 'app.art' : '';
            // simpan model, termasuk yg hidden dg ng-show, exclude hidden dg ng-if
            return AppService.saveDataKelMasked('ichcp', $scope.ichcp, true, goTo);
        };

    }
})();
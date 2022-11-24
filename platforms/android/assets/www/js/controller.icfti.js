(function() {
    angular.module('ehdss')
        .controller('IcftiCtrl', IcftiCtrl);

    IcftiCtrl.$inject = ['$scope', '$state', '$rootScope', '$timeout', 'AppService'];

    function IcftiCtrl($scope, $state, $rootScope, $timeout, AppService) {      

        $scope.curART = $rootScope.curART;
        $scope.idrt = $scope.curART.idrt || $rootScope.dataRT.idrt;
        $scope.idart = $scope.curART.art03b || $scope.curART.artb03b;
        $scope.curART._nama = $scope.curART.art01;
        $scope.icfti = {};

        AppService.getDataKel($scope.idrt, 'icfti', $scope.idart).then(function(data) {
            $scope.icfti = data || {};
        });

        AppService.getTglWawancaraPlusSatu(true).then(function(val) {
            $scope.tglMaxEntry = val;
        })

        $scope.save = function() {
            
            $rootScope.$broadcast('saving:show');
            AppService.saveDataKel('icfti', $scope.icfti).then(function(data) {
                $rootScope.$broadcast('saving:hide');
                $rootScope.$broadcast('loading:show');
                $timeout(function() {
                    $rootScope.$broadcast('loading:hide');
                    $state.go('app.dse');
                }, 300);
            });
        };

        $scope.IcftiAllowSave = function(myForm) {
            var icfti = $scope.icfti;
            if (icfti) {
                allow = icfti.icfti04;
                        if (icfti.icfti04 == 1) {
                            allow = allow && icfti.icfti01 && icfti.icfti02 && icfti.icfti03;
                            if (icfti.icfti01 == 1) {
                                allow = allow && icfti.icfti01a;
                            }
                        } 
                return allow && myForm.$valid;
            }
        };
    }
})();
(function() {
    angular.module('ehdss')
        .controller('PbCtrl', PbCtrl);

    PbCtrl.$inject = ['$scope', '$state', '$rootScope', '$timeout', 'AppService'];

    function PbCtrl($scope, $state, $rootScope, $timeout, AppService) {
        var curART = $rootScope.curART; 
        var idrt = curART.idrt;
        var idart = curART.art03b;

        $scope.listHubRT = AppService.listHubRT();
        $scope.pb = {};

        AppService.getDataKel(idrt, 'pb', idart).then(function(data) {
            $scope.pb = data || {};

            $scope.pb.art01_ed = $scope.pb.art01_ed || curART.art01;
            $scope.pb.art02_ed = $scope.pb.art02_ed || curART.art02;
            $scope.pb.art04_ed = $scope.pb.art04_ed || ''+curART.art04;
            if ($scope.pb.art05_ed) {$scope.pb.art05_ed = new Date($scope.pb.art05_ed)}else{$scope.pb.art05_ed = new Date(curART.art05)};
            $scope.pb.art05b_ed = $scope.pb.art05b_ed || ''+curART.art05b;
            $scope.pb.art06a_ed = $scope.pb.art06a_ed || curART.art06a;
            $scope.pb.art07_ed = $scope.pb.art07_ed || ''+curART.art07;
            $scope.pb.art16_ed = $scope.pb.art16_ed || ''+curART.art16;
            $scope.pb.art18_ed = $scope.pb.art18_ed || ''+curART.art18;
            $scope.pb.art21a_ed = $scope.pb.art21a_ed || ''+curART.art21a;
            $scope.pb.art21b_ed = $scope.pb.art21b_ed || ''+curART.art21b;
            $scope.pb.art21c_ed = $scope.pb.art21c_ed || ''+curART.art21c;
            $scope.pb.art21d_ed = $scope.pb.art21d_ed || curART.art21d;
            if ($scope.pb.art21e_ed) {$scope.pb.art21e_ed = new Date($scope.pb.art21e_ed)} else {$scope.pb.art21e_ed = new Date(curART.art21e)};
            $scope.pb.art21ex_ed = $scope.pb.art21ex_ed || curART.art21ex; 
        });

        $scope.calcUmur = function() {
            var thn = AppService.getAge($scope.pb.art05_ed);
            $scope.pb.art06a_ed = thn;
        };

        $scope.save = function() {
            $rootScope.$broadcast('saving:show');
            AppService.saveDataKel('pb', $scope.pb).then(function(data) {
                $rootScope.$broadcast('saving:hide');
                $rootScope.$broadcast('loading:show');
                $timeout(function() {
                    $rootScope.$broadcast('loading:hide');
                    $state.go('app.art');
                }, 300);
            });
        };

        $scope.allowSave = function(myForm) {
            var pb = $scope.pb;
            var allow = true;// pb.art01_ed && pb.art02_ed && pb.art04_ed && pb.art05_ed && 
                        // pb.art06a_ed && pb.art07_ed && pb.art16_ed && pb.art18_ed && pb.art21a_ed;
                        // pb.art09_ed && pb.art10_ed && pb.art11_ed && pb.art12_ed;

                        // jika keberadaan tidak ada
                        if (pb.art21a_ed == 2) {
                            allow = allow && pb.art21b_ed && pb.art21ex_ed;
                            if (pb.art21b_ed == 2) {
                                allow = allow && pb.art21c_ed;
                                if (pb.art21c_ed == 2) {
                                    allow = allow && pb.art21d_ed;
                                }
                            }
                            if (pb.art21ex_ed == 1) {
                                allow = allow && pb.art21e_ed;
                            }
                        }
            return allow;
        };

    }
})();
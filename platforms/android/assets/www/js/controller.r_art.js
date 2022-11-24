(function() {
    angular.module('ehdss')
        .controller('R_artCtrl', R_artCtrl);

    R_artCtrl.$inject = ['$scope', '$state', '$rootScope', '$timeout', 'AppService'];

    function R_artCtrl($scope, $state, $rootScope, $timeout, AppService) {

        $scope.r = {};
        $scope.save = function() {
            $rootScope.$broadcast('saving:show');
            $scope.r._jk = ($scope.r._jk == 1) ? 'L' : 'P';
                // push data yg disimpan ke array
                $rootScope.r_dataArt.push($scope.r);
                $rootScope.$broadcast('saving:hide');
                $rootScope.$broadcast('loading:show');
                $timeout(function() {
                    $rootScope.$broadcast('loading:hide');
                    $state.go('app.art'); 
                }, 300);

        };

        $scope.allowSave = function(myForm) {
            var r = $scope.r;
            var allow = r._nama && r._jk && r.umur;
            return allow && myForm.$valid;
        };
        
    }
})();
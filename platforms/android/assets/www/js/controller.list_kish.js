(function() {
    angular.module('ehdss')
        .controller('ListKishCtrl', ListKishCtrl);

    ListKishCtrl.$inject = ['$scope', '$rootScope', 'AppService', '$state', '$timeout'];

    function ListKishCtrl($scope, $rootScope, AppService, $state, $timeout) {
        $scope.dataRT = $rootScope.dataRT;
        if ($rootScope.selectionKish.length != 0) {
            $scope.listSelectedKish = $rootScope.selectionKish;

            AppService.getDataKish($scope.listSelectedKish).then(function(data) {
                $scope.dataKish = data;
                $rootScope.dataKish = data;
                $scope.jumDataKish = $scope.dataKish.length;
            });
        }else{
            $scope.dataKish = false;
        }
        
        $scope.go = function(module) {
            $rootScope.$broadcast('loading:show');
            $timeout(function() {
                $state.go('app.' + module);
                $rootScope.$broadcast('loading:hide');
            }, 100);
        };

        

    }
    
})();

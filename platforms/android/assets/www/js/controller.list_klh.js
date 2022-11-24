(function() {
    angular.module('ehdss')
        .controller('ListKlhCtrl', ListKlhCtrl);

    ListKlhCtrl.$inject = ['$scope', '$rootScope', 'AppService', '$state', '$timeout'];

    function ListKlhCtrl($scope, $rootScope, AppService, $state, $timeout) {
            
        AppService.getDataART().then(function(data) {
            $scope.dataKLH = data.filter(function(item) {
                var umur = parseInt(item.umur);
                // console.log(item.klh;);
                return !item.artTdkAda && item.klh;
            });
            console.log($scope.dataKLH);
        });

        $scope.go = function(module) {
            $rootScope.$broadcast('loading:show');
            $timeout(function() {
                $rootScope.editStatus = 'new';
                $state.go('app.' + module);
                $rootScope.$broadcast('loading:hide');
            }, 100);
        };

         $scope.edit = function(selectedART) {
            // default jika ke KLH
            console.log(selectedART);
            var goto = 'klh',
                editStatus = 'edit';
            $rootScope.curART = selectedART;
            $rootScope.$broadcast('loading:show');
            $timeout(function() {
                $state.go('app.' + goto);
                $rootScope.editStatus = editStatus;
                $rootScope.$broadcast('loading:hide');
            }, 100);
        };

    }
})();

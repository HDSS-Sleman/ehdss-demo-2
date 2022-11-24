(function() {
    angular.module('ehdss')
        .controller('ListKmtCtrl', ListKmtCtrl);

    ListKmtCtrl.$inject = ['$scope', '$rootScope', 'AppService', '$state', '$timeout'];

    function ListKmtCtrl($scope, $rootScope, AppService, $state, $timeout) {

        AppService.getDataART().then(function(data) {
            $scope.dataKMT = data.filter(function(item) {
                var umur = parseInt(item.umur);
                return (umur >= 0) && item.kmt;
            });
            console.log($scope.dataKMT);
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
            // default jika ke KMT
            console.log(selectedART);
            var goto = 'kmt',
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

(function() {
    angular.module('ehdss')
        .controller('HomeCtrl', HomeCtrl);

    HomeCtrl.$inject = ['$scope', '$state', '$rootScope', 'AppService', '$ionicHistory', '$ionicModal', '$ionicPopup', '$http', '$timeout'];

    function HomeCtrl($scope, $state, $rootScope, AppService, $ionicHistory, $ionicModal, $ionicPopup, $http, $timeout) {

        $rootScope.titleApp = 'eHDSS Sleman';

        $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams, options) {
                if (toState.name === 'app.home') {
                    
                }
            });

        // tambah ruta baru
        $scope.tambahRT = function() {
            $rootScope.$broadcast('loading:show');
            $timeout(function() {
                $rootScope.$broadcast('loading:hide');

                $rootScope.dataRT = {};
                // generate uniques ID untuk tiap responden yang setuju ICF
                AppService.getUniqueIdrt().then(function(dataUnik){
                    $rootScope.idrt = dataUnik || '';
                });

                $state.go('app.ir');
            }, 300);
        };

    }
})();

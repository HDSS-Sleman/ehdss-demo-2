(function() {
    angular.module('ehdss')
        .controller('AtrCtrl', AtrCtrl);

    AtrCtrl.$inject = ['$scope', '$state', '$rootScope', '$timeout', 'AppService', '$ionicPopup', '$http'];

    function AtrCtrl($scope, $state, $rootScope, $timeout, AppService, $ionicPopup, $http) {

        if (!$rootScope.idrt) {
            $state.go('app.home'); // jika tidak ada idrt kembali ke home
            return false;
        }

        $scope.atr = {};

        AppService.getDataKel($rootScope.idrt, 'atr').then(function(data) {
            $scope.atr = data || {};
        });

        AppService.getTglWawancaraPlusSatu(true).then(function(val) {
            $scope.tglWawancara = val;
        });

        $scope.getIMT = function(bb, tb){
            if (bb && tb) {
                var imt = bb / ((tb*0.01) * (tb*0.01));
                $scope.atr.atr03 = parseFloat(imt).toFixed( 2 );
            }
        }

        $scope.AllowSave = function(myForm) {
            var atr = $scope.atr;
            allow = atr.atr01 && atr.atr02 && atr.atr03;
                    
            return allow && myForm.$valid;
        };

        // Save
        $scope.save = function(modul) {
            $scope.atr.atr = 1;
            var goTo = modul ? 'app.'+modul : '';
            // simpan model, termasuk yg hidden dg ng-show, exclude hidden dg ng-if
            return AppService.saveDataKelMasked('atr', $scope.atr, true, goTo);
        };

    }
})();
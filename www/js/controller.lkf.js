(function() {
    angular.module('ehdss')
        .controller('LkfCtrl', LkfCtrl);

    LkfCtrl.$inject = ['$scope', '$rootScope', '$state', '$ionicModal', '$window', '$ionicLoading', '$timeout', 'AppService'];

    function LkfCtrl($scope, $rootScope, $state, $ionicModal, $window, $ionicLoading, $timeout, AppService, $cordovaMedia) {
        
        if (!$rootScope.dataRT || !$rootScope.dataRT.idrt) {
            $state.go('app.home'); // jika tidak ada idrt kembali ke home
            return false;
        }
        
        $scope.lkf = {};

        AppService.getDataKel($rootScope.idrt, 'lkf').then(function(data) {
            $scope.lkf = data || {};
        });

        AppService.getTglWawancaraPlusSatu(true).then(function(val) {
            $scope.tglWawancara = val;
        });

        // Display/Tidak Tombol selanjutnya
        $scope.AllowSave = function(){
            var lkf = $scope.lkf;
            var allow = lkf.lkf1 && lkf.lkf2;
            return allow;
        }

        // Back
        $scope.save = function(modul) {
            var goTo = modul ? 'app.'+modul : '';

            // simpan model, termasuk yg hidden dg ng-show, exclude hidden dg ng-if
            return AppService.saveDataKelMasked('lkf', $scope.lkf, true, goTo);
        };

    }
})();

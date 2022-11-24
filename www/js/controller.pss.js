(function() {
    angular.module('ehdss')
        .controller('PssCtrl', PssCtrl);

    PssCtrl.$inject = ['$scope', '$rootScope', '$state', '$ionicModal', '$window', '$ionicLoading', '$timeout', 'AppService'];

    function PssCtrl($scope, $rootScope, $state, $ionicModal, $window, $ionicLoading, $timeout, AppService, $cordovaMedia) {
        
        if (!$rootScope.dataRT || !$rootScope.dataRT.idrt) {
            $state.go('app.home'); // jika tidak ada idrt kembali ke home
            return false;
        }
        
        $scope.pss = {};

        AppService.getDataKel($rootScope.idrt, 'pss').then(function(data) {
            $scope.pss = data || {};
        });

        AppService.getTglWawancaraPlusSatu(true).then(function(val) {
            $scope.tglWawancara = val;
        });

        // Display/Tidak Tombol selanjutnya
        $scope.AllowSave = function(){
            var pss = $scope.pss;
            var allow = pss.pss1 && pss.pss2;
            return allow;
        }

        // Back
        $scope.save = function(modul) {
            var goTo = modul ? 'app.'+modul : '';

            // simpan model, termasuk yg hidden dg ng-show, exclude hidden dg ng-if
            return AppService.saveDataKelMasked('pss', $scope.pss, true, goTo);
        };

    }
})();

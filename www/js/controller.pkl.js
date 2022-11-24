(function() {
    angular.module('ehdss')
        .controller('PklCtrl', PklCtrl);

    PklCtrl.$inject = ['$scope', '$rootScope', '$state', '$ionicModal', '$window', '$ionicLoading', '$timeout', 'AppService'];

    function PklCtrl($scope, $rootScope, $state, $ionicModal, $window, $ionicLoading, $timeout, AppService, $cordovaMedia) {
        
        if (!$rootScope.dataRT || !$rootScope.dataRT.idrt) {
            $state.go('app.home'); // jika tidak ada idrt kembali ke home
            return false;
        }
        
        $scope.pkl = {};

        AppService.getDataKel($rootScope.idrt, 'pkl').then(function(data) {
            $scope.pkl = data || {};
        });

        $scope.listPkl = {
            '1':'Rehabilitasi',
            '2':'Limpa',
            '3':'Ventilator medis (respirator)',
            '4':'Gejala putus obat'
        }

        AppService.getTglWawancaraPlusSatu(true).then(function(val) {
            $scope.tglWawancara = val;
        });

        // Display/Tidak Tombol selanjutnya
        $scope.AllowSave = function(){
            var pkl = $scope.pkl;
            var allow = pkl.pkl1 && pkl.pkl2 && pkl.pkl3 && pkl.pkl4;
            return allow;
        }

        // Back
        $scope.save = function(modul) {
            var goTo = modul ? 'app.'+modul : '';

            // simpan model, termasuk yg hidden dg ng-show, exclude hidden dg ng-if
            return AppService.saveDataKelMasked('pkl', $scope.pkl, true, goTo);
        };

    }
})();

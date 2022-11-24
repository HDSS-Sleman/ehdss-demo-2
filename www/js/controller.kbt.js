(function() {
    angular.module('ehdss')
        .controller('KbtCtrl', KbtCtrl);

    KbtCtrl.$inject = ['$scope', '$rootScope', '$state', '$ionicModal', '$window', '$ionicLoading', '$timeout', 'AppService'];

    function KbtCtrl($scope, $rootScope, $state, $ionicModal, $window, $ionicLoading, $timeout, AppService, $cordovaMedia) {
        
        if (!$rootScope.dataRT || !$rootScope.dataRT.idrt) {
            $state.go('app.home'); // jika tidak ada idrt kembali ke home
            return false;
        }
        
        $scope.kbt = {};

        AppService.getDataKel($rootScope.idrt, 'kbt').then(function(data) {
            $scope.kbt = data || {};
        });

        $scope.listKbt = {
            '1':'Saya tertarik menggunakan komputer',
            '2':'Saya senang menggunakan komputer saya',
            '3':'Saya tidak takut mencoba fungsi baru pada komputer'
        }

        AppService.getTglWawancaraPlusSatu(true).then(function(val) {
            $scope.tglWawancara = val;
        });

        // Display/Tidak Tombol selanjutnya
        $scope.AllowSave = function(){
            var kbt = $scope.kbt;
            var allow = kbt.kbt1 && kbt.kbt2 && kbt.kbt3;
            return allow;
        }

        // Back
        $scope.save = function(modul) {
            var goTo = modul ? 'app.'+modul : '';

            // simpan model, termasuk yg hidden dg ng-show, exclude hidden dg ng-if
            return AppService.saveDataKelMasked('kbt', $scope.kbt, true, goTo);
        };

    }
})();

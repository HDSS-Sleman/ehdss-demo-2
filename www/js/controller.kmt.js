(function() {
    angular.module('ehdss')
        .controller('KmtCtrl', KmtCtrl);

    KmtCtrl.$inject = ['$scope', '$rootScope', '$state', '$ionicModal', '$window', '$ionicLoading', '$timeout', 'AppService'];

    function KmtCtrl($scope, $rootScope, $state, $ionicModal, $window, $ionicLoading, $timeout, AppService, $cordovaMedia) {
        
        if (!$rootScope.dataRT || !$rootScope.dataRT.idrt) {
            $state.go('app.home'); // jika tidak ada idrt kembali ke home
            return false;
        }
        
        $scope.kmt = {};

        AppService.getDataKel($rootScope.idrt, 'kmt').then(function(data) {
            $scope.kmt = data || {};
        });

        $scope.listKmt = {
            '1':'Menggunakan komputer?',
            '2':'Menggunakan layar sentuh?',
            '3':'Mencari informasi di internet?'
        }

        AppService.getTglWawancaraPlusSatu(true).then(function(val) {
            $scope.tglWawancara = val;
        });

        // Display/Tidak Tombol selanjutnya
        $scope.AllowSave = function(){
            var kmt = $scope.kmt;
            var allow = kmt.kmt1 && kmt.kmt2 && kmt.kmt3;
            return allow;
        }

        // Back
        $scope.save = function(modul) {
            var goTo = modul ? 'app.'+modul : '';

            // simpan model, termasuk yg hidden dg ng-show, exclude hidden dg ng-if
            return AppService.saveDataKelMasked('kmt', $scope.kmt, true, goTo);
        };

    }
})();

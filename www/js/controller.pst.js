(function() {
    angular.module('ehdss')
        .controller('PstCtrl', PstCtrl);

    PstCtrl.$inject = ['$scope', '$rootScope', '$state', '$ionicModal', '$window', '$ionicLoading', '$timeout', 'AppService'];

    function PstCtrl($scope, $rootScope, $state, $ionicModal, $window, $ionicLoading, $timeout, AppService, $cordovaMedia) {
        
        if (!$rootScope.dataRT || !$rootScope.dataRT.idrt) {
            $state.go('app.home'); // jika tidak ada idrt kembali ke home
            return false;
        }
        
        $scope.pst = {};

        AppService.getDataKel($rootScope.idrt, 'pst').then(function(data) {
            $scope.pst = data || {};
        });

        $scope.listPst = {
            '1':'Keyboard',
            '2':'Pengaturan (setting)',
            '3':'Sistem operasi (Ms. Windows)',
            '4':'Nama pengguna (username)'
        }

        AppService.getTglWawancaraPlusSatu(true).then(function(val) {
            $scope.tglWawancara = val;
        });

        // Display/Tidak Tombol selanjutnya
        $scope.AllowSave = function(){
            var pst = $scope.pst;
            var allow = pst.pst1 && pst.pst2 && pst.pst3 && pst.pst4;
            return allow;
        }

        // Back
        $scope.save = function(modul) {
            var goTo = modul ? 'app.'+modul : '';

            // simpan model, termasuk yg hidden dg ng-show, exclude hidden dg ng-if
            return AppService.saveDataKelMasked('pst', $scope.pst, true, goTo);
        };

    }
})();

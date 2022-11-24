(function() {
    angular.module('ehdss')
        .controller('LkmCtrl', LkmCtrl);

    LkmCtrl.$inject = ['$scope', '$rootScope', '$state', '$ionicModal', '$window', '$ionicLoading', '$timeout', 'AppService'];

    function LkmCtrl($scope, $rootScope, $state, $ionicModal, $window, $ionicLoading, $timeout, AppService, $cordovaMedia) {
        
        if (!$rootScope.dataRT || !$rootScope.dataRT.idrt) {
            $state.go('app.home'); // jika tidak ada idrt kembali ke home
            return false;
        }
        
        $scope.lkm = {};

        AppService.getDataKel($rootScope.idrt, 'lkm').then(function(data) {
            $scope.lkm = data || {};
        });

        $scope.listLkm = {
            '1':'Menemukan informasi tentang pengobatan penyakit yang menyangkut Anda?',
            '2':'Mengikuti instruksi dari dokter atau apoteker?',
            '3':'Memahami saran kesehatan dari kerabat atau teman?'
        }


        AppService.getTglWawancaraPlusSatu(true).then(function(val) {
            $scope.tglWawancara = val;
        });

        // Display/Tidak Tombol selanjutnya
        $scope.AllowSave = function(){
            var lkm = $scope.lkm;
            var allow = lkm.lkm1 && lkm.lkm2 && lkm.lkm3;
            return allow;
        }

        // Back
        $scope.save = function(modul) {
            var goTo = modul ? 'app.'+modul : '';

            // simpan model, termasuk yg hidden dg ng-show, exclude hidden dg ng-if
            return AppService.saveDataKelMasked('lkm', $scope.lkm, true, goTo);
        };

    }
})();

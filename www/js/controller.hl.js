(function() {
    angular.module('ehdss')
        .controller('HlCtrl', HlCtrl);

    HlCtrl.$inject = ['$scope', '$rootScope', '$state', '$ionicModal', '$window', '$ionicLoading', '$timeout', 'AppService'];

    function HlCtrl($scope, $rootScope, $state, $ionicModal, $window, $ionicLoading, $timeout, AppService, $cordovaMedia) {
        
        if (!$rootScope.idrt) {
            $state.go('app.home'); // jika tidak ada idrt kembali ke home
            return false;
        }

        $scope.hl = {};

        AppService.getDataKel($rootScope.idrt, 'hl').then(function(data) {
            $scope.hl = data || {};
        });
       
        $scope.nokoma = {
            word: /^[^,]*$/ //regex allow selain koma
        };

        AppService.getTglWawancaraPlusSatu(true).then(function(val) {
            $scope.tglWawancara = val;
        });

        // Display/Tidak Tombol selanjutnya
        $scope.literacyAllowSave = function(myForm){
            var hl = $scope.hl;
            var allow = hl.hl01 && hl.hl02 && hl.hl03 && hl.hl04 && hl.hl05 && 
                        hl.hl06 && hl.hl07 && hl.hl08 && hl.hl09 && hl.hl10;
            return allow && myForm.$valid;
        }

        /* simpan data*/
        $scope.save = function(modul) {
            $scope.hl.hl = 1;
            var goTo = modul ? 'app.'+modul : '';
            // simpan model, termasuk yg hidden dg ng-show, exclude hidden dg ng-if
            return AppService.saveDataKelMasked('hl', $scope.hl, true, goTo);
        };

    }
})();

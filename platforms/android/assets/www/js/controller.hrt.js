(function() {
    angular.module('ehdss')
        .controller('HrtCtrl', HrtCtrl);

    HrtCtrl.$inject = ['$scope', '$rootScope', '$state', '$ionicModal', '$window', '$ionicLoading', '$timeout', 'AppService'];

    function HrtCtrl($scope, $rootScope, $state, $ionicModal, $window, $ionicLoading, $timeout, AppService) {
        $scope.hrt = $rootScope.dataRT.hrt || {};
        // reset dulu ke empty object
        // $scope.hrt = {};
        AppService.getDataART().then(function(data) {
            $scope.dataART = data.filter(function(item) {
                return !item.artTdkAda;
            });
        });
        $scope.barang = true;
        $scope.ternak = false;
        $scope.tanah = false;

        // Display/Tidak Tombol selanjutnya (barang)
        $scope.barangAllowSave = function() {
            var hrt = $scope.hrt;
            var allow = !isNaN(hrt.hrt01a) && !isNaN(hrt.hrt01b) && !isNaN(hrt.hrt01c) && !isNaN(hrt.hrt01d) && 
                        !isNaN(hrt.hrt01e) && !isNaN(hrt.hrt01f) && !isNaN(hrt.hrt01g) && !isNaN(hrt.hrt01h) &&
                        !isNaN(hrt.hrt01i) && !isNaN(hrt.hrt01j) && !isNaN(hrt.hrt01k) && !isNaN(hrt.hrt01l) &&
                        !isNaN(hrt.hrt01m) && !isNaN(hrt.hrt01n) && hrt.hrt02;
            // jika bahan bakar utama lainnya
            if(hrt.hrt02 == 95){
                allow = hrt.hrt02a;
            }
            return allow;
        };

        // Display/Tidak Tombol selanjutnya (ternak)
        $scope.ternakAllowSave = function() {
            var hrt = $scope.hrt;
            var allow = hrt.hrt03;
            if(hrt.hrt03 == 1){
                allow = !isNaN(hrt.hrt04a) && !isNaN(hrt.hrt04b) && !isNaN(hrt.hrt04c) && !isNaN(hrt.hrt04d) && 
                        !isNaN(hrt.hrt04e) && !isNaN(hrt.hrt04f) && !isNaN(hrt.hrt04g) && !isNaN(hrt.hrt04h) && 
                        !isNaN(hrt.hrt04i) && !isNaN(hrt.hrt04j) && !isNaN(hrt.hrt04k) && !isNaN(hrt.hrt04l) && 
                        !isNaN(hrt.hrt04m) && !isNaN(hrt.hrt04n);
            }
            return allow;
        };

        // Display/Tidak Tombol selanjutnya (tanah)
        $scope.tanahAllowSave = function() {
            var hrt = $scope.hrt;
            var allow = hrt.hrt05 && hrt.hrt09 && hrt.hrt13;
            // jika memiliki sawah
            if(hrt.hrt05 == 1){
                allow = allow && hrt.hrt06 && hrt.hrt07 && ((!isNaN(hrt.hrt07a) && hrt.hrt07a!=0) || (!isNaN(hrt.hrt07b) && hrt.hrt07b!=0)) && hrt.hrt08a;
                // jika status kepemilikan sawah lainnya
                if(hrt.hrt06 == 95){
                    allow = allow && hrt.hrt06a;
                }
                // jika sawah ditanami
                if(hrt.hrt08a == 1){
                    allow = allow && hrt.hrt08b && hrt.hrt08c;
                }
            }
            // jika memiliki kebun/tegalan
            if(hrt.hrt09 == 1){
                allow = allow && hrt.hrt10 && hrt.hrt11 && ((!isNaN(hrt.hrt11a) && hrt.hrt11a!=0) || (!isNaN(hrt.hrt11b) && hrt.hrt11b!=0)) && hrt.hrt12a;
                // jika status kepemilikan kebun lainnya
                if (hrt.hrt10 == 95) {
                    allow = allow && hrt.hrt10a;
                }
                // jika kebun/tegalan ditanami
                if (hrt.hrt12a == 1) {
                    allow = allow && hrt.hrt12b && hrt.hrt12c;
                }
            }
            // jika punya pekarangan
            if (hrt.hrt13 == 1) {
                allow = allow && hrt.hrt14 && hrt.hrt15 && ((!isNaN(hrt.hrt15a) && hrt.hrt15a!=0) || (!isNaN(hrt.hrt15b) && hrt.hrt15b!=0)) && hrt.hrt16a;
                // jika status kepemilikan pekarangan lainnya
                if (hrt.hrt14 == 95) {
                    allow = allow && hrt.hrt14a;
                }
                // jika pekarangan ditanami
                if (hrt.hrt16a == 1) {
                    allow = allow && hrt.hrt16b && hrt.hrt16c;
                }
            }
            return allow;
        };

        $scope.go = function(toMenu, curMenu) {
            $scope.save().then(function() {
                $scope[toMenu] = true;
                $scope[curMenu] = false;
            });
        };

        // Save
        $scope.save = function(finish) {
            var goTo = finish ? 'app.art' : '';
            // simpan model, termasuk yg hidden dg ng-show, exclude hidden dg ng-if
            return AppService.saveDataKelMasked('hrt', $scope.hrt, true, goTo);
        };
    }
})();

(function() {
    angular.module('ehdss')
        .controller('KrCtrl', KrCtrl);

    KrCtrl.$inject = ['$scope', '$rootScope', '$state', '$ionicModal', '$window', '$ionicLoading', '$timeout', 'AppService'];

    function KrCtrl($scope, $rootScope, $state, $ionicModal, $window, $ionicLoading, $timeout, AppService) {
        $scope.kr = $rootScope.dataRT.kr || {};
        // reset dulu ke empty object
        // $scope.kr = {};

        // Save
        $scope.save = function(finish) {
            var goTo = finish ? 'app.art' : ''; //sementaa masih di halaman yg sama ketika save, masih pengecekan
            // simpan model, termasuk yg hidden dg ng-show, exclude hidden dg ng-if
            return AppService.saveDataKelMasked('kr', $scope.kr, true, goTo);
        };

        $scope.allowSave = function(myForm) {
            var kr = $scope.kr;
            var allow = kr.kr01 && (!isNaN(kr.kr02) && kr.kr02!=0) && kr.kr03 && kr.kr04 && kr.kr05 && kr.kr06 && kr.kr07 &&
                        kr.kr08 && kr.kr10 && kr.kr12 && kr.kr13 && kr.kr14
                        ;
                        // status kepemilikan rumah lainnya
                        if (kr.kr01 == 95) {
                            allow = allow && kr.kr01a;
                        }
                        // jika sumber penerangan lainnya
                        if (kr.kr08 == 95) {
                            allow = allow && kr.kr08a;
                        }
                        // jika penerangan PLN/tenaga surya
                        if (kr.kr08 == 1 || kr.kr08 == 2 || kr.kr08 == 5) {
                            allow = allow && kr.kr09;
                            // jika watt listrik lainnya
                            if (kr.kr09 == 95) {
                                allow = allow && kr.kr09a;
                            }
                        }
                        // jika ada fasilitas buang air besar
                        if (kr.kr10 == 1 || kr.kr10 == 2 || kr.kr10 == 3) {
                            allow = allow && kr.kr11;
                        }
                        // jika pembunagan akhir tinja lainnya
                        if (kr.kr12 == 95) {
                            allow = allow && kr.kr12a;
                        }
                        // jika sumber air minum lainnya
                        if (kr.kr13 == 95) {
                            allow = allow && kr.kr13a;
                        }
                        // jika sumber air minum (pompa, sumur, mata air)
                        if (kr.kr13 >= 6 && kr.kr13 <= 10) {
                            allow = allow && kr.kr15a;
                        }
                        // jika sumber air untuk mencuci lainnya
                        if (kr.kr14 == 95) {
                            allow = allow && kr.kr14a;
                        }
                        // jika sumber air untuk mencuci (pompa, sumur, mata air)
                        if (kr.kr14 >= 6 && kr.kr14 <= 10) {
                            allow = allow && kr.kr15b;
                        }
            return allow && myForm.$valid;
        };
    }
})();
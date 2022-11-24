(function() {
    angular.module('ehdss')
        .controller('KishCtrl', KishCtrl);

    KishCtrl.$inject = ['$scope', '$rootScope', 'AppService', '$state', '$timeout'];

    function KishCtrl($scope, $rootScope, AppService, $state, $timeout) {
        $scope.dataRT = $rootScope.dataRT;
        if ($rootScope.dataKish) {
            $scope.dataKish = $rootScope.dataKish;
            $scope.jumDataKish = $scope.dataKish.length;
            $scope.lastDigitIDRT = parseInt($rootScope.dataRT.idrt.toString().split('').pop());

            AppService.getDataKishrandom($scope.dataKish, $scope.jumDataKish, $scope.lastDigitIDRT).then(function(data) {
                $scope.dataKishrandom = data;
            });
        }
        
        $scope.Random = $rootScope.Random;

        $scope.saveRandom = function(selectedART) {
            AppService.saveDataRandom(selectedART).then(function(data) {
                $rootScope.$broadcast('saving:hide');
                $rootScope.$broadcast('loading:show');
                $timeout(function() {
                    $rootScope.$broadcast('loading:hide');
                    $state.go('app.home');
                }, 300);
            });
        };

        $scope.go = function(selectedART,modul) {
            /* wawancara kunjungan langsung*/
            // ke art_cover dulu sebelum ke Modul B
            $rootScope.catatanModulUtama = false; $rootScope.catatanModulB = true;
            $rootScope.tab_catatan = true; // langsung buka tab catatan
            $rootScope.tab_cover = false; // tab cover di hide dulu
            // $rootScope.tab_konfirmasi_individu = true;
            // $rootScope.tab_laporan_individu = false;

            var goto = 'art_cover';
            $rootScope.curART = selectedART;
            $rootScope.$broadcast('loading:show');
            $timeout(function() {
                $state.go('app.' + goto);
                $rootScope.$broadcast('loading:hide');
            }, 100);
        };


    }
})();

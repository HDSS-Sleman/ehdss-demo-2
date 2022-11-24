(function() {
    angular.module('ehdss')
        .controller('AkkCtrl', AkkCtrl);

    AkkCtrl.$inject = ['$scope', '$rootScope', '$state', '$timeout', 'AppService'];
    function AkkCtrl($scope, $rootScope, $state, $timeout, AppService) {
        $scope.akk = $rootScope.dataRT.akk || {};


        $scope.allowSave = function() {
            var akk = $scope.akk;
            var allow = akk.akk1 && akk.akk2 && akk.akk3 && akk.akk4 && 
                        akk.akk5 && akk.akk6 && akk.akk7 && akk.akk8 && 
                        akk.akk9;

            return allow;
        };

        $scope.save = function(param) {

            if (param == 'utama') {
                /* Jika wawancara berhenti di tengah jalan*/
                $rootScope.catatanModulUtama = true; //param untuk catatan modul utama
                $rootScope.catatanModulB = false; //param untuk catatan modul B
                $rootScope.tab_catatan = true; // langsung buka tab catatan
                $rootScope.tab_cover = false; // tab cover di hide dulu
                var goTo = 'app.art_cover';
            }else{
                var goTo = 'app.art';
            }

            $rootScope.$broadcast('saving:show');
            // simpan semua model (termasuk hidden ng-show), kecuali yg hidden ng-if
            AppService.saveDataKel('akk', $scope.akk, true).then(function(data) {
                $rootScope.$broadcast('saving:hide');
                $rootScope.$broadcast('loading:show');
                $timeout(function() {
                    $rootScope.$broadcast('loading:hide');
                    $state.go(goTo);
                }, 300);
            });
        };
    }



})();

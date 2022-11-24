(function() {
    angular.module('ehdss')
        .controller('PtmiCtrl', PtmiCtrl);

    PtmiCtrl.$inject = ['$scope', '$state', '$rootScope', '$timeout', 'AppService'];

    function PtmiCtrl($scope, $state, $rootScope, $timeout, AppService) {      

        $scope.curART = $rootScope.curART;
        $scope.idrt = $scope.curART.idrt || $rootScope.dataRT.idrt;
        $scope.idart = $scope.curART.art03b || $scope.curART.artb03b;
        $scope.curART._nama = $scope.curART.art01;
        $scope.ptmi = {};

        AppService.getDataKel($scope.idrt, 'ptmi', $scope.idart).then(function(data) {
            $scope.ptmi = data || {};
        });

        AppService.getTglWawancaraPlusSatu(true).then(function(val) {
            $scope.tglMaxEntry = val;
        })

        $scope.save = function(go) {
            $scope.ptmi.ptmi = 1;
            $rootScope.$broadcast('saving:show');
            AppService.saveDataKel('ptmi', $scope.ptmi).then(function(data) {
                $rootScope.$broadcast('saving:hide');
                $rootScope.$broadcast('loading:show');
                $timeout(function() {
                    $rootScope.$broadcast('loading:hide');
                    if (go == 'laporan') {
                        $rootScope.tab_konfirmasi_individu = false;
                        $rootScope.tab_laporan_individu = true;
                        $state.go('app.ktlpi'); // ke laporan waancara individu
                    }else{
                        $state.go('app.aksi');
                    }
                        
                }, 300);
            });
        };

        $scope.allowSave = function(myForm) {
            var ptmi = $scope.ptmi;
            var allow = ptmi.ptm02a && ptmi.ptm04a && ptmi.ptm06a && ptmi.ptm10a && ptmi.ptm13a && ptmi.ptm35;
                        if (ptmi.ptm02a == 1) {
                            allow = allow && ptmi.ptm02b && ptmi.ptm02c;
                        }
                        if (ptmi.ptm04a == 1) {
                            allow = allow && ptmi.ptm04b && ptmi.ptm04c; 
                        }
                        if (ptmi.ptm06a == 1) {
                            allow = allow && ptmi.ptm06b && ptmi.ptm06c;
                        }
                        if (ptmi.ptm10a == 1) {
                            allow = allow && ptmi.ptm10b && ptmi.ptm10c;
                        }
                        if (ptmi.ptm13a == 1) {
                            allow = allow && ptmi.ptm12a && ptmi.ptm13b && ptmi.ptm13c;
                            if (ptmi.ptm12a == 95) {
                                allow = allow && ptmi.ptm12b;
                            }
                        }
                        if (ptmi.ptm35 == 1) {
                            allow = allow && ptmi.ptm35a && ptmi.ptm35b;
                        }

            return allow && myForm.$valid;
        };
    }
})();
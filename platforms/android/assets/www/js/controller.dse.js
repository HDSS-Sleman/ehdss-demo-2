(function() {
    angular.module('ehdss')
        .controller('DseCtrl', DseCtrl);

    DseCtrl.$inject = ['$scope', '$state', '$rootScope', '$timeout', 'AppService'];

    function DseCtrl($scope, $state, $rootScope, $timeout, AppService) {      

        $scope.curART = $rootScope.curART;
        $scope.idrt = $scope.curART.idrt || $rootScope.dataRT.idrt;
        $scope.idart = $scope.curART.art03b || $scope.curART.artb03b;
        $scope.curART._nama = $scope.curART.art01;

        if ($scope.curART.art18 == 95) { // jika pekerjaan lain
            $scope.pekerjaan_lalu = $scope.curART.art18a;
        }else{
            $scope.pekerjaan_lalu = AppService.getPekerjaan($scope.curART.art18);
        }

            

        $scope.pekerjaan = AppService.listPekerjaan();
        $scope.dse = {};

        AppService.getDataKel($scope.idrt, 'dse', $scope.idart).then(function(data) {
            $scope.dse = data || {};
        });

        // ambil data part untuk recall pekerjaan utama
        AppService.getDataKel($scope.idrt, 'part', $scope.idart).then(function(data) {
            $scope.part = data || {};
            if($scope.curART.start_in_wave_art){
                $scope.pekerjaan_sekarang = $scope.pekerjaan_lalu;
            }else{
                if ($scope.part.part20lain) {
                    $scope.pekerjaan_sekarang = $scope.part.part20lain;
                }else{
                    $scope.pekerjaan_sekarang = AppService.getPekerjaan($scope.part.part20);
                }
            }
                
        });

        AppService.getTglWawancaraPlusSatu(true).then(function(val) {
            $scope.tglMaxEntry = val;
        })

        $scope.save = function(param) {

            if (param == 'individu') {
                /* Jika wawancara berhenti di tengah jalan*/
                $rootScope.catatanModulUtama = false; $rootScope.catatanModulB = true;
                $rootScope.tab_catatan = true; // langsung buka tab catatan
                $rootScope.tab_cover = false; // tab cover di hide dulu
                var goTo = 'app.art_cover';
            }else{
                var goTo = 'app.srq';
            }

            $scope.dse.dse = 1;
            $rootScope.$broadcast('saving:show');
            AppService.saveDataKel('dse', $scope.dse).then(function(data) {
                $rootScope.$broadcast('saving:hide');
                $rootScope.$broadcast('loading:show');
                $timeout(function() {
                    $rootScope.$broadcast('loading:hide');
                        $state.go(goTo);
                }, 300);
            });
        };

        $scope.allowSave = function(myForm) {
            var dse = $scope.dse;
            var allow = dse.dse701 && dse.dse702 && dse.dse702b &&
                        dse.dse703a && dse.dse703b && dse.dse703c && dse.dse703d && dse.dse703e && dse.dse703f &&
                        dse.dse704 && dse.dse705 &&
                        dse.dse706a && dse.dse706b && dse.dse706c && dse.dse706d && dse.dse706e && dse.dse706f && dse.dse706g &&
                        dse.dse707 && dse.dse708;
                        if (dse.dse702 == 2) {
                            allow = allow && dse.dse702a;
                            if (dse.dse702a == 95) {
                                allow = allow && dse.dse702_95a;
                            }
                        }
                        if (dse.dse708 == 1) {
                            allow = allow && dse.dse709_1 && dse.dse709_2 && dse.dse709_3 && dse.dse709_4 && dse.dse709_95 &&
                                             dse.dse710_1 && dse.dse710_2 && dse.dse710_3 && dse.dse710_4 && dse.dse710_95;
                            if (dse.dse709_95 == 1) {
                                allow = allow && dse.dse709_95a;
                            }
                            if (dse.dse710_95 == 1) {
                                allow = allow && dse.dse710_95a;
                            }
                        }

            return allow && myForm.$valid;
        };
    }
})();
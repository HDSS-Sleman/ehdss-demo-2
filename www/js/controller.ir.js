(function() {
    angular.module('ehdss')
        .controller('IrCtrl', IrCtrl);

    IrCtrl.$inject = ['$scope', '$state', '$rootScope', '$timeout', 'AppService'];

    function IrCtrl($scope, $state, $rootScope, $timeout, AppService) {
        
        if (!$rootScope.idrt) {
            $state.go('app.home'); // jika tidak ada idrt kembali ke home
            return false;
        }
        
        $scope.listKapanewon = AppService.getListKapanewon();
        $scope.listKalurahan = AppService.getListKalurahanAll();
        $scope.listPekerjaan = AppService.listPekerjaan();
        $scope.listPendidikan = AppService.listPendidikan();

        $scope.ir = {};

        AppService.getDataKel($rootScope.idrt, 'ir').then(function(data) {
            $scope.ir = data || {};
            $scope.ir.idrt = $rootScope.idrt;
        });
        
        AppService.getTglWawancaraPlusSatu(true).then(function(val) {
            $scope.tglWawancara = val;
        });

        $scope.countUmur = function(){
            // validasi usia anak
            if ($scope.ir.ir02) {
                var strAge = AppService.getTglLahir($scope.ir.ir02);
                var umur = AppService.getAgeDetail(strAge);
                var umurArr = umur.split('/');
                $scope.year = parseInt(umurArr[0]);
                $scope.ir.ir03 = $scope.year
            }
        }

        
        //Agar tidak bisa mengetik '*','+' dan '-'//
        // $scope.onlyNumber = function() {
        //     var onlyNumber = event.charCode >= 48 && event.charCode <= 57;
        //     return onlyNumber;
        // }
        //

        $scope.save = function(param) {

            $rootScope.dataRT = $scope.ir;

            $rootScope.$broadcast('saving:show');
            //  save data Informasi Responden
            AppService.saveDataRT('ir', $scope.ir).then(function(data) {
                $rootScope.$broadcast('saving:hide');
                $rootScope.$broadcast('loading:show');
                $timeout(function() {
                    $rootScope.$broadcast('loading:hide');
                    $state.go('app.klk');
                }, 400);
            });
        };

        $scope.allowSave = function(myForm) {
            var ir = $scope.ir;
            var allow = ir.ir01 && ir.ir02 && ir.ir03 && ir.ir04 && ir.ir05 &&
                        ir.ir07 && ir.ir08 && rt.ir09 && rt.ir10 && rt.ir11;

                        // pekerjaan lain
                        if (ir.ir07 == 95) {
                            allow = allow && ir.ir07a;
                        }

                        // asuransi lain
                        if (ir.ir08 == 1) {
                            allow = allow && ir.ir08a && ir.ir08b && ir.ir08c;
                        }

            return allow && myForm.$valid;

        };  

    }
})();
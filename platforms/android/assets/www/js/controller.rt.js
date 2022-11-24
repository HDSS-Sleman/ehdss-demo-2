(function() {
    angular.module('ehdss')
        .controller('RtCtrl', RtCtrl);

    RtCtrl.$inject = ['$scope', '$state', '$rootScope', '$timeout', 'AppService'];

    function RtCtrl($scope, $state, $rootScope, $timeout, AppService) {
        
        $scope.editStatusRT = $rootScope.editStatusRT;
        var rt = {};
        $scope.rt = rt;

        // jika edit data RT baru
        if ($rootScope.editStatusRT === 'edit') {
            AppService.getCurentRT($rootScope.curRT.idrt).then(function(data) {
                $scope.rt = data;
                $scope.editIDRT = 0; // idrt dibuat readonly
            });
            
        }

        // jika input data RT baru
        if ($rootScope.editStatusRT === 'new') {
            // generate uniques ID
            AppService.getUniqueIdrt().then(function(dataUnik){
                $scope.rt.idrt = dataUnik || '';
            }); 
        }

        $scope.generateID = function() {
            // generate uniques ID
            AppService.getUniqueIdrt().then(function(dataUnik){
                $scope.rt.idrt = dataUnik || '';
                console.log($scope.rt.idrt);
            });
        }

        $scope.umur_AllowSave = function(){
            // validasi usia anak
            if ($scope.rt.id05) {
                var strAge = AppService.getTglLahir($scope.rt.id05);
                var umur = AppService.getAgeDetail(strAge);
                var umurArr = umur.split('/');
                $scope.year = parseInt(umurArr[0]);
                $scope.month = parseInt(umurArr[1]);
                $scope.day = parseInt(umurArr[2]);
                $scope.allowUsia = $scope.year == 0 && $scope.month <= 6;

                // display age
                var strAge = AppService.getTglLahir($scope.rt.id05);
                $scope.rt.id26 = AppService.getAgeDetailStr(strAge); 
            }
        }
        
        AppService.getTglWawancaraPlusSatu(true).then(function(val) {
            $scope.tglWawancara = val;
        });
        
        //Agar tidak bisa mengetik '*','+' dan '-'//
        // $scope.onlyNumber = function() {
        //     var onlyNumber = event.charCode >= 48 && event.charCode <= 57;
        //     return onlyNumber;
        // }
        //

        $scope.getMaxNoUrutRT = function(NoKluster){

            AppService.getMaxNoUrutRT(NoKluster).then(function(data){

                var max = ''+data;
                $scope.rt.kl06 = parseInt(max.substr(4))+1;
                // no ID RT
                no_rt = AppService.zeroPad($scope.rt.kl06, 3);
                rt.kl07 = parseInt(NoKluster+''+no_rt);
                rt.idrt = rt.kl07;

            });
        }

        $scope.save = function(param) {
            
            $scope.rt.user = 'enum_'+$rootScope.username+'_enum'; //tambahkan nama enum
            
            username = $rootScope.username;
            
            $rootScope.$broadcast('saving:show');
            //  save data RT
            AppService.saveDataRT('rt', $scope.rt, username).then(function(data) {

                $rootScope.$broadcast('saving:hide');
                $rootScope.$broadcast('loading:show');
                $timeout(function() {
                    $rootScope.$broadcast('loading:hide');
                        if(data && $rootScope.editStatusRT === 'new'){ // jika baru menambahkan ruta baru
                            $state.go('app.home');
                        }else if ($rootScope.editStatusRT === 'edit') {
                            $state.go('app.art'); // ke laporan waancara utama
                        }
                }, 400);
                
            });
                

        };

        $scope.allowSave = function(myForm) {
            var rt = $scope.rt;
            var allow = rt.id04 && rt.id05 && rt.id29 && rt.id27; // harus diisi nama, tgl lahir, No.Telp/HP, kabupaten

            return allow && myForm.$valid;

        };  

    }
})();
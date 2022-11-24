(function() {
    angular.module('ehdss')
        .controller('KmtCtrl', KmtCtrl);

    KmtCtrl.$inject = ['$scope', '$state', '$rootScope', '$timeout', 'AppService'];

    function KmtCtrl($scope, $state, $rootScope, $timeout, AppService) {
        
        
        var kmt = {};
        console.log($rootScope.editStatus);
        if ($rootScope.editStatus === 'new') {
            $scope.kmt = kmt;
            $scope.stat = true;
            console.log($scope.stat);
            //data kelahiran yg tersedia dari list ART
            AppService.getDataART().then(function(data) {
                $scope.dataKMT = data.filter(function(item) {
                    var umur = parseInt(item.umur);
                    return (umur >= 0);
                });
            });

        }else{

            var curART = $rootScope.curART;
            var idrt = curART.idrt;
            var idart = curART.art03b;
            $scope.curART = curART;
            $scope.curART._nama = curART.art01;
            // untuk menyingkat penulisan di HTML
            $scope.kmt = {};
            $scope.stat = false;
            console.log($scope.stat);
            AppService.getDataKel(idrt, 'kmt', idart).then(function(data) {
                $scope.kmt = data || {};
                $scope.listHubRT = AppService.listHubRT();
            });
        }

        kmt.kmt07a = 1;
        kmt.kmt08d = 1; 
        
        $scope.fillForm = function(data) { //mengambil dataART dg nama yg dipilih
            var obj = JSON.parse(data);
            $rootScope.curART = obj;
            $scope.curART = obj;
            kmt.kmt02 = $scope.curART._nama; //nama
            kmt.kmt03 = String($scope.curART.art02); //hub dg kepala rt
            kmt.kmt04 = $scope.curART.art11; //no urut ayah
            kmt.kmt05 = $scope.curART.art12; //no urut ibu
            kmt.kmt06 = String($scope.curART.art04);; //jenis kelamin
        };

        $scope.calcUmur = function() {
            // Jika Tidak tahu tgl lahir
            if (kmt.kmt07a == 98) {
                if (kmt.kmt08a) { // thn diisi
                    $scope.umur = kmt.kmt08a;
                } else {
                    $scope.umur = 0;
                }
            } else {
                if (kmt.kmt07) {
                    var thn = AppService.getAge(kmt.kmt07);
                    // artb.artb06a = thn;
                    $scope.umur = thn;
                } else {
                    $scope.umur = '';
                }
            }
        };

        $scope.save = function() {
            // debugger;
            console.log(kmt);
            console.log($rootScope.curART);
            $rootScope.$broadcast('saving:show');
            AppService.saveDataKel('kmt', $scope.kmt).then(function(data) {
                $rootScope.$broadcast('saving:hide');
                $rootScope.$broadcast('loading:show');
                $timeout(function() {
                    $rootScope.$broadcast('loading:hide');
                    $state.go('app.list_kmt');
                }, 300);
            });
        };

        $scope.allowSave = function(myForm) {
            var kmt = $scope.kmt;
            allow = kmt.kmt02 && kmt.kmt03 && kmt.kmt04 && kmt.kmt05 && kmt.kmt06 &&
                    (kmt.kmt07 || kmt.kmt07a != 1) && (kmt.kmt08a || kmt.kmt08b || kmt.kmt08c || kmt.kmt08d !=1);

            return allow && myForm.$valid;
        };
        
    }
})();
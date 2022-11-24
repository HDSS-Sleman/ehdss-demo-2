(function() {
    angular.module('ehdss')
        .controller('KlhCtrl', KlhCtrl);

    KlhCtrl.$inject = ['$scope', '$state', '$rootScope', '$timeout', 'AppService'];

    function KlhCtrl($scope, $state, $rootScope, $timeout, AppService) {
        
        var klh = {};
        console.log($rootScope.editStatus);
        if ($rootScope.editStatus === 'new') {
            $scope.klh = klh;
            $scope.stat = true;
            console.log($scope.stat);
            //data kelahiran yg tersedia dari list ART
            AppService.getDataART().then(function(data) {
                $scope.dataKLH = data.filter(function(item) {
                    var umur = parseInt(item.umur);
                    return !item.artTdkAda && (umur >= 0) && (umur <= 0);
                });
            });

        }else{

            var curART = $rootScope.curART;
            var idrt = curART.idrt;
            var idart = curART.art03b;
            $scope.curART = curART;
            $scope.curART._nama = curART.art01;
            // untuk menyingkat penulisan di HTML
            $scope.klh = {};
            $scope.stat = false;
            console.log($scope.stat);
            AppService.getDataKel(idrt, 'klh', idart).then(function(data) {
                $scope.klh = data || {};
                $scope.listHubRT = AppService.listHubRT();
            });
        }

        // $scope.klh = klh;
        klh.klh09a = 1;
        klh.klh10a = 1;
        klh.klh10c = 1;
        
        $scope.fillForm = function(data) { //mengambil dataART dg noART yg dipilih
            var obj = JSON.parse(data);
            $rootScope.curART = obj;
            $scope.curART = obj;
            console.log($scope.curART);
            klh.art00 = $scope.curART._noArt; //noArt
            klh.klh02 = $scope.curART._nama; //nama
            klh.klh03 = String($scope.curART.art02); //hub dg kepala rt
            klh.klh06 = String($scope.curART.art04);; //jenis kelamin
            klh.klh07 = $scope.curART.art11; //no urut ayah
            klh.klh08 = $scope.curART.art12; //no urut ibu
            klh.klh09 = new Date($scope.curART._tglLahir); //tgl lahir object
            if($scope.curART.art05a == 98){ //jika tgl lahir tidak tahu
                klh.klh09a = 98;
                klh.klh09b = $scope.curART.art06a;
                klh.klh09c = $scope.curART.art06b;
                klh.klh09d = $scope.curART.art06c;
            }
        };

        $scope.calcUmur = function() {
            // Jika Tidak tahu tgl lahir
            if (klh.klh09a == 98) {
                if (klh.klh09b) { // thn diisi
                    $scope.umur = klh.klh09b;
                } else {
                    $scope.umur = 0;
                }
            } else {
                if (klh.klh09) {
                    var thn = AppService.getAge(klh.klh09);
                    // artb.artb06a = thn;
                    $scope.umur = thn;
                } else {
                    $scope.umur = '';
                }
            }
        };

        $scope.save = function() {
            // debugger;
            console.log(klh);
            $rootScope.$broadcast('saving:show');
            AppService.saveDataKel('klh', $scope.klh).then(function(data) {
                $rootScope.$broadcast('saving:hide');
                $rootScope.$broadcast('loading:show');
                $timeout(function() {
                    $rootScope.$broadcast('loading:hide');
                    $state.go('app.list_klh');
                }, 300);
            });
        };

        $scope.allowSave = function(myForm) {
            var klh = $scope.klh;
            allow = klh.art00 && klh.klh02 && klh.klh03 && klh.klh04 && klh.klh05 && 
                    klh.klh06 && klh.klh07 && klh.klh08 && (klh.klh09 || klh.klh09a) &&
                    (klh.klh10 || klh.klh10a == 98) && (klh.klh10b || klh.klh10c == 98);
                    // jika tgl lahir tidak tahu
                    if(klh.klh09a == 98){
                        allow = allow && (klh.klh09b || klh.klh09c || klh.klh09d);
                    }

            return allow && myForm.$valid;
        };

    }
})();
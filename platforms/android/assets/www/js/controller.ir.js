(function() {
    angular.module('ehdss')
        .controller('IrCtrl', IrCtrl);

    IrCtrl.$inject = ['$scope', '$state', '$rootScope', '$timeout', 'AppService', '$ionicPopup', '$http'];

    function IrCtrl($scope, $state, $rootScope, $timeout, AppService, $ionicPopup, $http) {
        
        $scope.ir = {};
        AppService.getDataART().then(function(data) {
            $scope.dataART = data.filter(function(item) {
                return !item.artTdkAda;
            });
            $scope.ir = $rootScope.dataRT.ir || {};
            if ($scope.ir) {
                $scope.ir = AppService.deNormalisasiData($scope.ir);

                // validasi usia anak
                if ($scope.ir.id05) {
                    var strAge = AppService.getTglLahir($scope.ir.id05);
                    var umur = AppService.getAgeDetail(strAge);
                    var umurArr = umur.split('/');
                    $scope.year = parseInt(umurArr[0]);
                    $scope.month = parseInt(umurArr[1]);
                    $scope.day = parseInt(umurArr[2]);
                    $scope.allowUsia = $scope.year == 0 && $scope.month <= 6;

                    // display age
                    var strAge = AppService.getTglLahir($scope.ir.id05);
                    $scope.ir.id26 = AppService.getAgeDetailStr(strAge); 
                }

                AppService.getCurentRT($rootScope.curRT.idrt).then(function(data2) {
                    $scope.rt = data2;
                    if ($scope.rt.id04) { $scope.ir.id04 = $scope.rt.id04; } // Nama Anak
                    if ($scope.rt.id24) { $scope.ir.id24 = $scope.rt.id24; } // NIK
                    if ($scope.rt.id05) { $scope.ir.id05 = new Date($scope.rt.id05); } // tgl lahir anak
                    if ($scope.rt.id27) { $scope.ir.id27 = ''+$scope.rt.id27; } // kabupaten
                    if ($scope.rt.id23) { $scope.ir.id23 = $scope.rt.id23; } // alamat
                    if ($scope.rt.id26) { $scope.ir.id26 = $scope.rt.id26; } // usia saat wawancara
                    if ($scope.rt.id29) { $scope.ir.id29 = $scope.rt.id29; } // usia saat wawancara

                });

                
            }
        });

        $scope.umur_AllowSave = function(){
            // validasi usia anak
            if ($scope.ir.id05) {
                var strAge = AppService.getTglLahir($scope.ir.id05);
                var umur = AppService.getAgeDetail(strAge);
                var umurArr = umur.split('/');
                $scope.year = parseInt(umurArr[0]);
                $scope.month = parseInt(umurArr[1]);
                $scope.day = parseInt(umurArr[2]);
                $scope.allowUsia = $scope.year == 0 && $scope.month <= 6;

                // display age
                var strAge = AppService.getTglLahir($scope.ir.id05);
                $scope.ir.id26 = AppService.getAgeDetailStr(strAge); 
            }
        }

        $scope.tglMin6Bulan = AppService.addMonths(new Date(), -6);

        AppService.getTglWawancaraPlusSatu(true).then(function(val) {
            $scope.tglWawancara = val;
        });

        $scope.tempatPersalinanList = {
            '1': '1. Rumah Sakit',
            '2': '2. Puskesmas/Klinik',
            '3': '3. Bidan Praktek Swasta',
            '4': '4. Rumah',
        }

        $scope.pendidikanList = {
            '1': '1. SD',
            '2': '2. SMP',
            '3': '3. SMA',
            '4': '4. D3',
            '5': '5. S1',
            '6': '6. S2/S3',
        }

        $scope.asuransiList = {
            '1': '1. BPJS PBI/Jamkesos/Jamkesda',
            '2': '2. BPJS Non-PBI',
            '3': '3. Asuransi Swasta',
            '4': '4. Tidak Punya Asuransi',
        }

        $scope.AllowSave = function(myForm) {
            var ir = $scope.ir;
            allow = ir.id04 && ir.id05 && ir.id29 && ir.id27;

                    if (ir.id10 == 3) {
                        allow = allow && ir.id10a;
                    }

                    if (ir.id15 == 2) {
                        allow = allow && ir.id15a;
                    }

                    if (ir.id22 == 1) {
                        allow = allow && ir.id22a && ir.id22b && ir.id22c;
                    }
            return allow && myForm.$valid;
        };

        // Save
        $scope.save = function(finish) {
            var goTo = finish ? 'app.art' : '';
            // simpan model, termasuk yg hidden dg ng-show, exclude hidden dg ng-if
            return AppService.saveDataKelMasked('ir', $scope.ir, true, goTo);
        };

    }
})();
(function() {
    angular.module('ehdss')
        .controller('AppCtrl', AppCtrl)
        .controller('HivCtrl', HivCtrl)
        .controller('MbCtrl', MbCtrl);

    AppCtrl.$inject = ['$scope', '$state', '$ionicHistory', '$rootScope'];
    function AppCtrl($scope, $state, $ionicHistory, $rootScope) {
            // With the new view caching in Ionic, Controllers are only called
            // when they are recreated or on app start, instead of every page change.
            // To listen for when this page is active (for example, to refresh data),
            // listen for the $ionicView.enter event:
            // $scope.$on('$ionicView.enter', function(e) {
            //});
        $scope.gohome = function() {
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $state.go('app.home');
        };
    }

    HivCtrl.$inject = ['$scope', '$rootScope', '$state', '$timeout', 'AppService'];
    function HivCtrl($scope, $rootScope, $state, $timeout, AppService) {
        $scope.hiv = $rootScope.dataRT.hiv || {};
        
        if ($scope.hiv.hiv00c) {
            $scope.hiv.hiv00c = new Date($scope.hiv.hiv00c);
        }

        if ($scope.hiv.hiv00d) {
            $scope.hiv.hiv00d = AppService.deNormalisasiDataJam($scope.hiv.hiv00d);
        }
        
        AppService.getDataART().then(function(data) {
            $scope.dataART = data.filter(function(item) {
                return !item.artTdkAda;
            });

            // jika hiv00 belum terisi, ambil responden utama terpilih dari cover
            if (!$scope.hiv.hiv00) {
                $scope.dataART.forEach(function(val, idx){
                    if (val.art01 == $rootScope.dataRT.cover.krt02) {
                        $scope.hiv.hiv00 = ''+val.umur;
                    }            
                });
            }
                
        });
        $scope.save = function() {
            $rootScope.$broadcast('saving:show');
            
                // simpan semua model (termasuk hidden ng-show), kecuali yg hidden ng-if
            AppService.saveDataKel('hiv', $scope.hiv, true).then(function(data) {
                $rootScope.$broadcast('saving:hide');
                $rootScope.$broadcast('loading:show');
                $timeout(function() {
                    $rootScope.$broadcast('loading:hide');
                    $state.go('app.art');
                }, 300);
            });
        };
    }

    MbCtrl.$inject =  ['$scope', '$state', '$rootScope', 'AppService'];
    function MbCtrl($scope, $state, $rootScope, AppService) {
        $scope.mb = $rootScope.dataRT.mb || {};
        var lastMb = angular.copy($scope.mb);
        $scope.dataChanged = false;

        $scope.mbItem = {
            a: 'Makanan dan minuman manis',
            b: 'Makanan asin',
            c: 'Makanan berlemak / berkolesterol / gorengan',
            d: 'Makanan yang dibakar',
            e: 'Makanan daging / ayam / ikan olahan dengan pengawet',
            f: 'Bumbu penyedap',
            g: 'Kopi',
            h: 'Minuman berkafein bukan kopi',
            i: 'Ikan asin',
            j: 'Jamu',
            k: 'Mie instan'
        };

            // jika performance melambat, fungsi ini mungkin perlu  dihilangkan
            // atau dicari alternatif lainnya..
        $scope.$watch('mb', function(newV, oldV) {
            $scope.dataChanged = !angular.equals(lastMb, $scope.mb);
            if ($scope.dataChanged) {
                $scope.dataChanged = true;
                $scope.btnSaveTitle = 'Simpan';
            } else {
                $scope.dataChanged = false;
                $scope.btnSaveTitle = 'Selanjutnya (INS)';
            }
        }, true);

        $scope.save = function() {
            if ($scope.dataChanged) {
                    // MB tidak ada model dengan ng-show atau ng-if, jd skip filter
                AppService.saveDataKelMasked('mb', $scope.mb, false, 'app.ins');
            } else {
                $state.go('app.ins');
            }
        };
    }
})();

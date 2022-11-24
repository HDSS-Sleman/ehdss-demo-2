(function() {
    angular.module('ehdss')
        .controller('InsCtrl', InsCtrl);

    InsCtrl.$inject = ['$scope', '$state', '$rootScope', '$timeout', '$ionicModal', '$ionicPopup', 'AppService'];

    function InsCtrl($scope, $state, $rootScope, $timeout, $ionicModal, $ionicPopup, AppService) {
        // untuk menyimpan data KRP
        $scope.ins = $rootScope.dataRT.ins || {};
        var lastIns = angular.copy($scope.ins);
        $scope.dataChanged = false;

        // jika performance melambat, fungsi ini mungkin perlu  dihilangkan
        // atau dicari alternatif lainnya..
        $scope.$watch('ins', function(newV, oldV) {
            $scope.dataChanged = !angular.equals(lastIns, $scope.ins);
            if ($scope.dataChanged) {
                $scope.dataChanged = true;
                $scope.btnSaveTitle = 'Simpan';
            } else {
                $scope.dataChanged = false;
                $scope.btnSaveTitle = 'Selanjutnya (AKS)';
            }
        }, true);

        $scope.save = function(finish) {
            if (!$scope.dataChanged) {
                $state.go('app.aks');
            } else {
                var ins = $scope.ins;
                if (ins.ins01 == 2 || ins.ins01 == 98) {
                    if (ins.ins01a) {
                        delete ins.ins01a;
                    }
                    if (ins.ins01b) {
                        delete ins.ins01b;
                    }
                    if (ins.ins01c) {
                        delete ins.ins01c;
                    }
                    if (ins.ins01d) {
                        delete ins.ins01d;
                    }
                    if (ins.ins01dl) {
                        delete ins.ins01dl;
                    }
                    if (ins.ins02a) {
                        delete ins.ins02a;
                    }
                    if (ins.ins02b) {
                        delete ins.ins02b;
                    }
                }
                var goTo = finish ? 'app.aks' : '';
                // simpan semua model (termasuk hidden ngShow), kecuali yg hidden ng-if
                return AppService.saveDataKelMasked('ins', $scope.ins, true, goTo);
            }
        };

    }
})();

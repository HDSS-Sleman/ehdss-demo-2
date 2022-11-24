(function() {
    angular.module('ehdss')
        .controller('PrpCtrl', PrpCtrl);

    PrpCtrl.$inject = ['$scope', '$rootScope', '$state', '$ionicModal', '$window', '$ionicLoading', '$timeout', 'AppService'];

    function PrpCtrl($scope, $rootScope, $state, $ionicModal, $window, $ionicLoading, $timeout, AppService) {
        
        $scope.prp = $rootScope.dataRT.prp || {};
        // reset dulu ke empty object
        // $scope.prp = {};
        AppService.getDataART().then(function(data) {
            $scope.dataART = data.filter(function(item) {
                return !item.artTdkAda;
            });
        });
              
        $scope.allowSave = function(myForm) {
            var prp = $scope.prp;
            jum = prp.prp01 || prp.prp02a || prp.prp02b || prp.prp02c || prp.prp02d || prp.prp02e ||
                    prp.prp02f || prp.prp02g || prp.prp02h || prp.prp02i || prp.prp02j || prp.prp02k ||
                    prp.prp02l;
                ;
            // jum =   prp.prp01 + prp.prp02a + prp.prp02b + prp.prp02c + prp.prp02d + prp.prp02e +
            //         prp.prp02f + prp.prp02g + prp.prp02h + prp.prp02i + prp.prp02j + prp.prp02k +
            //         prp.prp02l + prp.prp02v; 
            if (isNaN(jum)) {
                allow = false;
            }else{
                allow = true;
            }
            
            // prp.prp02v1
            console.log(allow);

            return allow && myForm.$valid;
        }

        $scope.save = function(finish) {
            // console.log($scope.prp);
            var goTo = finish ? 'app.hrt' : '';
            // simpan model, termasuk yg hidden dg ng-show, exclude hidden dg ng-if
            return AppService.saveDataKelMasked('prp', $scope.prp, true, goTo);
        };
    }
})();
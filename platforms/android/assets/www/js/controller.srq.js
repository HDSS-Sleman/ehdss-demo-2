(function() {
    angular.module('ehdss')
        .controller('SrqCtrl', SrqCtrl);

    SrqCtrl.$inject = ['$scope', '$state', '$rootScope', '$timeout', 'AppService'];

    function SrqCtrl($scope, $state, $rootScope, $timeout, AppService) {      

        $scope.curART = $rootScope.curART;
        $scope.idrt = $scope.curART.idrt || $rootScope.dataRT.idrt;
        $scope.idart = $scope.curART.art03b || $scope.curART.artb03b;
        $scope.curART._nama = $scope.curART.art01;
        $scope.srq = {};

        AppService.getDataKel($scope.idrt, 'srq', $scope.idart).then(function(data) {
            $scope.srq = data || {};
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
                var goTo = 'app.aksi';
            }

            $scope.srq.srq = 1;
            $rootScope.$broadcast('saving:show');
            AppService.saveDataKel('srq', $scope.srq).then(function(data) {
                $rootScope.$broadcast('saving:hide');
                $rootScope.$broadcast('loading:show');
                $timeout(function() {
                    $rootScope.$broadcast('loading:hide');
                        $state.go(goTo);
                }, 300);
            });
        };

        $scope.allowSave = function(myForm) {
            var srq = $scope.srq;
            var allow = srq.srq01 && srq.srq02 && srq.srq03 && srq.srq04 && srq.srq05 &&
                        srq.srq06 && srq.srq07 && srq.srq08 && srq.srq09 && srq.srq10 &&
                        srq.srq11 && srq.srq12 && srq.srq13 && srq.srq14 && srq.srq15 &&
                        srq.srq16 && srq.srq17 && srq.srq18 && srq.srq19 && srq.srq20 &&
                        srq.srq21 && srq.srq22 && srq.srq23;

            return allow && myForm.$valid;
        };
    }
})();
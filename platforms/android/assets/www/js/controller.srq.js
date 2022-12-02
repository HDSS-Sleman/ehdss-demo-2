(function() {
    angular.module('ehdss')
        .controller('SrqCtrl', SrqCtrl);

    SrqCtrl.$inject = ['$scope', '$state', '$rootScope', '$timeout', 'AppService'];

    function SrqCtrl($scope, $state, $rootScope, $timeout, AppService) {      

        if (!$rootScope.idrt) {
            $state.go('app.home'); // jika tidak ada idrt kembali ke home
            return false;
        }

        $scope.srq = {};

        AppService.getDataKel($rootScope.idrt, 'srq').then(function(data) {
            $scope.srq = data || {};
        });

        AppService.getTglWawancaraPlusSatu(true).then(function(val) {
            $scope.tglMaxEntry = val;
        })

        $scope.listSrq1 = {
            '01' : 'Apakah Anda sering menderita sakit kepala?',
            '02' : 'Apakah Anda tidak nafsu makan?',
            '03' : 'Apakah Anda tidur tidak nyenyak?',
            '04' : 'Apakah Anda mudah merasa takut?',
            '05' : 'Apakah Anda merasa cemas, tegang, atau khawatir?',
            '06' : 'Apakah tangan Anda gemetar?',
            '07' : 'Apakah Anda mengalami gangguan pencernaan?',
            '08' : 'Apakah Anda merasa sulit berpikir jernih?',
            '09' : 'Apakah Anda merasa tidak bahagia?'
        }
        $scope.listSrq2 = {
            '10' : 'Apakah Anda lebih sering menangis?'
        }

         /* simpan data*/
        $scope.save = function(modul) {
            $scope.srq.srq = 1;
            var goTo = modul ? 'app.'+modul : '';
            // simpan model, termasuk yg hidden dg ng-show, exclude hidden dg ng-if
            return AppService.saveDataKelMasked('srq', $scope.srq, true, goTo);
        };

        $scope.allowSave = function(myForm) {
            var srq = $scope.srq;
            var allow = srq.srq01 && srq.srq02 && srq.srq03 && srq.srq04 && srq.srq05 &&
                        srq.srq06 && srq.srq07 && srq.srq08 && srq.srq09 && srq.srq10;

            return allow && myForm.$valid;
        };


    }
})();
(function() {
    angular.module('ehdss')
        .controller('HlCtrl', HlCtrl);

    HlCtrl.$inject = ['$scope', '$rootScope', '$state', '$ionicModal', '$window', '$ionicLoading', '$timeout', 'AppService'];

    function HlCtrl($scope, $rootScope, $state, $ionicModal, $window, $ionicLoading, $timeout, AppService, $cordovaMedia) {
        
        var curART = $rootScope.curART;
        var idrt = curART.idrt || $rootScope.dataRT.idrt;
        var idart = curART.art03b || curART.artb03b;
        $scope.curART = curART;
        $scope.curART._nama = curART.art01;
        
        // reset dulu ke empty object
        $scope.hl = {};
        AppService.getDataKel(idrt, 'hl', idart).then(function(data) {
            $scope.hl = data || {};
            $scope.hl.hl = 1;
         
        });

        $scope.literacy = true;
       
        $scope.nama = $rootScope.curART._nama;
        $scope.nokoma = {
            word: /^[^,]*$/ //regex allow selain koma
        };

        AppService.getTglWawancaraPlusSatu(true).then(function(val) {
            $scope.tglWawancara = val;
        });

        // Display/Tidak Tombol selanjutnya
        $scope.literacyAllowSave = function(){
            var hl = $scope.hl;
            var allow = hl.hl01 && hl.hl02 && hl.hl03 && hl.hl04 && hl.hl05 && hl.hl06 &&
                        hl.hl07 && hl.hl08 && hl.hl09 && hl.hl10 && hl.hl11 && hl.hl12 &&
                        hl.hl13 && hl.hl14 && hl.hl15 && hl.hl16;
            return allow;
        }

        
        $scope.go = function(curMenu, toMenu) {
            $scope.save().then(function() {
                $scope[toMenu] = true;
                $scope[curMenu] = false;
            });
        };

        // Save
        $scope.save = function(finish, param) {
            if (param == 'individu') {
                /* Jika wawancara berhenti di tengah jalan*/
                $rootScope.catatanModulUtama = false; $rootScope.catatanModulB = true;
                $rootScope.tab_catatan = true; // langsung buka tab catatan
                $rootScope.tab_cover = false; // tab cover di hide dulu
                var goTo = 'app.art_cover';
            }else{
                var goTo = finish ? 'app.dse' : '';
            }

            // simpan model, termasuk yg hidden dg ng-show, exclude hidden dg ng-if
            return AppService.saveDataKelMasked('hl', $scope.hl, true, goTo);
        };

    }
})();

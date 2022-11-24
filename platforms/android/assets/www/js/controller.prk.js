(function() {
    angular.module('ehdss')
        .controller('PrkCtrl', PrkCtrl);

    PrkCtrl.$inject = ['$scope', '$state', '$rootScope', '$timeout', 'AppService', '$ionicPopup', '$http'];

    function PrkCtrl($scope, $state, $rootScope, $timeout, AppService, $ionicPopup, $http) {
        
        $scope.prk = {};
        AppService.getDataART().then(function(data) {
            $scope.dataART = data.filter(function(item) {
                return !item.artTdkAda;
            });
            $scope.prk = $rootScope.dataRT.prk || {};
            if ($scope.prk) {
                $scope.prk = AppService.deNormalisasiData($scope.prk);
            }
        });

        AppService.getTglWawancaraPlusSatu(true).then(function(val) {
            $scope.tglWawancara = val;
        });

        $scope.nutrisi = true;
        $scope.kesehatan = false;
        $scope.pembelajaran = false;
        $scope.menstimulasi = false;
        $scope.respon = false;
        $scope.keselamatan = false;
        $scope.mental = false;

        $scope.prk1List = {
            'a': 'Segera setelah melahirkan apakah Ibu melakukan inisiasi menyusui dini?',
            'b': 'Apakah Ibu memberikan kolustrum pada putra/putri Ibu?'
        }

        $scope.prk2List = {
            'a': 'Seberapa sering ibu menimbang putra/putri ibu dan mencatat ke dalam buku KIA?',
            'b': 'Seberapa sering ibu memberikan imunisasi pada putra/putri ibu sesuai dengan jadwal/anjuran?',
            'c': 'Seberapa sering ibu mencuci tangan dengan air dan sabun sebelum menyiapkan atau memberi makan?',
            'd': 'Seberapa sering ibu mencuci tangan dengan air dan sabun setelah mengganti popok?'
        }

        $scope.prk31List = {
            'a': 'Apakah putra/putri Ibu mempunyai dua atau lebih mainan di rumah?',
            'b': 'Apakah Ibu mempunyai 3 atau lebih buku bergambar untuk putra/putri Ibu di rumah?'
        }

        $scope.prk32List = {
            'c': 'Seberapa sering Ibu meluangkan waktu untuk bermain/ bercerita/ bernyanyi bersama putra/putri ibu?',
            'd': 'Seberapa sering Ibu mencium/ memeluk putra/putri ibu?',
            'e': 'Seberapa sering Ibu mendorong putra/putri Ibu menirukan suara dan memperhatikan suara mereka?'
        }

        $scope.prk4List = {
            'a': 'Jika putra/putri Ibu terlihat sakit, seberapa sering Ibu memeriksakan putra/putri Ibu ke petugas atau fasilitas kesehatan? ',
            'b': 'Seberapa sering Ibu memaksa putra/putri Ibu menghabiskan porsi makan?',
            'c': 'Seberapa sering Ibu menyuapi makan putra/putri Ibu sambil bermain atau nonton TV?',
            'd': 'Seberapa sering Ibu meninggalkan putra/putri Ibu sendiri atau dalam pengasuhan anak di bawah 10 tahun, selama lebih dari satu jam?'
        }

        $scope.prk51List = {
            'a': 'Seberapa sering ibu menjaga putra/putri ibu dari benda benda berbahaya seperti benda tajam, listrik?',
            'b': 'Seberapa sering ibu meninggalkan putra/putri sendirian ditempat ketinggian?',
            'c': 'Seberapa sering ibu mencubit, bila putra/putri Ibu rewel atau menjengkelkan?'
        }

        $scope.prk52List = {
            'd': 'Apakah Ibu menyediakan air minum yang aman di rumah?',
            'e': 'Apakah Ibu menyediakan sanitasi yang yang aman, termasuk fasilitas cuci tangan dengan sabun dan air?'
        }

        $scope.prk6List = {
            'a': 'Berguling',
            'b': 'Memegang mainan dengan dua tangan',
            'c': 'Mengenalkan dan menunjuk nama papa/mama dan benda disekitar',
            'd': 'Tepuk tangan, salim tangan'
        }

        $scope.optionList = {
            '1': 'Tidak pernah',
            '2': 'Kadang-kadang',
            '3': 'Sering',
            '4': 'Selalu'
        }

        $scope.nutrisiAllowSave = function() {
            var prk = $scope.prk;
            allow = prk.prk1a && prk.prk1b;

            return allow;
        };

        $scope.kesehatanAllowSave = function() {
            var prk = $scope.prk;
            allow = prk.prk2a && prk.prk2b && prk.prk2c && prk.prk2d;

            return allow;
        }

        $scope.pembelajaranAllowSave = function() {
            var prk = $scope.prk;
            allow = prk.prk3a && prk.prk3b && prk.prk3c && prk.prk3d && prk.prk3e;

            return allow;
        }

        $scope.menstimulasiAllowSave = function() {
            var prk = $scope.prk;
            allow = prk.prk6a && prk.prk6b && prk.prk6c && prk.prk6d;

            return allow;
        }

        $scope.responAllowSave = function() {
            var prk = $scope.prk;
            allow = prk.prk4a && prk.prk4b && prk.prk4c && prk.prk4d;

            return allow;
        }

        $scope.keselamatanAllowSave = function() {
            var prk = $scope.prk;
            allow = prk.prk5a && prk.prk5b && prk.prk5c && prk.prk5d && prk.prk5e;

            return allow;
        }

        $scope.mentalAllowSave = function() {
            var prk = $scope.prk;
            allow = prk.prk7a;

            return allow;
        }

        

        $scope.go = function(toMenu, curMenu) {
            $scope.save().then(function() {
                $scope[toMenu] = true;
                $scope[curMenu] = false;
            });
        };
        
        // Save
        $scope.save = function(finish) {
            var goTo = finish ? 'app.art' : '';
            // simpan model, termasuk yg hidden dg ng-show, exclude hidden dg ng-if
            return AppService.saveDataKelMasked('prk', $scope.prk, true, goTo);
        };

    }
})();
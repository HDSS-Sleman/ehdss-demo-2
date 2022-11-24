(function() {
    angular.module('ehdss')
        .controller('KsmCtrl', KsmCtrl);

    KsmCtrl.$inject = ['$scope', '$rootScope', '$state', '$ionicModal', '$window', '$ionicLoading', '$timeout', 'AppService'];

    function KsmCtrl($scope, $rootScope, $state, $ionicModal, $window, $ionicLoading, $timeout, AppService) {
        
        $scope.ksm = $rootScope.dataRT.ksm || {};
        // reset dulu ke empty object
        // $scope.ksm = {};
        var ksm = $scope.ksm;
        AppService.getDataART().then(function(data) {
            $scope.dataART = data.filter(function(item) {
                return !item.artTdkAda;
            });
        });

        // default value
        if(ksm.ksm01a1b == 2){ksm.ksm01a1b = 2}else{ksm.ksm01a1b = 1};ksm.ksm01a1 = 'Beras';
        if(ksm.ksm01a2b == 2){ksm.ksm01a2b = 2}else{ksm.ksm01a2b = 1};ksm.ksm01a2 = 'Umbi-umbian';
        if(ksm.ksm01a3b == 2){ksm.ksm01a3b = 2}else{ksm.ksm01a3b = 1};ksm.ksm01a3 = 'Jagung';
        if(ksm.ksm01a4b == 2){ksm.ksm01a4b = 2}else{ksm.ksm01a4b = 1};ksm.ksm01a4 = 'Mie instan';
        if(ksm.ksm01a5b == 2){ksm.ksm01a5b = 2}else{ksm.ksm01a5b = 1};ksm.ksm01a5 = 'Roti tawar';
        if(ksm.ksm01a6ab == 2){ksm.ksm01a6ab = 2}else{ksm.ksm01a6ab = 1};
        if(ksm.ksm01a6bb == 2){ksm.ksm01a6bb = 2}else{ksm.ksm01a6bb = 1};
        if(ksm.ksm01a6cb == 2){ksm.ksm01a6cb = 2}else{ksm.ksm01a6cb = 1};
        if(ksm.ksm01a6db == 2){ksm.ksm01a6db = 2}else{ksm.ksm01a6db = 1};

        if(ksm.ksm01b1b == 2){ksm.ksm01b1b = 2}else{ksm.ksm01b1b = 1};ksm.ksm01b1 = 'Ayam';
        if(ksm.ksm01b2b == 2){ksm.ksm01b2b = 2}else{ksm.ksm01b2b = 1};ksm.ksm01b2 = 'Daging';
        if(ksm.ksm01b3b == 2){ksm.ksm01b3b = 2}else{ksm.ksm01b3b = 1};ksm.ksm01b3 = 'Telur';
        if(ksm.ksm01b4b == 2){ksm.ksm01b4b = 2}else{ksm.ksm01b4b = 1};ksm.ksm01b4 = 'Ikan';
        if(ksm.ksm01b5b == 2){ksm.ksm01b5b = 2}else{ksm.ksm01b5b = 1};ksm.ksm01b5 = 'Lauk Olahan';
        if(ksm.ksm01b6ab == 2){ksm.ksm01b6ab = 2}else{ksm.ksm01b6ab = 1};
        if(ksm.ksm01b6bb == 2){ksm.ksm01b6bb = 2}else{ksm.ksm01b6bb = 1};
        if(ksm.ksm01b6cb == 2){ksm.ksm01b6cb = 2}else{ksm.ksm01b6cb = 1};
        if(ksm.ksm01b6db == 2){ksm.ksm01b6db = 2}else{ksm.ksm01b6db = 1};

        if(ksm.ksm01c1b == 2){ksm.ksm01c1b = 2}else{ksm.ksm01c1b = 1};ksm.ksm01c1 = 'Tahu';
        if(ksm.ksm01c2b == 2){ksm.ksm01c2b = 2}else{ksm.ksm01c2b = 1};ksm.ksm01c2 = 'Tempe';
        if(ksm.ksm01c3b == 2){ksm.ksm01c3b = 2}else{ksm.ksm01c3b = 1};ksm.ksm01c3 = 'Kacang-kacangan';
        if(ksm.ksm01c4ab == 2){ksm.ksm01c4ab = 2}else{ksm.ksm01c4ab = 1};
        if(ksm.ksm01c4bb == 2){ksm.ksm01c4bb = 2}else{ksm.ksm01c4bb = 1};
        if(ksm.ksm01c4cb == 2){ksm.ksm01c4cb = 2}else{ksm.ksm01c4cb = 1};
        if(ksm.ksm01c4db == 2){ksm.ksm01c4db = 2}else{ksm.ksm01c4db = 1};

        if(ksm.ksm01d1b == 2){ksm.ksm01d1b = 2}else{ksm.ksm01d1b = 1};ksm.ksm01d1 = 'Buah-buahan';
        if(ksm.ksm01e1b == 2){ksm.ksm01e1b = 2}else{ksm.ksm01e1b = 1};ksm.ksm01e1 = 'Sayur-sayuran';
        if(ksm.ksm01f1b == 2){ksm.ksm01f1b = 2}else{ksm.ksm01f1b = 1};ksm.ksm01f1 = 'Gula';
        if(ksm.ksm01g1b == 2){ksm.ksm01g1b = 2}else{ksm.ksm01g1b = 1};ksm.ksm01g1 = 'Garam';
        if(ksm.ksm01g2b == 2){ksm.ksm01g2b = 2}else{ksm.ksm01g2b = 1};ksm.ksm01g2 = 'Bumbu penyedap';

        if(ksm.ksm01h1b == 2){ksm.ksm01h1b = 2}else{ksm.ksm01h1b = 1};ksm.ksm01h1 = 'Susu bubuk';
        if(ksm.ksm01h2b == 2){ksm.ksm01h2b = 2}else{ksm.ksm01h2b = 1};ksm.ksm01h2 = 'Susu cair';
        if(ksm.ksm01h3ab == 2){ksm.ksm01h3ab = 2}else{ksm.ksm01h3ab = 1};
        if(ksm.ksm01h3bb == 2){ksm.ksm01h3bb = 2}else{ksm.ksm01h3bb = 1};
        if(ksm.ksm01h3cb == 2){ksm.ksm01h3cb = 2}else{ksm.ksm01h3cb = 1};
        if(ksm.ksm01h3db == 2){ksm.ksm01h3db = 2}else{ksm.ksm01h3db = 1};

        if(ksm.ksm01i1b == 2){ksm.ksm01i1b = 2}else{ksm.ksm01i1b = 1};ksm.ksm01i1 = 'Minyak kelapa/goreng';
        if(ksm.ksm01i2b == 2){ksm.ksm01i2b = 2}else{ksm.ksm01i2b = 1};ksm.ksm01i2 = 'Minyak curah';
        if(ksm.ksm01i3b == 2){ksm.ksm01i3b = 2}else{ksm.ksm01i3b = 1};ksm.ksm01i3 = 'Mentega';
        if(ksm.ksm01i4b == 2){ksm.ksm01i4b = 2}else{ksm.ksm01i4b = 1};ksm.ksm01i4 = 'Margarin';
        if(ksm.ksm01i5b == 2){ksm.ksm01i5b = 2}else{ksm.ksm01i5b = 1};ksm.ksm01i5 = 'Kelapa';
        if(ksm.ksm01i6ab == 2){ksm.ksm01i6ab = 2}else{ksm.ksm01i6ab = 1};
        if(ksm.ksm01i6bb == 2){ksm.ksm01i6bb = 2}else{ksm.ksm01i6bb = 1};
        if(ksm.ksm01i6cb == 2){ksm.ksm01i6cb = 2}else{ksm.ksm01i6cb = 1};
        if(ksm.ksm01i6db == 2){ksm.ksm01i6db = 2}else{ksm.ksm01i6db = 1};

        if(ksm.ksm01j1b == 2){ksm.ksm01j1b = 2}else{ksm.ksm01j1b = 1};ksm.ksm01j1b = 1;ksm.ksm01j1 = 'Air kemasan';
        if(ksm.ksm01j2b == 2){ksm.ksm01j2b = 2}else{ksm.ksm01j2b = 1};ksm.ksm01j2b = 1;ksm.ksm01j2 = 'Minuman soda';
        if(ksm.ksm01j3b == 2){ksm.ksm01j3b = 2}else{ksm.ksm01j3b = 1};ksm.ksm01j3b = 1;ksm.ksm01j3 = 'Teh';
        if(ksm.ksm01j4b == 2){ksm.ksm01j4b = 2}else{ksm.ksm01j4b = 1};ksm.ksm01j4b = 1;ksm.ksm01j4 = 'Kopi';
        if(ksm.ksm01j5ab == 2){ksm.ksm01j5ab = 2}else{ksm.ksm01j5ab = 1};ksm.ksm01j5ab = 1;
        if(ksm.ksm01j5bb == 2){ksm.ksm01j5bb = 2}else{ksm.ksm01j5bb = 1};ksm.ksm01j5bb = 1;
        if(ksm.ksm01j5cb == 2){ksm.ksm01j5cb = 2}else{ksm.ksm01j5cb = 1};ksm.ksm01j5cb = 1;
        if(ksm.ksm01j5db == 2){ksm.ksm01j5db = 2}else{ksm.ksm01j5db = 1};ksm.ksm01j5db = 1;

        if(ksm.ksm01k1b == 2){ksm.ksm01k1b = 2}else{ksm.ksm01k1b = 1};
        if(ksm.ksm01k2b == 2){ksm.ksm01k2b = 2}else{ksm.ksm01k2b = 1};
        if(ksm.ksm01k3b == 2){ksm.ksm01k3b = 2}else{ksm.ksm01k3b = 1};
        if(ksm.ksm01k4b == 2){ksm.ksm01k4b = 2}else{ksm.ksm01k4b = 1};
        
        // default value untuk lainnya
        ksm.ksm01a6a = ksm.ksm01a6a || '-';
        ksm.ksm01a6b = ksm.ksm01a6b || '-';
        ksm.ksm01a6c = ksm.ksm01a6c || '-';
        ksm.ksm01a6d = ksm.ksm01a6d || '-';

        ksm.ksm01b6a = ksm.ksm01b6a || '-';
        ksm.ksm01b6b = ksm.ksm01b6b || '-';
        ksm.ksm01b6c = ksm.ksm01b6c || '-';
        ksm.ksm01b6d = ksm.ksm01b6d || '-';

        ksm.ksm01c4a = ksm.ksm01c4a || '-';
        ksm.ksm01c4b = ksm.ksm01c4b || '-';
        ksm.ksm01c4c = ksm.ksm01c4c || '-';
        ksm.ksm01c4d = ksm.ksm01c4d || '-';

        ksm.ksm01h3a = ksm.ksm01h3a || '-';
        ksm.ksm01h3b = ksm.ksm01h3b || '-';
        ksm.ksm01h3c = ksm.ksm01h3c || '-';
        ksm.ksm01h3d = ksm.ksm01h3d || '-';

        ksm.ksm01i6a = ksm.ksm01i6a || '-';
        ksm.ksm01i6b = ksm.ksm01i6b || '-';
        ksm.ksm01i6c = ksm.ksm01i6c || '-';
        ksm.ksm01i6d = ksm.ksm01i6d || '-';

        ksm.ksm01j5a = ksm.ksm01j5a || '-';
        ksm.ksm01j5b = ksm.ksm01j5b || '-';
        ksm.ksm01j5c = ksm.ksm01j5c || '-';
        ksm.ksm01j5d = ksm.ksm01j5d || '-';

        ksm.ksm01k1 = ksm.ksm01k1 || '-';
        ksm.ksm01k2 = ksm.ksm01k2 || '-';
        ksm.ksm01k3 = ksm.ksm01k3 || '-';
        ksm.ksm01k4 = ksm.ksm01k4 || '-';

        $scope.makanan_pokok = true;
        $scope.lauk_hewani = false;
        $scope.lauk_nabati = false;
        $scope.buah_buahan = false;
        $scope.sayur_sayuran = false;
        $scope.gula = false;
        $scope.bumbu = false;
        $scope.susu = false;
        $scope.minyak = false;
        $scope.minuman = false;
        $scope.makanan_lainnya = false;
        
        $scope.go = function(toMenu, curMenu) {
            $scope.save().then(function() {
                $scope[toMenu] = true;
                $scope[curMenu] = false;
            });
        };

        // Save
        $scope.save = function(finish) {
            var goTo = finish ? 'app.prp' : '';
            // simpan model, termasuk yg hidden dg ng-show, exclude hidden dg ng-if
            return AppService.saveDataKelMasked('ksm', $scope.ksm, true, goTo);
        };

        //Contoh pengambilan data (nama bisa diganti dengan id yg unik)
        // $scope.saveModal = function(pm, nama) {
        //     // simpan model, termasuk yg hidden dg ng-show, exclude hidden dg ng-if
        //     AppService.saveDataKelMasked('pm', $scope.pm, true, 'app.pm').then(function() {
        //         modalSaved = true;
        //         lastPm = angular.copy($scope.pm);
        //         $scope.modal.hide();
        //     });
        // };
    }
})();

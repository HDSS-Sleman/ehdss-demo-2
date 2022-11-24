(function() {
    angular.module('ehdss')
        .controller('AghCtrl', AghCtrl);

    AghCtrl.$inject = ['$scope', '$rootScope', '$state', '$ionicModal', '$window', '$ionicLoading', '$timeout', 'AppService'];

    function AghCtrl($scope, $rootScope, $state, $ionicModal, $window, $ionicLoading, $timeout, AppService) {
        $scope.curART = $rootScope.curART;
        $scope.idrt = $scope.curART.idrt || $rootScope.dataRT.idrt;
        $scope.idart = $scope.curART.art03b || $scope.curART.artb03b;
        $scope.nama = $rootScope.curART._nama;;
        $scope.agh = {};

        AppService.getDataKel($scope.idrt, 'agh', $scope.idart).then(function(data) {
            $scope.agh = data || {};
            $scope.agh.agh = 1;
        });

        $scope.pola_makan = false;
        $scope.garam = false;
        $scope.aktivitas_fisik = true; // siklus 6 langsung ke aktifitas fisik
        $scope.penggunaan_tembakau = false;
        $scope.antropometri = false;
        $scope.antropometri2 = false;
        $scope.antropometri3 = false;

        

        // Display/Tidak Tombol selanjutnya (aktivitas_fisik)
        $scope.polaMakanAllowSave = function() {
            var agh = $scope.agh;
            var allow = agh.e2b && agh.e4b;
                if (agh.e2b == 1) {
                    allow = allow && agh.e2aa && agh.e2a && agh.e2;
                }
                if (agh.e4b == 1) {
                    allow = allow && agh.e4aa && agh.e4a && agh.e4;
                }
            return allow;
        };

        // Display/Tidak Tombol selanjutnya (garam)
        $scope.garamAllowSave = function() {
            var agh = $scope.agh;
            var allow = agh.i11 && agh.i12 && agh.i13 && agh.i14;
            return allow;
        };

        // Display/Tidak Tombol selanjutnya (penggunaan_tembakau)
        $scope.aktivitasFisikAllowSave = function() {
            var agh = $scope.agh;
            var allow = agh.f1 && agh.f4 && agh.f7 && agh.f10 && agh.f13 && (agh.f16a || agh.f16b) && agh.pacov01;
                if(agh.f1 == 1){
                    allow = allow && agh.f2 && (agh.f3a || agh.f3b);
                }
                if (agh.f4 == 1) {
                    allow = allow && agh.f5 && (agh.f6a || agh.f6b);
                }
                if (agh.f7 == 1) {
                    allow = allow && agh.f8 && (agh.f9a || agh.f9b);
                }
                if (agh.f10 == 1) {
                    allow = allow && agh.f11 && (agh.f12a || agh.f12b);
                }
                if (agh.f13 == 1) {
                    allow = allow && agh.f14 && (agh.f15a || agh.f15b);
                }

            return allow;
        };

        // Display/Tidak Tombol selanjutnya (antropometri)
        $scope.penggunaanTembakauAllowSave = function() {
            var agh = $scope.agh;
            var allow = agh.g05; // validasi rokok elektrik, tidak digunakan di siklus 6 bagian merokok : agh.g09 && agh.g10 && agh.g11;
                if (agh.g05 == 1 || agh.g05 == 3) {
                    allow = allow && agh.g06 && ( (!isNaN(agh.g08a1) && agh.g08a1!=0) || (!isNaN(agh.g08b1) && agh.g08b1!=0) );
                }
                if (agh.g05 == 2 || agh.g05 == 4) {
                    allow = allow && agh.g07 && ( (!isNaN(agh.g08a2) && agh.g08a2!=0) || (!isNaN(agh.g08b2) && agh.g08b2!=0) );
                }
                if (agh.g05 < 5) { // jika merokok, tanyakan intensitas merokok waktu covid
                    allow = allow && agh.tobcov01;
                }
                // validasi rokok elektrik tidak digunakan di siklus 6 bagian merokok
                // if (agh.g10 == 1 ) {
                //     allow = allow && (agh.g11 >= 1 && agh.g11 <= 7); 
                // }
                // if (agh.g10 == 2 ) {
                //     allow = allow && (agh.g11 >= 2 && agh.g11 <= 7); 
                // }
                // if (agh.g10 == 3 ) {
                //     allow = allow && (agh.g11 >= 3 && agh.g11 <= 7); 
                // }
                // if (agh.g10 == 4 ) {
                //     allow = allow && (agh.g11 >= 3 && agh.g11 <= 7); 
                // }
                // if (agh.g10 == 5 ) {
                //     allow = allow && (agh.g11 >= 3 && agh.g11 <= 7); 
                // }
                // if (agh.g10 == 6 ) {
                //     allow = allow && (agh.g11 >= 4 && agh.g11 <= 7); 
                // }
                // if (agh.g10 == 7 ) {
                //     allow = allow && (agh.g11 >= 5 && agh.g11 <= 7); 
                // }
                // // jika G10 tepat 10 hari dan G11 tepat 10 hari
                // if (agh.g10 == 5 && agh.g11 == 3) {
                //     allow = allow && agh.g12;
                // }
                // if (agh.g10 == 6 && agh.g11 == 4) {
                //     allow = allow && agh.g13;
                // }
            return allow;
        };

        $scope.antropometriAllowSave  = function() {
            var agh = $scope.agh;
            var allow = true; 
                        // agh.h1 && (!isNaN(agh.h2a)) && (!isNaN(agh.h2b)) && (!isNaN(agh.h3a)) && (!isNaN(agh.h3b)) && (!isNaN(agh.h4a)) && (!isNaN(agh.h4b)) &&
                        // agh.h5 && agh.h6 && (!isNaN(agh.h7) && agh.h7!=0) && (!isNaN(agh.h8) && agh.h8!=0);
            return allow;
        };

        $scope.antropometri2AllowSave  = function() {
            var agh = $scope.agh;
            var allow = true;
            return allow;
        };

        $scope.antropometri3AllowSave  = function() {
            var agh = $scope.agh;
            var allow = true;
            return allow;
        };

        $scope.go = function(toMenu, curMenu) {
            $scope.save().then(function() {
                $scope[toMenu] = true;
                $scope[curMenu] = false;
            });
        };

        $scope.getPorsi = function(jenis, berat){
            if (jenis == 'buah') {
                $scope.agh.e2 = berat/80;
            }else{
                $scope.agh.e4 = berat/80;
            }
        };
        $scope.getBMI = function(bb, tb){
            if (bb && tb) {
                $scope.agh.h12 = bb / ((tb*0.01) * (tb*0.01));
            }
        }

        /* simpan data*/
        $scope.save = function(finish) {
            $rootScope.tab_konfirmasi_individu = false;
            $rootScope.tab_laporan_individu = true;
            var goTo = finish ? 'app.ktlpi' : ''; // ketika finish, ke laporan wawancara dulu
            // simpan model, termasuk yg hidden dg ng-show, exclude hidden dg ng-if
            return AppService.saveDataKelMasked('agh', $scope.agh, true, goTo);
        };
    }
})();

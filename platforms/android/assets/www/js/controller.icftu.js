(function() {
    angular.module('ehdss')
        .controller('IcftuCtrl', IcftuCtrl);

    IcftuCtrl.$inject = ['$scope', '$state', '$rootScope', '$timeout', 'AppService', '$ionicPopup', '$http'];

    function IcftuCtrl($scope, $state, $rootScope, $timeout, AppService, $ionicPopup, $http) {
        
        AppService.getDataART().then(function(data) {
            $scope.dataART = data.filter(function(item) {
                return !item.artTdkAda;
            });
            $scope.icftu = $rootScope.dataRT.icftu || {};

            // ambil data nama,umur, alamat responden dari laporan telepon
            $scope.dataART.forEach(function(val,idx){
                AppService.getLaporanTelepon($rootScope.dataRT.idrt).then(function(dataL) {
                    if (dataL.ktlp08 || dataL.ktlp09) {
                        if (val.art00 == dataL.ktlp08 || val.artb00 == dataL.ktlp08) {
                            $scope.nama_responden = val._nama;
                            $scope.umur_responden = val.umur;
                        }
                        if (dataL.ktlp09){
                            $scope.nama_responden = ''+dataL.ktlp09;
                            $scope.umur_responden = val.umur;
                        }
                    }else{ // jika belum ada ktlp, ambil dari baseline
                        $scope.nama_responden = $rootScope.dataRT.krt02;
                        $scope.umur_responden = 'lebih dari 18 tahun';
                    }
                        
                });
            });

            // jika ada data ruta baru yg ditambahkan. ambil data ruta tersebut.
            AppService.getCurentRT($rootScope.dataRT.idrt).then(function(data) {
                if (data.idrt) {
                    $rootScope.dataRT = data;
                    $scope.nama_responden = data.krt02;
                    $scope.alamat_responden = data.kl08;
                    $scope.iniRutaPecah = data.rPecah; 
                }
            });

        });

        AppService.getLaporanTelepon($rootScope.dataRT.idrt).then(function(ktlp) {
            if (ktlp.ktlp10 == 1 || ktlp.ktlp10 == 2) { // jika alamat sama
                $scope.alamat_responden = $rootScope.dataRT.kl08;
                $rootScope.alamat_responden = $rootScope.dataRT.kl08;
            }else{
                $scope.alamat_responden = ktlp.kl08;
                $rootScope.alamat_responden = $rootScope.dataRT.kl08;
            }   
        });


        AppService.getTglWawancaraPlusSatu(true).then(function(val) {
            $scope.tglWawancara = val;
        });

        $scope.IcftuAllowSave = function(myForm) {
            var icftu = $scope.icftu;
            if (icftu) {
                allow = icftu.icftu04;
                        if (icftu.icftu04 == 1) {
                            allow = allow && icftu.icftu01 && icftu.icftu02 && icftu.icftu03;
                            if (icftu.icftu01 == 1) {
                                allow = allow && icftu.icftu01a;
                            }
                        } 
                            
                return allow && myForm.$valid;
            }
        };

        // Save
        $scope.save = function(finish) {
            $rootScope.tab_catatan = false; // catatan di hide
            $rootScope.tab_cover = true; // tab cover buka

            if ($scope.iniRutaPecah == 1) {
                var goTo = finish ? 'app.art' : ''; // jika ruta pecah langsung ke list art
            }else{
                var goTo = finish ? 'app.art_cover' : ''; // jika ruta lama langsung ke cover dulu
            }            
            
            // simpan model, termasuk yg hidden dg ng-show, exclude hidden dg ng-if
            return AppService.saveDataKelMasked('icftu', $scope.icftu, true, goTo);
        };

    }
})();
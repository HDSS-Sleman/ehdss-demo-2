(function() {
    angular.module('ehdss')
        .controller('VacCtrl', VacCtrl);

    VacCtrl.$inject = ['$scope', '$rootScope', '$state', '$timeout', 'AppService'];
    function VacCtrl($scope, $rootScope, $state, $timeout, AppService) {
        
        var curART = $rootScope.curART;
        var idrt = curART.idrt || $rootScope.dataRT.idrt;
        var idart = curART.art03b || curART.artb03b;
        $scope.curART = curART;
        $scope.curART._nama = curART.art01;
        
        // reset dulu ke empty object
        $scope.vac = {};
        AppService.getDataKel(idrt, 'vac', idart).then(function(data) {
            $scope.vac = data || {};
            $scope.vac.vac = 1;
         
        });

        if ($scope.vac.vac1b) {$scope.vac.vac1b = new Date($scope.vac.vac1b);}
        
        AppService.getDataART().then(function(data) {
            $scope.dataART = data.filter(function(item) {
                return !item.artTdkAda;
            });

            // jika vac0 belum terisi, ambil responden utama terpilih dari cover
            if (!$scope.vac.vac0) {
                $scope.vac.vac0 = ''+curART.umur;
            }
                
        });

        $scope.alasan_tidak_mendapatkan_vaksin = {
            a: 'Saya khawatir tentang kemungkinan efek samping dari vaksin COVID-19',
            b: 'Saya tidak tahu apakah vaksin COVID-19 mampu bekerja (mencegah COVID-19)',
            c: 'Saya tidak membutuhkan vaksin COVID-19',
            d: 'Saya tidak suka vaksin',
            e: 'Dokter saya tidak menyarankan vaksin COVID-19',
            f: 'Saya akan menunggu dan melihat dulu apakah vaksin COVID-19 memang aman, dan mungkin saya akan mendapatkannya nanti',
            g: 'Saya berpikir untuk saat ini orang lain lebih membutuhkan vaksin tersebut daripada saya',
            h: 'Saya tidak mempercayai vaksin COVID-19',
            i: 'Saya tidak mempercayai pemerintah',
            j: 'Kepercayaan (agama/adat) saya tidak memperbolehkan vaksin',
            k: 'Saya khawatir atau ragu tentang kehalalan vaksin COVID-19',
            l: 'Lainnya'
        };

        $scope.alasan_tidak_membutuhkan_vaksin = {
            a: 'Saya sudah pernah terkena COVID-19',
            b: 'Saya bukan termasuk kelompok berisiko tinggi',
            c: 'Saya lebih memilih untuk menggunakan masker atau tindakan pencegahan lainnya',
            d: 'Saya tidak percaya COVID-19 adalah penyakit yang serius',
            e: 'Menurut saya vaksin COVID-19 tidak bermanfaat',
            f: 'Lainnya'
        };

        $scope.allowSave = function() {
            var vac = $scope.vac;
            var allow = true;

            if ($scope.curART.umur > 24) {
                allow = allow && vac.vac0a && vac.vac0b && vac.vac1a && vac.vac2;
                    if (vac.vac1a == 1) {
                        allow = allow && vac.vac1ba;
                        if (vac.vac1ba == 1) {
                            allow = allow && vac.vac1b;
                        }
                    }

                    if (vac.vac2 == 1 || vac.vac2 == 2 || vac.vac2 == 3 || vac.vac2 == 99) {
                        if (vac.vac2 == 1) {
                            allow = allow && vac.vac3;
                        }
                        if (vac.vac2 == 2) {
                            allow = allow && vac.vac4;
                        }
                        if (vac.vac2 == 3) {
                            allow = allow && vac.vac5a && vac.vac5b && vac.vac5c && vac.vac5d && vac.vac5e &&
                                            vac.vac5f && vac.vac5g && vac.vac5h && vac.vac5i && vac.vac5j &&
                                            vac.vac5k && vac.vac5l;
                                    if (vac.vac5l == 1) {
                                        allow = allow && vac.vac5m;
                                    }

                                    if (vac.vac5c == 1) {
                                        allow = allow && vac.vac6a && vac.vac6b && vac.vac6c && vac.vac6d &&
                                                    vac.vac6e && vac.vac6f;
                                                if (vac.vac6f == 1) {
                                                    allow = allow && vac.vac6g;
                                                }
                                    }
                        }
                    }
            }       

            return allow;
        };

        $scope.save = function(param) {

            if (param == 'individu') {
                /* Jika wawancara berhenti di tengah jalan*/
                $rootScope.catatanModulUtama = false; $rootScope.catatanModulB = true;
                $rootScope.tab_catatan = true; // langsung buka tab catatan
                $rootScope.tab_cover = false; // tab cover di hide dulu
                var goTo = 'app.art_cover';
            }else{
                var goTo = 'app.art';
            }

            $scope.vac.vac = 1;
            $rootScope.$broadcast('saving:show');
            // simpan semua model (termasuk hidden ng-show), kecuali yg hidden ng-if
            AppService.saveDataKel('vac', $scope.vac, true).then(function(data) {
                $rootScope.$broadcast('saving:hide');
                $rootScope.$broadcast('loading:show');
                $timeout(function() {
                    $rootScope.$broadcast('loading:hide');
                    $state.go(goTo);
                }, 300);
            });
        };
    }



})();

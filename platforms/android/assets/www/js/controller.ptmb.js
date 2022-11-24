(function() {
    angular.module('ehdss')
        .controller('PtmbCtrl', PtmbCtrl);

    PtmbCtrl.$inject = ['$scope', '$rootScope', '$state', '$ionicModal', '$window', '$ionicLoading', '$timeout', 'AppService'];

    function PtmbCtrl($scope, $rootScope, $state, $ionicModal, $window, $ionicLoading, $timeout, AppService, $cordovaMedia) {

        var curART = $rootScope.curART;
        var idrt = curART.idrt || $rootScope.dataRT.idrt;
        var idart = curART.art03b || curART.artb03b;
        $scope.curART = curART;
        $scope.curART._nama = curART.art01;
        
        // reset dulu ke empty object
        $scope.ptmb = {};
        AppService.getDataKel(idrt, 'ptmb', idart).then(function(data) {
            $scope.ptmb = data || {};
            $scope.ptmb.ptmb = 1;
         
        });

        $scope.stroke = true;
        $scope.angina = false;
        $scope.diabetes = false;
        $scope.paru = false;
        $scope.hipertensi = false;
       

        $scope.nama = $rootScope.curART._nama;
        $scope.nokoma = {
            word: /^[^,]*$/ //regex allow selain koma
        };

        AppService.getTglWawancaraPlusSatu(true).then(function(val) {
            $scope.tglWawancara = val;
        });

        $scope.gejala_angina = function(){
            var ptmb = $scope.ptmb;
            $scope.kena_angina = (ptmb.q4016==1 || ptmb.q4017==1) && 
                                (ptmb.q4018==1 && ptmb.q4019==1) && 
                                (ptmb.q4020b==1 && ptmb.q4020c==1 && 
                                    ptmb.q4020f==1 && ptmb.q4020g==1 && 
                                    ptmb.q4020h==1 && ptmb.q4020k==1 && 
                                    ptmb.q4020l==1 && ptmb.q4020m==1 && 
                                    ptmb.q4020p==1 && ptmb.q4020q==1 && 
                                    ptmb.q4020r==1);
            if ($scope.kena_angina) {
                $scope.ptmb.q4014_a = '1';
            }else{
                $scope.ptmb.q4014_a = '2';
            }
        }

        // Display/Tidak Tombol selanjutnya
        $scope.strokeAllowSave = function(){
            var ptmb = $scope.ptmb;
            var allow = ptmb.q4013;
                        if (curART.stroke_d == 1 || curART.stroke_d == 2) {
                            allow = allow && ptmb.q4064;
                        }
                        if (curART.stroke_d == 1 || ptmb.q4064 == 1) {
                            allow = allow && ptmb.q4062;
                            if (ptmb.q4062 == 1) {
                                allow = allow && ptmb.q4062a;
                            }
                            if (ptmb.q4062 == 2) {
                                allow = allow && ptmb.q4063;
                                if (ptmb.q4063 == 3) {
                                    allow = allow && ptmb.q4063a;
                                }
                            }
                        }
                        if (curART.stroke_d == 3 || !curART.stroke_d) {
                            allow = allow && ptmb.q4010;
                        }
                        if (ptmb.q4010 || ptmb.q4062a || ptmb.q4064 == 2 || ptmb.q4064 == 3) {
                            allow = allow && ptmb.q4012;
                        }
                        /* responden yang terdiagnosis stroke */
                        if (ptmb.q4064 == 1 || ptmb.q4010 == 1) {
                            allow = allow && ptmb.q4065 && ptmb.q4011a && ptmb.q4011b;
                            if (ptmb.q4065 >= 1 && ptmb.q4065 <= 3) {
                                allow = allow && ptmb.q4066 && ptmb.q4067;
                            }
                        }

            return allow;
        }

        $scope.anginaAllowSave = function(){
            var ptmb = $scope.ptmb;
            var allow = true;
                        if (curART.angina_d == 1 || curART.angina_d == 2) {
                            allow = allow && ptmb.q4070;
                        }
                        if (curART.angina_d == 1 || ptmb.q4070 == 1) {
                            allow = allow && ptmb.q4068;
                            if (ptmb.q4068 == 1) {
                                allow = allow && ptmb.q4068a;
                            }
                            if (ptmb.q4068 == 2) {
                                allow = allow && ptmb.q4069;
                                if (ptmb.q4069 == 3) {
                                    allow = allow && ptmb.q4069a;
                                }
                            }
                        }
                        if (curART.angina_d == 3 || !curART.angina_d) {
                            allow = allow && ptmb.q4014;
                        }
                        if (ptmb.q4014 || ptmb.q4068 || ptmb.q4070 == 2 || ptmb.q4070 == 3) {
                            allow = allow && ptmb.q4016 && ptmb.q4017;
                        }

                if (ptmb.q4016 == 1) {
                    allow = allow && ptmb.q4018 && ptmb.q4019 && 
                            ptmb.q4020a && ptmb.q4020b && ptmb.q4020c && ptmb.q4020d && ptmb.q4020e &&
                            ptmb.q4020f && ptmb.q4020g && ptmb.q4020h && ptmb.q4020i && ptmb.q4020j &&
                            ptmb.q4020k && ptmb.q4020l && ptmb.q4020m && ptmb.q4020n && ptmb.q4020o &&
                            ptmb.q4020p && ptmb.q4020q && ptmb.q4020r &&
                            ptmb.q4021;
                }

                if (ptmb.q4068==1 || ptmb.q4014==1 || ptmb.q4014_a==1) {
                    allow = allow && ptmb.q4071 && ptmb.q4015a && ptmb.q4015b;
                            if (ptmb.q4071 == 2) {
                                allow = allow && ptmb.q4072 && ptmb.q4073;
                            }
                }

            return allow;
        }

        $scope.diabetesAllowSave = function(){
            var ptmb = $scope.ptmb;
            var allow = true;
                        if (curART.diabetes_d == 1) {
                            allow = allow && ptmb.q4074;
                                    if (ptmb.q4074 == 2) {
                                        allow = allow && ptmb.q4075;
                                        if (ptmb.q4075 == 3) {
                                            allow = allow && ptmb.q4075a;
                                        }
                                    }
                        }
                        if ((ptmb.q4074 == 2 && ptmb.q4075) || curART.diabetes_d == 2 || curART.diabetes_d == 3 || !curART.diabetes_d) {
                            allow = allow && ptmb.q4022;
                        }
                        if (ptmb.q4074 == 1 || ptmb.q4022 == 1) {
                            allow = allow && ptmb.q4023a && ptmb.q4023b && ptmb.q4024;
                        }
            return allow;
        }

        $scope.paruAllowSave = function(){
            var ptmb = $scope.ptmb;
            var allow = ptmb.q4027 && ptmb.q4028 && ptmb.q4029 && ptmb.q4031;
                        if (curART.copd_d == 1) {
                            allow = allow && ptmb.q4076;
                            if (ptmb.q4076 == 2) {
                                allow = allow && ptmb.q4077;
                                if (ptmb.q4077 == 3) {
                                    allow = allow && ptmb.q4077a;
                                }
                            }
                        }

                        if (curART.copd_d == 2 || curART.copd_d == 3 || !curART.copd_d || (ptmb.q4076 == 2 && ptmb.q4077)) {
                            allow = allow && ptmb.q4025;
                        }

                        if (ptmb.q4076 == 1 || 
                            (ptmb.q4076 == 2 && ptmb.q4077 && ptmb.q4025 == 1) ||
                            ((curART.copd_d == 2 || curART.copd_d == 3 || !curART.copd_d) && ptmb.q4025 == 1)) {
                                allow = allow && ptmb.q4026a && ptmb.q4026b;
                        }

                        if (ptmb.q4027 == 1 || ptmb.q4028 == 1 || ptmb.q4029 == 1) {
                            allow = allow && ptmb.q4030;
                        }
                        if (ptmb.q4031 == 1) {
                            allow = allow && ptmb.q4032a && ptmb.q4032b;
                        }
                        if (ptmb.q4029 == 1) {
                            allow = allow && ptmb.q4032c;
                        }
            return allow;
        }

        $scope.hipertensiAllowSave = function(){
            var ptmb = $scope.ptmb;
            var allow = true;
                        if (curART.hyper_d == 1) {
                            allow = allow && ptmb.q4078;
                            if (ptmb.q4078 == 2) {
                                allow = allow && ptmb.q4079;
                                if (ptmb.q4079 == 3) {
                                    allow = allow && ptmb.q4079a;
                                }
                            }
                        }
                        if (curART.hyper_d == 2 || curART.hyper_d == 3 || !curART.hyper_d || (ptmb.q4078 == 2 && ptmb.q4079)) {
                            allow = allow && ptmb.q4060;
                        }
                        if (ptmb.q4078 == 1 || (ptmb.q4078 == 2 && ptmb.q4079 && ptmb.q4060 == 1) || ptmb.q4060 == 1) {
                            allow = allow && ptmb.q4061a && ptmb.q4061b;
                        }
            return allow;
        }

        
        $scope.go = function(curMenu, toMenu) {
            $scope.save().then(function() {
                $scope[toMenu] = true;
                $scope[curMenu] = false;
            });
        };

        // Save
        $scope.save = function(finish) {
            var goTo = finish ? 'app.agh' : '';

            // simpan model, termasuk yg hidden dg ng-show, exclude hidden dg ng-if
            return AppService.saveDataKelMasked('ptmb', $scope.ptmb, true, goTo);
        };

    }
})();

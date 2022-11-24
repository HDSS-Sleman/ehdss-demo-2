(function() {
    angular.module('ehdss')
        .controller('HtCtrl', HtCtrl);

    HtCtrl.$inject = ['$scope', '$state', '$rootScope', '$timeout', 'AppService'];

    function HtCtrl($scope, $state, $rootScope, $timeout, AppService) {
        var curART = $rootScope.curART;
        var idrt = curART.idrt;
        var idart = curART.art03b;

        $scope.curART = curART;
        $scope.curART._nama = curART.art01;
        $scope.jk = curART._jk == 'L' ? 'Laki-Laki' : 'Perempuan';
        var tgl = curART.art05.split("-");
        $scope.tgllahir = tgl[2]+'-'+tgl[1]+'-'+tgl[0];
        $scope.user = $rootScope.username;

        var pendidikan = {
            '1': 'Tidak / Belum Sekolah',
            '2': 'SD/MI',
            '3': 'SLTP/Mts',
            '4': 'SLTA/SMK/MA',
            '5': 'D2/D3',
            '6': 'D4/S1',
            '7': 'S2/S3',
            '98': 'Tidak tahu'
        };
        var getPendidikan =  function cekPendidikan(id) {
            return pendidikan[id] ? pendidikan[id] : '-';
        }
        $scope.pendidikan =  getPendidikan(curART.art16);

        var pekerjaan = {
            '1': 'Tidak Bekerja',
            '2': 'Ibu Rumah Tangga',
            '3': 'TNI /Polri',
            '4': 'Pegawai Negeri Sipil',
            '5': 'Pegawai BUMN',
            '6': 'Pegawai Swasta',
            '7': 'Wiraswasta/Pedagang',
            '8': 'Pelayanan Jasa',
            '9': 'Petani',
            '10': 'Nelayan',
            '11': 'Buruh',
            '12': 'Pensiun',
            '13': 'Pelajar',
            '95': 'Lainnya',
            '98': 'Tidak tahu'
        };
        var getPekerjaan =  function cekPekerjaan(id) {
            return pekerjaan[id] ? pekerjaan[id] : '-';
        }
        $scope.pekerjaan =  getPekerjaan(curART.art18);

        var kepemilikanasuransi = {
            '1': 'Ya',
            '2': 'Tidak',
            '98': 'Tidak tahu'
        };
        var getKepemilikanAsuransi =  function cekKepemilikanAsuransi(id) {
            return kepemilikanasuransi[id] ? kepemilikanasuransi[id] : '-';
        }
        $scope.kepemilikanasuransi =  getKepemilikanAsuransi(curART.art19);

        $scope.jenisasuransi =  ($scope.curART.art20_01==1?'JKN PBI':'')+' '+ 
                                ($scope.curART.art20_02==1?'JKN Non-PBI : PNS, TNI/POLRI, Pejabat Negara, Pegawai Pemerintah Non-PNS':'')+' '+  
                                ($scope.curART.art20_03==1?'JKN Non-PBI: Peserta Mandiri':'')+' '+ 
                                ($scope.curART.art20_04==1?'JKN Non-PBI: Bukan Pekerja':'')+' '+ 
                                ($scope.curART.art20_05==1?'JKN Non PBI: Pegawai Swasta':'')+' '+  
                                ($scope.curART.art20_06==1?'Jamkesda Sleman':'')+' '+ 
                                ($scope.curART.art20_07==1?'Jamkesda Sleman Mandiri':'')+' '+  
                                ($scope.curART.art20_08==1?'Jamkesta Mandiri':'')+' '+  
                                ($scope.curART.art20_09==1?'Jamkesos':'')+' '+  
                                ($scope.curART.art20_10==1?'Asuransi Swasta':'')+' '+ 
                                ($scope.curART.art20_11==1?'Perusahaan':'')+' '+ 
                                ($scope.curART.art20_95a?$scope.curART.art20_95a:'')+' '+
                                ($scope.curART.art20_98==1?'Tidak Tahu':'')
                                ;
        $scope.ht = {};
        AppService.getDataKel(idrt, 'ht', idart).then(function(data) {
            $scope.ht = data || {};
            $scope.ht.ht = 1;
        });

        $scope.save = function() {
            // debugger;
            $rootScope.$broadcast('saving:show');
            AppService.saveDataKel('ht', $scope.ht).then(function(data) {
                $rootScope.$broadcast('saving:hide');
                $rootScope.$broadcast('loading:show');
                $timeout(function() {
                    $rootScope.$broadcast('loading:hide');
                    $state.go('app.art');
                }, 300);
            });
        };

        $scope.allowSave = function(myForm) {
            var ht = $scope.ht;
            $scope.ht.user = $rootScope.username.toLowerCase();
            var allow = ht.htnama;
                if (ht.ht1 == '1') {
                    allow = allow && ht.ht2 && ht.ht3;
                    if (ht.ht2 == 95) {
                        allow = allow && ht.ht2a;
                    }
                    if (ht.ht3 == '1') {
                        if (curART._jk == 'P') {allow = allow && ht.ht4;}
                        if (curART._jk == 'L' || (curART._jk == 'P' && ht.ht4 != '1')) {
                            allow = allow && ht.ht6 && ht.ht7 && ht.ht8ai && ht.ht8aii && ht.ht11;
                            if (ht.ht6 == '1') {allow = allow && ht.ht6a!=null;}
                            if (ht.ht6 == '2') {allow = allow && ht.ht6b!=null;}
                            if (ht.ht6 == '3') {allow = allow && ht.ht6c!=null;}
                            if (ht.ht7 == '1') {
                                allow = allow && ((ht.ht7a && ht.ht7a1) || (ht.ht7b && ht.ht7b1) || (ht.ht7c && ht.ht7c1));
                            }
                            if (ht.ht11 == '1') {
                                allow = allow && ht.ht12a && ht.ht12b && ht.ht12c && ht.ht12d && ht.ht12e;
                                if (ht.ht12e == '1') {allow = allow && ht.ht12f;}
                            }
                        }
                    }
                    if (ht.ht3 == '2') {
                        allow = allow && ht.ht3a;
                    }
                }
            return allow && myForm.$valid;
        };
    }
})();
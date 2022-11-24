(function() {
    angular.module('ehdss')
        .controller('ArtCtrl', ArtCtrl);

    ArtCtrl.$inject = ['$scope', '$rootScope', 'AppService', '$state', '$timeout', '$ionicModal', '$ionicPopup'];

    function ArtCtrl($scope, $rootScope, AppService, $state, $timeout, $ionicModal, $ionicPopup) {
        
        AppService.getCurentRT($rootScope.curRT.idrt).then(function(data) {
            $scope.rt = data;
        });

        {
            AppService.getDataART().then(function(data) {
                var dataART = data;
                // sort dataART berdasarkan art00 atau
                // cari urutan art00 atau artb00 dari yg art00 atau artb00 terbesar
                data_1 = [];

                $rootScope.idart_terpakai = []; // push IDART yg ada di tiap RUTA
                for (var i = 0; i < dataART.length; i++) {
                    if (dataART[i].art00) {
                        data_1.push(dataART[i].art00);
                        $rootScope.idart_terpakai.push(dataART[i].art03b);
                    }
                    if (dataART[i].artb00) {
                        data_1.push(dataART[i].artb00);
                        $rootScope.idart_terpakai.push(dataART[i].artb03b);
                    }
                }
                // sort dari art00 tertua
                data_1.sort(function(a, b){return a - b}); 
                
                data_2 = [];
                // masukan dataART dengan urutan art00 atau artb00 tertua
                for (var i = 0; i < dataART.length; i++) {
                    for (var j = 0; j < dataART.length; j++) {
                        if(dataART[j].art00 == data_1[i] || dataART[j].artb00 == data_1[i]){
                            data_2.push(dataART[j]);
                        }
                    }
                }

                $scope.dataART = data_2;           

                // set array null
                $scope.listARTed = {};
                $rootScope.listARTed = {};
                $rootScope.listARTed_L = {};
                $rootScope.listARTed_P = {};
                $scope.kej_bayi_meninggal = [];
                $scope.kej_bayi_lahir_hidup = [];
                $scope.kej_art_meninggal = [];
                $scope.jml_bayi_lahir_dari_art_hdss = 0;
                $scope.jml_artb_lahir_dari_art_hdss = 0;

                

                $scope.jumART = $scope.dataART.length;
                $rootScope.dataART = $scope.dataART;
                $rootScope.AlldataART = $scope.dataART;

                $scope.dataRT = $rootScope.dataRT;

                // status jika sudah terisi true/false
                $scope.status_mch = kosong($scope.dataRT.mch);
                $scope.status_ichc = kosong($scope.dataRT.ichc);
                $scope.status_ir = kosong($scope.dataRT.ir);
                $scope.status_png = kosong($scope.dataRT.png);
                $scope.status_prk = kosong($scope.dataRT.prk);
                $scope.status_bkia = kosong($scope.dataRT.bkia);
                $scope.status_ichcp = kosong($scope.dataRT.ichcp);
            });
        }

        // check if object is empty
        var kosong = function isEmpty(obj) {
            for(var key in obj) {
                if(obj.hasOwnProperty(key))
                    return false;
            }

            return JSON.stringify(obj) === JSON.stringify({});
        }

        var initModal = function() {
            $scope.konfirmasi_modal = true;
        };
        $ionicModal.fromTemplateUrl('templates/konfirmasi-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function() {
            initModal();
            $scope.modal.show();
        };

        $scope.go = function(module) {
            $rootScope.$broadcast('loading:show');
            $timeout(function() {
                $rootScope.dataART = $scope.dataART;
                $state.go('app.' + module);
                $rootScope.$broadcast('loading:hide');
            }, 100);
        };

        $scope.edit = function(selectedART) {
            // default jika ke PART
            var goto = 'part',
                editStatus = 'new';
            $rootScope.curART = selectedART;
            $rootScope.$broadcast('loading:show');
            // jika yg di klik art baru (artb)
            if (selectedART.artb00) {
                goto = 'artb';
                editStatus = 'edit';
            }
            if (selectedART.art36) {
                goto = 'art_kart';
                editStatus = 'edit';
            }
            $timeout(function() {
                $state.go('app.' + goto);
                $rootScope.editStatus = editStatus;
                $rootScope.$broadcast('loading:hide');
            }, 100);
        };

        // Antropometri Gaya Hidup
        $rootScope.selectionKish = [];
        // Toggle selection for a given ART by _noArt
        $scope.toggleSelection = function toggleSelection(selectedART) {
            
            var idx = $scope.selectionKish.indexOf(selectedART);
            // Is currently selected
            if (idx > -1) {
              $scope.selectionKish.splice(idx, 1);
            }

            // Is newly selected
            else {
              $scope.selectionKish.push(selectedART);
            }
            // console.log($rootScope.selectionKish);
        };

        // ke form Modul B
        $scope.formModB = function(selectedART) {
            /* wawancara kunjungan langsung*/
            // ke art_cover dulu sebelum ke Modul B
            $rootScope.catatanModulUtama = false; $rootScope.catatanModulB = true;
            $rootScope.tab_catatan = true; // langsung buka tab catatan
            $rootScope.tab_cover = false; // tab cover di hide dulu

            var goto = 'art_cover';
            $rootScope.curART = selectedART;
            $rootScope.$broadcast('loading:show');
            $timeout(function() {
                $state.go('app.' + goto);
                $rootScope.$broadcast('loading:hide');
            }, 100);
        };

        // An alert dialog
        $scope.showAlert = function(title, msg) {
            $ionicPopup.alert({
                title: title || 'Konfirmasi',
                template: msg || '1. Pastikan Modul Utama sudah ditanyakan <br> 2. Pastikan Modul Subsample sudah ditanyakan jika ART memenuhi syarat. <br>3. Kemudian Lanjut ke Aplikasi Balita'
            });
        };

        if ($rootScope.modulUtamaSelesai) {
            $scope.showAlert();
        }

    }
})();

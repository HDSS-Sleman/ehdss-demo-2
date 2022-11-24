(function() {
    angular.module('ehdss')
        .controller('PngCtrl', PngCtrl);

    PngCtrl.$inject = ['$scope', '$state', '$rootScope', '$timeout', 'AppService', '$ionicPopup', '$http'];

    function PngCtrl($scope, $state, $rootScope, $timeout, AppService, $ionicPopup, $http) {
        
        $scope.png = {};
        AppService.getDataART().then(function(data) {
            $scope.dataART = data.filter(function(item) {
                return !item.artTdkAda;
            });
            $scope.png = $rootScope.dataRT.png || {};
            if ($scope.png) {
                $scope.png = AppService.deNormalisasiData($scope.png);
            }
        });

        AppService.getTglWawancaraPlusSatu(true).then(function(val) {
            $scope.tglWawancara = val;
        });

        $scope.pengetahuan = true;
        $scope.nutrisi  = false;
        $scope.kesehatan = false;
        $scope.perkembangan = false;
        $scope.stimulasi = false;
        $scope.pengasuhan = false;
        $scope.keselamatan = false;
        $scope.kesehatan_mental = false;

        $scope.pengetahuanList = {
            '1': 'Memberikan imunisasi',
            '2': 'Memberikan vitamin A',
            '3': 'Memberikan ASI eksklusif',
            '4': 'Memberikan MP ASI mulai 6 bulan',
            '5': 'Memberikan MP-ASI dengan komposisi dan jumlah yang adekuat',
            '6': 'Menjaga lingkungan bersih',
            '7': 'Bila anak sakit segera konsultasi ke petugas kesehatan',
            '8': 'Memonitor pertumbuhan dan perkembangan',
            '9': 'Lainnya',
        }

        $scope.ndp2List = {
            'a': 'Bila ASI masih banyak, pemberian MP-ASI bisa ditunda lebih dari 6 bulan',
            'b': 'Protein nabati (tempe, tahu) lebih diutamakan dibanding protein hewani (ikan, daging, telur)',
            'c': 'MP-ASI usia 6-8 bulan sebaiknya belum boleh diberi santan atau minyak',
            'd': 'MP-ASI anak usia 6-8 bulan sebaiknya berbentuk makan yang dicincang'
        }

        $scope.pengasuhList = {
            '1': 'Ibu',
            '2': 'Bapak',
            '3': 'Keluarga lain',
        }

        $scope.epaList = {
            '1': 'Imunisasi ',
            '2': 'Gizi ',
            '3': 'Pengasuhan/Lingkungan',
        }

        $scope.perkembanganList = {
            '1': 'Apakah bayi dapat mengikuti gerakan anda dengan menggerakkan kepala sepenuhnya dari satu sisi ke sisi yang lain? (Gerak Halus)',
            '2': 'Apakah bayi dapat mengangkat kepalanya dengan mempertahankan lehernya secara kaku? (Gerak Kasar)',
            '3': 'Ketika bayi telungkup di atas alas datar, apakah ia dapat mengangkat dada dengan kedua lengannya sebagai penyangga? (Gerak Kasar)',
            '4': 'Apakah bayi dapat mempertahankan posisi kepala dalam keadaan tegak dan stabil? (Gerak Kasar)',
            '5': 'Apakah bayi dapat menggenggam sebuah pensil untuk selama beberapa detik? (Gerak Halus)',
            '6': 'Apakah bayi dapat mengarahkan matanya pada benda kecil? (Gerak Halus)',
            '7': 'Apakah bayi dapat meraih sebuah mainan yang diletakkan agak jauh di depannya namun masih dalam jangkauan tangannya? (Gerak Halus)',
            '8': 'Apakah bayi pernah mengeluarkan suara gembira bernada tinggi atau memekik tetapi bukan menangis? (Bicara dan Bahasa)',
            '9': 'Apakah bayi pernah berbalik paling sedikit dua kali, dari terlentang ke telungkup atau sebaliknya? (Gerak Kasar)',
            '10': 'Apakah bayi pernah tersenyum ketika melihat mainan yang lucu, gambar atau binatang peliharaan pada saat ia bermain sendiri? (Sosialisasi dan Kemandirian)',
        }

        $scope.ks5List = {
            'a': 'Tidak bisa menyusu',
            'b': 'Kejang ',
            'c': 'Batuk',
            'd': 'Muntah-muntah',
            'e': 'Demam dengan suhu 37,2 C',
            'f': 'Berak berdarah ',
        }

        $scope.ks6List = {
            'a': 'Hepatitis B untuk mencegah penyakit hati',
            'b': 'BCG untuk mencegah TBC',
            'c': 'Pentabio untuk mencegah difteri, pertusis, HIB dan hepatitis B',
            'd': 'Polio untuk mencegah lumpuh layu',
        }

        $scope.pk7List = {
            'b': 'Anak dapat mengarahkan matanya pada benda kecil',
            'c': 'Anak dapat menirukan suara yang di dengarnya',
            'd': 'Anak dapat tersenyum ketika melihat mainan yang lucu, atau gambar pada saat bermain sendiri',
        }

        $scope.stiList = {
            '8': '17. Usia 6 bulan anak perlu dilatih duduk ',
            '9': '18. Anak usia 6 bulan perlu distimulasi dengan mengenalkan benda benda sekitar',
            '10': '19. Bayi perlu distimulasi dengan menyembunyikan dan menemukan mainan',
        }

        $scope.pgr1List = {
            'a': 'Tidak boleh dipaksa',
            'b': 'Lama pemberian makan sebaiknya 30 menit - satu jam',
            'c': 'Anak akan mudah dalam makannya, ketika makan sambil nonton TV atau sambil bermain',
            'd': 'Anak diberi kesempatan untuk makan sendiri'
        }

        $scope.pgrOptionList = {
            '1': 'Sangat setuju',
            '2': 'Setuju',
            '3': 'Tidak setuju',
            '4': 'Sangat tidak setuju'
        }
 
        $scope.kakList = {
            '1': '23. Anak kecil sebaiknya tidak boleh ditinggal sendiri lebih dari 1 jam',
            '2': '24. Anak sebaiknya dijauhkan dari barang-barang berbahaya seperti benda tajam, panas, listrik',
            '3': '25. Baby walker baik untuk membantu perkembangan anak',
            '4': '26. Rumah sebaiknya bebas dari asap rokok dan asap lainnya'
        }

        $scope.kmiList = {
            '1': '27. Apakah Ibu merasa sangat sedih, tertekan, atau putus asa',
            '2': '28. Apakah Ibu merasa kurang berminat atau kurang menikmati untuk melakukan sesuatu'
        }
        

        $scope.pengetahuanAllowSave = function() {
            var png = $scope.png;
            allow = png.png1 && png.png2 && png.png3 && png.png4 && png.png5 &&
                    png.png6 && png.png7 && png.png8 && png.png9;

                    if (png.png9 == 1) {
                        allow = allow && png.png9a;
                    }

            return allow;
        };

        $scope.nutrisiAllowSave = function() {
            var png = $scope.png;
            allow = png.ndp1 && png.ndp2a && png.ndp2b && png.ndp2c && png.ndp2d &&
                    png.ndp3 && png.ndp4;

            return allow;
        }

        $scope.kesehatanAllowSave = function() {
            var png = $scope.png;
            allow = png.ks5a && png.ks5b && png.ks5c && png.ks5d && png.ks5e && png.ks5f &&
                    png.ks6a && png.ks6b && png.ks6c && png.ks6d;

            return allow;
        }

        $scope.perkembanganAllowSave = function() {
            var png = $scope.png;
            allow = png.pk7a && png.pk7b && png.pk7c && png.pk7d;

            return allow;
        }

        $scope.stimulasiAllowSave = function() {
            var png = $scope.png;
            allow = png.sti8 && png.sti9 && png.sti10;

            return allow;
        }

        $scope.pengasuhanAllowSave = function() {
            var png = $scope.png;
            allow = png.pgr1a && png.pgr1b && png.pgr1c && png.pgr1d &&
                    png.pgr2 && png.pgr3;

            return allow;
        }

        $scope.keselamatanAllowSave = function() {
            var png = $scope.png;
            allow = png.kak1 && png.kak2 && png.kak3 && png.kak4;

            return allow;
        }

        $scope.kesehatanMentalAllowSave = function() {
            var png = $scope.png;
            allow = png.kmi1 && png.kmi2;

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
            return AppService.saveDataKelMasked('png', $scope.png, true, goTo);
        };

    }
})();
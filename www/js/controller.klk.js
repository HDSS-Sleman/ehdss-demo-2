(function() {
    angular.module('ehdss')
        .controller('KlkCtrl', KlkCtrl);

    KlkCtrl.$inject = ['$scope', '$rootScope', '$state', '$ionicModal', '$window', '$ionicLoading', '$timeout', 'AppService'];

    function KlkCtrl($scope, $rootScope, $state, $ionicModal, $window, $ionicLoading, $timeout, AppService, $cordovaMedia) {
        
        if (!$rootScope.dataRT || !$rootScope.dataRT.idrt) {
            $state.go('app.home'); // jika tidak ada idrt kembali ke home
            return false;
        }
            
        $scope.klk = {};

        AppService.getDataKel($rootScope.idrt, 'klk').then(function(data) {
            $scope.klk = data || {}; 
        });

        AppService.getTglWawancaraPlusSatu(true).then(function(val) {
            $scope.tglWawancara = val;
        });

        $scope.listKlk = {
            '1':'Bila Anda merasakan gejala penyakit dan ingin mengetahui cara perawatan atau pengobatan, seberapa mudah Anda mendapatkan informasi tentang perawatan/pengobatan penyakit tersebut?',
            '2':'Ketika Anda sakit, seberapa mudah Anda mencari tahu dimana mencari tenaga kesehatan seperti dokter, bidan/perawat',
            '3':'Apabila Anda ke dokter dan diberikan informasi terkait kondisi kesehatan Anda seperti hasil pemeriksaan atau cara pencegahan suatu penyakit, seberapa mudah Anda memahami penjelasan dari dokter tersebut?',
            '4':'Apabila Anda berobat dan diberi obat oleh dokter atau apoteker, kemudian dokter atau apoteker memberikan penjelasan atau instruksi cara penggunaan obat tersebut, seberapa mudah Anda memahami petunjuk penggunaan obat tersebut?',
            '5':'Apabila keluarga Anda ada yang sakit dan mendapatkan saran dari seorang dokter untuk mendapatkan tindakan medis tertentu, misalnya disarankan rawat inap atau tindakan operasi. Bagaimana Anda mempertimbangkan keuntungan dan kerugian dari saran pilihan pengobatan tersebut?',
            '6':'Apabila Anda disarankan rawat inap dalam pengobatan sakit Anda. Bagaimana Anda menggunakan informasi dari dokter untuk membuat keputusan mengenai sakit Anda tersebut?',
            '7':'Anda diberikan obat kemudian diminta untuk mengkonsumsi obat tersebut rutin setiap hari selama 1 bulan, seberapa mudah Anda mematuhi instruksi dokter atau apoteker Anda?',
            '8':'Bagaimana Anda dapat mengatasi stress atau depresi?',
            '9':'Bagaimana Anda memahami peringatan tentang kesehatan seperti iklan layanan masyarakat di TV atau peringatan pada bungkus rokok?',
            '10':'Bagaimana Anda Memahami mengapa Anda membutuhkan deteksi dini penyakit (health screening)?',
            '11':'Seberapa mudah Anda menilai apakah informasi kesehatan di media seperti TV, radio, koran, atau ulasan di website dapat dipercaya?',
            '12':'Misalnya ada informasi di media bahwa tekanan darah tinggi dapat dihindari dengan mengurangi konsumsi garam. Bagaimana Anda dapat memutuskan untuk mencegah tekanan darah tinggi?',
            '13':'Seberapa mudah Anda menemukan informasi tentang aktivitas (misal olahraga, bersosialisasi, meditasi)  yang baik untuk kesehatan mental Anda?',
            '14':'Apabila keluarga Anda ada yang sakit dan mendapatkan saran, misalnya kerabat Anda menyarankan untuk berobat ke RS X, teman Anda menyarankan untuk berobat ke dokter Y, sedangkan tetangga Anda menyarankan untuk berobat ke pengobatan alternatif. Bagaimana Anda memahami keuntungan dan kerugian dari masing-masing pilihan pengobatan tersebut?',
            '15':'Seberapa mudah Anda memahami informasi di media seperti TV, radio, koran, atau ulasan di website tentang bagaimana menjadi lebih sehat?',
            '16':'Anda mendapat berbagai informasi kegiatan sehari-hari yang mempengaruhi kesehatan (misal perilaku makan, minum, olahraga), seberapa mudah Anda menilai kegiatan tersebut dapat memberikan pengaruh kepada kesehatan Anda?'
        }

        // Display/Tidak Tombol selanjutnya
        $scope.AllowSave = function(){
            var klk = $scope.klk;
            var allow = klk.klk1 && klk.klk2 && klk.klk3 && klk.klk4 && 
                        klk.klk5 && klk.klk6 && klk.klk7 && klk.klk8 && 
                        klk.klk9 && klk.klk10 && klk.klk11 && klk.klk12 &&
                        klk.klk13 && klk.klk14 && klk.klk15 && klk.klk16;
            return allow;
        }

        // Back
        $scope.save = function(modul) {
            var goTo = modul ? 'app.'+modul : '';

            // simpan model, termasuk yg hidden dg ng-show, exclude hidden dg ng-if
            return AppService.saveDataKelMasked('klk', $scope.klk, true, goTo);
        };

    }
})();

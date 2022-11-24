(function() {
    angular.module('ehdss')
        .controller('VaCtrl', VaCtrl);

    VaCtrl.$inject = ['$scope', '$rootScope', '$state', '$ionicModal', '$window', '$ionicLoading', '$timeout', 'AppService', '$cordovaMedia'];

    function VaCtrl($scope, $rootScope, $state, $ionicModal, $window, $ionicLoading, $timeout, AppService, $cordovaMedia) {
        
        // Play Media
        $scope.play = function(type){
        $scope.src = '/android_asset/www/audio/'+type+'.mp3';
            
        $scope.audio = new Media($scope.src, 
                        // success callback
                        function () { console.log("playAudio():Audio Success"); }, 
                        // error callback
                        function (err) { console.log("playAudio():Audio Error: " + err); }, 
                        mediaStatusCallback);
                $scope.audio.play();
        }
        $scope.pause = function(){
            $scope.audio.pause();
        }
        $scope.stop = function(){
            $scope.audio.stop();
        }
        var mediaStatusCallback = function(status){
            if (status == $scope.audio.MEDIA_STARTING) {
                $ionicLoading.show({template: "Loading...."});
            }else{
                $ionicLoading.hide();
            }
        }

        var curART = $rootScope.curART;
        var idrt = curART.idrt;
        var idart = curART.art03b;
        $scope.curART = curART;
        $scope.curART._nama = curART.art01;

        // reset dulu ke empty object
        $scope.va = {};
        AppService.getDataKel(idrt, 'va', idart).then(function(data) {
            $scope.va = data || {};
            $scope.va.va = 1;
            $scope.va.id10010 = $rootScope.username.toLowerCase();
            if ($scope.va.id10011) {$scope.va.id10011 = AppService.deNormalisasiDataJam($scope.va.id10011)} //jika ada data jam
            if ($scope.va.id10481) {$scope.va.id10481 = AppService.deNormalisasiDataJam($scope.va.id10481)}
            
            $scope.va.id10017 = $scope.va.id10017 || $scope.curART._nama; //nama responden
            $scope.va.id10019 = $scope.va.id10019 || ''+$scope.curART.art04; //jenis kelamin

            //Perhitungan Usia jika ada tgl lahir dan tgl kematian
            if ($scope.va.id10021 && $scope.va.id10023) {$scope.ageInDays = AppService.getAgeInDays($scope.va.id10021,$scope.va.id10023)} //jika ada tgl lahir & tgl kematian
            if ($scope.ageInDays) {//jika ada ageInDays
                $scope.ageInYears = parseInt($scope.ageInDays / 365.25); //tahun
                $scope.ageInYearsRemain = parseInt($scope.ageInDays % 365.25);
                $scope.ageInMonths = parseInt($scope.ageInYearsRemain / 30.4); //bulan
                $scope.ageInMonthsRemain = parseInt($scope.ageInYearsRemain % 30.4); //hari
                $scope.va.isNeonatal1 =  ($scope.ageInDays <= 27) ? 1 : 0;
                $scope.va.isChild1 = (($scope.ageInDays <= (11*365.25)) && ($scope.ageInDays > 27)) ?  1 : 0;
                $scope.va.isAdult1 = ($scope.ageInDays > (11*365.25)) ?  1 : 0;
            }
            // perhitungan jika tgl lahir atau tgl kematian TIDAK diketahui
            if ($scope.va.id10020 != "1" || $scope.va.id10022 != "1") {
                $scope.va.isNeonatal2 = $scope.va.age_group === "1" ? 1 : 0;
                $scope.va.isChild2 = $scope.va.age_group === "2" ? 1 : 0;
                $scope.va.isAdult2 = $scope.va.age_group === "3" ? 1 : 0;
            }
            $scope.va.isNeonatal = $scope.va.isNeonatal1 || $scope.va.isNeonatal2;
            $scope.va.isChild = $scope.va.isChild1 || $scope.va.isChild2;
            $scope.va.isAdult = $scope.va.isAdult1 || $scope.va.isAdult2;
        });

        // $scope.va = {};
        $scope.bagian_1 = true;
        $scope.bagian_2 = false;
        $scope.bagian_3a = false;
        $scope.bagian_3b = false;
        $scope.bagian_4 = false;
        $scope.bagian_5 = false;
        $scope.bagian_6a = false;
        $scope.bagian_6d = false;
        $scope.bagian_6b = false;
        $scope.bagian_6b_respirationsou = false;
        $scope.bagian_6b_perut = false;
        $scope.bagian_6b_kepala = false;
        $scope.bagian_6b_ruam = false;
        $scope.bagian_6b_lumpuh = false;
        $scope.bagian_6b_pregnancy_women = false;
        $scope.bagian_5_neonatal_childa = false;
        $scope.bagian_5_neonatal_childb = false;
        $scope.bagian_8_faktor_resiko = false;
        $scope.bagian_7_penggunaan_pelayanan_kesehatan = false;
        $scope.bagian_9_latar_belakang_dan_konteks = false;
        $scope.bagian_10_akta_kematian = false;
        $scope.bagian_11_dan_12 = false;

        $scope.nama = $rootScope.curART._nama;
        $scope.nokoma = {
            word: /^[^,]*$/ //regex allow selain koma
        };
        $scope.getAgeInKnown = function(tgl_lahir, tgl_kematian){
            if (tgl_lahir && tgl_kematian) {
                $scope.ageInDays = AppService.getAgeInDays(tgl_lahir,tgl_kematian); 
                $scope.ageInYears = parseInt($scope.ageInDays / 365.25); //tahun
                $scope.ageInYearsRemain = parseInt($scope.ageInDays % 365.25);
                $scope.ageInMonths = parseInt($scope.ageInYearsRemain / 30.4); //bulan
                $scope.ageInMonthsRemain = parseInt($scope.ageInYearsRemain % 30.4); //hari
                $scope.va.isNeonatal1 =  ($scope.ageInDays <= 27) ? 1 : 0;
                $scope.va.isChild1 = (($scope.ageInDays <= (11*365.25)) && ($scope.ageInDays > 27)) ?  1 : 0;
                $scope.va.isAdult1 = ($scope.ageInDays > (11*365.25)) ?  1 : 0;
            }
            $scope.va.isNeonatal = $scope.va.isNeonatal1;
            $scope.va.isChild = $scope.va.isChild1;
            $scope.va.isAdult = $scope.va.isAdult1;
        }
        $scope.getAgeInUnknown = function(age_group){
            $scope.va.isNeonatal2 = $scope.va.age_group === "1" ? 1 : 0;
            $scope.va.isChild2 = $scope.va.age_group === "2" ? 1 : 0;
            $scope.va.isAdult2 = $scope.va.age_group === "3" ? 1 : 0;

            $scope.va.isNeonatal = $scope.va.isNeonatal2;
            $scope.va.isChild = $scope.va.isChild2;
            $scope.va.isAdult = $scope.va.isAdult2;
        }

        //pilihan dropdown
        $scope.age_group = {
            1: '1. Neonatal',
            2: '2. Anak',
            3: '3. Dewasa'

        };
        $scope.YES_NO_REF = {
            1: '1 Ya',
            2: '2 Tidak',
            99: '99 Menolak Menjawab'
        };
        $scope.YES_NO = {
            1: '1 Ya',
            2: '2 Tidak',
        };
        $scope.HIGH_LOW_VERY = {
            1: '1. Tinggi',
            2: '2. Rendah ',
            3: '3. Sangat Rendah '
        };
        $scope.YES_NO_DK_REF = {
            1: '1. Ya',
            2: '2. Tidak',
            98: '98. Tidak Tahu',
            99: '99. Menolak Menjawab'
        };
        $scope.units = {
            'days': 'Hari',
            'months': 'Bulan',
            'years': 'Tahun'

        };
        $scope.select_2 = {
            1: '1. Laki-laki',
            2: '2. Perempuan'
        };
        $scope.select_18 = {
            1: '1. Rumah Sakit',
            2: '2. Fasilitas Kesehatan Lain',
            3: '3. Rumah',
            4: '4. Dalam perjalanan menuju Rumah Sakit atau Fasilitas Kesehatan',
            95: '95. Lainnya. Sebutkan __________',
            98: '98. Tidak Tahu',
            99: '99. Menolak Menjawab'
        };
        $scope.select_19 = {
            1: '1. Belum Menikah',
            2: '2. Menikah',
            3: '3. Hidup Bersama',
            4: '4. Bercerai',
            5: '5. Janda/Duda',
            6: '6. Kawin Muda',
            98: '98. Tidak Tahu',
            99: '99. Menolak Menjawab'
        };
        $scope.select_23 = {
            1: '1. Tidak pernah sekolah formal',
            2: '2. SD/ sederajat',
            3: '3. SMP/ sederajat', 
            4: '4. SMA/sederajat',
            5: '5. Sarjana',
            98: '98. Tidak Tahu',
            99: '99. Menolak Menjawab'
        };
        $scope.select_25 = {
            1: '1.  Tidak bekerja',
            2: '2.  Bekerja',
            3: '3.  Ibu rumah tangga',
            4: '4.  Pensiunan',
            5: '5.  Pelajar/Mahasiswa',
            95: '95.  Lainnya. Sebutkan__________________',
            98: '98.  Tidak tahu',
            99: '99.  Menolak menjawab',
        };
        $scope.select_32 = {
            1: '1. Orang tua',
            2: '2. Suami/Istri',
            3: '3. Anak kandung',
            4: '4. Anak angkat/tiri',
            5: '5. Menantu',
            6: '6. Cucu',
            7: '7. Mertua/ saudara ipar',
            8: '8. Famili lain', 
            9: '9. Teman/tetangga',
            10: '10. Pekerja kesehatan',
            11: '11. Pegawai publik',
            95: '95. Lainnya  (sebutkan :________________)'
        };
        $scope.select_58 = {
            1: '1. Hujan',
            2: '2. Panas ',
            3: '3. Tidak Tahu '
        };

        $scope.select_63 = {
            1: '1. Ringan',
            2: '2. Sedang',
            3: '3. Berat'
        };
        $scope.select_64 = {
            1: '1. Berkelanjutan',
            2: '2. Hilang dan timbul', 
            3: '3. Hanya saat malam hari', 
            98: '98. Tidak tahu',
            99: '99. Menolak menjawab'
        };
        $scope.select_80 = {
            1: '1. Terus-Menerus',
            2: '2. Datang dan Pergi',
            98: '98. Tidak tahu',
            99: '99. Menolak menjawab' 
        };
        $scope.select_100 = {
            1: '1. Perut atas',
            2: '2. Perut bawah',
            3: '3. bagian atas dan bagian bawah perut',
            98: '4. Tidak tahu',
            99: '5. Menolak menjawab' 
        };
        $scope.select_103 = {
            1: '1. Secara Cepat',
            2: '2. Perlahan-lahan'
        };
        $scope.select_164 = {
            1: '1. Padat',
            2: '2. Cair',
            3: '3. Keduanya'
        };
        $scope.select_208 = {
            1: '1. Rumah Sakit',
            2: '2. Fasilitas Kesehatan Lain',
            3: '3. Rumah',
            4: '4. Dalam perjalanan menuju Rumah Sakit atau Fasilitas Kesehatan',
            95: '95. Lainnya. Sebutkan __________',
            98: '98. Tidak tahu',
            99: '99. Menolak Menjawab '
        };
        $scope.select_219 = {
            1: '1. Pertama',
            2: '2. Kedua atau Selanjutnya'
        };
        $scope.select_221 = {
            1: '1. Selama Persalinan',
            2: '2. Sesudah Persalinan'
        };
        $scope.select_223 = {
            1:   '1. Rumah Sakit',
            2:   '2. Fasilitas Kesehatan Lain',
            3:   '3. Rumah',
            4:   '4. Dalam perjalanan menuju Rumah Sakit atau Fasilitas Kesehatan',
            95:  '95. Lainnya. Sebutkan __________',
            98:  '98. Tidak Tahu',
            99:  '99. Menolak Menjawab'
        };
        $scope.select_292 = {
            1: '1. Pejalan Kaki',
            2: '2. Pengendara/Penumpang Mobil atau kendaraan kecil',
            3: '3. Pengendara/Penumpang Bus atau kendaraan berat',
            4: '4. Pengendara/Penumpang Sepeda Motor',
            5: '5. Pengendara/Penumpang Sepeda',
            95: '95. Lainnya (sebutkan)'
        };
        $scope.select_293 = {
            1:   '1. Pejalan Kaki',
            2:   '2. Objek Tidak bergerak',
            3:   '3. Mobil atau kendaraan kecil',
            4:   '4. Bus atau kendaraan besar',
            5:   '5. Sepeda Motor',
            6:   '6. Sepeda',
            95:  '95. Lainnya (sebutkan)'
        };
        $scope.select_299 = {
            1: '1. Anjing',
            2: '2. Ular',
            3: '3. Serangga atau Kalajengking',
            95: '95. Lainnya. Sebutkan __________',
            98: '98. Tidak tahu'
        };
        $scope.select_306 = {
            1: 'Rokok',
            2: 'Pipa',
            3: 'Tembakau kunyah',
            4: 'Tembakau Lokal',
            95: '95. Lainnya. Sebutkan __________'
        };
        $scope.select_322 = {
            1: '1. Pengobatan Tadisional',
            2: '2. Homeopatik',
            3: '3. Tokoh Agama',
            4: '4. Rumah sakit Pemerintah',
            5: '5. Puskesmas atau Klinik',
            6: '6. Rumah Sakit Swasta',
            7: '7. Polindes',
            8: '8. Bidan Terlatih',
            9: '9. Dokter Umum',
            10: '10. Anggota keluarga lain',
            11: '11. Apotek (beli obat sendiri)',
            98: '98. Tidak tahu',
            99: '99. Menolak menjawab' 
        };
        $scope.select_500 = {
            1: '1. Berdasarkan tempat kelahiran',
            2: '2. Naturalisasi', 
            3: '3. Warga asing',
            98: '98. Tidak tahu' 
        };
        $scope.select_520 = {
            1: '1. Hijau atau cokelat',
            2: '2. Jernih/normal', 
            95: '95. Lainnya. Sebutkan __________',
            98: '98. Tidak tahu', 
            99: '99. Menolak menjawab' 
        };
        $scope.select_530 = {
            1: '1. Dokter', 
            2: '2. Bidan',
            3: '3. Perawat',
            4: '4. Anggota keluarga lainnya',
            5: '5. Sendiri (oleh ibunya)',
            6: '6. Dukun terlatih', 
            95: '95. Lainnya',
            98: '98. Tidak tahu', 
            99: '99. Menolak menjawab'
        };
        $scope.select_502 = {
            1: '1. Jawa ',
            2: '2. Sunda',
            3: '3. Betawi',
            4: '4. Batak',
            5: '5. Minang',
            6: '6. Melayu',
            7: '7. Ambon',
            8: '8. Bali',
            9: '9. Palembang',
            10: '10. Madura',                                                           
            11: '11. Banjar',
            12: '12. Dayak',
            13: '13. Aceh',
            14: '14. Bima',
            15: '15. India',
            16: '16. Arab',
            17: '17. Cina',
            95: '95. Lainnya, sebutkan'
        };
        $scope.select_503 = {
            1: '1. Ada',
            2: '2. Tidak ada',
            98: '3. Tidak tahu'
        };

        AppService.getTglWawancaraPlusSatu(true).then(function(val) {
            $scope.tglWawancara = val;
        });

        // Display/Tidak Tombol selanjutnya
        $scope.bagian_1_AllowSave = function() {
            var va = $scope.va;
            va.id10002 = '2', va.id10003 = '2';
            var allow = va.id10002 && va.id10003 && va.id10004;
            return allow;
        };
        $scope.bagian_2_AllowSave = function() {
            var va = $scope.va;
            var allow = va.id10007 && va.id10008 && va.id10009 && va.id10010 && va.id10011 && va.id10012 && va.id10013;
                if (va.id10008 === "95") {allow = allow && va.id10008a;}
                if (va.id10013 == 2) {allow = allow && va.alasan_menolak;}
            return allow;
        };
        $scope.bagian_3a_AllowSave = function() {
            var va = $scope.va;
            var allow = va.id10017 && va.id10019 && va.id10020 && va.id10022 && va.id10058 && va.id10052 && va.id10053 &&
                        va.id10054 && va.id10055 && va.id10057;
                if (va.id10020 === '1') { // jika tgl lahir diketahui
                    allow = allow && va.id10021;
                }
                if (va.id10022 === '1') { // jika tgl kematian diketahui
                    allow = allow && va.id10023;
                }
                if (va.id10022 === '2' || va.id10022 === '99') { // jika tgl kematian tdk diketahui atau menolak menjawab
                    allow = allow && va.id10024 != null ; // usia
                }
                if (va.id10020 != '1' || va.id10022 != '1') { // Jika tgl lahir atau tgl kematian tidak diketahui
                    allow = allow && va.age_group; 
                    if (va.age_group === '1') {
                        allow = allow && (va.age_neonate_days!=null || va.age_neonate_hours!=null || va.age_neonate_minutes!=null);
                    }else if (va.age_group === '2') {
                        allow = allow && va.age_child_unit && (va.age_child_days!=null || va.age_child_months!=null || va.age_child_years!=null);
                    }else if (va.age_group === '3') {
                        allow = allow && va.age_adult!=null;
                    }
                }
                if (va.id10058 === '95') { allow = allow && va.id10058a;}
                if (va.id10053 === '95') { allow = allow && va.id10053a;}
                if ($scope.va.isChild === 1 || $scope.va.isAdult === 1) {allow = allow && va.id10056;}
                if ($scope.va.isAdult === 1) {
                    allow = allow && va.id10059;
                    if (va.id10059 == '2' || va.id10059 == '4' || va.id10059 == '5') {
                        allow = allow && va.id10060_a; // apakah tau tgl pernikahan
                        if (va.id10060_a == '1') {allow = allow && va.id10060;} // tgl pernikahan
                    }   
                }
                if ($scope.va.isChild === 1 || $scope.va.isNeonatal === 1) {
                    allow = allow && va.id10061 && va.id10062; // nama ayah & ibu
                }
                if ($scope.va.isChild === 1 || $scope.va.isAdult === 1) {
                    allow = allow && va.id10063 && va.id10064 && va.id10065 && va.id10066;
                    if (va.id10065 === '95') {allow = allow && va.id10065a;}
                }
            return allow;
        };
        $scope.bagian_3b_AllowSave = function() {
            var va = $scope.va;
            var allow = va.id10069 && va.id10073;
                if (va.id10069 === '1') { //jika memiliki sertifikat kematian
                    allow = allow && va.id10070 && va.id10071 && va.id10072;
                }
            return allow;
        };
        $scope.bagian_4_AllowSave = function() {
            var va = $scope.va;
            var allow = va.id10077;
                if (va.id10077 === '1') { //jika luka atau kecelakaan yg berujung pd kematian
                    allow = allow && va.id10079 && va.id10083 && va.id10084 && va.id10085 && va.id10086 && va.id10089
                            && va.id10090 && va.id10091 && va.id10092 && va.id10093 && va.id10094 && va.id10095 && va.id10096
                            && va.id10097 && va.id10098 && va.id10100;
                    if (va.id10079 === '1') { //jika luka karena kecelakaan
                        allow = allow && va.id10080 && va.id10081;
                        if (va.id10080 === '95') {allow = allow && va.id10080a;}
                        if (va.id10081 === '95') {allow = allow && va.id10081a;}
                    }
                    if (va.id10079 != 1) {allow = allow && va.id10082;}
                    if (va.id10086 != 1) {allow = allow && va.id10087;}
                    if (va.id10086 === '1' || va.id10087 === '1') {
                        allow = allow && va.id10088;
                        if (va.id10088 === '95') {allow = allow && va.id10088a;}
                    }
                    if ($scope.va.isAdult === 1 && va.id10098 != 1) {allow = allow && va.id10099;}
                }
            return allow;
        };
        $scope.bagian_5_AllowSave = function() {
            var va = $scope.va;
            var allow = true;
                        if ($scope.va.isNeonatal === 1) {
                            allow = allow && va.id10104 && va.id10109 && va.id10110 && va.id10115;
                            if (va.id10104 === '1') {
                                allow = allow && va.id10105 && (va.id10106!=null) && va.id10107;
                                if (va.id10107 === '1') {allow = allow && (va.id10108!=null);}
                            }
                            if (va.id10110 != '2') {allow = allow && va.id10111 && va.id10112 && va.id10113;}
                            if (va.id10104 === '2' || va.id10109 === '2' || va.id10110 === '2') {
                                allow = allow && va.id10114;
                                if (va.id10114 === '1') {allow = allow && va.id10116;}
                                if (va.id10114 === '2') {allow = allow && va.id10351 && va.id10408;}
                            }
                        }
            return allow;
        };
        $scope.bagian_6a_AllowSave = function() {
            var va = $scope.va;
            var allow = true;
                        if ($scope.va.id10114 != 1) {
                            allow = allow && (va.id10120!=null) && (va.id10122!=null) && va.id10123;
                            if ($scope.va.isChild === 1 || $scope.va.isAdult === 1) {allow = allow && (va.id10121!=null);}
                            // va.id10120 = va.id10120 || null; // jumlah hari
                            // va.id10122 = va.id10122 || null; // jumlah minggu 
                            // va.id10121 = va.id10121 || null; // jumlah bulan
                            // va.id10120_a = (va.id10120 + (va.id10122*7) + (va.id10121*30)) || va.id10120_a;
                        }
            return allow;
        };
        $scope.cal_id10120_a = function(id10120, id10122, id10121){
            id10120 = id10120 ? id10120 : 0; // jumlah hari
            id10122 = id10122 ? id10122 : 0; // jumlah minggu 
            id10121 = id10121 ? id10121 : 0; // jumlah bulan
            $scope.va.id10120_a = id10120 + (id10122*7) + (id10121*30);
            $scope.va.id10120_a = $scope.va.id10120_a;
        }
        $scope.bagian_6d_AllowSave = function() {
            var va = $scope.va;
            var allow = true;
                        if ($scope.va.isChild === 1 || $scope.va.isAdult === 1) {
                            allow = allow && va.id10125 && va.id10126 && va.id10127 && va.id10128 && va.id10130 
                                    && va.id10131 && va.id10133 && va.id10134 && va.id10135 && va.id10136 && va.id10137
                                    && va.id10142 && va.id10143 && va.id10144;
                            if ($scope.va.id10128 === '2') {allow = allow && va.id10129;}
                            if ($scope.va.isChild != 1) {allow = allow && va.id10132;}
                            if ($scope.va.isAdult === 1) {allow = allow && va.id10138 && va.id10139 && va.id10140 && va.id10141;}
                        }
            return allow;
        };
        $scope.bagian_6b_AllowSave = function() {
            var va = $scope.va;
            var allow = true;
            if ($scope.va.id10114 != 1) {
                allow = va.id10147 && va.id10152 && va.id10153 && va.id10159 && va.id10166 && va.id10168;
                if (va.id10147 === "1") {
                    allow = allow && (va.id10148!=null) && va.id10149;
                    if ($scope.va.isChild === 1 || $scope.va.isAdult === 1) {allow = allow && va.id10150 && va.id10151;} 
                }
                if (va.id10153 === "1") {
                    if ($scope.va.isChild === 1 || $scope.va.isAdult === 1) {
                        allow = allow && (va.id10154!=null) && va.id10155 && va.id10156 && va.id10157;
                    } 
                }
                if ((va.id10153 === "1" && ($scope.va.isChild === 1 || $scope.va.isAdult === 1)) || $scope.va.isNeonatal == 1 ) {
                    allow = allow && va.id10158;
                }
                if (va.id10159 === "1") {
                    allow = allow && (va.id10161!=null);
                    if ($scope.va.isNeonatal === 1 || $scope.va.isChild === 1) {allow = allow && (va.id10161b!=null);}
                    if ($scope.va.isAdult === 1) {allow = allow && (va.id10162!=null) && (va.id10163!=null);}
                    if ($scope.va.isChild === 1 || $scope.va.isAdult === 1) {allow = allow && va.id10165;}
                }
                if (va.id10166 === "1") {allow = allow && (va.id10167!=null);}
                if (va.id10168 === "1") {
                    allow = allow && (va.id10169!=null);
                    if ($scope.va.isAdult === 1) {allow = allow && va.id10170 && va.id10171;}
                }
                if ($scope.va.isNeonatal === 1 || $scope.va.isChild === 1) {allow = allow && va.id10172;}
            }
            return allow;
        };
        $scope.bagian_6b_respirationsou_AllowSave = function() {
            var va = $scope.va;
            var allow = true;
                if ($scope.va.id10114 != 1) {
                    allow = allow && va.id10173_c;
                    if ($scope.va.isNeonatal === 1 || $scope.va.isChild == 1) {
                        allow = allow && va.id10173_a && va.id10173_b;
                    }
                    if ($scope.va.isChild === 1 || $scope.va.isAdult === 1) {
                        allow = allow && va.id10174;
                        if ($scope.va.isAdult == 1 && va.id10174 == 1) {allow = allow && va.id10175;}
                        if ($scope.va.isAdult == 1 && va.id10174 == 1) {allow = allow && (va.id10178!=null) && (va.id10179!=null);}
                        if (va.id10174 == 1) {allow = allow && (va.id10176!=null);}
                    }
                }
            return allow;
        };
        $scope.bagian_6b_perut_AllowSave = function() {
            var va = $scope.va;
            var allow = true;
                        if ($scope.va.id10114 != 1) {
                            allow = allow && va.id10181 && va.id10188 && va.id10189;
                            if ($scope.va.isChild === 1 || $scope.va.isAdult === 1) {
                                allow = allow && va.id10193 && va.id10194 && va.id10200 && va.id10204;
                                if (va.id10181 == 1) {allow = allow && (va.id10182!=null);}
                                if (va.id10186 == 1) {allow = allow && va.id10187;}
                                if (va.id10189 == 1) {allow = allow && va.id10192;}
                                if (va.id10194 == 1) {allow = allow && va.id10195;}
                                if (va.id10200 == 1) {allow = allow && (va.id10201!=null) && (va.id10202!=null) && va.id10203;}
                                // va.id10201 = va.id10201 || 0; //hari
                                // va.id10202 = va.id10202 || 0; //bulan
                                // va.id10201_a = va.id10201 + (va.id10202*30);
                                if (va.id10204 == 1) {allow = allow && (va.id10205!=null) && (va.id10206!=null);}
                                // va.id10205 = va.id10205 || 0; //hari
                                // va.id10206 = va.id10206 || 0; //bulan
                                // va.id10205_a = va.id10205 + (va.id10206*30);
                            }
                            if ($scope.va.isChild === 1 || $scope.va.isNeonatal === 1) {
                                if (va.id10181 == 1) {allow = allow && (va.id10183!=null) && (va.id10184!=null);} 
                            }
                            if ($scope.va.isChild === 1 && va.id10181 == 1) {
                                allow = allow && va.id10185;
                            }
                            if (($scope.va.isChild == 1 || $scope.va.isAdult == 1) || (va.id10181 == 1 && $scope.va.isNeonatal == 1)) {allow = allow && va.id10186;}
                            if ($scope.va.isAdult === 1) {
                                if (va.id10189 == 1) {allow = allow && (va.id10190!=null);}
                            }
                            if ($scope.va.isNeonatal != 1 && (va.id10189 == 1 || va.id10188 == 1)) {
                                allow = allow && va.id10191;
                            }
                            if ((($scope.va.isChild == 1 && va.id10195 == 1) || $scope.va.isAdult == 1) && va.id10194 == 1) {
                                allow = allow && (va.id10196!=null) && (va.id10197!=null) && (va.id10197b!=null) && (va.id10198!=null) && va.id10199;
                                // va.id10197 = va.id10197 || 0; // jumlah hari
                                // va.id10197b = va.id10197b || 0; // jumlah minggu 
                                // va.id10198 = va.id10198 || 0; // jumlah bulan
                                // va.id10197_a = va.id10197 + (va.id10197b*7) + (va.id10198*30);
                            }
                            
                        }
            return allow;
        };
        $scope.cal_id10197_a = function(id10197, id10197b, id10198){
            id10197 = id10197 ? id10197 : 0; // jumlah hari
            id10197b = id10197b ? id10197b : 0; // jumlah minggu
            id10198 = id10198 ? id10198 : 0; // jumlah bulan
            $scope.va.id10197_a = id10197 + (id10197b*7) + (id10198*30);
        }
        $scope.cal_id10201_a = function(id10201, id10202){
            id10201 = id10201 ? id10201 : 0; // jumlah hari
            id10202 = id10202 ? id10202 : 0; // jumlah bulan
            $scope.va.id10201_a = id10201 + (id10202*30);
        }
        $scope.cal_id10205_a = function(id10205, id10206){
            id10205 = id10205 ? id10205 : 0; // jumlah hari
            id10206 = id10206 ? id10206 : 0; // jumlah bulan
            $scope.va.id10205_a = id10205 + (id10206*30);
        }
        $scope.bagian_6b_kepala_AllowSave = function() {
            var va = $scope.va;
            var allow = true;
                        if ($scope.va.id10114 != 1) {
                            allow = allow && va.id10214 && va.id10219;
                            if ($scope.va.isChild === 1 || $scope.va.isAdult === 1) {
                                allow = allow && va.id10207 && va.id10208 && va.id10210 && va.id10223 && va.id10227 && va.id10230 && va.id10230_a;
                                if (va.id10208 == 1) {allow = allow && (va.id10209!=null);}
                                if (va.id10210 == 1) {allow = allow && (va.id10211!=null);}
                                if (va.id10214 == 1 && va.id10215 == 1) {allow = allow && va.id10217 && va.id10218}
                                if (va.id10219 == 1) {allow = allow && (va.id10221!=null) && va.id10222;}
                                if (va.id10223 == 1) {allow = allow && va.id10224 && va.id10225 && va.id10226;}
                                if (va.id10230 == 1) {
                                    allow = allow && va.id10231;
                                    if (va.id10231 == 1) {allow = allow && (va.id10232!=null);}
                                }
                            }
                            if ($scope.va.isAdult === 1) {
                                allow = allow && va.id10212 && va.id10228;
                                if (va.id10212 == 1) {allow = allow && (va.id10213!=null);}
                            }
                            if (va.id10214 == 1) {allow = allow && va.id10215;}
                            if ($scope.va.isChild == 1) {
                                if (va.id10214 == 1 && va.id10215 == 1) {allow = allow && (va.id10216!=null);} 
                                if (va.id10219 == 1) {allow = allow && va.id10220;}
                            }
                            if (($scope.va.isAdult == 1 && va.id10228 == 1) || ($scope.va.isChild == 1 && va.id10227 == 1)) {
                                allow = allow && va.id10229;
                            }
                        }
            return allow;
        };
        $scope.bagian_6b_ruam_AllowSave = function() {
            var va = $scope.va;
            var allow = true;
                        if ($scope.va.id10114 != 1) {
                            allow = allow && va.id10233 && va.id10241;
                            if ($scope.va.isChild === 1 || $scope.va.isAdult === 1) {
                                allow = allow && va.id10238 && va.id10243 && va.id10244 && va.id10245 && va.id10246 && va.id10247 && va.id10249 && va.id10252 && va.id10252_a && va.id10253;
                                if (va.id10233 == 1) {
                                    allow = allow && (va.id10234!=null) && va.id10235_a && va.id10235_b && va.id10235_c && va.id10235_d && va.id10235_e && va.id10236;
                                    if (va.id10235_e == 1) {allow = allow && va.id10235_f;}
                                }
                                if (va.id10241 == 1) {allow = allow && va.id10242;}
                                if (va.id10247 == 1) {allow = allow && (va.id10248!=null);}
                                if (va.id10249 == 1) {allow = allow && (va.id10250!=null) && va.id10251;}
                                if (va.id10253 == 1) {allow = allow && va.id10255 && va.id10256 && va.id10257;}
                            }
                            if ($scope.va.isNeonatal === 1 || $scope.va.isChild === 1) {
                                allow = allow && va.id10239 && va.id10240;
                            }
                            if ($scope.va.isAdult === 1) {
                                allow = allow && va.id10237;
                                if (va.id10253 == 1) {allow = allow && va.id10254;}
                            }                            
                        }
            return allow;
        };
        $scope.bagian_6b_lumpuh_AllowSave = function() {
            var va = $scope.va;
            var allow = true;

                        //perhitungan usia
                        if (va.id10020!=1 || va.id10022!=1) { //perhitungan usia jika tgl kematian TIDAK DIKETAHUI, maka menggunakan age_group
                           if (va.age_group == 1) { //jika neonatal maka bulan pasti <= 18
                                $scope.bulantdktau = 0;
                           }
                           if (va.age_group == 2) { //jika child
                                if (va.age_child_unit == 'days') {$scope.bulantdktau = 0;}
                                if (va.age_child_unit == 'months') {$scope.bulantdktau = va.age_child_months;}
                                if (va.age_child_unit == 'years') {$scope.bulantdktau = va.age_child_years*12;}
                           }
                        }
                        if (va.id10020==1 && va.id10022==1) { //perhitungan usia jika tgl lahir dan tgl kematian dan DIKETAHUI
                            $scope.ageInYears = $scope.ageInYears ? $scope.ageInYears : 0;
                            $scope.ageInMonths = $scope.ageInMonths ? $scope.ageInMonths : 0;
                            $scope.ageInMonthsRemain = $scope.ageInMonthsRemain ? $scope.ageInMonthsRemain : 0;
                            
                            $scope.bulantau = ($scope.ageInYears*12) + ($scope.ageInMonths) + ($scope.ageInMonthsRemain*0);
                        }
                        //end of perhitungan usia
                            
                        if ($scope.va.id10114 != 1) {
                            allow = allow && va.id10265;
                            if ($scope.va.isChild === 1 || $scope.va.isAdult === 1) {
                                allow = allow && va.id10258 && va.id10261 && va.id10264 && va.id10267 && va.id10268 && va.id10270;
                                if (va.id10258 == 1) {allow = allow && va.id10259 && va.id10260_a && va.id10260_b && va.id10260_c && va.id10260_d && va.id10260_e && va.id10260_f && va.id10260_g;}
                                if (va.id10261 == 1) {allow = allow && (va.id10262!=null) && va.id10263;}
                                if (va.id10265 == 1) {allow = allow && (va.id10266!=null);}
                            }
                            if ($scope.va.isChild == 1) {
                                allow = allow && va.id10269;
                            }
                            if ($scope.va.isNeonatal == 1) {
                                if (va.id10114 != 1) {
                                    allow = allow && va.id10284 && va.id10286 && va.id10287 && va.id10288 && va.id10289 && va.id10290;
                                    if (va.id10284 == 1) {allow = allow && (va.id10285!=null);}
                                }
                            }
                            if (($scope.bulantau <= 11 || $scope.bulantdktau <= 11) && ($scope.va.isNeonatal == 1 || $scope.va.isChild == 1) && va.id10275 != 1) {
                                allow = allow && va.id10276;
                            }
                            if (($scope.va.isNeonatal == 1 && va.id10114 !=1) || $scope.va.isChild == 1) {
                                allow = allow;
                                if (($scope.bulantau <= 11 || $scope.bulantdktau <= 11) && va.id10273 == 1) {allow = allow && (va.id10274!=null);}
                               
                                if ($scope.bulantau <= 11 || $scope.bulantdktau <= 11) {allow = allow && va.id10271 && va.id10272 && va.id10273 && va.id10275 && va.id10277;}
                            }

                            if (($scope.bulantau <= 18 || $scope.bulantdktau <= 18) && (($scope.va.isNeonatal == 1 && va.id10114 !=1) || $scope.va.isChild == 1)) {
                                allow = allow && va.id10278;
                                if (va.id10278 != 1) {allow = allow && va.id10279;}
                            }
                            if (($scope.bulantau <= 11 || $scope.bulantdktau <= 11) && ((va.id10278 != 1 && $scope.va.isNeonatal == 1 && va.id10114 != 1) || $scope.va.isChild == 1)) {
                                allow = allow && va.id10281;
                            }
                            if (($scope.bulantau <= 11 || $scope.bulantdktau <= 11) && ((va.id10281 == 1 && $scope.va.isNeonatal == 1 && va.id10114 != 1) || $scope.va.isChild == 1)) {
                                allow = allow && va.id10282;
                            }
                            if (($scope.bulantau <= 11 || $scope.bulantdktau <= 11) && ((va.id10281 == 1 && va.id10282 != 1 && $scope.va.isNeonatal == 1 && va.id10114 != 1) || $scope.va.isChild == 1)) {
                                allow = allow && va.id10283;
                            }

                        }
            return allow;
        };
        $scope.bagian_6b_pregnancy_women_AllowSave = function() {
            var va = $scope.va;
            var allow = true;
                        if ($scope.va.isAdult === 1 && va.id10019 == 2) { //jika dewasa dan perempuan kode 2
                            allow = allow && va.id10294 && va.id10295 && va.id10296 && va.id10304 && va.id10305;
                            if (va.id10296 == 1) {
                                allow = allow && va.id10297 && va.id10301 && va.id10302;
                                if (va.id10302 == 1) {allow = allow && (va.id10303!=null);}
                            }  
                            if (va.id10297 == 1) {
                                allow = allow && va.id10298;
                                if (va.id10296 == 1) {allow = allow && va.id10299 && va.id10300}
                            }     
                            if (va.id10305 != 1) {allow = allow && va.id10306;}
                            if (va.id10305 != 1 && va.id10306 != 1) {allow = allow && va.id10307 && va.id10308;}
                            if (va.id10305 == 1) {allow = allow && (va.id10309!=null);}
                            if (va.id10306 != 1) {allow = allow && va.id10310;}
                        }
            return allow;
        };
        $scope.bagian_6b_maternal_AllowSave = function() {
            var va = $scope.va;
            var allow = true;
                        if ($scope.va.isAdult === 1 && va.id10019 == 2 && va.id10310 != 1) { //jika dewasa dan perempuan kode 2
                            allow = allow && va.id10312 && va.id10316 && va.id10317 && va.id10318 && (va.id10319!=null) && va.id10321 && va.id10322 && va.id10323 && va.id10324 && va.id10325 && va.id10328 && va.id10329 && va.id10330 && va.id10331 && (va.id10332!=null) && va.id10333 && va.id10337 && va.id10338 && va.id10339 && va.id10340 && va.id10342;
                            if (va.id10312 != 1) {
                                allow = allow && va.id10313;
                                if (va.id10313 == 1) {
                                    allow = allow && va.id10314;
                                    if (va.id10314 != 1) {allow = allow && va.id10315;}
                                }
                            }
                            if (va.id10319 != 0) {allow = allow && va.id10320;}
                            if (va.id10325 == 1) {allow = allow && va.id10326 && va.id10327;}
                            if (va.id10316 != 1) {
                                allow = allow && va.id10334;
                                if (va.id10334 == 1) {allow = allow && va.id10335 && va.id10336;}
                            }
                            if (va.id10337 == 95) {allow = allow && va.id10337a;}
                            if (va.id10339 == 95) {allow = allow && va.id10339a;}
                            if (va.id10342 != 1) {
                                allow = allow && va.id10343;
                                if (va.id10343 != 1) {allow = allow && va.id10344;}
                            }                      
                        }
            return allow;
        };
        $scope.bagian_5_neonatal_childa_AllowSave = function() {
            var va = $scope.va;
            var allow = true;

                        //perhitungan usia
                        if (va.id10020!=1 || va.id10022!=1) { //perhitungan usia jika tgl kematian TIDAK DIKETAHUI, maka menggunakan age_group
                           if (va.age_group == 1) { //jika neonatal maka bulan pasti <= 18
                                $scope.bulantdktau = 0;
                           }
                           if (va.age_group == 2) { //jika child
                                if (va.age_child_unit == 'days') {$scope.bulantdktau = 0;}
                                if (va.age_child_unit == 'months') {$scope.bulantdktau = va.age_child_months;}
                                if (va.age_child_unit == 'years') {$scope.bulantdktau = va.age_child_years*12;}
                           }
                        }
                        if (va.id10020==1 && va.id10022==1) { //perhitungan usia jika tgl lahir dan tgl kematian dan DIKETAHUI
                            $scope.ageInYears = $scope.ageInYears ? $scope.ageInYears : 0;
                            $scope.ageInMonths = $scope.ageInMonths ? $scope.ageInMonths : 0;
                            $scope.ageInMonthsRemain = $scope.ageInMonthsRemain ? $scope.ageInMonthsRemain : 0;
                            
                            $scope.bulantau = ($scope.ageInYears*12) + ($scope.ageInMonths) + ($scope.ageInMonthsRemain*0);
                        }
                        //end of perhitungan usia

                        if (($scope.va.isNeonatal === 1 || va.id10114 == 1) || ($scope.va.isAdult === 1 && va.id10310 == 2 && va.id10019 == 2)) {
                            allow = allow && va.id10347;
                        }
                        if ($scope.va.isChild === 1) {
                            if ($scope.bulantau <= 11 || $scope.bulantdktau <= 11) {
                                allow = allow && (va.id10352!=null);
                            }
                        }
                        if ($scope.va.isNeonatal == 1 || $scope.va.isChild == 1) {
                            allow = allow && va.id10356;
                            if ($scope.bulantau <= 11 || $scope.bulantdktau <= 11) {
                                allow = allow && va.id10354 && va.id10360 && va.id10361 && va.id10362 && (va.id10366!=null) && (va.id10367!=null) && va.id10368 && va.id10369 && va.id10370;
                                if (va.id10354 == 1) {allow = allow && va.id10355;}
                                if (va.id10356 == 2) {
                                    allow = allow && va.id10357;
                                    if (va.id10357 == 2) {allow = allow && (va.id10358!=null) && (va.id10359!=null);}
                                }
                                if (va.id10360 == 95) {allow = allow && va.id10360a;}
                                if (va.id10362 != 1) {
                                    allow = allow && va.id10363;
                                    if (va.id10363 == 1) {allow = allow && va.id10364;}
                                }
                                if (va.id10363 != 1 && va.id10362 != 1) {allow = allow && va.id10365;}
                                if (va.id10370 != 2) {
                                    allow = allow && va.id10371 && va.id10372;
                                    if (va.id10372 != 1) {allow = allow && va.id10373}
                                }
                            }
                        }
            return allow;
        };

        $scope.bagian_5_neonatal_childb_AllowSave = function() {
            var va = $scope.va;
            var allow = true;
                        if ($scope.va.isNeonatal == 1) {
                            allow = allow && va.id10376 && va.id10377 && (va.id10382!=null) && va.id10383 && va.id10384 && va.id10385 && va.id10387 && va.id10391 && (va.id10394!=null) && va.id10395 && va.id10396 && va.id10397 && va.id10398 && va.id10399 && va.id10400 && va.id10401 && va.id10402 && va.id10403 && va.id10404 && va.id10405 && va.id10406;
                            if (va.id10377 == 1) {allow = allow && (va.id10379!=null) && (va.id10380!=null);}
                            if (va.id10385 == 95) {allow = allow && va.id10385a;}
                            if (va.id10387 != 1) {
                                allow = allow && va.id10388;
                                if (va.id10388 != 1) {allow = allow && va.id10389;}
                            }
                            if (va.id10391 == 1) {allow = allow && (va.id10392!=null) && va.id10393;}
                        }
                        return allow;
        };

        $scope.bagian_8_faktor_resiko_AllowSave = function() {
            var va = $scope.va;
            var allow = true;
                        if ($scope.va.isAdult == 1) {
                            allow = allow && va.id10411 && va.id10412 && va.id10413;
                            if (va.id10413 == 1) {
                                allow = allow && va.id10414;
                                if (va.id10414 != 3) {allow = allow && (va.id10415!=null);}
                            }
                            if (va.id10414 == 95 && va.id10413 == 1) {allow = allow && va.id10414a;}
                        }
            return allow;
        }

        $scope.bagian_7_penggunaan_pelayanan_kesehatan_AllowSave = function() {
            var va = $scope.va;
            var allow = true;
                        if (va.id10114 != 1) {
                            allow = allow && va.id10418 && va.id10432;
                            if (va.id10418 == 1) {
                                allow = allow && va.id10419 && va.id10420 && va.id10421 && va.id10422 && va.id10423 && va.id10424 && va.id10425;
                                if ($scope.va.isAdult == 1 || $scope.va.isChild == 1) {allow = allow && va.id10427;}
                            }
                            if ((va.id10418 == 1 && $scope.va.isNeonatal != 1) && va.id10425 == 1) {allow = allow && va.id10426;}
                            if ($scope.va.isNeonatal == 1 || $scope.va.isChild == 1) {allow = allow && va.id10428;}
                            if (($scope.va.isNeonatal == 1 || $scope.va.isChild == 1) && va.id10428 == 1) {
                                allow = allow && va.id10429;
                                if (va.id10429 == 1) {
                                    allow = allow && va.id10430;
                                    if (va.id10430 == 1) {
                                        allow = allow && va.id10431;
                                    }
                                }
                            }
                            if (va.id10432 == 1) {
                                allow = allow && va.id10433_a && va.id10433_b && va.id10433_c && va.id10433_d && va.id10433_e && va.id10433_f && va.id10433_g && va.id10433_h && va.id10433_i && va.id10433_j && va.id10433_k && va.id10433_l && va.id10434 && va.id10435 && va.id10437;
                                if (va.id10433_l == 1) {allow = allow && va.id10433_m;}
                                if (va.id10435 == 1) {allow = allow && va.id10436;}
                                if (va.id10437 == 1) {
                                    allow = allow && va.id10438;
                                    if (va.id10438 == 1 && $scope.va.isAdult == 1) {
                                        allow = allow && va.id10440_a && va.id10441_a && (va.id10442!=null) && (va.id10443!=null) && va.id10444;
                                        if (va.id10440_a == 1) {allow = allow && va.id10440;}
                                        if (va.id10441_a == 1) {allow = allow && va.id10441;}
                                    }
                                    if (va.id10438 == 1) {
                                        allow = allow && va.id10439_a;
                                        if (va.id10439_a == 1) {allow = allow && va.id10439;}
                                    }
                                }
                            }
                            if ($scope.va.isNeonatal == 1 || ($scope.va.isChild == 1 && va.id10432 == 1)) {
                                allow = allow && va.id10445 && va.id10446;
                            }
                        }
            return allow;
        }

        $scope.bagian_9_latar_belakang_dan_konteks_AllowSave = function() {
            var va = $scope.va;
            var allow = true;
                        if (va.id10114 != 1) {
                            allow = allow && va.id10450 && va.id10455 && va.id10456 && va.id10457 && va.id10458 && va.id10459;
                            if (va.id10450 == 1) {allow = allow && va.id10451 && va.id10452 && va.id10453 && va.id10454;}
                        }
            return allow;
        }

        $scope.bagian_10_akta_kematian_AllowSave = function() {
            var va = $scope.va;
            allow = va.id10462;
                    if (va.id10462 == 1) {
                        allow = allow && va.id10463;
                        if (va.id10463 == 1) {allow = allow && va.id10464 && va.id10466 && va.id10468 && va.id10470 && va.id10472;}
                    }
                    
            return allow;
        }

        $scope.bagian_11_dan_12_AllowSave = function() {
            var va = $scope.va;
            allow = va.id10476 && va.id10481;
                    if ($scope.va.isAdult === 1) {
                        allow = allow && va.id10477_a && va.id10477_b && va.id10477_c && va.id10477_d && va.id10477_e && va.id10477_f && va.id10477_g && va.id10477_h && va.id10477_i && va.id10477_j && va.id10477_k && va.id10477_l;
                        if (va.id10477_l == 1) {allow = allow && va.id10477_m;}
                    }
                    if ($scope.va.isChild === 1) {
                        allow = allow && va.id10478_a && va.id10478_b && va.id10478_c && va.id10478_d && va.id10478_e && va.id10478_f && va.id10478_g && va.id10478_h && va.id10478_i && va.id10478_j && va.id10478_k;
                        if (va.id10478_k == 1) {allow = allow && va.id10478_l;}
                    }
                    if ($scope.va.isNeonatal === 1) {
                        allow = allow && va.id10479_a && va.id10479_b && va.id10479_c && va.id10479_d && va.id10479_e && va.id10479_f && va.id10479_g;
                        if (va.id10479_g == 1) {allow = allow && va.id10479_h;}
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
            var goTo = finish ? 'app.art' : '';

            // simpan model, termasuk yg hidden dg ng-show, exclude hidden dg ng-if
            return AppService.saveDataKelMasked('va', $scope.va, true, goTo);
        };

    }
})();

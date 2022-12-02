(function() {
    angular.module('ehdss')
        .factory('AppService', AppService);

    AppService.$inject = ['$q', '$http', '$rootScope', '$timeout', '$state'];

    function AppService($q, $http, $rootScope, $timeout, $state) {
        var hubRT = {
            '1': 'Kepala RT',
            '2': 'Istri / Suami',
            '3': 'Anak Kandung',
            '4': 'Anak Angkat/Tiri',
            '5': 'Menantu',
            '6': 'Cucu',
            '7': 'Orangtua / Mertua',
            '8': 'Famili Lain',
            '9': 'Pembantu Rumah tangga',
            '10': 'Kost',
            '11': 'Bukan Famili'
        };

        var hubRT2 = {
            '2': 'Istri / Suami',
            '3': 'Anak Kandung',
            '4': 'Anak Angkat/Tiri',
            '5': 'Menantu',
            '6': 'Cucu',
            '7': 'Orangtua / Mertua',
            '8': 'Famili Lain',
            '9': 'Pembantu Rumah tangga',
            '10': 'Kost',
            '11': 'Bukan Famili'
        };

        var penolongPersalinan = {
            '1': 'Dokter Kandungan',
            '2': 'Dokter Umum',
            '3': 'Bidan',
            '4': 'Perawat/nakes lainnya',
            '5': 'Dukun Beranak',
            '6': 'Anggota keluarga/lainnya',
            '7': 'Tidak ada yang menolong'
        };

        var statusKawin = {
            '1': 'Belum Kawin',
            '2': 'Kawin',
            '3': 'Cerai Hidup',
            '4': 'Cerai Mati',
            '5': 'Pisahan',
            '6': 'Rujuk',
            '98': 'Tidak tahu'
        };

        var statusKeikutsertaanRT = {
            '1': 'Ikut Serta',
            '2': 'gagal ditemui',
            '3': 'Menolak',
            '4': 'Meninggal',
            '5': 'Migrasi',
            '6': 'Ruta Gabung',
            '7': 'Tidak bisa komunikasi',
            '8': 'Tidak Ditemukan',
            '9': 'Ikut serta (pecah KK)',
            '10': 'Ikut serta (refreshment)',
            '11': 'Gagal: nomor telp salah',
            '12': 'Gagal: nomor telp tidak aktif',
            '13': 'Gagal: tidak ada tanggapan',
            '14': 'Gagal: tidak ada nomor telp',
        };

        var statusKeikutsertaanART = {
            '1': 'Ada',
            '2': 'Meninggal',
            '3': 'Migrasi',
            '4': 'Keberadaan tidak ada'
        };

        var statusSedangHamil = {
            '1': 'Ya',
            '2': 'Tidak',
            '96': 'Diluar Usia',
            '98': 'Tidak tahu'
        };

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
        var pekerjaan = {
            '1': '1. Tidak Bekerja',
            '2': '2. Ibu Rumah Tangga',
            '3': '3. TNI / Polri',
            '4': '4. Pegawai Negeri Sipil',
            '5': '5. Pegawai BUMN',
            '6': '6. Pegawai Swasta',
            '7': '7. Wiraswasta/Pedagang',
            '8': '8. Pelayanan Jasa',
            '9': '9. Petani',
            '10': '10. Nelayan',
            '11': '11. Buruh',
            '12': '12. Pensiun',
            '13': '13. Pelajar',
            '95': '95. Lainnya',
            '98': '98. Tidak tahu'
        };
        var pekerjaanLainnya = {
            '1': 'buruh - buruh harian lepas',
            '2': 'buruh - buruh nelayan/perikanan',
            '3': 'buruh - buruh peternakan',
            '4': 'buruh - buruh tani/perkebunan',
            '5': 'irt - mengurus rumah tangga',
            '6': 'jasa - akuntan',
            '7': 'jasa - arsitek',
            '8': 'jasa - konsultan',
            '9': 'jasa - mekanik',
            '10': 'jasa - penata busana',
            '11': 'jasa - penata rambut',
            '12': 'jasa - penata rias',
            '13': 'jasa - penterjemah',
            '14': 'jasa - perancang busana',
            '15': 'jasa - psikiater/psikolog',
            '16': 'jasa - tukang batu',
            '17': 'jasa - tukang cukur',
            '18': 'jasa - tukang gigi',
            '19': 'jasa - tukang jahit',
            '20': 'jasa - tukang kayu',
            '21': 'jasa - tukang las/pandai Besi',
            '22': 'jasa - tukang listrik',
            '23': 'jasa - tukang sol sepatu',
            '24': 'jasa - sopir grab/gojek',
            '25': 'pedagang - pedagang',
            '26': 'pegawai bumd - karyawan bumd',
            '27': 'pegawai swasta - juru masak',
            '28': 'pelajar/mahasiswa - pelajar/mahasiswa',
            '29': 'pensiun - pensiunan',
            '30': 'perangkat desa - perangkat desa atau dukuh',
            '31': 'perangkat desa - kepala desa',
            '32': 'petani/pekebun - petani/pekebun',
            '33': 'pns - pegawai negeri sipil',
            '34': 'swasta - konstruksi',
            '35': 'swasta - penyiar radio',
            '36': 'swasta - penyiar televisi',
            '37': 'swasta - pialang',
            '38': 'swasta - sopir',
            '39': 'tidak bekerja - belum/tidak bekerja',
            '40': 'tni/polri - tentara nasional indonesia',
            '41': 'tni/polri - kepolisian ri',
            '42': 'anggota bpk',
            '43': 'anggota dpd',
            '44': 'anggota dprd kab/kota',
            '45': 'anggota dprd Propinsi',
            '46': 'anggota dpr-ri',
            '47': 'apoteker',
            '48': 'asisten rumah tangga',
            '49': 'atlit',
            '50': 'biarawati',
            '51': 'bidan',
            '52': 'desain grafis',
            '53': 'dokter',
            '54': 'dosen',
            '55': 'freelance',
            '56': 'guru',
            '57': 'imam masjid',
            '58': 'industri',
            '59': 'juru masak',
            '60': 'juru parkir',
            '61': 'karyawan honorer',
            '62': 'karyawan swasta',
            '63': 'karyawan toko/restoran',
            '64': 'kasir ',
            '65': 'nelayan/perikanan',
            '66': 'notaris',
            '67': 'online shop',
            '68': 'paraji',
            '69': 'paranormal',
            '70': 'pastur',
            '71': 'pelaut',
            '72': 'penambangan pasir',
            '73': 'pendeta',
            '74': 'peneliti',
            '75': 'pengacara',
            '76': 'pengasuh anak',
            '77': 'pengemudi becak',
            '78': 'pengrajin',
            '79': 'perangkat desa',
            '80': 'perawat',
            '81': 'peternak',
            '82': 'petugas kebersihan',
            '83': 'pilot',
            '84': 'promotor acara',
            '85': 'seniman',
            '86': 'tabib',
            '87': 'transportasi',
            '88': 'ustadz/mubaligh',
            '89': 'wartawan'
        };
        var keberadaan = {
            '1': 'Ada',
            '2': 'Tidak'
        };
        var sumberTglLahir = {
            '1': 'Ingatan',
            '2': 'KTP/SIM',
            '3': 'Kartu Keluarga',
            '4': 'Akta Kelahiran',
            '5': 'Dokumen resmi lain, sebutkan'
        }
        var kepemilikanasuransi = {
            '1': 'Ya',
            '2': 'Tidak',
            '98': 'Tidak tahu'
        };
        var statuskawin = {
            '1': 'Belum Kawin',
            '2': 'Kawin',
            '3': 'Cerai Hidup',
            '4': 'Cerai Mati',
            '5': 'Pisahan',
            '6': 'Rujuk'
        };
        var agama = {
            1: '1. Islam',
            2: '2. Kristen',
            3: '3. Katolik',
            4: '4. Buddha',
            5: '5. Hindu',
            6: '6. Konghucu',
            7: '7. Tidak Beragama',
            8: '8. Lainnya'
        };
        var suku = {
            1: 'Jawa',
            2: 'Sunda',
            3: 'Betawi',
            4: 'Batak',
            5: 'Minang',
            6: 'Melayu',
            7: 'Ambon',
            8: 'Bali',
            9: 'Palembang',
            10: 'Madura',
            11: 'Banjar',
            12: 'Dayak',
            13: 'Aceh',
            14: 'Bima',
            15: 'India',
            16: 'Arab',
            17: 'Cina',
            95: 'Lainnya'
        };
        var asuransi = {
            '01': 'JKN PBI',
            '02': 'JKN Non-PBI : PNS, POLRI, Pejabat Negara, Pegawai Pemerintah Non-PNS',
            '03': 'JKN Non-PBI: Peserta Mandiri',
            '04': 'JKN Non-PBI: Bukan Pekerja',
            '05': 'JKN Non PBI: Pegawai Swasta',
            '06': 'Jamkesda Sleman',
            '07': 'Jamkesda Sleman Mandiri',
            '08': 'Jamkesta Mandiri',
            '09': 'Jamkesos',
            '10': 'Asuransi Swasta',
            '11': 'Perusahaan',
            '98': 'Tidak Tahu',
            '95': 'Lainnya, Sebutkan (dibawah)'
        };
        var kode_enum = {
            1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: '10', 
            11: '11', 12: '12', 13: '13', 14: '14', 15: '15', 16: '16', 17: '17', 18: '18', 19: '19',
            20: '20', 21: '21', 22: '22', 23: '23', 24: '24', 25: '25', 26: '26', 27: '27', 28: '28',
        };
        var listKapanewon = {
            1: 'Gamping',
            2: 'Godean',
            3: 'Moyudan',
            4: 'Minggir',
            5: 'Seyegan',
            6: 'Mlati',
            7: 'Depok',
            8: 'Berbah',
            9: 'Prambanan',
            10: 'Kalasan',
            11: 'Ngemplak',
            12: 'Ngaglik',
            13: 'Sleman',
            14: 'Tempel',
            15: 'Turi',
            16: 'Pakem',
            17: 'Cangkringan'
        }

        var listKalurahanGamping = {
            1: 'Balecatur',
            2: 'Ambarketawang',
            3: 'Banyuraden',
            4: 'Nogotirto',
            5: 'Trihanggo'
        }

        var listKalurahanGodean = {
            6: 'Sidorejo',
            7: 'Sidoluhur',
            8: 'Sidomulyo',
            9: 'Sidoangung',
            10: 'Sidokarto',
            11: 'Sidoarum',
            12: 'Sidomoyo'
        }

        var listKalurahanMoyudan = {
            13: 'Sumberrahayu',
            14: 'Sumbersari',
            15: 'Sumberagung',
            16: 'Sumberarum'
        }

        var listKalurahanMinggir = {
            17: 'Sendangarum',
            18: 'Sendangmulyo',
            19: 'Sendangagung',
            20: 'Sendangsari',
            21: 'Sendangrejo'
        }

        var listKalurahanSeyegan = {
            22: 'Margoluwih',
            23: 'Margodadi',
            24: 'Margokaton',
            25: 'Margomulyo',
            26: 'Margoagung'
        }

        var listKalurahanMlati = {
            27: 'Sinduadi',
            28: 'Sendangadi',
            29: 'Tlogoadi',
            30: 'Tirtoadi',
            31: 'Sumberadi'
        }

        var listKalurahanDepok = {
            32: 'Caturtunggal',
            33: 'Maguwoharjo',
            34: 'Condongcatur'
        }

        var listKalurahanBerbah = {
            35: 'Sendangtirto',
            36: 'Tegaltirto',
            37: 'Kalitirto',
            38: 'Jogotirto'
        }

        var listKalurahanPrambanan = {
            39: 'Sumberharjo',
            40: 'Wukirharjo',
            41: 'Gayamharjo',
            42: 'Sambirejo',
            43: 'Madurejo',
            44: 'Bukoharjo'
        }

        var listKalurahanKalasan = {
            45: 'Purwomartani',
            46: 'Tirtomartani',
            47: 'Tamanmartani',
            48: 'Selomartani'
        }

        var listKalurahanNgemplak = {
            49: 'Sindumartani',
            50: 'Bimomartani',
            51: 'Widodomartani',
            52: 'Wedomartani',
            53: 'Umbulmartani'
        }

        var listKalurahanNgaglik = {
            54: 'Sariharjo',
            55: 'Minomartani',
            56: 'Sinduharjo',
            57: 'Sukoharjo',
            58: 'Sardonoharjo',
            59: 'Donoharjo'
        }

        var listKalurahanSleman = {
            60: 'Caturharjo',
            61: 'Triharjo',
            62: 'Tridadi',
            63: 'Pandowoharjo',
            64: 'Trimulyo'
        }

        var listKalurahanTempel = {
            65: 'Banyurejo',
            66: 'Tambakrejo',
            67: 'Sumberrejo',
            68: 'Pondokrejo',
            69: 'Mororejo',
            70: 'Margorejo',
            71: 'Lumbungrejo',
            72: 'Merdikorejo'
        }

        var listKalurahanTuri = {
            73: 'Bangunkerto',
            74: 'Donokerto',
            75: 'Girikerto',
            76: 'Wonokerto'
        }

        var listKalurahanPakem = {
            77: 'Purwobinangun',
            78: 'Candibinangun',
            79: 'Harjobinangun',
            80: 'Pakembinangun',
            81: 'Hargobinangun'
        }

        var listKalurahanCangkringan = {
            82: 'Argomulyo',
            83: 'Wukirsari',
            84: 'Glagaharjo',
            85: 'Kepuharjo',
            86: 'Umbulharjo'
        }

        var listKalurahanAll = {
            1: 'Balecatur',
            2: 'Ambarketawang',
            3: 'Banyuraden',
            4: 'Nogotirto',
            5: 'Trihanggo',
            6: 'Sidorejo',
            7: 'Sidoluhur',
            8: 'Sidomulyo',
            9: 'Sidoangung',
            10: 'Sidokarto',
            11: 'Sidoarum',
            12: 'Sidomoyo',
            13: 'Sumberrahayu',
            14: 'Sumbersari',
            15: 'Sumberagung',
            16: 'Sumberarum',
            17: 'Sendangarum',
            18: 'Sendangmulyo',
            19: 'Sendangagung',
            20: 'Sendangsari',
            21: 'Sendangrejo',
            22: 'Margoluwih',
            23: 'Margodadi',
            24: 'Margokaton',
            25: 'Margomulyo',
            26: 'Margoagung',
            27: 'Sinduadi',
            28: 'Sendangadi',
            29: 'Tlogoadi',
            30: 'Tirtoadi',
            31: 'Sumberadi',
            32: 'Caturtunggal',
            33: 'Maguwoharjo',
            34: 'Condongcatur',
            35: 'Sendangtirto',
            36: 'Tegaltirto',
            37: 'Kalitirto',
            38: 'Jogotirto',
            39: 'Sumberharjo',
            40: 'Wukirharjo',
            41: 'Gayamharjo',
            42: 'Sambirejo',
            43: 'Madurejo',
            44: 'Bukoharjo',
            45: 'Purwomartani',
            46: 'Tirtomartani',
            47: 'Tamanmartani',
            48: 'Selomartani',
            49: 'Sindumartani',
            50: 'Bimomartani',
            51: 'Widodomartani',
            52: 'Wedomartani',
            53: 'Umbulmartani',
            54: 'Sariharjo',
            55: 'Minomartani',
            56: 'Sinduharjo',
            57: 'Sukoharjo',
            58: 'Sardonoharjo',
            59: 'Donoharjo',
            60: 'Caturharjo',
            61: 'Triharjo',
            62: 'Tridadi',
            63: 'Pandowoharjo',
            64: 'Trimulyo',
            65: 'Banyurejo',
            66: 'Tambakrejo',
            67: 'Sumberrejo',
            68: 'Pondokrejo',
            69: 'Mororejo',
            70: 'Margorejo',
            71: 'Lumbungrejo',
            72: 'Merdikorejo',
            73: 'Bangunkerto',
            74: 'Donokerto',
            75: 'Girikerto',
            76: 'Wonokerto',
            77: 'Purwobinangun',
            78: 'Candibinangun',
            79: 'Harjobinangun',
            80: 'Pakembinangun',
            81: 'Hargobinangun',
            82: 'Argomulyo',
            83: 'Wukirsari',
            84: 'Glagaharjo',
            85: 'Kepuharjo',
            86: 'Umbulharjo'
        }
        var kode_pos = {
            55264: '55264', 55281: '55281', 55282: '55282', 55283: '55283', 55284: '55284', 55285: '55285', 
            55286: '55286', 55287: '55287', 55288: '55288', 55291: '55291', 55292: '55292', 55293: '55293', 55294: '55294', 
            55295: '55295', 55511: '55511', 55512: '55512', 55513: '55513', 55514: '55514', 55515: '55515', 
            55551: '55551', 55552: '55552', 55561: '55561', 55562: '55562', 55563: '55563', 55564: '55564', 
            55571: '55571', 55572: '55572', 55573: '55573', 55581: '55581', 55582: '55582', 55583: '55583',
            55584: '55584', 55592: '55592', 55599: '55599 jika responden tidak tahu'
        };
        var bulanList = {
            1:'Januari', 2:'Februari', 3:'Maret', 4:'April', 5:'Mei', 6:'Juni', 7:'Juli', 
            8:'Agustus', 9:'September', 10:'Oktober', 11:'November', 12:'Desember'
        };
        var bulanList_ = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 
            'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        var kode_spv = {
            1: '1', 2: '2', 3: '3', 4: '4'
        };
        var lf = localforage;
        var baselines = [];

        var me = {
            // FUngsi-fungsi umum, jika banyak mungkin perlu dipisah
            zeroPad: function(num, places) {
                var zero = places - num.toString().length + 1;
                return Array(+(zero > 0 && zero)).join('0') + num;
            },
            makeID: function(length) {
                var result           = '';
                var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                var charactersLength = characters.length;
                for ( var i = 0; i < length; i++ ) {
                    result += characters.charAt(Math.floor(Math.random() * charactersLength));
                }
                return result;
            },
            // Convert Date to string in 'yyyy-mm-dd'
            // karena month di js mulai dari 0, maka tambah satu
            dateToString: function(tgl) {
                if (angular.isDate(tgl)) {
                    return tgl.getFullYear() + '-' +
                        me.zeroPad(tgl.getMonth() + 1, 2) + '-' +
                        me.zeroPad(tgl.getDate(), 2);
                } else {
                    return '';
                }
            },
            // Convert Date to string in 'dd-mm-yyyy'
            // karena month di js mulai dari 0, maka tambah satu
            dateToString_ddmmyyy: function(tgl) {
                if (angular.isDate(tgl)) {
                    return  me.zeroPad(tgl.getDate(), 2) + '-' +
                        me.zeroPad(tgl.getMonth() + 1, 2) + '-' +
                        tgl.getFullYear();
                } else {
                    return '';
                }
            },
            addMonths(date, months) {
                date.setMonth(date.getMonth() + months);
                return date;
            },
            // konversi tanggal String yyyy-mm-dd ke dd-mm-yyyy
            StringDateTo_ddmmyyy: function(str) {
                if (str) {
                    if (str.match(/^\d{4}-\d{2}-\d{2}$/)) {
                        var xs = str.split('-');
                        return xs[2]+'-'+xs[1]+'-'+xs[0];
                    }else if(str.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)){
                        var xs = str.split(' ');
                        var xss = xs[0].split('-');
                        return xss[2]+'-'+xss[1]+'-'+xss[0]+' '+xs[1];
                    }
                }else {
                    return '';
                }
            },
            // konversi tanggal yyyy-mm-dd ke Date (object)
            // karena month mulai dari 0, maka bulan kurangi 1
            stringToDate: function(str) {
                var xs = str.match(/^\d{4}-\d{2}-\d{2}$/);
                if (xs !== null) {
                    xs = str.split('-');
                    return new Date(xs[0], xs[1] - 1, xs[2]);
                } else {
                    return '';
                }
            },
            // Mengambil tanggal hari ini dalam string format 'yyyy-mm-dd'
            getToday: function() {
                return me.dateToString(new Date());
            },
            // YYYY-MM-DD to tanggal indo
            getTglIndo: function(tgl) {
                
                var tanggal_ = new Date(tgl).getDate();
                var bulan_ = new Date(tgl).getMonth();
                var tahun_ = new Date(tgl).getYear();

                var bulan = bulanList_[bulan_];
                var tahun = (tahun_ < 1000) ? tahun_+1900 : tahun_ ;

                return tanggal_+' '+bulan+' '+tahun;
            },
            // Ambil tanggal wawancara, return date jika asString = false, string sebaliknya
            // Jika belum ada, set today
            getTglWawancara: function(asString) {
                var tgl;
                var deferred = $q.defer();
                lf.getItem('options', function(err, val) {
                    if (val && val.tglWawancara) {
                        tgl = val.tglWawancara;
                        if (!asString) {
                            tgl = me.stringToDate(tgl);
                        }
                    } else {
                        tgl = new Date();
                        if (asString) {
                            tgl = me.dateToString(tgl);
                        }
                    }
                    deferred.resolve(tgl);
                });
                return deferred.promise;
            },
            getTglWawancaraMinSatu: function(asString) {
                var deferred = $q.defer();
                me.getTglWawancara().then(function(val) {
                    // dikurangi satu hari
                    var tgl = val.getTime() - 1000 * 60 * 60 * 24 * 1;
                    var out = new Date();
                    out.setTime(tgl);
                    if (asString) {
                        deferred.resolve(me.dateToString(out));
                    } else {
                        deferred.resolve(out);
                    }
                });
                return deferred.promise;
            },
            getTglWawancaraPlusSatu: function(asString) {
                var deferred = $q.defer();
                    var d = new Date();
                    d.setDate(d.getDate()+1);
                    if (asString) {
                        deferred.resolve(me.dateToString(d));
                    } else {
                        deferred.resolve(d);
                    }
                return deferred.promise;
            },
            getTglWawancaraNow: function(asString) {
                var deferred = $q.defer();
                    var d = new Date();
                    d.setDate(d.getDate());
                    if (asString) {
                        deferred.resolve(me.dateToString(d));
                    } else {
                        deferred.resolve(d);
                    }
                return deferred.promise;
            },
            // Mengecek apakah number (num : integer ) masuk kriteria rules
            // rules adalah array: bisa rentang (dengan tanda strip -), nilai, dll
            // misalnya: ['1-10',51,96] = apakah 1-10, 51 atau 96
            isNumberValid: function(num, rules) {
                if (!angular.isArray(rules)) return false;

                num = parseInt(num);
                var i, r, rs;
                for (i = 0; i < rules.length; i++) {
                    r = rules[i];
                    // jika current rule adalah angka
                    if (!isNaN(r)) {
                        if (num === parseInt(r)) return true;
                    } else {
                        rs = r.split('-');
                        // Jika dua nilai rentang adalah number
                        if (!isNaN(rs[0]) && !isNaN(rs[1])) {
                            if (num >= parseInt(rs[0]) || num <= parseInt(rs[1])) {
                                return true;
                            } else {
                                return false;
                            }
                        } else {
                            return false;
                        }
                    }
                }
            },
            getObjectSize : function(obj) {
                var size = 0, key;
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) size++;
                }
                return size;
            },
            // Get list
            cariListPekerjaan: function(filterPekerjaan){
                var pekerjaanArr = [];
                var pekerjaanLength = me.getObjectSize(pekerjaanLainnya);
                for (var i = 1; i <= 98; i++) {
                    if (pekerjaanLainnya[i] && pekerjaanLainnya[i].includes(filterPekerjaan)) {
                        pekerjaanArr.push(pekerjaanLainnya[i]);
                    }
                }
                return pekerjaanArr;
            },
            getListKapanewon: function() {
                return listKapanewon;
            },
            getKapanewon: function(id) {
                return listKapanewon[id] ? listKapanewon[id] : '-';
            },
            getListKalurahan: function(id){
                switch(id) {
                    case '1':
                        return listKalurahanGamping;
                        break;
                    case '2':
                        return listKalurahanGodean;
                        break;
                    case '3':
                        return listKalurahanMoyudan;
                        break;
                    case '4':
                        return listKalurahanMinggir;
                        break;
                    case '5':
                        return listKalurahanSeyegan;
                        break;
                    case '6':
                        return listKalurahanMlati;
                        break;
                    case '7':
                        return listKalurahanDepok;
                        break;
                    case '8':
                        return listKalurahanBerbah;
                        break;
                    case '9':
                        return listKalurahanPrambanan;
                        break;
                    case '10':
                        return listKalurahanKalasan;
                        break;
                    case '11':
                        return listKalurahanNgemplak;
                        break;
                    case '12':
                        return listKalurahanNgaglik;
                        break;
                    case '13':
                        return listKalurahanSleman;
                        break;
                    case '14':
                        return listKalurahanTempel;
                        break;
                    case '15':
                        return listKalurahanTuri;
                        break;
                    case '16':
                        return listKalurahanPakem;
                        break;
                    case '17':
                        return listKalurahanCangkringan;
                        break;

                }
            },
            getListKalurahanAll: function() {
                return listKalurahanAll;
            },
            getKalurahan: function(id) {
                return listKalurahanAll[id] ? listKalurahanAll[id] : '-';
            },
            getPendidikan:  function(id) {
                return pendidikan[id] ? pendidikan[id] : '-';
            },
            getKeberadaan:  function(id) {
                return keberadaan[id] ? keberadaan[id] : '-';
            },
            getPekerjaan:  function(id) {
                return pekerjaan[id] ? pekerjaan[id] : '-';
            },
            getKepemilikanasuransi: function(id) {
                return kepemilikanasuransi[id] ? kepemilikanasuransi[id] : '-';
            },
            listPekerjaan:function(){
                return pekerjaan;
            },
            listPendidikan: function(){
                return pendidikan;
            },
            listHubRT: function() {
                return hubRT;
            },
            listHubRT2: function() {
                return hubRT2;
            },
            listAgama:function(){
                return agama;
            },
            listSuku:function(){
                return suku;
            },
            listStatusKawin:function(){
                return statuskawin;
            },
            listAsuransi:function(){
                return asuransi;
            },
            listKodeEnum:function(){
                return kode_enum;
            },
            listKodePos:function(){
                return kode_pos;
            },
            listKodeSPV:function(){
                return kode_spv;
            },
            getHubRT: function(id, jk) {
                if (jk && id === 2) {
                    if (jk === 1 || jk === 'L') {
                        return 'Suami';
                    } else if (jk === 2 || jk === 'P') {
                        return 'Istri';
                    }
                } else {
                    return hubRT[id] ? hubRT[id] : '?';
                }
            },
            getAge: function(tgl, obj) {
                var birthDate, today = new Date();
                if (angular.isDate(tgl)) {
                    birthDate = tgl;
                } else {
                    birthDate = new Date(tgl);
                }
                var age = today.getFullYear() - birthDate.getFullYear();
                var m = today.getMonth() - birthDate.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }
                if (obj && isNaN(age)) {
                    if (obj.art06a && obj.art06a > 0 && obj.art06a != 98) {
                        age = obj.art06a;
                    } else if (obj.art06b && obj.art06b > 0 && obj.art06b != 98) {
                        age = obj.art06b / 12;
                    } else if (obj.art06c && obj.art06c > 0 && obj.art06c != 98) {
                        age = obj.art06c / 365;
                    }
                }
                // jika number dan ada desimalnya, ambil 2 digit jika bukan x.00
                if (!isNaN(age) && (age % 1 !== 0)) {
                    age = +(age.toFixed(2));
                }
                return age;
            },
            getAgeInDays: function(firstDate, secondDate){ //jumlah hari VA
                var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
                return ageInDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
            },
            // getAgeInYears: function(jumDays){ //jumlah tahun VA
            //     return ageInYears = (jumDays/365.25).toFixed(0);
            // },
            getAgeDetailStr(dateString) {
              var now = new Date();
              var today = new Date(now.getYear(),now.getMonth(),now.getDate());

              var yearNow = now.getYear();
              var monthNow = now.getMonth();
              var dateNow = now.getDate();

              var dob = new Date(dateString);
              var yearDob = dob.getYear();
              var monthDob = dob.getMonth();
              var dateDob = dob.getDate();
              var age = {};
              var ageString = "";
              var yearString = "";
              var monthString = "";
              var dayString = "";


              yearAge = yearNow - yearDob;

              if (monthNow >= monthDob)
                var monthAge = monthNow - monthDob;
              else {
                yearAge--;
                var monthAge = 12 + monthNow -monthDob;
              }

              if (dateNow >= dateDob)
                var dateAge = dateNow - dateDob;
              else {
                monthAge--;
                var dateAge = 31 + dateNow - dateDob;

                if (monthAge < 0) {
                  monthAge = 11;
                  yearAge--;
                }
              }

              age = {
                  years: yearAge,
                  months: monthAge,
                  days: dateAge
                  };

              if ( age.years > 1 ) yearString = " tahun";
              else yearString = " tahun";
              if ( age.months> 1 ) monthString = " bulan";
              else monthString = " bulan";
              if ( age.days > 1 ) dayString = " hari";
              else dayString = " hari";


              if ( (age.years > 0) && (age.months > 0) && (age.days > 0) )
                ageString = age.years + yearString + ", " + age.months + monthString + ", dan " + age.days + dayString;
              else if ( (age.years == 0) && (age.months == 0) && (age.days > 0) )
                ageString = age.days + dayString;
              else if ( (age.years > 0) && (age.months == 0) && (age.days == 0) )
                ageString = age.years + yearString + " Happy Birthday!!";
              else if ( (age.years > 0) && (age.months > 0) && (age.days == 0) )
                ageString = age.years + yearString + " dan " + age.months + monthString;
              else if ( (age.years == 0) && (age.months > 0) && (age.days > 0) )
                ageString = age.months + monthString + " dan " + age.days + dayString;
              else if ( (age.years > 0) && (age.months == 0) && (age.days > 0) )
                ageString = age.years + yearString + " dan " + age.days + dayString;
              else if ( (age.years == 0) && (age.months > 0) && (age.days == 0) )
                ageString = age.months + monthString;
              else ageString = "Oops.. Bayi baru lahir..";

              return ageString;
            },
            getAgeDetail(dateString) {
              var now = new Date();
              var today = new Date(now.getYear(),now.getMonth(),now.getDate());

              var yearNow = now.getYear();
              var monthNow = now.getMonth();
              var dateNow = now.getDate();

              var dob = new Date(dateString);
              var yearDob = dob.getYear();
              var monthDob = dob.getMonth();
              var dateDob = dob.getDate();
              var age = {};
              var ageString = "";
              var yearString = "";
              var monthString = "";
              var dayString = "";


              yearAge = yearNow - yearDob;

              if (monthNow >= monthDob)
                var monthAge = monthNow - monthDob;
              else {
                yearAge--;
                var monthAge = 12 + monthNow -monthDob;
              }

              if (dateNow >= dateDob)
                var dateAge = dateNow - dateDob;
              else {
                monthAge--;
                var dateAge = 31 + dateNow - dateDob;

                if (monthAge < 0) {
                  monthAge = 11;
                  yearAge--;
                }
              }

              age = {
                  years: yearAge,
                  months: monthAge,
                  days: dateAge
                  };

              if ( age.years > 1 ) yearString = " years";
              else yearString = " year";
              if ( age.months> 1 ) monthString = " months";
              else monthString = " month";
              if ( age.days > 1 ) dayString = " days";
              else dayString = " day";


              if ( (age.years > 0) && (age.months > 0) && (age.days > 0) )
                ageString = age.years + "/" + age.months + "/" + age.days;
              else if ( (age.years == 0) && (age.months == 0) && (age.days > 0) )
                ageString = age.years + "/" + age.months + "/" + age.days;
              else if ( (age.years > 0) && (age.months == 0) && (age.days == 0) )
                ageString = age.years + "/" + age.months + "/" + age.days;
              else if ( (age.years > 0) && (age.months > 0) && (age.days == 0) )
                ageString = age.years + "/" + age.months + "/" + age.days;
              else if ( (age.years == 0) && (age.months > 0) && (age.days > 0) )
                ageString = age.years + "/" + age.months + "/" + age.days;
              else if ( (age.years > 0) && (age.months == 0) && (age.days > 0) )
                ageString = age.years + "/" + age.months + "/" + age.days;
              else if ( (age.years == 0) && (age.months > 0) && (age.days == 0) )
                ageString = age.years + "/" + age.months + "/" + age.days;
              else ageString = "Oops! Could not calculate age!";

              return ageString;
            },
            getTglLahir: function(tgl) {
                var val;
                if (angular.isDate(tgl)) {
                    val = tgl;
                    // string harus dalam format yyyy-mm|m-dd|d
                } else if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(tgl)) {
                    val = new Date(tgl);
                } else {
                    return '';
                }

                return val.getFullYear() + '-' +
                    me.zeroPad(val.getMonth() + 1, 2) + '-' + me.zeroPad(val.getDate(), 2);
            },

            getSumberTglLahir:function(id){
                return sumberTglLahir[id] ? sumberTglLahir[id] : '?';
            },
            getStatusKawin: function(id) {
                return statusKawin[id] ? statusKawin[id] : '?';
            },
            getStatusKeikutsertaanRT:function(id){
                return statusKeikutsertaanRT[id] ? statusKeikutsertaanRT[id] : '-';
            },
            getStatusKeikutsertaanART:function(id){
                return statusKeikutsertaanART[id] ? statusKeikutsertaanART[id] : '-';
            },
            getLocalforageData: function(){
                dataAll = [];
                var deferred = $q.defer();
                deferred.notify('Mengambil data localforage');
                lf.iterate(function(val, key, iterationNumber){
                    var data = {};
                    data.number = iterationNumber;
                    data.key = key;
                    data.val = val;
                    dataAll.push(data);
                    
                }, function(err) {
                    if (!err) {
                        deferred.resolve(dataAll);
                    } else {
                        deferred.reject(err);
                    }
                });
                
                return deferred.promise;
            },
            getBaselineKel: function(username) {
                var deferred = $q.defer();
                var dataKels = [];
                lf.getItem('baseline:' + username).then(function(val) { //ambil dari localforge 'baseline:nama'
                    if (val.data_rt.length > 0) {
                        val.data_rt.forEach(function(x) {
                            x.statusIkutSerta = me.getStatusKeikutsertaanRT(x.ket_idrt); //tambahkan status keikutsertaan
                            // cek sudah upload apa belum
                            lf.getItem('uploadData:'+x.idrt).then(function(valUploadData){
                                
                                if (valUploadData && valUploadData.upload == 1) {
                                    x.sudahUploadData = true;
                                }else{
                                    x.sudahUploadData = false;
                                }
                            });

                            // cek sudah upload apa belum
                            lf.getItem('uploadCke:'+x.idrt).then(function(valUploadCke){
                                
                                if (valUploadCke && valUploadCke.upload == 1) {
                                    x.sudahUploadCke = true;
                                }else{
                                    x.sudahUploadCke = false;
                                }
                            });

                            dataKels.push(x);
                        });
                    }
                    // Cek apakah sudah ada salah satu modul yang tersimpan
                    lf.iterate(function(val, key, iterationNumber) {
                        dataKels.forEach(function(elm, idx, array) {
                            // console.log(elm);
                            if (key === ('datakel:' + elm.idrt)) {
                                var allow = val.ir;
                                dataKels[idx]['allowUpload'] = !!allow;
                            }

                            //cek apakah ada data catatan enum
                            if (key === ('catatan:' + elm.idrt)) {
                                dataKels[idx]['allowCatatan'] = true;
                            }

                        });
                    }, function() {
                        // console.log('Iteration has completed');
                        deferred.resolve(dataKels);
                    });
                });
                return deferred.promise;
            },
            getSedangHamil: function(dataART) {
                // art21 merupakan baseline status sedang hamil
                // var prop = dataART.art21; variable status hamil sudah dirubah ke art22
                var prop = dataART.art22;
                return statusSedangHamil[prop] ? statusSedangHamil[prop] : '-';
            },
            getUniqueIdrt: function() {
                var deferred = $q.defer();
                // generate uniques ID 
                // cek datakel degan ID yg sama
                // example id : IDl8o6506i0j0p3xeizv5

                var uniq = 'ID' + Date.now().toString(36) + Math.random().toString(36).substr(2) + me.makeID(5);
                deferred.resolve(uniq);

                return deferred.promise;
            },
            merge_array: function(array1, array2) {
                var result_array = [];
                var arr = array1.concat(array2);
                var len = arr.length;
                var assoc = {};

                while(len--) {
                    var item = arr[len];

                    if(!assoc[item]) 
                    { 
                        result_array.unshift(item);
                        assoc[item] = true;
                    }
                }

                return result_array;
            },
            // menggabungkan data model tersimpan ART (jika ada) ke dataART
            // model = 'krp', 'ptm', dst
            // digunakan di dalam loop fungsi getDataART
            mergeModel: function(val, dataART, model) {
                if (val && val[model]) {
                    var mdVal = {},
                        obj = {},
                        idartBase;
                    // Hanya untuk model yg child property-nya adalah idart
                    for (var idart in val[model]) {
                        if (val[model].hasOwnProperty(idart)) {
                            mdVal = val[model][idart];
                            // loop semua dataART sebelumnya dari baseline
                            for (var i = 0; i < dataART.length; i++) {
                                obj = dataART[i];
                                // ambil dari artb jika ada, else ambil baseline
                                idartBase = obj.artb03b || obj.art03b;
                                if (parseInt(idartBase) === parseInt(idart)) {
                                    dataART[i][model] = mdVal;
                                }
                            }
                        }
                    }
                }

                return dataART;
            },
            // Mengambil data/list ART dari baseline dan menggabungkan dengan artb & part jika ada
            getDataART: function(username, idrt) {
                var deferred = $q.defer();
                username = username || $rootScope.username; // ambil dari controller home
                idrt = idrt || $rootScope.dataRT.idrt; // ambil dari controller home

                var dataART = [];
                $rootScope.dataART = [];
                deferred.notify(username + ' ambil data obj IDRT:' + idrt);

                lf.getItem('baseline:' + username).then(function(val) {
                    if (val && val.data_art && val.data_art.length > 0) {
                        val.data_art.forEach(function(obj) {
                            if (obj.idrt === idrt) {
                                obj._noArt = obj.art00;
                                obj._nama = obj.art01;
                                obj._jk = (parseInt(obj.art04) === 1) ? 'L' : (parseInt(obj.art04) === 2) ? 'P' : '-';
                                obj._hubRT = me.getHubRT(parseInt(obj.art02), parseInt(obj.art04));
                                
                                // jika ada tgl lahir
                                if (obj.art05 && obj.art05!='.') {
                                    obj._tglLahir = me.getTglLahir(obj.art05); //untuk yyyy-mm-dd
                                    obj.umur = me.getAge(obj.art05, obj);
                                    obj.umur = isNaN(obj.umur) ? '-' : obj.umur;
                                }else{
                                    obj._tglLahir = '';
                                    obj.umur = obj.umur_th_rev;
                                }
                                
                                // apakah sedang hamil (khusus obj perempuan 10-54 tahun)
                                obj.idSedangHamil = obj.art22 || '-'; //bisa ada art22 atau tidak, supaya tidak undefined
                                obj.sedangHamil = me.getSedangHamil(obj);
                                obj.statusKawin = me.getStatusKawin(obj.art07);
                                obj.idStatusKawin = obj.art07;
                                // tambahkan property idart
                                obj.idart = obj.art03b;
                                // keberadaan tidak ada
                                if (obj.art21a == 2) { 
                                    obj.artTdkAda = 1;
                                }
                                obj.statusIkutSerta = me.getStatusKeikutsertaanART(obj.ket_kbr);
                                dataART.push(obj);
                            }
                        });

                        // ambil datakel jika ada (sudah tersimpan)
                        lf.getItem('datakel:' + idrt).then(function(val) {

                            // denormalisasi data jam di IR
                            // if (val && val.ir) {
                            //     for (var key in val.ir) {
                            //         if(key == 'jam_mulai_ir' || key == 'jam_selesai_ir'){
                            //             if (val.ir.hasOwnProperty(key)) {
                            //                 var ir = val.ir[key];
                                            
                            //                 for (var idart in ir) {
                            //                     var jam = new Date();
                            //                     if (ir.hasOwnProperty(idart)) {
                            //                         // jika jam bukan string
                            //                         if (angular.isDate(ir[idart])) {
                            //                             ir[idart] = ir[idart];
                            //                         }else{
                            //                             var jam_string = ir[idart];
                            //                             var jam_arr = jam_string.split(":");
                            //                             //set jam string ke Date object
                            //                             ir[idart] = new Date(1970, 0, 1, jam_arr[0], jam_arr[1], 0);
                            //                         }
                            //                     }
                            //                 }
                            //                 if (key == 'jam_mulai_ir') {
                            //                     val.ir.jam_mulai_ir = ir;
                            //                 }else if (key == 'jam_selesai_ir') {
                            //                     val.ir.jam_selesai_ir = ir;
                            //                 }
                            //             }
                            //         }

                            //         if(key == 'tglinput_ir'){
                            //             if (val.ir.hasOwnProperty(key)) {
                            //                 var ir = val.ir[key];
                                            
                            //                 for (var idart in ir) {
                            //                     if (ir.hasOwnProperty(idart)) {
                            //                         // jika tanggal bukan string
                            //                         if (angular.isDate(ir[idart])) {
                            //                             ir[idart] = ir[idart];
                            //                         }else{
                            //                             //set tanggal string ke Date object
                            //                             ir[idart] = new Date(ir[idart]);
                            //                         }
                            //                     }
                            //                 }
                            //                 val.ir.tglinput_ir = ir;
                            //             }

                            //         }
                                    
                            //     }
                            // }//  if (val && val.ir)

                            // denormalisasi data jam di KIM
                            if (val && val.kim) {
                                for (var key in val.kim) {
                                    if (val.kim.hasOwnProperty(key)) {
                                        var kim = val.kim[key];
                                        
                                        for (var idart in kim) {
                                            if (kim.hasOwnProperty(idart)) {
                                                var str = ''+kim[idart];
                                                // jika tanggal dalam format date, skip convert
                                                if (angular.isDate(kim[idart])) {
                                                    kim[idart] = kim[idart];
                                                }
                                                // jika format tgl dalam string yyyy-mm-dd
                                                else if (str.match(/^\d{4}-\d{2}-\d{2}$/)) {
                                                     kim[idart] = new Date(kim[idart]);
                                                     val.kim[key][idart] = kim[idart];
                                                }else{
                                                    //tidak ada perubahan
                                                    kim[idart] = kim[idart];
                                                }
                                            }
                                        }
                                        val.kim;
                                    }
                                }
                            } //  if (val && val.kim)

                            var idart, part, obj;
                            // merge data PART anggota keluarga jika ada
                            if (val && val.part) {
                                for (idart in val.part) { 
                                    if (val.part.hasOwnProperty(idart)) {
                                        part = val.part[idart];
                                        // loop semua dataART sebelumnya dari baseline
                                        for (var i = 0; i < dataART.length; i++) {
                                            obj = dataART[i];
                                            // console.log(obj);
                                            if (obj.art03b === parseInt(idart)) {
                                                // tambahkan part ke art untuk mengetahui sudah terisi atau belum
                                                dataART[i].part = part;
                                                dataART[i]._hubRT = me.getHubRT(parseInt(part.part02), parseInt(obj.art04));
                                                dataART[i].art02 = part.part02;
                                                // jika umur tidak ada, ambil dari PART
                                                obj.umur = !isNaN(obj.umur) ? obj.umur : 
                                                            ((part.part06a) ? part.part06a : 
                                                                ((part.part06a1) ? part.part06a1 : 
                                                                    ((part.part06ax) ? part.part06ax : 
                                                                        ((part.part06a2) ? part.part06a2 : '-'))));
                                                // jika kembali dari migrasi?
                                                if (part.part41 == 1) {
                                                    dataART[i].artTdkAda = 0;
                                                }else
                                                // Jika ART tidak ada ( meninggal atau migrasi)
                                                if (part.part03 == 2) {
                                                    dataART[i].artTdkAda = 1;
                                                }
                                                
                                                // Jika Status Kawin ada isinya
                                                if (part.part05a) {
                                                    dataART[i].statusKawin = me.getStatusKawin(part.part05a);
                                                    dataART[i].art07 = part.part05a;
                                                }
                                                // Kehamilan sudah berakhir ?
                                                if (part.part07 && part.part07 === '1') {
                                                    dataART[i].idSedangHamil = 2;
                                                    dataART[i].sedangHamil = statusSedangHamil[2];
                                                }
                                                // Apakah sejak kunjungan terakhir sampai saat ini pernah hamil ?
                                                if (part.part12 && part.part12 === '1') {
                                                    dataART[i].idSedangHamil = part.part13;
                                                    dataART[i].sedangHamil = statusSedangHamil[part.part13];
                                                }
                                            }
                                        }
                                    }
                                }
                            } //  if (val && val.part)
                            
                            // merge data Perbaikan Baseline anggota keluarga jika ada
                            if (val && val.pb) {
                                for (idart in val.pb) { 
                                    if (val.pb.hasOwnProperty(idart)) {
                                        pb = val.pb[idart];
                                        // loop semua dataART sebelumnya dari baseline
                                        for (var i = 0; i < dataART.length; i++) {
                                            obj = dataART[i];
                                            
                                            if (obj.art03b === parseInt(idart)) {
                                                // tambahkan pb ke art untuk mengetahui sudah terisi atau belum
                                                dataART[i].pb = pb;
                                                // PB jenis kelamin
                                                if (pb.art04_ed) {
                                                    dataART[i].art04 = ''+pb.art04_ed; 
                                                    dataART[i]._jk = (parseInt(pb.art04_ed) === 1) ? 'L' : (parseInt(pb.art04_ed) === 2) ? 'P' : '-';
                                                }
                                                // PB tanggal lahir
                                                if (pb.art05_ed && pb.art05_ed != 'NaN-NaN-NaN') { 
                                                    dataART[i].umur = me.getAge(pb.art05_ed);
                                                    dataART[i]._tglLahir = me.getTglLahir(pb.art05_ed);
                                                }
                                                // PB nama ART
                                                if (pb.art01_ed) {
                                                    dataART[i]._nama = pb.art01_ed;
                                                    dataART[i].art01 = pb.art01_ed;
                                                } 
                                                dataART[i].art09_ed = parseInt(pb.art09_ed); // no urut pasangan pertama
                                                dataART[i].art10_ed = parseInt(pb.art10_ed); // no urut pasangan kedua
                                                dataART[i].art11_ed = parseInt(pb.art11_ed); // no urut pasangan kedua
                                                dataART[i].art12_ed = parseInt(pb.art12_ed); // no urut pasangan kedua
                                            }
                                        }
                                    }
                                }
                            } //  if (val && val.pb)

                            // gabungkan ke list jika ada ARTB
                            if (val && val.artb) {
                                var _umur;
                                for (idart in val.artb) {
                                    obj = {};
                                    if (val.artb.hasOwnProperty(idart)) {
                                        obj = me.deNormalisasiData(val.artb[idart]);
                                        // flag bahwa art ini dari artb
                                        obj.artb = true;
                                        obj._noArt = obj.artb00;
                                        obj._nama = obj.artb01;
                                        // artb04 tersimpan sebagai string
                                        obj._jk = (obj.artb04 == 1) ? 'L' : (obj.artb04 == 2) ? 'P' : '-';
                                        obj._hubRT = me.getHubRT(obj.artb02, obj.artb04);

                                        if (obj.artb24 == 3) { // jika ART lahir di HDSS
                                            obj._tglLahir = me.getTglLahir(obj.artb37); // tgl lahir diambil dari tgl masuk
                                            _umur = me.getAge(obj.artb37, obj);
                                            if (isNaN(_umur)) {
                                                obj._tglLahir = me.getTglLahir(obj.artb38); // tgl lahir diambil dari tgl masuk perkiraan
                                                _umur = me.getAge(obj.artb38, obj);
                                            }
                                            obj.umur = _umur;
                                        }else{
                                            obj._tglLahir = me.getTglLahir(obj.artb05);
                                            _umur = me.getAge(obj.artb05, obj);
                                            if (isNaN(_umur)) {
                                                // cari di key artb06a (thn), artb06b (bln), artb06c (hari)
                                                if (obj.artb06a) {
                                                    _umur = obj.artb06a;
                                                } else if (obj.artb06b) {
                                                    _umur = parseFloat((obj.artb06b / 12).toFixed(1)) || 0;
                                                } else if (obj.artb06c) {
                                                    _umur = parseFloat((obj.artb06c / 365).toFixed(2)) || 0;
                                                } else {
                                                    _umur = 0;
                                                }
                                            }
                                            obj.umur = _umur;
                                        }
                                        

                                        // Jika artb tidak ada
                                        if (obj.artb21a == 2) {
                                            obj.artTdkAda = 1;
                                        }
                                        // apakah sedang hamil (khusus obj perempuan 10-54 tahun)
                                        obj.idSedangHamil = obj.artb22;
                                        obj.sedangHamil = statusSedangHamil[obj.artb22] ? statusSedangHamil[obj.artb22] : '-';
                                        obj.statusKawin = me.getStatusKawin(obj.artb07);
                                        obj.idStatusKawin = obj.art07;
                                        // tambahkan property idart
                                        obj.idart = obj.artb03b;
                                        dataART.push(obj);
                                    }
                                }
                            } // if (val && val.artb)

                            //  jika terisi modul B
                            if (val && val.hl) {
                                for (idart in val.hl) { 
                                    if (val.hl.hasOwnProperty(idart)) {
                                        hl = val.hl[idart];
                                        // loop semua dataART sebelumnya dari baseline
                                        for (var i = 0; i < dataART.length; i++) { // untuk yg art_kart belum terbaca karena dataART.length tdk ada (terbaca 0)
                                            obj = dataART[i];
                                            // console.log(obj);
                                            if (obj.art03b === parseInt(idart)) {
                                                // tambahkan param ke art untuk mengetahui sudah terisi modul B atau belum
                                                dataART[i].modb = 1;                                              
                                            }
                                        }
                                    }
                                }
                            } //  if (val && val.agh)
                            

                            // gabungkan model yang child-ny adalah idart
                            dataART = me.mergeModel(val, dataART, 'krp');
                            // dataART = me.mergeModel(val, dataART, 'ptm');

                            // model yang child-nya bukan idart simpan ke dataRT
                            $rootScope.dataRT.ir = (val && val.ir) || {};

                            // return function
                            deferred.resolve(dataART);
                        });
                    } else {
                        // ambil datakel RT saja jika ada (sudah tersimpan)
                        lf.getItem('datakel:' + idrt).then(function(val) {

                            if (val) {
                                // model yang child-nya bukan idart simpan ke dataRT
                                $rootScope.dataRT.ir = (val && val.ir) || {};
                                
                                // return function
                                deferred.resolve(dataART);
                            }else{
                                deferred.reject('Data IDRT:' + idrt + ' tidak ditemukan');
                            }
                            
                        });
                    }
                });
                return deferred.promise;
            },
            // Ambil user/enumerator baseline yg sudah ada di localStorage
            getBaselineUsers: function() {
                var deferred = $q.defer();
                deferred.notify('Mengambil daftar user baseline tersedia');
                lf.keys(function(err, keys) {
                    // baseline user diawali dengan string "baseline:"
                    var keys_new = [];
                    for (var i = 0; i < keys.length; i++) {
                        if (keys[i].indexOf('baseline:') !== -1) {
                            keys_new.push(keys[i].split(':')[1]);
                        }
                    }
                    deferred.resolve(keys_new);
                });
                return deferred.promise;
            },
            getBaselineAvailable: function() {
                var deferred = $q.defer();
                baselines = [];
                deferred.notify('Mengambil data baseline yg tersedia di localStorage');
                lf.iterate(function(val, key, idx) {
                    if (key.indexOf('baseline:') !== -1) {
                        var base = {};
                        base.username = key.split(':')[1];
                        base.jml_rt = val.data_rt.length;
                        base.jml_art = val.data_art.length;
                        base.list_idrt = [];
                        val.data_rt.forEach(function(val, idx, el) {
                            if (val.idrt) {
                                base.list_idrt.push(val.idrt);
                            }
                        });
                        baselines.push(base);
                    }
                }, function(err) {
                    if (!err) {
                        deferred.resolve(baselines);
                    } else {
                        deferred.reject(err);
                    }
                });
                return deferred.promise;
            },
            getBaselineData: function(username, password) {
                var deferred = $q.defer();
                deferred.notify('Mengambil data baseline untuk user:' + username);

                me.getBaselineAvailable().then(function(data) {
                    // console.log(data);
                    data.forEach(function(val, idx, el) {
                        if (val.username === username) {
                            deferred.reject('Username "' + username + '" sudah ada');
                            return deferred.promise;
                        }
                    });
                });

                $http({
                    method: 'GET',
                    url: $rootScope.serverUrl,
                    timeout: 7000, // 7 detik
                    params: {
                        module: 'data',
                        method: 'list_rt',
                        username: username,
                        password: password ? md5(password) : ''
                    }
                }).then(function(resp) {
                    // this callback will be called asynchronously
                    // when the resp is available
                    var key = 'baseline:' + username;
                    var gagal = resp.data && (resp.data.success === false);
                    if (resp.status === 200 && !gagal) {
                        lf.removeItem(key);

                        // set baseline ke localforage
                        if (resp.data.data_rt.length >= 0) { //dirubah menjadi '>=' agar bisa dimasukkan username yg belum punya data_rt
                            lf.setItem(key, resp.data, function(err, value) { //maukkan ke localforage
                                baselines.push({
                                    username: username,
                                    jml_rt: resp.data.data_rt.length,
                                    jml_art: resp.data.data_art.length
                                });
                                deferred.resolve(baselines);
                            });
                        } else {
                            deferred.reject('Username: ' + username + ' tidak ada');
                        }

                        // set datakel jika ada 
                        for (var idrt in resp.data.data_kel) {
                            (function setItem(_id) { //console.log(_id); _id = idrt
                                me.getDataKel(_id).then(function(data) { //cari data kel yg sudah ada di localforage
                                    if (!data) { // kalau belum ada, set datakel 
                                        lf.setItem('datakel:' + _id, JSON.parse(resp.data.data_kel[_id])); //masukkan datakel ke localforage
                                    }
                                });
                            })(idrt);
                        }
                        
                        // penyesuaian baseline dg art pindah pecah/gabung
                        resp.data.data_art.forEach(function(val, idx){
                            lf.getItem('pindah:'+val.art03b).then(function(val_temp, idx_temp){
                                // jika sudah ada "val_temp" ART yg dipindah
                                if (val_temp) {
                                    if (val.art03b === val_temp.idart) {
                                        resp.data.data_art[idx].idrt = val_temp.idrt_new; //update idrt di baseline sesuai idrt di temp data
                                        resp.data.data_art[idx].art00 = val_temp.art00; //update idrt di baseline sesuai idrt di temp data
                                        lf.setItem(key, resp.data);
                                    }
                                }  
                            });
                        });
                        

                    } else {
                        deferred.reject(resp.data.msg);
                    }
                }, function errorCallback(response) {
                    deferred.reject(response);
                });

                return deferred.promise;
            },
            getDataCatatanEnum: function(username){
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: $rootScope.serverUrl,
                    timeout: 7000, // 7 detik
                    params: {
                        module: 'data',
                        method: 'list_catatan',
                        username: username,
                    }
                }).then(function(resp) {
                    // this callback will be called asynchronously
                    // when the resp is available
                    var gagal = resp.data && (resp.data.success === false);
                    if (resp.status === 200 && !gagal) {
                        lf.removeItem('catatan');

                        // set catatan ke localforage
                        if (resp.data.catatan_enum) {
                            // set datakel jika ada 
                            for (var idrt in resp.data.catatan_enum) {
                                (function setItem(_id) { //console.log(_id); _id = idrt
                                    lf.setItem('catatan:' + _id, resp.data.catatan_enum[_id]); //masukkan catatand ke localforage
                                })(idrt);
                            }
                        } else {
                            deferred.reject('gagal set data catatan');
                        }
                    } else {
                        deferred.reject(resp.data.msg);
                    }
                }, function errorCallback(response) {
                    deferred.reject(response);
                });

                return deferred.promise;
            },
            getStatusUploadData: function(username){
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: $rootScope.serverUrl,
                    timeout: 7000, // 7 detik
                    params: {
                        module: 'data',
                        method: 'list_status_upload_data',
                        username: username,
                    }
                }).then(function(resp) {
                    // this callback will be called asynchronously
                    // when the resp is available
                    var gagal = resp.data && (resp.data.success === false);
                    if (resp.status === 200 && !gagal) {

                        // set catatan ke localforage
                        if (resp.data.status_upload_data) {
                            // set datakel jika ada 
                            for (var idrt in resp.data.status_upload_data) {
                                (function setItem(_id) { //console.log(_id); _id = idrt
                                    lf.setItem('uploadData:' + _id, resp.data.status_upload_data[_id]); //masukkan catatand ke localforage
                                })(idrt);
                            }
                        } else {
                            deferred.reject('gagal set data');
                        }
                    } else {
                        deferred.reject(resp.data.msg);
                    }
                }, function errorCallback(response) {
                    deferred.reject(response);
                });

                return deferred.promise;
            },
            getStatusUploadCke: function(username){
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: $rootScope.serverUrl,
                    timeout: 7000, // 7 detik
                    params: {
                        module: 'data',
                        method: 'list_status_upload_cke',
                        username: username,
                    }
                }).then(function(resp) {
                    // this callback will be called asynchronously
                    // when the resp is available
                    var gagal = resp.data && (resp.data.success === false);
                    if (resp.status === 200 && !gagal) {

                        // set catatan ke localforage
                        if (resp.data.status_upload_cke) {
                            // set datakel jika ada 
                            for (var idrt in resp.data.status_upload_cke) {
                                (function setItem(_id) { //console.log(_id); _id = idrt
                                    lf.setItem('uploadCke:' + _id, resp.data.status_upload_cke[_id]); //masukkan catatand ke localforage
                                })(idrt);
                            }
                        } else {
                            deferred.reject('gagal set data');
                        }
                    } else {
                        deferred.reject(resp.data.msg);
                    }
                }, function errorCallback(response) {
                    deferred.reject(response);
                });

                return deferred.promise;
            },
            getDataARTpindah: function(username){
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: $rootScope.serverUrl,
                    timeout: 7000, // 7 detik
                    params: {
                        module: 'data',
                        method: 'list_pindah',
                        username: username,
                    }
                }).then(function(resp) {
                    // this callback will be called asynchronously
                    // when the resp is available
                    var gagal = resp.data && (resp.data.success === false);
                    if (resp.status === 200 && !gagal) {
                        lf.removeItem('pindah');

                        // set catatan ke localforage
                        if (resp.data.pindah) {
                            // set datakel jika ada 
                            for (var idart in resp.data.pindah) {
                                (function setItem(_id) { //console.log(_id); _id = idart
                                    lf.setItem('pindah:' + _id, resp.data.pindah[_id]); //masukkan catatand ke localforage
                                })(idart);
                            }
                        } else {
                            deferred.reject('gagal set data catatan');
                        }
                    } else {
                        deferred.reject(resp.data.msg);
                    }
                }, function errorCallback(response) {
                    deferred.reject(response);
                });

                return deferred.promise;
            },
            getDataKelAvailable: function() {
                var v, deferred = $q.defer();
                var dataKels = [];
                deferred.notify('Mengambil data keluarga yg ada di localStorage');
                lf.iterate(function(val, key, idx) {
                    if (key.indexOf('datakel:') !== -1) {
                        var base = {};
                        base.idrt = key.split(':')[1];
                        base.no = dataKels.length + 1;
                        base.models = [];
                        for (v in val) {
                            base.models.push(v);
                        }
                        base.modelsDisplay = base.models.join(', ');
                        dataKels.push(base);
                    }
                }, function(err) {
                    if (!err) {
                        deferred.resolve(dataKels);
                    } else {
                        deferred.reject(err);
                    }
                });
                return deferred.promise;
            },
            getNextNoUrutARTB: function(dataART) {
                var no = 0;
                if (!dataART) return no;
                dataART.forEach(function(dt) {
                    no = Math.max(no, dt._noArt);
                });
                return ++no;
            },
            getNextNoUrutARTpecah: function() {
                var dataART = $rootScope.dataART;
                var no = 0;
                if (!dataART) return no;
                dataART.forEach(function(dt) {
                    no = Math.max(no, dt._noArt);
                });
                return ++no;
            },

            /**
             * Mengubah data yg tidak bisa tersimpan di localforage, misal Date
             * @param  {[object]} data object data hasil pendataan
             * @return {[object]}      setelah di normasilasi
             */
            normalisasiData: function(data) {
                var val, result = {};
                
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        val = data[key];

                        // normalisasi data untuk data lv 2 val nya date object
                        /*ubah date object di val menjadi string
                        * normalisasi tanggal
                        */
                        if(typeof(val) == 'object'){
                            for(var idart in val){
                                if (val.hasOwnProperty(idart)) {
                                    // jika tanggal bukan string
                                    if (angular.isDate(val[idart])) {
                                        
                                        var y = me.zeroPad(val[idart].getFullYear());
                                        var m = me.zeroPad(val[idart].getMonth() + 1, 2);
                                        var d = me.zeroPad(val[idart].getDate(), 2);

                                        // cek tanggal atau jam
                                        // jika tgl 1970-01-01, berarti ambil jam:menit saja
                                        var tgl = y+'-'+m+'-'+d;
                                        if (tgl != '1970-01-01') {
                                            val[idart] = y+'-'+m+'-'+d;
                                        }else{
                                            var hours = me.zeroPad(val[idart].getHours(), 2);
                                            var minutes = me.zeroPad(val[idart].getMinutes(), 2);
                                            var seconds = me.zeroPad(val[idart].getSeconds(), 2);
                                            val[idart] = hours+':'+minutes+':'+seconds;
                                        }

                                    }else{
                                        val[idart] = val[idart];
                                    }
                                    
                                }

                            }
                            result[key] = val;
                        }
 
                        // normalisasi data untuk data jam yg val nya date object
                        if (angular.isDate(val)) {
                            // jadikan unix stamp
                            var tgl =   val.getFullYear() + '-' +
                                        me.zeroPad(val.getMonth() + 1, 2) + '-' + 
                                        me.zeroPad(val.getDate(), 2);
                            // cek tanggal atau jam
                            // jika tgl 1970-01-01, berarti ambil jam:menit saja
                            if (tgl != '1970-01-01') {
                                result[key] = tgl;
                            }else{
                                var hours = me.zeroPad(val.getHours(), 2);
                                var minutes = me.zeroPad(val.getMinutes(), 2);
                                var seconds = me.zeroPad(val.getSeconds(), 2);
                                result[key] = hours+':'+minutes+':'+seconds;
                            }
                        } else {
                            result[key] = data[key];
                        }
                    }
                }
                return result;
            },
            // normalisasi data lv1 saja, dari date object ke yyyy-mm-dd
            normalisasiData_: function(data) {
                var deferred = $q.defer();
                var val, result = {};
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        val = data[key];
                        // normalisasi data untuk data yg val nya date object
                        if (angular.isDate(val)) {
                            // jadikan unix stamp
                            result[key] = val.getFullYear() + '-' +
                                me.zeroPad(val.getMonth() + 1, 2) + '-' + me.zeroPad(val.getDate(), 2);
                            // result[key + '_date'] = +data[key];
                        } else {
                            result[key] = data[key];
                        }
                    }
                }
                deferred.resolve(result)
                return deferred.promise;
            },
            // normalisasi single data saja, dari date object ke yyyy-mm-dd
            normalisasiData__: function(data) {
                var deferred = $q.defer();
                var result = {};
                // normalisasi data untuk data yg val nya date object
                if (angular.isDate(data)) {
                    // jadikan unix stamp
                    result = data.getFullYear() + '-' +
                        me.zeroPad(data.getMonth() + 1, 2) + '-' + me.zeroPad(data.getDate(), 2);
                    // result[key + '_date'] = +data[key];
                } else {
                    result = data;
                }
                
                return result;
            },
            /**
             * Kebalikan dari fungsi normalisasiData, spt ubah date string ke object Date
             * @param  {[type]} data [description]
             * @return {[type]}      [description]
             */
            //denormalisasi tanggal
            deNormalisasiData: function(data) {
                var xs, val, result = {};
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        val = data[key];

                        // normalisasi data jam
                        if (angular.isString(val)) {
                            xs = val.match(/^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/);
                            if (xs !== null && xs[1] && xs[2] && xs[3]) {
                                // val = new Date(xs);
                                //set jam string ke Date object                                        
                                val = new Date(1970, 0, 1, xs[1], xs[2], 0);


                            }
                        }

                        // normalisasi data tanggal
                        if (angular.isString(val)) {
                            xs = val.match(/^\d{4}-\d{2}-\d{2}$/);
                            if (xs !== null) {
                                val = new Date(xs);
                            }
                        }

                        result[key] = val;
                    }
                }
                return result;
            },

            // denormalisasi jam untuk keseluruhan object
            deNormalisasiDataJamAll: function(data) {
                var xs, val, result = {};
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        val = data[key];
                        // normalisasi data jam
                        if (angular.isString(val)) {
                            xs = val.match(/^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/);
                            if (xs !== null && xs[1] && xs[2] && xs[3]) {
                                // val = new Date(xs);
                                //set jam string ke Date object                                        
                                val = new Date(1970, 0, 1, xs[1], xs[2], 0);


                            }
                        }
                        result[key] = val;
                    }
                }
                return result;
            },

            // denormalisasi jam untuk 1 data saja
            deNormalisasiDataJam: function(data){
                var result = {};
                var jam_arr = data.split(":");
                //set jam string ke Date object                                        
                result = new Date(1970, 0, 1, jam_arr[0], jam_arr[1], 0);
                return result;
            },
            /**
             * filter model yg hidden atau tidak terdisplay unset dari property
             * @param  {[string]} cls  class dari container form (ion-content)
             * @param  {[object]} data data dari semua ng-model
             * @param  {[string]} clsParent class parent yg akan diambil, jika tidak diisi ambil ion-content
             * @return {[object]}    object dengan property/key data yang tampil saja
             */
             /*
             *cek ion-content: harus ada id="cls" dan class="cls"
             */
            filterModel: function(cls, data, clsParent) {
                if (typeof cls !== 'string') throw 'parameter for filterModel must be string';
                // optimasi agar querySelectorAll lebih cepat, ambil ion-content
                // var els = document.querySelectorAll('ion-content.' + cls);
                var forms = ['input', 'select', 'textarea'];
                var selectors = [];
                // tambahkan class 'modal' jika dari modal window
                // var parent = clsParent ? clsParent : 'ion-content.' + cls;
                var parent = 'ion-content.' + cls;
                forms.forEach(function(i) {
                    selectors.push(parent + ' ' + i + '[ng-model*=' + cls + ']');
                });
                var fields = document.querySelectorAll(selectors.join(','));
                var str, modelx, result = {};
                var isObj, keys;
                // ambil DOM original templates
                // var orgTpl = $rootScope.appTemplates;
                // if (clsParent && orgTpl[cls]) {
                // ambil model original di templates
                // di templates menggunakan ion-checkbox, ion-radio
                // selectors.push('ion-checkbox', 'ion-radio');
                // var orgFields = orgTpl[cls].querySelectorAll(selectors.join(','));
                // }

                // Filter khusus untuk class RT
                // if (me.clsRT.indexOf(cls) !== -1) {
                //     console.log('filterModel on clsRT');
                // } else {
                // loop semua object data, untuk mengambil yg visible saja
                // loop1: for (var key in data) {
                for (var key in data) {
                    // if (data.hasOwnProperty(key)) {
                    if (data.hasOwnProperty(key) && data[key] != null) {
                        // jika key punya property number (ID ART), otomatis masukkan
                        // ini kejadian di template html modal yg biasanya pertanyaan setiap
                        // anggota keluarga
                        // data[key] != null; key yg valuenya null karena number yg dihapus, dilarang masuk
                        isObj = typeof data[key] === 'object';
                        keys  = isObj ? Object.keys(data[key]) : []; 
                        
                        if (isObj && keys.length > 0 && !isNaN(keys[0])) {
                            result[key] = data[key];
                        } else {
                            loop2: for (var i = 0; i < fields.length; i++) {
                                str = fields[i].getAttribute('ng-model');
                                // jika modelnya : "ptm['ptm24' + prop][idart]", ambil name
                                if (str.split('.').length === 1) {
                                    modelx = fields[i].getAttribute('name');
                                } else {
                                    // split pertama: misal part.part05 -> ambil 'part05'
                                    // split kedua: misal pm.pm01ls[d.idart] -> pm01ls[d -> pm01ls
                                    modelx = str.split('.')[1].split('[')[0];
                                }
                                if (str !== null && (key === modelx)) {
                                    result[key] = data[key];
                                    break loop2;
                                }
                            }
                        }
                    }
                }
                // }

                // console.log(result);
                return result;
            },
            /**
             * Mengambil datakel:idrt di localStorage jika ada
             * @param  {string/number} idrt ID rumah tangga 7 digit
             * @param  {string}        model key/property yg akan diambil (optional)
             *   misal: part, artb, dsb...
             * @param  {string}        idArt id anggota rumahtangga (optional)
             * @return {object}        object berisi data-data hasil survey atau empty string
             */
            getDataKel: function(idrt, model, idArt) {
                var deferred = $q.defer();
                lf.getItem('datakel:' + idrt).then(function(value) {
                    var hasil = '';
                    if (value) {
                        if (model && value[model]) {
                            // deNormalisasiData untuk mengubah string date ke object date
                            if (idArt) {
                                if (value[model][idArt]) {
                                    hasil = me.deNormalisasiData(value[model][idArt]); // ubah data tgl ke object (tidak usah denormalisasi ketika upload data yg ada tgl dan jam)
                                } // else hasil = ''
                            } else {
                                hasil = value[model];
                            }
                        } else if (model && !value[model]){
                            // jika ada parameter model, tapi model yg di cari tidak ada di localforage
                            deferred.resolve(hasil);
                        }else {
                            // jika parameter hanya idrt saja, return value
                            deferred.resolve(value);
                        }
                    } // else hasil = ''
                    deferred.resolve(hasil);
                });
                return deferred.promise;
            },

            // 'sf12', 'adl', 'iadl', 'fmbs', 'cane', 'gds', 'mmse', 'mna', 'csdd', 'ir' merupakan modul dari ADL (modul ini memakai contoh KAI)
            // 'kai', 'kim', 'asm', merupakan modul dari KAI
            // class atau modul yg membutuhkan data Anggota Rumah Tangga
            // yang dipakai sebagai property/key data adalah ID ART
            clsART: ['part'],
            // yg hanya membutuhkan data RT, data akan langsung disimpan di root cls
            clsRT: ['ir', 'agh', 'hl', 'srq', 'atr'],
            // selain clsART dan clsRT, misal artb, juga hanya memerlukan dataRT
            // tetapi property/key tetap menggunakan ID ART
            /**
             * Menyimpan data Keluarga hasil pendataan/survey
             * @param  {[type]} cls  [description]
             * @param  {[type]} data [description]
             * @param  {[boolean]} filter Apakah data akan di filter dulu sebelum disimpan
             *   di filter = hanya diambil data yg visible, selain itu unset
             *   akan bernilai true = true, 1, object, dll. False : false, 0, ''
             * @param [{string}] clsParent, class parent formlir yg berisi model
             * @return {[type]}      [description]
             */
            saveDataKel: function(cls, data, filter, clsParent) {
                var deferred = $q.defer();

                // default value adalah di filter (true)
                // jika filter selain FALSE
                if (filter != false) {
                    filter = (typeof filter === 'undefined') ? true : !!filter;
                }
                
                var dataRT = $rootScope.dataRT; //ambil dari controller home
                var curART = $rootScope.curART; // jika save data ARTB

                var idart, idkel; // nomor id anggota rumahtangga
                // Cek dulu apakah dataRT sudah ada, wajib ada sebelum simpan
                if (!dataRT) {
                    // console.log('Data RT/Keluarga belum dipilih');
                    deferred.resolve({ 'success': false, 'msg': 'Data RT/Keluarga belum dipilih' });
                }

                idkel = dataRT.idrt;
                // Jika yg akan disimpan membutuhkan current ART..
                if (me.clsART.indexOf(cls) !== -1) {
                    if (!curART) {
                        // console.log('Data ART belum dipilih');
                        deferred.resolve({ 'success': false, 'msg': 'Data ART belum dipilih' });
                    } else {
                        // Cek dulu data dari artb, baru art
                        idart = curART.artb03b || curART.art03b;
                    }
                } else if (me.clsRT.indexOf(cls) !== -1) {
                    idart = 0;
                } else {
                    // ini khusus ARTB ( hanya membutuhkan dataRT)
                    idart = data.artb03b;
                }

                lf.getItem('datakel:' + idkel).then(function(val) {
                    // ambil data rumahtangga(rt) jika sudah ada, jika blm set empty {}
                    var datakel = val || {};
                    deferred.notify('Filter data, pick only visible field');
                    data = me.normalisasiData(data);
                    var dataSaved = filter ? me.filterModel(cls, data, clsParent) : data;
                    //TODO  : Merge data di localStorage dengan filtered Data
                    datakel[cls] = datakel[cls] || {};
                    // jika idart === 0 maka dataSaved akan langsung disimpan di root
                    if (idart === 0) {
                        datakel[cls] = dataSaved;
                    } else {
                        datakel[cls][idart] = dataSaved;
                    }
                    
                    lf.setItem('datakel:' + idkel, datakel, function(err, val) {
                        // cek apakah ada pembaharuan data dan bandingkan dengan status upload di localforage
                        lf.getItem('uploadData:'+idkel). then(function(val){
                            if (val) {
                            
                                if (val.hash != md5(JSON.stringify(datakel))) {
                                    lf.setItem('uploadData:'+$rootScope.dataRT.idrt, {'hash':md5(JSON.stringify(datakel)), 'upload':'0'});
                                }
                            } 
                        });

                        me.getDataART();
                        deferred.resolve({ 'success': true, 'msg': 'Berhasil menyimpan data' });
                        // console.log('Berhasil menyimpan data idkel:' + idkel);
                    });
                });
                return deferred.promise;
            },
            saveDataKelMasked: function(cls, data, filter, goTo, clsParent) {
                $rootScope.$broadcast('saving:show');
                return me.saveDataKel(cls, data, filter, clsParent).then(function(data) {
                    $rootScope.$broadcast('saving:hide');
                    $rootScope.$broadcast('loading:show');
                    $timeout(function() {
                        $rootScope.$broadcast('loading:hide');
                        if (goTo) $state.go(goTo);
                    }, 500);
                });
            },
            getCurentRT: function(idrt){
                var deferred = $q.defer();
                // ambil data rt
                lf.getItem('datakel:' + idrt).then(function(val){
                    data = me.deNormalisasiData(val.rt)
                    deferred.resolve(data);
                });

                return deferred.promise;
            },
            saveDataRT: function(cls, data, username,filter, clsParent){ //simpan data ke localforage
                var deferred = $q.defer();
                var dataRT = {};
                data = me.normalisasiData(data);
                dataRT[cls] = data || {};
    
                
                lf.getItem('datakel:' + data.idrt).then(function(val_get){
                    if (val_get) { // jika edit, replace datakel rt dengan yg baru
                        val_get.rt = data;
                        lf.setItem('datakel:' + data.idrt, val_get, function(err, val_set){ // update dataRT ke datakel:'idrt'
                            deferred.resolve({ 'success': true, 'msg': 'Berhasil menyimpan data' });
                        });
                    }else{
                        lf.setItem('datakel:' + data.idrt, dataRT, function(err, val){ //masukkan dataRT baru ke datakel:'idrt'
                            deferred.resolve({ 'success': true, 'msg': 'Berhasil menyimpan data' });
                        });
                    }   
                });
                
                return deferred.promise;
            },
            getMaxNoUrutRT: function(kluster){
                var deferred = $q.defer();
                username = $rootScope.username;
                var MaxNoUrutRT;

                lf.getItem('key_perubahan').then(function(val) {
                    val.max_idrt.forEach(function(valMax){
                        if(kluster === parseInt(valMax.kl00)){
                            MaxNoUrutRT = valMax.idrt;
                        }
                    });
                    deferred.resolve(MaxNoUrutRT);
                });

                return deferred.promise;
            },
            genMaxIDRT: function(NoKluster, idrt){
                var deferred = $q.defer();
                var data = {};
                username = $rootScope.username;

                lf.getItem('key_perubahan').then(function(val) {
                    data = val || {};
                    dataMAX = val.max_idrt || {};
                    dataMAX.forEach(function(valDataMax, idx){
                        if(dataMAX[idx].kl00 === NoKluster){
                            dataMAX[idx].idrt = idrt;
                        }
                    });

                    data.max_idrt = dataMAX;
                    lf.setItem('key_perubahan', data, function(err, val) {
                        // me.getDataART();
                        deferred.resolve({ 'success': true, 'msg': 'Berhasil menyimpan data' });
                    });
                });
               
                return deferred.promise;
            },
            saveDataKelSikSatu: function(cls, data, filter, clsParent) {
                var deferred = $q.defer();

                username = $rootScope.username;
                // masukan data RT baru ke baseline afifah/nama yg lain
                lf.getItem('baseline:' + username).then(function(val) { //username harus ada kalo tidak maka error
                    // push dataART baru ke data_art baseline:'username' setelah input data
                    if ($rootScope.editStatus != 'edit') { //jika BUKAN Edit ART_KART, maka push ke data_art
                        val.data_art.push(data); 
                        lf.setItem('baseline:' + username, val, function(err, val) {
                            me.getDataART();
                            deferred.resolve({ 'success': true, 'msg': 'Berhasil menyimpan data' });
                        });
                    }else if ($rootScope.editStatus = 'edit') { //jika EDIT, maka update data art di data_art dg art03b yg sama
                        val.data_art.forEach(function(val_art, idx){
                            if (val_art.art03b == data.art03b) {
                                val.data_art[idx] = data;

                                lf.setItem('baseline:' + username, val, function(err, val) {
                                    me.getDataART();
                                    deferred.resolve({ 'success': true, 'msg': 'Berhasil menyimpan data' });
                                });
                            }
                        });
                    }
                });

                // default value adalah di filter (true)
                filter = (typeof filter === 'undefined') ? true : !!filter;
                var dataRT = $rootScope.dataRT; //ambil dari controller home
                var curART = $rootScope.curART;

                var idart, idkel; // nomor id anggota rumahtangga
                // Cek dulu apakah dataRT sudah ada, wajib ada sebelum simpan
                if (!dataRT) {
                    // console.log('Data RT/Keluarga belum dipilih');
                    deferred.resolve({ 'success': false, 'msg': 'Data RT/Keluarga belum dipilih' });
                }

                idkel = dataRT.idrt;
                // Jika yg akan disimpan membutuhkan current ART..
                if (me.clsART.indexOf(cls) !== -1) {
                    if (!curART) {
                        // console.log('Data ART belum dipilih');
                        deferred.resolve({ 'success': false, 'msg': 'Data ART belum dipilih' });
                    } else {
                        // Cek dulu data dari art_kart, baru art
                        idart = curART.art03b;
                    }
                } else if (me.clsRT.indexOf(cls) !== -1) {
                    idart = 0;
                } else {
                    // ini khusus ARTB ( hanya membutuhkan dataRT)
                    idart = data.art03b;
                }

                lf.getItem('datakel:' + idkel).then(function(val) {
                    // ambil data rumahtangga(rt) jika sudah ada, jika blm set empty {}
                    var datakel = val || {};
                    deferred.notify('Filter data, pick only visible field');
                    data = me.normalisasiData(data);
                    var dataSaved = filter ? me.filterModel(cls, data, clsParent) : data;
                    //TODO  : Merge data di localStorage dengan filtered Data
                    datakel[cls] = datakel[cls] || {};
                    // jika idart === 0 maka dataSaved akan langsung disimpan di root
                    if (idart === 0) {
                        datakel[cls] = dataSaved;
                    } else {
                        datakel[cls][idart] = dataSaved;
                    }

                    lf.setItem('datakel:' + idkel, datakel, function(err, val) {
                        me.getDataART();
                        deferred.resolve({ 'success': true, 'msg': 'Berhasil menyimpan data' });
                        // console.log('Berhasil menyimpan data idkel:' + idkel);
                    });

                });
                return deferred.promise;
            },
            getDataKish: function(dataART) {
                var deferred = $q.defer();
                username = $rootScope.username; // ambil dari controller home
                idrt = $rootScope.dataRT.idrt; // ambil dari controller home

                    // cari urutan umur dari yg tertua
                    data_1 = [];
                    for (var i = 0; i < dataART.length; i++) {
                        // umur 25-64
                        if (dataART[i].umur>=25 && dataART[i].umur<=64) {
                            data_1.push(dataART[i].umur);
                        }
                        // data_1.push(dataART[i].umur);
                    }
                    // sort dari umur tertua
                    data_1.sort(function(a, b){return b - a}); 
                    
                    data_2 = [];
                    // masukan dataART dengan urutan umur tertua
                    for (var i = 0; i < dataART.length; i++) {
                        for (var j = 0; j < dataART.length; j++) {
                            if(dataART[j].umur == data_1[i]){
                                data_2.push(dataART[j]);
                            }
                        }
                    }
                    data_2;
                    // hapus data duplikat
                    data_2 = data_2.filter( function( item, index, inputArray ) {
                               return inputArray.indexOf(item) == index;
                        });

                    data_3 = [];
                    // masukkan dataART filtered jika Laki-Laki
                    for (var i = 0; i < data_2.length; i++) {
                        if(data_2[i]._jk == 'L'){
                            data_3.push(data_2[i]);
                        }
                    }
                    // masukkan dataART filtered jika Perempuan
                    for (var i = 0; i < data_2.length; i++) {
                        if(data_2[i]._jk == 'P'){
                            data_3.push(data_2[i]);
                        }
                    }
                    // beri rank
                    for (var i = 0; i < data_3.length; i++) {
                        data_3[i].rank = (i+1);
                    }
                    
                    dataART = data_3;

                    // return function
                    deferred.resolve(dataART);

                return deferred.promise;
            },
            getKish: function(jumData, lastDigitIDRT) {
                if (jumData === 1) {
                    kish = 1;
                }

                if (jumData === 2) {
                    if (lastDigitIDRT % 2 === 0) {
                        kish = 1;
                    }
                    if (lastDigitIDRT % 2 === 1) {
                        kish = 2;
                    }
                }

                if (jumData === 3) {
                    if (lastDigitIDRT === 0) {
                        kish = 3;
                    }
                    if (lastDigitIDRT === 1) {
                        kish = 1;
                    }
                    if (lastDigitIDRT === 2) {
                        kish = 2;
                    }
                    if (lastDigitIDRT === 3) {
                        kish = 3;
                    }
                    if (lastDigitIDRT === 4) {
                        kish = 1;
                    }
                    if (lastDigitIDRT === 5) {
                        kish = 2;
                    }
                    if (lastDigitIDRT === 6) {
                        kish = 3;
                    }
                    if (lastDigitIDRT === 7) {
                        kish = 1;
                    }
                    if (lastDigitIDRT === 8) {
                        kish = 2;
                    }
                    if (lastDigitIDRT === 9) {
                        kish = 3;
                    }
                }
                
                if (jumData === 4) {
                    if (lastDigitIDRT === 0) {
                        kish = 1;
                    }
                    if (lastDigitIDRT === 1) {
                        kish = 2;
                    }
                    if (lastDigitIDRT === 2) {
                        kish = 3;
                    }
                    if (lastDigitIDRT === 3) {
                        kish = 4;
                    }
                    if (lastDigitIDRT === 4) {
                        kish = 1;
                    }
                    if (lastDigitIDRT === 5) {
                        kish = 2;
                    }
                    if (lastDigitIDRT === 6) {
                        kish = 3;
                    }
                    if (lastDigitIDRT === 7) {
                        kish = 4;
                    }
                    if (lastDigitIDRT === 8) {
                        kish = 1;
                    }
                    if (lastDigitIDRT === 9) {
                        kish = 2;
                    }
                }

                if (jumData === 5) {
                    if (lastDigitIDRT === 0) {
                        kish = 1;
                    }
                    if (lastDigitIDRT === 1) {
                        kish = 2;
                    }
                    if (lastDigitIDRT === 2) {
                        kish = 3;
                    }
                    if (lastDigitIDRT === 3) {
                        kish = 4;
                    }
                    if (lastDigitIDRT === 4) {
                        kish = 5;
                    }
                    if (lastDigitIDRT === 5) {
                        kish = 1;
                    }
                    if (lastDigitIDRT === 6) {
                        kish = 2;
                    }
                    if (lastDigitIDRT === 7) {
                        kish = 3;
                    }
                    if (lastDigitIDRT === 8) {
                        kish = 4;
                    }
                    if (lastDigitIDRT === 9) {
                        kish = 5;
                    }
                }

                if (jumData === 6) {
                    if (lastDigitIDRT === 0) {
                        kish = 6;
                    }
                    if (lastDigitIDRT === 1) {
                        kish = 1;
                    }
                    if (lastDigitIDRT === 2) {
                        kish = 2;
                    }
                    if (lastDigitIDRT === 3) {
                        kish = 3;
                    }
                    if (lastDigitIDRT === 4) {
                        kish = 4;
                    }
                    if (lastDigitIDRT === 5) {
                        kish = 5;
                    }
                    if (lastDigitIDRT === 6) {
                        kish = 6;
                    }
                    if (lastDigitIDRT === 7) {
                        kish = 1;
                    }
                    if (lastDigitIDRT === 8) {
                        kish = 2;
                    }
                    if (lastDigitIDRT === 9) {
                        kish = 3;
                    }
                }

                if (jumData === 7) {
                    if (lastDigitIDRT === 0) {
                        kish = 5;
                    }
                    if (lastDigitIDRT === 1) {
                        kish = 6;
                    }
                    if (lastDigitIDRT === 2) {
                        kish = 7;
                    }
                    if (lastDigitIDRT === 3) {
                        kish = 1;
                    }
                    if (lastDigitIDRT === 4) {
                        kish = 2;
                    }
                    if (lastDigitIDRT === 5) {
                        kish = 3;
                    }
                    if (lastDigitIDRT === 6) {
                        kish = 4;
                    }
                    if (lastDigitIDRT === 7) {
                        kish = 5;
                    }
                    if (lastDigitIDRT === 8) {
                        kish = 6;
                    }
                    if (lastDigitIDRT === 9) {
                        kish = 7;
                    }
                }

                if (jumData === 8) {
                    if (lastDigitIDRT === 0) {
                        kish = 1;
                    }
                    if (lastDigitIDRT === 1) {
                        kish = 2;
                    }
                    if (lastDigitIDRT === 2) {
                        kish = 3;
                    }
                    if (lastDigitIDRT === 3) {
                        kish = 4;
                    }
                    if (lastDigitIDRT === 4) {
                        kish = 5;
                    }
                    if (lastDigitIDRT === 5) {
                        kish = 6;
                    }
                    if (lastDigitIDRT === 6) {
                        kish = 7;
                    }
                    if (lastDigitIDRT === 7) {
                        kish = 8;
                    }
                    if (lastDigitIDRT === 8) {
                        kish = 1;
                    }
                    if (lastDigitIDRT === 9) {
                        kish = 2;
                    }
                }

                if (jumData === 9) {
                    if (lastDigitIDRT === 0) {
                        kish = 8;
                    }
                    if (lastDigitIDRT === 1) {
                        kish = 9;
                    }
                    if (lastDigitIDRT === 2) {
                        kish = 1;
                    }
                    if (lastDigitIDRT === 3) {
                        kish = 2;
                    }
                    if (lastDigitIDRT === 4) {
                        kish = 3;
                    }
                    if (lastDigitIDRT === 5) {
                        kish = 4;
                    }
                    if (lastDigitIDRT === 6) {
                        kish = 5;
                    }
                    if (lastDigitIDRT === 7) {
                        kish = 6;
                    }
                    if (lastDigitIDRT === 8) {
                        kish = 7;
                    }
                    if (lastDigitIDRT === 9) {
                        kish = 8;
                    }
                }

                if (jumData === 10) {
                    if (lastDigitIDRT === 0) {
                        kish = 9;
                    }
                    if (lastDigitIDRT === 1) {
                        kish = 10;
                    }
                    if (lastDigitIDRT === 2) {
                        kish = 1;
                    }
                    if (lastDigitIDRT === 3) {
                        kish = 2;
                    }
                    if (lastDigitIDRT === 4) {
                        kish = 3;
                    }
                    if (lastDigitIDRT === 5) {
                        kish = 4;
                    }
                    if (lastDigitIDRT === 6) {
                        kish = 5;
                    }
                    if (lastDigitIDRT === 7) {
                        kish = 6;
                    }
                    if (lastDigitIDRT === 8) {
                        kish = 7;
                    }
                    if (lastDigitIDRT === 9) {
                        kish = 8;
                    }
                }

                return kish;
            },
            getDataKishrandom: function(data, jumData, lastDigitIDRT) {
                var deferred = $q.defer();
                kishSelection = me.getKish(jumData, lastDigitIDRT);
                // random memakai kish table
                dataRandom = [];
                data.forEach(function(val) {
                    if (val.rank === kishSelection) {
                        dataRandom.push(val);
                    }
                });

                deferred.resolve(dataRandom);
                return deferred.promise;
            },
            saveDataRandom: function(selectedART){
                var deferred = $q.defer();
                lf.getItem('random').then(function(val){
                    if (val) {
                        // data yg akan di push
                        var art = selectedART;
                        art.idrt = $rootScope.dataRT.idrt;
                        art = JSON.parse(angular.toJson(art));
                        // push data
                        val.data_random.push(art);
                        lf.setItem('random', val, function(){
                            deferred.resolve({ 'success': true, 'msg': 'set data random' });
                        });
                    }else{
                        // jika belum ada data di localforage
                        data = {};
                        data_random = [];
                        data.data_random = data_random;
                        // data yg akan di push
                        var art = selectedART;
                        art.idrt = $rootScope.dataRT.idrt;
                        art = JSON.parse(angular.toJson(art));
                        data.data_random.push(art);
                        lf.setItem('random', data, function(){
                            deferred.resolve({ 'success': true, 'msg': 'set data random' });
                        });
                    }
                });
                return deferred.promise;
            },
            getCatatanEnum: function(idrt){
                var deferred = $q.defer();
                lf.getItem('catatan:' + idrt).then(function(val){
                    deferred.resolve(val);
                });
                return deferred.promise;
            },
            saveCatatanEnum: function(cten){
                var deferred = $q.defer();
                idrt = $rootScope.dataRT.idrt;
                cten = me.normalisasiData(cten); //normalisasi tanggal
                cten = me.filterModel('cke',cten); // filter data yg kosong

                lf.setItem('catatan:' + idrt, cten, function(){
                    
                    // cek apakah ada pembaharuan data dan bandingkan dengan status upload di localforage
                    lf.getItem('uploadCke:'+idrt). then(function(val){
                        if (val) {
                        
                            if (val.hash != md5(JSON.stringify(cten))) {
                                lf.setItem('uploadCke:'+$rootScope.dataRT.idrt, {'hash':md5(JSON.stringify(cten)), 'upload':'0'});
                            }
                        } 
                    });
                    
                    deferred.resolve({ 'success': true, 'msg': 'set data catatan' });
                });
                    
                return deferred.promise;
            },
            getDataRandom: function(idrt){
                var deferred = $q.defer();
                // jika ada idrt
                if (idrt) { // cari data dg idrt sama
                    var data = {};
                    lf.getItem('random').then(function(val){
                        val.data_random.forEach(function(valDataRandom, idx){
                            if (valDataRandom.idrt === idrt) {
                                data.random = valDataRandom;
                            }
                        });
                        deferred.resolve(data.random);
                    });
                }else{
                    lf.getItem('random').then(function(val){
                        if (val) {
                            deferred.resolve(val.data_random);
                        }else{
                            deferred.resolve('');
                        }
                    }); 
                }
                
                return deferred.promise;
            },
            // setMaxIdrt: function(data){
            //     var deferred = $q.defer();

            //         lf.getItem('key_perubahan').then(function(val){
            //             if(val){
            //                 // cek apakah sudah ada max_idrt di key perubahan
            //                 lf.getItem('key_perubahan').then(function(val_key){
            //                     val_key.max_idrt = data.idrt_max;
            //                     lf.setItem('key_perubahan', val_key, function(){
            //                         deferred.resolve({ 'success': true, 'msg': 'set data max idrt' });
            //                     });
            //                 });

            //             }else{
            //                 // set key_perubahan jika belum ada 
            //                 var idrt = {};
            //                 idrt.max_idrt = data.idrt_max;
            //                 lf.setItem('key_perubahan', idrt, function(){
            //                     deferred.resolve({ 'success': true, 'msg': 'set data max idrt' });
            //                 });
            //             }
            //         });
            //     return deferred.promise;
            // },
            setMaxIdrt: function(data){
                var deferred = $q.defer();

                    lf.getItem('key_perubahan').then(function(val){
                        if(val){
                            // cek apakah sudah ada max_idrt di key perubahan
                            lf.getItem('key_perubahan').then(function(val_key){
                                val_key.max_idrt = data.idrt_max;
                                lf.setItem('key_perubahan', val_key, function(){
                                    deferred.resolve({ 'success': true, 'msg': 'set data max idrt' });
                                });
                            });

                        }else{
                            // set key_perubahan jika belum ada
                            var data_idrt = {};
                            data_idrt.max_idrt = data.idrt_max;
                            lf.setItem('key_perubahan', data_idrt, function(){
                                deferred.resolve({ 'success': true, 'msg': 'set data max idrt' });
                            });
                        }
                    });
                return deferred.promise;
            },
            moveARTtoTemp: function(art){
                var deferred = $q.defer();
                    // move ART ke localforage temp dengan key "pindah:"
                    lf.setItem('pindah:' + art.idart, art);

                    //deactive art dari idrt sebelumnya supaya tidak muncul di RT lama, set idrt to 0
                    username = $rootScope.username;
                    lf.getItem('baseline:' + username).then(function(val){
                        val.data_art.forEach(function(val_art, idx){
                            if (val_art.art03b === art.idart) {
                                val.data_art[idx].idrt = 0;
                            }
                        });
                        lf.setItem('baseline:' + username, val, function(){
                            deferred.resolve({ 'success': true, 'msg': 'Berhasil pindah ART' });
                        });
                    });
                return deferred.promise;
            },
            getARTtemp: function(idart){
                var deferred = $q.defer();
                lf.getItem('pindah:' + idart).then(function(val){
                    deferred.resolve(val);
                });
                return deferred.promise;
            },
            getlistARTtemp:function(){
                var deferred = $q.defer();
                
                dataAll = [];
                lf.iterate(function(val, key, iterationNumber){
                    if (key.match(/pindah:.*/)) {
                        var data = {};
                        data.number = iterationNumber;
                        data.key = key;
                        data.val = val;
                        dataAll.push(val);
                    }
                }, function(err) {
                    if (!err) {
                        deferred.resolve(dataAll);
                    } else {
                        deferred.reject(err);
                    }
                });

                return deferred.promise;
            },
            changeDataART: function(idart, toIDRT, art00){
                var deferred = $q.defer();
                username = $rootScope.username;
                var no_urut = art00;
                    //update data baseline
                    lf.getItem('baseline:' + username).then(function(val){ 
                        // update data lama dg yg baru di localforage data_art
                        val.data_art.forEach(function(val_art, idx_art){
                            if (val_art.art03b === idart) {
                                val.data_art[idx_art].idrt = toIDRT; //update data idrt to newIDRT
                                val.data_art[idx_art].art00 = no_urut; //update data art00 to newart00
                            }
                            //tambahkan status PECAH jika pindah ke RT Refreshment
                            //tambahkan status GABUNG jika pindah ke RT LAMA
                            val.data_rt.forEach(function(val_rt){
                                // cek dulu apakah RT yg dituju merupakan RT lama atau RT replacement
                                if (val_rt.idrt === toIDRT && val_rt.start_in_wave_rt) { //RT refreshment
                                    lf.getItem('datakel:'+toIDRT).then(function(val_datakel){
                                        var datakel = val_datakel || {};
                                        if (!datakel.status_perubahan) {
                                            datakel['status_perubahan'] = {};
                                        }
                                        
                                        pecah = {};
                                        pecah.pecah = 1;
                                        pecah.art00 = no_urut;
                                        datakel['status_perubahan'][idart] = pecah;
                                        lf.setItem('datakel:'+toIDRT, datakel);
                                    });
                                }
                                if (val_rt.idrt === toIDRT && !val_rt.start_in_wave_rt) { //RT lama
                                    lf.getItem('datakel:'+toIDRT).then(function(val_datakel){
                                        var datakel = val_datakel || {};
                                        if (!datakel.status_perubahan) {
                                            datakel['status_perubahan'] = {};
                                        }
                                        
                                        gabung = {};
                                        gabung.gabung = 1;
                                        gabung.art00 = no_urut;
                                        datakel['status_perubahan'][idart] = gabung;
                                        lf.setItem('datakel:'+toIDRT, val_datakel);
                                    });
                                }
                            });
                        });
                        lf.setItem('baseline:' + username, val);
                    });
                    //update data key_perubahan
                    lf.getItem('pindah:' + idart).then(function(val_pindah){
                        // beri idrt_new pada art temp
                        
                        if (val_pindah.idart === idart) {
                            val_pindah.idrt_new = toIDRT;
                            val_pindah.art00 = no_urut;
                        }
                        
                        lf.setItem('pindah:' + idart, val_pindah, function(){
                            deferred.resolve({ 'success': true, 'msg': 'set data ART berhasil' });
                        });
                    });
                return deferred.promise;
            }
        };
        return me;
    }
})();
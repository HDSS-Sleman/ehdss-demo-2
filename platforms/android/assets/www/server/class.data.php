<?php

require_once 'config.php';
require_once 'class.xlsxwriter.php';

class Data {
    private $db;
    public function __construct() {
        $this->db = new mysqli(DB_SERVER, DB_USER, DB_PWD, DB_NAME);
        if ($this->db->connect_errno) {
            return sprintf("Connect ke Database failed: %s\n", $this->db->connect_error);
        }

        /* Table Name */
        $this->tb_data_art = 'demov2_data_art';
        $this->tb_data_result = 'demov2_data_result';
        $this->tb_data_rt = 'demov2_data_rt';
        $this->tb_users = 'demov2_users';
        $this->tb_user_enum = 'demov2_user_enum';
        $this->tb_user_rt = 'demov2_user_rt';
    }

    public function list_rt() {
        // agar bisa di akses multi domain / Cross Origin (ajax)
        header('Access-Control-Allow-Origin: *');
        $username = isset($_GET['username']) ? $_GET['username'] : '';
        $password = isset($_GET['password']) ? $_GET['password'] : '';
        $username = $this->db->real_escape_string($username);
        $password = $this->db->real_escape_string($password);
        if (empty($username) || empty($password)) {
            exit('{"success": false, "msg": "Username dan Password harus terisi"}');
        }

        // di tabel user, password = md5(md5(password)) - default user + 789
        // jadi yg dikirim harus sudah berupa md5(password) 
        // ambil dari table demov2_users
        $sql_user = "SELECT * FROM ".$this->tb_users." WHERE user = '$username' AND password=md5('$password')";
        $result_user = $this->db->query($sql_user);
        if($result_user->num_rows === 0) {
            exit('{"success": false, "msg": "Username atau Password yang dimasukkan salah"}');
        }

        // pilih idrt yang dimiliki user enum $username
        $sql_idrt_user = "SELECT idrt FROM ".$this->tb_user_rt." WHERE user = '$username'";
        // ambil ART yang ada idrt
        $sql_art = "SELECT * FROM ".$this->tb_data_art." WHERE idrt IN ($sql_idrt_user)";
        $result_art = $this->db->query($sql_art);

        // agar query cepat, pastikan idrt di index di demov2_data_rt dan demov2_data_art (kpd01 juga)
        $sql_rt = "SELECT * FROM ".$this->tb_data_rt." WHERE idrt IN ($sql_idrt_user)";

        // Tambah kolom jumlah ART (old query karena masih abil demov2_data_result tgl yg lama)
        // $sql_rt = "SELECT t1.*, t2.*, t3.datakel FROM ".$this->tb_data_rt." t1 
        //     LEFT JOIN (
        //      select idrt, count(*) jml_art from ".$this->tb_data_art."
        //         WHERE idrt IN ($sql_idrt_user)
        //         group by idrt
        //     ) t2
        //     ON t1.idrt = t2.idrt
        //     LEFT JOIN (
        //      SELECT idrt,MAX(tanggal),data as datakel FROM ".$this->tb_data_result." GROUP BY idrt
        //     ) t3
        //     ON t1.idrt = t3.idrt
        //     WHERE t1.idrt IN ($sql_idrt_user)";

        // Tambah kolom jumlah ART (new query karena sudah abil demov2_data_result tgl yg terbaru)
        $sql_rt = "SELECT t1.*, t2.*, t3.datakel FROM ".$this->tb_data_rt." t1
            LEFT JOIN (
                SELECT idrt, COUNT(*) jml_art FROM ".$this->tb_data_art."
                WHERE idrt IN ($sql_idrt_user)
                GROUP BY idrt
            ) t2
            ON t1.idrt = t2.idrt
            LEFT JOIN (
                -- old query
                -- SELECT idrt, tanggal, data AS datakel FROM ".$this->tb_data_result." 
                -- WHERE tanggal IN (SELECT id_tb.tgl FROM (SELECT id_data_result,idrt,MAX(tanggal) AS tgl FROM `".$this->tb_data_result."` GROUP BY idrt) AS id_tb) 
                -- ORDER BY `".$this->tb_data_result."`.`idrt` ASC
                SELECT t11.idrt, t11.tanggal, t11.data as datakel FROM ".$this->tb_data_result." t11
                LEFT JOIN ".$this->tb_user_rt." t22 ON t11.idrt = t22.idrt
                WHERE t11.tanggal = (SELECT MAX(t22.tanggal) FROM ".$this->tb_data_result." t22 WHERE t22.idrt = t11.idrt)
                ORDER BY t11.idrt ASC
            ) t3
            ON t1.idrt = t3.idrt
            WHERE t1.idrt IN ($sql_idrt_user)";    

        // mysqli_result::fetch_all() requires MySQL Native Driver (mysqlnd).
        // Ubuntu users can just do: sudo apt-get install php5-mysqlnd
        // ini_set("display_errors", "1");
        // error_reporting(E_ALL);

        $data_art = [];
        $data_rt = [];

        if ($result_art) {
            $hasil = new stdClass();
            $hasil->data_art = array();
            while ($row = $result_art->fetch_assoc()) {
                // $hasil->data_art[] = $row; //old
                $data_art[] = $row;
            }

            $hasil->data_rt = array();
            $hasil->data_kel = array();
            $result_rt = $this->db->query($sql_rt);
            while ($row = $result_rt->fetch_assoc()) {
                if(isset($row['datakel'])) {
                    $hasil->data_kel[$row['idrt']] = $row['datakel'];
                    unset($row['datakel']);
                }
                // $hasil->data_rt[] = $row; //old
                $row['krt03'] = '"'.$row['krt03'].'"'; // add quotations for phone number, to keep leading zero
                $data_rt[] = $row; //new
            }
            
            // query untuk tambahan rt baru siklus 1 berdasarkan username diambil data yg terbaru
            // $sql_s1 = "SELECT idrt, data FROM demov2_data_result 
            //             WHERE tanggal IN (SELECT id_tb.tgl FROM (SELECT id_data_result,idrt,MAX(tanggal) AS tgl FROM `demov2_data_result` WHERE DATA LIKE '%enum_".$username."_enum%' GROUP BY idrt) AS id_tb) 
            //             ORDER BY `demov2_data_result`.`idrt` ASC";
            $sql_s1 = "SELECT t11.idrt, t11.data FROM ".$this->tb_data_result." t11
                    LEFT JOIN ".$this->tb_user_rt." t22 ON t11.idrt = t22.idrt
                    WHERE t11.tanggal = (SELECT MAX(t22.tanggal) FROM ".$this->tb_data_result." t22 WHERE t22.idrt = t11.idrt AND t11.data LIKE '%enum_".$username."_enum%')
                    ORDER BY t11.idrt ASC";            
            $result_s1 = $this->db->query($sql_s1);
            $data_rt1 = [];
            if (!empty($result_s1)) {
                while ($row = $result_s1->fetch_assoc()) {
                    $data_rt1[] = json_decode($row['data']); //ambil data yg akan di push ke data_rt
                    $hasil->data_kel[$row['idrt']] = $row['data']; //tambah data_kel baru ke data_kel lama
                }
                // diambil data rt baru dari $data_rt1 di push dg data_rt lama dari $data_rt[]
                if (!empty($data_rt1)) {
                    foreach ($data_rt1 as $key => $val) {
                        if (!empty($val->rt)) {
                            array_push($data_rt, json_decode(json_encode($val->rt), True)); //tambah data_rt baru ke data_rt lama
                        }
                        if (!empty($val->art_kart)) {
                           $data_art_kart[] = json_decode(json_encode($val->art_kart), True);
                        }
                    
                    }
                }
                if (!empty($data_art_kart)) {
                    foreach ($data_art_kart as $key => $val_1) {
                        if (!empty($val_1)) {
                            foreach ($val_1 as $key => $value_2) {
                               array_push($data_art, $value_2); //tambah data_art baru ke data_art lama
                            }
                        }
                    }
                }
            }
            $hasil->data_art = $data_art;
            $hasil->data_rt = $data_rt;

            // echo json_encode($hasil, JSON_NUMERIC_CHECK); // JSON_NUMERIC_CHECK dinonaktifkan jika leading zero no hp hilang
            echo json_encode($hasil);
        } else {
            exit('{"success": false, "msg": "Empty atau Gagal mengambil data"}');
        }
    }

    /* Ambil status upload data wawancara*/
    public function list_status_upload_data(){
        // agar bisa di akses multi domain / Cross Origin (ajax)
        header('Access-Control-Allow-Origin: *');
        $username = isset($_GET['username']) ? $_GET['username'] : '';
        $username = $this->db->real_escape_string($username);
        $username = preg_replace('/[0-9]+/', '', $username); // hilangkan angka dalam username
        $ktlp = [];

        // Baik yg ada di baseline maupun data refresh/pecah
        $sql = "SELECT t11.idrt, t11.hash FROM ".$this->tb_data_result." t11
                LEFT JOIN ".$this->tb_user_rt." t22 ON t11.idrt = t22.idrt
                WHERE t11.tanggal = (SELECT MAX(t22.tanggal) FROM ".$this->tb_data_result." t22 WHERE t22.idrt = t11.idrt AND ( t22.user LIKE '%".$username."%' OR t11.data LIKE '%enum_".$username."_enum%' ) )
                ORDER BY t11.idrt ASC";
        
        $result = $this->db->query($sql);

        if ($result) {
            $hasil = new stdClass();
            $hasil->status_upload_data = array();
            while ($row = $result->fetch_assoc()) {
                // tambahkan status upload
                $row['upload'] = 1;
                $hasil->status_upload_data[$row['idrt']]  = $row;
            }
            echo json_encode($hasil, JSON_NUMERIC_CHECK);
        }else{
            exit('{"success": false, "msg": "Empty atau Gagal mengambil data"}');
        }
    }

    public function info_kel() {
        // agar bisa di akses multi domain / Cross Origin (ajax)
        header('Access-Control-Allow-Origin: *');
        $sql = "SELECT date_format(tanggal,'%Y-%m-%d %T') as tanggal, data
            FROM ".$this->tb_data_result." WHERE idrt = ? ORDER BY tanggal DESC LIMIT 10";
        // ditambah user enumerator idrt
        $sql = "SELECT t1.*,t2.enumerator FROM (
                    SELECT idrt, date_format(tanggal,'%Y-%m-%d %T') as tanggal, data
                    FROM ".$this->tb_data_result." WHERE idrt = ? ORDER BY tanggal DESC LIMIT 10) t1
                LEFT JOIN (
                    SELECT idrt, min(art00), kpd01 as enumerator FROM ".$this->tb_data_art." GROUP BY idrt
                ) t2
                ON t1.idrt = t2.idrt";
        $stmt = $this->db->prepare($sql);
        $stmt->bind_param('s', $_GET['idrt']);
        $stmt->execute();
        /* bind variables to prepared statement */
        $stmt->bind_result($idrt,$tgl,$data,$enumerator);
        $hasil = array();
        /* fetch values */
        while($stmt->fetch()) {
            $obj = new stdClass();
            $obj->idrt = $idrt;
            $obj->tgl = $tgl;
            $obj->enumerator = $enumerator;
            $obj->models = array();
            $dataJson = json_decode($data);
            foreach ($dataJson as $key => $value) {
                array_push($obj->models, $key);
            }
            $obj->modelsDisplay = implode(', ', $obj->models);
            array_push($hasil, $obj);
        }
        /* close statement */
        $stmt->close();
        echo json_encode($hasil);
    }

    public function statUpload(){ // cek apakah sudah ada data upload wawancara
        // agar bisa di akses multi domain / Cross Origin (ajax)
        header('Access-Control-Allow-Origin: *');
        
        $sql = "SELECT data AS status FROM ".$this->tb_data_result." 
                WHERE tanggal = (SELECT MAX(tanggal) FROM ".$this->tb_data_result." WHERE idrt = ?)";
        
        $stmt = $this->db->prepare($sql);
        $stmt->bind_param('s', $_GET['idrt']);
        $stmt->execute();
        /* bind variables to prepared statement */
        $stmt->bind_result($status);
        $hasil = array();
        /* fetch values */
        while($stmt->fetch()) {
            $obj = new stdClass();
            $obj->status = $status;
            array_push($hasil, $obj);
        }
        /* close statement */
        $stmt->close();
        echo json_encode($hasil);
    }

    public function tgl_bagi(){
        // agar bisa di akses multi domain / Cross Origin (ajax)
        header('Access-Control-Allow-Origin: *');
        //ambil tgl bagi
        $sql = "SELECT tgl AS tglbagi FROM ".$this->tb_user_rt."
                where idrt = ?";
        
        $stmt = $this->db->prepare($sql);
        $stmt->bind_param('s', $_GET['idrt']);
        $stmt->execute();
        /* bind variables to prepared statement */
        $stmt->bind_result($tglbagi);
        $hasil = array();
        /* fetch values */
        while($stmt->fetch()) {
            $obj = new stdClass();
            $obj->tglbagi = $tglbagi;
            array_push($hasil, $obj);
        }
        /* close statement */
        $stmt->close();
        echo json_encode($hasil);
    }

    public function save_data() {
        header('Cache-Control: no-cache, must-revalidate');
        header('Content-type: application/json');

        $ret = new stdClass();
        $ret->success = false;
        $input = json_decode(file_get_contents('php://input'));
        if ($input === null) {
            $ret->msg = 'Gagal melakukan decode data yang dikirim';
        } else {
            // parameter yg dikirim ke query
            $idrt = $input->idrt;
            $hash = $input->hash;

            // Cek dulu apakah data sudah tersimpan
            $stmt = $this->db->prepare("SELECT count(*) jml FROM ".$this->tb_data_result." WHERE hash = ?
                AND tanggal = (SELECT MAX(tanggal) FROM ".$this->tb_data_result." WHERE idrt = ?)");
            $stmt->bind_param('ss', $hash, $idrt);
            $stmt->execute();
            /* bind variables to prepared statement */
            $stmt->bind_result($jml);
            /* fetch values */
            $stmt->fetch();
            /* close statement */
            $stmt->close();
            if (intval($jml) === 1) {
                $ret->msg = 'Data dengan konten yang sama sudah tersimpan di Server. Silahkan kembali ke halaman utama dengan menekan icon home di kiri atas untuk mengisi data baru.';
            } else {
                $stmt = $this->db->prepare("INSERT into ".$this->tb_data_result."(idrt,hash, data) VALUES(?,?,?)");
                $stmt->bind_param('sss', $idrt, $hash, $data);
                $data = json_encode($input->data);

                /* execute prepared statement */
                $stmt->execute();
                if ($stmt->affected_rows === 1) {
                    $ret->success = true;
                    $ret->msg = 'Unggah data berhasil. Terimakasih atas partisipasi anda.';
                    $this->delete_output();
                    $this->generateCsv(false);
                } else {
                    $ret->msg = 'Gagal insert data ke database';
                }
                /* close statement and connection */
                $stmt->close();
            }
        }
        exit(json_encode($ret));
    }
    
    /**
     * Fungsi-fungsi mengubah json data di table demov2_data_result menjadi CSV
     */

     // Fungsi untuk mengubah model => (id_art => value) menjadi id_art => (model => value)
     // Agar hasilnya seperti data yang ada di part, artb dan krp
     // parameter $data adalah array dari kolom data demov2_data_result
     private function normalisasi_data(&$data) {
         // $modul adalah ngModel induk, $obj adalah value dari ngModel
         foreach ($data as $modul => $obj) {
             // disini berarti loog tiap modul (ngModel induk)
             // print_r($obj);
             $cols = array();
             foreach ($obj as $key => $obj2) {
                 // echo "\n\n$key:\n";
                 // print_r($obj2);
                 if(is_object($obj2) && !is_numeric($key)) {
                     // echo "\n\n$modul\t$key:\n";
                     // print_r($obj2);
                     foreach ($obj2 as $k => $v) {
                         if(!isset($cols[$k])) {
                             $cols[$k] = new stdClass();
                         }
                         $cols[$k]->$key = $v;
                     }
                     unset($obj->$key);
                 }
             }
             if(count($cols) > 0) {
                 // echo "HASIL Modul $modul:";
                 // print_r($cols);
                 foreach ($cols as $key => $value) {
                     $data->$modul->$key = $value;
                 }
             }
         }
     }

     // Mengubah data menjadi array CSV : RT dan ART
     private function parse_modul($idrt, $data) {
         $art = array();
         $rt = array();
         // $modul adalah modul : part, artb, krp, kai, kim, asm, pm, ptm, aks..
         foreach ($data as $modul => $obj) {
             foreach ($obj as $key => $val) {
                 // jika key adalah idart, maka val = object
                 if(is_object($val)) {
                     // Data-data ART
                     if(!isset($art[$key])) {
                         $art[$key] = array();
                     }

                     foreach ($val as $k => $v) {
                         // skip jika object ( krn ada simpan kesalahan artb masuk juga ke part)
                         if(!is_object($v)) {
                            $art[$key][$k] = $v;
                         }
                     }
                 } else {
                     // data - data RT berarti
                     $rt[$key] = $val;
                 }
             }
         }

         $output = new stdClass();
         $output->rt = $rt;
         $output->art = $art;
         return $output;
     }

    // Mengubah data menjadi array CSV : ART InterVA
    private function parse_modul_custom($idrt, $data, $param) {
        $art = array();
        $rt = array();
        // $modul adalah modul : part, artb, krp, kai, kim, asm, pm, ptm, aks..
        foreach ($data as $modul => $obj) {
            foreach ($obj as $key => $val) {
                // jika key adalah idart, maka val = object
                if(is_object($val)) {
                    // Data-data ART
                    if(!isset($art[$key])) {
                        $art[$key] = array();
                    }

                    foreach ($val as $k => $v) {
                        // skip jika object ( krn ada simpan kesalahan artb masuk juga ke part)
                        if(!is_object($v)) {
                            $art[$key][$k] = $v;
                        }
                    }
                } else {
                    // data - data RT berarti
                    $rt[$key] = $val;
                }
            }
        }

        $output = new stdClass();
        $output->rt = $rt;
        if ($param == 'va') {
            $output->va = $art;
        }else if($param == 'pb'){
            $output->pb = $art;
        }
        
        return $output;
    }

    private function delete_output() {
        $files = glob('output/*.{xlsx,csv,zip}',GLOB_BRACE);
        foreach ($files as $key => $file) {
            unlink($file);
        }
    }

    private function delete_output_history() {
        $files = glob('output/history/*.{xlsx,csv,zip}',GLOB_BRACE);
        foreach ($files as $key => $file) {
            unlink($file);
        }
    }
    
    private function uniq_str() {
        $t = microtime(true);
        $micro = sprintf("%06d",($t - floor($t)) * 1000000);
        $d = new DateTime( date('Y-m-d H:i:s.'.$micro, $t));
        $d->setTimezone(new DateTimeZone('Asia/Jakarta'));
        return $d->format("Ymd_His_u"); // note at point on "u"
    }

    private function generateCsv($includeXslx = false) {
         // Ambil semua kolom2 RT dan ART sebagai master array dan set empty value
         $csv = file_get_contents('rt_demov1.csv');
         $ref_rt = array_fill_keys(explode(',', $csv), '');

         // csv art yg lama jika tidak ada replace data header
         $csv = file_get_contents('art_demov1.csv'); 
         $ref_art = array_fill_keys(explode(',', $csv), '');

         // Query setiap data RT 1 saja dengan tanggal terakhir masuk
         $sql = "SELECT t1.idrt, t1.data, t1.tanggal, t2.user FROM ".$this->tb_data_result." t1
                LEFT JOIN ".$this->tb_user_rt." t2 ON t1.idrt = t2.idrt
                WHERE t1.tanggal = (SELECT MAX(t2.tanggal) FROM ".$this->tb_data_result." t2 WHERE t2.idrt = t1.idrt)
                ORDER BY t1.idrt";
         $res = $this->db->query($sql);

         // Generate unique datetime (more secure)
         $date_str = $this->uniq_str();
         // Simpan data RT dalam CSV
         $fp_rt = fopen("output/{$date_str}_output.csv", 'w'); // output lv RT
         fputcsv($fp_rt, array_keys ($ref_rt));
         if($includeXslx) {
             $xrt = new XLSXWriter();
             $xrt->setAuthor('eHDSS Sleman');
             $xrt->writeSheetRow('Data RT',array_keys ($ref_rt));

             $xart = new XLSXWriter();
             $xart->setAuthor('eHDSS Sleman');
             $xart->writeSheetRow('Data ART',array_keys ($ref_art));
         }

         // Simpan data ART dalam CSV
         // $fp_art = fopen("output/{$date_str}_output_art.csv", 'w'); // output lv ART
         // fputcsv($fp_art, array_keys ($ref_art)); //

         while($row = $res->fetch_assoc()) {
             $idrt = $row['idrt'];
             $json = $row['data'];
             $tanggal = $row['tanggal'];
             // $user = $row['user'];
             $user = !empty($row['user']) ? $row['user'] : $this->get_string_between($json, 'enum_', '_enum');

             // json_decode mengubah true = 1 dan false = 0
             // di HDSS true = 1 dan false = 2
             // $json = str_replace('true', '1', $json);
             $json = str_replace('false', '2', $json);
             
             $data = json_decode($json);
             
             $this->normalisasi_data($data);
             $out = $this->parse_modul($idrt, $data);
             $rt  = array_merge($ref_rt, $out->rt);
             $rt['tanggal'] = $tanggal;
             fputcsv($fp_rt, $rt);
             if($includeXslx) {
                  $xrt->writeSheetRow('Data RT',array_values($rt));
             }

             // generate output ART
             // foreach ($out->art as $key => $value) {
             //     $tmp = $value;
             //     $tmp['id_rt'] = $idrt;
             //     $tmp['id_art'] = $key;
             //     $art = array_merge($ref_art, $tmp);
             //     fputcsv($fp_art, $art);
             //     if($includeXslx) {
             //          $xart->writeSheetRow('Data ART',array_values($art));
             //     }
             // }
         };

         if($includeXslx) {
             $xrt->writeToFile("output/{$date_str}_data_rt.xlsx");
             // $xart->writeToFile("output/{$date_str}_data_art.xlsx");
         }
         fclose($fp_rt);
         // fclose($fp_art);
    }

    private function get_string_between($string, $start, $end){
        $string = ' ' . $string;
        $ini = strpos($string, $start);
        if ($ini == 0) return '';
        $ini += strlen($start);
        $len = strpos($string, $end, $ini) - $ini;
        return substr($string, $ini, $len);
    }

}

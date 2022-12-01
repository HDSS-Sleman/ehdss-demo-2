<?php

require_once 'config.php';
class User
{
    private $db;
    public function __construct()
    {
        $this->db = new mysqli(DB_SERVER, DB_USER, DB_PWD, DB_NAME);
        if ($this->db->connect_errno) {
            return sprintf("Connect ke Database failed: %s\n", $this->db->connect_error);
        }
        header('Cache-Control: no-cache, must-revalidate');
        header('Content-type: application/json');

        /* Table Name */
        $this->tb_data_art = 'demov2_data_art';
        $this->tb_data_result = 'demov2_data_result';
        $this->tb_data_rt = 'demov2_data_rt';
        $this->tb_users = 'demov2_users';
        $this->tb_user_enum = 'demov2_user_enum';
        $this->tb_user_rt = 'demov2_user_rt';
    }

    /**
     * [userHasOtoritas description]
     * @param  [type] $user [username]
     * @param  [type] $role ['enum','supervisor', 'admin']
     * @return [boolean]    true jika user has role / ottoritas
     */
    private function userHasOtoritas($user, $role)
    {
        $sql = "SELECT * FROM ".$this->tb_users." WHERE user = '$user' AND role='$role'";
        $result= $this->db->query($sql);
        return $result->num_rows !== 0;
    }

    // Yang bisa login hanya 'supervisor' dan 'admin' saja ('enum' not allowed)
    public function login()
    {
        $role = $this->userIsSupervisor();
        if ($role) {
            echo '{"success": true, "msg": "benar", "role":"'. $role . '"}';
        } else {
            exit('{"success": false, "msg": "Maaf, anda tidak punya akses modul ini"}');
        }
    }

    private function userIsSupervisor()
    {
        $username = isset($_GET['username']) ? $_GET['username'] : '';
        $password = isset($_GET['password']) ? $_GET['password'] : '';
        $username = $this->db->real_escape_string($username);
        $password = $this->db->real_escape_string($password);

        if (empty($username) || empty($password)) {
            // exit('{"success": false, "msg": "Username dan Password harus terisi"}');
            return false;
        }

        // di tabel user, password = md5(md5(password)) - default user + 789
        // jadi yg dikirim harus sudah berupa md5(password)
        $sql_user = "SELECT * FROM ".$this->tb_users." WHERE user = '$username' AND password=md5('$password')";
        $result = $this->db->query($sql_user);
        if ($result->num_rows === 0) {
            exit('{"success": false, "msg": "Username atau Password yang dimasukkan salah"}');
            return false;
        }
        $row = $result->fetch_assoc();
        $role = $row['role'];
        if ($role === 'supervisor' || $role === 'admin') {
            return $role;
        } else {
            return false;
        }
    }

    public function list_user_rt()
    {
        $role = $this->userIsSupervisor();
        if (!$role) {
            exit('{"success": false, "msg": "Maaf, anda tidak punya akses modul ini"}');
        }

        $username = isset($_GET['username']) ? $_GET['username'] : '';
        $username = $this->db->real_escape_string($username);

        if ($role === 'admin') {
            $where = '';
        } else {
            $where = "WHERE u.user = '$username' OR u.user IN (SELECT enum FROM ".$this->tb_user_enum." WHERE user = '$username')";
        }

        $sql = "SELECT u.id_user, u.user, role, IFNULL(jml,'-') jml_rt
                FROM ".$this->tb_users." u
                LEFT JOIN
                (
                  SELECT USER, COUNT(idrt) jml
                  FROM ".$this->tb_user_rt."
                  GROUP BY USER
                  ORDER BY USER) urt
                ON urt.user = u.user $where ORDER BY role, u.user";
        $result= $this->db->query($sql);
        if ($result) {
            $i = 0;
            $resp = array();
            while ($row = $result->fetch_assoc()) {
                $row['no'] = ++$i;
                $resp[] = $row;
            }
            echo json_encode($resp, JSON_NUMERIC_CHECK);
        } else {
            exit('{"success": false, "msg": "Empty atau Gagal mengambil data demov2_user_rt"}');
        }
    }

    public function list_rt()
    {
        if (!$this->userIsSupervisor()) {
            exit('{"success": false, "msg": "Maaf, anda tidak punya akses modul ini"}');
        }

        $user_edit = isset($_GET['user_edit']) ? $_GET['user_edit'] : '';
        $user_edit = $this->db->real_escape_string($user_edit);
        // pilih idrt yang dimiliki user enum $user_edit
        $sql_idrt_user = "SELECT idrt FROM ".$this->tb_user_rt." WHERE user = '$user_edit'";
        // Tambah kolom jumlah ART
        $sql_rt = "SELECT
            t1.idrt, t1.kl00 kluster, t1.kl06 no_urut_rt, t1.kl08 alamat,
            t1.krt01 kep_rt, t2.jml_art
            FROM ".$this->tb_data_rt." t1
            LEFT JOIN (
                select idrt, count(*) jml_art from ".$this->tb_data_art."
                WHERE idrt IN ($sql_idrt_user)
                group by idrt
            ) t2
            ON t1.idrt = t2.idrt
            WHERE t1.idrt IN ($sql_idrt_user)
            ORDER BY t1.idrt";

        $result_rt = $this->db->query($sql_rt);
        if ($result_rt) {
            $hasil = array();
            $i = 1;
            while ($row = $result_rt->fetch_assoc()) {
                $row['no'] = $i;
                $hasil[] = $row;
                $i++;
            }
            echo json_encode($hasil, JSON_NUMERIC_CHECK);
        } else {
            exit('{"success": false, "msg": "Empty atau Gagal mengambil data"}');
        }
    }

    public function del_user()
    {
        if (!$this->userIsSupervisor()) {
            exit('{"success": false, "msg": "Maaf, anda tidak punya akses modul ini"}');
        }

        $user_del = isset($_GET['user_del']) ? $_GET['user_del'] : '';
        $user_del = $this->db->real_escape_string($user_del);

        $sql = "DELETE FROM ".$this->tb_user_rt." WHERE user='$user_del'";
        $result = $this->db->query($sql);
        if ($result) {
            $sql = "DELETE FROM ".$this->tb_users." WHERE user='$user_del'";
            $result = $this->db->query($sql);
            if ($result) {
                exit('{"success": true, "msg": "Berhasil menghapus User"}');
            } else {
                exit('{"success": false, "msg": "Gagal menghapus User dari Users"}');
            }
        } else {
            exit('{"success": false, "msg": "Gagal menghapus User dari demov2_User_rt"}');
        }
    }

    public function del_user_enum()
    {
        if (!$this->userIsSupervisor()) {
            exit('{"success": false, "msg": "Maaf, anda tidak punya akses modul ini"}');
        }

        $user_enum = isset($_GET['user_enum']) ? $_GET['user_enum'] : '';
        $user_enum = trim($this->db->real_escape_string($user_enum));

        $user_super = isset($_GET['user_super']) ? $_GET['user_super'] : '';
        $user_super = trim($this->db->real_escape_string($user_super));

        $sql = "DELETE FROM ".$this->tb_user_enum." WHERE user='$user_super' AND enum='$user_enum'";
        $result = $this->db->query($sql);
        if ($result) {
            exit('{"success": true, "msg": "Berhasil menghapus User"}');
        } else {
            exit('{"success": false, "msg": "Gagal menghapus User dari Users"}');
        }
    }

    public function list_rt_available()
    {
        if (!$this->userIsSupervisor()) {
            exit('{"success": false, "msg": "Maaf, anda tidak punya akses modul ini"}');
        }

        $idrt = isset($_GET['idrt']) ? $_GET['idrt'] : '';
        $idrt = $this->db->real_escape_string($idrt);
        $sql = "SELECT idrt, krt01 kep_rt, kl08 alamat FROM ".$this->tb_data_rt."
            WHERE idrt LIKE '%$idrt%' AND idrt NOT IN ( SELECT idrt FROM ".$this->tb_user_rt.") LIMIT 10";

        $result = $this->db->query($sql);
        if ($result) {
            $hasil = array();
            $i = 1;
            while ($row = $result->fetch_assoc()) {
                $row['no'] = $i;
                $hasil[] = $row;
                $i++;
            }
            echo json_encode($hasil, JSON_NUMERIC_CHECK);
        } else {
            exit('{"success": false, "msg": "Empty atau Gagal mengambil data"}');
        }
    }

    public function add_rt_to_user()
    {
        if (!$this->userIsSupervisor()) {
            exit('{"success": false, "msg": "Maaf, anda tidak punya akses modul ini"}');
        }

        $idrt = isset($_GET['idrt']) ? $_GET['idrt'] : '';
        $idrt = $this->db->real_escape_string($idrt);

        $user_edit = isset($_GET['user_edit']) ? $_GET['user_edit'] : '';
        $user_edit = $this->db->real_escape_string($user_edit);

        $sql = "INSERT INTO ".$this->tb_user_rt."(user,idrt) VALUES('$user_edit',$idrt)";
        $result = $this->db->query($sql);
        if ($result) {
            exit('{"success": true, "msg": "Berhasil menambahkan RT ke User"}');
        } else {
            exit('{"success": false, "msg": "Gagal menambahkan RT ke User"}');
        }
    }

    public function del_rt()
    {
        if (!$this->userIsSupervisor()) {
            exit('{"success": false, "msg": "Maaf, anda tidak punya akses modul ini"}');
        }

        $idrt = isset($_GET['idrt']) ? $_GET['idrt'] : '';
        $idrt = $this->db->real_escape_string($idrt);

        $sql = "DELETE FROM ".$this->tb_user_rt." WHERE idrt=$idrt";
        $result = $this->db->query($sql);
        if ($result) {
            exit('{"success": true, "msg": "Berhasil menghapus RT dari User"}');
        } else {
            exit('{"success": false, "msg": "Gagal menghapus RT dari User"}');
        }
    }

    public function list_user_available()
    {
        if (!$this->userIsSupervisor()) {
            exit('{"success": false, "msg": "Maaf, anda tidak punya akses modul ini"}');
        }

        $user_search = isset($_GET['user_search']) ? $_GET['user_search'] : '';
        $user_search = $this->db->real_escape_string($user_search);

        $sql = "SELECT u.id_user, u.user, role, IFNULL(jml,'-') jml_rt
                FROM ".$this->tb_users." u
                LEFT JOIN
                (
                    SELECT USER, COUNT(idrt) jml
                    FROM ".$this->tb_user_rt."
                    GROUP BY USER
                    ORDER BY USER) urt
                ON urt.user = u.user
                WHERE u.role = 'enum' AND u.user NOT IN (SELECT enum FROM ".$this->tb_user_enum.")";

        $result = $this->db->query($sql);
        if ($result) {
            $hasil = array();
            $i = 1;
            while ($row = $result->fetch_assoc()) {
                $row['no'] = $i;
                $hasil[] = $row;
                $i++;
            }
            echo json_encode($hasil, JSON_NUMERIC_CHECK);
        } else {
            exit('{"success": false, "msg": "Empty atau Gagal mengambil data"}');
        }
    }

    public function user_save()
    {
        if (!$this->userIsSupervisor()) {
            exit('{"success": false, "msg": "Maaf, anda tidak punya akses modul ini"}');
        }

        $user_edit = isset($_GET['user_edit']) ? $_GET['user_edit'] : '';
        $user_edit = trim($this->db->real_escape_string($user_edit));

        $user_old = isset($_GET['user_old']) ? $_GET['user_old'] : '';
        $user_old = trim($this->db->real_escape_string($user_old));

        $id_user = isset($_GET['id_user']) ? $_GET['id_user'] : '';
        $id_user = $this->db->real_escape_string($id_user);

        $edit_mode = isset($_GET['edit_mode']) ? $_GET['edit_mode'] : '';

        // Jika ada isinya, berarti mengubah password juga
        $pwd = isset($_GET['pwd']) ? $_GET['pwd'] : '';
        $pwd = $this->db->real_escape_string($pwd);

        $role = isset($_GET['role']) ? $_GET['role'] : '';
        $role = $this->db->real_escape_string($role);

        // Check dulu apakah user sudah ada di data atau belum
        if ($user_edit !== $user_old) {
            $sql = "SELECT * FROM ".$this->tb_users." WHERE user = '$user_edit'";
            $result = $this->db->query($sql);
            if ($result->num_rows > 0) {
                exit('{"success": false, "msg": "User dengan nama tersebut sudah ada di Database"}');
                return false;
            }
        }

        $sqlPwd = empty($pwd) ? '' : ", password=md5('$pwd')";
        if ($edit_mode === 'edit') {
            $sql = "UPDATE ".$this->tb_users." SET user='$user_edit', role='$role' $sqlPwd WHERE id_user=$id_user";
        } elseif ($edit_mode === 'add') {
            $sql = "INSERT INTO ".$this->tb_users."(user,password,role) VALUES('$user_edit', md5('$pwd'), '$role')";
        }

        $result = $this->db->query($sql);
        if ($result) {
            exit('{"success": true, "msg": "Berhasil menyimpan data user"}');
        } else {
            exit('{"success": false, "msg": "Gagal menyimpan data user"}');
        }
    }

    public function list_user_enum()
    {
        if (!$this->userIsSupervisor()) {
            exit('{"success": false, "msg": "Maaf, anda tidak punya akses modul ini"}');
        }

        $user_super = isset($_GET['user_super']) ? $_GET['user_super'] : '';
        $user_super = trim($this->db->real_escape_string($user_super));

        $sql = "SELECT id_user_enum, user, `enum` FROM ".$this->tb_user_enum." WHERE user='$user_super'";
        $result = $this->db->query($sql);
        if ($result) {
            $hasil = array();
            $i = 1;
            while ($row = $result->fetch_assoc()) {
                $row['no'] = $i;
                $hasil[] = $row;
                $i++;
            }
            echo json_encode($hasil, JSON_NUMERIC_CHECK);
        } else {
            exit('{"success": false, "msg": "Empty atau Gagal mengambil data"}');
        }
    }

    public function add_user_to_user()
    {
        if (!$this->userIsSupervisor()) {
            exit('{"success": false, "msg": "Maaf, anda tidak punya akses modul ini"}');
        }

        $user_enum = isset($_GET['user_enum']) ? $_GET['user_enum'] : '';
        $user_enum = trim($this->db->real_escape_string($user_enum));

        $user_super = isset($_GET['user_super']) ? $_GET['user_super'] : '';
        $user_super = trim($this->db->real_escape_string($user_super));

        $sql = "INSERT INTO ".$this->tb_user_enum."(user,`enum`) VALUES('$user_super','$user_enum')";
        $result = $this->db->query($sql);
        if ($result) {
            exit('{"success": true, "msg": "Berhasil menyimpan data user"}');
        } else {
            exit('{"success": false, "msg": "Gagal menyimpan data user"}');
        }
    }

    private function uniq_str() {
        $t = microtime(true);
        $micro = sprintf("%06d",($t - floor($t)) * 1000000);
        $d = new DateTime( date('Y-m-d H:i:s.'.$micro, $t));
        $d->setTimezone(new DateTimeZone('Asia/Jakarta'));
        return $d->format("Ymd_His_u"); // note at point on "u"
    }

    public function download_export() {
        $role = $this->userIsSupervisor();
        if ($role === 'enum') {
            exit('{"success": false, "msg": "Maaf, anda tidak punya akses modul ini"}');
        }

        $date_str = $this->uniq_str();
        $zipname = "output/hdss_export_$date_str.zip";
        $zip = new ZipArchive;
        $zip->open($zipname, ZipArchive::CREATE);
        $files = glob('output/*.{xlsx,csv}',GLOB_BRACE);
        foreach ($files as $num => $file) {
            $zip->addFile($file);
        }
        $zip->close();

        header('Content-Type: application/zip');
        header('Content-disposition: attachment; filename='. basename($zipname));
        header('Content-Length: ' . filesize($zipname));
        readfile($zipname);
    }

    
}

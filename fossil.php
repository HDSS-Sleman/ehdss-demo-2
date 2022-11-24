<?php
    /**
     * ========================================================================
     * FossilHub
     * Menjalankan perintah command fossil melalui PHP, sehingga developer tidak
     * harus login ssh untuk melakukan perintah fossil di server.
     *
     * @author         Ebta Setiawan (ebta.setiawan@gmail.com)
     * @contributor    damar
     * @version        1.6.2
     * @license        GPL
     *
     * ========================================================================
     **/

    define('VERSION', '1.6.3');
    // Untuk memberi Full akses jika diakses dari localhost..
    $local_url = array('127.0.0.1','::1');
    $is_localhost  = in_array($_SERVER['REMOTE_ADDR'], $local_url);
    // apakah user sudah login atau belum
    $is_login = false;

    /**
     * Mencari nama repository (xname.fossil)
     * @return string Return nama repository (dg extensi fossil) atau empty jika gagal
     *    Nama atau lokasi repository fossil tersimpan di file _FOSSIL_
     *    di Windows file ini bernama '_FOSSIL_' dan di Linux '.fslckout'
     *    ketika repository di close, yg ada file '.fossil'
     *    file-file itu sebenarnya merupakan database sqlite3
     */
    function get_repo_name() {
        $repo_name  = '';
        $fossil_    = '_FOSSIL_';
        $fossil_ckout = '.fslckout';
        $fossil_dot = '.fossil';

        $fossil_    = file_exists($fossil_) ? $fossil_ : '';
        $fossil_ckout = file_exists($fossil_ckout) ? $fossil_ckout : '';
        $fossil_dot = file_exists($fossil_dot) ? $fossil_dot : '';

        if($fossil_ | $fossil_ckout | $fossil_dot) {
            // Gunakan class SQLite3 jika ada di sistem (php)
            if(class_exists('SQLite3')) {
                // .fslckout dan _FOSSIL_ struktur db-nya sama, flag = 0
                $sql = "SELECT value FROM vvar where name='repository'";
                if($fossil_) {
                    $db = new SQLite3($fossil_);
                } elseif ($fossil_ckout) {
                    $db = new SQLite3($fossil_ckout);
                } elseif ($fossil_dot) {
                    $db = new SQLite3($fossil_dot);
                    $sql = "SELECT value FROM global_config WHERE name LIKE 'ckout%'";
                }
                if(isset($db)) {
                    $result = $db->querySingle($sql);
                    $db->close();
                    $repo_name = $result ? $result : '';
                }
            } else {
                // Jika tidak ada class SQLite3, parsing string manual
                // pattern regex untuk _FOSSIL_ dan .fslckout
                $re = '/repository([\w\/\\-_]+\.fossil)/';
                if($fossil_) {
                    $data = file_get_contents($fossil_);
                } elseif ($fossil_ckout) {
                    $data = file_get_contents($fossil_ckout);
                } elseif ($fossil_dot) {
                    $re = '/repo:([\w\/\\-_]+\.fossil)/';
                    $data = file_get_contents($fossil_dot);
                }

                if(isset($data)) {
                    preg_match($re, $data, $matches);
                    if(file_exists($matches[1])) {
                        $repo_name = $matches[1];
                    }
                }
            }
        }
        // jika $repo_name masih empty
        // Cari file repository (*.fossil) di current directory
        if(empty($repo_name)) {
            $files = glob(getcwd() . DIRECTORY_SEPARATOR . '*.fossil');
            if(count($files) > 0) {
                $repo_name = basename($files[0]);
            }
        }
        return $repo_name;
     }

     /**
      * Mengambil nama repository dari file repo yang sedang aktif di current directory
      * fungsi ini harus ada file yg sudah di open, beda dg fungsi get_repo_name
      * @return [string] [nama repository]
      */
     function get_repository() {
         $out = fossil('info', '', false, true, false);
         preg_match('/repository:\s+(.+\.fossil)/m', $out, $matches);
         if(count($matches) > 1) {
             return $matches[1];
         } else {
             return '';
         }
     }


    // Testing
    // echo get_repository(); exit;
    // echo get_repo_name(); exit;

    /**
     * Fungsi utama untuk menjalankan commands fossil
     * @param  string $cmd              command fossil yg ada di fossil help`
     * @param  string $options          options dari command
     * @param  [type] $format           apakah output command dengan style
     * @param  [type] $htmlspecialchars apakah output akan di encode
     * @return string dari perintah command yang dijalankan
     */
    function fossil($cmd, $options= '', $format = true, $htmlspecialchars = true) {
        $hasil = '';
        if( putenv("HOME=". dirname(__FILE__)) ) {
            if($cmd !== 'open') {
                $repo_name = get_repo_name();
                if(empty($repo_name)) {
                    return 'Gagal mendeteksi nama repository (fossil)';
                }
                // command diff bisa membuka celah keamanan jika tidak dilimit
                // options-nya, misal untuk membandingkan file tertentu (config)
                // sementara di skip dulu options-nya
                // if($cmd === 'diff') {
                //     $options = '';
                // }

                $options = urldecode($options);
                shell_exec("fossil open $repo_name --keep 2>&1");
            }
            $output = shell_exec("fossil $cmd $options 2>&1");
            if($htmlspecialchars) {
                $output = htmlspecialchars($output);
            }
            if($format) {
                $pre_class = '';
                // jika command menampilkan help saja
                if(strpos($options,'--help') !== false) {
                    $pre_class = 'help';
                    $output = preg_replace('/((?:Usage)|(?:or):\s)(.+)/','$1<span class="usage">$2</span>', $output);
                    $output = preg_replace('/((-\w\|)?--[\w-]+(\s[\w<>]+)?)/m','<span class="options">$1</span>', $output);
                }

                if($cmd === 'timeline') {
                    // ambil unique branch/tags name
                    $tags = array();
                    // jika tags ada tanda koma, ambil yg pertama saja
                    if(preg_match_all('/user:[\s\w]+:\s([\s\w]+),?.*\)/m', $output, $matches)) {
                        $tags = array_unique($matches[1]);
                        $output = preg_replace('/(\d{2}:\d{2}:\d{2}\s)(\[\w+\])/m','$1<span class="version">$2</span>', $output);
                        $tags_replacer = array();
                        $x = 0;
                        foreach ($tags as $value) {
                            $x = (strpos($value,'trunk') === false ) ? ++$x : 0;
                            $tags_replacer[$value] = "branch-$x";
                        }
                    }

                    // khusus timeline *CURRENT*, update style-nya
                    $output = preg_replace('/(.*\*CURRENT\*.*)\(user/', '<span class="cur">$1</span>(user' , $output);
                    $output = preg_replace('/^(===.*)/m', '<span class="date">$1</span>' , $output);
                    $output = preg_replace('/(.*user:\s)(\w+)\s(tags:\s)([\w\s]+)(,?.*)\)/m',
                        '<span class="xyz$4">$1<span class="user $2">$2</span> $3<span class="tags $4">$4$5</span>)</span>' , $output);
                    if(count($tags) > 0) {
                        foreach ($tags as $value) {
                            $output = str_replace("xyz$value", $tags_replacer[$value] , $output);
                        }
                    }
                    // tanpa tags, tambah class juga
                    $output = preg_replace('/(.+\(user:\s[\w\s]+\))/m', '<span class="tags-empty">$1</span>', $output);
                }

                if($cmd === 'status') {
                    // khusus timeline *CURRENT*, update style-nya
                    $output = preg_replace('/^(EDITED.*)/m', '<span class="edited">$1</span>' , $output);
                    $output = preg_replace('/^(MISSING.*)/m', '<span class="missing">$1</span>' , $output);
                    $output = preg_replace('/^(ADDED.*)/m', '<span class="added">$1</span>' , $output);
                    $output = preg_replace('/^(tags:\s+)(\w.+)/m', '$1<span class="tags">$2</span>' , $output);
                }

                if($cmd === 'update') {
                    $output = preg_replace('/^(UPDATE.*)/m', '<span class="edited">$1</span>' , $output);
                    $output = preg_replace('/^(changes:\s+)(\w.+)/m', '$1<span class="changes">$2</span>' , $output);
                }

                if($cmd === 'diff') {
                    // yg diawali tanda '-' dan tidak diikuti '--' setelahnya bisa ada spasi atau tidak
                    // dan diikuti character apa saja sampai akhir baris
                    $output = preg_replace('/^(\-)(?!--)(\s?.+)/m', '$1<span class="diff-min">$2</span>' , $output);
                    $output = preg_replace('/^(\+)(?!\+\+)(\s?.+)/m', '$1<span class="diff-plus">$2</span>' , $output);
                    $output = preg_replace('/\r/m', '' , $output);
                }

                $style = 'style="color:#F9FF00"';
                $hasil .= "<code $style> &gt; fossil $cmd $options</code>\n";
                $hasil .= "<pre class='$pre_class'>$output</pre>";
            } else {
                $hasil = $output;
            }
            putenv('HOME');
        } else {
            $hasil = "Gagal mengeset HOME di php, Fossil butuh ini\n";
        }
        return $hasil;
    }

    /**
     * Mendeteksi apakah fossil[.exe] support fitur/command json
     * @return boolean true jika fossil support json
     * untuk windows (fossil.exe), download dari fossil-scm.org sudah support
     * untuk linux, perlu compile ulang dg menambahkan opsi makefile --enable-json
     */
    function is_json_support() {
        $tmp = fossil('help', '', false, false);
        return preg_match('/json/',$tmp) === 1;
    }

    // Testing
    // $x = is_json_support('i');
    // var_dump($x); exit;

    /**
     * Fungsi login awal ketika menjalankan FossilHub
     * @param  string $user            nama user fossil
     * @param  string $password        password user fossil`
     * @return string Jika berhasil login, return value adalah capabilities user
     * jika gagal return value adalah empty string ''
     * Pengecekan user password repository melalui CLI membutuhkan fitur json
     */
    function login($user,$password) {
        if(!is_json_support()) {
            return '';
        }
        $temp = tmpfile();
        $tpl = '{"command":"login","payload":{"name":"%s","password":"%s"}}';
        fwrite($temp, sprintf($tpl,$user,$password));
        // ambil metadata, untuk mengetahui lokasi file temp-nya
        $meta = stream_get_meta_data($temp);
        $repository = get_repository();
        // Pastikan setting owner dan chmod repository sudah benar...
        $json = fossil("json login -R $repository --json-input", $meta['uri'], false, false);
        // print_r($json);exit;
        // otomatis akan menghapus file tmp
        fclose($temp);
        $hasil = '';
        $obj = json_decode($json);
        if(isset($obj->payload)) {
            $obj2 = $obj->payload;
            $hasil = $obj2->capabilities;
        }
        return $hasil;
    }

    // Test login
    // if($x = login('ebta', '12345')) {
    //     echo "Login Sukses $x";
    // } else {
    //     echo "Login Gagal";
    // }

    /**
     * Mengecek apakah user_cap yg diberikan mempunyai akses commit
     * @param  string  $user_cap user capabilities di fossil
     * @return boolean true jika capabilities yang diberikan berisi: a/s/i
     * a = admin, s = setup, i = commit
     * di cek juga capabilities untuk reader (u) dan developer (v),
     * jika didalamnya ada hak akses 'i', maka otomatis akan return true
     */
    function is_commit_allowed($user_cap='') {
        if(empty($user_cap)) {
            return false;
        }
        // capabilities 'a' atau 's' atau 'i' otomatis punya hak commit
        if(preg_match('/[asi]/i',$user_cap) === 1) {
            return true;
        }
        // cek khusus user: developer dan reader
        // Users with privilege v inherit the combined privileges of developer, anonymous, and nobody.
        $is_developer = stripos($user_cap, 'v') !== false;
        $is_reader = stripos($user_cap, 'u') !== false;

        $json = fossil('json user list', '', false , false);
        $caps = json_decode($json);
        if(isset($caps->payload)) {
            // array of user dan capabilities
            $users   = $caps->payload;
            $tmp = '';
            foreach ($users as $obj) {
                $n = $obj->name;
                if($is_reader & ($n === 'reader')) {
                    $tmp = $obj->capabilities;
                }

                if($is_developer & ($n === 'developer' | $n === 'anonymous' | $n === 'nobody')) {
                    $tmp .= $obj->capabilities;
                }
            }
            // allowed commit dg mengecek apa ada capabilities 'i'
            return (stripos($tmp, 'i') !== false);
        }
    }

    // Testing
    // $x = is_commit_allowed('i');
    // var_dump($x); exit;

    /**
     * Untuk membatasi perintah (Command) yang boleh diakses dan tampil
     * @param array $commands merupakan variabel global $commands
     * @return boolean return variabel $commands akan di kurangi
     */
    function limit_commands(&$commands) {
        // disable command-command yang rentan
        $commands_disable = array('merge','checkout','addremove','add','undo');
        // agar bisa di gunakan array_diff_key, array harus ada value-nya
        $commands_disable = array_fill_keys($commands_disable, 0);
        $commands = array_diff_key($commands, $commands_disable);
        return 1;
    }

    /* =========================== void main() ============================= */
    // semua command dan keterangannya
    $commands = array(
        'status' => 'Memeriksa status repository (perubahan file)',
        'extras' => 'Apakah ada tambahan file baru diluar repository',
        'timeline' => 'Melihat history perkembangan repository',
        'diff' => 'Melihat perbedaan file jika ada editing',
        'add' => 'Menambahkan file baru yg belum masuk repo',
        'addremove' => 'Menambahkan file baru yg belum masuk repo sekaligus hapus yg MISSING',
        'commit' => 'Commit perubahan yg terjadi ke repo',
        'sync' => 'Melakukan sinkronasi dari repo local ke server ketika terjadi gagal sinkron',
        'merge' => 'Merge dari satu branch ke branch/versi yg lain',
        'update' => 'Update repo dari remote-url atau pindah CURRENT position',
        'checkout' => 'Generate (extract) ulang semua struktur file/folder',
        'open' => 'Membuka repository fossil',
        'close' => 'Menutup repo, digunakan jika sebelumnya mengakses repo lewat ssh',
        'undo' => 'Membatalkan perintah sebelumnya (jika ada keterangan undo)',
        'revert' => 'Mengembalikan File Yang sudah di Edit namun tidak jadi'
    );

    /**
       * Urutan prioritas user akses akan diberikan akses command
      * 1. Repo localhost (url akses 'localhost') beri full akses semua command
      * 2. Master repo (remote-url : off) user harus login dengan user/password fossil
      * 3. Repo Client (remote-url ada isinya), maka login ke FossilHub
      *       menggunakan password internal (sebaiknya harcoded atau ambil dari config)
     */

    if($is_localhost) {
        $is_login = true;
    } else {
        // aktifkan session, untuk login, user dan password
        // Authentication hanya dilakukan jika di akses dari non localhost
        session_start();
        if(isset($_SESSION['user_login'])) {
            // session masih ada, langsung tampilkan command/menu
            $is_login = true;
        } else {
            // Login procedure..
            $u = isset($_POST['username']) ? $_POST['username'] : '';
            $p = isset($_POST['password']) ? $_POST['password'] : '';

            // Cek apakah fossilhub jalan di repo Master atau Client
            $remote_url = fossil('remote-url','',false);
            if(!empty($u) & !empty($p)) {
                $login_cap = login($u,$p);
                $is_login  = !empty($login_cap);
                if(!is_commit_allowed($login_cap)) {
                    limit_commands($commands);
                }
                if($is_login) {
                    $_SESSION['user_login'] = $u;
                    fossil('user default',$u,false);
                    echo '{"success": true}';
                } else {
                    // khusus untuk Client, bisa jadi developer tidak punya user repo
                    // maka disini kita menggunakan user/password hardcoded, dengan
                    // akses command limit, tetapi cukup untuk update, status, dll
                    if($remote_url !== 'off') {
                        if($u === 'fossil' & $p === 'client9191') {
                            $is_login = true;
                            $_SESSION['user_login'] = $u;
                            limit_commands($commands);
                            echo '{"success": true}';
                            exit();
                        }
                    }
                    echo '{"success": false}';
                }
                exit;
            }
        }
    }

    // Bagian utama, server menjalankan perintah fossil yg dikirim GET request
    $cmd = isset($_GET['cmd']) ? strtolower($_GET['cmd']) : '';
    $options = isset($_GET['options']) ? $_GET['options'] : '';

    // Jika parameter cmd empty, berarti membuka halaman index
    if(empty($cmd)) {
        $remote_url = fossil('remote-url','',false);
    } else {
        if($cmd === 'logout') {
            if(session_destroy()) {
                echo 'logout';
                exit;
            }
        }

        // User belum login, tetapi mencoba akses command
        if(!$is_login) {
            header('HTTP/1.1 401 Unauthorized'); ?>
            <!DOCTYPE html>
            <html>
            <head>
                <meta http-equiv="refresh" content="3;url=fossil.php">
                <title>Login Required (Unauthorized)</title>
            </head>

            <body>
                <div style="text-align:center;">
                    <h3>Harus Login untuk mengakses FossilHub</h3>
                    Anda otomatis akan dibawa ke halaman login dalam 3 detik..
                </div>
            </body no-ads>
            </html>
            <?php
        } else {
            // cek apakah command diijinkan
            if(array_key_exists($cmd, $commands)) {
                echo fossil($cmd, $options);
            } else {
                $style0 = 'style="color:#F9FF00"';
                $style1 = 'style="color:#f44336"';
                $style2 = 'style="color:#FFA700"';
                echo "<code $style0> &gt; fossil $cmd $options</code>\n";
                echo "<pre $style1>Command <span $style2>$cmd</span> tidak diijinkan atau tidak dikenal</pre>";
            }
        }
        exit;
    }
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>FossilHub - Fossil Repository Helper</title>
        <script type="text/javascript">
            /* jshint ignore:start */
            // simple ajax function
            function ajax(B,A){this.bindFunction=function(E,D){return function(){return E.apply(D,[D])}};
            this.stateChange=function(D){if(this.request.readyState==4){this.callbackFunction(this.request.responseText)}};
            this.getRequest=function(){if(window.ActiveXObject){return new ActiveXObject("Microsoft.XMLHTTP");}else{
            if(window.XMLHttpRequest){return new XMLHttpRequest()}}return false};this.postBody=(arguments[2]||"");
            this.callbackFunction=A;this.url=B;this.request=this.getRequest();if(this.request){
            var C=this.request;C.onreadystatechange=this.bindFunction(this.stateChange,this);
            if(this.postBody!==""){C.open("POST",B,true);C.setRequestHeader("X-Requested-With","XMLHttpRequest");
            C.setRequestHeader("Content-type","application/x-www-form-urlencoded")}
            else{C.open("GET",B,true)}C.send(this.postBody)}};
            /* jshint ignore:end */

            // function helper lainnya disini
            // seperti addslashes-nya PHP
            function addslashes( str ) {
                return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
            }

            // mengubah object menjadi parameter di URL,
            // misal {foo: "hi there",bar: "100%"} menjadi foo=hi%20there&bar=100%25
            function serialize(obj) {
                var str = [];
                for (var p in obj)
                    if (obj.hasOwnProperty(p)) {
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    }
                return str.join("&");
            }

            // script dokumen dibawah sini
            document.addEventListener("DOMContentLoaded", function() {
                function el(id) {return document.getElementById(id);}
                var btnLogin = el('btn-login');
                if(btnLogin) {
                    btnLogin.addEventListener('click', function(e){
                        e.preventDefault();
                        var u = el('username').value,
                            p = el('password').value,
                            par = serialize({
                                username : u,
                                password : p
                            });
                        if(!u | !p) {
                            alert('Silahkan mengisi Username dan Password');
                            return 0;
                        }
                        el('loading-cmd').innerHTML = 'Proses Login ke FossilHub';
                        el('mask').style.display = 'block';
                        ajax(window.location.href,function(data) {
                            var obj = JSON.parse(data);
                            if(obj.success) {
                                window.location.reload(true);
                            } else {
                                el('mask').style.display = 'none';
                                alert("Username atau Password yang dimasukkan salah\n" +
                                    "Silahkan dicoba lagi..");
                            }
                        },par);
                    });
                }

                // button command di klik
                var btnCmds = el('btn-cmd');
                if(btnCmds) {
                    btnCmds.addEventListener('click', function(e){
                        var optEls = document.getElementsByName('cmd-options');
                        // opt = command options
                        // re = regular expression, available options for command
                        var opt = '', re;
                        if(optEls.length > 0) {
                            opt = optEls[0].value;
                        }
                        if(e.target.tagName === 'BUTTON') {
                            e.preventDefault();
                            var cmd = e.target.name;

                            if(cmd === 'status') {
                                re = /--(abs|rel|sha1sum)(-paths)?/;
                            } else if (cmd === 'timeline') {
                                re = /-[nptvWR]|--[limit|path|offset|type|verbose|width]/;
                            } else if (cmd === 'extras') {
                                re = /--((abs-path)|(case-sensitive)|dotfiles|header|ignore|(rel-paths))/;
                            }
                            /*else if (cmd === 'diff') {
                                re = /-[criyvwWZ]|--(binary|branch|brief|context|(diff-binary)|(exec-(abs|rel))-path|from|internal|(side-by-side)|(strip-trailing-cr)|tk|to|undo|unified|verbose|(ignore-(all|trailing)-space)|width)/;
                            }*/

                            // jika re ada dan tidak memenuhi kriteria test, skip options
                            if(re && !re.test(opt)) {
                                opt = '';
                            }

                            // command: 'commit', munculkan prompt jika options bukan --help
                            if(cmd === 'commit' && (opt.indexOf('--help') === -1)) {
                                // tampilkan prompt jika opt tidak ada isian -m atau --comment
                                if(opt.search(/(-m)|(--comment)\s/) === -1) {
                                    var comment = prompt("Yakin akan melakukan commit?\n" +
                                        "Pastikan sebelumnya sudah mengecek 'Status'\n"+
                                        "Jika ya, tulis keterangan commit disini",'Commit from server by fossil.php');
                                    if(comment !== null) {
                                        opt = ' -m "' + addslashes(comment) + '" ' + opt;
                                    } else {
                                        return 0;
                                    }
                                }
                            }

                            var par = '?cmd=' + cmd + '&options=' + encodeURIComponent(opt);
                            el('loading-cmd').innerHTML = 'fossil ' + cmd + ' ' + opt;
                            el('mask').style.display = 'block';
                            ajax(window.location.href + par, function(data) {
                                el('cmd-result').innerHTML = data +  "\n" + el('cmd-result').innerHTML;
                                el('mask').style.display = 'none';
                            });
                        }
                    });

                    // Clear command area result
                    el('btn-clear').addEventListener('click', function(e) {
                        e.preventDefault();
                        el('cmd-result').innerHTML = '';
                    });

                    // Logout dari FossilHub, tidak muncul jika localhost
                    el('btn-logout').addEventListener('click', function(e) {
                        e.preventDefault();
                        ajax(window.location.href + '?cmd=logout',function(data){
                            window.location.reload(true);
                        });
                    });
                }
            });
        </script>

        <style>
            body {background: #282C34; color: #bbb; margin: 0;}
            h1,h2 {font:bold 16px Arial; color: #eee; margin: 3px 0;}
            h1 span, h2 span {color: #5dbf73;}
            h2 {font-size: 14px; text-align: center;}
            pre {margin: 2px 0 5px; word-wrap: break-word;}
            button {padding: 5px 13px; border: none; cursor: pointer; margin-top: 5px; color: #fff}
            .status, #btn-login {background-color: #43A047}
            .extras {background-color: #689F38}
            .diff, .clean {background-color: #D81B60}
            .update, .add, .addremove {background-color: #EF6C00}
            .commit, .merge, .sync {background-color: #607D8B}
            .timeline, .open {background-color: #42A5F5}
            span.cur {color: #42A5F5;}
            span.date, .changes {color: #F1f1f1;}
            span.edited {color: #60beeb;}
            span.missing {color: #DE746C;}
            span.user {color: #8c6daf}
            span.tags {color: #D8965F}
            span.diff-min {color: #E45D53}
            span.diff-plus {color: #5dbf73}
            .close, .undo, .revert {background-color: #8E24AA}
            .checkout {background-color: #F44336}
            .repo-info span { font-family: monospace; font-size: 14px; color: #ffea00;}
            #btn-clear {background-color:#2B367D; position: fixed; top:10px; right: 80px;}
            #btn-logout {background-color:#AF2E25; position: fixed; top:10px; right: 10px;}
            #btn-cmd { position: fixed; top: 0; background: rgba(24, 29, 35, 0.77);width: 100%; padding: 10px;}
            label {margin-left: 10px; font-family: monospace; padding-right: 5px;}
            input { padding: 5px; background-color: #282C34;border: 1px solid #0F1115;color:#E8E29A;font-family: monospace;}
            #cmd-result { margin-top: 110px; padding: 10px; }
            #mask {width: 100%; height:120px; background-color: rgba(0,0,0,0.5); position: fixed; top: 0; display: none;}
            #loading-cmd {text-align: center;font-family: monospace; color:#F9FF00;font-size: 16px; padding-top: 10px;}
            #form-login {text-align: center; margin-top: 150px;}
            #form-login h1 {margin-bottom: 20px;}
            #form-login input {background: #454B56;}
            .login-info {font: normal 12px sans-serif;color: #ECECE1;background: #AB5724;padding: 5px 0;text-align: center;}
            .login-info code {color: #EDF94C;font-size: 14px;}
            #btn-login {border-color: #75797F;margin-left: 5px;padding: 5px 10px;}
            #tips {position: fixed; top: 120px; right: 10px; max-width: 20%;font: normal 12px Arial,sans-serif;
                background: rgba(0, 0, 0, 0.45); padding: 5px;}
            #tips ul { padding-left: 15px;}
            #tips code {color: #d8965f;}
            #tips li {margin-bottom: 5px;}

            #cmd-result .usage {color: #60beeb;}
            #cmd-result .options {color: #E87DDF;}

            #version {position: fixed;bottom: 10px;right: 10px;font: normal 11px sans-serif;}

            .branch-1 {background-color: #264E29;}
            .branch-2 {background-color: #401C1C;}
            .branch-3 {background-color: #492852;}
            .branch-4 {background-color: #56511E;}
            .branch-5 {background-color: #1D486B;}
            .tags-empty {color: #A59D3F;font-style: italic;}

            .branch-0 .version::before { content: '◘    '; color: #506580;}
            .branch-1 .version::before { content: '│  ◘ '; color: #5BAB61;}
            .branch-2 .version::before { content: '│ ◘  '; color: #A96464;}
            .branch-3 .version::before { content: '│  ◘ '; color: #B42ED6;}
            .branch-4 .version::before { content: '│ ◘  '; color: #A79B22;}
            .branch-5 .version::before { content: '│  ◘ '; color: #969696;}
            .version::before {              content: '│    ';}
            /* .branch-0 + .branch-0 .version::before {content: '◘     ';}*/

            /* CSS Untuk animasi Loading */
            .loader,.loader--text{left:0;right:0;margin:auto}
            .loader--dot,.loader--text:after{
            animation-duration:3s;animation-iteration-count:infinite}
            .container{width:200px;font-family:Helvetica; margin: 0 auto;}
            .loader,.loader--dot{
            height:20px;position:absolute}.loader{width:250px;top:20px;bottom:0}
            .loader--dot{animation-name:loader;animation-timing-function:ease-in-out;width:20px;
            border-radius:100%;background-color:#000}
            .loader--dot:first-child{background-color:#8cc759;animation-delay:.5s}
            .loader--dot:nth-child(2){background-color:#8c6daf;animation-delay:.4s}
            .loader--dot:nth-child(3){background-color:#ef5d74;animation-delay:.3s}
            .loader--dot:nth-child(4){background-color:#f9a74b;animation-delay:.2s}
            .loader--dot:nth-child(5){background-color:#60beeb;animation-delay:.1s}
            .loader--dot:nth-child(6){background-color:#fbef5a;animation-delay:0s}
            .loader--text{position:absolute;top:200%;width:4rem}
            .loader--text:after{content:"Loading";font-weight:700;animation-name:loading-text}
            @keyframes loader{15%,95%{transform:translateX(0)}45%,65%{transform:translateX(230px)}}
            @keyframes loading-text{0%{content:"Loading"}25%{content:"Loading."}50%{
            content:"Loading.."}75%{content:"Loading..."}}
        </style>
    </head>
    <body>
    <?php if(!$is_login) : ?>
        <?php if(!is_json_support()) { ?>
        <div class="login-info">command <code>json</code> is not supported by fossil in this machine, just login using internal account</div>
        <?php } ?>
        <form action="#" id="form-login">
            <h1>Fossil<span>Hub</span> Login</h1>
            <label>Username</label><input type="text" id="username" name="user"/>
            <label>password</label><input type="password" id="password" name="password"/>
            <input type="submit" id="btn-login" value="Login">
        </form>
    <?php else : ?>

        <div id="btn-cmd">
            <h1>Fossil<span>Hub</span></h1>
            <div class="repo-info">Repository : <span><?php echo get_repo_name(); ?></span></div>
            <div class="repo-info">Remote URL (master repo) : <span><?php echo $remote_url; ?></span></div>

            <!-- yang akan diambil sebagai command adalah property name -->
            <?php
                foreach ($commands as $key => $value) {
                    $title = ucfirst($key);
                    echo "<button class='$key' name='$key' title='$value'>$title</button>\n";
                }
            ?>
            <label for="cmd-options">OPTIONS</label>
            <input type="text" name="cmd-options" id="cmd-options"></input>
        </div>

        <button class="btn-logout" id="btn-logout">Logout</button>
        <!-- button Clear Result -->
        <button class="btn-clear" id="btn-clear">Clear</button>
        <!-- Area hasil command -->
        <div id="cmd-result">
        </div>
        <div id="tips">
            <h2>Tips Fossil<span>Hub</span></h2>
            <ul>
                <li>Gunakan Options <code>--help</code> untuk menampilkan help dari command yg di klik</li>
                <li>Timeline, tambahkan options <code>-n|--limit x</code> (x adalah jumlah timeline yg ingin ditampilkan)</li>
                <li>Untuk Update server, tambahkan opsi <code>--user nama_user</code></li>
                <li>Arahkan mouse ke button untuk melihat deskripsi singkat command</li>
                <li>Button <code>close</code> bermanfaat jika server akan diakses fossil via SSH dengan user selain user apache.
                    Atau sebaliknya, menutup status open yg sebelumnya dilakukan via SSH agar bisa diakses fossilhub</li>
            </ul>
        </div>
    <?php endif; ?>
        <!-- HTML untuk menampilkan info Loading -->
        <div id="mask">
            <div class='container'>
              <div class='loader'>
                <div class='loader--dot'></div>
                <div class='loader--dot'></div>
                <div class='loader--dot'></div>
                <div class='loader--dot'></div>
                <div class='loader--dot'></div>
                <div class='loader--dot'></div>
                <div class='loader--text'></div>
              </div>
            </div>
            <div id="loading-cmd">fossil xyz..</div>
        </div>

        <div id="footer">
            <span id="version">version <?php echo VERSION;?></span>
        </div>
    </body>
</html>

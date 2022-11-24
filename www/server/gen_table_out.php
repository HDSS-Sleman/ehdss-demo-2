<?php
function get_data_type($ket) {
    $ket = trim($ket);
    if($ket === 'tgl' || $ket === 'date') {
        return " VARCHAR(10) NULL DEFAULT '' ";
    } elseif ($ket === 'text') {
        return " TEXT NULL ";
    } elseif ($ket === 'int') {
        return " INT NULL ";
    } elseif ( strpos($ket,'varchar') !== false) {
        return ' ' . strtoupper($ket);
    } else {
        return ' SMALLINT NULL DEFAULT NULL ';
    }
}

$GLOBALS['rt'] = array('id_rt');
$GLOBALS['art'] = array('id_rt','id_art');

// $type = jika nggak ada idart = '', ada [idart] = 'art', 'rt'
function gen_create_sql(&$datas,$table_name,$type = '') {
    // Filter, models (datas) ada 'idart' atau tidak
    if($type === 'art') {
        $datas = array_filter($datas, function($val) {
            $pos1 = stripos($val, '[idart]');
            $pos2 = stripos($val, '[d');
            return ($pos1 !== false) || ($pos2 !== false);
        });

        // hapus bagian '[idart]'
        $datas = array_map(function($val) {
            $tmp = str_replace('[idart]', '', $val);
            $tmp = str_replace('[d', '', $tmp);
            return $tmp;
        }, $datas);
    } elseif ($type === 'rt') {
        $datas = array_filter($datas, function($val) {
            $pos1 = stripos($val, '[idart]');
            $pos2 = stripos($val, '[d');
            return ($pos1 === false) && ($pos2 === false);
        });
    }

    // disimpan untuk diambil nama kolomnya saja
    foreach ($datas as $val) {
        $tmp = explode(' ', $val);
        if($type === 'rt') {
            $GLOBALS['rt'][] = $tmp[0];
        } else {
            $GLOBALS['art'][] = $tmp[0];
        }
    }

    // Add index
    if(empty($type) || $type === 'art') {
        // init nama kolom pertama (idrt) dan kedua (id_art)
        array_unshift($datas,'idrt INT NOT NULL','id_art INT NOT NULL');

        $datas[] = "UNIQUE INDEX idx_{$table_name}_idart (id_art)";
        $datas[] = "INDEX idx_{$table_name}_idrt (idrt)";
    } elseif ($type === 'rt') {
        array_unshift($datas,'idrt INT NOT NULL');
        // hapus data kedua (= index ke-1), kolom id_art
        array_splice($datas,1,0);
        $datas[] = "UNIQUE INDEX idx_{$table_name}_idrt (idrt)";
    }

    // $sql = "<textarea cols='80' rows='10'>";
    // $sql .= "CREATE TABLE $table_name (\n" . implode(",\n", $datas) . ');';
    // $sql .= "</textarea>";
    // return $sql;
    return "CREATE TABLE $table_name (\n" . implode(",\n", $datas) . ');';
}

$handle = fopen("../../codebook.txt", "r");
if ($handle) {
    $total = 0;
    $part = array();
    $artb = array();
    $krp  = array();
    $pm   = array();
    $ptm  = array();
    $dif  = array();
    $aks  = array();
    $hiv  = array();
    $ins  = array();
    $mb   = array();
    $kai  = array();
    $kim  = array();
    $asm  = array();

    $dt_type = '';
    $sql_out = array();
    while (($line = fgets($handle)) !== false) {
        $cols = str_getcsv($line,'|');
        if(count($cols) < 2 ) continue;

        // Proses parsing
        // $models adalah array berisi semua kolom pertama
        $models = explode('.', $cols[0]);
        // $c3 = kolom ketiga (value dari model)
        $c3 = isset($cols[2]) ? $cols[2] : '';
        $dt_type = get_data_type($c3);
        // kolom kedua (index 1) dijadikan komentar di table
        $dt_type .= 'COMMENT ' . "'" . $cols[1] . "'";
        $col_def = $models[1] .$dt_type;
        if(in_array('part', $models))   $part[] = $col_def;
        if(in_array('artb', $models))   $artb[] = $col_def;
        if(in_array('krp', $models))    $krp[]  = $col_def;
        if(in_array('pm',  $models))     $pm[]  = $col_def;
        if(in_array('ptm', $models))    $ptm[]  = $col_def;
        if(in_array('dif', $models))    $dif[]  = $col_def;
        if(in_array('aks', $models))    $aks[]  = $col_def;
        if(in_array('hiv', $models))    $hiv[]  = $col_def;
        if(in_array('ins', $models))    $ins[]  = $col_def;
        if(in_array('mb',  $models))    $mb[]   = $col_def;
        if(in_array('kai', $models))    $kai[]  = $col_def;
        if(in_array('kim', $models))    $kim[]  = $col_def;
        if(in_array('asm', $models))    $asm[]  = $col_def;
        $total++;
    }

    // print_r($dif);

    $sql_out[] = gen_create_sql($part, 'out_part_art');
    $sql_out[] = gen_create_sql($artb, 'out_artb_art');
    $sql_out[] = gen_create_sql($krp,  'out_krp_art');
    // Khusus model2 berikut, dipisah antara rt dan art
    $pm2 = $pm;
    $sql_out[] = gen_create_sql($pm,   'out_pm_rt','rt');
    $sql_out[] = gen_create_sql($pm2,  'out_pm_art','art');
    $ptm2 = $ptm;
    $sql_out[] = gen_create_sql($ptm,  'out_ptm_rt','rt');
    $sql_out[] = gen_create_sql($ptm2, 'out_ptm_art','art');

    $dif2 = $dif;
    $sql_out[] = gen_create_sql($dif,  'out_dif_rt','rt');
    $sql_out[] = gen_create_sql($dif2, 'out_dif_art','art');

    $aks2 = $aks;
    $sql_out[] = gen_create_sql($aks,  'out_aks_rt','rt');
    $sql_out[] = gen_create_sql($aks2, 'out_aks_art','art');

    $hiv2 = $hiv;
    $sql_out[] = gen_create_sql($hiv,  'out_hiv_rt','rt');
    $sql_out[] = gen_create_sql($hiv2, 'out_hiv_art','art');

    $ins2 = $ins;
    $sql_out[] = gen_create_sql($ins,  'out_ins_rt','rt');
    $sql_out[] = gen_create_sql($ins2, 'out_ins_art','art');

    $sql_out[] = gen_create_sql($mb,  'out_mb_rt','rt');
    $sql_out[] = gen_create_sql($kai, 'out_kai_art','art');
    $sql_out[] = gen_create_sql($kim, 'out_kim_art','art');
    $sql_out[] = gen_create_sql($asm, 'out_asm_art','art');

    file_put_contents('tables.sql', implode("\n\n", $sql_out));
    file_put_contents('rt.csv', implode(",", $GLOBALS['rt']));
    file_put_contents('art.csv', implode(",", $GLOBALS['art']));
    // print_r(array_fill_keys($GLOBALS['rt'], ''));
    // print_r(array_fill_keys($GLOBALS['art'], ''));

    // file_put_contents('ref_rt.json', json_encode(array_fill_keys($GLOBALS['rt'], '')));

    fclose($handle);
    exit("<br />Finish parsing codebook.txt, got $total model");
} else {
    // error opening the file.
    die('Error opening file');
}

?>

<?php

$reqType = $_SERVER['REQUEST_METHOD'];
$module  = $_REQUEST['module'];

$srcFile = dirname(__FILE__ ) . "/class.$module.php";
if(!file_exists($srcFile)) {
    die('{"sucess":false,"msg":"Class File Not Found"}');
}

require_once $srcFile;
$class = ucfirst($module);
if ( $reqType === 'POST')  {
    $obj = new $class;
    
    if (!empty($_REQUEST['method'])) {
        $method  = $_REQUEST['method'];
        $obj->$method();
    }else{
        $obj->save_data();
    }
} else {
    $method  = $_REQUEST['method'];
    if (class_exists($class)) {
        $obj = new $class;
        if (method_exists($obj, $method)) {
            $obj->$method();
        } else {
            die('{"success" : false,msg:"Ngapunten, method mboten wonten"}');
        }
    } else {
        die('{"success" : false,msg:"Sorry bro, Class-e ra ono"}');
    }
}
<?php
define('HOST', 'mysql.zzz.com.ua');
define('USER', 'wartvader');
define('PASSWORD', 'Password123');
define('DB', 'wartvader');
//define('DBanother', 'my_db');

$connection = mysqli_connect(HOST, USER, PASSWORD, DB);
$salt = "Beejee task made by Ilfat Uzaev 2020"; //соль для шифрования

if (!$connection)
    exit(mysqli_connect());

<?php
// 1) require конфига и других файлов
require_once('settings.php');
require_once('user.php');
require_once('content.php');

// 2) проверка пользователя, если он вошел
session_start();

// 3) вызов конкретного метода
$method = $_GET['method'] ?? 'default';
switch ($method) {
    case 'exit':
        $res = UserExit();
        break;
    case 'getUserInfo':
        $res = GetUserInfo();
        break;
    case 'loadTasks':
        $res = LoadTasks($_POST);
        break;
    case 'countTasks':
        $res = CountTasks($_POST);
        break;
    case 'login':
        $res = Login($_POST);
        break;
    case 'registration':
        $res = Registration($_POST);
        break;
    case 'toggleStatus':
        $res = toggleStatus();
        break;
    case 'checkReg':
        $res = CheckReg($_POST['params']);
        break;
    case 'checkAdmin':
        $res = isAdmin();
        break;
    case 'addTask':
        $res = AddTask();
        break;
}

// 4) вывод данных
echo json_encode($res);

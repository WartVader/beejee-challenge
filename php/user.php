<?php

class User
{
    private $login;
    private $email;
    private $role;
    private $password;

    function __construct($login = NULL, $email = NULL, $password = NULL, $role = NULL)
    {
        $this->login = $login;
        $this->email = $email;
        $this->password = $password;
        $this->role = $role;
        if ($login || $email || $password || $role == NULL) {
            $this->role = "visitor";
        } else {
            $err = $this->registration($this->$login, $this->$email, $this->$password);
            if ($err) {
                $this->login = NULL;
                $this->email = NULL;
                $this->password = NULL;
                $this->role = "visitor";
            }
        }
    }

    public function registration($login, $email, $password)
    {
        session_start();
        include('settings.php');

        $check = $this->сheckReg();
        if (!$check["email"] &&  !$check["login"]) {
            $login = mysqli_real_escape_string($connection, $login);
            $email = mysqli_real_escape_string($connection, $email);
            $password = mysqli_real_escape_string($connection, $password);
            $password = password_hash($password, PASSWORD_BCRYPT);

            mysqli_query($connection, "INSERT INTO users(id, login, email, password, role) 
        VALUES ('', '$login', '$email', '$password', 'user')")  or die(mysqli_error($connection));

            $sql_login = sprintf("SELECT * FROM users WHERE login = '$login'");
            $result = mysqli_query($connection, $sql_login);
            $row = mysqli_fetch_assoc($result);

            $_SESSION['id'] = $row['id'];
            $_SESSION['role'] = $row['role'];

            setcookie("id", $row['id'], time() + 259200, '/');
            setcookie("role", $row['role'], time() + 259200, '/');
            setcookie("login", $login, time() + 259200, '/'); //будет храниться всего 3 дня, но можно и больше, конечно
            return true;
        }
        return false;
    }

    private function сheckReg()
    {
        /*  
    
        Эта функция прдназначена для высвечивания ошибок в воде регистрации или 
        авторизации. На выходе функция возвращает типизорванный массив, где: 
        login - неправильный ввод логина (такой уже существует)
        email - не правильный ввод почты (такая почта уже существует)
    
        */
        session_start();
        include('settings.php');
        $login = mysqli_real_escape_string($connection, $_POST['login']);
        $email = mysqli_real_escape_string($connection, $_POST['email']);

        $answer["login"] = false;
        $answer["email"] = false;

        $sql_login = sprintf("SELECT * FROM users WHERE login = '$login'");
        $sql_email = sprintf("SELECT * FROM users WHERE email = '$email'");
        $result_login = mysqli_query($connection, $sql_login);
        $result_email = mysqli_query($connection, $sql_email);
        $row_login = mysqli_fetch_assoc($result_login);
        $row_email = mysqli_fetch_assoc($result_email);

        if ($row_login != NULL) {
            $answer["login"] = true;
        }
        if ($row_email != NULL) {
            $answer["email"] = true;
        }
        return $answer;
    }

    public function getLogin()
    {
        return $this->login;
    }

    public function getEmail()
    {
        return $this->email;
    }

    public function getRole()
    {
        return $this->role;
    }
}


function Registration()
{
    session_start();
    include('settings.php');

    $check = CheckReg();
    if (!$check["email"] &&  !$check["login"]) {
        $login = mysqli_real_escape_string($connection, $_POST['login']);
        $email = mysqli_real_escape_string($connection, $_POST['email']);
        $password = mysqli_real_escape_string($connection, $_POST['password']);
        $password = password_hash($password, PASSWORD_BCRYPT);

        mysqli_query($connection, "INSERT INTO users(id, login, email, password, role) 
        VALUES ('', '$login', '$email', '$password', 'user')")  or die(mysqli_error($connection));

        $sql_login = sprintf("SELECT * FROM users WHERE login = '$login'");
        $result = mysqli_query($connection, $sql_login);
        $row = mysqli_fetch_assoc($result);

        $_SESSION['id'] = $row['id'];
        $_SESSION['role'] = $row['role'];

        setcookie("id", $row['id'], time() + 259200, '/');
        setcookie("role", $row['role'], time() + 259200, '/');
        setcookie("login", $login, time() + 259200, '/'); //будет храниться всего 3 дня, но можно и больше, конечно
        return true;
    }
    return false;
}

function CheckReg()
{
    /*  

    Эта функция прдназначена для высвечивания ошибок в воде регистрации или 
    авторизации. На выходе функция возвращает типизорванный массив, где: 
    login - неправильный ввод логина (такой уже существует)
    email - не правильный ввод почты (такая почта уже существует)

    */
    session_start();
    include('settings.php');
    $login = mysqli_real_escape_string($connection, $_POST['login']);
    $email = mysqli_real_escape_string($connection, $_POST['email']);

    $answer["login"] = false;
    $answer["email"] = false;

    $sql_login = sprintf("SELECT * FROM users WHERE login = '$login'");
    $sql_email = sprintf("SELECT * FROM users WHERE email = '$email'");
    $result_login = mysqli_query($connection, $sql_login);
    $result_email = mysqli_query($connection, $sql_email);
    $row_login = mysqli_fetch_assoc($result_login);
    $row_email = mysqli_fetch_assoc($result_email);

    if ($row_login != NULL) {
        $answer["login"] = true;
    }
    if ($row_email != NULL) {
        $answer["email"] = true;
    }
    return $answer;
}


function Login()
{
    session_start();

    include('settings.php');

    $login = $_POST['login'];
    $password = $_POST['password'];

    $sql_login = sprintf("SELECT * FROM users WHERE login = '$login'");
    $result = mysqli_query($connection, $sql_login);
    $row = mysqli_fetch_assoc($result);
    if (password_verify($password, $row['password'])) {
        $error = "";
        $_SESSION['id'] = $row['id'];
        $_SESSION['role'] = $row['role'];

        setcookie("id", $row['id'], time() + 259200, '/');
        setcookie("role", $row['role'], time() + 259200, '/');
        setcookie("login", $login, time() + 259200, '/');

        return true;
        //header("Location: index.php");
        //exit();

    } else {
        return false;
    }
}

function GetUserInfo()
{
    include('settings.php');
    if ($_POST['id']) {
        $id = $_POST['id'];
    } else {
        $id = $_COOKIE['id'];
    }
    $sql = sprintf("SELECT id,role FROM users WHERE id = '$id'");
    $result = mysqli_query($connection, $sql);
    $row = mysqli_fetch_assoc($result);
    return ($row);
}

function GetUserInfoByID($id)
{
    $answer['id'] = $_COOKIE['id'];
    $answer['role'] = $_COOKIE['role'];
    $answer['login'] = $_COOKIE['login'];
    return ($answer);
}

function GetUserRating($id_content)
{
    include('settings.php');
    $id_user = $_COOKIE['id'];
    $sql = "SELECT rating FROM `user_ratings` WHERE id_user = $id_user AND id_content = $id_content";
    $result = mysqli_query($connection, $sql)  or die(mysqli_error($connection));
    $row = mysqli_fetch_assoc($result);
    return $row;
}

function UserExit()
{
    session_start();
    session_destroy();
    unset($_COOKIE['id']);
    unset($_COOKIE['role']);
    unset($_COOKIE['login']);
    setcookie('id', null, -1, '/');
    setcookie('role', null, -1, '/');
    setcookie('login', null, -1, '/');
    echo $_COOKIE['id'];
    echo $_COOKIE['role'];
    echo $_COOKIE['login'];
    header("Location: ../index.html");
}

function isAdmin()
{
    if ($_COOKIE['role'] == "admin")
        return true;
    else
        return false;
}

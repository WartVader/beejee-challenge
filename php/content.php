<?php

/* class Task
{
    public $tasks;
    public $status;
    public $user;
    public $email;
    function __construct()
    {
        $this->tasks = $this->getAll();
    }

    public function getAll($page = 1, $orderby = "id", $reverse = false)
    {
        include('settings.php');
        $n = ($page - 1) * 3;
        if ($reverse == true) {
            $desc = "";
        } else {
            $desc = "DESC";
        }


        $sql_tasks = sprintf("SELECT * FROM tasks ORDER BY $orderby $desc LIMIT 3 OFFSET $n"); //берет по три элемента, начиная с элемента под индексом n
        $result_tasks = mysqli_query($connection, $sql_tasks)  or die(mysqli_error($connection));

        $row = mysqli_fetch_all($result_tasks, MYSQLI_ASSOC);

        return $row;
    }

    private function changeStatus()
    {
        if ($this->user->getRole() == "admin") {
            $this->status = !$this->status;
        }
    }

    private function recordData()
    {
    }

    public function getStatus()
    {
        return $this->status;
    }

    public function getUser()
    {
        return $this->user;
    }
}
 */
function AddTask()
{
    include('settings.php');
    $name = mysqli_real_escape_string($connection, $_POST['name']);
    $email = mysqli_real_escape_string($connection, $_POST['email']);
    $task = mysqli_real_escape_string($connection, $_POST['task']);

    $sql = "INSERT INTO `tasks`(id, task, name, email, status) VALUES ('', '$task', '$name', '$email', false)";
    mysqli_query($connection, $sql) or die(mysqli_error($connection));

    return true;
}

function CountTasks()
{
    include('settings.php');
    $sql = sprintf("SELECT COUNT(*) as count FROM tasks");
    $res = mysqli_query($connection, $sql)  or die(mysqli_error($connection));
    $row = mysqli_fetch_array($res, MYSQLI_ASSOC);
    return $row["count"];
}

function LoadTasks()
{
    include('settings.php');
    $n = ($_POST['page'] - 1) * 3;
    $orderby = $_POST['orderby'] ?? 'id';
    if ($_POST['reverse'] == true) {
        $desc = "";
    } else {
        $desc = "DESC";
    }


    $sql_tasks = sprintf("SELECT * FROM tasks ORDER BY $orderby $desc LIMIT 3 OFFSET $n"); //берет по три элемента, начиная с элемента под индексом n
    $result_tasks = mysqli_query($connection, $sql_tasks)  or die(mysqli_error($connection));

    $row = mysqli_fetch_all($result_tasks, MYSQLI_ASSOC);

    return $row;
}

function toggleStatus()
{
    include('settings.php');
    include_once('user.php');
    if (isAdmin()) {
        $id = $_POST['id'];
        $status = $_POST['status'];
        $sql = sprintf("UPDATE tasks SET status = $status  WHERE id = $id");
        mysqli_query($connection, $sql) or die(mysqli_error($connection));
        return true;
    } else return false;
}

function LoadMainContent()
{
    session_start();
    include('settings.php');
    $id = $_POST['id'];
    $sql_contents = sprintf("SELECT * FROM `contents` WHERE `id`=$id");
    $result = mysqli_query($connection, $sql_contents);
    $row = mysqli_fetch_assoc($result);
    return ($row);
}

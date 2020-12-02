<?php
class Database{

    // specify your own database credentials
    private $host = "127.0.0.1:3306";
    private $db_name = "appointmentsystem";
    private $username = "Client";
    private $password = "Catdog123!@";
    public $conn;
    // get the database connection
    public function getConnection(){

        $this->conn = null;

        try{
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->exec("set names utf8");
        }catch(PDOException $exception){
            echo "Connection error: " . $exception->getMessage();
        }

        return $this->conn;
    }

	public function mysqliConnection()
	{
		$this->conn = null;
		$this->conn = mysqli_connect($this->host, $this->username, $this->password, $this->db_name);

		return $this->conn;
	}

	public function createSession()
	{
		if(ini_get('session.use_cookies') && isset($_COOKIE['PHPSESSID']))
		{
			$sessid = $_COOKIE['PHPSESSID'];
		}
		else if(!ini_get('session.use_only_cookies') && isset($_GET['PHPSESSID']))
		{
			$sessid = $_GET['PHPSESSID'];
		}
		else
		{
			session_start();
			return false;
		}

		if(!preg_match('/^[a-z0-9]{32}$/', $sessid))
		{
			return false;
		}
		session_start();
		return true;
	}
}
?>

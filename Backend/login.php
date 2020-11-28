<?php
	include("config/database.php");
	$username = "user";
	$password = "pass";

	function acceptLogin()
	{
		$database = new Database();
		$conn = $database->getConnection();
		$stmt = $conn->query("select FLOOR(RAND()*10000) as _rand");
		if ($row = $stmt->fetch()) {
			$rand = $row["_rand"];

			$conn = $database->getConnection();
			$stmt = $conn->query("update cookie set randomCookie = {$rand}");
			$stmt->fetch();
		}
    setcookie("login_cookie", $rand, time()+3600);
		header("Location: /Appointments/Frontend/HTML/manager-homepage.html");
		exit();
	}
	function declineLogin()
	{
		header("Location: /Appointments/Frontend/HTML/login-incorrect.html");
		exit();
	}
	if(isset($_POST['submit']))
	{
		$response->here = true;
		if ($_POST["username"] == $username && $_POST["password"] == $password) {
			acceptLogin();
		}
		else {
			declineLogin();
		}
	}
?>

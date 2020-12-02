<?php
	// include the database file
	include("config/database.php");
	$username = "user";
	$password = "pass";

	// Pre-condition: the login provided does match the one in the system
	function acceptLogin()
	{
		// create a new database object
		$database = new Database();
		$conn = $database->getConnection();
		// produce a random cookie
		$stmt = $conn->query("select FLOOR(RAND()*10000) as _rand");
		if ($row = $stmt->fetch()) {
			$rand = $row["_rand"];
			// store the cookie in the database
			$conn = $database->getConnection();
			$stmt = $conn->query("update cookie set randomCookie = {$rand}");
			$stmt->fetch();
		}
    setcookie("login_cookie", $rand, time()+3600);
		header("Location: /Appointments/Frontend/HTML/manager-homepage.html");
		exit();
	}

	// Pre-condition: the login provided does not match the one in the system
	function declineLogin()
	{
		header("Location: /Appointments/Frontend/HTML/login-incorrect.html");
		exit();
	}
	
	if(isset($_POST['submit']))
	{
		$response->here = true;
		// determine whether the username and password are correct and call the appropriate function
		if ($_POST["username"] == $username && $_POST["password"] == $password) {
			acceptLogin();
		}
		else {
			declineLogin();
		}
	}
?>

<?php
	include("config/database.php");
	$username = "user";
	$password = "pass";

	function acceptLogin()
	{
		header("Location: /Appointments/Frontend/HTML/manager-homepage.html");
		exit();
	}
	function declineLogin()
	{
		header("Location: /Appointments/Frontend/HTML/login.html");
		exit();
	}
	if(isset($_POST['submit']))
	{
		if ($_POST["username"] == $username && $_POST["password"] == $password) {
			acceptLogin();
		}
		else {
			declineLogin();
		}
	}
?>

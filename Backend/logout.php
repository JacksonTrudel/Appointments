<?php
	include("config/database.php");

	if(isset($_POST['logout']))
	{
		setcookie("login_cookie", -1, time()-3600);
		header("Location: /Appointments/Frontend/HTML/homepage.html");
		exit();
	}
?>

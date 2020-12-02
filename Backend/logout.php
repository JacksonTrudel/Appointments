<?php
	// include the database file
	include("config/database.php");
	
	// destroy the cookie upon logout
	if(isset($_POST['logout']))
	{
		setcookie("login_cookie", -1, time()-3600);
		header("Location: /Appointments/Frontend/HTML/homepage.html");
		exit();
	}
?>

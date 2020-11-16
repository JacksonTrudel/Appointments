<?php
	include("config/database.php");

	if(isset($_POST['logout']))
	{
		header("Location: /Appointments/Frontend/HTML/homepage.html");
		exit();
	}
?>

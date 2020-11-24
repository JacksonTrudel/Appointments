<?php
	include("config/database.php");
	$obj = json_decode(file_get_contents('php://input'), true);


	if($_SERVER["REQUEST_METHOD"] == "POST")
	{
		$database = new Database();
		$conn = $database->getConnection();
		session_start();
		//$response->sessiontest = $database->createSession();
		$response = new \stdClass();

		$response->conn = $conn;

		$response->error = false;
		if(mysqli_connect_errno($conn))
		{
			$response->error = true;
			exit();
		}
		else
		{
      $response->input = $obj;

			switch($obj['foo'])
			{
				case "store_appt_info":
				  add_appointment_information($obj);
					break;

				case "change_appt_info":
					change_appointment_information($obj);
					break;

				default:
					$response->text .= "unable to case switch.";
					break;
      }
    }

		echo json_encode($response);
		exit();
	}

	function add_appointment_information($transmit){
    global $database, $conn, $response;
		$new_customer_id = -1;
		$stmt = $conn->query("call createCustomer(\"".$transmit["first"]."\",\"".$transmit["last"]."\",\"".$transmit["phone"]."\", \"".$transmit["email"]."\")");

		while ($row = $stmt->fetch()) {
			$response->_id = intval($row["customer_id"]);
		}

		// PDO limited to one query, generate another PDO with $database->getConnection()
		$conn = $database->getConnection();

		$stmt = $conn->query("call createAppointment(".$response->_id.",\"".$transmit["subject"]."\",\"".$transmit["notes"]."\")");

		if ($row = $stmt->fetch()) {
			$_SESSION['appt_id'] = $row["appointment_id"];
			$response->_appt_id = $_SESSION['appt_id'];
		}
  }

	function change_appointment_information($transmit){
		global $database, $conn, $response;
		$conn = $database->getConnection();
		//$response->query = "call changeAppointmentInformation(".$transmit["appt_id"].", \"".$transmit["first"]."\",\"".$transmit["last"]."\",\"".$transmit["phone"]."\", \"".$transmit["email"]."\", \"".$transmit["subject"]."\",\"".$transmit["notes"]."\")";
		$stmt = $conn->query("call changeAppointmentInformation(".$transmit["appt_id"].", \"".$transmit["first"]."\",\"".$transmit["last"]."\",\"".$transmit["phone"]."\", \"".$transmit["email"]."\", \"".$transmit["subject"]."\",\"".$transmit["notes"]."\")");
		$response->success = 0;
		if ($row = $stmt->fetch()) {
			$response->_success = intval($row["success"]);
		}

	}
?>

<?php
	// include the database file
	include("config/database.php");
	$obj = json_decode(file_get_contents('php://input'), true);


	if($_SERVER["REQUEST_METHOD"] == "POST")
	{
		// create new database object
		$database = new Database();
		$conn = $database->getConnection();
		session_start();
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
			// based on the requested operation, call the appropriate function
			switch($obj['foo'])
			{
				case "store_appt_info":
				  add_appointment_information($obj);
					break;

				case "change_appt_info":
					change_appointment_information($obj);
					break;

				case "cancel_appointment":
					cancel_appointment($obj);
					break;

				default:
					$response->text .= "unable to case switch.";
					break;
      }
    }

		echo json_encode($response);
		exit();
	}

	// adds new appointment information using the information in $transmit
	function add_appointment_information($transmit){
    global $database, $conn, $response;
		$new_customer_id = -1;
		// call procedure createCustomer to create a new customer
		$stmt = $conn->query("call createCustomer(\"".$transmit["first"]."\",\"".$transmit["last"]."\",\"".$transmit["phone"]."\", \"".$transmit["email"]."\")");

		// get the customer_id
		while ($row = $stmt->fetch()) {
			$response->_id = intval($row["customer_id"]);
		}

		// PDO limited to one query, generate another PDO with $database->getConnection()
		$conn = $database->getConnection();

		// call procedure createAppointment to create new appointment object with customer_id retrieved in last call
		$stmt = $conn->query("call createAppointment(".$response->_id.",\"".$transmit["subject"]."\",\"".$transmit["notes"]."\")");

		// store the appointment ID in a session cookie
	  if($row = $stmt->fetch()) {
			$_SESSION['appt_id'] = $row["appointment_id"];
			$response->_appt_id = $_SESSION['appt_id'];
		}
  }

	// changes the appointment information for a pre-existing appointment using the information in $transmit
	function change_appointment_information($transmit){
		global $database, $conn, $response;
		// get new connection and call changeAppointmentInformation
		$conn = $database->getConnection();
		$stmt = $conn->query("call changeAppointmentInformation(".$transmit["appt_id"].", \"".$transmit["first"]."\",\"".$transmit["last"]."\",\"".$transmit["phone"]."\", \"".$transmit["email"]."\", \"".$transmit["subject"]."\",\"".$transmit["notes"]."\")");
		$response->success = 0;

		// determine whether call was successful
		if ($row = $stmt->fetch()) {
			$response->_success = intval($row["success"]);
		}

	}

	// cancels the existing appointment
	function cancel_appointment($transmit){
		global $database, $conn, $response;
		$conn = $database->getConnection();
		$stmt = $conn->query("update appointment set aCancelled = true where aId = ".$transmit["appt_id"]);
		if ($response->row = $stmt->fetch()) {
			$response->success = 1;
		}
	}
?>

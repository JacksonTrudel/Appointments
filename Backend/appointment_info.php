<?php
	include("config/database.php");
	$obj = json_decode(file_get_contents('php://input'), true);


	if($_SERVER["REQUEST_METHOD"] == "POST")
	{
		$database = new Database();
		$conn = $database->getConnection();
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

				default:
					$response->text .= "unable to case switch.";
					break;
      }
    }

		echo json_encode($response);
		exit();
	}

	function add_appointment_information($transmit){
    global $conn, $response;
		$new_customer_id = -1;
		$stmt = $conn->query("call createCustomer(\"".$transmit["first"]."\",\"".$transmit["last"]."\",
		                        \"".$transmit["phone"]."\", \"".$transmit["email"]."\")");

		while ($row = $stmt->fetch()) {
			$response->_id = $row["customer_id"];
		}

		/* Cannot test because will always fail key constraint.
		$stmt2 = $conn->query("call createAppointment(:".()$response->id).",\"".$transmit["subject"]."\",
		                        \"".$transmit["notes"]."\")");

		while ($row = $stmt2->fetch()) {
			$response->_appt_id = $row["appointment_id"];
		}*/



		//$stmt = $conn->prepare("insert into customer (cName, cPhone, cEmail) values (\"".$transmit["first"]."\",\"".$transmit["last"]."\",
		//                        \"".$transmit["phone"]."\", \"".$transmit["email"]."\")");
  }
?>

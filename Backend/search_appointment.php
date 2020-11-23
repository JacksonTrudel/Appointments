<?php
	include("config/database.php");
	$obj = json_decode(file_get_contents('php://input'), true);

	if($_SERVER["REQUEST_METHOD"] == "POST")
	{
		$database = new Database();
		session_start();
		$response = new \stdClass();


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
				case "search_appointment":
				  search_appointment($obj);
					break;

				default:
					$response->text .= "unable to case switch.";
					break;
      }
    }

		echo json_encode($response);
		exit();
	}

  function search_appointment($transmit) {
    global $database, $response;
    // need a new PDO to make a new query
    $conn = $database->getConnection();
    //$response->query = "call searchAppointment(\"{$transmit["last_name"]}\", {$transmit["appt_id"]})";

    $stmt = $conn->query("call searchAppointment(\"{$transmit["last_name"]}\", {$transmit["appt_id"]})");

    if ($row = $stmt->fetch()) {
      $response->notFound = 0;
      $response->first = $row["_first"];
      $response->last = $row["_last"];
      $response->phone = $row["_phone"];
      $response->email = $row["_email"];
      $response->date = $row["_date"];
      $response->start = $row["_start"];
      $response->end = $row["_end"];
      $response->subject = $row["_subject"];
      $response->notes = $row["_notes"];
    }
    else {
      $response->notFound = 1;
    }
  }
?>

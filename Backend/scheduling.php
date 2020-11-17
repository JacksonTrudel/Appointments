<?php
	include("config/database.php");
	$obj = json_decode(file_get_contents('php://input'), true);


	if($_SERVER["REQUEST_METHOD"] == "POST")
	{
		$database = new Database();
		$conn = $database->getConnection();
		$response->session = $database->createSession();
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
				case "get_durations":
				  get_durations($obj);
					break;

				case "get_available_appointments":
				  get_available_appointments($obj);
					break;

				default:
					$response->text .= "unable to case switch.";
					break;
      }
    }

		echo json_encode($response);
		exit();
	}

	function get_durations($transmit){
    global $database, $conn, $response;
		$stmt = $conn->query("select * from duration");
		$response->duration = array();
		$i = 0;
		while ($row = $stmt->fetch()) {
			$response->duration[$i] = intval($row["dLength"]);
			$i++;
		}
  }

	function get_available_appointments($transmit) {
	    global $database, $conn, $response;


	}
?>

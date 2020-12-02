<?php

	// include the database file
  include("config/database.php");
  $obj = json_decode(file_get_contents('php://input'), true);


  if($_SERVER["REQUEST_METHOD"] == "POST")
  {
    // create new database object
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
      // based on what is requested, call the appropriate function
      switch($obj['foo'])
      {
        case "get_default_availability":
          get_default_availability($obj);
          break;

        default:
          $response->text .= "unable to case switch.";
          break;
      }
    }

    		echo json_encode($response);
    		exit();
  }

  // Pre-condition: the date requested does not have a workday created (no appointments on this date either)
  function get_default_availability($transmit){
    global $conn, $response;
    // call getDefaultAvailability procedure
    $stmt = $conn->query("call getDefaultAvailability()");

    $i = 0;
    $response->days = array();
    // store result set in $response dictionary
    while ($row = $stmt->fetch()) {
      $response->days[$i] = new \stdclass();
      $response->days[$i]->dayKey = $row["dayKey"];
      $response->days[$i]->startTime = $row["startTime"];
      $response->days[$i]->endTime = $row["endTime"];
      $response->days[$i]->unavailable = $row["unavailable"];
      $i++;
    }
  }
 ?>

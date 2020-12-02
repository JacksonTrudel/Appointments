<?php
	// include the database file
  include("config/database.php");
  $obj = json_decode(file_get_contents('php://input'), true);

  if($_SERVER["REQUEST_METHOD"] == "POST")
  {
    $database = new Database();
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

      // based on the requested information, call the appropriate function
      switch($obj['foo'])
      {
        case "validate_owner":
          validate_owner($obj);
          break;

        default:
          $response->text .= "unable to case switch.";
          break;
      }
    }

    echo json_encode($response);
    exit();
  }

  // determines whether the user is logged in as the site-owner by comparing the stored cookie to
  // the one in the database
   function validate_owner($transmit) {
      global $database, $response;

      $conn = $database->getConnection();
      $stmt = $conn->query("select randomCookie from cookie");

      if ($row = $stmt->fetch()) {
        $cookie = intval($row["randomCookie"]);

        if (isset($_COOKIE["login_cookie"]) && intval($_COOKIE["login_cookie"]) == $cookie) {
          $response->accept = 1;
        }
        else {
          $response->accept = 0;
        }
      }
      else {
        $response->error = 1;
        $response->text .= "Could not retrieve cookie from database";
      }

   }
?>

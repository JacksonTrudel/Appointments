<?php
	// include the database file
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
			// based on the requested information, call the appropriate function
			switch($obj['foo'])
			{
				case "search_appointment":
				  search_appointment($obj);
					break;

        case "view_appointments":
          view_appointments($obj);
					break;

				case "view_appointments_weekly":
          view_appointments_weekly($obj);
					break;
				default:
					$response->text .= "unable to case switch.";
					break;
      }
    }

		echo json_encode($response);
		exit();
	}

	// retrieves the appointment information with the appointment ID: $transmit["appt_id"]
  function search_appointment($transmit) {
    global $database, $response;
    // need a new PDO to make a new query
    $conn = $database->getConnection();

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
      $response->cancelled = $row["_cancelled"];

      // determine whether appointment is at least 48 hours year away
      $response->currentDateTime = new DateTimeImmutable();
      $response->appointmentDateTime = new DateTimeImmutable("{$response->date} {$response->start}");
      if ($response->currentDateTime->modify("+48 hour") <= $response->appointmentDateTime)
      {
        $response->withinFortyEight = false;
      }
      else
      {
        $response->withinFortyEight = true;
      }
    }
    else {
      $response->notFound = 1;
    }
  }

	// retrieves all the appointment information from $transmit["date"]
	// to an end date which is determined by the value of $transmit["format"]
	// Stored in a daily breakdown
  function view_appointments($transmit){
      global $database, $response;
      $conn = $database->getConnection();

      // start date (inclusive) of our search range
      $response->startDate = new DateTimeImmutable("{$transmit["date"]} 00:00:00");

      // determine end date (exculsive) of our search range
      if ($transmit["format"] == "h"){
        // format is hourly
        $response->endDate = (new DateTimeImmutable("{$transmit["date"]} 00:00:00"))->modify("+5 day");
        $time_grouping = "+1 hour";
      }
      else {
        // format is daily
        $response->endDate = (new DateTimeImmutable("{$transmit["date"]} 00:00:00"))->modify("+14 day");
        $time_grouping = "+1 day";
      }
      $response->endDate = $response->endDate->format("Y-m-d");
			$response->query = "call viewAppointments(\"{$transmit["date"]}\", \"{$response->endDate}\")";
      $stmt = $conn->query("call viewAppointments(\"{$transmit["date"]}\", \"{$response->endDate}\")");
			$response->day = array();
			while ($row = $stmt->fetch()) {
				$date = $row["wDate"];
				$found = -1;
				$day_length = count($response->day);
				for ($i = 0; $i < $day_length; $i++) {

					if ($response->day[$i]->date == $date) {
						$found = $i;
					}
				}

				if ($found == -1) {
					$response->day[$day_length] = new \stdClass();
					$response->day[$day_length]->date = $date;
					$response->day[$day_length]->dayOfWeek = $row["dayOfWeek"];
					$response->day[$day_length]->appointment = array();
					$response->day[$day_length]->appointment[0] = new \stdClass();
					$response->day[$day_length]->appointment[0]->start = $row["aStartTime"];
					$response->day[$day_length]->appointment[0]->end = $row["aEndTime"];
					$response->day[$day_length]->appointment[0]->first = $row["cFirst_name"];
					$response->day[$day_length]->appointment[0]->last = $row["cLast_name"];
					$response->day[$day_length]->appointment[0]->email = $row["cEmail"];
					$response->day[$day_length]->appointment[0]->phone = $row["cPhone"];
					$response->day[$day_length]->appointment[0]->last = $row["cLast_name"];
					$response->day[$day_length]->appointment[0]->notes = $row["aNotes"];
					$response->day[$day_length]->appointment[0]->subject = $row["aSubject"];
					$response->day[$day_length]->appointment[0]->id = $row["aId"];
		      // determine whether appointment is at least 48 hours year away
		      $response->currentDateTime = new DateTimeImmutable();
					$response->fortyEight = $response->currentDateTime->modify("+48 hour");
		      $response->appointmentDateTime = new DateTimeImmutable("{$date} {$row["start"]}");
		      if ($response->fortyEight <= $response->appointmentDateTime)
		      {
		        $response->day[$day_length]->appointment[0]->withinFortyEight = false;
		      }
		      else
		      {
		        $response->day[$day_length]->appointment[0]->withinFortyEight = true;
		      }
				}
				else {
					$len = count($response->day[$found]->appointment);
					$response->day[$found]->appointment[$len] = new \stdClass();
					$response->day[$found]->appointment[$len]->start = $row["aStartTime"];
					$response->day[$found]->appointment[$len]->end = $row["aEndTime"];
					$response->day[$found]->appointment[$len]->first = $row["cFirst_name"];
					$response->day[$found]->appointment[$len]->last = $row["cLast_name"];
					$response->day[$found]->appointment[$len]->email = $row["cEmail"];
					$response->day[$found]->appointment[$len]->phone = $row["cPhone"];
					$response->day[$found]->appointment[$len]->last = $row["cLast_name"];
					$response->day[$found]->appointment[$len]->notes = $row["aNotes"];
					$response->day[$found]->appointment[$len]->subject = $row["aSubject"];
					$response->day[$found]->appointment[$len]->id = $row["aId"];
					// determine whether appointment is at least 48 hours year away
				 $response->currentDateTime = new DateTimeImmutable();
				 $response->appointmentDateTime = new DateTimeImmutable("{$date} {$row["start"]}");

				 if ($response->currentDateTime->modify("+48 hour") <= $response->appointmentDateTime)
				 {
					 $response->day[$found]->appointment[$len]->withinFortyEight = false;
				 }
				 else
				 {
					 $response->day[$found]->appointment[$len]->withinFortyEight = true;
				 }
				}
			}
  }

	// retrieves all the appointment information from $transmit["date"]
	// to an end date which is determined by the value of $transmit["format"]
	// Stored in a daily breakdown
	function view_appointments_weekly($transmit){
      global $database, $response;
      $conn = $database->getConnection();

      // start date (inclusive) of our search range
      $response->startDate = new DateTimeImmutable("{$transmit["date"]} 00:00:00");


      // format is weekly
      $response->endDate =  (new DateTimeImmutable("{$transmit["date"]} 00:00:00"))->modify("+70 day");
      $time_grouping = "+7 day";
		 	$tracesWeek = new DateTimeImmutable("{$transmit["date"]} 00:00:00");
      $response->endDate = $response->endDate->format("Y-m-d");
      $stmt = $conn->query("call viewAppointments(\"{$transmit["date"]}\", \"{$response->endDate}\")");
			$response->week = array();
			for ($i = 0; $i < 10; $i++) {
				// create new class for the week and create time information
				$response->week[$i] = new \stdClass();
				$response->week[$i]->startDate = $tracesWeek->format("Y-m-d");
				$response->week[$i]->endDate = $tracesWeek->modify("+6 day")->format("Y-m-d");
				$response->week[$i]->startDateString = $tracesWeek->format("l");
				$response->week[$i]->endDateString = $tracesWeek->modify("+6 day")->format("l");
				$response->week[$i]->startDateImmutable = $tracesWeek;
				$response->week[$i]->endDateImmutable = $tracesWeek->modify("+6 day");

				$response->week[$i]->day = array();
				$tracesWeek = $tracesWeek->modify("+7 day");
			}
			// for each record in the record set
			while ($row = $stmt->fetch()) {
				$date = new DateTimeImmutable("{$row["wDate"]} {$row["aStartTime"]}");
				$found = -1;
				$week_length = count($response->week);
				for ($i = 0; $i < $week_length; $i++) {

					if ($response->week[$i]->startDateImmutable <= $date && $response->week[$i]->endDateImmutable >= $date) {
						$found = $i;
					}
				}
				// need to create a new week, with a day array, with an appointment array
				if ($found == -1) {
					$response->error = 1;
					$response->text .= "did not find week";
				}
				else {

					// search for day in weeks
					$found_day = -1;
					$day_length = count($response->week[$found]->day);
					for ($i = 0; $i < $day_length; $i++) {

						if ($response->week[$found]->day[$i]->date == $row["wDate"]) {
							$found_day = $i;
						}
					}

					if ($found_day == -1) {
						$response->week[$found]->day[$day_length] = new \stdClass();
						$response->week[$found]->day[$day_length]->date = $row["wDate"];
						$response->week[$found]->day[$day_length]->dayOfWeek = $row["dayOfWeek"];
						$response->week[$found]->day[$day_length]->appointment = array();
						$response->week[$found]->day[$day_length]->appointment[0] = new \stdClass();
						$response->week[$found]->day[$day_length]->appointment[0]->start = $row["aStartTime"];
						$response->week[$found]->day[$day_length]->appointment[0]->end = $row["aEndTime"];
						$response->week[$found]->day[$day_length]->appointment[0]->first = $row["cFirst_name"];
						$response->week[$found]->day[$day_length]->appointment[0]->last = $row["cLast_name"];
						$response->week[$found]->day[$day_length]->appointment[0]->email = $row["cEmail"];
						$response->week[$found]->day[$day_length]->appointment[0]->phone = $row["cPhone"];
						$response->week[$found]->day[$day_length]->appointment[0]->last = $row["cLast_name"];
						$response->week[$found]->day[$day_length]->appointment[0]->notes = $row["aNotes"];
						$response->week[$found]->day[$day_length]->appointment[0]->subject = $row["aSubject"];
						$response->week[$found]->day[$day_length]->appointment[0]->id = $row["aId"];
			      // determine whether appointment is at least 48 hours year away
			      $response->currentDateTime = new DateTimeImmutable();
			      $response->appointmentDateTime = $date;
			      if ($response->currentDateTime->modify("+48 hour") <= $response->appointmentDateTime)
			      {
			        $response->week[$found]->day[$day_length]->appointment[0]->withinFortyEight = false;
			      }
			      else
			      {
			        $response->week[$found]->day[$day_length]->appointment[0]->withinFortyEight = true;
			      }
					}
					// day exists in week object, make appointment
					else {
						$len = count($response->week[$found]->day[$found_day]->appointment);
						$response->week[$found]->day[$found_day]->appointment[$len] = new \stdClass();
						$response->week[$found]->day[$found_day]->appointment[$len]->start = $row["aStartTime"];
						$response->week[$found]->day[$found_day]->appointment[$len]->end = $row["aEndTime"];
						$response->week[$found]->day[$found_day]->appointment[$len]->first = $row["cFirst_name"];
						$response->week[$found]->day[$found_day]->appointment[$len]->last = $row["cLast_name"];
						$response->week[$found]->day[$found_day]->appointment[$len]->email = $row["cEmail"];
						$response->week[$found]->day[$found_day]->appointment[$len]->phone = $row["cPhone"];
						$response->week[$found]->day[$found_day]->appointment[$len]->last = $row["cLast_name"];
						$response->week[$found]->day[$found_day]->appointment[$len]->notes = $row["aNotes"];
						$response->week[$found]->day[$found_day]->appointment[$len]->subject = $row["aSubject"];
						$response->week[$found]->day[$found_day]->appointment[$len]->id = $row["aId"];
						// determine whether appointment is at least 48 hours year away
					 $response->currentDateTime = new DateTimeImmutable();
					 $response->appointmentDateTime = $date;
					 if ($response->currentDateTime->modify("+48 hour") <= $response->appointmentDateTime)
					 {
						 $response->week[$found]->day[$found_day]->appointment[$len]->withinFortyEight = false;
					 }
					 else
					 {
						 $response->week[$found]->day[$found_day]->appointment[$len]->withinFortyEight = true;
					 }
					}
				}
			}
  }
?>

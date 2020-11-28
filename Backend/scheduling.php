<?php
	include("config/database.php");
	$obj = json_decode(file_get_contents('php://input'), true);

	if($_SERVER["REQUEST_METHOD"] == "POST")
	{
		$database = new Database();
		session_start();//$response->session = $database->createSession();
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

				case "schedule_appointment":
					schedule_appointment($obj);
					break;

				case "store_appt_id_change_time":
					store_appt_id_change_time($obj);
					break;

				case "reschedule_appointment":
					reschedule_appointment($obj);
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

		$conn = $database->getConnection();
		$stmt = $conn->query("select * from duration");
		$response->duration = array();
		$i = 0;
		while ($row = $stmt->fetch()) {
			$response->duration[$i] = intval($row["dLength"]);
			$i++;
		}
  }

	// Queries the database for the default availability for $transmit["date"]
	// Input:
	// 		$transmit["date"] stores the date of the current search by the user
	//		$transmit["duration"] stores the requested duration for the appointment
	function get_default_availability($transmit) {
		global $database, $conn, $response;
		// need a new PDO to make a new query
		$conn = $database->getConnection();
		$stmt = $conn->query("select dStartTime, dEndTime, dUnavailable from defaultAvailabilityDay where dDayKey = {$response->dayOfWeek}");

		if ($row = $stmt->fetch()) {
				$response->dayStart = $row["dStartTime"];
				$response->dayEnd = $row["dEndTime"];
				$response->dayUnavailable = intval($row["dUnavailable"]);

				// Calculate possible times if the site-owner works on $transmit["date"]
				if ($response->dayUnavailable == 0) {
					$response->times =  array(array());

					$response->start = new DateTimeImmutable("{$transmit["date"]} {$response->dayStart}");
					$response->end = new DateTimeImmutable("{$transmit["date"]} {$response->dayEnd}");

					$trav = new DateTimeImmutable("{$transmit["date"]} {$response->dayStart}");

					$interval_num = 0;
					while ($trav->modify("+{$transmit["duration"]} minute") <= $response->end)
					{
						$response->times[$interval_num][0] = $trav->format("H:i");
						$response->times[$interval_num][1] = $trav->modify("+{$transmit["duration"]} minute")->format("H:i");

						$trav = $trav->modify("+15 minute");
						$interval_num++;
					}
				}
		}
		else {
			$response->error = true;
		}
	}


	function get_possible_times($transmit) {
		global $database, $conn, $response;
		// need a new PDO to make a new query
		$conn = $database->getConnection();
		$stmt = $conn->query("call getAppointmentTimes(\"{$transmit["date"]}\")");



		// expect at least one tuple returned
		if ($row = $stmt->fetch()) {
			// these fields are defined whether there are appointments scheduled or not
			$response->openTime = $row["openTime"];
			$response->closeTime = $row["closeTime"];
			$response->existsAppts = intval($row["existsAppts"]);

			// A Workday may or may not have any scheduled appointments.
			// First, we read in all the appointments, then generate possible
			// appointment times in the gaps.
			if ($response->existsAppts == 1) {
				// Reading them in:
				// 		apts is a 2D array, the first indexes the appointment,
				// 		the second accesses the start time [0] or end time [1]
				$response->appts = array(array());
				$i = 0;

				$response->appts[$i][0] = $row["startTime"];
				$response->appts[$i][1] = $row["endTime"];

				while ($row = $stmt->fetch()) {
					$i++;
					$response->appts[$i][0] = $row["startTime"];
					$response->appts[$i][1] = $row["endTime"];
				}

				// Now we generate the possible appointments
				// STEP 1: GENERATE APPOINTMENTS BETWEEN THE SITE OWNER'S (openTime)
				// AND THE FIRST SCHEDULED APPOINTMENT
				$response->firstApptStart = new DateTimeImmutable("{$transmit["date"]} {$response->appts[0][0]}");
				$response->firstApptStart = $response->firstApptStart->modify("-5 minute");
				// traverses all possible times and adds them to response
				$trav = new DateTimeImmutable("{$transmit["date"]} {$response->openTime}");
				$response->startTime = new DateTimeImmutable("{$transmit["date"]} {$response->openTime}");
				$interval_num = 0;

				while ($trav->modify("+{$transmit["duration"]} minute") <= $response->firstApptStart)
				{
					$response->times[$interval_num][0] = $trav->format("H:i");
					$response->times[$interval_num][1] = $trav->modify("+{$transmit["duration"]} minute")->format("H:i");


					$trav = $trav->modify("+15 minute");

					$interval_num++;
				}

				// STEP 2: GENERATE POSSIBLE APPOINTMENTS "IN THE GAPS" -> BETWEEN SCHEDULED APPOINTMENTS

				for ($i = 0; $i < count($response->appts) - 1; $i++) {
					// next appt start time
					$response->nextApptStart = new DateTimeImmutable("{$transmit["date"]} {$response->appts[$i + 1][0]}");
					$response->nextApptStart = $response->nextApptStart->modify("-5 minute");
					// traverses all possible times and adds them to response - starts with first appointment end time + buffer
					$trav = new DateTimeImmutable("{$transmit["date"]} {$response->appts[$i][1]}");
					$trav = $trav->modify("+5 minute");
					$adjustIntervalVal = $interval_num;
					while ($trav->modify("+{$transmit["duration"]} minute") <= $response->nextApptStart)
					{
						$response->times[$interval_num][0] = $trav->format("H:i");
						$response->times[$interval_num][1] = $trav->modify("+{$transmit["duration"]} minute")->format("H:i");

						if ($adjustIntervalVal == $interval_num){
							$trav = $trav->modify("+10 minute");
						}
						else {
							$trav = $trav->modify("+15 minute");
						}
						$interval_num++;
					}
				}

				// STEP 3: GENERATE POSSIBLE APPOINTMENTS BETWEEN THE LAST APPOINTMENT'S END TIME
				//    AND THE SITE OWNER'S (closeTime)
				// site owner's close time
				$response->closingTimeObj = new DateTimeImmutable("{$transmit["date"]} {$response->closeTime}");
				// traverses all possible times and adds them to response -> starts with last appointment end time + buffer
				$trav = new DateTimeImmutable("{$transmit["date"]} {$response->appts[count($response->appts) - 1][1]}");
				$trav = $trav->modify("+5 minute");

				$adjustIntervalVal = $interval_num;
				while ($trav->modify("+{$transmit["duration"]} minute") <= $response->closingTimeObj)
				{
					$response->times[$interval_num][0] = $trav->format("H:i");
					$response->times[$interval_num][1] = $trav->modify("+{$transmit["duration"]} minute")->format("H:i");

					if ($adjustIntervalVal == $interval_num){
						$trav = $trav->modify("+10 minute");
					}
					else {
						$trav = $trav->modify("+15 minute");
					}
					$interval_num++;
				}

			}
			else {
				// if no appointments exist, generate possible appointments between openTime and endTime
				$response->times =  array(array());

				$response->end = new DateTimeImmutable("{$transmit["date"]} {$response->closeTime}");
				$trav = new DateTimeImmutable("{$transmit["date"]} {$response->openTime}");

				$interval_num = 0;
				while ($trav->modify("+{$transmit["duration"]} minute") <= $response->end)
				{
					$response->times[$interval_num][0] = $trav->format("H:i");
					$response->times[$interval_num][1] = $trav->modify("+{$transmit["duration"]} minute")->format("H:i");

					$trav = $trav->modify("+15 minute");
					$interval_num++;
				}
			}
		}
		else {
			$respones->error = 1;
			$response->text += "unknown database error";
		}

	}

	function get_available_appointments($transmit) {
	    global $database, $conn, $response;

			$conn = $database->getConnection();
			$stmt = $conn->query("call dateExists(\"{$transmit["date"]}\")");

			if ($row = $stmt->fetch()) {
				$response->dayID = intval($row["id"]);
				$response->dayExists = intval($row["exsts"]);
				$response->dayOfWeek = intval($row["dayOfWeek"]);
				$_SESSION['dayOfWeek'] = $response->dayOfWeek;

				// $row["exsts"] equals -1 if there are no scheduled appointments on date, and no
				// special open/close times scheduled for this date
				if($response->dayExists == 0) {
					get_default_availability($transmit);
				}
				else {
					get_possible_times($transmit);
				}
			}
			else {
				$response->error = true;
			}
	}

	function schedule_appointment($transmit){
		global $database, $conn, $response;

		$response->no_app_id = false;
		if (!isset($_SESSION['appt_id'])) {
			$response->no_app_id = true;
			return;
		}
		if (!isset($_SESSION['dayOfWeek'])) {
			$response->error = 1;
			$response->error_message = "server error - dayOfWeek cookie not set";
			return;
		}

		$conn = $database->getConnection();
		$stmt = $conn->query("call bookAppointment({$_SESSION['appt_id']}, \"{$transmit['date']}\", {$_SESSION['dayOfWeek']}, \"{$transmit['start']}\", \"{$transmit['end']}\")");


		if ($row = $stmt->fetch()) {
			$response->success = intval($row["success"]);

			if ($response->success == 1)
				$response->apptId = intval($row["id"]);

			unset($_SESSION['app_id']);
		}
	}

	// for the user to reschedule their appointment
	function reschedule_appointment($transmit) {
		global $database, $conn, $response;

		$conn = $database->getConnection();
		$response->query = "select dayofweek(\"{$transmit['date']}\") as _dayOfWeek";
		$stmt = $conn->query("select dayofweek(\"{$transmit['date']}\") as _dayOfWeek");
		$row = $stmt->fetch();
		$dayOfWeek = intval($row["_dayOfWeek"]);

		if (!isset($_SESSION['appt_id_change_time']))
		{
			$response->error = 1;
			$response->text .= "appt_id_change_time not set";

		}
		else {

			$id = intval($_SESSION['appt_id_change_time']);
			$conn = $database->getConnection();
			$response->query = "call bookAppointment({$id}, \"{$transmit['date']}\", {$dayOfWeek}, \"{$transmit['start']}\", \"{$transmit['end']}\")";
			$stmt = $conn->query("call bookAppointment({$id}, \"{$transmit['date']}\", {$dayOfWeek}, \"{$transmit['start']}\", \"{$transmit['end']}\")");
			if ($row2 = $stmt->fetch()) {
				$response->success = intval($row2["success"]);

				if ($response->success == 1)
					$response->apptId = intval($row2["id"]);
			}
		}

	}

	function store_appt_id_change_time($transmit) {
			global $database, $response;

			$_SESSION['appt_id_change_time'] = $transmit["appt_id"];
	}
?>

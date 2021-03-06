<!doctype html>
<html lang="en">

<head>
	<meta charset="utf-8" />
	<title>Item Page</title>
	<!-- Bootstrap core CSS -->
	<link href="../Frontend/CSS/bootstrap-4.0.0/dist/css/bootstrap.min.css" rel="stylesheet">

</head>

<body>
	<header class="row">
		<!-- Fixed navbar -->
		<nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
			<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>
			<div class="collapse navbar-collapse" id="navbarCollapse">
				<ul class="navbar-nav mr-auto">
					<li class="nav-item">
						<a class="nav-link" href="./../Frontend/HTML/homepage.html">Home</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="./../Frontend/HTML/book-appointment.html">Book</a>
					</li>
					<li class="nav-item">
						<a class="nav-link active" href="./../Frontend/HTML/search-appointment.html">Search</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="./../Frontend/HTML/availability.html">Availability</a>
					</li>
				</ul>
			</div>
		</nav>
	</header>
	<main role="main" class="container" id="change-info-content">
		<div class="container" style="margin-bottom:100px">
			<div class="py-5 text-center">

				<p class="lead" style="margin-top:30px">Change your information.</p>
			</div>

			<!-- appt_info_form FORM -->
			<form name="appt_info_form">
				<!-- first and last name row -->
				<div class="form-row" style="justify-content: center">
					<!-- first name -->
          <input type="hidden" id="appt_id" name="appt_id" value="<?php echo $_GET["appt_id"]?>">
					<div class="form-group col-md-4 my-2">
						<label for="first_name">First Name</label>
						<input type="text" class="form-control" id="first_name" name="first_name" value="<?php echo $_GET["change_first"]?>" placeholder="First">
						<div class="invalid-feedback">
							Please enter your first name.
						</div>
					</div>
					<!-- last name -->
					<div class="form-group col-md-4 my-2">
						<label for="last_name">Last Name</label>
						<input type="text" class="form-control" id="last_name" name="last_name" value="<?php echo $_GET["change_last"]?>" placeholder="Last">
						<div class="invalid-feedback">
							Please enter your last name.
						</div>
					</div>
				</div>
				<!-- email and phone number -->
				<div class="form-row" style="justify-content: center">
					<!-- phone number -->
					<div class="form-group col-md-3 my-2">
						<label for="phone">Phone Number</label>
						<input type="text" class="form-control" id="phone" name="phone"   value="<?php echo $_GET["change_phone"]?>" placeholder="(###) ### - ####">
						<div class="invalid-feedback">
							Please enter your phone number.
						</div>
					</div>
					<!-- email -->
					<div class="form-group col-md-5 my-2">
						<label for="email">Email</label>
						<input type="text" class="form-control" id="email" name="email"  value="<?php echo $_GET["change_email"]?>" placeholder="name@example.com">
						<div class="invalid-feedback">
							Please enter your last name.
						</div>
					</div>
				</div>
				<!-- subject row -->
				<div class="form-row" style="justify-content: center">
					<div class="form-group col-md-8 my-2">
						<label for="subject">Subject of Appointment</label>
						<input type="text" class="form-control" id="subject"  value="<?php echo $_GET["change_subject"]?>" name="subject">
						<div class="invalid-feedback">
							Please enter a subject for the appointment.
						</div>
					</div>
				</div>
				<!-- notes row -->
				<div class="form-row" style="justify-content: center">
					<div class="form-group col-md-8 my-2">
						<label for="notes">Notes</label>
						<textarea type="text" class="form-control" id="notes" name="notes"><?php echo $_GET["change_notes"]?></textarea>
						<div class="invalid-feedback">
							If there are no additional notes, enter "None".
						</div>
					</div>
				</div>
				<!-- continue button row -->
				<div class="form-row" style="justify-content: center">
					<div class="form-group my-2">
						<button type="button" class="btn btn-danger" href="../Frontend/HTML/homepage.html" style="margin:0 auto" onclick="cancelChangeInfo()">Cancel</button>
						<button type="button" class="btn btn-primary" onClick="validateChangeInfo()" style="margin:0 auto">Confirm Information</button>
					</div>
				</div>
			</form>


		</div>
	</main>
	<!-- Bootstrap core JavaScript
		================================================== -->
	<!-- Placed at the end of the document so the pages load faster -->
	<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
	<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
	<script src="../Frontend/JavaScript/validation.js"></script>
	<script src="../Frontend/JavaScript/booking.js"></script>
	<script src="../Frontend/JavaScript/change-information.js"></script>


</body>

</html>

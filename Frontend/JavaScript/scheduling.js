/*
 *   scheduling.js
 *
 *   Author:               Jackson Trudel
 *   Attached to pages:    schedule-appointment.html, reschedule-appointment.html
 *   Purpose:               - always sets min and max inputs for date input field and calls
 *                             fillDurationDropdown() on load
 *                          - defines 5 functions which handling the time scheduling
 *                             of the appointments.
 */

 /*
  *   Function: fillDurationDropdown
  *   Pages: schedule-appointment.html, reschedule-appointment.html
  *   Pre-Conditions:
  *        * The ID of the dropdown to fill is passed as a parameter
  *   Post-conditions:
  *        * Retrieves the breakdown of appointment durations and displays them
  *           to the user inside the dropdown with ID 'id'
  */
function fillDurationDropdown(id) {
  // construct message
  message = `{"foo":"get_durations"}`;

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

      var info = JSON.parse(this.responseText);
      console.log(info);
      if (info.error != 1) {
        // get a reference to the dropdown element
        const elem = document.getElementById(id);

        // for each duration, add a new option in the dropdown for the duration
        for (var i = 0; i < info.duration.length; i++) {
          elem.innerHTML += `<option value="${info.duration[i]}">${info.duration[i]} minutes</option>`;
        }
      } else {
        // if any error occurs, alert the user
        alert("Unknown server-side error (fetching appointment durations).");
      }
    }
  }
  xmlhttp.open("POST", "../../Backend/scheduling.php", true);
  xmlhttp.setRequestHeader("Content-type", 'application/json; charset=UTF-8');
  xmlhttp.send(message);
}

/*
 *   Function: passesValidation
 *   Pages: schedule-appointment.html, reschedule-appointment.html
 *   Pre-Conditions:
 *        * The date (format "YYYY-mm-dd" and duration (format "HH:MM:SS") are supplied as parameters
 *   Post-conditions:
 *        * Returns false if the date is not a valid date or if a duration is not selected
 *        * Otherwise, passesValidation returns true
 */
function passesValidation(date, duration) {
  // if not a valid date, instruct the user to input a valid date
  if (!isValidDate(date)) {
    alert("Please input a valid date.");
    document.appt_request_form.date.focus();
    return false;
  }

  // if a duration is not selected, instruct the user to select a duration
  if (duration == -1) {
    alert("Please select a duration.");
    document.appt_request_form.duration_dropdown.focus();
    return false;
  }

  return true;
}

/*
 *   Function: searchForAppointments
 *   Pages: schedule-appointment.html, reschedule-appointment.html
 *   Pre-Conditions:
 *        * The date and duration are in the date and duration_dropdown DOM elements
 *        * The DOM element with ID available_times_container is the one to be filled
 *   Post-conditions:
 *        * Retrieves possible appointment times and displays them to the users as selectable
 *          buttons, each of which triggers an appointment to be scheduled for that time
 */
function searchForAppointments() {
  const date = document.appt_request_form.date.value;
  const duration = document.appt_request_form.duration_dropdown.value;
  // first validate the date and duration are appropriate
  if (!passesValidation(date, duration)) {
    return false;
  }

  // construct the HTTPRequest message
  message = `{"foo":"get_available_appointments", "date":"${date}", "duration":"${duration}"}`;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

      var info = JSON.parse(this.responseText);
      console.log(info);
      if (info.error != 1) {
        // First, format the date to be displayed
        var parts = date.split("-");
        const day = parseInt(parts[2], 10);
        const month = parseInt(parts[1], 10);
        const year = parseInt(parts[0], 10);
        const formattedDate = "" + month + "/" + day + "/" + year;

        // if the day is unavailable ("closed"), display a special message to the user
        if (info.dayUnavailable == 1) {
          document.getElementById("closed_container").style.display = "flex";
          document.getElementById("available_times_container").style.visibility = "hidden";
          document.getElementById("closed_date").innerHTML = formattedDate;

          return false;
        } else {
          document.getElementById("closed_container").style.display = "none";
          document.getElementById("available_times_container").style.visibility = "visible";
        }

        // get reference to container in which to display buttons
        const timesContainer = document.getElementById("display_available_container");
        timesContainer.innerHTML = "";
        var i = 0
        // for each possible time
        for (i = 0; i < info.times.length; i++) {
          // format the start and end time
          var appStart = info.times[i][0];
          var startSuffix = "am";
          var appEnd = info.times[i][1];
          var endSuffix = "am";

          var timeParts = appStart.split(":");
          var startHour = parseInt(timeParts[0], 10);
          var startMin = parseInt(timeParts[1], 10);

          if (startHour >= 12) {
            startHour -= 12;
            startSuffix = "pm";
          }
          if (startHour == 0) {
            startHour = 12;
          }

          timeParts = appEnd.split(":");
          var endHour = parseInt(timeParts[0], 10);
          var endMin = parseInt(timeParts[1], 10);

          if (endHour >= 12) {
            endHour -= 12;
            endSuffix = "pm";
          }
          if (endHour == 0) {
            endHour = 12;
          }

          startHour = startHour.toString();
          startMin = startMin.toString().padStart(2, "0");
          endHour = endHour.toString();
          endMin = endMin.toString().padStart(2, "0");

          // construct a new button for this time that the user can select
          timesContainer.innerHTML += `<div class="col" style="width:30%"><button type="button" id="timeSlot-${i}" class="btn btn-info appointment-time" onclick="confirmAppointment(${i})" style="width:100%;">${startHour}:${startMin}${startSuffix} - ${endHour}:${endMin}${endSuffix}</button></div>`;
          // after every three columns, break to a new line with this DOM element
          if ((i+1) % 3 == 0){
            timesContainer.innerHTML +=`
						<div class="w-100"></div>`;
          }

          // store the information for this time in the display_available_container element
          $("#display_available_container").data("start" + i, info.times[i][0]);
          $("#display_available_container").data("end" + i, info.times[i][1]);
          $("#display_available_container").data("startFormatted" + i, "" + startHour + ":" + startMin + "" + startSuffix);
          $("#display_available_container").data("endFormatted" + i, "" + endHour + ":" + endMin + "" + endSuffix);
          $("#display_available_container").data("dateFormatted" + i, formattedDate);
          $("#display_available_container").data("date" + i, date);
        }
        // ensure formatting is correct by adding any (empty) columns to result in a multiple of three columns
        while ((i + 1) % 3 != 1) {
          timesContainer.innerHTML +=`
          <div class="col" style="hidden"></div>`;
          i++;
        }
        // add all the HTML
        document.getElementById("number-available").innerHTML = info.times.length;
        // return false to stay on the page without refreshing
        return false;

      } else {
        // alert the user if anything went wrong
        alert("Unknown server-side error (fetching appointment durations).");
      }
    }
  }
  xmlhttp.open("POST", "../../Backend/scheduling.php", true);
  xmlhttp.setRequestHeader("Content-type", 'application/json; charset=UTF-8');
  xmlhttp.send(message);
  return false;
}

/*
 *   Function: confirmAppointment
 *   Pages: schedule-appointment.html, reschedule-appointment.html
 *   Pre-Conditions:
 *        * The user has selected the button indicating they want to confirm an appointment for entryID
 *   Post-conditions:
 *        * Formats the confirmation modal and displays it to the user
 */
function confirmAppointment(entryID) {
  // retrieve data from JQuery and display in modal
  document.getElementById("confirmation_date").innerHTML = $("#display_available_container").data("dateFormatted" + entryID);
  document.getElementById("confirmation_start").innerHTML = $("#display_available_container").data("startFormatted" + entryID);
  document.getElementById("confirmation_end").innerHTML = $("#display_available_container").data("endFormatted" + entryID);
  $("#display_available_container").data("entryChosen", entryID);
  // display the modal itself
  $('#confirmation_modal').modal('show');
}

/*
 *   Function: appointmentConfirmed
 *   Pages: schedule-appointment.html, reschedule-appointment.html
 *   Pre-Conditions:
 *        * The user has selected the button confirming an appointment for entryID
 *   Post-conditions:
 *        * Stores the appointment time in the database
 *        * Notifies the user whether the action was successful
 */
function appointmentConfirmed() {
  // setting up arguments
  const entryID = $("#display_available_container").data("entryChosen");
  var date = $("#display_available_container").data("date" + entryID);
  var startTime = $("#display_available_container").data("start" + entryID);
  var endTime =  $("#display_available_container").data("end" + entryID);
  startTime += ":00";
  endTime += ":00";

  // construct HTTPRequest message
  message = `{"foo":"schedule_appointment", "date":"${date}", "start":"${startTime}", "end":"${endTime}"}`;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {

        var info = JSON.parse(this.responseText);
        // if no cookie storing the appointment_id could be found, display an error message
        // and redirect to book-appointment
        if (info.no_app_id == 1) {

          window.location.href ="book-appointment.html";
          alert("Somehow we don't have your booking information!");
        }
        else if(info.success == 1) {
          // otherwise, notify the user if the action was successful and redirect to homepage.html
          window.location.href ="homepage.html";
          alert("Your appointment has been booked! Your appointment ID is: " + info.apptId);
        }
        else {
          alert("Unknown server-side error.");

        }
      }
    }
    xmlhttp.open("POST", "../../Backend/scheduling.php", true);
    xmlhttp.setRequestHeader("Content-type", 'application/json; charset=UTF-8');
    xmlhttp.send(message);

}


// --------------------- ALWAYS EXECUTES ON LOAD ---------------------
// Purpose: enforce data input field constraints such as the max and min date for the
//          date input field
//          Also calls fillDurationDropdown()
var today = new Date();
var tomorrow = new Date();
var yearaway = new Date();
tomorrow.setDate(today.getDate() + 1);
yearaway.setDate(today.getDate() + 365);
var dd = String(tomorrow.getDate()).padStart(2, '0');
var mm = String(tomorrow.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = tomorrow.getFullYear();
tomorrow = yyyy + '-' + mm + '-' + dd;

var dd2 = String(yearaway.getDate()).padStart(2, '0');
var mm2 = String(yearaway.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy2 = yearaway.getFullYear();
yearaway = yyyy2 + '-' + mm2 + '-' + dd2;

// set min and max dates
document.appt_request_form.date.setAttribute("min", tomorrow);
document.appt_request_form.date.setAttribute("max", yearaway);
fillDurationDropdown("duration_dropdown");
// -------------------------------------------------------------------

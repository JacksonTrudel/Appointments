/*
 *   change-information.js
 *
 *   Author:               Jackson Trudel
 *   Attached to pages:    search-appointment.html, change-info.php, reschedule-appointment.html
 *   Purpose:               - define 7 functions handling changes in appointment times and Information
 *                             as well as cancellations. Does not handle the initial input of appointment
 *                             information.
 */

/*
 *   Function: changeAppointmentInformation
 *   Pages: change-info.php
 *   Pre-Conditions:
 *        * User is changing information for a pre-existing appointment
 *        * all parameters are valid and nonempty
 *        * input: appointment information [first_name - String, last_name - String, phone - numerical 10 digit String, email - String, subject - String, notes - String] of user
 *   Post-conditions:
 *        * Makes HTTPRequest to appointment_info.php to store changed appointment information
 *        * If successful, page is redirected to search-appointment.html
 *        * If unsuccessful, an error message appears
 */
function changeAppointmentInformation(first_name, last_name, phone, email, subject, notes) {
  // retrieve the appointment ID from the hidden input field
  appt_id = document.appt_info_form.appt_id.value;

  // construct message to appointment_info.php
  message = `{"foo":"change_appt_info", "appt_id":${appt_id}, "first":"${first_name}","last":"${last_name}", "phone":"${phone}", "email":"${email}", "subject":"${subject}", "notes":"${notes}"}`;

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

      var info = JSON.parse(this.responseText);
      // if successful, remind the user of their appointment ID and redirect to search-appointment.html
      if (info.error != 1) {
        alert("Successfully updated your appointment information! Your appointment ID is still: " + appt_id + ".");
        window.location.href ="../Frontend/HTML/search-appointment.html";
      }
      else {
        // if unsuccessful, alert the user
        alert("Unknown server-side error.");
      }
    }
  }
  xmlhttp.open("POST", "../Backend/appointment_info.php", true);
  xmlhttp.setRequestHeader("Content-type", 'application/json; charset=UTF-8');
  xmlhttp.send(message);
}

/*
 *   Function: closeCancellationModal
 *   Pages: search-appointment.html
 *   Pre-Conditions:
 *        * The confirm cancellation modal is open
 *   Post-conditions:
 *        * resets the text in the confirm cancellation modal
 *        * Hides the confirm cancellation modal and reloads the search by calling searchAppointment()
 */
function closeCancellationModal() {
    document.getElementById("modal_body_text").innerHTML = "Press the confirm button to cancel this appointment.";
    document.getElementById("cancel_appt_modal").style.display = "none";

    searchAppointment();
}

/*
 *   Function: onCancelAppointment
 *   Pages: search-appointment.html
 *   Pre-Conditions: <none>
 *   Post-conditions:
 *        * Displays the confirm cancellation modal
 */
function onCancelAppointment() {
  document.getElementById("cancel_appt_modal").style.display = "flex";
}

/*
 *   Function: reloadSearchAppointment
 *   Pages: search-appointment.html
 *   Pre-Conditions: <none>
 *   Post-conditions:
 *        * Reloads the page
 */ /*
function reloadSearchAppointment() {
  window.location.href = "search-appointment.html";
}*/

/*
 *   Function: cancelChangeInfo
 *   Pages: change-info.php
 *   Pre-Conditions: <none>
 *   Post-conditions:
 *        * Redirects the user to search-appointment.html
 */
function cancelChangeInfo() {
  window.location.href = "../Frontend/HTML/search-appointment.html";
}

/*
 *   Function: cancelChangeInfo
 *   Pages: search-appointment.html
 *   Pre-Conditions:
 *        * The appointment ID is stored in the input field with ID appt_id_cancel_appt
 *   Post-conditions:
 *        * Redirects the user to search-appointment.html
 */
function confirmCancellation() {
  // retrieve the appointment ID
  const appt_id = document.confirm_cancellation.appt_id_cancel_appt.value;

  // construct the input message
  message = `{"foo":"cancel_appointment", "appt_id":${appt_id}}`;

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

      var info = JSON.parse(this.responseText);

      if (info.error != 1) {
        // change interface to indicate appointment has been cancelled
        document.getElementById("modal_body_text").innerHTML = "Your appointment has been cancelled!";
        document.getElementById("modal_body_text").style.color = "red";
        document.getElementById("confirm_cancellation_button").style.display ="none";
        document.getElementById("appt_canceled").value = 1;
      }
      else {
        // notify the user something went wrong if necessary
        alert("Unknown server-side error.");
      }
    }
  }
  xmlhttp.open("POST", "../../Backend/appointment_info.php", true);
  xmlhttp.setRequestHeader("Content-type", 'application/json; charset=UTF-8');
  xmlhttp.send(message);
}

/*
 *   Function: changeAppointmentTime
 *   Pages: search-appointment.html
 *   Pre-Conditions:
 *        * The appointment ID is stored in an input field with ID appt_id_change_time
 *   Post-conditions:
 *        * Stores a cookie containing the appointment ID of the currently searched appointments
 *        * If successful, redirects to reschedule-appointment.html, otherwise it notifies the user
 */
function changeAppointmentTime() {
  // retrieve the appointment ID
  var appt_id = document.getElementById("appt_id_change_time").value;

  // construct input message
  message = `{"foo":"store_appt_id_change_time", "appt_id":${appt_id}}`;

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

      var info = JSON.parse(this.responseText);

      // If successful, redirect to reschedule-appointment.html, else notify the user
      if (info.error != 1) {
        window.location.href ="reschedule-appointment.html";
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

/*
 *   Function: rescheduleConfirmed
 *   Pages: reschedule-appointment.html
 *   Pre-Conditions:
 *        * The user has pressed the confirmation button to change the appointment timeout
 *        * The date, start time, and end time can be retrived using JQuery to access the data
 *           attached to display_available_container:
 *                > entryID = $("#display_available_container").data("entryChosen")
 *                > date = $("#display_available_container").data("date" + entryID)
 *                > startTime = $("#display_available_container").data("start" + entryID)
 *                > endTime =  $("#display_available_container").data("end" + entryID)
 *   Post-conditions:
 *        * Reschedules the appointment for the desired appointment time
 *        * Notifies the user if the action was successful or not
 */
function rescheduleConfirmed() {
  // setting up arguments
  const entryID = $("#display_available_container").data("entryChosen");
  var date = $("#display_available_container").data("date" + entryID);
  var startTime = $("#display_available_container").data("start" + entryID);
  var endTime =  $("#display_available_container").data("end" + entryID);
  startTime += ":00";
  endTime += ":00";

  // set up message
  var message = `{"foo":"reschedule_appointment", "date":"${date}", "start":"${startTime}", "end":"${endTime}"}`;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {

        var info = JSON.parse(this.responseText);
        console.log(info);
        // ---- TEST TOMORROW, should be removed:
        if (info.no_app_id == 1) {

          window.location.href ="book-appointment.html";
          alert("Somehow we don't have your booking information!");
        }
        // ----
        // Notify the user if their appointment was successful
        else if(info.success == 1) {
          window.location.href ="search-appointment.html";
          alert("Your appointment has been rescheduled! Your appointment ID is still: " + info.apptId);
        }
        // the user did not go through search-appointment.html 
        else {
          window.location.href ="search-appointment.html";
          alert("Invalid operation - you must access this page through search-appointment.html");
        }
      }
    }
    xmlhttp.open("POST", "../../Backend/scheduling.php", true);
    xmlhttp.setRequestHeader("Content-type", 'application/json; charset=UTF-8');
    xmlhttp.send(message);
}

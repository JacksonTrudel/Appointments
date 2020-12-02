/*
 *   booking.js
 *
 *   Author:               Jackson Trudel
 *   Attached to pages:    book-appointment.html, change-info.php
 *   Purpose:               - attach eventListeners to two input fields with IDs 'phone' and 'email'
 *                          - define 1 function: storeAppointmentInformation
 */


// --------------------- ALWAYS EXECUTES ON LOAD ---------------------
// add email and phone event listeners
const email = document.appt_info_form.email;
email.addEventListener("input", emailListener);

const inputElement = document.getElementById('phone');
inputElement.addEventListener('keydown', filterKeys);
inputElement.addEventListener('keyup', formatPhoneNumber);
// -------------------------------------------------------------------


// ---------------------- EXECUTES WHEN CALLED -----------------------
/*
 *   Function: storeAppointmentInformation
 *   Pages: book-appointment.html
 *   Pre-Conditions:
 *        * User is booking a new appointment
 *        * all parameters are valid and nonempty
 *        * input: appointment information [first_name - String, last_name - String, phone - numerical 10 digit String, email - String, subject - String, notes - String] of user
 *   Post-conditions:
 *        * Makes HTTPRequest to appointment_info.php to store new appointment information
 *        * a cookie containing the appointment ID is stored client-side
 *        * If successful, page is redirected to schedule-appointment.html
 *        * If unsuccessful, an error message appears
 */
function storeAppointmentInformation(first_name, last_name, phone, email, subject, notes) {
  message = `{"foo":"store_appt_info", "first":"${first_name}","last":"${last_name}", "phone":"${phone}", "email":"${email}", "subject":"${subject}", "notes":"${notes}"}`;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

      var info = JSON.parse(this.responseText);
      console.log(info);
      if (info.error != 1) {
        window.location.href ="schedule-appointment.html";
      }
      else {
        alert("Unknown server-side error.");
      }
    }
  }
  xmlhttp.open("POST", "../../Backend/appointment_info.php", true);
  xmlhttp.setRequestHeader("Content-type", 'application/json; charset=UTF-8');
  xmlhttp.send(message);
}
// -------------------------------------------------------------------

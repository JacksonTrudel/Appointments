/*
 *   search-appointment.js
 *
 *   Author:               Jackson Trudel
 *   Attached to pages:    search-appointment.html
 *   Purpose:               - defines searchAppointment, which retrieves and displays the information
 *                            for the appointment with the appointment ID and last name entered
 */

 /*
  *   Function: searchAppointment
  *   Pages: search-appointment.html
  *   Pre-Conditions:
  *        * The ID is stored in an input field with id: "appt_id"
  *        * The last name is stored in an input field with id: "last_name"
  *   Post-conditions:
  *        * Retrieves information of the appointment if there is one with
  *            (last name = <last_name> and appointment ID = <appt_id>)
  *        * Displays the three buttons to edit/change_time/cancel if the appointments
  *              is not within 48 hours.
  */
function searchAppointment() {
  var last_name = document.getElementById("last_name").value;
  var appt_id = document.getElementById("appt_id").value;
  if (!validateLastName(last_name) || !validateApptId(appt_id))
    return false;
  $("#appointment_info").data("appt_id", appt_id);
  // prepare input
  appt_id = parseInt(appt_id);
  message = `{"foo":"search_appointment", "last_name":"${last_name}", "appt_id":${appt_id}}`;

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

      var info = JSON.parse(this.responseText);
      console.log(info);
      if (info.error != 1) {
        // if not found, the appointment information is not correct
        if (info.notFound == 1) {
          document.getElementById("not_found").style.display = "flex";
          document.getElementById("appointment_info").style.display = "none";
        }
        // if found:
        else {
          // display the appointment information, hide not_found prompt
          document.getElementById("not_found").style.display = "none";
          document.getElementById("appointment_info").style.display = "flex";


          if (info.withinFortyEight || info.cancelled == 1) {
            // hide user_menu and show red prompt
            document.getElementById("user_menu").style.display = "none";
            document.getElementById("forty_eight_hour_prompt").style.display = "flex";

            // set the red prompt text appropriately
            if (info.cancelled == 1)
              document.getElementById("warning_text").innerHTML = "THIS APPOINTMENT HAS BEEN CANCELLED.";
            else
              document.getElementById("warning_text").innerHTML = "You cannot edit/cancel appointments within 48 hours of the appointment time.";

          }
          // if not cancelled or within 48 hours:
          else {
            // display user_menu and hide prompt
            document.getElementById("user_menu").style.display = "flex";
            document.getElementById("forty_eight_hour_prompt").style.display = "none";

            // set the appt_id in various hidden inputs
            document.getElementById("appt_id_change_info").value = appt_id;
            document.getElementById("appt_id_change_time").value = appt_id;
            document.getElementById("appt_id_cancel_appt").value = appt_id;
          }

          // format date, time, and phone number fields
          var phone_formatted = "(" + info.phone.substring(0, 3) + ") " + info.phone.substring(3, 6) + " - " + info.phone.substring(6);
          var date_formmated = info.date.substring(5, 7) + "/" + info.date.substring(8) + "/" + info.date.substring(0, 4);

          var appStart = info.start;
          var startSuffix = "am";
          var appEnd = info.end;
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
          appStart = "" + startHour + ":" + startMin + "" + startSuffix;
          appEnd = "" + endHour + ":" + endMin + "" + endSuffix;

          // display fields
          document.getElementById("info_name").innerHTML = "" + info.first + " " + info.last;
          document.getElementById("info_phone").innerHTML = phone_formatted;
          document.getElementById("info_email").innerHTML = info.email;
          document.getElementById("info_date").innerHTML = date_formmated;
          document.getElementById("info_start").innerHTML = appStart;
          document.getElementById("info_end").innerHTML = appEnd;
          document.getElementById("info_subject").innerHTML = info.subject;
          document.getElementById("info_notes").innerHTML = info.notes;

          // store data in hidden inputs
          document.getElementById("change_first").value = info.first;
          document.getElementById("change_last").value = info.last;
          document.getElementById("change_phone").value = phone_formatted;
          document.getElementById("change_email").value = info.email;
          document.getElementById("change_subject").value = info.subject;
          document.getElementById("change_notes").value = info.notes;
        }

      }
    }
  }
  xmlhttp.open("POST", "../../Backend/search_appointment.php", true);
  xmlhttp.setRequestHeader("Content-type", 'application/json; charset=UTF-8');
  xmlhttp.send(message);

  // return false so we don't reload page
  return false;
}

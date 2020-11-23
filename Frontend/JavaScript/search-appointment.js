function searchAppointment() {
  var last_name = document.getElementById("last_name").value;
  var appt_id = document.getElementById("appt_id").value;
  if (!validateLastName(last_name) || !validateApptId(appt_id))
    return false;

  // prepare input
  appt_id = parseInt(appt_id);
  message = `{"foo":"search_appointment", "last_name":"${last_name}", "appt_id":${appt_id}}`;

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

      var info = JSON.parse(this.responseText);
      console.log(info);
      if (info.error != 1) {
        if (info.notFound == 1) {
          document.getElementById("not_found").style.display ="flex";
          document.getElementById("appointment_info").style.display ="none";
        }
        else {
            document.getElementById("not_found").style.display ="none";
            document.getElementById("appointment_info").style.display ="flex";

            // format fields
            var phone_formatted = "(" + info.phone.substring(0,3) + ") " + info.phone.substring(3,6) + "-" + info.phone.substring(6);
            var date_formmated = info.date.substring(5,7) + "/" + info.date.substring(8) + "/" + info.date.substring(0,4);

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

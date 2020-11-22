function fillDurationDropdown(id) {
  message = `{"foo":"get_durations"}`;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

      var info = JSON.parse(this.responseText);
      console.log(info);
      if (info.error != 1) {
        const elem = document.getElementById(id);

        for (var i = 0; i < info.duration.length; i++) {
          elem.innerHTML += `<option value="${info.duration[i]}">${info.duration[i]} minutes</option>`;
        }
      } else {
        alert("Unknown server-side error (fetching appointment durations).");
      }
    }
  }
  xmlhttp.open("POST", "../../Backend/scheduling.php", true);
  xmlhttp.setRequestHeader("Content-type", 'application/json; charset=UTF-8');
  xmlhttp.send(message);
}

function isValidDate(dateString) {

  // Parse the date parts to integers
  var parts = dateString.split("-");
  var day = parseInt(parts[2], 10);
  var month = parseInt(parts[1], 10);
  var year = parseInt(parts[0], 10);

  // Check the ranges of month and year
  if (year < 1000 || year > 3000 || month < 1 || month > 12)
    return false;

  var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // Adjust for leap years
  if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
    monthLength[1] = 29;

  // Check the range of the day
  return day > 0 && day <= monthLength[month - 1];
}

function passesValidation(date, duration) {
  if (!isValidDate(date)) {
    alert("Please input a valid date.");
    document.appt_request_form.date.focus();
    return false;
  }
  if (duration == -1) {
    alert("Please select a duration.");
    document.appt_request_form.duration_dropdown.focus();
    return false;
  }

  return true;
}

function searchForAppointments() {
  const date = document.appt_request_form.date.value;
  const duration = document.appt_request_form.duration_dropdown.value;
  if (!passesValidation(date, duration)) {
    return false;
  }

  message = `{"foo":"get_available_appointments", "date":"${date}", "duration":"${duration}"}`;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

      var info = JSON.parse(this.responseText);
      console.log(info);
      if (info.error != 1) {
        var parts = date.split("-");
        const day = parseInt(parts[2], 10);
        const month = parseInt(parts[1], 10);
        const year = parseInt(parts[0], 10);
        const formattedDate = "" + month + "/" + day + "/" + year;

        if (info.dayUnavailable == 1) {
          document.getElementById("closed_container").style.display = "flex";
          document.getElementById("available_times_container").style.visibility = "hidden";
          document.getElementById("closed_date").innerHTML = formattedDate;
          // only display "CLOSED" text
          return false;
        } else {
          document.getElementById("closed_container").style.display = "none";
          document.getElementById("available_times_container").style.visibility = "visible";
        }

        const timesContainer = document.getElementById("display_available_container");
        timesContainer.innerHTML = "";
        for (var i = 0; i < info.times.length; i++) {
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
            startHour = 1;
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


          timesContainer.innerHTML += `<button type="button" id="timeSlot-${i}" class="btn btn-info appointment-time" style="flex-basis: 30%;" onclick="confirmAppointment(${i})">${startHour}:${startMin}${startSuffix} - ${endHour}:${endMin}${endSuffix}</button>`;
          $("#display_available_container").data("start" + i, info.times[i][0]);
          $("#display_available_container").data("end" + i, info.times[i][1]);
          $("#display_available_container").data("startFormatted" + i, "" + startHour + ":" + startMin + "" + startSuffix);
          $("#display_available_container").data("endFormatted" + i, "" + endHour + ":" + endMin + "" + endSuffix);
          $("#display_available_container").data("dateFormatted" + i, formattedDate);
          $("#display_available_container").data("date" + i, date);
        }
        document.getElementById("number-available").innerHTML = info.times.length;
        return false;

      } else {
        alert("Unknown server-side error (fetching appointment durations).");
      }
    }
  }
  xmlhttp.open("POST", "../../Backend/scheduling.php", true);
  xmlhttp.setRequestHeader("Content-type", 'application/json; charset=UTF-8');
  xmlhttp.send(message);
  return false;
}

function confirmAppointment(entryID) {
  document.getElementById("confirmation_date").innerHTML = $("#display_available_container").data("dateFormatted" + entryID);
  document.getElementById("confirmation_start").innerHTML = $("#display_available_container").data("startFormatted" + entryID);
  document.getElementById("confirmation_end").innerHTML = $("#display_available_container").data("endFormatted" + entryID);
  $("#display_available_container").data("entryChosen", entryID);
  $('#confirmation_modal').modal('show');
}

function appointmentConfirmed() {
  // setting up arguments
  const entryID = $("#display_available_container").data("entryChosen");
  var date = $("#display_available_container").data("date" + entryID);
  var startTime = $("#display_available_container").data("start" + entryID);
  var endTime =  $("#display_available_container").data("end" + entryID);
  startTime += ":00";
  endTime += ":00";

  message = `{"foo":"schedule_appointment", "date":"${date}", "start":"${startTime}", "end":"${endTime}"}`;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {

        var info = JSON.parse(this.responseText);
        console.log(info);
        if (info.no_app_id == 1) {

          window.location.href ="book-appointment.html";
          alert("Somehow we don't have your booking information!");
        }
      }
    }
    xmlhttp.open("POST", "../../Backend/scheduling.php", true);
    xmlhttp.setRequestHeader("Content-type", 'application/json; charset=UTF-8');
    xmlhttp.send(message);

}

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

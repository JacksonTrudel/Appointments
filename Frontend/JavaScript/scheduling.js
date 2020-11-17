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
  return false;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

      var info = JSON.parse(this.responseText);
      console.log(info);
      if (info.error != 1) {
        

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

var today = new Date();
var tomorrow = new Date();
var yearaway = new Date();
tomorrow.setDate(today.getDate()+1);
yearaway.setDate(today.getDate()+365);
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

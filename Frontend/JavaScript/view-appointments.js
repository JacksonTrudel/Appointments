function confirmCancellation() {
  const appt_id = document.confirm_cancellation.appt_id_cancel_appt.value;
  message = `{"foo":"cancel_appointment", "appt_id":${appt_id}}`;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

      var info = JSON.parse(this.responseText);
      console.log(info);
      if (info.error != 1) {
        // change interface to indicate appointment has been cancelled
        document.getElementById("modal_body_text").innerHTML = "This appointment has been cancelled!";
        document.getElementById("modal_body_text").style.color = "red";
        document.getElementById("confirm_cancellation_button").style.display ="none";
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

function displayHourly(date) {
  // input is valid, query for appointments and display them
  message = `{"foo":"view_appointments", "format":"h", "date":"${date}"}`;

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

      var info = JSON.parse(this.responseText);
      console.log(info);
      if (info.error != 1) {
        // No appontment in this time period, make notification visible
        if (info.day.length == 0) {
          document.getElementById("not_found").style.display = "flex";
          document.getElementById("hour_container").style.display = "none";
          document.getElementById("day_container").style.display = "none";
          document.getElementById("week_container").style.display = "none";
        } else {
          document.getElementById("not_found").style.display = "none";
          document.getElementById("hour_container").style.display = "block";
          document.getElementById("day_container").style.display = "none";
          document.getElementById("week_container").style.display = "none";
          var hourBody = document.getElementById("hour_body");
          var htmlToAdd = "";

          var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
          var monthsOfYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
          var dayIdx = 0;
          while (dayIdx < info.day.length) {
            var apptIdx = 0;
            var day = parseInt(info.day[dayIdx].date.substring(8));
            var dayOfWeek = daysOfWeek[parseInt(info.day[dayIdx].dayOfWeek) - 1];
            var month = parseInt(info.day[dayIdx].date.substring(5, 7)) - 1;
            var year = info.day[dayIdx].date.substring(0, 4);

            htmlToAdd += `
    						<h4  style="margin-top:40px;"><span>${dayOfWeek} - ${month}/${day}/${year}</span></h4>`;
            var prevHour = 0;
            while (apptIdx < info.day[dayIdx].appointment.length) {

              const name = "" + info.day[dayIdx].appointment[apptIdx].first + " " + info.day[dayIdx].appointment[apptIdx].last;
              var phoneNotFormatted = info.day[dayIdx].appointment[apptIdx].phone;
              const phone = "(" + phoneNotFormatted.substring(0, 3) + ") " + phoneNotFormatted.substring(3, 6) + " - " + phoneNotFormatted.substring(6);
              const startTime = formatTime(info.day[dayIdx].appointment[apptIdx].start);
              const endTime = formatTime(info.day[dayIdx].appointment[apptIdx].end);

              var timeParts = info.day[dayIdx].appointment[apptIdx].start.split(":");
              if (prevHour != parseInt(timeParts[0], 10)){
                  var hour = parseInt(timeParts[0], 10);
                  prevHour = hour;
                  var suffix = "am";

                  if (hour >= 12) {
                    hour -= 12;
                    suffix = "pm";
                  }
                  if (hour == 0) {
                    hour = 12;
                  }
                  hour = hour.toString();
              htmlToAdd +=
                  `<h6  style="margin-top:30px;"><span>${hour}:00 ${suffix}</span></h6>`;
              }
              htmlToAdd += `
            <div class="card" id="appointment_display_card" style="width: 75%; margin: 15px auto;">
              <div class="card-body">
                <div class="row">
                  <div class="col">
                    <p style="white-space:nowrap;"><strong>Name:</strong> <span id="hourly_name">${name}</span></p>
                  </div>
      						<div class="w-100"></div>
                  <div class="col">
                    <p style="white-space:nowrap;"><strong>Phone:</strong> <span id="hourly_phone">${phone}</span></p>
                  </div>
                  <div class="col">
                    <p style="white-space:nowrap;"><strong>Start time:</strong> <span id="hourly_start">${startTime}</span></p>
                  </div>
      						<div class="w-100"></div>
                  <div class="col">
                    <p style="white-space:nowrap;"><strong>Email:</strong> <span id="hourly_email">${info.day[dayIdx].appointment[apptIdx].email}</span></p>
                  </div>
                  <div class="col">
                    <p style="white-space:nowrap;"><strong>End time:</strong> <span id="hourly_end">${endTime}</span></p>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <p><strong>Subject:</strong> <span id="daily_subject">${info.day[dayIdx].appointment[apptIdx].subject}</span></p>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <p><strong>Notes:</strong> <span id="daily_notes">${info.day[dayIdx].appointment[apptIdx].notes}</span></p>
                  </div>
                </div>
                <hr>`;
              // either add cancel menu or prompt stating within 48 hours
              const appt_id = parseInt(info.day[dayIdx].appointment[apptIdx].id);
            if (info.day[dayIdx].appointment[apptIdx].withinFortyEight) {
              htmlToAdd +=`<div class="container" id="forty_eight_hour_prompt_${appt_id}" style="display:flex; justify-content:center">
                <p style="color:red;">
                  You cannot cancel appointments within 48 hours of the appointment time.
                </p>
              </div>`;
              } else {
                htmlToAdd += `<div class="row" id="owner_menu_${appt_id}" style="display:flex; justify-content:center;">
                  <button type="button" class="btn btn-danger" onclick="ownerCancelAppointment(${appt_id})">Cancel Appointment</button>
                </div>`;
              }
              htmlToAdd += `</div>
            </div>`;
              apptIdx++;
            }
            dayIdx++;
          }
            hourBody.innerHTML =htmlToAdd;


        }
      }
    }
  }
  xmlhttp.open("POST", "../../Backend/search_appointment.php", true);
  xmlhttp.setRequestHeader("Content-type", 'application/json; charset=UTF-8');
  xmlhttp.send(message);
}

function displayDaily(date) {
  // input is valid, query for appointments and display them
  message = `{"foo":"view_appointments", "format":"d", "date":"${date}"}`;

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

      var info = JSON.parse(this.responseText);
      console.log(info);
      if (info.error != 1) {
        // No appontment in this time period, make notification visible
        if (info.day.length == 0) {
          document.getElementById("not_found").style.display = "flex";
          document.getElementById("hour_container").style.display = "none";
          document.getElementById("day_container").style.display = "none";
          document.getElementById("week_container").style.display = "none";
        } else {
          document.getElementById("not_found").style.display = "none";
          document.getElementById("hour_container").style.display = "none";
          document.getElementById("day_container").style.display = "block";
          document.getElementById("week_container").style.display = "none";
          var dailyBody = document.getElementById("daily_body");
          var htmlToAdd = "";

          var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
          var monthsOfYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
          var dayIdx = 0;
          while (dayIdx < info.day.length) {
            var apptIdx = 0;
            var day = parseInt(info.day[dayIdx].date.substring(8));
            var dayOfWeek = daysOfWeek[parseInt(info.day[dayIdx].dayOfWeek) - 1];
            var month = monthsOfYear[parseInt(info.day[dayIdx].date.substring(5, 7)) - 1];
            var year = info.day[dayIdx].date.substring(0, 4);

            htmlToAdd += `<tr>
        <td class="agenda-date" class="active" rowspan="${info.day[dayIdx].appointment.length}">
          <div class="dayofmonth">${day}</div>
          <div class="dayofweek">${dayOfWeek}</div>
          <div class="shortdate text-muted">${month}, ${year}</div>
        </td>`;
            while (apptIdx < info.day[dayIdx].appointment.length) {
              const name = "" + info.day[dayIdx].appointment[apptIdx].first + " " + info.day[dayIdx].appointment[apptIdx].last;
              var phoneNotFormatted = info.day[dayIdx].appointment[apptIdx].phone;
              const phone = "(" + phoneNotFormatted.substring(0, 3) + ") " + phoneNotFormatted.substring(3, 6) + " - " + phoneNotFormatted.substring(6);
              const startTime = formatTime(info.day[dayIdx].appointment[apptIdx].start);
              const endTime = formatTime(info.day[dayIdx].appointment[apptIdx].end);
              const time = "<p>" + startTime + "-" + endTime + "<\p>";

              if (apptIdx > 0) {
                htmlToAdd += `</tr><tr>`;
              }
              htmlToAdd += `
          <td class="agenda-time">
            ${time}
          </td>
          <td>
            <div class="card" id="appointment_display_card" style="width: 100%; border:none;">
              <div class="card-body">
                <div class="row">
                  <div class="col">
                    <p style="white-space:nowrap;"><strong>Name:</strong> <span id="daily_name">${name}</span></p>
                  </div>
                  <div class="w-100"></div>
                  <div class="col">
                    <p style="white-space:nowrap;"><strong>Phone:</strong> <span id="daily_phone">${phone}</span></p>
                  </div>
                  <div class="col">
                    <p style="white-space:nowrap;"><strong>Email:</strong> <span id="daily_email">${info.day[dayIdx].appointment[apptIdx].email}</span></p>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <p><strong>Subject:</strong> <span id="daily_subject">${info.day[dayIdx].appointment[apptIdx].subject}</span></p>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <p><strong>Notes:</strong> <span id="daily_notes">${info.day[dayIdx].appointment[apptIdx].notes}</span></p>
                  </div>
                </div>
                <hr>`;
              // either add cancel menu or prompt stating within 48 hours
            if (info.day[dayIdx].appointment[apptIdx].withinFortyEight) {
              htmlToAdd +=`<div class="container" id="forty_eight_hour_prompt_${parseInt(info.day[dayIdx].appointment[apptIdx].id)}" style="display:flex; justify-content:center">
                <p style="color:red;">
                  You cannot cancel appointments within 48 hours of the appointment time.
                </p>
              </div>`;
              } else {
                htmlToAdd += `<div class="row" id="owner_menu_${parseInt(info.day[dayIdx].appointment[apptIdx].id)}" style="display:flex; justify-content:center;">
                  <button type="button" class="btn btn-danger" onclick="ownerCancelAppointment(${parseInt(info.day[dayIdx].appointment[apptIdx].id)})">Cancel Appointment</button>
                </div>`;
              }
              htmlToAdd += `</div>
            </div>
          </td>
        </tr>`;
              apptIdx++;
            }
            dayIdx++;
          }
            dailyBody.innerHTML =htmlToAdd;
        }
      }
    }
  }
  xmlhttp.open("POST", "../../Backend/search_appointment.php", true);
  xmlhttp.setRequestHeader("Content-type", 'application/json; charset=UTF-8');
  xmlhttp.send(message);
}

function displayWeekly(date) {
  // input is valid, query for appointments and display them
  message = `{"foo":"view_appointments_weekly", "format":"w", "date":"${date}"}`;

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

      var info = JSON.parse(this.responseText);
      console.log(info);
      if (info.error != 1) {
        // No appontment in this time period, make notification visible
        var none = 1;

        for (var q = 0; q < 10; q++){
          if (info.week[q].day.length != 0)
            none = 0;
        }
        if (none != 0) {
          document.getElementById("not_found").style.display = "flex";
          document.getElementById("hour_container").style.display = "none";
          document.getElementById("day_container").style.display = "none";
          document.getElementById("week_container").style.display = "none";
        } else {
          document.getElementById("not_found").style.display = "none";
          document.getElementById("hour_container").style.display = "none";
          document.getElementById("day_container").style.display = "none";
          document.getElementById("week_container").style.display = "block";
          var weeklyBody = document.getElementById("weekly_body");
          var htmlToAdd = "";

          var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
          var monthsOfYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

          // iterate through each week
          for (var weekIdx = 0; weekIdx < 10; weekIdx++) {
            var firstappt = 1;
            var startOfWeekDate = parseInt(info.week[weekIdx].startDate.substring(8));
            var endOfWeekDate = parseInt(info.week[weekIdx].endDate.substring(8));
            var startOfWeekDay = info.week[weekIdx].startDateString;
            var endOfWeekDay = info.week[weekIdx].endDateString;
            var startMonth = monthsOfYear[parseInt(info.week[weekIdx].startDate.substring(5,7)) - 1];
            var endMonth = monthsOfYear[parseInt(info.week[weekIdx].endDate.substring(5,7)) - 1];
            var startYear = parseInt(info.week[weekIdx].startDate.substring(0,4));
            var endYear = parseInt(info.week[weekIdx].endDate.substring(0,4));

            var numAppointments = 0;
            var dayIdx = 0;
            while (dayIdx < info.week[weekIdx].day.length) {
              numAppointments += info.week[weekIdx].day[dayIdx].appointment.length;
              dayIdx++;
            }
            if (numAppointments > 0){
            htmlToAdd += `<tr>
        <td class="agenda-date" class="active" rowspan="${numAppointments}">
        <div style="color: grey;">
        <div style="border: LightGray; border-style: solid; border-top:0px;  border-right:0px; border-left:0px; display:flex; justify-content: flex-end;margin:0px 0px 20px; padding:0px 0px; width:100%;" > Appointments: ${numAppointments} </div>

        </div>
          <div class="dayofmonth">${startOfWeekDate}</div>
          <div class="dayofweek">${startOfWeekDay}</div>
          <div class="shortdate text-muted">${startMonth}, ${startYear}</div>
          <div style="margin: 10px 0px; color: #495464;">
          <div style="border: #495464; border-style: solid; border-left:0px;  border-bottom:0px; display:inline-block; margin:0px 0px; padding:0px 0px; width:50px;" > start </div>
          <hr style="color:#495464; margin:0px auto; padding:0px auto;">
          </div>
            <div class="dayofmonth">${endOfWeekDate}</div>
            <div class="dayofweek">${endOfWeekDay}</div>
            <div class="shortdate text-muted">${endMonth}, ${endYear}</div>
            <div style="margin: 10px 0px; color: #495464;">
            <div style="border: #495464; border-style: solid; border-left:0px;  border-bottom:0px; display:inline-block; margin:0px 0px; padding:0px 0px; width:50px;" > end </div>
            <hr style="color: #495464; margin:0px auto; padding:0px auto;">
            </div>
        </td>`;
          }

          dayIdx = 0;
          while (dayIdx < info.week[weekIdx].day.length) {
            var apptIdx = 0;
            var day = parseInt(info.week[weekIdx].day[dayIdx].date.substring(8));
            var dayOfWeek = daysOfWeek[parseInt(info.week[weekIdx].day[dayIdx].dayOfWeek) - 1];
            var month = monthsOfYear[parseInt(info.week[weekIdx].day[dayIdx].date.substring(5, 7)) - 1];
            var year = info.week[weekIdx].day[dayIdx].date.substring(0, 4);


            htmlToAdd += `
        <td class="agenda-date" class="active" rowspan="${info.week[weekIdx].day[dayIdx].appointment.length}">
          <div class="dayofmonth">${day}</div>
          <div class="dayofweek">${dayOfWeek}</div>
          <div class="shortdate text-muted">${month}, ${year}</div>
        </td>`;
            while (apptIdx < info.week[weekIdx].day[dayIdx].appointment.length) {
              const name = "" + info.week[weekIdx].day[dayIdx].appointment[apptIdx].first + " " + info.week[weekIdx].day[dayIdx].appointment[apptIdx].last;
              var phoneNotFormatted = info.week[weekIdx].day[dayIdx].appointment[apptIdx].phone;
              const phone = "(" + phoneNotFormatted.substring(0, 3) + ") " + phoneNotFormatted.substring(3, 6) + " - " + phoneNotFormatted.substring(6);
              const startTime = formatTime(info.week[weekIdx].day[dayIdx].appointment[apptIdx].start);
              const endTime = formatTime(info.week[weekIdx].day[dayIdx].appointment[apptIdx].end);
              const time = "<p>" + startTime + "-" + endTime + "<\p>";

              if (apptIdx != 0) {
                htmlToAdd += `</tr><tr>`;

              }
              firstappt = 0;
              htmlToAdd += `
          <td class="agenda-time">
            ${time}
          </td>
          <td>
            <div class="card" id="appointment_display_card" style="width: 100%; border:none;">
              <div class="card-body">
                <div class="row">
                  <div class="col">
                    <p style="white-space:nowrap;"><strong>Name:</strong> <span id="daily_name">${name}</span></p>
                  </div>
                  <div class="col">
                    <p style="white-space:nowrap;"><strong>Phone:</strong> <span id="daily_phone">${phone}</span></p>
                  </div>
                  <div class="col">
                    <p style="white-space:nowrap;"><strong>Email:</strong> <span id="daily_email">${info.week[weekIdx].day[dayIdx].appointment[apptIdx].email}</span></p>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <p><strong>Subject:</strong> <span id="daily_subject">${info.week[weekIdx].day[dayIdx].appointment[apptIdx].subject}</span></p>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <p><strong>Notes:</strong> <span id="daily_notes">${info.week[weekIdx].day[dayIdx].appointment[apptIdx].notes}</span></p>
                  </div>
                </div>
                <hr>`;
              // either add cancel menu or prompt stating within 48 hours
            if (info.week[weekIdx].day[dayIdx].appointment[apptIdx].withinFortyEight) {
              htmlToAdd +=`<div class="container" id="forty_eight_hour_prompt_${parseInt(info.week[weekIdx].day[dayIdx].appointment[apptIdx].id)}" style="display:flex; justify-content:center">
                <p style="color:red;">
                  You cannot cancel appointments within 48 hours of the appointment time.
                </p>
              </div>`;
              } else {
                htmlToAdd += `<div class="row" id="owner_menu_${parseInt(info.week[weekIdx].day[dayIdx].appointment[apptIdx].id)}" style="display:flex; justify-content:center;">
                  <button type="button" class="btn btn-danger" onclick="ownerCancelAppointment(${parseInt(info.week[weekIdx].day[dayIdx].appointment[apptIdx].id)})">Cancel Appointment</button>
                </div>`;
              }
              htmlToAdd += `</div>
            </div>
          </td>
        </tr>`;
              apptIdx++;
            }
            dayIdx++;
          }
            weeklyBody.innerHTML =htmlToAdd;
        }
      }
      }
    }
  }
  xmlhttp.open("POST", "../../Backend/search_appointment.php", true);
  xmlhttp.setRequestHeader("Content-type", 'application/json; charset=UTF-8');
  xmlhttp.send(message);
}

function viewAppointmentsInputChange() {
  // see which format is selected
  var format;
  var vbs = document.querySelectorAll('input[name="format"]');
  for (var vb of vbs) {
    if (vb.checked) {
      format = vb.value;
      break;
    }
  }

  // adjust help text
  if (format == "h") {
    document.getElementById("dateHelp").innerHTML = "Start date; searching 5 day period.";
  } else if (format == "d") {
    document.getElementById("dateHelp").innerHTML = "Start date; searching 2 week period.";
  } else {
    document.getElementById("dateHelp").innerHTML = "Start date; searching 10 weeks.";
  }

  // get the date and validate the date input
  var date = document.getElementById("startDate").value;
  if (date == "" || !isValidDate(date)) {
    return;
  }

  if (format == "h") {
    displayHourly(date);
  } else if (format == "d") {
    displayDaily(date);
  } else {
    displayWeekly(date);
  }
}

function ownerCancelAppointment(appt_id) {
  document.getElementById("cancel_appt_modal").style.display = "flex";
  document.getElementById("appt_id_cancel_appt").value = appt_id;
}

function closeCancellationModal() {
  document.getElementById("cancel_appt_modal").style.display = "none";
  document.getElementById("modal_body_text").innerHTML = "Press the confirm button to cancel this appointment.";
  document.getElementById("modal_body_text").style.color = "black";
  document.getElementById("confirm_cancellation_button").style.display ="flex";
  viewAppointmentsInputChange();
}

/*
 *   view-appointments.js
 *
 *   Author:               Jackson Trudel
 *   Attached to pages:    view-appointments.html
 *   Purpose:               - defines 12 functions and 5 event listeners which perform the input validation and error
 *                              messaging
 */

/*
 *   Function: confirmCancellation
 *   Pages: view-appointments.html
 *   Pre-Conditions:
 *        * The appointment ID is stored in a hidden input field with name and ID appt_id_cancel_appt
 *   Post-conditions:
 *        * Makes an HTTPRequest to appointment_info.php to cancel the appointment with the specified
 *             appointment ID
 *        * Changes the modal_body_text to display "This appointment has been cancelled!"
 */
function confirmCancellation() {
  // get appt_id and construct message
  const appt_id = document.confirm_cancellation.appt_id_cancel_appt.value;
  message = `{"foo":"cancel_appointment", "appt_id":${appt_id}}`;

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

      var info = JSON.parse(this.responseText);

      if (info.error != 1) {
        // change interface to indicate appointment has been cancelled
        document.getElementById("modal_body_text").innerHTML = "This appointment has been cancelled!";
        document.getElementById("modal_body_text").style.color = "red";
        document.getElementById("confirm_cancellation_button").style.display = "none";
      } else {
        alert("Unknown server-side error.");
      }
    }
  }
  xmlhttp.open("POST", "../../Backend/appointment_info.php", true);
  xmlhttp.setRequestHeader("Content-type", 'application/json; charset=UTF-8');
  xmlhttp.send(message);
}

/*
 *   Function: displayHourly
 *   Pages: search-appointment.html, schedule-appointment.html, reschedule-appointment.html
 *   Pre-Conditions:
 *        * The date is passed to the function in 24hr "HH:MM:SS" format
 *   Post-conditions:
 *        * Retrieves the information about appointments on or after this date and Displays
 *             them to the user in an hourly format with all of the relevant information.
 */
function displayHourly(date) {
  // input is valid, query for appointments and display them
  message = `{"foo":"view_appointments", "format":"h", "date":"${date}"}`;

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

      var info = JSON.parse(this.responseText);

      if (info.error != 1) {
        // No appontment in this time period, make notification visible
        if (info.day.length == 0) {
          document.getElementById("not_found").style.display = "flex";
          document.getElementById("hour_container").style.display = "none";
          document.getElementById("day_container").style.display = "none";
          document.getElementById("week_container").style.display = "none";
        }
        // else display container for appointments
        else {
          document.getElementById("not_found").style.display = "none";
          document.getElementById("hour_container").style.display = "block";
          document.getElementById("day_container").style.display = "none";
          document.getElementById("week_container").style.display = "none";
          var hourBody = document.getElementById("hour_body");
          // reset the body of the container
          var htmlToAdd = "";

          // define arrays to help interpret numerical dayOfWeek and monthOfYear
          var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
          var monthsOfYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
          var dayIdx = 0;

          // for each day
          while (dayIdx < info.day.length) {
            var apptIdx = 0;
            // parse and format the time information
            var day = parseInt(info.day[dayIdx].date.substring(8));
            var dayOfWeek = daysOfWeek[parseInt(info.day[dayIdx].dayOfWeek) - 1];
            var month = parseInt(info.day[dayIdx].date.substring(5, 7)) - 1;
            var year = info.day[dayIdx].date.substring(0, 4);

            // add element for this day
            htmlToAdd += `
    						<h4  style="margin-top:40px;"><span>${dayOfWeek} - ${month}/${day}/${year}</span></h4>`;
            var prevHour = 0;

            // for each appointment in this day
            while (apptIdx < info.day[dayIdx].appointment.length) {
              // get the appointment information
              const name = "" + info.day[dayIdx].appointment[apptIdx].first + " " + info.day[dayIdx].appointment[apptIdx].last;
              var phoneNotFormatted = info.day[dayIdx].appointment[apptIdx].phone;
              const phone = "(" + phoneNotFormatted.substring(0, 3) + ") " + phoneNotFormatted.substring(3, 6) + " - " + phoneNotFormatted.substring(6);
              const startTime = formatTime(info.day[dayIdx].appointment[apptIdx].start);
              const endTime = formatTime(info.day[dayIdx].appointment[apptIdx].end);
              // format the time
              var timeParts = info.day[dayIdx].appointment[apptIdx].start.split(":");
              if (prevHour != parseInt(timeParts[0], 10)) {
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
                // add header for the current time
                htmlToAdd +=
                  `<h6  style="margin-top:30px;"><span>${hour}:00 ${suffix}</span></h6>`;
              }
              // add card for this appointment information
              htmlToAdd += `<div class="card" id="appointment_display_card" style="width: 75%; margin: 15px auto;">
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
                htmlToAdd += `<div class="container" id="forty_eight_hour_prompt_${appt_id}" style="display:flex; justify-content:center">
                <p style="color:red;">
                  You cannot cancel appointments within 48 hours of the appointment time.
                </p>
              </div>`;
              } else {
                htmlToAdd += `<div class="row" id="owner_menu_${appt_id}" style="display:flex; justify-content:center;">
                  <button type="button" class="btn btn-danger" onclick="ownerCancelAppointment(${appt_id})">Cancel Appointment</button>
                </div>`;
              }
              // closing tags to finish appointment card
              htmlToAdd += `</div>
            </div>`;
              apptIdx++;
            }
            dayIdx++;
          }
          // after going through all days, add HTML to page
          hourBody.innerHTML = htmlToAdd;


        }
      }
    }
  }
  xmlhttp.open("POST", "../../Backend/search_appointment.php", true);
  xmlhttp.setRequestHeader("Content-type", 'application/json; charset=UTF-8');
  xmlhttp.send(message);
}

/*
 *   Function: displayDaily
 *   Pages: view-appointments.html
 *   Pre-Conditions:
 *        * The date is passed to the function in 24hr "HH:MM:SS" format
 *   Post-conditions:
 *        * Retrieves the information about appointments on or after this date and Displays
 *             them in a daily format to the user with all of the relevant information.
 */
function displayDaily(date) {
  // input is valid, query for appointments and display them
  message = `{"foo":"view_appointments", "format":"d", "date":"${date}"}`;

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

      var info = JSON.parse(this.responseText);

      if (info.error != 1) {
        // No appontment in this time period, make notification visible
        if (info.day.length == 0) {
          document.getElementById("not_found").style.display = "flex";
          document.getElementById("hour_container").style.display = "none";
          document.getElementById("day_container").style.display = "none";
          document.getElementById("week_container").style.display = "none";
        }
        // else, make container for displaying appointments visible
        else {
          document.getElementById("not_found").style.display = "none";
          document.getElementById("hour_container").style.display = "none";
          document.getElementById("day_container").style.display = "block";
          document.getElementById("week_container").style.display = "none";
          var dailyBody = document.getElementById("daily_body");
          var htmlToAdd = "";

          var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
          var monthsOfYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
          var dayIdx = 0;
          // for each day in the response
          while (dayIdx < info.day.length) {
            // get and format date information
            var apptIdx = 0;
            var day = parseInt(info.day[dayIdx].date.substring(8));
            var dayOfWeek = daysOfWeek[parseInt(info.day[dayIdx].dayOfWeek) - 1];
            var month = monthsOfYear[parseInt(info.day[dayIdx].date.substring(5, 7)) - 1];
            var year = info.day[dayIdx].date.substring(0, 4);

            // add the date information to the table
            htmlToAdd += `<tr>
        <td class="agenda-date" class="active" rowspan="${info.day[dayIdx].appointment.length}">
          <div class="dayofmonth">${day}</div>
          <div class="dayofweek">${dayOfWeek}</div>
          <div class="shortdate text-muted">${month}, ${year}</div>
        </td>`;
            // for each appointment in this day
            while (apptIdx < info.day[dayIdx].appointment.length) {
              // format the appointment information
              const name = "" + info.day[dayIdx].appointment[apptIdx].first + " " + info.day[dayIdx].appointment[apptIdx].last;
              var phoneNotFormatted = info.day[dayIdx].appointment[apptIdx].phone;
              const phone = "(" + phoneNotFormatted.substring(0, 3) + ") " + phoneNotFormatted.substring(3, 6) + " - " + phoneNotFormatted.substring(6);
              const startTime = formatTime(info.day[dayIdx].appointment[apptIdx].start);
              const endTime = formatTime(info.day[dayIdx].appointment[apptIdx].end);
              const time = "<p>" + startTime + "-" + endTime + "<\p>";

              // if not the first appointment of the day, apply additional formatting (necessary to maintain table)
              if (apptIdx > 0) {
                htmlToAdd += `</tr><tr>`;
              }
              // store HTML to add
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
              // if within 48 hrs, display prompt
              if (info.day[dayIdx].appointment[apptIdx].withinFortyEight) {
                htmlToAdd += `<div class="container" id="forty_eight_hour_prompt_${parseInt(info.day[dayIdx].appointment[apptIdx].id)}" style="display:flex; justify-content:center">
                <p style="color:red;">
                  You cannot cancel appointments within 48 hours of the appointment time.
                </p>
              </div>`;
              }
              // else, display cancel menu
              else {
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
          // after going through all the days, add the HTML to the page
          dailyBody.innerHTML = htmlToAdd;
        }
      }
    }
  }
  xmlhttp.open("POST", "../../Backend/search_appointment.php", true);
  xmlhttp.setRequestHeader("Content-type", 'application/json; charset=UTF-8');
  xmlhttp.send(message);
}

/*
 *   Function: displayDaily
 *   Pages: view-appointments.html
 *   Pre-Conditions:
 *        * The date is passed to the function in 24hr "HH:MM:SS" format
 *   Post-conditions:
 *        * Retrieves the information about appointments on or after this date and Displays
 *             them in a weekly format to the user with all of the relevant information.
 */
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

        for (var q = 0; q < 10; q++) {
          if (info.week[q].day.length != 0)
            none = 0;
        }
        // if no appointments, display that there are no appointments
        if (none != 0) {
          document.getElementById("not_found").style.display = "flex";
          document.getElementById("hour_container").style.display = "none";
          document.getElementById("day_container").style.display = "none";
          document.getElementById("week_container").style.display = "none";
        }
        // else, make the container for viewing weekly appointments visible
        else {
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
            // get the week information
            var firstappt = 1;
            var startOfWeekDate = parseInt(info.week[weekIdx].startDate.substring(8));
            var endOfWeekDate = parseInt(info.week[weekIdx].endDate.substring(8));
            var startOfWeekDay = info.week[weekIdx].startDateString;
            var endOfWeekDay = info.week[weekIdx].endDateString;
            var startMonth = monthsOfYear[parseInt(info.week[weekIdx].startDate.substring(5, 7)) - 1];
            var endMonth = monthsOfYear[parseInt(info.week[weekIdx].endDate.substring(5, 7)) - 1];
            var startYear = parseInt(info.week[weekIdx].startDate.substring(0, 4));
            var endYear = parseInt(info.week[weekIdx].endDate.substring(0, 4));

            var numAppointments = 0;
            var dayIdx = 0;
            while (dayIdx < info.week[weekIdx].day.length) {
              numAppointments += info.week[weekIdx].day[dayIdx].appointment.length;
              dayIdx++;
            }
            // if there are appointments in this week, display the information for the start and end of the week
            if (numAppointments > 0) {
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
            // for each day in the week
            while (dayIdx < info.week[weekIdx].day.length) {
              var apptIdx = 0;
              // get the day information
              var day = parseInt(info.week[weekIdx].day[dayIdx].date.substring(8));
              var dayOfWeek = daysOfWeek[parseInt(info.week[weekIdx].day[dayIdx].dayOfWeek) - 1];
              var month = monthsOfYear[parseInt(info.week[weekIdx].day[dayIdx].date.substring(5, 7)) - 1];
              var year = info.week[weekIdx].day[dayIdx].date.substring(0, 4);

              // add the day information to the page
              htmlToAdd += `
        <td class="agenda-date" class="active" rowspan="${info.week[weekIdx].day[dayIdx].appointment.length}">
          <div class="dayofmonth">${day}</div>
          <div class="dayofweek">${dayOfWeek}</div>
          <div class="shortdate text-muted">${month}, ${year}</div>
        </td>`;
              // for each appointment on this day
              while (apptIdx < info.week[weekIdx].day[dayIdx].appointment.length) {
                // get the appointment information and format it.
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
                // add HTML for this appointment
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
                // if within 48 hours, display prompt
                if (info.week[weekIdx].day[dayIdx].appointment[apptIdx].withinFortyEight) {
                  htmlToAdd += `<div class="container" id="forty_eight_hour_prompt_${parseInt(info.week[weekIdx].day[dayIdx].appointment[apptIdx].id)}" style="display:flex; justify-content:center">
                <p style="color:red;">
                  You cannot cancel appointments within 48 hours of the appointment time.
                </p>
              </div>`;
                }
                // if not within 48 hours, display the cancel menu
                else {
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
            // add the HTML to the page
            weeklyBody.innerHTML = htmlToAdd;
          }
        }
      }
    }
  }
  xmlhttp.open("POST", "../../Backend/search_appointment.php", true);
  xmlhttp.setRequestHeader("Content-type", 'application/json; charset=UTF-8');
  xmlhttp.send(message);
}

/*
 *   Function: viewAppointmentsInputChange
 *   Pages: view-appointments.html
 *   Pre-Conditions:
 *        * The date is in an input field with name and ID "startDate"
 *        * The format variable is selected from a radio input with name "format"
 *   Post-conditions:
 *        * calls either displayHourly(), displayDaily(), or displayWeekly() based on the
 *           value of the format input
 */
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

  // determine which function to call to display the appointments
  if (format == "h") {
    displayHourly(date);
  } else if (format == "d") {
    displayDaily(date);
  } else {
    displayWeekly(date);
  }
}

/*
 *   Function: ownerCancelAppointment
 *   Pages: view-appointments.html
 *   Pre-Conditions:
 *        * The appointment ID is passed to the function
 *   Post-conditions:
 *        * Displays the cancel appointment modal and stores the appointment ID in a
 *            hidden input field
 */
function ownerCancelAppointment(appt_id) {
  document.getElementById("cancel_appt_modal").style.display = "flex";
  document.getElementById("appt_id_cancel_appt").value = appt_id;
}

/*
 *   Function: closeCancellationModal
 *   Pages: view-appointments.html
 *   Pre-Conditions: <none>
 *   Post-conditions:
 *        * hides the cancel appointment modal
 *        * calls viewAppointmentsInputChange to refresh the view-appointments.html page
 */
function closeCancellationModal() {
  document.getElementById("cancel_appt_modal").style.display = "none";
  document.getElementById("modal_body_text").innerHTML = "Press the confirm button to cancel this appointment.";
  document.getElementById("modal_body_text").style.color = "black";
  document.getElementById("confirm_cancellation_button").style.display = "flex";
  viewAppointmentsInputChange();
}

// --------------------- ALWAYS EXECUTES ON LOAD ---------------------
// sets the minimum date on the date input field 
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
var todayFormat = yyyy + '-' + mm + '-' + dd;

// set min and max dates
document.getElementById("startDate").setAttribute("min", todayFormat);
// -------------------------------------------------------------------

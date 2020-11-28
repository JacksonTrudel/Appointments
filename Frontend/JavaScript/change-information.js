function changeAppointmentInformation(first_name, last_name, phone, email, subject, notes) {
  appt_id = document.appt_info_form.appt_id.value;

  message = `{"foo":"change_appt_info", "appt_id":${appt_id}, "first":"${first_name}","last":"${last_name}", "phone":"${phone}", "email":"${email}", "subject":"${subject}", "notes":"${notes}"}`;
  console.log(message);
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

      var info = JSON.parse(this.responseText);
      console.log(info);
      if (info.error != 1) {
        alert("Successfully updated your appointment information! Your appointment ID is still: " + appt_id + ".");
        window.location.href ="../Frontend/HTML/search-appointment.html";
      }
      else {
        alert("Unknown server-side error.");
      }
    }
  }
  xmlhttp.open("POST", "../Backend/appointment_info.php", true);
  xmlhttp.setRequestHeader("Content-type", 'application/json; charset=UTF-8');
  xmlhttp.send(message);
}

function closeCancellationModal() {
    document.getElementById("cancel_appt_modal").style.display = "none";

    searchAppointment();
}

function onCancelAppointment() {
  document.getElementById("cancel_appt_modal").style.display = "flex";
}

function reloadSearchAppointment() {
  window.location.href = "search-appointment.html";
}

function cancelChangeInfo() {
  window.location.href = "../Frontend/HTML/search-appointment.html";
}

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
        document.getElementById("modal_body_text").innerHTML = "Your appointment has been cancelled!";
        document.getElementById("modal_body_text").style.color = "red";
        document.getElementById("confirm_cancellation_button").style.display ="none";
        document.getElementById("appt_canceled").value = 1;
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

function changeAppointmentTime() {
  var appt_id = document.getElementById("appt_id_change_time").value;


  message = `{"foo":"store_appt_id_change_time", "appt_id":${appt_id}}`;
  console.log(message);
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

      var info = JSON.parse(this.responseText);
      console.log(info);
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

function rescheduleConfirmed() {
  // setting up arguments
  const entryID = $("#display_available_container").data("entryChosen");
  var date = $("#display_available_container").data("date" + entryID);
  var startTime = $("#display_available_container").data("start" + entryID);
  var endTime =  $("#display_available_container").data("end" + entryID);
  startTime += ":00";
  endTime += ":00";

  var message = `{"foo":"reschedule_appointment", "date":"${date}", "start":"${startTime}", "end":"${endTime}"}`;
console.log(message);
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {

        var info = JSON.parse(this.responseText);
        console.log(info);
        if (info.no_app_id == 1) {

          window.location.href ="book-appointment.html";
          alert("Somehow we don't have your booking information!");
        }
        else if(info.success == 1) {
          window.location.href ="search-appointment.html";
          alert("Your appointment has been rescheduled! Your appointment ID is still: " + info.apptId);
        }
      }
    }
    xmlhttp.open("POST", "../../Backend/scheduling.php", true);
    xmlhttp.setRequestHeader("Content-type", 'application/json; charset=UTF-8');
    xmlhttp.send(message);
}

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
  console.log(message);
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

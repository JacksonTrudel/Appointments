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

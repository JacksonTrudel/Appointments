const email = document.appt_info_form.email;
email.addEventListener("input", emailListener);

const inputElement = document.getElementById('phone');
inputElement.addEventListener('keydown', filterKeys);
inputElement.addEventListener('keyup', formatPhoneNumber);

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

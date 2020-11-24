function validateNames() {
  const firstname = document.appt_info_form.first_name.value;
  const lastname = document.appt_info_form.last_name.value;

  if (firstname.length < 1) {
    alert("Please enter your first name.");
    document.appt_info_form.first_name.focus();
    return false;
  } else if (firstname.length > 40) {
    alert("Please abbreviate your name (max 40 characters, current count: " + firstname.length + ").");
    document.appt_info_form.first_name.focus();
    return false;
  } else if (!firstname.match(/[a-z]+/i) || firstname.match(/\d/g)) {
    alert("Please enter a valid first name.");
    document.appt_info_form.first_name.focus();
    return false;
  } else if (lastname.length < 1) {
    alert("Please enter your last name.");
    document.appt_info_form.last_name.focus();
    return false;
  } else if (lastname.length > 50) {
    alert("Please abbreviate your last name (max 50 characters, current count: " + lastname.length + ").");
    document.appt_info_form.last_name.focus();
    return false;
  } else if (!lastname.match(/[a-z]+/i) || lastname.match(/\d/g)) {
    alert("Please enter a valid last name.");
    document.appt_info_form.last_name.focus();
    return false;
  }
  return true;
}

// called from search-appointment.js
function validateLastName(lastname) {
  if (lastname == "" || lastname.length < 1) {
    alert("Please enter your last name.");
    return false;
  } else if (lastname.length > 50) {
    alert("Last name is limited to 50 characters. This limit was enforced when you booked your appointment. Current length: " + lastname.length + " characters.");
    return false;
  } else if (!lastname.match(/[a-z]+/i) || lastname.match(/\d/g)) {
    alert("Please enter a valid last name.");
    return false;
  }
  return true;
}

// called from search-appointment.js
function validateApptId(id) {
  if (id == "" || !Number.isInteger(Number(id))) {
    alert("Please enter a valid appointment ID.");
    return false;
  }
  return true;
}

function validatePhone() {
  const phoneNum = document.getElementById('phone');
  var input = phoneNum.value.replace(/\D/g, '').substring(0, 10);
  if (input.length != 10) {
    alert("Please enter a 10 digit phone number.");
    document.appt_info_form.phone.focus();
    return false;
  }
  return true;
}

function emailListener() {
  var emailID = document.appt_info_form.email.value;
  atpos = emailID.indexOf("@");
  dotpos = emailID.lastIndexOf(".");

  if (atpos < 1 || (dotpos - atpos < 2)) {
    email.setCustomValidity("I am expecting an email address!");
  } else {
    email.setCustomValidity("");
  }
}

function validateEmail() {
  var emailID = document.appt_info_form.email.value;
  atpos = emailID.indexOf("@");
  dotpos = emailID.lastIndexOf(".");

  if (!(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/.test(emailID))) {
    alert("Please enter a valid email.");
    document.appt_info_form.email.focus();
    return false;
  }
  return (true);
}

function validateSubject() {
  const subject = document.getElementById("subject");
  if (subject.value.length < 1) {
    alert("Please enter a subject for the appointment.");
    document.appt_info_form.subject.focus();
    return false;
  } else if (subject.value.length > 40) {
    alert("Use a maximum of 40 characters for the subject of the appointment. Current count: " + subject.value.length);
    document.appt_info_form.subject.focus();
    return false;
  }
  return true;
}

function validateNotes() {
  const notes = document.getElementById("notes");
  if (notes.value.replace(/ /g, '').length < 1) {
    alert("Please enter additional notes for the appointment. Enter \"None\" if there are no additional notes.");
    document.appt_info_form.notes.focus();
    return false;
  } else if (notes.value.length > 120) {
    alert("Use a maximum of 120 characters for additional notes for the appointment. Current count: " + notes.value.length);
    document.appt_info_form.notes.focus();
    return false;
  }
  return true;
}

function validate() {

  if (!validateNames())
    return false;
  else if (!validatePhone())
    return false;
  else if (!validateEmail())
    return false;
  else if (!validateSubject())
    return false;
  else if (!validateNotes())
    return false;

  // all fields are valid

  const form = document.appt_info_form;
  storeAppointmentInformation(form.first_name.value.trim(), form.last_name.value.trim(), form.phone.value.replace(/\D/g, '').substring(0, 10), form.email.value,
    document.getElementById("subject").value, document.getElementById("notes").value);
  return true;
}

function validateChangeInfo() {
  if (!validateNames())
    return false;
  else if (!validatePhone())
    return false;
  else if (!validateEmail())
    return false;
  else if (!validateSubject())
    return false;
  else if (!validateNotes())
    return false;

  // all fields are valid

  const form = document.appt_info_form;
  changeAppointmentInformation(form.first_name.value.trim(), form.last_name.value.trim(), form.phone.value.replace(/\D/g, '').substring(0, 10), form.email.value,
    document.getElementById("subject").value, document.getElementById("notes").value);
  return true;
}

const isNumericInput = (event) => {
  const key = event.keyCode;
  return ((key >= 48 && key <= 57) || // Allow number line
    (key >= 96 && key <= 105) // Allow number pad
  );
};

const isModifierKey = (event) => {
  const key = event.keyCode;
  return (event.shiftKey === true || key === 35 || key === 36) || // Allow Shift, Home, End
    (key === 9 || key === 13) || //  Tab, Enter
    (key > 36 && key < 41) || // Allow left, up, right, down
    (
      // Allow Ctrl/Command + A,C,V,X,Z
      (event.ctrlKey === true || event.metaKey === true) &&
      (key === 65 || key === 67 || key === 86 || key === 88 || key === 90)
    )
};

const isDeleteKey = (event) => {
  const key = event.keyCode;
  if (key === 46 || key === 8) // delete and backspace
    return true;
  return false;
}

const filterKeys = (event) => {
  // Input must be of a valid number format or a modifier key, and not longer than ten digits
  if (!isNumericInput(event) && !isModifierKey(event)) {
    event.preventDefault();
  }
};

const formatPhoneNumber = (event) => {
  if (isModifierKey(event)) {
    return;
  }
  // I am lazy and don't like to type things more than once
  const target = event.target;
  var input = target.value.replace(/\D/g, '').substring(0, 10); // First ten digits of input only
  var areaCode = input.substring(0, 3);
  var middle = input.substring(3, 6);
  var last = input.substring(6, 10);

  if (isDeleteKey(event)) {
    input = input.substring(0, input.length - 1);
    areaCode = input.substring(0, 3);
    middle = input.substring(3, 6);
    last = input.substring(6, 10);
    if (input.length >= 6) {
      target.value = `(${areaCode}) ${middle} - ${last}`;
    } else if (input.length >= 3) {
      target.value = `(${areaCode}) ${middle}`;
    } else if (input.length >= 0) {
      target.value = `(${areaCode}`;
    }
    return;
  }

  if (input.length >= 6) {
    target.value = `(${areaCode}) ${middle} - ${last}`;
  } else if (input.length >= 3) {
    target.value = `(${areaCode}) ${middle}`;
  } else if (input.length > 0) {
    target.value = `(${areaCode}`;
  }
};

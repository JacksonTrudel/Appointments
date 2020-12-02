/*
 *   validation.js
 *
 *   Author:               Jackson Trudel
 *   Attached to pages:    search-appointment.html, schedule-appointment.html, reschedule-appointment.html, change-info.php
 *   Purpose:               - defines 12 functions and 5 event listeners which perform the input validation and error
 *                              messaging
 */

 /*
  *   Function: isValidDate
  *   Pages: search-appointment.html, schedule-appointment.html, reschedule-appointment.html
  *   Pre-Conditions:
  *        * The date string to be validated is passed to the function
  *   Post-conditions:
  *        * Returns true if a valid date in YYYY-mm-dd format
  */
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

/*
 *   Function: validateNames
 *   Pages: book-appointment.html, change-info.php
 *   Pre-Conditions:
 *        * The first name is stored in an input field with name first_name
 *        * The last name is stored in an input field with name last_name
 *   Post-conditions:
 *        * Prompts the user if any field exceeds the maximum number of characters,
 *         contains invalid symbols, or if they've left it blank
 *        * Returns true if both inputs are valid, else it returns false
 */
function validateNames() {
  const firstname = document.appt_info_form.first_name.value;
  const lastname = document.appt_info_form.last_name.value;

  // check first_name non-empty
  if (firstname.length < 1) {
    alert("Please enter your first name.");
    document.appt_info_form.first_name.focus();
    return false;
  }
  // check first_name does not exceed 40 characters
  else if (firstname.length > 40) {
    alert("Please abbreviate your name (max 40 characters, current count: " + firstname.length + ").");
    document.appt_info_form.first_name.focus();
    return false;
  }
  // check first_name contains only symbols of the alphabet
  else if (!firstname.match(/[a-z]+/i) || firstname.match(/\d/g)) {
    alert("Please enter a valid first name.");
    document.appt_info_form.first_name.focus();
    return false;
  }
  // check last_name non-empty
  else if (lastname.length < 1) {
    alert("Please enter your last name.");
    document.appt_info_form.last_name.focus();
    return false;
  }
  // check last_name does not exceed 50 characters
  else if (lastname.length > 50) {
    alert("Please abbreviate your last name (max 50 characters, current count: " + lastname.length + ").");
    document.appt_info_form.last_name.focus();
    return false;
  }
  // check last_name contains only symbols of the alphabet
  else if (!lastname.match(/[a-z]+/i) || lastname.match(/\d/g)) {
    alert("Please enter a valid last name.");
    document.appt_info_form.last_name.focus();
    return false;
  }
  return true;
}

/*
 *   Function: validateLastName
 *   Pages: search-appointment.html
 *   Pre-Conditions:
 *        * The last name is passed to the function from search-appointment.js
 *   Post-conditions:
 *        * Prompts the user if the last name exceeds the maximum number of characters (50),
 *         contains invalid symbols, or if they've left it blank
 *        * Returns true if a valid last name, else returns false
 */
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

/*
 *   Function: validateApptId
 *   Pages: search-appointment.html
 *   Pre-Conditions:
 *        * The id is passed to the function from search-appointment.js
 *   Post-conditions:
 *        * Prompts the user if the id contains invalid symbols or if they've left it blank
 *        * Returns true if a valid id, else returns false
 */
function validateApptId(id) {
  if (id == "" || !Number.isInteger(Number(id))) {
    alert("Please enter a valid appointment ID.");
    return false;
  }
  return true;
}

/*
 *   Function: validatePhone
 *   Pages: book-appointment.html, change-info.html
 *   Pre-Conditions:
 *        * The phone number is in an input field with ID "phone" in format "(###) ### - ####"
 *   Post-conditions:
 *        * Prompts the user if they failed to enter a 10 digit phone number
 *        * Returns true if a valid phone number, else returns false
 */
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

/*
 *   Function: emailListener
 *   Pages: book-appointment.html, change-info.html (attached in booking.js)
 *   Pre-Conditions:
 *        * The email input field has a name and ID "email"
 *   Post-conditions:
 *        * Sets the validity of the input field upon change
 */
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

/*
 *   Function: validateEmail
 *   Pages: book-appointment.html, change-info.html
 *   Pre-Conditions:
 *        * The email input field has a name and ID "email"
 *   Post-conditions:
 *        * Prompts the user if they failed to enter a valid email
 *                 > checks for whether the email is in form (a@b.c) for some strings a, b, and c
 *        * Returns true if a valid email, else returns false
 */
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

/*
 *   Function: validateSubject
 *   Pages: book-appointment.html, change-info.html
 *   Pre-Conditions:
 *        * The subject is in an input field with ID "subject"
 *   Post-conditions:
 *        * Prompts the user if the subject exceeds the maximum number of characters (40)
 *             or if they've left it blank
 *        * Returns true the subject is valid, else returns false
 */
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

/*
 *   Function: validateNotes
 *   Pages: book-appointment.html, change-info.html
 *   Pre-Conditions:
 *        * The notes is in a textarea tag with ID "notes"
 *   Post-conditions:
 *        * Prompts the user if the notes exceeds the maximum number of characters (120)
 *             or if they've left it blank
 *        * Returns true if entered valid notes, else returns false
 */
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

/*
 *   Function: validate
 *   Pages: book-appointment.html
 *   Pre-Conditions: <none>
 *   Post-conditions:
 *        * calls the individual validation functions for each of the input fields on the page
 *        * calls storeAppointmentInformation with necessary arguments if all inputs are valid
 *        * Returns true if all inputs are valid, else returns false
 */
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

/*
 *   Function: validateChangeInfo
 *   Pages: change-info.php
 *   Pre-Conditions: <none>
 *   Post-conditions:
 *        * calls the individual validation functions for each of the input fields on the page
 *        * calls changeAppointmentInformation with necessary arguments if all inputs are valid
 *        * Returns true if all inputs are valid, else returns false
 */
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
  // call changeAppointmentInformation
  changeAppointmentInformation(form.first_name.value.trim(), form.last_name.value.trim(), form.phone.value.replace(/\D/g, '').substring(0, 10), form.email.value,
    document.getElementById("subject").value, document.getElementById("notes").value);
  return true;
}

// EventListener for numeric input
const isNumericInput = (event) => {
  const key = event.keyCode;
  return ((key >= 48 && key <= 57) || // Allow number line
    (key >= 96 && key <= 105) // Allow number pad
  );
};

// EventListener to filter out modifier keys
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

// EventListener to detect if input is a delete or backspace
const isDeleteKey = (event) => {
  const key = event.keyCode;
  if (key === 46 || key === 8) // delete and backspace
    return true;
  return false;
}

// EventListener to filter out events without numeric input or that are not modifier keys
const filterKeys = (event) => {
  // Input must be of a valid number format or a modifier key, and not longer than ten digits
  if (!isNumericInput(event) && !isModifierKey(event)) {
    event.preventDefault();
  }
};

// EventListener that formats the phone number on the page
const formatPhoneNumber = (event) => {
  if (isModifierKey(event)) {
    return;
  }

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

/*
 *   Function: formatTime
 *   Pages: schedule-appointment.html, reschedule-appointment.html, search-appointment.html
 *   Pre-Conditions:
 *        * Time string is passed to the function in 24-hour "HH:MM:SS" format
 *   Post-conditions:
 *        * Parses and returns the string and formats it in 12-hour "HH:MM [am/pm]" format
 */
function formatTime(time){
  var suffix = "am";
  var timeParts = time.split(":");
  var hour = parseInt(timeParts[0], 10);
  var min = parseInt(timeParts[1], 10);

  if (hour >= 12) {
    hour -= 12;
    suffix = "pm";
  }
  if (hour == 0) {
    hour = 12;
  }
  hour = hour.toString();
  min = min.toString().padStart(2, "0");
  return "" + hour + ":" + min + "" + suffix;
}

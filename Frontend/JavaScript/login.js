/*
 *   login.js
 *
 *   Author:               Jackson Trudel
 *   Attached to pages:    manager-homepage.html, manager-availability.html, view-appointments.html
 *   Purpose:               - defines 1 function which is called before each page on the site-owner
 *                            side of the system is loaded. If the user has logged in as the site-owner,
 *                            it does nothing. If they are not logged in, it redirects to login.html
 */

 /*
  *   Function: validateLogin
  *   Pages: manager-homepage.html, manager-availability.html, view-appointments.html
  *   Pre-Conditions:
  *        * Called before the body of the html page is loaded
  *   Post-conditions:
  *        * Redirects the user to login.html if they do not have a login cookie stored
  */
function validateLogin() {
  // construct HTTPRequest message
  message = `{"foo":"validate_owner"}`;

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

      var info = JSON.parse(this.responseText);
      console.log(info);
      if (info.error != 1) {
        // if the user does not have a login cookie stored, redirect the window to login.html
        // else, do nothing
        if (info.accept == 0)
          window.location.href = "login.html";
      }
      // alert the user if there is an error in verification.
      else {
        alert("Unknown server-side error regarding login verification.");
      }
    }
  }
  xmlhttp.open("POST", "../../Backend/validate_site_owner.php", true);
  xmlhttp.setRequestHeader("Content-type", 'application/json; charset=UTF-8');
  xmlhttp.send(message);
}

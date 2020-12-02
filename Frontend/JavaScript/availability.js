/*   availability.js
 *
 *   Author: Jackson Trudel
 *   This file contains the definition for 1 function which is responsible
 *   for displaying availability on days without any scheduled appointments.
 */


/*
 *   function: displayDefaultAvailability
 *   pages: availability.html, manager-availability.html
 *   Pre-conditions:
 *        * page contains rows to display data.
 *                 > each row contains three relevant DOM elements: <k>_start, <k_end> and <k>, where you replace <k> with
 *                        the enumeration for the given day [Sunday = 0, Monday = 1, ... Saturday = 6]
 *        * default_availability.php returns a JSON-encoded response object (info)
 *        * the relative path to default_availability.php is: "../../Backend/default_availability.php"
 *   Post-conditions:
 *        * processes the response from default_availability.php
 *        * displays the site-owner's availability in the appropriate elements
 *                 > displays "unavailable" if the site-owner is closed on the given day
 *                 > Otherwise, displays the start and end time for the given day.
 */
function displayDefaultAvailability() {
  // input message to XMLHttpRequest
  message = `{"foo":"get_default_availability"}`;

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

      var info = JSON.parse(this.responseText);
      console.log(info);
      var elem, startHour, endHour, startMin, endMin, startSuffix, endSuffix;
      const dayDict = ["sunday", "monday", "tuesday","wednesday", "thursday", "friday", "saturday"];
      const dayDictCap = ["Sunday", "Monday", "Tuesday","Wednesday", "Thursday", "Friday", "Saturday"];

      for (var i = 0; i < 7; i++)
      {
        // if they don't work this day
        if (info.days[i].unavailable == 1)
        {
          elem = document.getElementById(dayDict[i]);
          elem.innerHTML = `<b>` + dayDictCap[i] + `:</b> unavailable`;
        }
        // if they do work this day, display the default hours
        else {
          startHour = info.days[i].startTime.substring(0,2);
          startMin = info.days[i].startTime.substring(3,5);
          endHour = info.days[i].endTime.substring(0,2);
          endMin = info.days[i].endTime.substring(3,5);
          var hrParse = parseInt(startHour);

          // format startHour
          if (hrParse == 0) {
            startSuffix = "am";
            startHour = "12";
          }
          else if (hrParse <= 11) {
            startSuffix = "am";
            // will get rid of any leading zeros
            // if there are any
            startHour = hrParse.toString();
          }
          else if (hrParse == 12) {
            startSuffix = "pm";
          }
          else {
            startSuffix = "pm";
            startHour = (hrParse - 12).toString();
          }

          //format endHour
          hrParse = parseInt(endHour);
          if (hrParse == 0) {
            endSuffix = "am";
            endHour = "12";
          }
          else if (hrParse <= 11) {
            endSuffix = "am";
            // will get rid of any leading zeros
            // if there are any
            endHour = hrParse.toString();
          }
          else if (hrParse == 12) {
            endSuffix = "pm";
          }
          else {
            endSuffix = "pm";
            endHour = (hrParse - 12).toString();
          }

          // fill in elements with the approriate, formatted times
          elem = document.getElementById(dayDict[i] + "_start");
          elem.innerHTML = startHour + `:` + startMin + ` ` + startSuffix;

          elem = document.getElementById(dayDict[i] + "_end");
          elem.innerHTML = endHour + `:` + endMin + ` ` + endSuffix;
        }
      }

    }
  }
  xmlhttp.open("POST", "../../Backend/default_availability.php", true);
  xmlhttp.setRequestHeader("Content-type", 'application/json; charset=UTF-8');
  xmlhttp.send(message);
}

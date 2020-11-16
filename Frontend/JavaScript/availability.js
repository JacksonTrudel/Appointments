function displayDefaultAvailability() {
  const avail_sect = document.getElementById("default_availability_section");

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

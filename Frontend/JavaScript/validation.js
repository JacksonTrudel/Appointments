const email = document.appt_info_form.email;
email.addEventListener("input", function(event) {
  var emailID = document.appt_info_form.email.value;
  atpos = emailID.indexOf("@");
  dotpos = emailID.lastIndexOf(".");

  if (atpos < 1 || (dotpos - atpos < 2)) {
    email.setCustomValidity("I am expecting an email address!");
  } else {
    email.setCustomValidity("");
  }
});

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
	storeAppointmentInformation(form.first_name.value, form.last_name.value, form.phone.value.replace(/\D/g, '').substring(0, 10), form.email.value);
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

const enforceFormat = (event) => {
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

const inputElement = document.getElementById('phone');
inputElement.addEventListener('keydown', enforceFormat);
inputElement.addEventListener('keyup', formatPhoneNumber);

function storeAppointmentInformation(first_name, last_name, phone, email) {

  message = `{"foo":"store_appt_info", "first":"${first_name}","last":"${last_name}", "phone":"${phone}", "email":"${email}"}`;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

      var info = JSON.parse(this.responseText);
      console.log(info);

    }
  }
  xmlhttp.open("POST", "../../Backend/appointment_info.php", true);
  xmlhttp.setRequestHeader("Content-type", 'application/json; charset=UTF-8');
  xmlhttp.send(message);


}

//The mainContentPage is the content id we are using to rewrite everything
// function getSearchResults(searchTextId, mainContentPage) {
// 	var i, content ="<div style='margin-top: 10%;'>";
// 	var xmlhttp = new XMLHttpRequest();
// 	console.log(searchTextId);
// 	console.log(mainContentPage);
// 	if((document.getElementById(searchTextId).value == "") && (mainContentPage == 'itempage_content'))
// 	{
// 		//console.log("search is empty and we are on the item page");
// 		displayAllProducts(mainContentPage);
// 		return;
// 	}
// 	xmlhttp.onreadystatechange = function ()
// 	{
// 		if(this.readyState == 4 && this.status == 200)
// 		{
// 			var info = JSON.parse(this.responseText);
// 			var itemname, itemdesc, itemcost, itemimage, itemimagename;
// 			for(i in info.items)
// 			{
// 				if(info.items[i].name.toLowerCase() === document.getElementById(searchTextId).value.toLowerCase())
//                 {
//                     itemid = info.items[i].id;
// 					itemname = info.items[i].name;
// 					itemdesc = info.items[i].desc;
// 					itemcost = info.items[i].cost;
// 					itemimage = "images/" + info.items[i].image;
// 					itemimagename = info.items[i].image;
// 						content += `<div class="card col-md-4" style="width: 18rem;">
// 										<img class="card-img-top" src="${itemimage}" alt="Image name: ${itemimagename}">
// 										<div class="card-body">
// 											<p class="card-text"><b>${itemname}</b></p>
// 											<p class="card-text">${itemdesc}</p>
// 											<p class="card-text">$${itemcost}</p>
// 											<button type="button" class="btn btn-info" onClick="gen_code(${itemid})">Request Discount</button>
// 											<button type="button" class="btn btn-success" onClick="addtoCart(${itemid}, 1)">Add to Cart</button>
// 										</div>
// 									</div>`;
// 				}
// 			}
// 			content += "</div>";
// 			document.getElementById(mainContentPage).innerHTML = content;
// 		}
// 	}
// 	xmlhttp.open("POST", "../../api/get_items.php", true);
// 	xmlhttp.setRequestHeader("Content-type", 'application/json; charset=UTF-8');
// 	xmlhttp.send();
// }
//
//
// function displayAllProducts(ContentPage)
// {
// 	var i, content ='<div class="row" style="margin-top: 10%;">';
//
// 	var xmlhttp = new XMLHttpRequest();
// 	xmlhttp.onreadystatechange = function ()
// 	{
// 		if(this.readyState == 4 && this.status == 200)
// 		{
// 			var info = JSON.parse(this.responseText);
// 			var itemname, itemdesc, itemcost, itemimagename, itemimage;
// 			for(i in info.items)
//             {
//                 itemid = info.items[i].id;
// 			itemname = info.items[i].name;
// 			itemdesc = info.items[i].desc;
// 			itemcost = info.items[i].cost;
// 			itemimage = "images/" + info.items[i].image;
// 			itemimagename = info.items[i].image;
// 				content += `<div class="card col-md-4" style="width: 18rem;">
// 								<img class="card-img-top" src="${itemimage}" alt="Image name: ${itemimagename}">
// 								<div class="card-body">
// 									<p class="card-text"><b>${itemname}</b></p>
// 									<p class="card-text">${itemdesc}</p>
// 									<p class="card-text">$${itemcost}</p>
// 									<button type="button" class="btn btn-info" onClick="gen_code(${itemid})">Request Discount</button>
// 									<button type="button" class="btn btn-success" onclick="addtoCart(${itemid}, 1)">Add to Cart</button>
// 								</div>
// 							</div>`;
// 			}
// 			content += "</div>";
// 			document.getElementById(ContentPage).innerHTML = content;
//
// 		}
// 	}
// 	xmlhttp.open("POST", "../../api/get_items.php", true);
// 	xmlhttp.setRequestHeader("Content-type", 'application/json; charset=UTF-8');
// 	xmlhttp.send();
//
// 	return;
// }
//
// function gen_code(itemid)
// {
// 	console.log("gen_code() " + itemid);
// 	var message = `{"itemid" : "${itemid}"}`;
// 	var xmlhttp = new XMLHttpRequest();
// 	xmlhttp.onreadystatechange = function ()
// 	{
// 		if(this.readyState == 4 && this.status == 200)
// 		{
// 			console.log(this.responseText);
// 			var info = JSON.parse(this.responseText);
//
// 			if(info.code !== 'undefined')
// 			{
// 				alert("your code is! " + info.code);
// 			}
// 		}
// 	}
// 	xmlhttp.open("POST", "../../api/generate_discount.php", true);
// 	xmlhttp.setRequestHeader("Content-type", 'application/json; charset=UTF-8');
// 	xmlhttp.send(message);
// }
//
// function addtoCart(itemid, itemquantity)
// {
//     var message = `{"foo" : "addCart", "id" : "${itemid}", "quantity" : "${itemquantity}"}`;
//
//
//     var xmlhttp = new XMLHttpRequest();
//     xmlhttp.onreadystatechange = function () {
//         console.log(this.responseText);
//         var info = JSON.parse(this.responseText);
//
//
//         alert("You've successfully added this item to your cart!");
//     }
//     xmlhttp.open("POST", "../../api/cart.php", true);
//     xmlhttp.setRequestHeader("Content-type", 'application/json; charset=UTF-8');
//     xmlhttp.send(message);
//
// }
//
// function displayShoppingCart(ContentPage) {
//
//     var i, content = ``;
//
//
//     var message = `{"foo" : "getCart"}`;
//
//
//     var xmlhttp = new XMLHttpRequest();
//     xmlhttp.onreadystatechange = function () {
//         console.log(this.responseText);
//         if (this.readyState == 4 && this.status == 200) {
//             var info = JSON.parse(this.responseText);
//
//             if (info.emptyCart) {
//                 content += `<div class="row justify-content-center" style = "margin-top: 10%;" >
//                             <div class="card col-md-4" style="width: 18rem;">
// 								<div class="card-body">
// 									<p class="card-text">Your shopping cart is empty.</p>
// 									</div>
// 							</div></div>`;
//             }
//             else {
//
//                 var itemname, itemdesc, itemcost, itemquant, itemimage, itemimagename;
//
//
//                 var firstItem = true;
//
//                 for (i in info.items) {
//                     itemid = info.items[i].id;
//                     itemname = info.items[i].name;
//                     itemdesc = info.items[i].desc;
//                     itemquant = info.items[i].quantity;
//
//                     itemcost = (info.items[i].cost * itemquant);
//                     itemimage = "images/" + info.items[i].image;
//                     itemimagename = info.items[i].image;
//
//                     if (firstItem) {
//                         content += `<div class="row justify-content-center" style = "margin-top: 10%;" >`;
//                         firstItem = false;
//                     }
//                     else
//                         content += `<div class="row justify-content-center" >`;
//
//                     content += `<div class="card" id="cart-full" style="width: 18rem;">
//                                 <img class="card-img-top" src="${itemimage}" alt="Pic of item">
//                                     <div class="card-body">
//                                         <p class="card-text">${itemname}</p>
//                                         <p class="card-text">Quantity: ${itemquant}</p>
//                                         <p class="card-text">$${itemcost}</p>
//                                         <button type="button" class="btn btn-danger" onclick="removeFromCart(${itemid}, 1)">Remove</button>
//                                         <a href="./checkout.html"><button type="button" class="btn btn-success" onClick="queueCheckout(${itemid})">Proceed to Checkout</button></a>
//                                     </div>
//                                 </div>
//                                 <div class="card" id="discount" style="width: 18rem;">
//                                     <div class="card-body">
//                                         <div class="form-group">
//
//                                             <input type="text" class="form-control" id="discount-field-${itemid}" placeholder= "Enter your discount code"
//                                             onkeypress="return validateDiscountCode(event, this);"
//     										minlength="5" maxlength="5">
//                                         </div>
//                                             <button type="button" class="btn btn-info" onclick="applyDiscount(${itemid}, document.getElementById('discount-field-${itemid}').value)">Apply discount</button>
//
//                                      </div>
//                                 </div></div><br>`;
//
//                 }
//             }
//             content += `</div>`;
//             document.getElementById(ContentPage).innerHTML = content;
//
//         }
//     }
//     xmlhttp.open("POST", "../../api/cart.php", true);
//     xmlhttp.setRequestHeader("Content-type", 'application/json; charset=UTF-8');
//     xmlhttp.send(message);
//     return;
// }
//
// function removeFromCart(itemid, itemquantity) {
//     var message = `{"foo" : "removeItem", "id" : "${itemid}", "quantity" : "${itemquantity}"}`;
//
//
//     var xmlhttp = new XMLHttpRequest();
//     xmlhttp.onreadystatechange = function () {
//         console.log(this.responseText);
//         var info = JSON.parse(this.responseText);
//
//     }
//     xmlhttp.open("POST", "../../api/cart.php", true);
//     xmlhttp.setRequestHeader("Content-type", 'application/json; charset=UTF-8');
//     xmlhttp.send(message);
//
//     location.reload();
// }
//
// function queueCheckout(itemid) {
//     var message = `{"foo" : "queueCheckout", "id" : "${itemid}"}`;
//
//
//     var xmlhttp = new XMLHttpRequest();
//     xmlhttp.onreadystatechange = function () {
//         console.log(this.responseText);
//         var info = JSON.parse(this.responseText);
//
//     }
//     xmlhttp.open("POST", "../../api/cart.php", true);
//     xmlhttp.setRequestHeader("Content-type", 'application/json; charset=UTF-8');
//     xmlhttp.send(message);
// }

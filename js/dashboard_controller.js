book_form = {
    fuel_type: document.getElementById("fuel_type"),
    fuel_quantity: document.getElementById("fuel_amount_slider"),
    tot_cost: document.getElementById("c_disp"),
    date_delivery: document.getElementById("form-date"),
    address: document.getElementById("form-address"),
    phone_number: document.getElementById("form-phone"),
    tc_check: document.getElementById("form-cbox"),
    order_button: document.getElementById("book-form-submit"),
    status: document.getElementById("status_p")
};
g_username = "";

function onLoad() {
    var user_id = null;
    var user_name = null;
    user_id = sessionStorage.getItem("id");
    user_name = sessionStorage.getItem("name");

    console.log("id: " + user_id + ", name: " + user_name);

    if (user_id == null || user_name == null) {
        sessionStorage.clear();
        location.href = "index.html";

    }
    else {
        g_username = user_name;

    }
    document.getElementById("p_helper").innerHTML = "Need help? " + g_username;
}

function book_tab_clicked() {

    var y = document.getElementById("check-div");
    y.style.display = "none";
    var x = document.getElementById("book-div");
    x.style.display = "flex";
}
function check_tab_clicked() {
    var y = document.getElementById("book-div");
    y.style.display = "none";
    var x = document.getElementById("check-div");
    x.style.display = "inline-block";
    loadData();
}

function logout_clicked() {

    sessionStorage.clear();
    location.href = "index.html";
}


function getSelectedFuel() {
    var selbox = document.getElementById("fuel_type").value;
    return selbox;
}

function bookform_oninput() {
    var fuel_amt = document.getElementById("quant_display");
    var slider = document.getElementById("fuel_amount_slider").value;
    var cost_div = document.getElementById("c_disp");
    var sel_fuel = getSelectedFuel();
    var price_per_l = 1;
    if (sel_fuel == "normal_petrol") {
        price_per_l = 100;
    }
    else if (sel_fuel == "premium_petrol") {
        price_per_l = 110;
    }
    else if (sel_fuel == "normal_diesel") {
        price_per_l = 90;
    }
    else {
        price_per_l = 100;
    }


    fuel_amt.innerHTML = slider;
    //console.log("Price " + (slider * price_per_l));
    cost_div.innerHTML = "Cost: Rs." + (slider * price_per_l);
    cost_div.value = (slider * price_per_l);


}

function loadData() {

    const request = new XMLHttpRequest();
    request.onload = () => {

        console.log("Response text" + request.responseText);
        let respObj = null;
        try {
            respObj = JSON.parse(request.responseText);
        }
        catch (e) {
            console.error("Could not parse json");
        }
        if (respObj) {

            //handler here
            load_CheckCards(respObj.data);
        }
        else {
            book_form.status.innerHTML = "Did not receive any data back from server, check your connection";
        }
    };

    const reqdata = `id=${sessionStorage.getItem("id")}`;
    console.log("Sending this data" + reqdata);
    //alert(reqdata);
    request.open('post', 'php/loaddata.php');
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send(reqdata);

}
function getReadableText(x) {
    switch (x) {
        case "premium_petrol": return "Petrol +";
        case "normal_petrol": return "Petrol";
        case "premium_diesel": return "Diesel +";
        default: return "Diesel";
    }
}
function load_CheckCards(data) {
    var nums = data.length;
    var cards_parent = document.getElementById("check-div");

    while (cards_parent.hasChildNodes()) {
        cards_parent.removeChild(cards_parent.firstChild);
    }

    if (nums == 0) {
        var card_div = document.createElement("div");
        card_div.className = "check_card";
        var card_top = document.createElement("div");
        var _img = document.createElement("img");
        _img.src = "images/empty.png";
        card_top.appendChild(_img);

        var card_bottom = document.createElement("div");
        var title_p = document.createElement("p");
        title_p.innerHTML = "No orders placed.";

        card_bottom.appendChild(title_p);

        card_div.appendChild(card_top);
        card_div.appendChild(card_bottom);

        cards_parent.appendChild(card_div);
    }
    else {
        for (var i = 0; i < nums; i++) {
            var card_div = document.createElement("div");
            card_div.className = "check_card";
            var card_top = document.createElement("div");
            var _img = document.createElement("img");

            var tof = data[i][2];


            if (tof == "premium_petrol") {
                _img.src = "images/petrol_premium.png";
            }
            else if (tof == "premium_diesel") {
                _img.src = "images/diesel_premium.png";
            }
            else if (tof == "normal_petrol") {
                _img.src = "images/petrol_normal.png";
            }
            else {
                _img.src = "images/diesel_normal.png";
            }

            card_top.appendChild(_img);
            tof = getReadableText(tof);
            var card_bottom = document.createElement("div");
            var title_p = document.createElement("p");
            title_p.innerHTML = "" + tof;
            var date1_p = document.createElement("p");
            date1_p.innerHTML = "delivery: " + data[i][0];
            var date2_p = document.createElement("p");
            date2_p.innerHTML = "ordered: " + data[i][1];
            var quant_p = document.createElement("p");
            quant_p.innerHTML = "quantity: " + data[i][3] + " l";
            var cost_p = document.createElement("p");
            cost_p.innerHTML = "cost: Rs." + data[i][4];

            card_bottom.appendChild(title_p);
            card_bottom.appendChild(date1_p);
            card_bottom.appendChild(date2_p);
            card_bottom.appendChild(quant_p);
            card_bottom.appendChild(cost_p);

            card_div.appendChild(card_top);
            card_div.appendChild(card_bottom);

            cards_parent.appendChild(card_div);

        }
    }

}
function validate_form() {
    var b_address = book_form.address.value;
    var b_phone = book_form.phone_number.value;
    var b_tc = book_form.tc_check.checked;

    //console.log("Checked : " + b_tc + ",addr : " + b_address + ",phone : " + b_address);
    if (b_tc == false) {
        book_form.status.innerHTML = "You need to agree to out terms and conditions.";
        return;
    }
    else {
        var phone_pattern = /[0-9]{10}/
        if (phone_pattern.test(b_phone)) {
            if (b_address.length > 10) {
                return true;
            }
            else {
                //console.log("Address length needs to be atleast 10");
                book_form.status.innerHTML = "Address length needs to be atleast 10";
                return false;
            }
        }
        else {
            book_form.status.innerHTML = "Enter a valid 10 digit mobile number";
            return false;
        }
    }

}
function post_submit_book(response) {
    if (response.ok) {
        book_form.status.innerHTML = "Successfully Placed order.";
        book_form.address.value = "";
        book_form.phone_number.value = "";
        book_form.tc_check.checked = false;
    }
    else {
        book_form.tc_check.checked = false;
        book_form.status.innerHTML = "Oops! something went wrong.";
    }

}

function place_order_clicked() {
    if (validate_form()) {
        const request = new XMLHttpRequest();
        request.onload = () => {

            console.log("Response text" + request.responseText);
            let respObj = null;
            try {
                respObj = JSON.parse(request.responseText);
            }
            catch (e) {
                console.error("Could not parse json");
            }
            if (respObj) {

                post_submit_book(respObj);
            }
            else {
                book_form.status.innerHTML = "Did not receive any data back from server, check your connection.";
            }
        };
        var dod = new Date(book_form.date_delivery.value);
        var doo = new Date();

        if (dod > doo) {
            var dod_s = "" + dod.getFullYear() + "-" + (dod.getMonth + 1) + "-" + dod.getDate();
            var doo_s = "" + doo.getFullYear() + "-" + (doo.getMonth + 1) + "-" + doo.getDate();
            console.log(dod_s + ", " + doo_s);

            const reqdata = `user_id=${sessionStorage.getItem("id")}&dod=${dod.toISOString()}&doo=${doo.toISOString()}&ft=${book_form.fuel_type.value}&quant=${book_form.fuel_quantity.value}&cost=${book_form.tot_cost.value}`;
            console.log("Sending this data" + reqdata);
            //alert(reqdata);
            request.open('post', 'php/formsubmit.php');
            request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            request.send(reqdata);
        }
        else {
            book_form.status.innerHTML = "Date of delivery can't be in the past for new orders.";
        }
    }
    else {
        return;
    }
}

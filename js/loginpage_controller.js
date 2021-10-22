var form_obj = {
    email: document.getElementById("user_email"),
    password: document.getElementById("user_password"),
    log_button: document.getElementById("login_button"),
    error_box: document.getElementById("error_box"),
    error_ul: document.getElementById("error_ul_parent")
};

function validateInput() {
    var _email = form_obj.email.value;
    var _password = form_obj.password.value;



    var email_pattern = /^[a-z\d]*@[a-z]*\.[a-z]{2,4}$/i;
    var password_pattern = /^[a-z\d]{6,12}$/i;

    var messages = [];
    if (email_pattern.test(_email)) {
        console.log("You have entered a valid Email")
        if (password_pattern.test(_password)) {
            console.log("Valid login credential pattern");
            hideErrorBox();

        }
        else {
            console.log("Invalid password format");
            messages.push("Enter a valid password [alphabets or digits between 6-12 characters].");
        }
    }
    else {
        console.log("Enter a valid email");
        messages.push("Please enter a valid email");
    }
    if (messages.length > 0) {
        setErrors(messages);
        return false;
    }
    else {
        return true;
    }
}
function hideErrorBox() {
    form_obj.error_box.style.display = "none";
}

function setErrors(messages) {

    while (form_obj.error_ul.hasChildNodes()) {
        form_obj.error_ul.removeChild(form_obj.error_ul.firstChild);
    }
    form_obj.error_box.style.display = "block";
    for (let i = 0; i < messages.length; i++) {
        let new_li = document.createElement("li");
        new_li.innerHTML = messages[i];
        form_obj.error_ul.appendChild(new_li);
    }
}

function to_dashboard(response) {

    console.log("In to dashboard");
    if (response.ok) {
        sessionStorage.clear();
        sessionStorage.setItem("id", response.data[0]);
        sessionStorage.setItem("name", response.data[1]);
        location.href = "dashboard.html";
    }
    else {
        setErrors(response.message);
    }
}

function check_enter(event) {
    var char = event.keyCode;
    if (char == 13) {
        login();
    }
}

function login() {

    if (validateInput()) {
        console.log("Ready to login");
        var login_promise = new Promise(
            function (success, falied) {

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
                    finally {
                        if (respObj) {

                            success(respObj);
                        }
                        else {
                            messages = ["Did not receive any data back from server, check your connection"];
                            falied(messages);
                        }
                    }

                };

                const reqdata = `email=${form_obj.email.value}&password=${form_obj.password.value}`;
                console.log("Sending this data" + reqdata);
                //alert(reqdata);
                request.open('post', 'php/login.php');
                request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                request.send(reqdata);
            }
        );
        login_promise.then(
            function (values) { to_dashboard(values); },
            function (error) { setErrors(error); }
        );

    }
    else {
        console.log("Unable to login");
        return;
    }

}

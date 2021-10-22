var form_obj = {
    email: document.getElementById("user_email"),
    password: document.getElementById("user_password"),
    password_c: document.getElementById("user_password_confirm"),
    username: document.getElementById("user_name"),
    log_button: document.getElementById("signup_button"),
    error_box: document.getElementById("error_box"),
    error_ul: document.getElementById("error_ul_parent")
};


function validate_form() {

    var _email = form_obj.email.value;
    var _uname = form_obj.username.value;
    var _pwd = form_obj.password.value;
    var _pwd_c = form_obj.password_c.value;

    var email_pattern = /^[a-z\d]*@[a-z]*\.[a-z]{2,3}$/i;
    var password_pattern = /^[a-z\d]{6,12}/i;

    var messages = [];
    if (email_pattern.test(_email)) {

        if (password_pattern.test(_pwd) && password_pattern.test(_pwd_c)) {
            if (_pwd === _pwd_c) {
                if (_uname.length >= 3) {
                    hideErrorBox();
                    return true;
                }
                else {

                    console.log("username must be atleast 3 characters long");
                    messages = ["username must be atleast 3 characters long"];
                    setErrors(messages);
                    return false;
                }

            }
            else {
                console.log("Passwords don't match");
                messages = ["Passwords don't match"];
                setErrors(messages);
                return false;
            }
        }
        else {
            console.log("Password format not valid");
            messages = ["Enter a vaild passwords [alphabets and digits between length 6-12 characters.]"];
            setErrors(messages);
            return false;
        }
    }
    else {
        console.log("Email format not valid");
        messages = ["Enter a valid Email"];
        setErrors(messages);
        return false;
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
function handle_out(response) {

    if (response.ok) {
        console.log("Signed up successfully");
        location.href = "index.html";
    }
    else {
        console.log("Signup unsuccessful");
        setErrors(response.message);
    }
}
function sign_up_clicked() {
    console.log("Sign up attempt");
    if (validate_form()) {
        console.log("Ready to signup");


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

                success(respObj);
            }
            else {
                messages = ["Did not receive any data back from server, check your connection"];
                falied(messages);
            }
        };

        const reqdata = `email=${form_obj.email.value}&password=${form_obj.password.value}&username=${form_obj.username.value}`;
        console.log("Sending this data" + reqdata);
        //alert(reqdata);
        request.open('post', 'php/signup.php');
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    }
    else {
        return;
    }
}
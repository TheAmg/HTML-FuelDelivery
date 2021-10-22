<?php
if(isset($_POST["login_button"]))
{
	$email=$_POST["user_email"];
	$password=$_POST["user_password"];
	$con=mysqli_connect("localhost","root","","fuelbooker");
	if ($con->connect_error) {

    die("Connection failed: " . $con->connect_error);
	}
	else
	{
	$messages=[];
	$query="select * from user where user_email='".$email."' and user_pwd='".$password."';";
	$res=mysqli_query($con,$query);
	if ($row=$res->fetch_assoc()) 
	{
	echo "Valid credentials, logging in.<br>";
	}

	else
	{
		echo "Invalid credentials, try again<br>";
	}
	}
	$con->close();
}

?>
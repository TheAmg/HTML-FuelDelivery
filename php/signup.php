<?php
$email=$_POST["email"];
$password=$_POST["password"];
$username=$_POST["username"];

$con=mysqli_connect("localhost","root","","fuelbooker");
if ($con->connect_error) {

    die("Connection failed: " . $con->connect_error);
}
else
{
	$messages=[];
	$query="insert into user(user_email,user_name,user_pwd) values('".$email."','".$username."','".$password."');";
	if (mysqli_query($con,$query)) {
	$ok=true;
	array_push($messages,"Inserted");
	echo json_encode(array('ok'=>$ok,'message'=>$messages));
	}
	else
	{
		$ok=false;
		$messages=["Make sure you enter a unique username and an unregistered email"];
		echo json_encode(array('ok'=>$ok,'message'=>$messages));
	}
}
$con->close();
?>
<?php
$email=$_POST["email"];
$password=$_POST["password"];

$con=mysqli_connect("localhost","root","","fuelbooker");
if ($con->connect_error) {

    die("Connection failed: " . $con->connect_error);
}
else
{
	$messages=[];
	$query="select * from user where user_email='".$email."' and user_pwd='".$password."';";
	$res=mysqli_query($con,$query);
	if ($row=$res->fetch_assoc()) {
	$ok=true;
	array_push($messages,"Valid");
	$uid=$row["user_id"];
	$uname=$row["user_name"];
	$data=[$uid,$uname];

	echo json_encode(array('ok'=>$ok,'message'=>$messages,'data'=>$data));
	}

	else
	{
		$ok=false;
		$messages=["Check your email and password"];
		$data=["Invalid"];
		echo json_encode(array('ok'=>$ok,'message'=>$messages,'data'=>$data));
	}
}
$con->close();
?>
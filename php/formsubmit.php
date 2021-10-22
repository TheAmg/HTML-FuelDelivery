<?php
$id=$_POST["user_id"];
$dod=$_POST["dod"];
$doo=$_POST["doo"];
$ft=$_POST["ft"];
$quant=$_POST["quant"];
$cost=$_POST["cost"];

$con=mysqli_connect("localhost","root","","fuelbooker");
if ($con->connect_error) {

    die("Connection failed: " . $con->connect_error);
}
else
{
	$messages=[];
	$query="insert into orders(user_id,date_delivery,date_order,fuel_type,quantity,cost) values('".$id."','".$dod."','".$doo."','".$ft."','".$quant."','".$cost."');";
	if (mysqli_query($con,$query)) {
	$ok=true;
	array_push($messages,"Inserted");
	echo json_encode(array('ok'=>$ok,'message'=>$messages));
	}
	else
	{
		$ok=false;
		$messages=["Failed to insert, check your query."];
		echo json_encode(array('ok'=>$ok,'message'=>$messages));
	}
}
$con->close();
?>
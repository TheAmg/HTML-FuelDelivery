<?php
$id=$_POST["id"];

$con=mysqli_connect("localhost","root","","fuelbooker");
if ($con->connect_error) {

    die("Connection failed: " . $con->connect_error);
}
else
{
	$ok=false;
	$messages=["No data found"];
	$data=[];
	$query="select * from orders where user_id='".$id."';";
	$res=mysqli_query($con,$query);
	while ($row=$res->fetch_assoc()) {
	$ok=true;
	array_push($messages,"Valid");

	$dod=$row["date_delivery"];
	$doo=$row["date_order"];
	$ft=$row["fuel_type"];
	$quant=$row["quantity"];
	$cost=$row["cost"];
	$temp=[$dod,$doo,$ft,$quant,$cost];
	array_push($data, $temp);
	}
	echo json_encode(array('ok'=>$ok,'message'=>$messages,'data'=>$data));
}
$con->close();

?>
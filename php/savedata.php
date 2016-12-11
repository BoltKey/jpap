<?php
require ('db_connect.php');

$s = "SELECT * FROM afpgod_users WHERE ip='".$_SERVER['REMOTE_ADDR']."'";
if ($result = mysqli_query($link, $s)) {
	$data = json_decode($_GET['json']);
	$valid = true;
	$max = [10, 2, 10, 1000000, 10, 15];
	if ($_GET['score'] > 65)
		$valid = false;
	foreach ($data as $key => $value) {
		if ($value > $max[$key] || gettype($value) !== "integer")
			$valid = false;
	}
	if ($row = mysqli_fetch_assoc($result)) {
		echo "click already made from this IP: ".$row['ip']." and ".$_SERVER['REMOTE_ADDR'];
	}
	else {
		if ($valid) {
		
			echo "recording data ".$_GET['json'];
			$s = "INSERT INTO afpgod_users VALUES(0, '".$_SERVER['REMOTE_ADDR']."', ".implode(", ", $data).", ".$_GET['score'].");";
			echo "executing: ".$s;
			if (mysqli_query($link, $s)) {
				echo "Data successfully recorded.";
			}
			else {
				echo "Record failed: %s\n".mysqli_error($link);
			}
			
			$s = "DELETE FROM afpgod_users WHERE ip='dummy' LIMIT 1";
			if (mysqli_query($link, $s)) {
				echo "Dummy removed";
			}
			else {
				echo "Record failed: %s\n".mysqli_error($link);
			}
		}
		else {
			echo "invalid data. You probably tried to break my thing. Shame on you.";
		}
	}
}

?>
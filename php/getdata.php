<?php 
require ('db_connect.php');

$s = "SELECT * FROM afpgod_users";
$sums = [[0,0,0,0,0,0,0,0,0,0,0], [0,0,0], [0,0,0,0,0,0,0,0,0,0,0], [], [0,0,0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
$scores = [];
if ($result = mysqli_query($link, $s)) {
	$i = 0;
	
	for ($i = 0; $i < 66; ++$i) {
		array_push($sums[3], 0);
		array_push($scores, 0);
	}
	while ($row = mysqli_fetch_assoc($result)) {
		for ($round = 0; $round < 6; $round += 1) {
			if ($round !== 3) {
				$sums[$round][$row['round'.$round]] += 1;
			}
		}
		$scores[$row['score']] += 1;
	}
}
else {
	echo "<br> Query failed: ".$s."<br>";
	echo mysqli_error($link);
}

echo JSON_encode([$sums, $scores]);
?>
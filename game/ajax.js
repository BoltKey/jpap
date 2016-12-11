var orig = "http://boltkey.cz/prison-game/"; 

function getData() {
	console.log("Getting data");
	$.ajax({
		url: orig + "php/getdata.php",
		type: "GET",
		crossDomain: true,
		success: function(data){
			console.log("Data successfully retreived");
			var a = JSON.parse(data);
			rounds = a[0];
			scores = a[1];
			players = a[0][0].reduce(function(a, sum) {return a + sum});
			loaded = true;
			main();
		}
	})
}
onload = getData;

function saveData() {
	console.log("Saving data");
	$.ajax({
		url: orig + "php/savedata.php?json=" + JSON.stringify(answers) + "&score=" + score,
		type: "GET",
		crossDomain: true,
		success: function(data){
			console.log(data);
		}
	})
}
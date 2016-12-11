<head>
<meta charset="utf-8" />
<title>A funny prison game of death</title>
<link rel="shortcut icon" href="/boltlogo.png">
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
<!--<script src='https://cdn1.kongregate.com/javascripts/kongregate_api.js'></script>-->
<link href="style.css" rel="stylesheet">
<?php 
foreach (glob("game/*.js") as $filename)
{
    echo '<script type="text/javascript" src='.$filename.'></script>
';
} 
?>
</head>
<body>
<div id='main'>
	<span id='score'>Score: <span id='score-number'>0</span></span>
	<div id='speaker0'>
		<span id='speech0'></span>
	</div>
	<div id='speaker1'>
		<span id='speech1'></span>
		<div id='selection'></div>
	</div>

	<div id='mainScreen'>
	</div>
	<div id='graphWrap'></div>
	
</div>
<button id='muteButton' onclick='mute()'>Mute</button>
</body>
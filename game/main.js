var answers = [];
var rounds = [];
var score = 0;
var threshold = 30;
var lastScore = 0;
var lastAnswer = 0;
var players = 0;
var phase = 0;
var question = false;
var round = 0;
var writing = false;
var currSpeech = "";
var currSpeechi = 0;
var currSpeaker = 0;
var typeInt = 30;
var contexts = [];
var sounds = {};
var started = false;
var currPic = false;
var currTick = false;
var loaded = false;
var muted = false;
function main() {
	
	//sounds
	var names = ["dong", "bell", "buzzer", "tick", "tock", "clingy"];
	for (var i in names) {
		var a = new Audio();
		a.src = "sounds/" + names[i] + ".wav";
		sounds[names[i]] = a;
	}
	sounds.tw = [];
	for (var i = 0; i < 6; ++i) {
		var a = new Audio();
		a.src = "sounds/tw" + i + ".wav";
		sounds.tw[i] = a;
	}
	sounds.buzzer.loop = true;
	sounds.dong.volume = .1;
	sounds.buzzer.volume = 1;
	speak(1, "Click to start");
	
	

}
function mute() {
	sounds.buzzer.volume = 0 + muted;
	muted = !muted;
}

function swapPic() {
	currPic = !currPic;
	if (currPic)
		$("#mainScreen").css("background", "url(pics/interrogation.png)");
	else
		$("#mainScreen").css("background", "url(pics/interrogation2.png)");
	if (Math.random() < 0.001 && !muted) {
		sounds.dong.play();
	}
	setTimeout(swapPic, 30);
}
function tick() {
	if (currTick && !muted) 
		sounds.tick.play();
	else if (!muted)
		sounds.tock.play();
	currTick = !currTick;
	setTimeout(tick, 1000);
}

function answer(round, number) {
	if (question) {
		question = false;
		answers[round] = number;
		lastAnswer = number;
		lastScore = 0;
		
		switch(round) {
			case 0:
				if (rounds[round][number] <= players * .2) {
					score += number;
					lastScore = number;
				}
				break;
			case 1:
				if (number === 1) {
					score += 5;
					lastScore = 5;
				}
				else if (rounds[1][2] < .2 * players) {
					score += 10;
					lastScore = 10;
				}
				break;
			case 2:
				if (rounds[round][number] <= players * .15) {
					score += number;
					lastScore = number;
				}
				break;
			case 3:
				var survs = scores.slice(threshold, 100).reduce(function(s, a) {return s + a}, 0);
				var s = Math.max(0, 10 - (Math.ceil((Math.abs(survs - number) / survs) * 10)));
				score += s;
				lastScore = s;
				break;
			case 4:
				if (rounds[round][number] <= players * .1) {
					score += number;
					lastScore = number;
				}
				break;
			case 5: 
				
				if (number <= avgRound5()) {
					score += number;
					lastScore = number;
				}
				break;
		}
		if (round === 5) {
			saveData();
		}
		$("#score-number").html(score);
		$("#selection").html("");
		if (round !== 3)
			newGraph(round);
		nextPart();
	}
}
function answer3() {
	answer(3, +$("#q3amt").val())
}

function avgRound5() {
	var sumAll = 0;
	for (var i = 0; i <= 15; ++i) {
		sumAll += i * rounds[5][i];
	}
	return sumAll / players;
}

function drawGraph(ctx, x, y, w, h, round) {
	if (round > -1) {
		var title = ["1-10, get points if < 20%", "5 or 10, 10 only < 20%", "1-10, get points if < 15%", "people that passsed", "1-10, get points if < 10%", "1-15, points if < average" ][round];
		var r = rounds[round];
	}
	else {
		var title = 'Final scores';
		
		var  r = scores;
	}
	ctx.clearRect(x, y, w, h);
	
	var max = 0;
	
	var barh = h * .8;
	var barw = (w / r.length) - 1;
	ctx.font = Math.floor(barh * .2) + "px bohemian-typewriter";
	ctx.textAlign = 'center';
	ctx.fillStyle = 'black';
	ctx.fillText(title, x + w / 2, y + barh * .1);
	ctx.font = Math.floor(barh * .1) + "px bohemian-typewriter";
	y += h * .1;
	if (round === -1) {
		r = scores;
	}
	
	for (var i = 0; i < r.length; ++i) {
		max = Math.max(max, r[i]);
	}
	
	var interval = Math.max(1, Math.round((players / 100) * 10));
	ctx.fillStyle = 'green';
	
	for (var i = 0; i <= max; i += interval) {
		ctx.fillRect(x, y + barh - (i / max) * barh, w, 1);
		ctx.fillText(i, x + 10, y + barh - (i / max) * barh);
	}
	
	ctx.font = h * .1 + 'px bohemian-typewriter';
	for (var i = 1; i < r.length; ++i) {

		
		
		if (i === lastAnswer) {
			if (lastScore) 
				ctx.fillStyle = 'green';
			else
				ctx.fillStyle = 'red';
			
		}
		else
			ctx.fillStyle = 'black';
		ctx.fillRect(x + w * (i / r.length), y + barh, barw, -barh * (r[i] / max));
		ctx.textAlign = 'center';
		if (r.length < 20) {
			ctx.fillText(i * (round === 1 ? 5 : 1), x + w * (i / r.length) + .5 * barw, y + h);
		}
		else if (i % 5 === 0){
			ctx.fillText(i, x + w * (i / r.length) + .5 * barw, y + h);
		}
	}
	
	//draw threshold
	if (round === 5 || round === 3) {
		if (round === 5) {
			var threshold = avgRound5();
			
			ctx.fillStyle = 'blue';
			ctx.fillRect(x + (w * (threshold / 15)) - barw * .5, y, 1, barh);
			ctx.fillText(Math.round(threshold * 100) / 100, x + w * (threshold / 15), y + 8); 
		}
	}
	else {
		if (round % 2 === 0) {
			var threshold = players * (.1 + .05 * (2 - round / 2));
		}
		else if (round === 1) {
			var threshold = players * .2;
		}
		ctx.fillStyle = 'blue';
		ctx.fillRect(w * .1, y + barh - (threshold / max) * barh, w * .9, 1);
	}
}


function nextPart(e, auto) {
	started = true;
	if (writing) {
		if (!auto && currSpeechi > 3) {
			typeInt = Math.floor(typeInt * .1);
		}
	}
	if (!question && !writing && loaded) {
		
		typeInt = 60;
		var curr = script[phase];
		if (curr.type === 'speech') {
			writing = true;
			speak(curr.v, curr.value());
		}
		if (curr.type === 'question') {
			speak(1, curr.value());
			makeButtons(round);
			question = true;
			++round;
		}
		if (curr.type === 'fade') {
			$("#mainScreen").css("opacity", "0");
			setTimeout(nextPart, 1500);
		}
		if (curr.type === 'pic') {
			switch(curr.v) {
				case 0: 
					$("#mainScreen").css("background", "url(pics/cell.png)");
					var eye1 = $("<div class='eye'></div>");
					eye1.css("top", 0);
					$("body").append(eye1);
					setTimeout(function() {eye1.css("top", -20)}, 0);
					setTimeout(function() {eye1.css("top", -500)}, 1000);
					var eye2 = $("<div class='eye'></div>");
					eye2.css("top", 300);
					$("body").append(eye2);
					setTimeout(function() {eye2.css("top", 320).css("height", 0)}, 0);
					setTimeout(function() {eye2.css("top", 450)}, 1000);
					
					
					break;
				case 1: 
					$("#mainScreen").css("background", "url(pics/cell2.png)");
					if (!muted)
						sounds.clingy.play();
					break;
				case 2: 
					$("#mainScreen").css("background", "url(pics/interrogation.png)");
					if (!muted)
						sounds.buzzer.play();
					tick();
					swapPic();
					break;
			}
			$("#mainScreen").css("opacity", "1");
			setTimeout(nextPart, 1500);
		}
		if (curr.type === 'end') {
			setTimeout(end, 1000);
			return;
		}
		
		++phase;
	}
}
function speak(who, what) {
	currSpeech = what;
	currSpeechi = 0;
	currSpeaker = who;
	typing();
}

function typing() {
	++currSpeechi;
	$("#speech" + currSpeaker).html(currSpeech.substr(0, currSpeechi));
	var r = Math.floor(Math.random() * sounds.tw.length);
	if (!muted)
		sounds.tw[r].play();
	if (currSpeechi >= currSpeech.length) {
		if (started) {
			writing = false;
			setTimeout(function() {nextPart(0, true)}, 1000);
		}
	}
	else {
		setTimeout(typing, typeInt + Math.floor(Math.random() * typeInt));
	}
}
var ended = false;
function end() {
	if (!ended) {
		ended = true;
		$("#speaker0").css("opacity", 0);
		
		$("#mainScreen").css("opacity", 0);
		setTimeout(end2, 2000);
	}
}

function end2() {
	$("#speech1").css("height", 400).css("top", 30).css("left", 100).css("width", 300);
	scores[score] += 1;
	lastAnswer = score;
	newGraph(-1);
	speak(1, "Thanks for playing! This game was made for Ludum Dare 37 in about 20 hours. Hope you liked it. Please, enjoy the graphs of all the choices of other players. I want as big sample size as possible for this, so I would appreciate if you shared this.<br> You can play again, but only the answers from your first attempt will be recorded to the database and will affect other players. <br> If you like this sort of social experiment thingy, you will like my other project <a href='http://boltkey.cz/multiclick' target='_blank'>Multiclick</a>. <br> This game was heavily inspired by the prisoner's dilemma thing. " + ((players < 25) ?"One more thing. You were among first 25 'real' players, so some of the result may have been dummies." : ""))
}

$(document).click(nextPart);


var script = [
	{type: "speech", v: 1, value: function() {return "My head..."}},
	{type: "pic", v: 0, value: function() {return ""}},
	{type: "speech", v: 1, value: function() {return "This can't be good."}},
	{type: "pic", v: 1, value: function() {return ""}},
	{type: "speech", v: 0, value: function() {return "Subject 285412, you are coming with us."}},
	{type: "speech", v: 1, value: function() {return "What is going on? I think I can't resist now..."}},
	{type: "fade", v: 1, value: function() {return ""}},
	{type: "pic", v: 2, value: function() {return ""}},
	{type: "speech", v: 0, value: function() {return "Let's play a game. We will play 6 rounds and you can get up to 10 points in each. If you get 30 points in total, I will set you free. Otherwise, well, there will be blood."}},
	{type: "speech", v: 1, value: function() {return("Uhh... ok")}},
	{type: "speech", v: 0, value: function() {return "There were " + players + " prisoners here before you with the same questions. <br><span class='note'>Note: the other prisoners are all the players that played this game already.</span>"}},
	{type: "speech", v: 0, value: function() {return "Let's start with the first round. Choose a number between 1 and 10. You'll get that many points only if less than 20% of other people picked that number. Otherwise, you get nothing."}},
	{type: "question", v: 1, value: function() {return "Hmmm... Ok, I pick "}},
	{type: "speech", v: 0, value: function() {return lastScore ? ("You were lucky this time. You get your points. ") : ("HAHAHA. You greedy bastard. Too many other prisoners picked that number. ") + "On this graph you see what everyone else picked. "}},
	{type: "speech", v: 1, value: function() {return("What is this all about?!")}},
	{type: "speech", v: 0, value: function() {return "Just games and fun."}},
	{type: "speech", v: 0, value: function() {return "Next round. You can get 5 points for free, or 10 points. However, you will not get the 10 points if more than 20% of other people picked 10 points too. Just how greedy are you?"}},
	{type: "question", v: 1, value: function() {return "I pick "}},
	{type: "speech", v: 0, value: function() {return ["You are too greedy! No points for you!", "Playing it safe eh? Well, do what you think is right", "Betraying your friends? That is pretty mean of you!"][lastScore / 5]}},
	{type: "speech", v: 1, value: function() {return("Just let me go!")}},
	{type: "speech", v: 0, value: function() {return "This round is similar to the first one. Pick a number 1-10, but this time you only get points if less than 15% picked it too. <br><span class='note'>Note: Hover graphs to enlarge them. Each bar in the graph represents how many users picked each number. For example, in the first round " + rounds[0][5] + " people picked number 5. The blue bar represents the threshold."}},
	{type: "question", v: 1, value: function() {return "Ok. I pick "}},
	{type: "speech", v: 0, value: function() {return lastScore ? ("You guessed correctly...") : ("Nope, you greedy piece of junk.")}},
	{type: "speech", v: 1, value: function() {return "Ok. What else?"}},
	{type: "speech", v: 0, value: function() {return "Now it starts getting interesting. Round 4: How many other people you think passed this test? Just to remind you, there were " + players + " of them in total and to pass, you need at least 30 points."}},
	{type: "question", v: 1, value: function() {return "Hm. I think the answer is "}},
	{type: "speech", v: 0, value: function() {return "There were " + scores.slice(threshold, 100).reduce(function(s, a) {return s + a}, 0) + " survivors in total. You get " + lastScore + " points for your guess of " + lastAnswer + "."}},
	{type: "speech", v: 1, value: function() {return "Ok. Is this ending anytime soon?"}},
	{type: "speech", v: 0, value: function() {return "Just last 2 questions. I cannot wait to see if I can finally execute you."}},
	{type: "speech", v: 0, value: function() {return "Here we go: Pick a number between 1 and 10, but you get that many points only if less than 10% of people picked that number too."}},
	{type: "question", v: 1, value: function() {return "My answer is "}},
	{type: "speech", v: 0, value: function() {return lastScore ? ("Nice one... You little lucker...") : ("Not even close, haha.")}},
	{type: "speech", v: 1, value: function() {return "What is the final question?"}},
	{type: "speech", v: 0, value: function() {return "Final question! Pick a number between 1 and 15. Get that many points only if your number is lower than the average of all the numbers selected in this round by other prisoners."}},
	{type: "question", v: 1, value: function() {return "Huh, ok. My guess is gonna be "}},
	{type: "speech", v: 0, value: function() {return lastScore ? ("You did it. You must be cheating...") : ("Really? No. Is this too hard for you or something?")}},
	{type: "speech", v: 0, value: function() {return (score >= 30) ? ("Congratulations, you got " + score + " points. You win!") : ("Oh, what A SHAME! You didn't get enough points! " + score + " is not enough to let you live!")}},
	{type: "end"},
]

function makeButtons(round) {
	if (round === 3) {
		$("#selection").html("<input type='text' id='q3amt'></input><button class='answerButton' onclick='answer3()'>Confirm</button>");
		$("#q3amt").on("input", function(e) {
			console.log(e);
			var r = Math.floor(Math.random() * sounds.tw.length);
			if (!+e.currentTarget.value)
				$(e.currentTarget).val("");
			if (!muted)
				sounds.tw[r].play();
			}
		)
	} 
	
	else {
		$("#selection").html("");
		for (var i = 1; i < rounds[round].length; i += 1) {
			$("#selection").append("<button class='answerButton " + ((rounds[round].length > 12) ? "smallButton" : "") + "' onclick='answer(" + round + ", " + i + ")'>" + i * ((round === 1) ? 5 : 1) + "</button>");
		}
	}
}

function newGraph(round) {
	var a = $("<canvas class='graphcanvas " + ((round === -1) ? "scoregraph":"") + "' width=450 height=150></canvas>");
	var ctx = a[0].getContext('2d');
	$("#graphWrap").append(a);
	drawGraph(ctx, 0, 10, 450, 120, round);
	
}

//TODO: lock sound, more sound effects, ending, testing testing testing, backend validation, intro text?
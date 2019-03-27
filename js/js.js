
//create a playground ***************************

var cell = {
	hasObject: false,	
	init: function (x, y) {
		this.x = x;
		this.y = y;
	}
}

var playGround = [];
for (var x=0; x<9; x++) {
	for (var y=0; y<9; y++) {
		var cellCreate = Object.create(cell);
		cellCreate.init(x, y);	
		cellCreate.hasObject = false;		
		playGround.push(cellCreate);
		var newCell = document.createElement('span');
		var timely = document.getElementById('playGround');
		timely.appendChild(newCell);
		newCell.classList.add('cell');			
		
	};
};

//put hindrance ***************************

function randomInt(length){
	randNumber = Math.floor(Math.random() * (length));
	return randNumber;
};


var getRundNumber = 0;
for (var i=0; i<8; i++) {	
	getRundNumber = randomInt(playGround.length);			
	playGround[getRundNumber].hasObject = true;	
	$("span").eq(getRundNumber).addClass('cellHindrance');			
};			


//put players and create var for their position ***************************

var positionPlayer1 = randomInt(playGround.length);			
playGround[positionPlayer1].hasObject = true;	
$("span").eq(positionPlayer1).addClass('cellPlayer1');

var positionPlayer2 = randomInt(playGround.length);			
playGround[positionPlayer2].hasObject = true;	
$("span").eq(positionPlayer2).addClass('cellPlayer2');


//move ***************************

movePlayer1();

function findPossibeMove(position){
	var canMove = [];
	var possibleMove = [position-1, position-2, position-3, position+1, position+2, position+3, position-9, position-18, position-27, position+9, position+18, position+27];

//can move left? ***************************

for(var i=0; i<3; i++){
	if(possibleMove[i]>=0 && possibleMove[i]<playGround.length && !playGround[possibleMove[i]].hasObject) {
		canMove.push(possibleMove[i]);
	} else {
		break;
	}
};

//can move right? ***************************

for(var i=3; i<6; i++){
	if(possibleMove[i]>=0 && possibleMove[i]<playGround.length && !playGround[possibleMove[i]].hasObject) {
		canMove.push(possibleMove[i]);
	} else {
		break;
	}
};

//can move up? ***************************

for(var i=6; i<9; i++){
	if(possibleMove[i]>=0 && possibleMove[i]<playGround.length && !playGround[possibleMove[i]].hasObject) {
		canMove.push(possibleMove[i]);
	} else {
		break;
	}
};

//can move down? ***************************

for(var i=9; i<12; i++){
	if(possibleMove[i]>=0 && possibleMove[i]<playGround.length && !playGround[possibleMove[i]].hasObject) {
		canMove.push(possibleMove[i]);
	} else {
		break;
	}
};


for(var i=0; i<canMove.length; i++) {
	$("span").eq(canMove[i]).addClass('cellCanMove');
};
return canMove;
};


//palyers movements ***************************

function movePlayer1() {
	var canMove = findPossibeMove(positionPlayer1);

	for(var i=0; i<canMove.length; i++){
		$("span").eq(canMove[i]).on('click', function () {			
			playGround[positionPlayer1].hasObject = false;
			$("span").eq(positionPlayer1).removeClass('cellPlayer1');
			positionPlayer1 = canMove[i];	                                      //does this work?
			playGround[positionPlayer1].hasObject = true;
			$("span").eq(positionPlayer1).addClass('cellPlayer1');			
		});
		clearPlayGround();
			movePlayer2();
	};
};

function movePlayer2() {
	var canMove = findPossibeMove(positionPlayer2);

	for(var i=0; i<canMove.length; i++){
		$("span").eq(canMove[i]).on('click', function () {
			positionPlayer2 = canMove[i];	
			clearPlayGround();
			movePlayer1();		
		});
		
	};
};

function clearPlayGround(){
	$("span").each(function(){
		$(this).removeClass("cellCanMove");
	});	
};

//create objects ***************************

// Player set
/*
var Player = {
	health: 100,
	weapon: "no",
	attack: 0,	
}

var Weapon = {
	name: '';
	attack: '';
}
*/

//check if someone won ***************************
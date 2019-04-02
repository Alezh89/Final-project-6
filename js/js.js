//start game and define variables *************************

function startGame(){		
	createPlayGround ();	
	createPlayers();
	gamePlay();
}

let whosTurn = 1;
const playGround = [];
let player1;
let player2;
let weapons = [];
let someoneWon = false;

//gameplay main function ******************************

function gamePlay(){

	
	checkIfWon();
	if (whosTurn === 1) {
		makeMove(player1.position);
	} else {
		makeMove(player2.position);
	}
}

//create a playground ***************************

function createPlayGround (){
	$('input').remove('#playGame');
	$('ul').remove('#gameRules');	
	$('.playGround').attr('id','playGround');
	$('h2').css('color', 'black');
	var cell = { 
		hasObject: false,
		hasWeapon: false,		
	}

	for (var x=0; x<9; x++) {
		for (var y=0; y<9; y++) {
			var timely = document.getElementById('playGround');
			var cellCreate = Object.create(cell);			
			cellCreate.hasObject = false;	
			cellCreate.hasWeapon = false;
			playGround.push(cellCreate);
			var newCell = document.createElement('span');		
			timely.appendChild(newCell);
			newCell.classList.add('cell');			

		};
	};

//define obstacles

for (let i=0; i<8; i++) {	
	let getRundNumber = randomInt(playGround.length);			
	playGround[getRundNumber].hasObject = true;	
	$("span").eq(getRundNumber).addClass('cellHindrance').addClass('animated').addClass('zoomIn');
}

//put weapons *************************** 


placeWeapon('knife', 15, 'cellWeapon1');
placeWeapon('gun', 20, 'cellWeapon2');
placeWeapon('rifle', 25, 'cellWeapon3');			

}

function placeWeapon(name, attack, css){
	let positionWeapon = 0;
	positionWeapon = randomInt(playGround.length);
	const weapon = new Weapon(positionWeapon, name, attack, css);
	playGround[positionWeapon].hasWeapon = true;
	$("span").eq(positionWeapon).addClass(css).addClass('animated').addClass('bounce');	
	weapons.push(weapon);
}

// gives a random number *************************** 

function randomInt(length){
	let randNumber = 0;
	do {
		randNumber = Math.floor(Math.random() * (length));
	} while (playGround[randNumber].hasObject || playGround[randNumber].hasWeapon);
	return randNumber;
};



//put players and create var for their position *************************** 

function createPlayers(){
	let random = 0;
	do {
		random = randomInt(playGround.length);
	} while (playGround[random].hasObject);

	player1 = new Player(random, 'Player 1', 100, 'No', 5);
	playGround[random].hasObject = true;

	do {
		random = randomInt(playGround.length);
	} while (playGround[random].hasObject);

	player2 = new Player(random, 'Player 2', 100, 'No', 5);
	playGround[random].hasObject = true;
	
	$("span").eq(player1.position).addClass('cellPlayer1');
	$("span").eq(player2.position).addClass('cellPlayer2');
}



//move ***************************

function findPossibeMove(position){
	let canMove = [];
	const possibleMove = [position-1, position-2, position-3, position+1, position+2, position+3, position-9, position-18, position-27, position+9, position+18, position+27];

//can move left? ***************************

for(let i=0; i<3; i++){
	if(possibleMove[i]>=0 && possibleMove[i]<playGround.length && !playGround[possibleMove[i]].hasObject) {
		canMove.push(possibleMove[i]);
	} else {
		break;
	}
};

//can move right? ***************************

for(let i=3; i<6; i++){
	if(possibleMove[i]>=0 && possibleMove[i]<playGround.length && !playGround[possibleMove[i]].hasObject) {
		canMove.push(possibleMove[i]);
	} else {
		break;
	}
};

//can move up? ***************************

for(let i=6; i<9; i++){
	if(possibleMove[i]>=0 && possibleMove[i]<playGround.length && !playGround[possibleMove[i]].hasObject) {
		canMove.push(possibleMove[i]);
	} else {
		break;
	}
};

//can move down? ***************************

for(let i=9; i<12; i++){
	if(possibleMove[i]>=0 && possibleMove[i]<playGround.length && !playGround[possibleMove[i]].hasObject) {
		canMove.push(possibleMove[i]);
	} else {
		break;
	}
};

//if there the opponent? ********************************************

for(let i=0; i<possibleMove.length; i++) {
	if(whosTurn === 1) {
	if (player2.position === possibleMove[i]) {
		canMove.push(possibleMove[i]);
	}
} else if (whosTurn === 2) {
	if (player1.position === possibleMove[i]) {
		canMove.push(possibleMove[i]);
	}
}
}



for(let i=0; i<canMove.length; i++) {
	if (!playGround[canMove[i]].hasObject){
	$("span").eq(canMove[i]).addClass('cellCanMove');	
	}			
};
return canMove;
};


//clear playground ***************************

function clearPlayGround(){
	$("span").each(function(){
		$(this).removeClass("cellCanMove");
	});	
};

//create objects ***************************

class Player{
	constructor(position, name, health, weapon, attack) {
		this.position = position;
		this.name = name;
		this.health = health;
		this.weapon = weapon;	
		this.attack = attack;		
	}
	

// check and take/change a weapon **********************************

takeWeapon(compareCells) {	

	for (let weapon of weapons){

		if (compareCells === weapon.position) {
			this.attack = weapon.attack + 5;
			this.weapon = weapon.name;		
			playGround[compareCells].hasWeapon = false;
			$("span").eq(compareCells).removeClass(weapon.cssclass).removeClass('animated').removeClass('bounce');


			let positionWeapon = 0;
			positionWeapon = randomInt(playGround.length);
			weapon.position = positionWeapon;
			playGround[positionWeapon].hasWeapon = true;
			$("span").eq(positionWeapon).addClass(weapon.cssclass).addClass('animated').addClass('bounce');	

		}
	}

	$('#player1Weapon').text(player1.weapon);
	$('#player1Attack').text(player1.attack);
	$('#player2Weapon').text(player2.weapon);
	$('#player2Attack').text(player2.attack);
	
}

makeAttack(){
	if(this.name === player1.name){
		player2.health -= this.attack;		
		$('#player2Health').text(player2.health);	
	} else if(this.name === player2.name)
	player1.health -= this.attack;	
	$('#player1Health').text(player1.health);	
}
}


function makeMove(pos){
		let moves = findPossibeMove(pos);
		console.log(moves);
		for(let move of moves){			
			$("span").eq( move ).on('click', { value: move }, function ( event ) {	//************** HERE value MOVE takes position of another player, but I have never clicked on it! I think it is looping here 	????????????????????		
				console.log(moves);
				console.log(move);
				let newPosition = event.data.value;		

				if (whosTurn === 1) {
					if (player2.position === newPosition) {
						player1.makeAttack();
						whosTurn = 2;
					} else {						
						$("span").eq(pos).removeClass('cellPlayer1').removeClass('animated').removeClass('flash');;				
						$("span").eq(newPosition).addClass('cellPlayer1').addClass('animated').addClass('flash');	
						player1.takeWeapon(newPosition);
						player1.position = newPosition;
						whosTurn = 2;
						$('#whoMoves').text('Player 2');
						playGround[pos].hasObject = false;					
						playGround[newPosition].hasObject = true;
					}
				} else if (whosTurn === 2) {
					if (player1.position === newPosition) {
						player2.makeAttack();
						whosTurn = 1;
					} else {
						$("span").eq(pos).removeClass('cellPlayer2').removeClass('animated').removeClass('flash');
						$("span").eq(newPosition).addClass('cellPlayer2').addClass('animated').addClass('flash');
						player2.takeWeapon(newPosition);
						player2.position = newPosition;	
						whosTurn = 1;
						$('#whoMoves').text('Player 1');
						playGround[pos].hasObject = false;					
						playGround[newPosition].hasObject = true;
					}	
				}	
				moves = [];		
				clearPlayGround();
				gamePlay();
			})
		}
	}

class Weapon{
	constructor(position, name, attack, cssclass){
		this.position = position;
		this.name = name;
		this.attack = attack;
		this.cssclass = cssclass;
	}
}

//check if someone won ***************************

function checkIfWon(){
	if (player1.health <= 0) {
		gameOver('Player 2');		
	} else if (player2.health <= 0) {
		gameOver('Player 1');
	}
};

function gameOver(winner){
	$('#playGround').text(`Game over! ${winner} has won`);
	$('#playGround').addClass('display-2');
	$('#playGround').removeAttr('id');
}
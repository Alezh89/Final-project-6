//start game and define variables *************************

function startGame(){		
	createPlayGround ();	
	createPlayers();
	gamePlay();
}

let whosTurn = 1;
const sizePlayGround = 9; // Is used in defining proportions of the playground and number of ostacles. Should be not more than 15 max!
const playGround = [];
let player1;
let player2;
let movingPlayer;
let enemy;
let weapons = [];
let someoneWon = false;

//gameplay main function ******************************

function gamePlay(){

	
	if(!checkIfWon()){
		if (whosTurn === 1) {
			movingPlayer = player1;
			enemy = player2;		
		} else {
			movingPlayer = player2;
			enemy = player1;		
		}
		movingPlayer.makeMove();
	}
}

// change the turn between players

function changeTurn(){
	if (whosTurn === 1){									
		whosTurn = 2;	
		$('#whoMoves').text(player2.name);	
	} else {								
		whosTurn = 1;
		$('#whoMoves').text(player1.name);
	}	
}

//create a playground ***************************

function createPlayGround (){
	$('input').remove('#playGame');
	$('ul').remove('#gameRules');	
	$('.playGround').attr('id','playGround');
	$('#playGround').text('');
	$('#playGround').css('grid-template-columns',`repeat(${sizePlayGround}, 48px)`);
	$('#playGround').css('grid-template-rows',`repeat(${sizePlayGround}, 48px)`);	
	$('h2').css('color', 'black');
	let playground = document.getElementById('playGround');

	for (let x=0; x<sizePlayGround; x++) {
		let array = new Array();
		playGround.push(array);
		for (let y=0; y<sizePlayGround; y++) {			
			let cell = new Object();
			cell.coordinates = [x, y];		
			cell.hasWeapon = false; // Weapon it is something that can be picked up - you can move there
			cell.hasObject = false; // Object it is something that can't be picked up - you can't move there
			cell.hasPlayer = false;		
			array.push(cell);
			let newCell = document.createElement('span');		
			playground.appendChild(newCell);
			newCell.classList.add('cell');	
			newCell.id = `${x}${y}`;

		};		
	};

	
//define obstacles

for (let i=0; i<=sizePlayGround; i++) {	
	let rundNum = randomInt(sizePlayGround);			
	playGround[rundNum[0]][rundNum[1]].hasObject = true;	
	$(`#${rundNum[0]}${rundNum[1]}`).addClass('cellHindrance').addClass('animated').addClass('zoomIn');
}

//put weapons and items *************************** 


placeWeapon('knife', 15, 'cellWeapon1');
placeWeapon('gun', 20, 'cellWeapon2');
placeWeapon('rifle', 25, 'cellWeapon3');	
placeWeapon('granade', 10, 'cellWeapon4')
placeItem(helicopter);
placeItem(medicine);
helicopter.cssclass = 'cellHelicopter';
medicine.cssclass = 'cellMedicine';
}

function placeItem(item){
	let positionItem = 0;
	positionItem = randomInt(sizePlayGround);
	item.position = positionItem;
	playGround[positionItem[0]][positionItem[1]].hasWeapon = true;
	$(`#${positionItem[0]}${positionItem[1]}`).addClass(item.cssclass).addClass('animated').addClass('bounce');
}


function placeWeapon(name, attack, css){
	let positionWeapon = randomInt(sizePlayGround);
	const weapon = new Weapon(positionWeapon, name, attack, css);
	playGround[positionWeapon[0]][positionWeapon[1]].hasWeapon = true;
	$(`#${positionWeapon[0]}${positionWeapon[1]}`).addClass(css).addClass('animated').addClass('bounce');	
	weapons.push(weapon);
}


// gives a random number *************************** 

function randomInt(length){	
	let x = 0;
	let y = 0;
	do {
		x = Math.floor(Math.random() * (length));
		y = Math.floor(Math.random() * (length));
	} while (playGround[x][y].hasObject || playGround[x][y].hasWeapon);
	return [x, y];
};


//put players and create var for their position *************************** 

function createPlayers(){
	
	player1 = new Player([0, 0], 'Player 1', 100, 'fists', 5, 'cellPlayer1');
	player2 = new Player([0, 0], 'Player 2', 100, 'fists', 5, 'cellPlayer2');	
	player1.placePlayer(randomInt(sizePlayGround));	

	let [xEn, yEn] = player1.position;
	let notNearPlayer1 = randomInt(sizePlayGround);
	let [x, y] = notNearPlayer1;

	// place Player 2 not near Player 1


	while ((x-1 === xEn && y === yEn) || (x === xEn && y-1 === yEn) || (x === xEn && y+1 === yEn) || (x+1 === xEn && y === yEn)){
		notNearPlayer1 = randomInt(sizePlayGround);
		[x, y] = notNearPlayer1;
		alert('This!');
	}


	player2.placePlayer(notNearPlayer1);

	$('#player1Weapon').text(player1.weapon);
	$('#player1Attack').text(player1.attack);
	$('#player2Weapon').text(player2.weapon);
	$('#player2Attack').text(player2.attack);
	$('#player1Health').text(player2.health);
	$('#player2Health').text(player2.health);
}



//define possible moves ***************************

function findPossibeMove(position){
	const [x, y] = position;
	let canMove = [];	

//can move left? ***************************

let finishLine = sizePlayGround - 1;

for(let i=1;i<=3;i++){
	if ((y-i)>=0){
		if(!playGround[x][y-i].hasObject){
			canMove.push(playGround[x][y-i]);
			$(`#${x}${y-i}`).addClass('cellCanMove');
		} else {
			break;
		}
	} else if ((y-i)<0 && !playGround[x][finishLine].hasObject) {		
		canMove.push(playGround[x][finishLine]);
		$(`#${x}${finishLine}`).addClass('cellCanMove');
		finishLine--;
	} else {
		finishLine = 0;
		break;
	}
}


//can move right? ***************************

let startLine = 0;
for(let i=1;i<=3;i++){
	if ((y+i)<sizePlayGround){
		if(!playGround[x][y+i].hasObject){
			canMove.push(playGround[x][y+i]);
			$(`#${x}${y+i}`).addClass('cellCanMove');
		} else {
			break;
		}
	} else if ((y+i)>=sizePlayGround && !playGround[x][startLine].hasObject) {		
		canMove.push(playGround[x][startLine]);
		$(`#${x}${startLine}`).addClass('cellCanMove');
		startLine++;
	} else {
		startLine = 0;
		break;
	}
}


//can move up? ***************************

let finishBottom = sizePlayGround - 1;

for(let i=1;i<=3;i++){
	if ((x-i)>=0){
		if(!playGround[x-i][y].hasObject){
			canMove.push(playGround[x-i][y]);
			$(`#${x-i}${y}`).addClass('cellCanMove');
		} else {
			break;
		}
	} else if ((x-i)<0 && !playGround[finishBottom][y].hasObject) {		
		canMove.push(playGround[finishBottom][y]);
		$(`#${finishBottom}${y}`).addClass('cellCanMove');
		finishBottom--;
	} else {
		finishBottom = 0;
		break;
	}
}

//can move down? ***************************

let startTop = 0;
for(let i=1;i<=3;i++){
	if ((x+i)<sizePlayGround){
		if(!playGround[x+i][y].hasObject){
			canMove.push(playGround[x+i][y]);
			$(`#${x+i}${y}`).addClass('cellCanMove');
		} else {
			break;
		}
	} else if ((x+i)>=sizePlayGround && !playGround[startTop][y].hasObject) {		
		canMove.push(playGround[startTop][y]);
		$(`#${startTop}${y}`).addClass('cellCanMove');
		startTop++;
	} else {
		startTop = 0;
		break;
	}
}

return canMove;
};

// check if enemy is near and can be attacked *****************************************

function whereIsEnemy(){
	let [x, y] = movingPlayer.position;	
	let canAttack = false;
	let hasGranade = false;	
	if(movingPlayer.weapon === 'granade'){
		hasGranade = true;
	}			
	let [xEn, yEn] = enemy.position;	


// with granade x2 range

if(hasGranade){
	if((x-2 === xEn && y === yEn) || (x-1 === xEn && y === yEn) || (x === xEn && y-2 === yEn) || (x === xEn && y-1 === yEn) || (x === xEn && y+2 === yEn) || (x === xEn && y+1 === yEn) || (x+2 === xEn && y === yEn) || (x+1 === xEn && y === yEn)){
		canAttack = true;
		
	}

//other weapons

} else {
	if((x-1 === xEn && y === yEn) || (x === xEn && y-1 === yEn) || (x === xEn && y+1 === yEn) || (x+1 === xEn && y === yEn)){
		canAttack = true;
	}
}


return canAttack;

}

//clear playground ***************************

function clearPlayGround(){
	$("span").each(function(){
		$(this).removeClass("cellCanMove");
		$(this).prop("onclick", null).off("click");
	});		
};

function clearButtons(){
	$('#attackButton').remove();
}

// Objects ******************************************************************************************

class Player{
	constructor(position, name, health, weapon, attack, cssclass) {
		this.position = position;
		this.name = name;
		this.health = health;
		this.weapon = weapon;	
		this.attack = attack;	
		this.cssclass = cssclass;
	}

	placePlayer(receivePosition){
		let [x, y] = receivePosition;
		playGround[x][y].hasObject = true;
		playGround[x][y].hasPlayer = true;
		$(`#${x}${y}`).addClass(this.cssclass).addClass('animated').addClass('flash');
		this.position = receivePosition;
	}

	removePlayer(){
		let [x, y] = this.position;
		playGround[x][y].hasObject = false;
		playGround[x][y].hasPlayer = false;
		$(`#${x}${y}`).removeClass(this.cssclass).removeClass('animated').removeClass('flash');
	}

	makeMove(){
		let moves = findPossibeMove(this.position);
		let [x, y] = this.position;
		let couldAttack = false;

		//find out if there is an anamy around *********************	 

		if(whereIsEnemy()){
			couldAttack = true;
			let attackButton = document.createElement('button');				
			attackButton.class = "btn btn-danger";
			attackButton.id = 'attackButton';
			$('#attackButton').attr('type','button');
			if (whosTurn === 1) {
				$( "#attackPlayer1" ).append(attackButton);			
			} else {
				$( "#attackPlayer2" ).append(attackButton);
			}
			$('#attackButton').text(`Attack enemy with your ${movingPlayer.weapon}`);

		// 1. move with attack: attack if clicked button *********************

		$('#attackButton').on('click', function ( event ) {	
			movingPlayer.makeAttack();											
			clearPlayGround();
			clearButtons();
			changeTurn();
			gamePlay();
		})
	} else {
		couldAttack = false;
	}

	for(let move of moves){	
		let [newX, newY] = move.coordinates;

		// 2. move if no posibility or don't want to attack *********************		

		$(`#${newX}${newY}`).on('click', { value: move }, function ( event ) {	

			if(newX === helicopter.position[0] && newY === helicopter.position[1]){
				helicopterMove();
			} else {
				movingPlayer.takeWeapon(move.coordinates);	 //function to take a weapon if it is at the cell	
				movingPlayer.takeMedicine(move.coordinates);				
				movingPlayer.removePlayer();
				movingPlayer.placePlayer(move.coordinates);		

				// 3. if attack possibility appeared after move *********************	

				if(!couldAttack && whereIsEnemy()){
					let attackButton2 = document.createElement('button');				
					attackButton2.class = "btn btn-danger";
					attackButton2.id = 'attackButton';
					$('#attackButton').attr('type','button');
					if (whosTurn === 1) {
						$( "#attackPlayer1" ).append(attackButton2);			
					} else {
						$( "#attackPlayer2" ).append(attackButton2);
					}
					$('#attackButton').text(`Attack enemy with your ${movingPlayer.weapon}`);
					clearPlayGround();
					$('#attackButton').on('click', function ( event ) {	
						movingPlayer.makeAttack();													
						clearButtons();
						changeTurn();
						gamePlay();
					})
				} else {				
					clearPlayGround();
					clearButtons();
					changeTurn();
					gamePlay();
				}
			}
		})
	}
}

	// check and take/change a weapon **********************************

	takeWeapon(comparePosition) {	

		for (let weapon of weapons){

			if (comparePosition[0] === weapon.position[0] && comparePosition[1] === weapon.position[1]) {
				if(this.weapon != 'fists'){
					for (let gun of weapons){
						if (gun.name === this.weapon){
							let positionWeapon = 0;
							positionWeapon = randomInt(sizePlayGround);
							gun.position = positionWeapon;
							let [xWeapon, yWeapon] = positionWeapon;
							playGround[xWeapon][yWeapon].hasWeapon = true;
							$(`#${xWeapon}${yWeapon}`).addClass(gun.cssclass).addClass('animated').addClass('bounce');	
						}
					}
				}

				this.attack = weapon.attack + 5;
				this.weapon = weapon.name;		
				let [x, y] = comparePosition;
				playGround[x][y].hasWeapon = false;
				weapon.position = [];
				$(`#${x}${y}`).removeClass(weapon.cssclass).removeClass('animated').removeClass('bounce');
				$(`#player${whosTurn}Weapon`).empty();

				let weaponPic = $('<img>');
				weaponPic.attr('id',`weaponPic${whosTurn}`)
				weaponPic.appendTo($(`#player${whosTurn}Weapon`));
				$(`#weaponPic${whosTurn}`).addClass(`${weapon.cssclass}`)
				$(`#player${whosTurn}Attack`).text(movingPlayer.attack);
			}
		}
	}

	makeAttack(){
		enemy.health -= this.attack;							
		$('#player2Health').text(player2.health);				
		$('#player1Health').text(player1.health);		
	}

	takeMedicine(comparePosition){
		let [x, y] = medicine.position;
		if (comparePosition[0] === x && comparePosition[1] === y) {
			this.health += 20;			
			if(this.health>100){
				this.health = 100;
			}
			$('#player2Health').text(player2.health);				
			$('#player1Health').text(player1.health);
			$(`#${x}${y}`).removeClass(medicine.cssclass).removeClass('animated').removeClass('bounce');	
			placeItem(medicine);	
			playGround[x][y].hasWeapon = false;							
		}
	}
}

function helicopterMove(){
	let [newX, newY] = helicopter.position;	
	let [x, y] = movingPlayer.position;
	alert(`${movingPlayer.name} click to any cell where you want to fly`);
	
	$('.cell').each(function(){
		$(this).on('click', function ( event ) {			
			let flyHere = $(this).attr('id').split('');
			flyHere = flyHere.map(Number);
			let [flyX, flyY] = flyHere;			
			movingPlayer.removePlayer();			
			$(`#${newX}${newY}`).removeClass(helicopter.cssclass).addClass('animated').removeClass('bounce'); 	
			playGround[newX][newY].hasObject = false;		

			// check if there are weapons or medicine on the cell

			movingPlayer.takeWeapon(flyHere);	 //function to take a weapon if it is at the cell	
			movingPlayer.takeMedicine(flyHere);

			movingPlayer.placePlayer(flyHere);		

			//place helicopter back to the playground  removePlayer placePlayer

			placeItem(helicopter);
			changeTurn();
			clearPlayGround();
			clearButtons();
			gamePlay();
		})
	})
}


class Weapon{
	constructor(position, name, attack, cssclass){
		this.position = position;
		this.name = name;
		this.attack = attack;
		this.cssclass = cssclass;
	}
}

let helicopter = {		
	position: [],
	cssclass: 'cellHelicopter'		
}

let medicine = {		
	position: [],
	cssclass: 'cellMedicine',	
	
}


//check if someone won ***************************

function checkIfWon(){
	let itsOver = false;
	if (player1.health <= 0) {
		gameOver('Player 2');	
		itsOver = true;	
	} else if (player2.health <= 0) {
		gameOver('Player 1');
		itsOver = true;
	}
	return itsOver;
};

function gameOver(winner){
	$('#playGround').text(`Game over! ${winner} has won`);
	$('#playGround').addClass('display-2');
	$('#playGround').removeAttr('id');	
	$('#turn').replaceWith('<input>')
	$('input').attr('id', 'playGame').attr('value', 'Restart the game').attr('type', 'button');
	$('#playGame').addClass('button');	

	$('#playGame').on('click', function ( event ) {			
		window.location.reload()		
	})
	
}
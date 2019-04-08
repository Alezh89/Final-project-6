
// set global variables
let whosTurn = 1;
const sizePlayGround = 9; // Is used in defining proportions of the playground and number of ostacles. Should be not more than 15 max!
const playGround = [];
let player1;
let player1Name = 'Player 1';
let player2;
let player2Name = 'Player 2';
let movingPlayer;
let enemy;
let weapons = [];
let someoneWon = false;

// start the game *************************

function startGame(){		
	createPlayGround ();	
	createPlayers();		
	showPanel();
	gamePlay();
}

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

function showPanel(){
	let controlPanel = document.getElementById('controlPanel');
	let youMoveSign = document.createElement('h2');	
	controlPanel.append(youMoveSign);		
	youMoveSign.id = 'turn';
	$('#turn').addClass('col-12').addClass('text-center').text('Your move ');
	let thisPlayerMove = document.createElement('span');
	thisPlayerMove.id = 'whoMoves';
	youMoveSign.append(thisPlayerMove);
	$('#whoMoves').text('Player 1');
	let buttonFinish = document.createElement('input');		
	controlPanel.append(buttonFinish);	
	buttonFinish.id = 'exit';
	$('#exit').addClass('btn').addClass('btn-dark').addClass('mt-2').attr('value', 'Finish the game').attr('type', 'button').on('click', () => window.location.reload());
	
	
				
	}

// change the turn between players

function changeTurn(){
	if (whosTurn === 1){									
		whosTurn = 2;	
		$('#whoMoves').text(`${player2.name}`);	
	} else {								
		whosTurn = 1;
		$('#whoMoves').text(`${player1.name}`);
	}	
}

//create a playground ***************************

function createPlayGround (){	
	player1Name = $('#player1Name').val();
	player2Name = $('#player2Name').val();		
	$('.playGround').attr('id','playGround');
	$('#playGround').empty();
	$('#gameRules').empty();
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
	
	player1 = new Player([0, 0], player1Name, 100, 'fists', 5, 'cellPlayer1');
	player2 = new Player([0, 0], player2Name, 100, 'fists', 5, 'cellPlayer2');	
	
	// check the input

	if (player1.name == '') {
		player1.name = 'Player 1';
	} else if (player1.name.length > 10){
		player1.name =  player1.name.substring(0, 10);
	}
	if (player2.name == '') {
		player2.name = 'Player 2';
	} else if (player2.name.length > 10){
		player2.name = player2.name.substring(0, 10);
	}
	$('#player1Lable').text(player1.name);
	$('#player2Lable').text(player2.name);
	player1.placePlayer(randomInt(sizePlayGround));	
	$('#whoMoves').text(`${player1.name}`);

	let [xEn, yEn] = player1.position;
	let notNearPlayer1 = randomInt(sizePlayGround);
	let [x, y] = notNearPlayer1;

	// place Player 2 not near Player 1


	while ((x-1 === xEn && y === yEn) || (x === xEn && y-1 === yEn) || (x === xEn && y+1 === yEn) || (x+1 === xEn && y === yEn)){
		notNearPlayer1 = randomInt(sizePlayGround);
		[x, y] = notNearPlayer1;		
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
	$('#defendButton').remove();
	$('#attackButton').prop("onclick", null).off("click");
	$('#defendButton').prop("onclick", null).off("click");
	enemy.defend = 'false';
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

		// create the deffend button

		createAttackDefendButtons('defend');		

		//find out if there is an anamy around and create the attack button *********************	 

		if(whereIsEnemy()){
			couldAttack = true;
			createAttackDefendButtons('attack');

		// 1. move with attack: attack if clicked button *********************

		$('#attackButton').on('click', function ( event ) {	
			movingPlayer.makeAttack();			
		})
		} else {
			couldAttack = false; //if player didn't have a chance to attack, he can have it after movement
		}

					// 2. defend button is clicked - no attack or movement ********************************

					$('#defendButton').on('click', function ( event ) {
						movingPlayer.defendSelf();
					})

					for(let move of moves){	
						let [newX, newY] = move.coordinates;


									// 3. move if no posibility or don't want to attack and defend is not clicked *********************		

									$(`#${newX}${newY}`).on('click', { value: move }, function ( event ) {	

										if(newX === helicopter.position[0] && newY === helicopter.position[1]){
											helicopterMove();
										} else {
											movingPlayer.takeWeapon(move.coordinates);	 //function to take a weapon if it is at the cell	
											movingPlayer.takeMedicine(move.coordinates);				
											movingPlayer.removePlayer();
											movingPlayer.placePlayer(move.coordinates);		

														// 4. if attack possibility appeared after move *********************	

														if(!couldAttack && whereIsEnemy()){
															createAttackDefendButtons('attack');
															clearPlayGround();
															$('#attackButton').on('click', function ( event ) {	
																movingPlayer.makeAttack();						
															})
															$('#defendButton').on('click', function ( event ) {
																movingPlayer.defendSelf();
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

	makeAttack(){
		if(enemy.defend == 'true'){
			enemy.health = enemy.health - (this.attack / 2);
		} else {
			enemy.health -= this.attack
		}
		if (whosTurn == 1){										
		$('#player2Health').text(player2.health).addClass('animated').addClass('heartBeat');				
		$('#player1Health').removeClass('animated').removeClass('heartBeat');
		} else {
		$('#player2Health').removeClass('animated').removeClass('heartBeat');	
		$('#player1Health').text(player1.health).addClass('animated').addClass('heartBeat');
		}		
		clearPlayGround();
		clearButtons();
		changeTurn();
		gamePlay();
	}

	defendSelf(){
		this.defend = 'true';
		clearPlayGround();
		clearButtons();
		changeTurn();
		gamePlay();
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

function createAttackDefendButtons(buttonAction){
	let thisButton = document.createElement('button');			
	thisButton.id = `${buttonAction}Button`;			
	$(`#${buttonAction}Button`).attr('type','button');
	if (whosTurn === 1) {
		$( "#attackPlayer1" ).append(thisButton);			
	} else {
		$( "#attackPlayer2" ).append(thisButton);
	}
	if (buttonAction == 'attack'){
		$(`#${buttonAction}Button`).addClass('btn').addClass('btn-danger');
		$(`#${buttonAction}Button`).text(`Attack enemy with your ${movingPlayer.weapon}`);
	} else {
		$(`#${buttonAction}Button`).addClass('btn').addClass('btn-success');
		$(`#${buttonAction}Button`).text('Defend (50% damage)');
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
			$(`#${newX}${newY}`).removeClass(helicopter.cssclass).removeClass('animated').removeClass('bounce'); 	
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
	constructor(position, name, attack, cssclass, defend = 'false'){
		this.position = position;
		this.name = name;
		this.attack = attack;
		this.cssclass = cssclass;
		this.defend = defend;
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
		gameOver(`${player2.name}`);	
		itsOver = true;	
	} else if (player2.health <= 0) {
		gameOver(`${player1.name}`);
		itsOver = true;
	}
	return itsOver;
};

function gameOver(winner){
	$('#playGround').text(`Game over! ${winner} won`).addClass('animated').addClass('zoomInDown');
	$('#playGround').addClass('display-2');
	$('#playGround').removeAttr('id');	
	$('#turn').empty();	
	$('#exit').attr('value', 'Restart the game');
	$('#playGame').addClass('button');	

	$('#playGame').on('click', function ( event ) {			
		window.location.reload()		
	})
	
}
var scribble = new Scribble();              // global mode
var socket = io();
 
var gameOn = false;
var enemyHand_length = 0;

 
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

class Hero{
	constructor(type){
		this.type = type;
	}

	show(){
		if (this.heroStats != undefined) {
			push()
			fill(255)
			strokeWeight(5)
			stroke(0)
			textSize(33)
			this.width =  scaleToScreen(175, 1920, width);
			this.height = scaleToScreen(175, 1080, height);
			this.x = scaleToScreen(864, 1920, width);

			push()
			if (this.type === "enemy") {
				this.y =  scaleToScreen(100, 1080, height);
 				// mana back on le met ici pour le trigger qu'une seule fois
 				push()
				fill(255, 100)
				rect(scaleToScreen(300-20, 1920, width), scaleToScreen(100-20, 1080, height),  scaleToScreen(30*10+10, 1920, width), scaleToScreen(30+10, 1080, height)) // <---------------------
				rect(scaleToScreen(1350-20, 1920, width), scaleToScreen(800-20, 1080, height),  scaleToScreen(30*10+10, 1920, width), scaleToScreen(30+10, 1080, height)) // <---------------------
				pop()
			} else if (this.type === "you") {
				this.y =  scaleToScreen(680, 1080, height);
			}
			// hero 
			// rect( this.x,  this.y, 	 this.width, this.height);
			image(heroImg, this.x, this.y, this.width, this.height)
			textAlign(RIGHT, BOTTOM)
			text(this.heroStats.hp, this.x, this.y, this.width ,this.height)
		
			pop() 

			//mana
			push()
				for (var i = 0; i < this.heroStats.mana; i++) {
					fill(14, 210, 249)
					stroke(0)
					strokeWeight(2)
					if (this.type === "enemy"){
						scribble.scribbleEllipse(scaleToScreen(300+i*30, 1920, width), scaleToScreen(100, 1080, height), scaleToScreen(30, 1920, width), scaleToScreen(30, 1080, height));
					} else {
						scribble.scribbleEllipse(scaleToScreen(1350+i*30, 1920, width), scaleToScreen(800, 1080, height), scaleToScreen(30, 1920, width), scaleToScreen(30, 1080, height));

					}
				}
				for (var i = this.heroStats.mana; i < this.heroStats.manaMax; i++) {
					fill(50, 50, 50);
					stroke(0)
					strokeWeight(2)
					if (this.type === "enemy"){
						ellipse(scaleToScreen(300+i*30, 1920, width), scaleToScreen(100, 1080, height), scaleToScreen(30, 1920, width), scaleToScreen(30, 1080, height));
					} else {
						ellipse(scaleToScreen(1350+i*30, 1920, width), scaleToScreen(800, 1080, height), scaleToScreen(30, 1920, width), scaleToScreen(30, 1080, height));

					}								
				}

			pop()

		}
	}
	detecthover(){
		if (collidePointRect(mouseX, mouseY, this.x, this.y, this.width,   this.height)) {
			this.hover = true;
		} else  {
			this.hover = false;
		} 
	}
}
class Board{
	constructor(){
		this.friendlyMinion= [];
		this.enemyMinion= [];
	}

	show(){
		for (var i = 0; i < this.friendlyMinion.length;  i++) {
			if (i === clickedMinionI) {
			 	this.friendlyMinion[i].selected = true;
 
			} else {
	 			this.friendlyMinion[i].selected = false;
			}
			this.friendlyMinion[i].minionX = scaleToScreen(400+i*145+i*5, 1920, width); 
			this.friendlyMinion[i].minionY = scaleToScreen(480, 1080, height);
			this.friendlyMinion[i].showMinion();
			//rect(scaleToScreen(400+i*145+i*5, 1920, width), scaleToScreen(480, 1080, height), scaleToScreen(100, 1920, width), scaleToScreen(145, 1080, height))
		}

		for (var i = 0; i < this.enemyMinion.length;  i++) { 
			this.enemyMinion[i].minionX = scaleToScreen(400+i*145+i*5, 1920, width); 
			this.enemyMinion[i].minionY = scaleToScreen(300, 1080, height);
			
			this.enemyMinion[i].showMinion();
			//rect(scaleToScreen(400+i*145+i*5, 1920, width), scaleToScreen(300, 1080, height), scaleToScreen(100, 1920, width), scaleToScreen(145, 1080, height));
		}
		for (var i = 0; i < this.friendlyMinion.length; i++) { 
			this.friendlyMinion[i].detecthover();

		}
		for (var i = 0; i < this.enemyMinion.length; i++) { 
			this.enemyMinion[i].detecthover();
		}

	}
}
 
 

class Hand{
	constructor(){
		this.card = [];
		this.margin = 0;
 

		setTimeout( ()=> {  
			this.calcul();
		}, 100)

	}
	calcul(){
		for (var i = 0; i < this.card.length; i++) {
			this.card[i].x = i*this.card[i].width ;
		}

		if (this.card.length > 0 && !this.card[this.card.length-1].hover){
			var maxX = this.card[this.card.length-1].x+this.card[this.card.length-1].width;
			maxX = parseInt(maxX)
			this.margin = (width-maxX)/2

		}  
		for (var i = 0; i < this.card.length; i++) {
			if (i > 0 && !this.card[i].holdingClick) { 
				this.card[i].x = int(this.card[i-1].x + this.card[i-1].width )  ;
				this.card[i].y = int(height -  this.card[i].height ) - ((-1)**i) ;

			}   else if (this.card[i].holdingClick) {
				this.card[i].x = int(int(mouseX-this.card[i].width/2));
				this.card[i].y = int(int(mouseY-this.card[i].height/2));


					
			} else if (i==0){
				this.card[i].x = this.margin; // change ça abruti // c'est toi l'abruti j'ai réussi a fix le bug // je confirme // moi aussi mais en fait c'est pas ouf  
				this.card[i].y = int(height -  this.card[i].height);		
			} 
		}

	}

	show(){
  		for (var i = 0; i < this.card.length; i++) {
		  	this.card[i].detecthover();
			this.card[i].showCard();
		}
	}	
}
var hand, img1, img2, boardImg, button, cardBack, heroImg;
var board, hsFont;


var idle_yourTurn, pressed_yourTurn, enemyTurn;
function preload() {  
	boardImg = loadImage("image/board.png", windowWidth, windowHeight)
	cardBack = loadImage("image/cardback.png")
	//img2 = loadImage('https://art.hearthstonejson.com/v1/512x/EX1_284.jpg', 100, 100);
	heroImg = loadImage("image/drboom.jpg")
	hsFont = loadFont("hsfont.otf")
	
	idle_yourTurn =  "image/idle_yourTurn.cur" 
	pressed_yourTurn = "image/pressed_yourTurn.cur" 
	enemyTurn =  "image/enemyTurn.cur" 

}

var hero, enemyHero, heroPower, enemyHeroPower;
function setup(){
	textFont(hsFont);
	setupCasseBrique()
	board = new Board();
	hand = new Hand();
 	hero = new Hero("you");
 	enemyHero = new Hero("enemy");

 	heroPower = new HeroPower("you");
 	enemyHeroPower = new HeroPower("enemy");
 	
 	
 	createCanvas(windowWidth,windowHeight)
  	
  	button = createButton('Next round');
	button.position(19, 19);
  	button.mousePressed(newTurn);
	button.style('width', String(scaleToScreen(155, 1920, width))+"px");
	button.style('height', String( scaleToScreen(200, 1080, height))+"px");
	button.addClass("next-button")
	button.style("border-style", "outset")
	button.style("border-width", "thin")
	frameRate(60)

}
function newTurn(){
	socket.emit("changeTurn")

}
function windowResized(){
	resizeCanvas( windowWidth  , windowHeight  )
 	hand.calcul();
	button.style('width', String(scaleToScreen(155, 1920, width))+"px");
	button.style('height', String( scaleToScreen(200, 1080, height))+"px");
				

}
function draw(){
	background(0);
	if (gameOn) {  
		image(boardImg, 0, -40, width, height)
		push()
		button.position(scaleToScreen(1452, 1920, width), scaleToScreen(310, 1080, height)); 
			if (hand.turn) {
				button.style('background-color', '#e8ae1e');

			} else {

				button.style('background-color', '#eff4ed');

			}
		pop();

		enemyHero.show();
		// enemyHero.detecthover();
		hero.show();
		// hero.detecthover();

		board.show();
		hand.show();

		heroPower.show();
		enemyHeroPower.show();

		if (mouseIsPressed && hand.turn){
			cursor(pressed_yourTurn)
		} else if (hand.turn) {
			cursor(idle_yourTurn)
		} else {
			cursor(enemyTurn)
		}

		for (var i = 0; i < enemyHand_length; i++) {
			image(cardBack,  i*50  + (width-enemyHand_length*50)/2 , scaleToScreen(-125, 1080, height), scaleToScreen(100, 1920, width), scaleToScreen(200, 1080, height))
		}

		push()
		stroke(0, 0, 255)
		if (cardForWaitingSelectI>-1) {  
			scribble.scribbleLine(mouseX, mouseY, hand.card[cardForWaitingSelectI].x+hand.card[cardForWaitingSelectI].width/2, hand.card[cardForWaitingSelectI].y)
			textSize(20)
			fill(255)
			stroke(0)
			strokeWeight(2)

			textAlign(CENTER, TOP)

			text("Effect:" + hand.card[cardForWaitingSelectI].stats.text, 0, 0, width, height);


		}
		pop()
 	} else {
		push()
		drawCasseBrique()
		pop()
		}
}
function mouseMoved(){
	if (gameOn) { 
		enemyHero.detecthover();
		hero.detecthover()

		heroPower.detecthover();
		enemyHeroPower.detecthover()
	}
}
var clickedMinionI = -1; // this is for board minions.
var cardForWaitingSelectI = -1; // this is for minions with battlecry in hand.
function mouseReleased(){


	for (var i = 0; i < hand.card.length; i++) {

		if (!heroPower.selected && cardForWaitingSelectI === -1 && hand.card[i].holdingClick && hand.card[i].y < windowHeight-scaleToScreen(500, 1920, width)) {
			if (!hand.card[i].stats.hasToSelect){
				socket.emit("cardPlaced",  { stat:hand.card[i].stats, selected_entityType : "none", selected_entity_stat : "none"  });
			} else {  
				cardForWaitingSelectI = i;
			}
			//socket.emit("cardPlaced", hand.card[i].stats);
			return
		}  

	}	 
	for (var i = 0; i < board.friendlyMinion.length; i++) {
		if (board.friendlyMinion[i].hover && board.friendlyMinion[i].place === "friendlyBoard") {
			if (!heroPower.selected) { 
				if (cardForWaitingSelectI === -1) { 
					clickedMinionI = i;
					return
				}
				else if (cardForWaitingSelectI > -1) {
					socket.emit("cardPlaced",  { stat:hand.card[cardForWaitingSelectI].stats, selected_entityType : "friendlyMinion", selected_entity_stat : board.friendlyMinion[i].stats  });
					cardForWaitingSelectI = -1;
					return
				}
			} else if (heroPower.selected) {
							 
			} 



		}
	}

	
	for (var i = 0; i < board.enemyMinion.length; i++) {
		if (board.enemyMinion[i].hover && board.enemyMinion[i].place === "enemyBoard") {
			if (!heroPower.selected) { 
				if (clickedMinionI > -1 && cardForWaitingSelectI === -1) {  
					socket.emit("tradeMinion", {
						friendlyMinion: board.friendlyMinion[clickedMinionI].stats,
						enemyMinion: board.enemyMinion[i].stats,
					})
					clickedMinionI = -1;

			  	} else if (cardForWaitingSelectI > -1) {
			  		socket.emit("cardPlaced",  { stat:hand.card[cardForWaitingSelectI].stats, selected_entityType : "enemyMinion", selected_entity_stat : board.enemyMinion[i].stats  });
			  		cardForWaitingSelectI = -1;
	  			}
			  		return
		  	} else if (heroPower.selected) {

		  	}

			
		}
	}

	 if (enemyHero.hover) {
	 	if (clickedMinionI > -1 && cardForWaitingSelectI === -1) {  
		 	socket.emit("attackEnemyHero", board.friendlyMinion[clickedMinionI].stats)
			clickedMinionI = -1;	 	
		} else if (cardForWaitingSelectI > -1 && clickedMinionI === -1) {
			socket.emit("cardPlaced",  { stat:hand.card[cardForWaitingSelectI].stats, selected_entityType : "enemyHero" , selected_entity_stat : enemyHero.heroStats  });
			cardForWaitingSelectI = -1;	 	
		}
 			return;
	 }

	 if (heroPower.hover){
	 	heroPower.selected = true;
	 }

	if (hero.hover) {
		if (clickedMinionI === -1 && cardForWaitingSelectI > -1) {
			socket.emit("cardPlaced",  { stat:hand.card[cardForWaitingSelectI].stats, selected_entityType : "hero" , selected_entity_stat : hero.heroStats  });
			cardForWaitingSelectI = -1;
		}
	}
	cardForWaitingSelectI = -1
  	clickedMinionI = -1;	
  	heroPower.selected = false
  	return;
 

 }

socket.on("setRoom", (gameNbr) => {
	socket.emit("setRoom", gameNbr)
	gameOn = true;
})
socket.on("enemyDisconnected", () => {
	socket.emit("enemyDisconnected")
	gameOn = false;
	setupCasseBrique()
}) 
socket.on("newTurn", (turn) => {
	if (hand != undefined)
	hand.turn = turn;
}) 
function rafAsync() {
    return new Promise(resolve => {
        requestAnimationFrame(resolve); //faster than set time out
    });
}

async function checkElement(vari) {
    while (vari === undefined) {
        await rafAsync()
    }
    return true;
} 



 socket.on("syncHand", (hand_cards) => {
 	console.log("a")
	// on doit mettre une promise ici.
	 //  checkElement(hand) //use whichever selector you want
	//  .then((element) => {
		

	// });
	if (hand === undefined)
	return

	hand.card = [];
 	for (var i = 0; i < hand_cards.length; i++) {
 		var c = new Card();
 		c.stats = hand_cards[i].stats;
 		c.place = "hand" 
 		c.img = loadImage("/cardImage/"+c.stats.id+".jpg", 100, 100);
 		//c.img = loadImage('https://art.hearthstonejson.com/v1/512x/'+String(c.stats.artId)+'.jpg', 100, 100);

 		hand.card.push(c)
 	}
}) 

 socket.on("syncBoard", (board_cards) => {
 	console.log(board_cards);
	if (board == undefined)
		return
	board.friendlyMinion = [];
 	for (var i = 0; i < board_cards.length; i++) {

 		var c = new Card();
 		c.stats = board_cards[i].stats;
 		c.place = "friendlyBoard";
 		c.img = loadImage("/cardImage/"+c.stats.id+".jpg", 100, 100);
 		board.friendlyMinion.push(c)

 	}
}) 
 socket.on("syncEnemyBoard", (enemyBoard_cards) => {
 	if (board == undefined)
 		return
	board.enemyMinion = [];
 	for (var i = 0; i < enemyBoard_cards.length; i++) {
 		var c = new Card();
 		c.stats = enemyBoard_cards[i].stats;
 		c.place = "enemyBoard";
 		c.img = loadImage("/cardImage/"+c.stats.id+".jpg", 100, 100);
 		board.enemyMinion.push(c)

 	}
}) 
 

socket.on("syncEnemyHand", (enemyHand_length_) => {
	enemyHand_length = enemyHand_length_
}) 

socket.on("syncEnemyHero", (heroStats) => {
	if (enemyHero != undefined) { 
		enemyHero.heroStats = heroStats;
		if (enemyHero.heroStats.hp <= 0) {
			alert("you won")
		}
	}
}) 
socket.on("syncHero", (heroStats) => {
	if (hero != undefined) {  
		hero.heroStats = heroStats;
		if (hero.heroStats.hp <= 0) {
			alert("you lost")
		} 
	}
}) 

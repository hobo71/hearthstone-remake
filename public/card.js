function scaleToScreen(x, xMax, yMax){
	return  int( ( (x)*yMax)   /xMax)
}
class Card{
	constructor(){
		this.width = 300/2.4;
		this.height = 500/2.4;
		this.x = 0;
		this.y = 0;
		this.minionX = 0;
		this.minionY = 0;
		this.minionWidth = 0;
		this.minionHeight = 0;
		this.selected = false;
		this.hover = false;
		this.holdingClick = false;
		this.turn = false;

		// this.place = false;
		// this.stats = {
		// 	cost : undefined,
		// 	name : undefined,
		// 	rarety : undefined,
		// 	type : undefined,
		// 	atk : undefined,
		// 	def : undefined,
		// 	canAttack: undefined
		// }
 
		this.img = undefined;
		}

	showCard(){
		// card back
		//this.width+=1.2;
	 	//this.height+=1.1;
		textAlign(CENTER, CENTER)
		strokeWeight(10);
		if (hand != undefined && hand.turn && hero.heroStats.mana >= this.stats.cost && this.place === "hand") {  
			stroke(0, 255, 0)
			scribble.scribbleRect( this.x+this.width/2, this.y+this.height/2, this.width, this.height);
		}
		else {  
			stroke(0)
		}
		fill(232, 222, 157)
		rect(this.x, this.y, this.width, this.height)
		
		// img 
  		push();
  		 blendMode(DARKEST)
  		image( this.img, this.x, this.y, this.width, this.height/1.2);
		pop();
		// card cost
		push()
		stroke(0)
		strokeWeight(1)
		fill(42, 167, 234)
		ellipse(this.x+15, this.y+15, scaleToScreen(30, 1920, width));
		strokeWeight(3)
		stroke(0)
		textSize(29)
		fill(255)
		text( this.stats.cost, this.x, this.y-5,  30,  30)
		pop()
		// bottom part 
		fill(102, 83, 78)
	 	rect(this.x, this.y + this.height-this.height/3, this.width, this.height/3)		
 		// text description
 		textSize((this.width+this.height)/35)
 		fill(0)
 		noStroke()
 		textAlign(CENTER, CENTER)
 		// text( "Charge", this.x+this.width/3, this.y + this.height-this.height/4, )
 		text(this.stats.text, this.x, this.y + this.height-this.height/3, this.width, this.height/3)
		push()
		noStroke()

		if (this.stats.attack != null) { 
			// atk
 			fill(247, 156, 7, 180)
			rect(this.x+scaleToScreen(25, 1920+1080, this.width+this.height),
			this.y+this.height - scaleToScreen(200+31, 1920+1080, this.width+this.height),
			scaleToScreen(200, 1920+1080, this.width+this.height),
			scaleToScreen(200, 1920+1080, this.width+this.height))

			
			strokeWeight(3)
			stroke(0)
			fill(255)
			textSize(scaleToScreen(250, 1920+1080, this.width+this.height))
			textAlign(LEFT, BOTTOM)
			text( this.stats.attack, this.x+scaleToScreen(125, 1920+1080, this.width, this.height), this.y, this.width, this.height)
		} 
		if (this.stats.health != null) { 
			// def
			noStroke()
			fill(168, 28, 37, 180)
			// rect(this.x+this.width- scaleToScreen(25, 1920, width), this.y+this.height- scaleToScreen(40, 1080, height), scaleToScreen(23, 1920, width),  scaleToScreen(35, 1080, height))
			
			rect(this.x+this.width-scaleToScreen(221, 1920+1080, this.width+this.height),
			this.y+this.height - scaleToScreen(200+31, 1920+1080, this.width+this.height),
			scaleToScreen(200, 1920+1080, this.width+this.height),
			scaleToScreen(200, 1920+1080, this.width+this.height))


			strokeWeight(3)
			fill(255)
			stroke(0)
			textSize(scaleToScreen(250, 1920+1080, this.width+this.height))
			textAlign(RIGHT, BOTTOM)
			text( this.stats.health, this.x+scaleToScreen(50, 1920+1080, this.width+this.height) , this.y, this.width-10, this.height)
		}
		pop()
		// name 
 		textAlign(CENTER, CENTER)

		fill(192, 163, 125)
		rect(this.x, this.y + this.height-this.height/3 - this.height/10, this.width, this.height/10)
		fill(255)
		strokeWeight(4)
		stroke(0)
		textSize(15)

		text( this.stats.name , this.x, this.y + this.height-this.height/3 - this.height/10, this.width, this.height/10)

	}

	showMinion(){
		//push()
		//fill(255, 0, 0); 
		//rect(scaleToScreen(this.minionX, 1920, width), scaleToScreen(this.minionY, 1080, height), scaleToScreen(100, 1920, width), scaleToScreen(145, 1080, height));
		//pop()

		this.img.mask(boardImg, 0, 0)
		push()  
		if (this.hover) { 
 			blendMode(MULTIPLY);
 		}
		this.minionWidth  = scaleToScreen(100, 1920, width);
		this.minionHeight  = scaleToScreen(145, 1080, height);
		if (this.selected) {
			strokeWeight(5)
			stroke(255, 0, 0)
			scribble.scribbleLine(this.minionX+this.minionWidth/2, this.minionY+this.minionHeight/2, mouseX, mouseY );

			// line(this.minionX+this.minionWidth/2, this.minionY+this.minionHeight/2, mouseX, mouseY)
 			// blendMode(LIGHTEST);
		}
		fill(0, 255, 0);
		image(this.img, this.minionX , this.minionY , this.minionWidth, this.minionHeight)
		//rect(scaleToScreen(this.minionX, 1920, width), scaleToScreen(this.minionY, 1080, height), scaleToScreen(100, 1920, width), scaleToScreen(145, 1080, height))
		noFill()
 		if (this.stats.canAttack) {
 			stroke(0, 255, 0);
 		}
 		else {
 			stroke(0)
 		}

		strokeWeight(3)
		rect(this.minionX , this.minionY, this.minionWidth, this.minionHeight)
		ellipseMode(CORNER)
		ellipse( this.minionX , this.minionY ,this.minionWidth, this.minionHeight )
		
		push()
		fill(255, 0, 0)
		noStroke()
	 	if (this.stats.mechanics != undefined && this.stats.mechanics.includes("TAUNT")){ 
			rect(this.minionX+1, this.minionY-10, this.minionWidth, 10)
		}
		pop()

		pop();
		
		push() 
		strokeWeight(5)
		stroke(0)
		textSize(33);
		if (this.stats.health < this.stats.maxHealth) {
			fill(255, 0, 0)
		} else if (this.stats.health > this.stats.standardMaxHealth){
			fill(0, 255, 0)
		} 
		else {
			fill(255)
		}
		text(this.stats.health,  this.minionX+this.minionWidth-5, this.minionY+this.minionHeight-10)
		
		if (this.stats.attack < this.stats.maxAttack) {
			fill(255, 0, 0)
		} else if (this.stats.attack > this.stats.standardMaxAttack) {
			fill(0, 255, 0)
		} 
		else {
			fill(255)
		}
		text(this.stats.attack,  this.minionX, this.minionY+this.minionHeight-10)

		pop()

		push()
			if (this.stats.canAttack) {  
				noFill();
				strokeWeight(2)
				stroke(0,255,0)
				scribble.scribbleEllipse(this.minionX+this.minionWidth/2, this.minionY+this.minionHeight/2, this.minionWidth, this.minionHeight);
			}
		pop()
	}
	detecthover(){

		if (this.place === "hand" || this.place === "notInGame") { 
			if (collidePointRect(mouseX, mouseY, this.x, this.y, this.width,   this.height)) {
				this.hover = true;

			} else  {
				this.hover = false;
			} 
			if (this.hover) {
				this.width = scaleToScreen(300/1.2, 1920, width)//int( (  (300/1.5)*windowWidth)   /1920);
				this.height = scaleToScreen(500/1.2, 1080, height) //int( ( (500/1.5)*windowHeight) /1080);
				hand.calcul();
			} else {
				this.width = scaleToScreen(300/2.4, 1920, width); //int(  ((300/2.4)*windowWidth ) /1920);
				this.height = scaleToScreen(500/2.4, 1080, height) //int( ((500/2.4)*windowHeight)/1080);
				setTimeout( ()=> {  
						hand.calcul();
				}, 10);
			}
		} else if (this.place === "friendlyBoard" || this.place === "enemyBoard") {
			if (collidePointRect(mouseX, mouseY, this.minionX, this.minionY, this.minionWidth,   this.minionHeight)) {
				this.hover = true;
				print("a")
			} else  {
				this.hover = false;
			} 
	
			if (this.hover) {
				this.width = scaleToScreen(300/1.2, 1920, width)//int( (  (300/1.5)*windowWidth)   /1920);
				this.height = scaleToScreen(500/1.2, 1080, height) //int( ( (500/1.5)*windowHeight) /1080);
				this.x = this.minionX-this.minionWidth*3;
				this.y = this.minionY-this.minionHeight/2
				this.showCard(); 
			}  
		}
		// if (this.holdingClick) {
		// 	alert()
		// }
		this.holdingClick = this.hover && mouseIsPressed
	
	}
 
	/*
	showinhand(x, y){
		fill(255)
		rect(x, y, this.width, this.height)
	} */

}
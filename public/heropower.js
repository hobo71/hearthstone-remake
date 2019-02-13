class HeroPower{
	constructor() {
		this.selected = false;
		this.hover = false;
	}
	show(){
		this.width = 50;
		this.height = 50;
		this.x = 50; 
		this.y = 50;

		rect(this.x, this.y,this.width, this.height)
		if (this.selected) {
			strokeWeight(5)
			stroke(255, 0, 0)
			scribble.scribbleLine(this.x+this.width/2, this.y+this.height/2, mouseX, mouseY );
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
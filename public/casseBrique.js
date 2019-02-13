 
var player, speedBall, run, ySlide;
var enemy = [];
var enemyInfo = {
    count : 0,
    x : 200,   
    y : 10
};
var alreadyGnr = false;
var ball = [];
 
function setupCasseBrique(){
    // createCanvas(640,400);
     ball = []
     enemy = []
     enemyInfo = {
        count : 0,
        x : 200,   
        y : 10
    };
    for (var i = 0; i < 3; i++) {
       ball.push(new Ball(640/2, 360));
    }

    for (var i = 0; i < 180; i++) {
        if (enemyInfo.count > 19) {
            enemyInfo.y += 20;
            enemyInfo.x = 200;
            enemyInfo.count = 0;
        }
        enemyInfo.x += 30;
        enemyInfo.count++;
        enemy.push(new Enemy(enemyInfo.x, enemyInfo.y));
    }

     player = new Player();
    alreadyGnr = true;
  }
 
function reset(){
    setup();
}
function drawCasseBrique(){
    background(0);
    player.show();
    for (var i = 0; i < ball.length; i++) {
        ball[i].show();
        ball[i].move();
        if (ball[i].y > 400) {
             ball[i].fixed = true;
        }

    if (collideRectRect(ball[i].x, ball[i].y, ball[i].w, ball[i].h,  player.x, player.y, player.w, player.h)) {
         ball[i].ySpeed = -1 * ball[i].ySpeed ;
         ball[i].xSpeed = random(-5,5);
         if (ball[i].x < player.x + player.w/2) {
              ball[i].xSpeed = random(-5,-1);
             print("left");
         }
         else {
             ball[i].xSpeed = random(5,1);
             print("right");
         }
         print(player.x - ball[i].x);
     }
  
      for (var j = 0; j < enemy.length; j++) {
          if (collideRectRect(ball[i].x, ball[i].y , ball[i].w, ball[i].h,  enemy[j].x, enemy[j].y, enemy[j].w, enemy[j].h) && !enemy[j].mort) {
              enemy[j].mort = true;
              if (ball[i].x >= enemy[j].x + enemy[j].w - 10) {
                  ball[i].xSpeed = -ball[i].xSpeed;
               }
               if (ball[i].x <= enemy[j].x + 10) {
                  ball[i].xSpeed = -1 * ball[i].xSpeed;
               }

               if (ball[i].y <= enemy[j].y + 10) {
                  ball[i].ySpeed = -1 * ball[i].ySpeed;
               }

               if (ball[i].y >= enemy[j].y + enemy[j].w - 10) {
                  ball[i].ySpeed = -ball[i].ySpeed;
               }
          }
      }

      textSize(40)
      textAlign(CENTER,  CENTER)
      text("Waiting for a new player...", 0, 100, windowWidth, windowHeight)
      textSize(20)
      text("You can play a game while waiting (don't ask me why)", 0, 200, windowWidth, windowHeight)
      
    }

    for (var i = 0; i < enemy.length; i++) {
        enemy[i].show();
    }
}


function mousePressed(){
   for (var i = 0; i < ball.length; i++) {
       if (ball[i].fixed) {
   ball[i].fixed = false;
       }
   }
}




function Player(){
    this.x = 600/2.
    this.y = 380;
    this.w = 60;
    this.h = 10;
    this.show = function(){
        fill(255);
        this.x = mouseX;
         rect(this.x, this.y, this.w, this.h);
    }  
}

function Enemy(x_,y_){
    this.x = x_;
    this.y = y_;
    this.w = 30;
    this.mort = false;
    this.h = 20;
    this.show = function(){
        if (!this.mort) {
            fill(255);
            rect(this.x, this.y, this.w, this.h);
        }
    }
     
}


function Ball(x_, y_){
    this.x = x_;
   this.y = y_;
    this.xSpeed = random(-5,5);
    this.ySpeed = -5;
    this.w = 10;
    this.h = 10;
    this.out = false;
    this.fixed = false;
   this.show = function(){
         fill(255);
       rect(this.x, this.y, this.w, this.h);
      if (this.fixed) {
           this.y = player.y - 10;
            this.x = player.x + player.w/2;
      }


      
   }

   this.move = function(){
        this.x += this.xSpeed;
        this.y += this.ySpeed;
        if (this.x > 900) {
            this.xSpeed = -this.xSpeed;
        }
        if (this.x < 0) {
            this.xSpeed = -1*this.xSpeed;
        }
 
        if (this.y < 0) {
            this.ySpeed = -1*this.ySpeed;
        }
    }

}
////////////////// Default Stuff ////////////////////////
const canvas = document.getElementById('pong');
const c = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;
//////////////////////////// Varibles ///////////////////////////
let paddleWidth = 10;
let paddleHeight = 125;
let keys = [];
let playing = false;
const ballDirection = [3,-3];
let tempNumber;
//////////////////////////// Event Listeners ////////////////////
addEventListener('keydown',function(event){
	keys[event.keyCode] = true;
});
addEventListener('keyup',function(event){
	delete keys[event.keyCode];
});
//////////////////////////// Utility Functions //////////////////
function randomNumber(min, max){
	return Math.random() * (max - min) + min;
}
//////////////////////////// Player /////////////////////////////
class Player {
	constructor(){
		this.x = 10;
		this.y = 300;
		this.width = paddleWidth;
		this.height = paddleHeight;
		this.dy = 3;
		this.color = '#fff';
		this.score = 0;
	}
	update(){
		this.draw();
		this.move();
	}
	draw(){
		c.fillStyle = this.color;
		c.fillRect(this.x,this.y,this.width,this.height);

		c.font = '30px Arial';
		c.fillStyle = this.color;
		c.fillText(this.score, canvas.width/2 - 40, 40);
	}
	move(){
		if(keys[87] && this.y >= 0){
			this.y -= this.dy;
		}
		if(keys[83] && this.y + this.height <= canvas.height ){
			this.y += this.dy
		}
	}
}
const player = new  Player;
//////////////////////// Paddle ////////////////////////////////////
class Paddle {
	constructor(){
		this.x = canvas.width-20;
		this.y = 300;
		this.width = paddleWidth;
		this.height = paddleHeight;
		this.dy = 3;
		this.color = '#fff';
		this.score = 0;
	}
	update(){
		this.draw();
		this.move();
	}
	draw(){
		c.fillStyle = this.color;
		c.fillRect(this.x,this.y,this.width,this.height);

		c.font = '30px Arial';
		c.fillStyle = this.color;
		c.fillText(this.score, canvas.width/2 + 20, 40);
	}
	move(){
			/* Stops at Borders */
		if(this.y <= 0){
			this.y = 0;
		}
		if(this.y >= canvas.height - this.height){
			this.y = canvas.height - this.height;
		}

			/* Moves With Ball */
		if(ball.y < this.y + this.height/2){
			this.y -= this.dy;
		}
		if(ball.y > this.y + this.height/2){
			this.y += this.dy;
		}
	}
}
const paddle = new Paddle;
//////////////////////// Ball /////////////////////////////////////
class Ball{
	constructor(){
		this.x = canvas.width/2;
		this.y = canvas.height/2;
		this.radius = 10;
		this.min = 0;
		this.max = 1;
		this.dx = 3;
		this.dy = -3;
		this.color = '#fff';
	}
		update(){
		this.draw();
		this.move();
	}
	draw(){
		c.beginPath();
		c.fillStyle = this.color;
		c.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
		c.fill();
		c.closePath();
	}
	move(){
		this.x += this.dx;
		this.y += this.dy;

		if(this.x <= 0 + this.radius || this.x + this.radius >= canvas.width){
			this.dx = -this.dx;
		}
		if(this.y <= 0 + this.radius || this.y + this.radius >= canvas.height){
			this.dy = -this.dy;
		}
	}
	collide(ent){
		if(this.x <= (ent.x + ent.width) + this.radius && (this.x + this.radius) >= ent.x &&
		   this.y <= (ent.y + ent.height) + this.radius && (this.y + this.radius) >= ent.y){
			  if(ent == player && this.dy < 0){
			  	  this.dx -= randomNumber(this.min,this.max);
				  if(this.dy > 0){
				  	  this.dy += randomNumber(this.min,this.max);
				  }else {
				  	  this.dy -= randomNumber(this.min,this.max);
				  }
			  }
			  if(ent == paddle){
			  	  this.dx += randomNumber(this.min,this.max);
				  if(this.dy > 0){
					this.dy += randomNumber(this.min,this.max);
				  }else {
				  	  this.dy -= randomNumber(this.min,this.max);
				  }
				  
			  }
			  this.dx = -this.dx;
			  //console.log('X: '+this.dx);
			  //console.log('Y: '+this.dy);
		   }
	}
	reset(){
		tempNumber = Math.round(randomNumber(0,1));
		this.x = canvas.width/2;
		this.y = canvas.height/2;
		this.dx = 3;
		this.dy = ballDirection[tempNumber];
		this.y = randomNumber(this.radius,canvas.height-this.radius);
	}
	score(ent1, ent2){
		if(this.x <= 0 + this.radius){
			ent1.score++;
			this.reset();
			this.dx = -this.dx;
		}
		if(this.x + this.radius >= canvas.width){
			ent2.score++;
			this.reset();
		}
	}
}
const ball = new Ball;
/////////////////////// Functions /////////////////////////////////
function collision(){
	ball.collide(player);
	ball.collide(paddle);

	ball.score(paddle,player);
}
function drawLine(){
	c.beginPath();
	c.setLineDash([20,12]);
	c.strokeStyle = '#fff';
	c.moveTo(canvas.width/2,2)
	c.lineTo(canvas.width/2,canvas.height);
	c.stroke();
}
function mainMenu(){
	document.getElementById('main_menu').style.display = 'block';
	document.getElementById('main_menu').style.width = canvas.width;
	document.getElementById('main_menu').style.height = canvas.height;

}
function startGame(){
	playing = true;
	document.getElementById('main_menu').style.display = 'none';
}
function animate(){
	c.clearRect(0,0,canvas.width,canvas.height);
	if(!playing){
		mainMenu();
	}else if(playing){
		//startGame();
		drawLine();
		player.update();
		paddle.update();
		ball.update();
		collision();
		
	}
	requestAnimationFrame(animate);
}
animate();
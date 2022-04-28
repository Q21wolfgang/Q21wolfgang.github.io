class Vec{
	constructor(x=0,y=0){
		this.x = x;
		this.y = y;
	}
}
class Rect{
	constructor(w,h){
		this.pos = new Vec();
		this.vel = new Vec();
		this.size = new Vec(w,h);
	}
	get left(){
		return this.pos.x - this.size.x/2;
	}
	get right(){
		return this.pos.x + this.size.x/2;
	}
	get top(){
		return this.pos.y - this.size.y/2;
	}
	get bottom(){
		return this.pos.y + this.size.y/2;
	}
}
class Player extends Rect{
	constructor(){
		super(28,64)
		
		this.pos.x = canvas.width/2;
		this.pos.y = canvas.height/2;
		this.vel.x = 5;
		this.vel.y = 0;
		this.gravity = -9.8;
		this.fallSpeed;
		this.falling = true;
		this.color = 'blue';
		this.score = 10;
		this.mu = false;
		this.mr = false;
		this.ml = false;
		this.jump = false;
		this.walkWidth = 0;
	}
	drawPlayer(){
		//jump.drawBlock(this.left,this.top,this.size.x,this.size.y,this.color);
		jump.drawImage('../jump/img/mcDude.png',this.left,this.top,this.size.x,this.size.y);
	}
	playerGravity(){
		//console.log(this.fallSpeed);
		this.vel.y -= .2; // Affects Player Down Acceleration
		this.fallSpeed = (this.gravity + this.vel.y);
		this.pos.y -= this.fallSpeed;
		if(this.jump&&!this.falling){
			this.vel.y = 20;
			//console.log(this.fallSpeed);
		}
	}
	playerMoveAndCollide(){
			// Move Left and Right //
		if(this.mr){
			this.pos.x += this.vel.x;
		}
		if(this.ml){
			this.pos.x -= this.vel.x;
		}
		
			// Add Player Gravity //
		this.playerGravity();
		
			// Player Boundary Collision
		if(this.left <= 0){
			this.pos.x = this.size.x/2;
		}
		if(this.right >= canvas.width){
			this.pos.x = canvas.width-this.size.x/2
		}
		if(this.top <= 0){
			this.pos.y = this.size.y/2;
		}
		if(this.bottom >= canvas.height){
			this.pos.y = canvas.height-this.size.y/2;
			this.fallSpeed = 0;
			this.falling = false;
		}else {
			this.falling = true;
		}
		
		
	}
	walkAnimation(){
		jump.spriteAnimationCount += .2;
		this.walkWidth = Math.floor(jump.spriteAnimationCount % 4);
	}
}
class Object extends Rect{
	constructor(){
		super(50,50);
		
		this.pos.x = canvas.width+this.size.x/2;
		this.pos.y = canvas.height-this.size.y/2;
		this.vel.x = 5;
		this.vel.y = 0;
		this.color = 'red';
	}
	drawObject(){
		jump.drawBlock(this.left,this.top,this.size.x,this.size.y,this.color);
		
	}
	objectMoveAndCollide(){
		this.pos.x -= this.vel.x;
		
		if(this.left < jump.player.right&&this.right > jump.player.right&&this.top < jump.player.bottom&&this.bottom > jump.player.top){
			jump.player.score--;
			jump.player.pos.x = this.left-jump.player.size.x/2;
			console.log(jump.player.score);
		}
	}
}
class Jump {
	constructor(canvas){
		this.c = canvas;
		this.ctx = this.c.getContext('2d');
		this.c.width = 800;
		this.c.height = 600;
		
		this.frame = 100;
		this.acc = 0;
		this.step = 1/100;
		let lastTime;
		const callback = (milli) => {
			if(lastTime){
				this.update((milli - lastTime)/1000)
				this.draw();
			}
			lastTime = milli;
			requestAnimationFrame(callback);
		};
		callback();
		
			// Player //
		this.player = new Player();
		
			// Object //
		//this.object = new Object();
		this.objectList = {};
		
		this.spriteAnimationCount = 0;
	}
	buildObject(id){
		var object = {
			object:new Object(),
			id:id,
		}
		this.objectList[id]=object;
	}
	readyObject(){
		var id = Math.random();
		
		this.buildObject(id);
	}	
	spawnObject(){
		if(this.frame == 200){
			this.readyObject();
			this.frame = 0;
		}
		for(var i in this.objectList){
			this.objectList[i].object.objectMoveAndCollide();
			
			if(this.objectList[i].object.right < 0){
				delete this.objectList[i];
			}
		}
	}
	drawBlock(x,y,w,h,color){
		this.ctx.fillStyle = color;
		this.ctx.fillRect(x,y,w,h);
	}
	drawImage(src,x,y,w,h){
		this.img = new Image();
		this.img.src = src;
		this.ctx.drawImage(this.img,x,y,w,h);
	}
	drawCanvas(){
		this.drawBlock(0,0,this.c.width,this.c.height,'white');
	}
	draw(){
		this.drawCanvas();
		this.player.drawPlayer();
		
		for(var i in this.objectList){
			this.objectList[i].object.drawObject();
		}
	}
	simulate(dt){
		//console.log(this.player.mu)
		this.player.playerMoveAndCollide();
		this.spawnObject();
		
		this.frame++;
	}
	update(dt){
		this.acc += dt
		while(this.acc > this.step){
			this.simulate(this.step);
			this.acc -= this.step;
		}
	}
}
const canvas = document.getElementById('screen');
const jump = new Jump(canvas);
window.addEventListener('keydown',down);
window.addEventListener('keyup',up);
function down(e){
		// Moving Controls //
	if(e.keyCode == 87){
		jump.player.jump = true;
	}
	if(e.keyCode == 68){
		jump.player.mr = true;
	}
	if(e.keyCode == 65){
		jump.player.ml = true;
	}
}
function up(e){
		// Moving Controls //
	if(e.keyCode == 87){
		jump.player.jump = false;
	}
	if(e.keyCode == 68){
		jump.player.mr = false;
	}
	if(e.keyCode == 65){
		jump.player.ml = false;
	}
}
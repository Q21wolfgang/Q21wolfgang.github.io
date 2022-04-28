//////////// Notes ////////////////////////////////////////////////

/*function getDistance(x1,y1,x2,y2){
	let distanceX = x2 - x1;
	let distanceY = y2 - y1;

	return Math.sqrt(Math.pow(distanceX,2)+Math.pow(distanceY,2));
}*/

/////////// Default Stuff /////////////////////////////////////////
const canvas = document.getElementById("redblock_canvas");
const c = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600 ;
/////////////////// Variables ////////////////////////
let mousex, mousey;
let keys = [];
let enemy = [];
let strings = ['Score: ','HP: ','You Died','Play Again','Quit'];
let drawString = true;
let playing = false;
///////////////// Event Listeners //////////////////////////
addEventListener('mousemove',function(event){
	mousex = event.clientX;
	mousey = event.clientY;
});
addEventListener('keydown',function(event){
	keys[event.keyCode] = true;
});
addEventListener('keyup',function(event){
	delete keys[event.keyCode];
});
/////////// Player ////////////////////////////////////////////
class Player {
	constructor(){
		this.x = 20;
		this.y = 20;
		this.width = 20;
		this.height = 40;
		this.color = 'green';
		this.velx = 3;//= Math.floor(1+(Math.random()*10));
		this.vely = 3;// = Math.floor(1+(Math.random()*10));
		this.score = 0;
		this.hp = 10;
		this.dead = false;
		this.startx = 20;
		this.starty = 20;
		this.startvelx = 3;
		this.startvely = 3;
		this.starthp = 10;
	}
	update(){
		this.move();
	}
	draw(){
		c.fillStyle = this.color;
		c.fillRect(this.x,this.y,this.width,this.height);
		this.update();
	}
	move(){
		
		if(keys[65]&&this.x >= 0){
			this.x -= this.velx;
		}
		if(keys[68]&&this.x+this.width <= canvas.width){
			this.x += this.velx;
		}
		if(keys[87]&&this.y >= 0){
			this.y -= this.vely;
		}
		if(keys[83]&&this.y+this.height <= canvas.height){
			this.y += this.vely;
		}
	}
	/*collideDection(entity){
		if(this.x <= entity.x + entity.width && this.x + this.width >= entity.x &&
		this.y <= entity.y + entity.height && this.y + this.height >= entity.y){
			return
		} 
	}*/
}
const player = new Player();

//////////////// Enemy //////////////////////////////////////
class Enemy {
	constructor(){
		this.id = 1;
		this.width = 20;
		this.height = 40;
		this.x = Math.floor(Math.random()*(canvas.width-this.width));
		this.y = Math.floor(Math.random()*(canvas.height-this.height));
		this.color = 'red';
		this.velx = Math.floor(1+(Math.random()*5));
		this.vely = Math.floor(1+(Math.random()*5));
	}
	update(){
		this.move();
		this.realx = this.x + this.width/2;
		this.realy = this.y + this.height/2;
		
	}
	draw(){
		c.fillStyle = this.color;
		c.fillRect(this.x,this.y,this.width,this.height);
		this.update();
	}
	move(){
		this.x += this.velx;
		this.y += this.vely;
		if(this.x + this.width >= canvas.width){
			this.velx = -this.velx;
		}
		if(this.x <= 0){
			this.velx = -this.velx;
		}
		if(this.y + this.height >= canvas.height){
			this.vely = -this.vely;
		}
		if(this.y <= 0){
			this.vely = -this.vely;
		}
	
	}
}
createEnemy();
createEnemy();
setInterval(createEnemy, 5000);

//console.log(enemy);
///////////////////////////// Goal //////////////////////////////////////
class Goal{
	constructor(){
		this.x = 300;
		this.y = 200;
		this.width = 20;
		this.height = 20;
		this.color = 'rgb(220,220,0)';
	}
	update(){
	
	}
	draw(){
		c.fillStyle = this.color;
		c.fillRect(this.x,this.y,this.width,this.height);
		this.update();
	}
}
const goal = new Goal();
//////////////////// Functions ////////////////////////////////////////
function collision(){
	for(var i = 0;i<enemy.length;i++){
		if(player.x <= enemy[i].x + enemy[i].width && player.x + player.width >= enemy[i].x &&
		player.y <= enemy[i].y + enemy[i].height && player.y + player.height >= enemy[i].y){
			enemy.splice(i,1);
			player.hp -= 5;
			if(player.hp <= 0){
				player.hp = 0;
				player.dead = true
				death();
			}
		}
	}
	if(player.x <= goal.x + goal.width && player.x + player.width >= goal.x &&
	   player.y <= goal.y + goal.height && player.y + player.height >= goal.y){
		goal.x = Math.floor(Math.random()*(canvas.width-goal.width));
		goal.y = Math.floor(Math.random()*(canvas.height-goal.height));
		player.score++;
		player.hp += 3;
		if(player.hp >= 10){
			player.hp = 10;
		}
	} 
}
function play(){
	playing = true;
	document.getElementById("main_menu").style.display = 'none';
	reset();
}
function death(){
	if(player.dead){
		drawString = false;
		player.velx = 0;
		player.vely = 0;
		player.score = 0;
		for(let i = 0;i<enemy.length;i++){
			enemy[i].velx = 0;
			enemy[i].vely = 0;
		}
		clearInterval(createEnemy);
		deathScreen();
	}
}
function createEnemy(){
	if(!player.dead){
		enemy.push(new Enemy());
		for(var i = 0;i<enemy.length;i++){
			enemy[i].id = i;
		}
	}
}
function drawEnemy(){
	for(var i = 0;i<enemy.length;i++){
		enemy[i].draw();
	}
}
function drawStrings(){
	if(drawString){
		c.font = '20px Arial';
		c.fillStyle = '#000';
		c.fillText(strings[0]+player.score,canvas.width -100,24);
		c.fillText(strings[1]+player.hp,20,24);
	}
}
function mainMenu(){
	$(document).ready(function(){
		$(main_menu).css("display",'block');
		$(main_menu).css("width", canvas.width);
		$(main_menu).css("height", canvas.height);
	});
}
function deathScreen(){
	$(document).ready(function(){
		$(death_screen).css("display",'block');
		$(death_screen).css("width", canvas.width);
		$(death_screen).css("height", canvas.height);
	});
}
function reset(){
	document.getElementById("death_screen").style.display = 'none';
	drawString = true;
	player.dead=false;
	player.hp = player.starthp;
	player.x = player.startx;
	player.y = player.starty;
	player.velx = player.startvelx;
	player.vely = player.startvely;
	enemy = [];
	createEnemy();
	createEnemy();
}
function playAgain(){
		if(player.dead){
			reset();
		}
}

console.log(canvas.width);
function animate(){
	c.clearRect(0,0,canvas.width,canvas.height);
	if(!playing){
		mainMenu();
	}else if(playing){
		collision();
		player.draw();
		drawEnemy();
		goal.draw();
		drawStrings();
	}
	requestAnimationFrame(animate);
}
animate();
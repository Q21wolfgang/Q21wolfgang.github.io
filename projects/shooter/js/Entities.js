var player;
var enemyList = [];
var upgradeList = [];
var bulletList = [];
var frames = 0;
Entity = function(id,x,y,width,height,img){
	var self = {
		id:id,
		x:x,
		y:y,
		width:width,
		height:height,
		img:img,
	}
	self.collisionDetection = function(e2){
		var r2 = {
			x:e2.x,
			y:e2.y,
			width:e2.width,
			height:e2.height,
		}
		return rectCollision(self,r2);
	}
	self.update = function(){
		self.updatePos();
		self.draw();
	}
	self.updatePos = function(){}
	self.draw = function(){
		c.save();
		var x = self.x - player.x;
		var y = self.y - player.y;
		
		x += game.width/2;
		y += game.height/2;
		
		x -= self.width/2;
		y -= self.height/2;
		
		c.drawImage(self.img,0,0,self.img.width,self.img.height,x,y,self.width,self.height);
		c.restore();
	}
	return self;
}
Actor = function(id,type,x,y,width,height,img,hp,attackSpeed){
	var self = Entity(id,x,y,width,height,img);
	self.type = type;
	self.hp = hp;
	self.attackSpeed = attackSpeed;
	self.aimAngle = 0;
	self.attackCounter = 0;
	var super_update = self.update;
	self.update = function(){
		super_update();
		self.attackCounter += self.attackSpeed;
		if(self.hp <= 0){
			self.onDeath();
		}
	}
	self.onDeath = function(){}
	self.performAttack = function(){
		if(self.attackCounter >= (50/self.attackSpeed)){
			createBullet(self);
			self.attackCounter = 0;
		}
	}
	return self;
}
Player = function(){
	var self = Actor("myId","player",100,100,18,42,Img.player,10,1);
	self.spedx = 3;
	self.spedy = 3;
	self.up = false;
	self.down = false;
	self.left = false;
	self.right = false;
	self.score = 0;
	self.counter = 100;
	self.updatePos = function(){
		if(self.up){
			self.y -= self.spedy;
		}else if(self.down){
			self.y += self.spedy;
		}
		if(self.left){
			self.x -= self.spedx;
		}else if(self.right){
			self.x += self.spedx;
		}
		if(self.x < 0){
			self.x = 0;
		}else if(self.x > currentMap.width-self.width){
			self.x = currentMap.width-self.width;
		}
		if(self.y < 0){
			self.y = 0;
		}else if(self.y > currentMap.height-self.height){
			self.y = currentMap.height-self.height
		}
	}
	var super_update = self.update;
	self.update = function(){
		super_update();
		
	}
	self.onDeath = function(){
		if(self.hp <= 0){
			startGame();
		}
	}
	return self;
	
}
Enemy = function(id,x,y,width,height,img,hp,atkspd){
	var self = Actor(id,"enemy",x,y,width,height,img,hp,atkspd);
	var super_update = self.update;
	self.updateAim = function(){
		var differX = player.x - self.x;
		var differY = player.y - self.y;
		
		self.aimAngle = Math.atan2(differY,differX) * 180 / Math.PI ;
	}
	self.updatePos = function(){
		var differX = player.x - self.x;
		var differY = player.y - self.y;
		
		if(differX > 0){
			self.x += 1;
		}else {
			self.x -= 1;
		}
		
		if(differY > 0){
			self.y += 1;
		}else {
			self.y -= 1;
		}
	}
	self.update = function(){
		super_update();
		self.updateAim();
		self.performAttack();
	}
	enemyList[id] = self; 
}
createEnemy = function(){
	var x = Math.random()*(currentMap.width-50);
	var y = Math.random()*(currentMap.height-50);
	var width = 33;
	var height = 33;
	var id = Math.random();
	
	Enemy(id,x,y,width,height,Img.enemy,2,1);
}
Upgrade = function(id,x,y,img,catagory){
	var self = Entity(id,x,y,15,15,img);
	self.catagory = catagory;
	var super_update = self.update;
	self.update = function(){
		super_update();
		var isColliding = player.collisionDetection(self);
		if(isColliding){
			if(self.catagory == "low"){
				player.hp = 10;
			}
			if(self.catagory == "high"){
				player.counter = 0;
				player.attackSpeed = 5;
			}
			delete upgradeList[self.id];
		}
	}
	upgradeList[id] = self;
}
createUpgrade = function(){
	var x = Math.random()*currentMap.width;
	var y = Math.random()*currentMap.height;
	var img;
	var catagory;
	var id = Math.random();
	if(id <= .5){
		img = Img.upgrade1;
		catagory = "low";
	}else {
		img = Img.upgrade2;
		catagory = "high";
	}
	
	Upgrade(id,x,y,img,catagory);
}
Bullet = function(id,x,y,width,height,spedx,spedy,combatType){
	var self = Entity(id,x,y,width,height,Img.bullet);
	self.combatType = combatType;
	self.spedx = spedx;
	self.spedy = spedy;
	var super_update = self.update;
	self.updatePos = function(){
		self.x += self.spedx;
		self.y += self.spedy;
	}
	self.update = function(){
		super_update();
		var toRemove = false;
		if(combatType == "player"){
			for(var j in enemyList){
				if(self.collisionDetection(enemyList[j])){
					toRemove = true;
					enemyList[j].hp--;
					
				}
			}
		}else if(combatType == "enemy"){
			if(self.collisionDetection(player)){
				toRemove = true;
				player.hp--;
			}
		}
		if(self.x >= currentMap.width-self.width||self.x <= 0
		||self.y >= currentMap.height-self.height||self.y <= 0){
			toRemove = true;
		}
		if(toRemove){
			delete bulletList[self.id];
		}
	}
	bulletList[id] = self;
}
createBullet = function(actor){
	var width = 19;
	var height = 9;
	var x = actor.x + actor.width/2 - width/2;
	var y = actor.y + actor.height/2 - height/2;
	var angle = actor.aimAngle;
	var spedx = Math.cos(angle/180*Math.PI)*5;
	var spedy = Math.sin(angle/180*Math.PI)*5;
	var id = Math.random();
	
	Bullet(id,x,y,width,height,spedx,spedy,actor.type);
}
///////////////////// Default Stuff /////////////////////////////
const back = document.getElementById("background_canvas");
const ctx = back.getContext("2d");
back.width = window.innerWidth;
back.height = window.innerHeight;
/////////////////////// Event Listeners /////////////////////////////
window.addEventListener('resize',function(){
	back.width = window.innerWidth;
	back.height = window.innerHeight;
	init();
});
////////////////////// Varibles //////////////////////////////////////
let circles = [];
let colors = [
	'#030A04',
	'#FF5412',
	'#FFB85D',
	'#3B707D'
];

const blockAmount = 200;
////////////////////// Utility Functions /////////////////////////////
function randomNumberGenerator(min, max){
	return Math.random() * (max - min) + min;
}
function RandomColor(){
	return Math.floor(Math.random() * colors.length);
}
function rotate(velx,vely,angle){
	const rotateVel = {
		x: velx * Math.cos(angle) - vely * Math.sin(angle),
		y: velx * Math.sin(angle) + vely * Math.cos(angle)
	};

	return rotateVel;
}
function resolveCollision(ent1,ent2){
	let xVelDiff = ent1.dx - ent2.dx;
	let yVelDiff = ent1.dy - ent2.dy;
	let xDist = ent2.x - ent1.x;
	let yDist = ent2.y - ent1.y
	
	if(xVelDiff * xDist + yVelDiff * yDist >= 0){
		let angle = -Math.atan2(ent2.y-ent1.y,ent2.x-ent1.x);
		let m1 = ent1.mass;
		let m2 = ent2.mass;
		let u1 = rotate(ent1.dx, ent1.dy, angle);
		let u2 = rotate(ent2.dx, ent2.dy, angle);
	
		let v1 = { x: u1.x * (m1-m2) / (m1+m2) + u2.x * 2 * m2 / (m1+m2), y: u1.y};
		let v2 = { x: u2.x * (m1-m2) / (m1+m2) + u1.x * 2 * m2 / (m1+m2), y: u2.y};
		let vFinal1 = rotate(v1.x, v1.y, -angle);
		let vFinal2 = rotate(v2.x, v2.y, -angle);

		ent1.dx = vFinal1.x;
		ent1.dy = vFinal1.y;

		ent2.dx = vFinal2.x;
		ent2.dy = vFinal2.y;

	}
}
function getDistance(x1,y1,x2,y2){
	let xDist = x2 - x1;
	let yDist = y2 - y1;

	return Math.sqrt(Math.pow(xDist,2)+Math.pow(yDist,2));
}
////////////////////// Classes ///////////////////////////////////////
class Circle{
	constructor(){
		this.radius = randomNumberGenerator(5,30);
		this.x = randomNumberGenerator(this.radius,back.width-this.radius);
		this.y = randomNumberGenerator(this.radius,back.height-this.radius);
		this.maxVel = 1;
		this.minVel = -1;
		this.dx = randomNumberGenerator(this.minVel,this.maxVel),
		this.dy = randomNumberGenerator(this.minVel,this.maxVel),
		this.color = colors[RandomColor()];
		this.mass = 1;
	}
	update(){
		this.move();
	}
	draw(){
		
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.arc(this.x,this.y,this.radius,0,2*Math.PI,false);
		ctx.fill();
		ctx.stroke();
		ctx.closePath();
		this.update();
	}
	move(){
		this.x += this.dx
		this.y += this.dy;
		if(this.x  - this.radius + this.dx < 0 || this.x >= back.width - this.radius - this.dx){
			this.dx = -this.dx;
		}
		if(this.y - this.radius + this.dy < 0 || this.y >= back.height - this.radius - this.dy){
			this.dy = -this.dy;
		}

	}
}
/////////////////////// Game Functions ///////////////////////////////////

function collide(){
	for(var i = 0;i<circles.length;i++){
		for(var j = 0;j<circles.length;j++){
			if(getDistance(circles[i].x,circles[i].y,circles[j].x,circles[j].y) - (circles[i].radius + circles[j].radius) < 0){
				resolveCollision(circles[i],circles[j]);
			}
		}
	}
} 
function init(){

	circles = [];
	for(var i = 0;i<blockAmount;i++){
			circles.push(new Circle);
	}
}
function animation(){
	
	ctx.clearRect(0,0,back.width,back.height);
	collide();
	circles.forEach(circles => circles.draw()); 
	requestAnimationFrame(animation)
}
init();
animation();
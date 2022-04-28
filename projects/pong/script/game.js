// Pong Version 1.0.0

/*
        To Do List
        
    1. Make ball round - done  
    2. Paddle stay inside canvas - done
    3. Text start, win and lose - done
    4. Increase difficulty over time - done
    5. Arrow keys control - done
    6. Start Screen - done
    7. Two player option - done
    8. Fix ball getting stuck in wall - done
    10. Fix Two player text - done
    11. When someone wins click to reset everything -done
    12. Make difficulties - done
    13. If in mid game and you switch players or difficulty then game resets - done
    14. Make ball start in randomly on y axis and in the x axis - done
    15. When change difficulty ball Reset - done
    16. Fix ball getting stuck in paddle
    17. Fix gaming from playing when not on game screen - done

*/

/* 
        Future Ideas
            
    1. Serving
    2. Better Menus
    3. Setting you own score
    4. Color coding
    5. Ready up system for two player
    
*/

class Vec {
    constructor(x=0,y=0){
        this.x = x;
        this.y = y;
    }
  
}

class Rect {
    constructor(w,h){
        this.pos = new Vec;
        this.size = new Vec(w,h);
    }
      get left(){
        return this.pos.x - this.size.x / 2;
    }
    get right(){
        return this.pos.x + this.size.x / 2;
    }
    get top(){
        return this.pos.y - this.size.y / 2;
    }
    get bottom(){
        return this.pos.y + this.size.y / 2;
    }
}

class Ball extends Rect {
    constructor(){
        super(10,10);
        this.vel = new Vec;
        this.radius = 8;
    }
}

class Player extends Rect {
    constructor(){
        super(20,100);
        this.score = 0;
        this.scorepos = new Vec;
    }
}

class Pong {
    constructor(canvas){

        ///// Canvas //////
        this.c = canvas;
        this.ctx = canvas.getContext('2d');
        this.ctx.canvas.width = window.innerWidth;
        this.ctx.canvas.height = window.innerHeight;
        
        ///// Ball /////
        this.ball = new Ball;
        this.ballreset = true;
       
        ///// Players /////
        this.players = [new Player, new Player];
        this.players.forEach(Player =>{Player.pos.y = this.c.height/2});
        this.players.forEach(Player => {Player.scorepos.y = 40});
        this.players.speed = 5;
        this.ply = ['1','2'];
        this.plyIndex = 0;
        
        ////// Player 1 //////
        this.players[0].pos.x = 75;
        this.players[0].scorepos.x = this.c.width/2-30;
       
        ////// Player 2/ AI //////
        this.players[1].pos.x = this.c.width - 75;
        this.players[1].scorepos.x = this.c.width/2+30;
        this.players[1].score = 0;
        
        
        ///// Refresher Manager ////
        this.accumilator = 0;
        this.step = 1/100;
        
        ///// Player Movement and Amount of Players /////
        this.up = false;
        this.down = false;
        this.up2 = false;
        this.down2 = false;
        this.player1 = true;
        this.player2 = false;
        
        ///// Win /////
        this.winScore = 2;
        this.win = false;
        this.lose = false;
        this.win1 = false;
        this.win2 = false;
        
        ////// Start /////
        this.drawstart = true;
        this.dif = ['Easy','Medium','Hard'];
        this.difint = [2,5,8];
        this.difIndex = 0;
        this.drawgame = false;
        
        ///// Audio /////
        this.a = new Audio('../pong/audio/bop.mp3');
        
        let lastTime;
        const callback = (milli) => {
            if(lastTime){
                this.update((milli - lastTime) / 1000);
                this.draw();
            }
            lastTime = milli;
            requestAnimationFrame(callback);
        }
        callback();
    }
    ballReset(){
        this.ball.pos.x = this.c.width/2;
        this.ball.pos.y = Math.round(Math.random()*(this.c.height - this.ball.bottom) + this.ball.top);
        this.ball.vel.x = 0;
        this.ball.vel.y = 0;
        
        this.players.forEach(Player =>{Player.pos.y = this.c.height/2});
        this.ballreset = true;
    
    }
    scoreReset(){
        this.players.forEach(Player => {Player.score = 0});
    }
    start(){
        this.newvel = Math.round(Math.random()*(1));
        
        if(this.ball.vel.x == 0 && this.ball.vel.y == 0){
            if(this.newvel == 0){
                this.ball.vel.x = 300;
            }else if(this.newvel == 1){
                this.ball.vel.x = -300;
            }
            this.ball.vel.y = 300; 
        }
        this.ballreset = false;
    }
    collide(player, ball, audio){
        if(player.left < ball.right && player.right > ball.left && player.top < ball.bottom && player.bottom > ball.top){
            ball.vel.x = -ball.vel.x;
            ball.vel.x = ball.vel.x * 1.05;
            ball.vel.y = ball.vel.y * 1.03;
            audio.play();
        }
    }
    play(){
        this.scoreReset();
        this.drawstart = false;
        this.win = false;
        this.lose = false;
        this.win1 = false;
        this.win2 = false;
        this.drawgame = true;
    }
    menu(){
        this.drawstart = true;
        this.win = false;
        this.lose = false;
        this.win1 = false;
        this.win2 = false;
    }
    draw(){
        
        if(this.drawstart){
          this.drawStart();
        }else if(this.win){
            this.drawWin();
        }else if(this.lose){
            this.drawLose();
        }else if(this.win1){
            this.drawWin1();
        }else if(this.win2){
            this.drawWin2();
        }else if(this.drawstart == false && this.win == false && this.lose == false && this.win1 == false && this.win2 == false && this.drawgame == true){
            
            ///// Canvas //////
            this.drawCanvas();
            
            ///// Net //////
            this.drawNet();
            
            ///// Ball and Paddles //////
            this.drawBall(this.ball, 'white');
            this.players.forEach(Player => this.drawRect(Player, 'white'));
            this.players.forEach(Player => this.drawScore(Player.score,Player.scorepos.x,Player.scorepos.y,'white'));
            
            ///// Start Text /////
            if(this.ballreset){
                 this.drawText("' Spacebar to Continue '", this.c.width/2, this.c.height/2,'white');
            }
            
            ///// Win and Lose Text ////// 
            if(this.player1){
                if(this.players[0].score == this.winScore){
                    this.win = true;
                }else if(this.players[1].score == this.winScore){
                    this.lose = true;
                }
            }
            if(this.player2){
                if(this.players[0].score == this.winScore){
                    this.win1 = true;
                }else if(this.players[1].score == this.winScore){
                    this.win2 = true;
                }
            }
        }
    }
    drawCanvas(){
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0,0,this.c.width,this.c.height);
    }
    drawRect(rect, color){
        this.ctx.fillStyle = color;
        this.ctx.fillRect(rect.left,rect.top,rect.size.x,rect.size.y);
    }
    drawBall(ball, color){
        this.ctx.beginPath();
        this.ctx.fillStyle = color;
        this.ctx.arc(ball.pos.x,ball.pos.y,ball.radius,0,Math.PI*2,false);
        this.ctx.fill();
    }
    drawScore(text, scorex, scorey ,color){
        this.ctx.font = '20px arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = color;
        this.ctx.fillText(text,scorex,scorey);
    }
    drawText(text, x, y, color){
        this.ctx.font = '20px arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = color;
        this.ctx.fillText(text,x,y);
    }
    drawBig(text, x, y, color){
        this.ctx.font = '75px arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = color;
        this.ctx.fillText(text,x,y);
    }
    drawNet(){
        for(let i = 0; i < this.c.height;i+=40){
            this.ctx.fillStyle = 'white';
            this.ctx.fillRect(this.c.width/2-1,i,2,20);
        }
    }
    drawStart(){
        this.drawgame = false;
        this.drawCanvas();        
        this.drawBig('Pong',this.c.width/2,150,'white');
        this.drawText('Enter To Start',this.c.width/2,this.c.height-250,'white');
        this.drawText('P To Change Players: '+this.ply[this.plyIndex],this.c.width/2,this.c.height-200,'white');
        this.drawText('D To Change Difficulty: '+this.dif[this.difIndex],this.c.width/2,this.c.height-150,'white');
        this.drawText('Q To Quit',this.c.width/2,this.c.height-100,'white');
    }
    drawWin(){
        this.drawgame = false;
        this.drawCanvas();
        this.drawBig('You Win',this.c.width/2,150,'white');
        this.drawText('Enter To Try Again',this.c.width/2,this.c.height-200,'white');
        this.drawText('M for Menu', this.c.width/2,this.c.height-150,'white');
        this.drawText('Q To Quit',this.c.width/2,this.c.height-100,'white');   
    }
    drawLose(){
        this.drawgame = false;
        this.drawCanvas();
        this.drawBig('You Lose',this.c.width/2,150,'white');
        this.drawText('Enter To Try Again',this.c.width/2,this.c.height-200,'white');
        this.drawText('M for Menu', this.c.width/2,this.c.height-150,'white');
        this.drawText('Q To Quit',this.c.width/2,this.c.height-100,'white');   
    }
    drawWin1(){
        this.drawgame = false;
        this.drawCanvas();
        this.drawBig('Player 1 Wins',this.c.width/2,150,'white');
        this.drawText('Enter To Try Again',this.c.width/2,this.c.height-200,'white');
        this.drawText('M for Menu', this.c.width/2,this.c.height-150,'white');
        this.drawText('Q To Quit',this.c.width/2,this.c.height-100,'white');  
    } 
    drawWin2(){
        this.drawgame = false;
        this.drawCanvas();
        this.drawBig('Player 2 Wins',this.c.width/2,150,'white');
        this.drawText('Enter To Try Again',this.c.width/2,this.c.height-200,'white');
        this.drawText('M for Menu', this.c.width/2,this.c.height-150,'white');
        this.drawText('Q To Quit',this.c.width/2,this.c.height-100,'white'); 
    }
    simulate(dt){
        
        if(this.drawstart == false){
            
            if(this.plyIndex == 0){
                this.player1 = true;
                this.player2 = false;
            }else if(this.plyIndex == 1){
                this.player1 = false;
                this.player2 = true;
            }
            this.players[1].speed = this.difint[this.difIndex];
            
            // console.log('delta',dt);
            this.ball.pos.x += this.ball.vel.x * dt;
            this.ball.pos.y += this.ball.vel.y * dt;
            
            ///// Score and Ball Reset Detection, Ball Top and Bottom Collision /////
            if(this.ball.left < 0){
                this.ballReset();
                this.players[1].score++;
            }else if(this.ball.right > this.c.width){
                this.ballReset();
                this.players[0].score++;
                this.score = true;
            } else if(this.ball.top < 0 || this.ball.bottom > this.c.height){
                this.ball.vel.y = -this.ball.vel.y;
                this.a.play();
            }
            
            ////// Player 2/AI Movement and Restainer /////
            if(this.player2){
                if(this.up2 && this.players[1].top > 0){
                    this.players[1].pos.y -= this.players.speed;
                }else if(this.down2 && this.players[1].bottom < this.c.height){
                    this.players[1].pos.y += this.players.speed;
                }
            }else {
                if(this.players[1].pos.y >this.ball.pos.y+20 && this.players[1].top > 0){
                    this.players[1].pos.y -= this.players[1].speed;
                }else if(this.players[1].pos.y < this.ball.pos.y-20 && this.players[1].bottom < this.c.height){
                    this.players[1].pos.y += this.players[1].speed;
                }
            }
            
            ////// Player 1 Movement and Restrainer /////
             if(this.player1){
                if(this.up2 && this.players[0].top > 0){
                    this.players[0].pos.y -= this.players.speed;
                }else if(this.down2 && this.players[0].bottom < this.c.height){
                    this.players[0].pos.y += this.players.speed;
                }
            }else {
                if(this.up && this.players[0].top > 0){
                    this.players[0].pos.y -= this.players.speed;
                }else if(this.down && this.players[0].bottom < this.c.height){
                    this.players[0].pos.y += this.players.speed;
                }
            }
            
            this.draw();
            this.players.forEach(Player => this.collide(Player, this.ball, this.a));
        }
    }
    update(dt){
        //console.log('acc', this.accumilator)
        this.accumilator += dt;
        while(this.accumilator > this.step){
            this.simulate(this.step);
            this.accumilator -= this.step;
        }
    }
}

const canvas = document.getElementById('screen');
const pong = new Pong(canvas);

document.addEventListener('keydown', kdown);
document.addEventListener('keyup', kup);

function kdown(e){
    
    ///// Controls /////
    if(e.keyCode == 38){
        pong.up2 = true;
    }else if(e.keyCode == 40){
        pong.down2 = true
    }else if(e.keyCode == 87){
        pong.up = true
    }else if(e.keyCode == 83){
        pong.down = true
    }
    
    ///// Start Title Controls /////
    if(pong.drawstart){
        if(e.keyCode == 68){
            pong.difIndex = (pong.difIndex + 1)%(pong.dif.length);
        }else if(e.keyCode == 80){
            pong.plyIndex = (pong.plyIndex + 1)%(pong.ply.length);
        }
    }
    if(pong.drawstart || pong.win || pong.lose || pong.win1 || pong.win2){
        if(e.keyCode == 13){
            pong.play();
            pong.ballReset();
        }else if(e.keyCode == 81){
            window.close();
        }
    }
    
    if(pong.win || pong.lose || pong.win1 || pong.win2){
        if(e.keyCode == 77){
            pong.menu();
        }
    }
    
    if(pong.drawgame){
        if(e.keyCode == 32){
            pong.start();
        }
    }
    //console.log(e.keyCode);
}

function kup(e){
    if(e.keyCode == 38){
        pong.up2 = false;
    }else if(e.keyCode == 40){
        pong.down2 = false;
    }else if(e.keyCode == 87){
        pong.up = false;
    }else if(e.keyCode == 83){
        pong.down = false;
    }
}
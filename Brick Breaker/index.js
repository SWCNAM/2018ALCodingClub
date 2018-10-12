//
//Game variables
//
var gameTitle = "My Game";

//
//Player (paddle) variables
//
var playerXPosition = 400;
var playerYPosition = 480;
var playerLives = 10;
var playerSpeed = 10;
var playerHeight = 10;
var playerWidth = 80;

//
//Ball variables
//
var ballXPosition = 50;
var ballYPosition = 50;
var ballHeight = 10;
var ballWidth = 10;
var ballSpeed = 5;

//
//Brick variables
//
var strongBrickColor = 'green';
var mediumBrickColor = 'yellow';
var easyBrickColor = 'red';

//
//The level
//
var brickArray = [
  [1,1,1,1,1,1,1,1,1,1],
  [0,2,2,2,2,2,2,2,2,0],
  [0,0,1,3,1,3,3,3,0,0],
  [0,0,3,3,3,2,3,3,0,0],
  [0,0,0,2,1,1,2,0,2,3]
];

var mousePressed = false;

var app = {

  init : function(){

    this.canvas = document.querySelector('#myGameCanvas');
    this.canvas.offset = this.canvas.getBoundingClientRect().x;
    this.context = this.canvas ? this.canvas.getContext('2d') : null;

    if (!this.context)
    {
      console.log("Error getting application context");
      return; //TODO: notify user
    }

    window.addEventListener('keydown', controller.keypress, true);
    //window.addEventListener('mousedown', alert('test'), true);
    window.onmousedown = function() {
      mousePressed = true;
    }
    window.onmouseup = function() {
      mousePressed = false;
    }

    var canvas = this.canvas;

    window.onmousemove = function(e) {
      player.position.x = e.x - canvas.getBoundingClientRect().x - (playerWidth / 2);
    }
    this.setupBricks();
    this.update();

    return;

  },

  update : function(){

    if(!app.pause) {
      app.clearContext();

      app.drawBricks();
      player.draw();
      ball.update();
      requestAnimationFrame(app.update);
    }
  },

  clearContext : function(){
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    return;
  },

  die : function(){
    //TODO: better death!
    this.pause = true;
    let self = this;

    setTimeout(function() {
      self.pause = false;
      self.update();
    }, 1000);

    player.lives -= 1;

    switch(player.lives){
      case 0:
        this.reset();
        break;
    }

    ball.reset();
  },

  drawBricks : function(){

    this.bricks.forEach(function(brick){ brick.draw(); });

  },

  //TODO: this will change per level
  setupBricks : function(){


    this.bricks = new Array();
    let sampleBrick = new Brick();

    //var i = 0;
    var brickTop = 50;
    var brickBackLeft = 150;

    for(let i = 0; i < brickArray.length; i++) {
      let row = brickArray[i];

      for(let j = 0; j < row.length; j++) {
        if(row[j] != 0) {
          var brick = new Brick();
          brick.position.x = 150 + (j * brick.size.width) + j;
          brick.position.y = brickTop + i;
          brick.health = row[j];
          this.bricks.push(brick); 
        }
      }

      brickTop += sampleBrick.size.height;
    }
  },

  reset : function(){
    player.reset();
    ball.reset();
    this.setupBricks();
  },
  showMessage : function(messageText){
    this.context.font = "24px sans-serif";
    this.context.fillText(messageText, 350, 300);
  },

  bricks: [],

  canvas: null,
  context : null,
  timeout: 33,
  pause : false

};

var controller = {

  keypress : function(event){

    switch (event.keyCode) {
      case 37:
        player.moveLeft();
        break;
      case 39:
        player.moveRight();
        break;
    }

  },

};

var player = {

  // Defines initial position
  position: {
    x: playerXPosition,
    y: playerYPosition
  },

  score: 0,

  lives: playerLives,

  physics: {
    speed: playerSpeed
  },

  size: {
    height: playerHeight,
    width: playerWidth
  },

  draw : function(){
    app.context.fillStyle = "rgb(200, 0, 0)";
    app.context.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);

    app.context.textAlign = "center";
    app.context.fillStyle = "rgba(0, 0, 0, .2)";

    app.context.font = "18px sans-serif";
    app.context.fillText("Lives", 50, 20);
    app.context.fillText("Score", 50, 120);

    app.context.font = "48px sans-serif";
    app.context.fillText(this.lives, 50, 75);
    app.context.fillText(this.score, 50, 175);

    app.context.font = "24px sans-serif";
    app.context.fillText(gameTitle, 700, 20);
  },

  moveLeft: function(){
    if(app.pause) {
      return;
    }

    if (this.position.x > 0) {
      this.position.x -= this.physics.speed * 2;
    }
  },

  moveRight: function(){
    if(app.pause) {
      return;
    }

    if (this.position.x < (app.canvas.width - this.size.width)) {
      this.position.x += this.physics.speed * 2;
    }
  },

  reset: function(){
    this.lives = playerLives;
    this.score = 0;
    this.position.x = playerXPosition;
  }

};

function collide(r1,r2){
  var dx=(r1.position.x+r1.size.width/2)-(r2.position.x+r2.size.width/2);
  var dy=(r1.position.y+r1.size.height/2)-(r2.position.y+r2.size.height/2);
  var width=(r1.size.width+r2.size.width)/2;
  var height=(r1.size.height+r2.size.height)/2;
  var crossWidth=width*dy;
  var crossHeight=height*dx;
  var collision='none';
  //
  if(Math.abs(dx)<=width && Math.abs(dy)<=height){
      if(crossWidth>crossHeight){
          collision=(crossWidth>(-crossHeight))?'bottom':'left';
      }else{
          collision=(crossWidth>-(crossHeight))?'right':'top';
      }
  }
  return(collision);
} 

var ball = {

  position: {
    x: ballXPosition,
    y: ballYPosition
  },

  size: {
    height: ballHeight,
    width: ballWidth
  },

  physics: {
    speed: ballSpeed
  },

  direction: {
    x: 1, //Moving right
    y: 1 //Moving down
  },	

  draw : function(){
    app.context.fillStyle = "rgb(200, 0, 0)";
    app.context.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
  },

  reset : function(){
    this.position.x = 50;
    this.position.y = 50;
    this.direction.x = 1;
    this.direction.y = 1;
  },

  update : function(){

    if (this.position.x <= 0) //Left Bounds
      this.direction.x = -this.direction.x;
    if (this.position.x + this.size.width >= app.canvas.width) //Right Bounds
      this.direction.x = -this.direction.x;
    if (this.position.y <= 0) //Top Bounds
      this.direction.y = 1;
    if (this.position.y >= app.canvas.height) //Bottom Bounds
      app.die(); //TODO: die

    this.checkCollisionWithPlayer();
    this.checkCollisionWithBricks();

    this.position.x += (this.physics.speed * this.direction.x);
    this.position.y += (this.physics.speed * this.direction.y);

    this.draw();
  },

  checkCollisionWithPlayer : function(){

    if (this.position.y + this.size.height < player.position.y)
      return;
    if (this.position.y > player.position.y + player.size.height)
      return;
    if (this.position.x > player.position.x + player.size.width)
      return;
    if (this.position.x + this.size.width < player.position.x)
      return;

    let topPassedPlayer = this.position.y > player.position.y;

    if(topPassedPlayer) {
      return;
    }

    var centerOfPaddle = player.position.x + (player.size.width / 2);
    var centerOfBall = this.position.x + (this.size.width / 2);
    var distanceFromCenter = (centerOfBall - centerOfPaddle) / 20;

    this.direction.x = distanceFromCenter;
    this.direction.y = -1; //Moving up now

  },

  checkCollisionWithBricks : function(){
    var startingDirection = JSON.parse(JSON.stringify(this.direction));

    var i = 0;
    for (i = 0; i < app.bricks.length; i++) {
      var brick = app.bricks[i];

      var collision = collide(this, brick);

      if(collision == "none") {
        continue;
      }

      /* If the loop makes it this far, we have a collision */
      brick.health -= 1;

      player.score += 20;

      if (brick.health < 1) {
        app.bricks.splice(i, 1)
      };

      switch(collision) {
        case "top":
          this.direction.y = -1;
          break;
        case "bottom":
          this.direction.y = 1;
          break;
        case "left":
          this.direction.x = -this.direction.x;
          break;
        case "right":
          this.direction.x = -this.direction.x;
          break;
      }

      i = 999;
    }
  }

};

var Brick = function(){

  this.health = 3;

  this.size = {
    height: 30,
    width: 50
  };

  //Will be determined on setup
  this.position = {
    x: 0,
    y: 0
  };

};

Brick.prototype.draw = function(){

  switch (this.health) {
    case 3:
      app.context.fillStyle = strongBrickColor; //Green
      break;
    case 2:
      app.context.fillStyle = mediumBrickColor; //Orange?
      break;
    case 1:
      app.context.fillStyle = easyBrickColor; //Red
      break;
  }

  if (this.health > 0)
    app.context.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
};

Array.min = function( array ){
  return Math.min.apply( Math, array );
};

app.init();
var app = {

  init : function(){

    this.canvas = document.querySelector('#myGameCanvas');
    this.context = this.canvas ? this.canvas.getContext('2d') : null;

    if (!this.context)
    {
      console.log("Error getting application context");
      return; //TODO: notify user
    }

    window.addEventListener('keydown', controller.keypress, true);
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

    if (player.lives < 1)
      this.reset();

    ball.reset();
  },

  drawBricks : function(){

    this.bricks.forEach(function(brick){ brick.draw(); });

  },

  //TODO: this will change per level
  setupBricks : function(){
    var brickArray =
    [
      [1,1,1,1,1,1,1,1,1,1],
      [0,2,2,2,2,2,2,2,2,0],
      [0,0,3,3,0,3,3,3,0,0],
      [0,0,3,3,3,0,3,3,0,0],
      [0,2,2,2,2,2,2,2,2,0]
    ];

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
    x: 120,
    y: 480
  },

  score: 0,

  lives: 3,

  physics: {
    speed: 10
  },

  size: {
    height: 10,
    width: 80
  },

  draw : function(){
    app.context.fillStyle = "rgb(200, 0, 0)";
    app.context.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);

    app.context.textAlign = "center";
    app.context.fillStyle = "rgba(0, 0, 0, .2)";

    app.context.font = "18px sans-serif";
    app.context.fillText("Lives", 40, 20);
    app.context.fillText("Score", 40, 120);

    app.context.font = "48px sans-serif";
    app.context.fillText(this.lives, 40, 75);
    app.context.fillText(this.score, 40, 175);
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
    this.lives = 3;
    this.score = 0;
    this.position.x = 100;
  }

};

var ball = {

  position: {
    x: 50,
    y: 50
  },

  size: {
    height: 10,
    width: 10
  },

  physics: {
    speed: 5
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
      this.direction.x = 1;
    if (this.position.x >= app.canvas.width) //Right Bounds
      this.direction.x = -1;
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

    var distanceFromLeft = (this.position.x + this.size.width) - player.position.x;

    if(distanceFromLeft < this.size.width) {
      this.direction.x = -1;
    }

    var distanceFromRight = (player.position.x + player.size.width) - this.position.x;

    if(distanceFromRight < this.size.width) {
      this.direction.x = 1;
    }
    
    this.direction.y = -1; //Moving up now

  },

  checkCollisionWithBricks : function(){
    var startingDirection = JSON.parse(JSON.stringify(this.direction));

    var i = 0;
    for (i = 0; i < app.bricks.length; i++) {
      var brick = app.bricks[i];

      if (this.position.y + this.size.height + (this.physics.speed * this.direction.y) < brick.position.y) { 
        continue; 
      }
      
      if (this.position.y + (this.physics.speed * this.direction.y) > brick.position.y + brick.size.height) {
        continue;
      }
      
      if (this.position.x + (this.physics.speed * this.direction.x) > brick.position.x + brick.size.width) {
        continue;
      }
      
      if (this.position.x + this.size.width + (this.physics.speed * this.direction.x) < brick.position.x) {
        continue;
      }

      /* If the loop makes it this far, we have a collision */
      brick.health -= 1;

      player.score += 20;

      if (brick.health < 1)
        app.bricks.splice(i, 1);

      //Update direction based on where we hit the brick
      var distFromBottom = Math.abs(this.position.y - (brick.position.y + brick.size.height));
      var distFromLeft = Math.abs((this.position.x + this.size.width) - brick.position.x);
      var distFromTop = Math.abs((this.position.y + this.size.height) - brick.position.y);
      var distFromRight = Math.abs(this.position.x - (brick.position.x + brick.size.width));

      let ar = [distFromBottom, distFromLeft, distFromRight, distFromTop];
      let min = Array.min(ar);

      let side = '';

      switch(min) {
        case distFromBottom:
          side = 'bottom'
          break;
        case distFromLeft:
          side = 'left';
          break;
        case distFromTop:
          side = 'top';
          break;
        case distFromRight:
          side = 'right';
          break;
      }

      //Moving towards lower right
      if (startingDirection.x == 1 && startingDirection.y == 1) {
        if(distFromTop == distFromLeft) {
          side = 'left';
        }

        if(side == 'top') {
          this.direction.y = -1;
        } else {
          this.direction.x = -1;
        }
      } 
      //Moving towards lower left
      else if (startingDirection.x == -1 && startingDirection.y == 1) {
        if(distFromTop == distFromRight) {
          side = 'right';
        }

        if(side == 'top') {
          this.direction.y = -1;
        } else {
          this.direction.x = 1;
        }
      }
      //Moving towards upper right
      else if (startingDirection.x == 1 && startingDirection.y == -1) {
        if(distFromBottom == distFromLeft) {
          side  = 'left';
        }

        if(side == 'bottom') {
          this.direction.y = 1;
        } else {
          this.direction.x = -1;
        }
      }
      //Moving towards upper left
      else if (startingDirection.x == -1 && startingDirection.y == -1) {
        if(distFromBottom == distFromRight) {
          side = 'right';
        }

        if(side == 'bottom') {
          this.direction.y = 1;
        } else {
          this.direction.x = 1;
        }
      }
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
      app.context.fillStyle = "rgb(0, 200, 0)"; //Green
      break;
    case 2:
      app.context.fillStyle = "rgb(200, 200, 0)"; //Orange?
      break;
    case 1:
      app.context.fillStyle = "rgb(200, 0, 0)"; //Red
      break;
  }

  if (this.health > 0)
    app.context.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
};

Array.min = function( array ){
  return Math.min.apply( Math, array );
};

app.init();
var stage, w, h, loader;
var playerSprite, ground;
const maxJumpHeight = 2;

//tracking when the button is pressed down
var rightDown = false;
var leftDown = false;
var spaceDown = false;

//jumping vars
var isJumping = false;
var jumpHeight = 0;


init();

function init() {
    stage = new createjs.StageGL("testCanvas");

    // grab canvas width and height for later calculations:
    w = stage.canvas.width;
    h = stage.canvas.height;

    manifest = [
        { src: "../Assets/kenney_platformercharacters/PNG/Player/player.json", id: "player", type: "spritesheet" },
        { src: "../Assets/png/bg/redstone_sand.png", id: "floor" }
    ];

    loader = new createjs.LoadQueue(false);
    loader.addEventListener("complete", handleComplete);
    loader.loadManifest(manifest, true);
}

function tick(event) {
    spriteMovement();
    stage.update(event);
}

function handleComplete() {
    var player = loader.getResult("player");
    player.getAnimation("player_idle").next = "player_cheer";
    player.getAnimation("player_cheer").next = "player_stand";
    var playerSprite = new createjs.Sprite(player, "player_idle");
    playerSprite.y = 162;
    playerSprite.x = 80;
    playerSprite.regX = 50;
    playerSprite.name = "player";

    var groundImg = loader.getResult("floor");
    ground = new createjs.Shape();
    ground.graphics.beginBitmapFill(groundImg).drawRect(0, 0, w + groundImg.width, groundImg.height);
    ground.tileW = groundImg.width;
    ground.y = h - groundImg.height;
    ground.name = "ground";
    //I didnt write this comment ???
    //By default swapping between Stage for StageGL will not allow for vector drawing operation such as BitmapFill, useless you cache your shape.
    ground.cache(0, 0, w + groundImg.width, groundImg.height);

    stage.addChild(ground, playerSprite);
    this.document.onkeydown = handleKeyDown;
    this.document.onkeyup = handleKeyUp;

    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener("tick", tick);
}

function handleKeyDown(event) {
    playerSprite = stage.getChildByName("player");
    switch (event.code) {
        case "ArrowRight":
            if (rightDown == false) {
                playerSprite.scaleX = 1;
                playerSprite.gotoAndPlay("player_walk");
                rightDown = true;
            }
            break;
        case "ArrowLeft":
            if (leftDown == false) {
                playerSprite.scaleX = -1;
                playerSprite.gotoAndPlay("player_walk");
                leftDown = true;
            }
            break;
        case "Space":
            if (spaceDown == false) {
                spaceDown = true;
                if(isJumping == false){
                    playerSprite.gotoAndPlay("player_jump");
                    jump();
                }
            }
            break;
        case "ArrowDown":
            break;
        default:
            break;
    }
}

function handleKeyUp(event) {
    switch (event.code) {
        case "ArrowRight":
            rightDown = false;
            break;
        case "ArrowLeft":
            leftDown = false;
            break;
        case "Space":
            spaceDown = false;
            break;
        case "ArrowDown":
            break;
        default:
            break;
    }
    if (spaceDown == false && rightDown == false && leftDown == false) {
        setTimeout(function () {
            playerSprite.stop();
            playerSprite.gotoAndPlay("player_stand");
        }, 200)
    }
}

function spriteMovement() {
    playerSprite = stage.getChildByName("player");
    ground = stage.getChildByName("ground");
    //if they are walking
    if (rightDown == true) {
        createjs.Tween.get(ground)
            .to({ x: ground.x - 20, scaleX: 1 }, 200)
    }
    else if (leftDown == true) {
        createjs.Tween.get(ground)
            .to({ x: ground.x + 20, scaleX: 1 }, 200)
    } else {

    }
}

function jump() {
    //if the space bar is down and they have not reach max height move up
    if (spaceDown == true && jumpHeight < maxJumpHeight) {
        //locks additional jump actions while jumping
        isJumping = true;
        createjs.Tween.get(playerSprite)
            .to({ y: playerSprite.y - 50 }, 200)
        //increments jump height counter
        jumpHeight++;
        //start jump logic again once jump iteration has completed
        setTimeout(jump, 200)
    } else {
        startFalling();
    }
}

function startFalling() {
    //moving sprite
    createjs.Tween.get(playerSprite)
        .to({ y: playerSprite.y + (50 * jumpHeight) }, (200 * jumpHeight))
    //do not reset the jump until they have completed the fall
    setTimeout(function () {
        //reset jump
        jumpHeight = 0;
        isJumping = false;
        //check if I need to resume the walk animation
        if(leftDown == true || rightDown == true){
            playerSprite.gotoAndPlay("player_walk");
        }
    }, jumpHeight*300)
}
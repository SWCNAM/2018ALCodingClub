var stage, w, h, loader;
var playerSprite, ground;
const maxJumpHeight = 3;

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
    document.getElementById("test1").innerHTML = spaceDown;
    document.getElementById("test2").innerHTML = isJumping;
    document.getElementById("test3").innerHTML = jumpHeight;
}

function handleComplete() {
    var player = loader.getResult("player");
    player.getAnimation("player_idle").next = "player_cheer";
    player.getAnimation("player_cheer").next = "player_stand";
    var playerSprite = new createjs.Sprite(player, "player_idle");
    playerSprite.y = 162;
    playerSprite.x = 80;
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
                playerSprite.gotoAndPlay("player_walk");
                rightDown = true;
            }
            break;
        case "ArrowLeft":
            if (leftDown == false) {
                playerSprite.gotoAndPlay("player_walk");
                leftDown = true;
            }
            break;
        case "Space":
            if (spaceDown == false) {
                spaceDown = true;
                if(isJumping == false){
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
    if (spaceDown == true && jumpHeight < maxJumpHeight) {
        isJumping = true;
        createjs.Tween.get(playerSprite)
            .to({ y: playerSprite.y - 50 }, 200)
        jumpHeight++;
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
        jumpHeight = 0;
        isJumping = false;
    }, jumpHeight*300)
}
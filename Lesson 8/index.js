var stage, loader;
var playerSprite;

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

    manifest = [
        { src: "../Assets/kenney_platformercharacters/PNG/Player/player.json", id: "player", type: "spritesheet" },
    ];

    loader = new createjs.LoadQueue(false);
    loader.addEventListener("complete", handleComplete);
    loader.loadManifest(manifest, true);
}

function tick(event) {
    determineAnimation();
    stage.update(event);
}

function handleComplete() {
    var player = loader.getResult("player");
    player.getAnimation("player_idle").next = "player_cheer";
    player.getAnimation("player_cheer").next = "player_stand";
    var playerSprite = new createjs.Sprite(player, "player_idle");
    playerSprite.y = 150;
    playerSprite.x = 80;
    playerSprite.name = "player";

    stage.addChild(playerSprite);
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
            spaceDown = true;
            if (jumpHeight < 3) {
                playerSprite.gotoAndPlay("player_jump");
                isJumping = true;
                jumpHeight++;
            }
            else {
                if (isJumping == true) {
                    createjs.Tween.get(playerSprite)
                        .to({ y: playerSprite.y + (50 * jumpHeight) }, (200 * jumpHeight))
                    isJumping = false;
                    jumpHeight = 0;
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
            if (isJumping == true) {
                createjs.Tween.get(playerSprite)
                    .to({ y: playerSprite.y + (50 * jumpHeight) }, (200 * jumpHeight))
                isJumping = false;
                jumpHeight = 0;
            }
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

function determineAnimation() {
    playerSprite = stage.getChildByName("player");
    if (spaceDown == true && jumpHeight < 3) {
        createjs.Tween.get(playerSprite)
            .to({ y: playerSprite.y - 50 }, 200)
    }
    else if (rightDown == true) {
        createjs.Tween.get(playerSprite)
            .to({ x: playerSprite.x + 20, scaleX: 1 }, 200)
    }
    else if (leftDown == true) {
        createjs.Tween.get(playerSprite)
            .to({ x: playerSprite.x - 20, scaleX: -1 }, 200)
    } else {

    }
}
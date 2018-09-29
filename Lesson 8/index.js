var stage, w, h, loader;
var playerSprite;
var keyHandler = false;

init();

function init() {
    stage = new createjs.StageGL("testCanvas");

    // grab canvas width and height for later calculations:
    w = stage.canvas.width;
    h = stage.canvas.height;

    manifest = [
        { src: "../Assets/kenney_platformercharacters/PNG/Player/player.json", id: "player", type: "spritesheet" },
    ];

    loader = new createjs.LoadQueue(false);
    loader.addEventListener("complete", handleComplete);
    loader.loadManifest(manifest, true);
}

function tick(event) {
    playerSprite = stage.getChildByName("player");
    if (keyHandler == "ArrowRight") {
        createjs.Tween.get(playerSprite)
        .to({ x: playerSprite.x + 20, scaleX: 1 }, 200)
    }
    else if (keyHandler == "ArrowLeft") {
        createjs.Tween.get(playerSprite)
        .to({ x: playerSprite.x - 20, scaleX: -1 }, 200)
    } else {
        
    }

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
    if (keyHandler == null) {
        playerSprite = stage.getChildByName("player");
        playerSprite.gotoAndPlay("player_walk");
        switch (event.code) {
            case "ArrowRight":
                keyHandler = "ArrowRight";
                break;
            case "ArrowLeft":
                keyHandler = "ArrowLeft";
                break;
            case "Space":
                break;
            default:
                break;
        }
    }
}

function handleKeyUp(event) {
    keyHandler = null;
    if (event.code != "Space") {
        playerSprite = stage.getChildByName("player");
        playerSprite.stop();
        playerSprite.gotoAndPlay("player_stand");
    }
}
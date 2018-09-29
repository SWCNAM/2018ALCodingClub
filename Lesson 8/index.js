var stage, w, h, loader;
var player;

init();

function init() {
    stage = new createjs.StageGL("testCanvas");

    // grab canvas width and height for later calculations:
    w = stage.canvas.width;
    h = stage.canvas.height;

    manifest = [
        {src: "../Assets/kenney_platformercharacters/PNG/Player/player.json", id: "player",type:"spritesheet"},
    ];

    loader = new createjs.LoadQueue(false);
    loader.addEventListener("complete", handleComplete);
    loader.loadManifest(manifest, true);
}

function tick(event) {
    stage.update(event);
}

function handleComplete(){
    player = loader.getResult("player");
    player.getAnimation("player_idle").next = "player_cheer";
    player.getAnimation("player_cheer").next = "player_stand";
    var playerSprite = new createjs.Sprite(player, "player_idle");
    playerSprite.y = 150;

    stage.addChild(playerSprite);

    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener("tick", tick);
}

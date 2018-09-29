var stage, w, h, loader;
var player;

init();

function init() {
    stage = new createjs.StageGL("testCanvas");

    // grab canvas width and height for later calculations:
    w = stage.canvas.width;
    h = stage.canvas.height;

    manifest = [
        {src: "Player/player.png", id: "player"},
    ];

    loader = new createjs.LoadQueue(false);
    loader.addEventListener("complete", handleComplete);
    loader.loadManifest(manifest, true, "../Assets/kenney_platformercharacters/PNG/");
}

function tick(event) {
    stage.update(event);
}

function handleComplete(){
    setPlayer();
    var spriteSheet = new createjs.SpriteSheet(player);
    var playerSprite = new createjs.Sprite(spriteSheet, "player_idle");
    playerSprite.y = 35;

    stage.addChild(playerSprite);

    // createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener("tick", tick);
}

function setPlayer() {
    player = {
        "images": [
            loader.getResult("player")
        ],

        "framerate": 20,
        "frames": [
            [1, 1, 76, 109, 0, -4, -1],
            [1, 112, 78, 93, 0, -2, -17],
            [79, 1, 78, 104, 0, -1, -5],
            [81, 107, 79, 99, 0, -1, -10],
            [159, 1, 73, 102, 0, -3, -8],
            [162, 105, 80, 101, 0, 0, -7],
            [234, 1, 80, 101, 0, 0, -6],
            [244, 104, 70, 101, 0, 0, -9],
            [316, 1, 60, 101, 0, -9, -6],
            [316, 104, 60, 101, 0, -11, -6],
            [378, 1, 79, 99, 0, -1, -11],
            [378, 102, 57, 99, 0, -12, -11],
            [437, 102, 78, 98, 0, -1, -12],
            [459, 1, 74, 98, 0, -2, -12],
            [517, 101, 79, 97, 0, 0, -13],
            [535, 1, 77, 97, 0, -2, -13],
            [598, 100, 76, 97, 0, 0, -13],
            [614, 1, 65, 97, 0, -8, -13],
            [676, 100, 65, 97, 0, -8, -13],
            [681, 1, 62, 97, 0, -9, -13],
            [743, 100, 54, 97, 0, -8, -13],
            [745, 1, 69, 96, 0, -9, -14],
            [816, 1, 68, 85, 0, -7, -25],
            [799, 99, 79, 95, 0, 0, -15]
        ],

        "animations": {
            "player_hang": { "frames": [0] },
            "player_slide": { "frames": [1] },
            "player_swim": { "frames": [6, 2] },
            "player_fall": { "frames": [3] },
            "player_jump": { "frames": [4] },
            "player_hurt": { "frames": [5] },
            "player_action": { "frames": [7, 23] },
            "player_climb": { "frames": [8, 9] },
            "player_kick": { "frames": [10] },
            "player_walk": { "frames": [13, 11] },
            "player_cheer": { "frames": [12, 15] },
            "player_hold": { "frames": [14, 20] },
            "player_talk": { "frames": [16] },
            "player_back": { "frames": [17] },
            "player_idle": { "frames": [18] },
            "player_stand": { "frames": [19] },
            "player_skid": { "frames": [21] },
            "player_duck": { "frames": [22] }
        }
    }
}
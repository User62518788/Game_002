const GAME_PAUSE_MENU = document.getElementById("game-pause-menu");
const START_MENU = document.getElementById("start-menu");
const GAME_PAUSE_BUTTON = document.getElementById("pause-button");
const GAME_RESUME_BUTTON = document.getElementById("resume");
const PLAY_BUTTON = document.getElementById("play");
const GAME_CANVAS = document.getElementById("game-canvas");
const TIME_DISPLAY = document.getElementById("time");
const HEALTH_DISPLAY = document.getElementById("health");
const WAVE_DISPLAY = document.getElementById("wave");

const GAME_FPS = 60;
const TIME_WAVE_RATIO = 5;

let canvasContext;

let windowWidth;
let windowHeight;

let game;

let player;
let playerConfig = {
    type: "player",
    speed: 5,
    size: 20,
    color: "white",
    health: 10
}

let enemyCount = 10;
let enemyConfig = {
    type: "enemy",
    speed: 2,
    size: 20,
    color: "lightblue",
    health: 2
}

let bulletConfig = {
    type: "bullet",
    speed: 3,
    size: 5,
    color: "yellow",
}

let movementKeydown = {
    w: false,
    a: false,
    s: false,
    d: false
}

let isPause = false;
let isGameStart = false;

document.addEventListener("keydown",
    (event) => {
        if (isPause || !isGameStart) return;
        const keyName = event.key;
        const keyCode = event.code;

        if (keyName == "Escape") {
            togglePauseMenu();
        }
        
        if (keyCode == "KeyW") {
            if (!movementKeydown.w) {
                movementKeydown.w = true;
                player.changeVelocity(1, -1);
            }
        }
        if (keyCode == "KeyS") {
            if (!movementKeydown.s) {
                movementKeydown.s = true;
                player.changeVelocity(1, 1);
            }
        }
        if (keyCode == "KeyA") {
            if (!movementKeydown.a) {
                movementKeydown.a = true;
                player.changeVelocity(0, -1);
            }
        }
        if (keyCode == "KeyD") {
            if (!movementKeydown.d) {
                movementKeydown.d = true;
                player.changeVelocity(0, 1);
            }
        }
    },
    true
);
document.addEventListener("keyup", (event) => {
    if (isPause || !isGameStart) return;
    let keyCode = event.code;
    if (keyCode == "KeyW") {
        if (movementKeydown.w) {
            movementKeydown.w = false;
            player.changeVelocity(1, 1);
        }
    }
    if (keyCode == "KeyS") {
        if (movementKeydown.s) {
            movementKeydown.s = false;
            player.changeVelocity(1, -1);
        }
    }
    if (keyCode == "KeyA") {
        if (movementKeydown.a) {
            movementKeydown.a = false;
            player.changeVelocity(0, 1);
        }
    }
    if (keyCode == "KeyD") {
        if (movementKeydown.d) {
            movementKeydown.d = false;
            player.changeVelocity(0, -1);
        }
    }
}, true);

GAME_PAUSE_BUTTON.addEventListener("mousedown", 
    (event) => {
        togglePauseMenu();
    }
);

GAME_RESUME_BUTTON.addEventListener("mousedown", 
    (event) => {
        togglePauseMenu();
    }
);

function togglePauseMenu() {
    if (!isGameStart) return;
    if (!isPause) {
        GAME_PAUSE_MENU.style.display = "";
        GAME_PAUSE_BUTTON.style.backgroundColor = "rgb(255, 255, 255)";
        isPause = true;
    } else {
        GAME_PAUSE_MENU.style.display = "none";
        GAME_PAUSE_BUTTON.style.backgroundColor = "";
        isPause = false;

        setTimeout(() => {
            document.body.requestFullscreen();
        }, 100);
    }
}

window.addEventListener("resize", 
    (event) => {
        windowWidth = window.innerWidth;
        windowHeight = window.innerHeight;
        resizeCanvas();
    }
);

function initCanvas() {
    canvasContext = GAME_CANVAS.getContext("2d");
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    resizeCanvas();
}

function resizeCanvas() {
    canvasContext.canvas.width = windowWidth;
    canvasContext.canvas.height = windowHeight;
}

function initPlayerUpdate() {
    let updateInterval = setInterval(() => {
        player.update(canvasContext);
    }, 1000 / GAME_FPS);
}

function initBulletUpdate(_bullet) {
    let updateInterval = setInterval(() => {
        _bullet.update(canvasContext);
    }, 1000 / GAME_FPS)
}

function initGameUpdate() {
    let updateInterval = setInterval(() => {
        if (isPause) return;
        game.update(canvasContext);
    }, 1000 / GAME_FPS);
}

function getUnitVelocity(_bulletPosition, _mousePosition, _unitR) {
    let offsetX = _mousePosition[0] - _bulletPosition[0];
    let offsetY = _mousePosition[1] - _bulletPosition[1];
    let offsetR = Math.sqrt((offsetX * offsetX) + (offsetY * offsetY));

    let ratio = _unitR / offsetR;
    let unitX = ratio * offsetX;
    let unitY =  ratio * offsetY;

    return [unitX, unitY];
}

document.addEventListener("mousedown", (event) => {
    if (isPause || !isGameStart) return;

    let playerSize = playerConfig.size;
    let bulletSize = bulletConfig.size;
    let bullet = new Bullet([player.position[0] + playerSize / 2 - bulletSize / 2, player.position[1] + playerSize / 2 - bulletSize / 2], bulletConfig);
    let mousePosition = [event.clientX, event.clientY];

    let unitVelocity = getUnitVelocity(bullet.position, mousePosition, bullet.speed);
    bullet.changeVelocity(0, unitVelocity[0]);
    bullet.changeVelocity(1, unitVelocity[1]);

    game.addEntity(bullet);
    setTimeout(() => {
        game.destroy(game, bullet);
    }, 2000);
})

function enemyUpdate(_enemy) {
    if (isPause) return;
    let enemyPosition = _enemy.position;
    let playerPosition = player.position;

    let unitVelocity = getUnitVelocity(enemyPosition, playerPosition, _enemy.speed);
    _enemy.setVelocity(0, unitVelocity[0]);
    _enemy.setVelocity(1, unitVelocity[1]);
}

function startGame() {
    START_MENU.style.display = "none";
    game = new Game();
    game.game = game;

    let spawner = new Spawner(game);
    let wave = new Wave(game);
    
    game.bindWave(wave);
    spawner.spawnEnemyLoop();

    let positionX = Math.round(windowWidth / 2);
    let positionY = Math.round(windowHeight / 2);
    player = new Player([positionX, positionY], playerConfig);

    game.addEntity(player);
    initGameUpdate();
}

PLAY_BUTTON.addEventListener("mousedown", (event) => {
    isGameStart = true;
    document.body.requestFullscreen();
    startGame();
});

window.onload = () => {
    initCanvas();
};

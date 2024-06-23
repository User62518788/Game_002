class Spawner {
    #game;
    #loopInterval;

    constructor(_game) {
        this.#game = _game;
        _game.bindSpawner(this);
    }
    spawnEnemy() {
        let positionX = Math.round(Math.random() * windowWidth);
        let positionY = Math.round(Math.random() * windowHeight);
        let position = [positionX, positionY];

        let enemy = new Enemy(position, enemyConfig);
        this.#game.addEntity(enemy);
    }
    spawnEnemyLoop() {
        let gameWave = this.#game.wave

        this.#loopInterval = setInterval(() => {
            if (isPause) return;
            this.spawnEnemy();
        }, 1000 / gameWave.wave);
    }
    updateEnemyLoop() {
        clearInterval(this.#loopInterval);
        this.spawnEnemyLoop();
    }
}
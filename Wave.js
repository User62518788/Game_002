class Wave {
    #counter;
    #wave = 1;
    #previousWave = 1;
    #game;

    constructor(_game) {
        let counter = new Counter(_game);
        this.#counter = counter;
        this.#game = _game;
        counter.startCountLoop();
        this.update();
    }
    update() {
        let count = this.#counter.count;
        let spawner = this.#game.spawner;
        this.#wave = (count / TIME_WAVE_RATIO) - (count / TIME_WAVE_RATIO) % 1 + 1;
        WAVE_DISPLAY.textContent = "Wave: " + this.#wave;

        if (this.#wave != this.#previousWave) {
            spawner.updateEnemyLoop();
        }

        this.#previousWave = this.#wave;
    }
    get wave() {
        return this.#wave;
    }
}
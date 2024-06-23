class Counter {
    #count = 0;
    #game;
    #loopInterval;

    constructor(_game) {
        this.#game = _game;
    }
    startCountLoop() {
        this.#loopInterval = setInterval(() => {
            if (isPause) return;
            this.#count += 1;
            this.#game.wave.update();
            TIME_DISPLAY.textContent = "Time: " + this.#count;
        }, 1000);
    }
    stopCountLoop() {
        clearInterval(this.#loopInterval);
    }
    get count() {
        return this.#count;
    }
}
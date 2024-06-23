class Enemy extends Entity {
    #damageDebounce = false;

    constructor(_position, _enemyConfig) {
        super(_position, _enemyConfig);
        
    }
    damage() {
        if (this.#damageDebounce) return;
        this.#damageDebounce = true;

        setTimeout(() => {
            this.#damageDebounce = false;
        }, 500);

        if (this.isCollision(this, player)) {
            player.health -= 1;
            HEALTH_DISPLAY.textContent = "Health: " + player.health;
        }
        if (player.health <= 0) {
            isPause = true;
            player = null;

            setTimeout(() => {
                canvasContext.clearRect(0, 0, windowWidth, windowHeight);
            }, 100);
        }
    }
}
class Bullet extends Entity {
    constructor(_position, _bulletConfig) {
        super(_position, _bulletConfig);
    }
    damage() {
        let enemyList = this.game.getEnemyList();
        enemyList.forEach(enemy => {
            let isCollision = this.isCollision(enemy, this);
            if (isCollision) {
                this.game.destroy(this);
                enemy.health -= 1;
            }
            if (enemy.health <= 0) {
                this.game.destroy(enemy);
            }
        });
    }
}
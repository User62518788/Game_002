class Game {
    #entityList = [];
    #enemyList = [];
    #game;
    #wave;
    #spawner;

    constructor() {
        
    }
    addEntity(_entity) {
        _entity.game = this.#game;
        if (_entity.type == "enemy") {
            this.#enemyList.push(_entity);
        }
        this.#entityList.push(_entity);
    }
    update(_canvasContext) {
        _canvasContext.clearRect(0, 0, _canvasContext.canvas.width, _canvasContext.canvas.height);

        this.#entityList.forEach(_entity => {
            if (_entity.type == "enemy") {
                enemyUpdate(_entity);
                _entity.damage();
            }
            if (_entity.type == "bullet") {
                _entity.damage();
            }
            _entity.update(_canvasContext);
        });
    }
    bindWave(_wave) {
        this.#wave = _wave;
    }
    bindSpawner(_spawner) {
        this.#spawner = _spawner;
    }
    getEntityList() {
        return this.#entityList;
    }
    getEnemyList() {
        return this.#enemyList;
    }
    destroy(_entity) {
        let entityList = this.getEntityList();
        let entityIndex = entityList.indexOf(_entity);
        let enemyIndex = this.#enemyList.indexOf(_entity);

        if (entityIndex > -1) {
            entityList.splice(entityIndex, 1);
        }
        if (enemyIndex > -1) {
            this.#enemyList.splice(enemyIndex, 1);
        }

    }
    get wave() {
        return this.#wave;
    }
    get spawner() {
        return this.#spawner;
    }
    set game(_game) {
        this.#game = _game;
    }
}
class Entity {
    #game;
    #type;
    #stats;
    #position = [];
    #velocity = [0, 0];
    #speed;
    #size;
    #color;
    #health;

    constructor(_position, _entityConfig) {
        if (_entityConfig != undefined) {
            const {speed: _speed, size: _size, color: _color, type: _type, health: _health} = _entityConfig;
            this.#speed = _speed;
            this.#size = _size;
            this.#color = _color;
            this.#type = _type;
            this.#health = _health;
        }
        this.#position = _position;
    }
    update(_canvasContext) {
        _canvasContext.fillStyle = this.#color;
        _canvasContext.fillRect(this.#position[0], this.#position[1], this.#size, this.#size);
        this.move();
    }
    move() {
        this.#position[0] += this.#velocity[0] * this.#speed;
        this.#position[1] += this.#velocity[1] * this.#speed;
    }
    changeVelocity(_dimension, _scalar) {
        this.#velocity[_dimension] += _scalar;
    }
    setVelocity(_dimension, _scalar) {
        this.#velocity[_dimension] = _scalar;
    }
    isCollision(_entity1, _entity2) {
        if ( !((_entity1.position[0] + _entity1.size) >= _entity2.position[0]) || !((_entity1.position[0] - _entity1.size) <= _entity2.position[0]) ) {
            return false;
        }
        if ( !((_entity1.position[1] + _entity1.size) >= _entity2.position[1]) || !((_entity1.position[1] - _entity1.size) <= _entity2.position[1])) {
            return false;
        }
        return true;
    }
    get velocity() {
        return this.#velocity;
    }
    get position() {
        return this.#position;
    }
    set position(_value) {
        this.#position = _value;
    }
    get speed() {
        return this.#speed;
    }
    get size() {
        return this.#size;
    }
    get type() {
        return this.#type;
    }
    get game() {
        return this.#game;
    }
    set game(_game) {
        this.#game = _game;
    }
    get health() {
        return this.#health;
    }
    set health(_health) {
        this.#health = _health;
    }
}
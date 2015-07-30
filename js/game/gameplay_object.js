TRAFFICSIM_APP.game = TRAFFICSIM_APP.game || {};

TRAFFICSIM_APP.game.GameplayObject = function() {
    this._worldController = null;
    this._model = null;
    this._position = {
        "x": 0,
        "y": 0,
        "z": 0
    };

    this.setOptions = function(worldController_, model) {
        this._worldController = worldController_;
        this._model = model;
    };
};

TRAFFICSIM_APP.game.GameplayObject.prototype.getModel = function() {
    return this._model;
};

TRAFFICSIM_APP.game.GameplayObject.prototype.setPosition = function(position) {
    this._position = position;

    if (this._model) {
        this._model.position.x = position.x;
        this._model.position.y = position.y;
        this._model.position.z = position.z;
    }
};
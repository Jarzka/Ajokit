TRAFFICSIM_APP.game = TRAFFICSIM_APP.game || {};

TRAFFICSIM_APP.game.GameplayObject = function(worldController, model) {
    this._worldController = worldController;
    this._model = model;
    this._position = {
        "x": 0,
        "y": 0,
        "z": 0
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
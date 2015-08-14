TRAFFICSIM_APP.game = TRAFFICSIM_APP.game || {};

TRAFFICSIM_APP.game._nextGameplayObjectId = 0;

TRAFFICSIM_APP.game.GameplayObject = function (worldController, model) {
    this._id = TRAFFICSIM_APP.game._nextGameplayObjectId++;
    this._worldController = worldController;
    this._model = model;
    this._angle = 0;
    this._position = {
        "x": 0,
        "y": 0,
        "z": 0
    };
    this._rotation = {
        "x": 0,
        "y": 0,
        "z": 0
    };
};

TRAFFICSIM_APP.game.GameplayObject.prototype.getModel = function () {
    return this._model;
};

TRAFFICSIM_APP.game.GameplayObject.prototype.getPosition = function() {
    return this._position;
};

TRAFFICSIM_APP.game.GameplayObject.prototype.setPosition = function (position) {
    this._position = position;

    if (this._model) {
        this._model.position.x = position.x;
        this._model.position.y = position.y;
        this._model.position.z = position.z;
    }
};

TRAFFICSIM_APP.game.GameplayObject.prototype.setAngle = function (angle) {
    this._angle = angle;

    if (this._model) {
        this._model.rotation.y = angle;
    }
};

TRAFFICSIM_APP.game.GameplayObject.prototype.getRotation = function() {
    return this._rotation;
};

TRAFFICSIM_APP.game.GameplayObject.prototype.setRotation = function (rotation) {
    this._rotation = rotation;

    if (this._model) {
        this._model.rotation.x = rotation.x;
        this._model.rotation.y = rotation.y;
        this._model.rotation.z = rotation.z;
    }
};
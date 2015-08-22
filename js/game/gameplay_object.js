(function () {

    TRAFFICSIM_APP.game = TRAFFICSIM_APP.game || {};

    var Vector3 = TRAFFICSIM_APP.utils.Vector3;

    TRAFFICSIM_APP.game._nextGameplayObjectId = 0;

    TRAFFICSIM_APP.game.GameplayObject = function (worldController, model) {
        this._id = TRAFFICSIM_APP.game._nextGameplayObjectId++;
        this._worldController = worldController;
        this._model = model;
        this._angle = 0; // in radians
        this._position = new Vector3();
        this._collisionMask = null; // Array of polygon points at 0 angle. Points are relative to the current position.
        this._collisionMaskTemplate = null;
    };

    TRAFFICSIM_APP.game.GameplayObject.prototype.getModel = function () {
        return this._model;
    };

    TRAFFICSIM_APP.game.GameplayObject.prototype.getPosition = function () {
        return this._position;
    };

    TRAFFICSIM_APP.game.GameplayObject.prototype.setPosition = function (vector3) {
        this._position.set(vector3);

        if (this._model) {
            this._model.position.x = vector3.x;
            this._model.position.y = vector3.y;
            this._model.position.z = vector3.z;
        }
    };

    /** Sets current angle in radians. */
    TRAFFICSIM_APP.game.GameplayObject.prototype.setAngle = function (angle) {
        this._angle = angle;

        if (this._collisionMask) {
            this.updateCollisionMask();
        }

        if (this._model) {
            this._model.rotation.y = angle;
        }
    };

})();
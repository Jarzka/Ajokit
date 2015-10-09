(function () {
    TRAFFICSIM_APP.game = TRAFFICSIM_APP.game || {};
    TRAFFICSIM_APP.game.gameplay_object = TRAFFICSIM_APP.game.gameplay_object || {};

    var NS = TRAFFICSIM_APP.game.gameplay_object;
    var Vector3 = TRAFFICSIM_APP.utils.vector3.Vector3;

    NS.GameplayObject = function (worldController, model) {
        this._worldController = worldController;
        this._model = model;
        if (model) { worldController.getThreeJSScene().add(model); }
        this._angle = 0; // in radians
        this._position = new Vector3();
        this._collisionMask = null; // Array of polygon points at 0 angle. Points are relative to the current position.
        this._collisionMaskTemplate = null;
    };

    NS.GameplayObject.prototype.getModel = function () {
        return this._model;
    };

    NS.GameplayObject.prototype.getPosition = function () {
        return this._position;
    };

    NS.GameplayObject.prototype.getPosition = function () {
        return this._position;
    };

    NS.GameplayObject.prototype.setPosition = function (vector3) {
        this._position = vector3;

        if (this._model) {
            this._model.position.x = vector3.x;
            this._model.position.y = vector3.y;
            this._model.position.z = vector3.z;
        }
    };

    /** Sets current angle in radians. */
    NS.GameplayObject.prototype.setAngle = function (angle) {
        this._angle = angle;

        if (this._collisionMask) {
            this.updateCollisionMask();
        }

        if (this._model) {
            this._model.rotation.y = angle;
        }
    };

    NS.GameplayObject.prototype.die = function() {
        this._worldController.getThreeJSScene().remove(this._model);
    }
})();
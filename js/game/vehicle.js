TRAFFICSIM_APP.game = TRAFFICSIM_APP.game || {};

TRAFFICSIM_APP.game.VehicleType = {
    "CAR": 1
};


TRAFFICSIM_APP.game.Vehicle = function (worldController, model, vehicleType) {
    var self = this;

    this._vehicleType = vehicleType;

    function constructor(worldController, model) {
        TRAFFICSIM_APP.game.GameplayObject.call(self, worldController, model);
    }

    constructor(worldController, model);
};

TRAFFICSIM_APP.game.Vehicle.prototype = Object.create(TRAFFICSIM_APP.game.GameplayObject.prototype);

TRAFFICSIM_APP.game.Vehicle.prototype.getVehicleType = function () {
    return this._vehicleType;
};

TRAFFICSIM_APP.game.Vehicle.prototype.update = function() {
    // TODO
};
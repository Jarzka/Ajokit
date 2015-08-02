TRAFFICSIM_APP.game = TRAFFICSIM_APP.game || {};

TRAFFICSIM_APP.game.VehicleController = function (worldController) {
    var self = this;

    var worldController = worldController;
    var map = worldController.getMap();
    var vehicles = [];

    this.getWorldController = function () {
        return this._worldController;
    };

    this.initializeCars = function() {
        // TODO
    }
};
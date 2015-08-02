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
        var car = new TRAFFICSIM_APP.game.Vehicle(
            worldController,
            worldController.getGameplayScene().getApplication().getModelContainer().getModelByName("car"),
            TRAFFICSIM_APP.game.VehicleType.CAR);
        car.setPosition(
            {
                "x": 0,
                "y": 0,
                "z": 0
            });
        vehicles.push(car);
        worldController.getThreeJSScene().add(car.getModel());
    }
};
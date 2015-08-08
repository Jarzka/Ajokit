TRAFFICSIM_APP.game = TRAFFICSIM_APP.game || {};

TRAFFICSIM_APP.game.VehicleController = function (worldController) {
    var self = this;

    var worldController = worldController;
    var vehicles = [];

    this.getWorldController = function () {
        return this._worldController;
    };

    this.initializeCars = function() {
        var car = new TRAFFICSIM_APP.game.Vehicle(
            worldController,
            worldController.getGameplayScene().getApplication().getModelContainer().getModelByName("car"),
            TRAFFICSIM_APP.game.VehicleType.CAR);
        var node = worldController.getRoadController().getNodes()[4];
        car.setNode(node);
        vehicles.push(car);
        worldController.getThreeJSScene().add(car.getModel());
    };

    this.update = function(deltaTime) {
        vehicles.forEach(function (vehicle) {
            vehicle.update(deltaTime);
        });
    }
};
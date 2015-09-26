TRAFFICSIM_APP.game = TRAFFICSIM_APP.game || {};

TRAFFICSIM_APP.game.VehicleController = function (worldController) {
    var self = this;

    var worldController = worldController;
    var vehicles = [];

    this.getWorldController = function () {
        return this._worldController;
    };

    function initializeRandomCars(numberOfCars) {
        for (var i = 0; i < numberOfCars; i++) {
            var car = new TRAFFICSIM_APP.game.Vehicle(
                worldController,
                worldController.getGameplayScene().getApplication().getModelContainer().getModelByName("car").clone(),
                TRAFFICSIM_APP.game.VehicleType.CAR);
            var nodes = worldController.getRoadController().getNodes();

            if (nodes[i * 2]) {
                var node = nodes[i * 2];
                car.setNode(node);
                var position = node.position.copy();
                position.y = 0.1;
                car.setPosition(position);
                vehicles.push(car);
            }
        }
    }

    this.initializeCars = function () {
        initializeRandomCars(0);
    };

    this.update = function (deltaTime) {
        vehicles.forEach(function (vehicle) {
            vehicle.update(deltaTime);
        });
    };

    this.getVehicles = function () {
        return vehicles;
    }
};
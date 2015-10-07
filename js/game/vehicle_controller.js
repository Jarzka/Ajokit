TRAFFICSIM_APP.game = TRAFFICSIM_APP.game || {};

TRAFFICSIM_APP.game.VehicleController = function (worldController) {
    var self = this;

    var worldController = worldController;
    var vehicles = [];
    var math = TRAFFICSIM_APP.utils.math;

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

            if (nodes[i * 4]) {
                var node = nodes[i * 4];
                car.setNode(node);
                var position = node.position.copy();
                position.y = 0.1;
                car.setPosition(position);
                vehicles.push(car);
            }
        }
    }

    this.initializeCars = function () {
        initializeRandomCars(15);
    };

    this.update = function (deltaTime) {
        vehicles.forEach(function (vehicle) {
            vehicle.update(deltaTime);
        });
    };

    this.getVehicles = function () {
        return vehicles;
    };

    this.removeRandomCar = function() {
        if (vehicles.length > 0) {
            vehicles[math.randomValue(0, vehicles.length - 1)].die();
        }
    };

    this.addCarAtRandomFreePosition = function(routeNodes, map) {
        routeNodes.some(function(node) {
           var rectangleAtNode = [
               {
                   "x": node.position.x - map.getTileSize() / 2,
                   "z": node.position.y - map.getTileSize() / 2
               },               {
                   "x": node.position.x + map.getTileSize() / 2,
                   "z": node.position.z - map.getTileSize() / 2
               },               {
                   "x": node.position.x + map.getTileSize() / 2,
                   "z": node.position.z + map.getTileSize() / 2
               },               {
                   "x": node.position.x - map.getTileSize() / 2,
                   "z": node.position.z + map.getTileSize() / 2
               }
           ];

           var vehiclesCollidingWithRectangle = vehicles.filter(function(vehicle) {
               return math.polygonCollision(
                   math.oppositePointsY(math.swapPointsZAndY(vehicle.getCollisionMaskInWorld())),
                   math.oppositePointsY(math.swapPointsZAndY(rectangleAtNode)));
           });

            if (vehiclesCollidingWithRectangle.length == 0) {
                var car = new TRAFFICSIM_APP.game.Vehicle(
                    worldController,
                    worldController.getGameplayScene().getApplication().getModelContainer().getModelByName("car").clone(),
                    TRAFFICSIM_APP.game.VehicleType.CAR);
                car.setNode(node);
                var position = node.position.copy();
                position.y = 0.1;
                car.setPosition(position);
                vehicles.push(car);
                return true;
            }

            return false;
        });
    }
};
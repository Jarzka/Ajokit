(function() {
    TRAFFICSIM_APP.game = TRAFFICSIM_APP.game || {};
    TRAFFICSIM_APP.game.vehicle_controller = TRAFFICSIM_APP.game.vehicle_controller || {};

    var NS = TRAFFICSIM_APP.game.vehicle_controller;

    NS.VehicleController = function (worldController) {
        var self = this;

        var worldController = worldController;
        var vehicles = [];
        var math = TRAFFICSIM_APP.utils.math;

        this.getWorldController = function () {
            return this._worldController;
        };

        function initializeRandomCars(numberOfCars) {
            for (var i = 0; i < numberOfCars; i++) {
                var car = new TRAFFICSIM_APP.game.vehicle.Vehicle(
                    worldController,
                    worldController.getGameplayScene().getApplication().getModelContainer().getModelByName("car").clone(),
                    TRAFFICSIM_APP.game.vehicle.VehicleType.CAR);
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

        this.insertCarAtRandomFreePosition = function(routeNodes, map) {
            routeNodes.some(function(node) {
                /* Create an invisible rectangle, a little bit bigger than the size of the vehicle collision mask.
                 * Use this rectangle to check if a car can be created at certain position. */
                var rectangleAtNode = [
                    {
                        "x": node.position.x - 2.2,
                        "z": node.position.y - 2.2
                    },               {
                        "x": node.position.x + 2.2,
                        "z": node.position.z - 2.2
                    },               {
                        "x": node.position.x + 2.2,
                        "z": node.position.z + 2.2
                    },               {
                        "x": node.position.x - 2.2,
                        "z": node.position.z + 2.2
                    }
                ];

                var vehiclesCollidingWithRectangle = vehicles.filter(function(vehicle) {
                    return math.polygonCollision(
                        math.oppositeVector3Y(math.swapVector3ZAndY(vehicle.getCollisionMaskInWorld())),
                        math.oppositeVector3Y(math.swapVector3ZAndY(rectangleAtNode)));
                });

                if (vehiclesCollidingWithRectangle.length == 0) {
                    var car = new TRAFFICSIM_APP.game.vehicle.Vehicle(
                        worldController,
                        worldController.getGameplayScene().getApplication().getModelContainer().getModelByName("car").clone(),
                        TRAFFICSIM_APP.game.vehicle.VehicleType.CAR);
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
})();
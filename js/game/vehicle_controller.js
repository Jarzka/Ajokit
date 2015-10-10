(function() {
    TRAFFICSIM_APP.game = TRAFFICSIM_APP.game || {};
    TRAFFICSIM_APP.game.vehicle_controller = TRAFFICSIM_APP.game.vehicle_controller || {};

    var NS = TRAFFICSIM_APP.game.vehicle_controller;
    var math = TRAFFICSIM_APP.utils.math;

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
                var personality = TRAFFICSIM_APP.game.vehicle.DriverPersonality.NEUTRAL;
                var random = math.randomValue(0, 100);
                if (random >= 90) {
                    personality = TRAFFICSIM_APP.game.vehicle.DriverPersonality.GRANNY
                } else if (random <= 20) {
                    personality = TRAFFICSIM_APP.game.vehicle.DriverPersonality.CRAZY;
                }

                var car = new TRAFFICSIM_APP.game.vehicle.Vehicle(
                    worldController,
                    TRAFFICSIM_APP.game.vehicle.VehicleType.CAR,
                    personality);
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

        this.removeRandomCar = function(driverPersonality) {
            var matchedVehicles = vehicles.filter(function(vehicle) {
                return vehicle.getPersonality() === driverPersonality;
            });

            if (matchedVehicles.length > 0) {
                var randomIndex = math.randomValue(0, matchedVehicles.length - 1);
                var randomVehicle = matchedVehicles[randomIndex];
                randomVehicle.die();
            }
        };

        this.insertCarAtRandomFreePosition = function(driverPersonality, routeNodes, map) {
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
                        TRAFFICSIM_APP.game.vehicle.VehicleType.CAR,
                        driverPersonality);
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
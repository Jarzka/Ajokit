(function () {
    TRAFFICSIM_APP.game = TRAFFICSIM_APP.game || {};

    var logger = TRAFFICSIM_APP.utils.logger;
    var math = TRAFFICSIM_APP.utils.math;
    var Vector3 = TRAFFICSIM_APP.utils.Vector3;

    TRAFFICSIM_APP.game.VehicleType = {
        "CAR": 1
    };

    TRAFFICSIM_APP.game.Vehicle = function (worldController, model, vehicleType) {
        var self = this;

        this._vehicleType = vehicleType;
        this._currentNode = null;
        this._currentRoute = null;
        this._nextRoute = null;
        this._currentRouteTargetNode = null;
        this._speed = 0;
        this._acceleratorPedal = 0; // Between 0 and 1
        this._maxSpeed = math.randomValue(4, 8);
        this._acceleration = math.randomValue(2, 8);
        this._deceleration = this._acceleration;

        TRAFFICSIM_APP.game.GameplayObject.call(self, worldController, model);

        this._setCollisionMask();
    };

    TRAFFICSIM_APP.game.Vehicle.prototype = Object.create(TRAFFICSIM_APP.game.GameplayObject.prototype);

    TRAFFICSIM_APP.game.Vehicle.prototype._setCollisionMask = function () {
        var self = this;
        switch (self._vehicleType) {
            case TRAFFICSIM_APP.game.VehicleType.CAR:
                var collisionMask = [
                    {
                        "x": -1,
                        "z": -1
                    },
                    {
                        "x": 1,
                        "z": -1
                    },
                    {
                        "x": 1,
                        "z": 1
                    },
                    {
                        "x": -1,
                        "z": 1
                    }
                ];
                self._collisionMask = collisionMask;
                self._collisionMaskTemplate = collisionMask;
                break;
        }
    };

    TRAFFICSIM_APP.game.Vehicle.prototype.getVehicleType = function () {
        return this._vehicleType;
    };

    TRAFFICSIM_APP.game.Vehicle.prototype.setNode = function (node) {
        this._currentNode = node;
    };

    TRAFFICSIM_APP.game.Vehicle.prototype.updateCollisionMask = function () {

    };

    TRAFFICSIM_APP.game.Vehicle.prototype.onCollision = function () {
        var self = this;
        var otherVehicles = self._worldController.getVehicleController().getVehicles().filter(function(vehicle) {
            return vehicle != self;
        });

        return otherVehicles.some(function (vehicle) {
            var pointTowards = new Vector3(self._position.x + Math.cos(self._angle) * 3.3,
                self._position.y,
                self._position.z - Math.sin(self._angle) * 3.3);
            return pointTowards.x >= vehicle.getPosition().x + vehicle.getCollisionMask()[0].x
                && pointTowards.x <= vehicle.getPosition().x + vehicle.getCollisionMask()[1].x
                && pointTowards.x <= vehicle.getPosition().x + vehicle.getCollisionMask()[2].x
                && pointTowards.x >= vehicle.getPosition().x + vehicle.getCollisionMask()[3].x
                && pointTowards.z >= vehicle.getPosition().z + vehicle.getCollisionMask()[0].z
                && pointTowards.z >= vehicle.getPosition().z + vehicle.getCollisionMask()[1].z
                && pointTowards.z <= vehicle.getPosition().z + vehicle.getCollisionMask()[2].z
                && pointTowards.z <= vehicle.getPosition().z + vehicle.getCollisionMask()[3].z;
        });
    };

    TRAFFICSIM_APP.game.Vehicle.prototype.getCollisionMask = function() {
        return this._collisionMask;
    };

    TRAFFICSIM_APP.game.Vehicle.prototype.update = function (deltaTime) {
        var self = this;

        handleRouteFinding();
        handleLogicalMotion(); // How the driver controls the car
        handlePhysicalMotion(); // How the car's physical position is changed according to the current speed etc.
        handleTargetReached();

        function handleLogicalMotion() {

            self._acceleratorPedal = 1; // Full acceleration by default, the following functions may modify this.
            handleCollisionPrediction();
            stopAtNextPointIfNeeded();
            handleSteeringWheel();

            function handleCollisionPrediction() {
                // Release acceleration pedal if about to crash to another car
                // TODO
            }

            function stopAtNextPointIfNeeded() {
                /* Sometimes we want to release the accelerator pedal at a specific point so that the car
                 * stops on the next target node. */
                if (!self._nextRoute.isFree()) {
                    if (self._currentNode == self._nextRoute.startNode) {
                        self._acceleratorPedal = 0;
                    }

                    // Moving towards next route. How much time does it take for the car to stop
                    var timeToStopInSeconds = self._speed / self._deceleration;

                    // Calculate distance between current point and the next point
                    var distanceBetweenCurrentPointAndTargetPoint = math.distance(
                        self._position.x,
                        self._position.z,
                        0,
                        self._nextRoute.startNode.position.x,
                        self._nextRoute.startNode.position.z,
                        0);

                    if (distanceBetweenCurrentPointAndTargetPoint <= self._speed * timeToStopInSeconds) {
                        self._acceleratorPedal = 0;
                    }
                }
            }

            function handleSteeringWheel() {
                // Currently there is no "real" steering wheel, we just hardly rotate the car to the next target point.
                if (self._currentRouteTargetNode) {
                    var angleBetweenCurrentAndTargetPoint = math.angleBetweenPointsWhenYIncreasesDown(
                        self._position.x,
                        self._position.z,
                        self._currentRouteTargetNode.position.x,
                        self._currentRouteTargetNode.position.z);
                    self.setAngle(angleBetweenCurrentAndTargetPoint);
                }
            }

        }

        function handlePhysicalMotion() {
            handleAcceleration();
            handleDeceleration();
            handleSpeed();

            function handleAcceleration() {
                if (self._acceleratorPedal > 0) {
                    self._speed += self._acceleration * deltaTime;

                    if (self._speed > self._maxSpeed) {
                        self._speed = self._maxSpeed;
                    }
                }
            }

            function handleDeceleration() {
                if (self._acceleratorPedal == 0) {
                    self._speed -= self._deceleration * deltaTime;

                    if (self._speed < 0) {
                        self._speed = 0;
                    }
                }
            }

            function handleSpeed() {
                // Store current position and angle
                var oldPosition = new Vector3(self._position.x, self._position.y, self._position.z);
                var oldAngle = self._angle;

                // Move towards next target point
                self.setPosition(new Vector3(self._position.x + Math.cos(self._angle) * self._speed * deltaTime,
                    self._position.y,
                    self._position.z - Math.sin(self._angle) * self._speed * deltaTime));

                // Rollback if on collision
                if (self.onCollision()) {
                    self.setPosition(oldPosition);
                    self.setAngle(oldAngle);
                }
            }
        }

        function handleTargetReached() {
            if (isDestinationReached()) {
                self._currentNode = self._currentRouteTargetNode;
                self._currentRoute = null;
                self._currentRouteTargetNode = null;
            }

            function isDestinationReached() {
                if (self._currentRouteTargetNode) {
                    return math.distance(
                            self._position.x,
                            self._position.y,
                            self._position.z,
                            self._currentRouteTargetNode.position.x,
                            self._currentRouteTargetNode.position.y,
                            self._currentRouteTargetNode.position.z) <= 0.2;
                }

                return false;
            }
        }

        function handleRouteFinding() {
            if (!self._nextRoute) {
                self._nextRoute = findNextRoute();
            }

            if (self._currentNode && self._nextRoute.isFree()) {
                takeNextRoute();
            }
        }

        function takeNextRoute() {
            self._currentRoute = self._nextRoute;
            self._currentRouteTargetNode = self._nextRoute.endNode;
            self._currentNode = null;
            self._nextRoute = findNextRoute();
        }

        function findNextRoute() {
            // Randomly pick one of the routes connected to the current node (but not the one that we just drove).
            var startingConnections = null;
            if (self._currentNode) {
                startingConnections = self._currentNode.getConnectedStartingRoutes();
            } else if (self._currentRoute) {
                startingConnections = self._currentRoute.endNode.getConnectedStartingRoutes();
            }

            if (startingConnections.length > 0) {
                return startingConnections[TRAFFICSIM_APP.utils.math.randomValue(0, startingConnections.length - 1)];
            }

            return null;
        }

    };
})();
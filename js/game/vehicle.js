(function () {
    TRAFFICSIM_APP.game = TRAFFICSIM_APP.game || {};
    TRAFFICSIM_APP.game.vehicle = TRAFFICSIM_APP.game.vehicle || {};

    var NS = TRAFFICSIM_APP.game.vehicle;
    var logger = TRAFFICSIM_APP.utils.logger;
    var math = TRAFFICSIM_APP.utils.math;
    var Vector3 = TRAFFICSIM_APP.utils.Vector3;

    NS.VehicleType = {
        "CAR": 1
    };

    NS.Vehicle = function (worldController, model, vehicleType) {
        TRAFFICSIM_APP.game.gameplay_object.GameplayObject.call(this, worldController, model);

        this._vehicleType = vehicleType;
        this._currentNode = null;
        this._currentRoute = null;
        this._nextRoute = null;

        this._speed = 0;
        this._targetSpeed = null;
        this._acceleratorPedal = 0; // Between 0 and 1
        this._brakePedal = 0; // Between 0 and 1
        this._maxSpeed = math.randomValue(4, 9);
        this._acceleration = math.randomValue(2, 8);
        this._deceleration = this._acceleration;
        this._brakeDeceleration = this._acceleration / 2;

        this._setCollisionMask();
    };

    NS.Vehicle.prototype = Object.create(TRAFFICSIM_APP.game.gameplay_object.GameplayObject.prototype);

    NS.Vehicle.prototype._setCollisionMask = function () {
        var self = this;
        switch (self._vehicleType) {
            case NS.VehicleType.CAR:
                var collisionMask = [
                    {
                        "x": -2,
                        "z": -1
                    },
                    {
                        "x": 2,
                        "z": -1
                    },
                    {
                        "x": 2,
                        "z": 1
                    },
                    {
                        "x": -2,
                        "z": 1
                    }
                ];
                self._collisionMask = collisionMask;
                self._collisionMaskTemplate = collisionMask;
                break;
        }
    };

    NS.Vehicle.prototype.setNode = function (node) {
        this._currentNode = node;
    };

    NS.Vehicle.prototype.updateCollisionMask = function () {
        var rotatedCollisionMask = math.rotateCollisionMaskWhenYIncreasesDown(math.swapPointsZAndY(this._collisionMaskTemplate), this._angle);
        this._collisionMask = math.swapPointsZAndY(rotatedCollisionMask);
    };

    NS.Vehicle.prototype.onCollision = function () {
        var self = this;
        var otherVehicles = self._worldController.getVehicleController().getVehicles().filter(function(vehicle) {
            return vehicle != self;
        });

        return otherVehicles.some(function (vehicle) {
            return math.polygonCollision(math.oppositePointsY(math.swapPointsZAndY(self.getCollisionMaskInWorld())),
                math.oppositePointsY(math.swapPointsZAndY(vehicle.getCollisionMaskInWorld())));
        });
    };

    NS.Vehicle.prototype.getCollisionMaskInWorld = function() {
        var self = this;
        var collisionMaskInWorld = [];

        this._collisionMask.forEach(function(point) {
            collisionMaskInWorld.push(
                {
                    "x": self._position.x + point.x,
                    "z": self._position.z + point.z
                }
            );
        });

        return collisionMaskInWorld;
    };

    NS.Vehicle.prototype.getCollisionPredictionPoint = function () {
        if (this._currentRoute) {
            return this._currentRoute.getNextPointAtDistanceOrContinue(this._position, 5, this._nextRoute);
        }

        return null;
    };

    NS.Vehicle.prototype.getSpeed = function () {
        return this._speed;
    };

    NS.Vehicle.prototype.getCollisionPredictionPolygon = function () {
        var pointForward = this.getCollisionPredictionPoint();

        if (pointForward) {
            return [
                {
                    "x": pointForward.x - 0.5,
                    "z": pointForward.z - 0.5
                },
                {
                    "x": pointForward.x + 0.5,
                    "z": pointForward.z - 0.5
                },
                {
                    "x": pointForward.x + 0.5,
                    "z": pointForward.z + 0.5
                },
                {
                    "x": pointForward.x - 0.5,
                    "z": pointForward.z + 0.5
                }
            ];
        }

        return null;
    };

    NS.Vehicle.prototype.die = function() {
        NS.gameplay_object.GameplayObject.prototype.die.call(this);

        var vehicles = this._worldController.getVehicleController().getVehicles();

        var index = vehicles.indexOf(this);
        if (index > -1) {
            vehicles.splice(index, 1);
        }
    };

    NS.Vehicle.prototype.update = function (deltaTime) {
        var self = this;

        handleRouteFinding();
        handleLogicalMotion(); // How the driver controls the car
        handlePhysicalMotion(); // How the car's physical position is changed according to the current speed etc.
        handleTargetReached();

        function handleLogicalMotion() {

            self._acceleratorPedal = 1; // Full acceleration by default, the following functions may modify this.
            self._brakePedal = 0;
            handleCollisionPrediction();
            handleTargetSpeed();
            stopAtTrafficLights();
            handleSteeringWheel();

            function handleCollisionPrediction() {
                // Release acceleration pedal if about to crash to another car
                /* To check if this vehicle is about to crash with another car we traverse the current path forward
                 * a certain amount and check if there is a vehicle in that position. */
                var collisionPredictionPolygon = self.getCollisionPredictionPolygon();

                if (collisionPredictionPolygon) {
                    var otherVehicles = self._worldController.getVehicleController().getVehicles().filter(function(vehicle) {
                        return vehicle != self;
                    });

                    var collisionTarget = null;
                    var isFutureCollisionPossible = otherVehicles.some(function (vehicle) {
                        var collision = math.polygonCollision(math.oppositePointsY(math.swapPointsZAndY(collisionPredictionPolygon)),
                            math.oppositePointsY(math.swapPointsZAndY(vehicle.getCollisionMaskInWorld())));

                        if (collision == true) {
                            collisionTarget = vehicle;
                        }

                        return collision;
                    });

                    if (isFutureCollisionPossible) {
                        var distanceBetweenCurrentPointAndPredictedCollisionPoint = math.distance(
                            self._position.x,
                            0,
                            self._position.z,
                            collisionTarget.getPosition().x,
                            0,
                            collisionTarget.getPosition().z
                        );

                        if (distanceBetweenCurrentPointAndPredictedCollisionPoint > 7) {
                            self._targetSpeed = collisionTarget.getSpeed();
                        }

                        if (distanceBetweenCurrentPointAndPredictedCollisionPoint <= 7) {
                            self._acceleratorPedal = 0;
                            self._targetSpeed = null;
                        }

                        if (distanceBetweenCurrentPointAndPredictedCollisionPoint <= 5) {
                            self._brakePedal = 1;
                            self._targetSpeed = null;
                        }
                    } else {
                        self._targetSpeed = null;
                    }
                }
            }

            function handleTargetSpeed() {
                if (self._targetSpeed) {
                    if (self._targetSpeed > self._speed) {
                        self._acceleratorPedal = 1;
                    }

                    if (self._targetSpeed < self._speed) {
                        self._acceleratorPedal = 0;
                    }
                }
            }

            function stopAtTrafficLights() {
                if (!self._nextRoute.isFree()) {
                    var distanceBetweenCurrentPointAndTargetPoint = math.distance(
                        self._position.x,
                        self._position.z,
                        0,
                        self._nextRoute.startNode.position.x,
                        self._nextRoute.startNode.position.z,
                        0);

                    if (distanceBetweenCurrentPointAndTargetPoint < 5
                        && distanceBetweenCurrentPointAndTargetPoint > 3) {
                        self._acceleratorPedal = 0;
                    }

                    if (distanceBetweenCurrentPointAndTargetPoint <= 3
                        && distanceBetweenCurrentPointAndTargetPoint >= 2) {
                        self._brakePedal = 1;
                    }

                    // Distance less than 4? Give up and continue driving. Not time to stop.
                }
            }

            function handleSteeringWheel() {
                // Currently there is no "real" steering wheel, we just hardly rotate the car to the next target point.
                if (self._currentRoute) {
                    var nextPoint = self._currentRoute.getNextPoint(self._position);
                    var angleBetweenCurrentAndTargetPoint = math.angleBetweenPointsWhenYIncreasesDown(
                        self._position.x,
                        self._position.z,
                        nextPoint.x,
                        nextPoint.z);
                    self.setAngle(angleBetweenCurrentAndTargetPoint);
                }
            }

        }

        function handlePhysicalMotion() {
            handleAcceleration();
            handleDeceleration();
            handleBrake();
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

            function handleBrake() {
                if (self._brakePedal > 0) {
                    self._speed -= self._brakeDeceleration * self._brakePedal;
                }

                if (self._speed < 0) {
                    self._speed = 0;
                }
            }

            function handleSpeed() {
                // Store current position and angle
                var oldPosition = new Vector3(self._position.x, self._position.y, self._position.z);
                var oldAngle = self._angle;

                // Move towards next target point
                self.setPosition(new Vector3(
                    self._position.x + Math.cos(self._angle) * self._speed * deltaTime,
                    self._position.y,
                    self._position.z - Math.sin(self._angle) * self._speed * deltaTime));

                // Rollback if on collision
                if (self.onCollision()) {
                    self.setPosition(oldPosition);
                    self.setAngle(oldAngle);
                    self._speed = 0;
                }
            }
        }

        function handleTargetReached() {
            if (isDestinationReached()) {
                self._currentNode = self._currentRoute.getTargetNode();
                self._currentRoute = null;
                self._currentRouteTargetNode = null;
            }

            function isDestinationReached() {
                if (self._currentRoute && self._currentRoute.getTargetNode()) {
                    return math.distance(
                            self._position.x,
                            self._position.y,
                            self._position.z,
                            self._currentRoute.getTargetNode().position.x,
                            self._currentRoute.getTargetNode().position.y,
                            self._currentRoute.getTargetNode().position.z) <= 0.2;
                }

                return false;
            }
        }

        function handleRouteFinding() {
            if (!self._nextRoute) {
                self._nextRoute = findNextRoute();
            }

            if (self._currentNode) {
                takeNextRoute();
            }
        }

        function takeNextRoute() {
            self._currentRoute = self._nextRoute;
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

            logger.log(logger.LogType.WARNING, "Vehicle is unable to find next route!");
            return null;
        }

        this.notifyRouteRemoved = function(route) {
            if (this._currentRoute == route) {
                this.die();
            }

            if (this._nextRoute == route) {
                this._nextRoute = null;
            }
        };
    };
})();
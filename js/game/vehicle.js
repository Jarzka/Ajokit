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
        this._currentRouteTargetNode = null;
        this._speed = 0;
        this._acceleratorPedal = 0; // Between 0 and 1
        this._maxSpeed = math.randomValue(4, 7);
        this._acceleration = math.randomValue(2, 7);
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

            handleAccelerationPedal();
            handleReleaseAccelerationPenalToStopAtNextPoint();
            handleSteeringWheel();

            function handleAccelerationPedal() {
                /* Turn accelerator pedal at full speed by default if the following functions
                 * do not change it */
                self._acceleratorPedal = 1;
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

            function handleReleaseAccelerationPenalToStopAtNextPoint() {
                /* Sometimes we want to release the accelerator pedal at a specific point so that the car
                 * stops on the next target node. */

                // Stop if the vehicle arrives at traffic lights at next node.


                // TODO Choose the next target route to continue from the traffic lights and stop only if it is not free.
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
            if (self._currentNode) { // Try to find the next target node
                // Randomly pick one of the routes connected to the current node (but not the one that we just drove).
                var freeStartingConnections = self._currentNode.getConnectedFreeStartingRoutes();

                if (freeStartingConnections.length > 0) {
                    self._currentNode = null;

                    var nextRoute = freeStartingConnections[TRAFFICSIM_APP.utils.math.randomValue(0, freeStartingConnections.length - 1)];
                    self._currentRoute = nextRoute;
                    self._currentRouteTargetNode = nextRoute.endNode;
                }
            }
        }

    };
})();
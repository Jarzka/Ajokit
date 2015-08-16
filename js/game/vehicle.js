(function () {
    TRAFFICSIM_APP.game = TRAFFICSIM_APP.game || {};

    var logger = TRAFFICSIM_APP.utils.logger;
    var math = TRAFFICSIM_APP.utils.math;

    TRAFFICSIM_APP.game.VehicleType = {
        "CAR": 1
    };

    TRAFFICSIM_APP.game.Vehicle = function (worldController, model, vehicleType) {
        var self = this;

        this._vehicleType = vehicleType;
        this._currentNode = null;
        this._collisionFn = function() { return false; };
        this._currentRouteTargetNode = null;
        this._speed = math.randomValue(3, 10);

        TRAFFICSIM_APP.game.GameplayObject.call(self, worldController, model);

        this._setCollisionMask();
    };

    TRAFFICSIM_APP.game.Vehicle.prototype = Object.create(TRAFFICSIM_APP.game.GameplayObject.prototype);

    TRAFFICSIM_APP.game.Vehicle.prototype.onCollisionWith = function (position) {
        return this._collisionFn(position);
    };

    TRAFFICSIM_APP.game.Vehicle.prototype._setCollisionMask = function () {
        var self = this;
        switch (self._vehicleType) {
            case TRAFFICSIM_APP.game.VehicleType.CAR:
                self._collisionFn = function (position) {
                    // Approximation, close enough for the purposes of this app.
                    return position.x >= self._position.x - 1
                        && position.x <= self._position.x + 1
                        && position.y >= self._position.y - 1
                        && position.y <= self._position.y + 1
                        && position.z >= self._position.z - 1
                        && position.z <= self._position.z + 1;
                };
                break;
        }
    };

    TRAFFICSIM_APP.game.Vehicle.prototype.getVehicleType = function () {
        return this._vehicleType;
    };

    TRAFFICSIM_APP.game.Vehicle.prototype.setNode = function (node) {
        this._currentNode = node;
        this.setPosition(
            {
                "x": node.position.x,
                "y": 0.1,
                "z": node.position.z
            });
    };

    TRAFFICSIM_APP.game.Vehicle.prototype.onCollision = function () {
        var self = this;
        var otherVehicles = self._worldController.getVehicleController().getVehicles().filter(function(vehicle) {
            return vehicle != self;
        });

        return otherVehicles.some(function (vehicle) {
            return vehicle.onCollisionWith(self.getPosition());
        });
    };

    TRAFFICSIM_APP.game.Vehicle.prototype.update = function (deltaTime) {
        var self = this;

        if (this._currentNode) {
            findNextRoute();
        } else {
            moveTowardsTargetNode();
        }

        function moveTowardsTargetNode() {
            // Store current position and angle

            var oldPosition = {
                "x": self._position.x,
                "y": self._position.y,
                "z": self._position.z
            };
            var oldAngle = self._angle;

            // Move

            var angleBetweenCurrentAndTargetPoint = math.angleBetweenPoints(
                self._position.x,
                self._position.z,
                self._currentRouteTargetNode.position.x,
                self._currentRouteTargetNode.position.z);
            var angleBetweenCurrentAndTargetPointWhenYPointsDown = math.angleBetweenPointsWhenYPointsDown(
                self._position.x,
                self._position.z,
                self._currentRouteTargetNode.position.x,
                self._currentRouteTargetNode.position.z);

            self.setPosition(
                {
                    "x": self._position.x + Math.cos(angleBetweenCurrentAndTargetPoint) * self._speed * deltaTime,
                    "y": self._position.y,
                    "z": self._position.z + Math.sin(angleBetweenCurrentAndTargetPoint) * self._speed * deltaTime
                }
            );

            self.setAngle(angleBetweenCurrentAndTargetPointWhenYPointsDown);

            // Check collision & rollback if on collision

            if (self.onCollision()) {
                self.setPosition(oldPosition);
                self.setAngle(oldAngle);
            }

            // Target reached

            if (isDestinationReached()) {
                self._currentNode = self._currentRouteTargetNode;
            }
        }

        function isDestinationReached() {
            return math.distance(
                    self._position.x,
                    self._position.y,
                    self._position.z,
                    self._currentRouteTargetNode.position.x,
                    self._currentRouteTargetNode.position.y,
                    self._currentRouteTargetNode.position.z) <= 0.2;
        }

        function findNextRoute() {
            // Randomly pick one of the routes connected to the current node (but not the one that we just drove).
            var freeStartingConnections = self._currentNode.getConnectedFreeStartingRoutes();

            if (freeStartingConnections.length > 0) {
                self._currentNode = null;

                var nextRoute = freeStartingConnections[TRAFFICSIM_APP.utils.math.randomValue(0, freeStartingConnections.length - 1)];
                self._currentRoute = nextRoute;
                self._currentRouteTargetNode = nextRoute.endNode;
            }

        }
    };
})();
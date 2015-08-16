(function() {
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
        this._currentRoute = null;
        this._currentRouteTargetNode = null;
        this._speed = math.randomValue(3, 5);

        TRAFFICSIM_APP.game.GameplayObject.call(self, worldController, model);
    };

    TRAFFICSIM_APP.game.Vehicle.prototype = Object.create(TRAFFICSIM_APP.game.GameplayObject.prototype);

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

    TRAFFICSIM_APP.game.Vehicle.prototype.update = function(deltaTime) {
        var self = this;

        if (this._currentNode) {
            findNextRoute();
        } else {
            moveTowardsTargetNode();
        }

        function moveTowardsTargetNode() {
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
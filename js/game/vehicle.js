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

        //logger.log(logger.LogType.DEBUG, "Car " + this._id + " now has a node.");
    };

    TRAFFICSIM_APP.game.Vehicle.prototype.update = function(deltaTime) {
        var self = this;

        if (this._currentNode) {
            //logger.log(logger.LogType.DEBUG, "Car " + self._id + " is finding next route...");
            findNextRoute();
        } else {
            moveTowardsTargetNode();
        }

        function moveTowardsTargetNode() {
            self.setPosition(
                {
                    "x": self._position.x + Math.cos(
                        math.angleBetweenPoints(
                            self._position.x,
                            self._position.z,
                            self._currentRouteTargetNode.position.x,
                            self._currentRouteTargetNode.position.z)) * self._speed * deltaTime,
                    "y": self._position.y,
                    "z": self._position.z + Math.sin(
                        math.angleBetweenPoints(
                            self._position.x,
                            self._position.z,
                            self._currentRouteTargetNode.position.x,
                            self._currentRouteTargetNode.position.z)) * self._speed * deltaTime
                }
            );

            if (isDestinationReached()) {
                //logger.log(logger.LogType.DEBUG, "Car " + self._id + " reached the destination node.");
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
            var startingConnections = self._currentNode.getConnectedStartingRoutes();
            //logger.log(logger.LogType.DEBUG, "Car " + self._id + ": current node has " + startingConnections.length + " connection(s)");

            var nextRoute = null;
            var nextRouteLoopIndex = 0;
            while (nextRoute == null || nextRoute == self._currentRoute) {
                nextRoute = startingConnections[TRAFFICSIM_APP.utils.math.randomValue(0, startingConnections.length - 1)];
                nextRouteLoopIndex++;

                if (nextRouteLoopIndex > 100) {
                    //logger.log(logger.LogType.WARNING, "Car " + self._id + " is unable to find the next route!");
                    return;
                }
            }

            self._currentNode = null;
            self._currentRoute = nextRoute;
            self._currentRouteTargetNode = nextRoute.endNode;
            //logger.log(logger.LogType.DEBUG, "Car " + self._id + " taking next route to target node x:" + self._currentRouteTargetNode.position.x + " z:" +  self._currentRouteTargetNode.position.z);
        }
    };
})();
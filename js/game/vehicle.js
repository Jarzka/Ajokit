(function() {
    TRAFFICSIM_APP.game = TRAFFICSIM_APP.game || {};

    var logger = TRAFFICSIM_APP.utils.logger;

    TRAFFICSIM_APP.game.VehicleType = {
        "CAR": 1
    };

    TRAFFICSIM_APP.game.Vehicle = function (worldController, model, vehicleType) {
        var self = this;

        this._vehicleType = vehicleType;
        this._currentNode = null;
        this._currentRoute = null;

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

        logger.log(logger.LogType.DEBUG, "Car " + this._id + " now has a node.");
    };

    TRAFFICSIM_APP.game.Vehicle.prototype.update = function(deltaTime) {
        var self = this;

        if (this._currentNode) {
            logger.log(logger.LogType.DEBUG, "Car " + self._id + " reached a node, finding next route...");
            takeNextRoute();
        }

        function takeNextRoute() {
            // Randomly pick one of the routes connected to the current node (but not the one that we just drove).
            var connections = self._currentNode.getConnectedRoutes();

            var nextRoute = null;
            var nextRouteLoopIndex = 0;
            while (nextRoute == null || nextRoute == self._currentNode) {
                nextRoute = connections[TRAFFICSIM_APP.utils.math.randomValue(0, connections.length - 1)];
                nextRouteLoopIndex++;

                if (nextRouteLoopIndex > 100) {
                    logger.log(logger.LogType.WARNING, "Car " + self._id + " is unable to find the next route!");
                    return;
                }
            }

            logger.log(logger.LogType.DEBUG, "Car " + self._id + " taking next route" +
                "from (x:" + nextRoute.startNode.position.x + " z:" + nextRoute.startNode.position.z + ") " +
                "to (x:" + nextRoute.endNode.position.x + " z:" + nextRoute.endNode.position.z + ")");

            self._currentNode = null;

        }
    };
})();
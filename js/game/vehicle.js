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
            logger.log(logger.LogType.DEBUG, "Car " + this._id + " reached a now, finding next route...");
            //takeNextRoute();
        }

        function takeNextRoute() {
            // Randomly pick one of the routes connected to the current node (but not the one that we just drove).
            var connections = self._currentNode.getConnectedRoutes();

            var nextRoute = null;

            while (nextRoute == null || nextRoute == self._currentNode) {
                nextRoute = TRAFFICSIM_APP.utils.math.randomValue(0, connections.length - 1);
            }

            logger.log(logger.LogType.DEBUG, "Car " + self._id + " taking next route" +
                "from (x:" + nextRoute.startNode.x + " y:" + nextRoute.startNode.y + ") " +
                "to (x:" + nextRoute.endNode.x + " y:" + end.startNode.y + ")");

            self._currentNode = null;

        }
    };
})();
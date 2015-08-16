(function() {
    TRAFFICSIM_APP.game = TRAFFICSIM_APP.game || {};

    var logger = TRAFFICSIM_APP.utils.logger;

    TRAFFICSIM_APP.game.OpenLine = {
        "TOP": 0,
        "RIGHT": 1,
        "BOTTOM": 2,
        "LEFT": 3
    };

    TRAFFICSIM_APP.game.TrafficLightsController = function (road) {
        var self = this;

        this._road = road;
        this._currentOpenLine = TRAFFICSIM_APP.game.OpenLine.TOP;
        this._lastOpenLineChangeTimestamp = 0;
    };

    TRAFFICSIM_APP.game.TrafficLightsController.prototype.update = function (deltaTime) {
        if (this._lastOpenLineChangeTimestamp + 10000 < Date.now()) {
            this.changeNextOpenLine();
            logger.log(logger.LogType.DEBUG, "Traffic lights controller switched lights.");
        }
    };

    TRAFFICSIM_APP.game.TrafficLightsController.prototype.changeNextOpenLine = function (deltaTime) {
        this._road.getRoutes().forEach(function(route) {
           route.setFree(false);
        });

        this._lastOpenLineChangeTimestamp = Date.now();

        switch (this._currentOpenLine) {
            case TRAFFICSIM_APP.game.OpenLine.TOP:
                this._currentOpenLine = TRAFFICSIM_APP.game.OpenLine.RIGHT;
                this._releaseRoutesById(["from-right-to-left", "from-right-to-top", "from-right-to-bottom"]);
                break;
            case TRAFFICSIM_APP.game.OpenLine.RIGHT:
                this._currentOpenLine = TRAFFICSIM_APP.game.OpenLine.BOTTOM;
                this._releaseRoutesById(["from-bottom-to-top", "right-bottom-to-right", "from-bottom-to-left"]);
                break;
            case TRAFFICSIM_APP.game.OpenLine.BOTTOM:
                this._currentOpenLine = TRAFFICSIM_APP.game.OpenLine.LEFT;
                this._releaseRoutesById(["from-left-to-right", "from-left-to-top", "from-left-to-bottom"]);
                break;
            case TRAFFICSIM_APP.game.OpenLine.LEFT:
                this._currentOpenLine = TRAFFICSIM_APP.game.OpenLine.TOP;
                this._releaseRoutesById(["from-top-to-bottom", "from-top-to-right", "from-top-to-left"]);
                break;
        }
    };

    TRAFFICSIM_APP.game.TrafficLightsController.prototype._releaseRoutesById = function(routeIds) {
        var foundRoutes = this._road.getRoutes().filter(function(route) {
            return routeIds.some(function(routeId) {
                return routeId == route.getRouteId();
            });
        });

        logger.log(logger.LogType.DEBUG, "Releasing " + foundRoutes.length + " routes.");

        foundRoutes.forEach(function(route) {
            route.setFree(true);
        });
    }

})();

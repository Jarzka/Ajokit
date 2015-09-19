(function () {
    TRAFFICSIM_APP.game = TRAFFICSIM_APP.game || {};

    var logger = TRAFFICSIM_APP.utils.logger;

    TRAFFICSIM_APP.game.RouteDirection = {
        "TOP": 0,
        "RIGHT": 1,
        "BOTTOM": 2,
        "LEFT": 3
    };

    TRAFFICSIM_APP.game.CurrentLightState = {
        "RED": 0,
        "YELLOW": 1,
        "GREEN": 2,
        "RED_YELLOW": 3
    };

    TRAFFICSIM_APP.game.LightStateMs = {
        "YELLOW": 3000,
        "GREEN": 5000,
        "RED_YELLOW": 1000
    };

    TRAFFICSIM_APP.game.TrafficLight = function (trafficLightController, nextTrafficLight, routeDirection, position) {
        TRAFFICSIM_APP.game.GameplayObject.call(this,
            trafficLightController.getRoad().getWorldController(),
            trafficLightController.getRoad().getWorldController().getGameplayScene().getApplication().getModelContainer().getModelByName("traffic_light").clone());

        this._trafficLightController = trafficLightController;
        this._lastStateChangeTimestamp = 0;
        this._nextTrafficLight = nextTrafficLight;
        this._isActive = false;
        this._routeDirection = routeDirection;
        this._currentLightState = TRAFFICSIM_APP.game.CurrentLightState.RED;
        this._position = position;
    };

    TRAFFICSIM_APP.game.TrafficLight.prototype = Object.create(TRAFFICSIM_APP.game.GameplayObject.prototype);

    TRAFFICSIM_APP.game.TrafficLight.prototype.update = function () {
        if (this._isActive) {
            this._updateLightState();
        }

        this._handleRouteState();
    };

    TRAFFICSIM_APP.game.TrafficLight.prototype._updateLightState = function () {
        if (this._currentLightState == TRAFFICSIM_APP.game.CurrentLightState.RED) {
            this._currentLightState = TRAFFICSIM_APP.game.CurrentLightState.RED_YELLOW;
            this._lastStateChangeTimestamp = Date.now();
        } else if (this._currentLightState == TRAFFICSIM_APP.game.CurrentLightState.RED_YELLOW
            && this._lastStateChangeTimestamp + TRAFFICSIM_APP.game.LightStateMs.RED_YELLOW < Date.now()) {
            this._currentLightState = TRAFFICSIM_APP.game.CurrentLightState.GREEN;
            this._lastStateChangeTimestamp = Date.now();
        } else if (this._currentLightState == TRAFFICSIM_APP.game.CurrentLightState.GREEN
            && this._lastStateChangeTimestamp + TRAFFICSIM_APP.game.LightStateMs.GREEN < Date.now()) {
            this._currentLightState = TRAFFICSIM_APP.game.CurrentLightState.YELLOW;
            this._lastStateChangeTimestamp = Date.now();
        } else if (this._currentLightState == TRAFFICSIM_APP.game.CurrentLightState.YELLOW
            && this._lastStateChangeTimestamp + TRAFFICSIM_APP.game.LightStateMs.YELLOW < Date.now()) {
            this._currentLightState = TRAFFICSIM_APP.game.CurrentLightState.RED;
            this._lastStateChangeTimestamp = Date.now();
            this._isActive = false;
            this._nextTrafficLight.setActive(true);
        }
    };

    TRAFFICSIM_APP.game.TrafficLight.prototype._handleRouteState = function () {
        if (this._currentLightState == TRAFFICSIM_APP.game.CurrentLightState.GREEN) {
            this._changeRouteFreeStateById(this._getRouteIdsByCurrentDirection(), true);
        } else {
            this._changeRouteFreeStateById(this._getRouteIdsByCurrentDirection(), false);
        }
    };

    TRAFFICSIM_APP.game.TrafficLight.prototype._getRouteIdsByCurrentDirection = function () {
        switch (this._routeDirection) {
            case TRAFFICSIM_APP.game.RouteDirection.TOP:
                return ["from-right-to-left", "from-right-to-top", "from-right-to-bottom"];
            case TRAFFICSIM_APP.game.RouteDirection.RIGHT:
                return ["from-bottom-to-top", "from-bottom-to-right", "from-bottom-to-left"];
            case TRAFFICSIM_APP.game.RouteDirection.BOTTOM:
                return ["from-left-to-right", "from-left-to-top", "from-left-to-bottom"];
            case TRAFFICSIM_APP.game.RouteDirection.LEFT:
                return ["from-top-to-bottom", "from-top-to-right", "from-top-to-left"];
        }
    };

    TRAFFICSIM_APP.game.TrafficLight.prototype._changeRouteFreeStateById = function (routeIds, newState) {
        var foundRoutes = this._trafficLightController.getRoad().getRoutes().filter(function (route) {
            return routeIds.some(function (routeId) {
                return routeId == route.getRouteId();
            });
        });

        foundRoutes.forEach(function (route) {
            route.setFree(newState);
        });
    };

    TRAFFICSIM_APP.game.TrafficLight.prototype.setNextTrafficLight = function (nextTrafficLight) {
        this._nextTrafficLight = nextTrafficLight;
    };

    TRAFFICSIM_APP.game.TrafficLight.prototype.setActive = function (boolean) {
        this._isActive = boolean;
    };

})();

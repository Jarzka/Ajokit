(function () {
    TRAFFICSIM_APP.game = TRAFFICSIM_APP.game || {};
    TRAFFICSIM_APP.game.traffic_light = TRAFFICSIM_APP.game.traffic_light|| {};

    var NS = TRAFFICSIM_APP.game.traffic_light;
    var logger = TRAFFICSIM_APP.utils.logger;
    var math = TRAFFICSIM_APP.utils.math;
    var LightBall = TRAFFICSIM_APP.game.traffic_light_ball.TrafficLightBall;
    var Vector3 = TRAFFICSIM_APP.utils.vector3.Vector3;

    NS.TrafficLightPosition = {
        "TOP": 0,
        "RIGHT": 1,
        "BOTTOM": 2,
        "LEFT": 3
    };

    NS.CurrentLightState = {
        "RED": 0,
        "YELLOW": 1,
        "GREEN": 2,
        "RED_YELLOW": 3
    };

    NS.LightStateMs = {
        "YELLOW": 3000,
        "GREEN": 5000,
        "RED_YELLOW": 1000
    };

    NS.TrafficLight = function (trafficLightController, nextTrafficLight, routeDirection, position) {
        TRAFFICSIM_APP.game.gameplay_object.GameplayObject.call(this,
            trafficLightController.getRoad().getWorldController(),
            trafficLightController.getRoad().getWorldController().getGameplayScene().getApplication().getModelContainer().getModelByName("traffic_light").clone());

        this._trafficLightController = trafficLightController;
        this._lastStateChangeTimestamp = 0;
        this._nextTrafficLight = nextTrafficLight;
        this._isActive = false;
        this._routeDirection = routeDirection;
        this._currentLightState = NS.CurrentLightState.RED;

        this.setPosition(position);
        switch (this._routeDirection) {
            case NS.TrafficLightPosition.TOP:
                this.setAngle(math.radians(90));
                break;
            case NS.TrafficLightPosition.RIGHT:
                this.setAngle(math.radians(0));
                break;
            case NS.TrafficLightPosition.BOTTOM:
                this.setAngle(math.radians(270));
                break;
            case NS.TrafficLightPosition.LEFT:
                this.setAngle(math.radians(180));
                break;
        }

        var lightGreenPosition = new Vector3(
            this._position.x + Math.cos(this._angle) * 0.2,
            this._position.y + 2.9,
            this._position.z - Math.sin(this._angle) * 0.2);
        var lightYellowPosition = new Vector3(
            this._position.x + Math.cos(this._angle) * 0.2,
            this._position.y + 3.4,
            this._position.z - Math.sin(this._angle) * 0.2);
        var lightRedPosition = new Vector3(
            this._position.x + Math.cos(this._angle) * 0.2,
            this._position.y + 3.9,
            this._position.z - Math.sin(this._angle) * 0.2);
        this._lightGreen = new LightBall(this, 0x006000, this._worldController, lightGreenPosition);
        this._lightYellow = new LightBall(this, 0x606000, this._worldController, lightYellowPosition);
        this._lightRed = new LightBall(this, 0x600000, this._worldController, lightRedPosition);
    };

    NS.TrafficLight.prototype = Object.create(TRAFFICSIM_APP.game.gameplay_object.GameplayObject.prototype);

    NS.TrafficLight.prototype.update = function () {
        if (this._isActive) {
            this._updateState();
        }

        this._updateLightBallsState();
        this._handleRouteState();
    };

    NS.TrafficLight.prototype._updateState = function () {
        if (this._currentLightState == NS.CurrentLightState.RED) {
            this._currentLightState = NS.CurrentLightState.RED_YELLOW;
            this._lastStateChangeTimestamp = Date.now();
        } else if (this._currentLightState == NS.CurrentLightState.RED_YELLOW
            && this._lastStateChangeTimestamp + NS.LightStateMs.RED_YELLOW < Date.now()) {
            this._currentLightState = NS.CurrentLightState.GREEN;
            this._lastStateChangeTimestamp = Date.now();
        } else if (this._currentLightState == NS.CurrentLightState.GREEN
            && this._lastStateChangeTimestamp + NS.LightStateMs.GREEN < Date.now()) {
            this._currentLightState = NS.CurrentLightState.YELLOW;
            this._lastStateChangeTimestamp = Date.now();
        } else if (this._currentLightState == NS.CurrentLightState.YELLOW
            && this._lastStateChangeTimestamp + NS.LightStateMs.YELLOW < Date.now()) {
            this._currentLightState = NS.CurrentLightState.RED;
            this._lastStateChangeTimestamp = Date.now();
            this._isActive = false;
            this._nextTrafficLight.setActive(true);
        }
    };

    NS.TrafficLight.prototype._updateLightBallsState = function () {
        if (this._currentLightState == NS.CurrentLightState.RED) {
            this._lightRed.changeColor(0xff0000);
            this._lightGreen.changeColor(0x006000);
            this._lightYellow.changeColor(0x606000);
        } else if (this._currentLightState == NS.CurrentLightState.RED_YELLOW) {
            this._lightRed.changeColor(0xff0000);
            this._lightGreen.changeColor(0x006000);
            this._lightYellow.changeColor(0xffff00);
        } else if (this._currentLightState == NS.CurrentLightState.GREEN) {
            this._lightRed.changeColor(0x600000);
            this._lightGreen.changeColor(0x00ff00);
            this._lightYellow.changeColor(0x606000);
        } else if (this._currentLightState == NS.CurrentLightState.YELLOW) {
            this._lightRed.changeColor(0x600000);
            this._lightGreen.changeColor(0x006000);
            this._lightYellow.changeColor(0xffff00);
        }
    };

    NS.TrafficLight.prototype._handleRouteState = function () {
        if (this._currentLightState == NS.CurrentLightState.GREEN) {
            this._changeRouteFreeStateById(this._getRouteIdsByCurrentDirection(), true);
        } else {
            this._changeRouteFreeStateById(this._getRouteIdsByCurrentDirection(), false);
        }
    };

    NS.TrafficLight.prototype._getRouteIdsByCurrentDirection = function () {
        switch (this._routeDirection) {
            case NS.TrafficLightPosition.TOP:
                return ["from-top-to-bottom", "from-top-to-right", "from-top-to-left"];
            case NS.TrafficLightPosition.RIGHT:
                return ["from-right-to-left", "from-right-to-top", "from-right-to-bottom"];
            case NS.TrafficLightPosition.BOTTOM:
                return ["from-bottom-to-top", "from-bottom-to-right", "from-bottom-to-left"];
            case NS.TrafficLightPosition.LEFT:
                return ["from-left-to-right", "from-left-to-top", "from-left-to-bottom"];
        }
    };

    NS.TrafficLight.prototype._changeRouteFreeStateById = function (routeIds, newState) {
        var foundRoutes = this._trafficLightController.getRoad().getRoutes().filter(function (route) {
            return routeIds.some(function (routeId) {
                return routeId == route.getRouteId();
            });
        });

        foundRoutes.forEach(function (route) {
            route.setFree(newState);
        });
    };

    NS.TrafficLight.prototype.setNextTrafficLight = function (nextTrafficLight) {
        this._nextTrafficLight = nextTrafficLight;
    };

    NS.TrafficLight.prototype.setActive = function (boolean) {
        this._isActive = boolean;
    };

    NS.TrafficLight.prototype.die = function () {
        NS.gameplay_object.GameplayObject.prototype.die.call(this);

        this._lightGreen.die();
        this._lightRed.die();
        this._lightYellow.die();
    };

})();

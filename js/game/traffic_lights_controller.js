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
            logger.log(logger.LogType.DEBUG, "TrafficLightsController new open line: " + this._currentOpenLine);
        }
    };

    TRAFFICSIM_APP.game.TrafficLightsController.prototype.changeNextOpenLine = function (deltaTime) {
        this._lastOpenLineChangeTimestamp = Date.now();

        switch (this._currentOpenLine) {
            case TRAFFICSIM_APP.game.OpenLine.TOP:
                this._currentOpenLine = TRAFFICSIM_APP.game.OpenLine.RIGHT;
                break;
            case TRAFFICSIM_APP.game.OpenLine.RIGHT:
                this._currentOpenLine = TRAFFICSIM_APP.game.OpenLine.BOTTOM;
                break;
            case TRAFFICSIM_APP.game.OpenLine.BOTTOM:
                this._currentOpenLine = TRAFFICSIM_APP.game.OpenLine.LEFT;
                break;
            case TRAFFICSIM_APP.game.OpenLine.LEFT:
                this._currentOpenLine = TRAFFICSIM_APP.game.OpenLine.TOP;
                break;
        }
    };

})();

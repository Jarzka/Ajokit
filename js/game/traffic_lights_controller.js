TRAFFICSIM_APP.game = TRAFFICSIM_APP.game || {};

TRAFFICSIM_APP.game.OpenLine = {
    "TOP": 0,
    "RIGHT": 1,
    "DOWN": 2,
    "BOTTOM": 3
};


TRAFFICSIM_APP.game.TrafficLightsController = function (road) {
    var self = this;

    this._road = road;
};
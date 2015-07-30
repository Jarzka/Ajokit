// Road is a physical road cell in the grid

TRAFFICSIM_APP.game = TRAFFICSIM_APP.game || {};

TRAFFICSIM_APP.game.RoadTypes = [
    "HORIZONTAL",
    "VERTICAL",
    "UP_LEFT",
    "UP_RIGHT",
    "DOWN_LEFT",
    "DOWN_RIGHT",
    "CROSS"
];

TRAFFICSIM_APP.game.Road = function(worldController, model, roadType) {
    var self = this;

    this._roadType = roadType;

    function constructor() {
        TRAFFICSIM_APP.game.GameplayObject.call(self);
        self.setOptions(worldController, model);
    }

    constructor(worldController, model);
};

TRAFFICSIM_APP.game.Road.prototype = Object.create(TRAFFICSIM_APP.game.GameplayObject.prototype);

TRAFFICSIM_APP.game.Road.prototype.getRoadType = function() {
    return this._roadType;
};
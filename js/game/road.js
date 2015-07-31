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

TRAFFICSIM_APP.game.Road = function (worldController, model, roadType) {
    var self = this;

    this._roadType = roadType;
    this._roadNodes = [];

    function constructor() {
        TRAFFICSIM_APP.game.GameplayObject.call(self, worldController, model);
        var nodePositions = self.getNodePositionsByRoadType(self._roadType);
        self.initializeNodes(nodePositions);

        console.log("Road has " + self._roadNodes.length + " nodes:" );
        console.log(self._roadNodes);
    }

    constructor(worldController, model);
};

TRAFFICSIM_APP.game.Road.prototype = Object.create(TRAFFICSIM_APP.game.GameplayObject.prototype);

TRAFFICSIM_APP.game.Road.prototype.getNodePositionsByRoadType = function (roadType) {
    /* Node position is relative to the parent object's width and height:
     * [0, 0] is the upper left corner, [1, 1] is the lower right corner, [0.5, 0.5] is the center and so on...
     */
    if (roadType === "VERTICAL") {
        return [
            {
                "x": 0.2,
                "y": 0,
                "z": 0
            },
            {
                "x": 0.8,
                "y": 0,
                "z": 0
            },
            {
                "x": 0.2,
                "y": 0,
                "z": 1
            },
            {
                "x": 0.8,
                "y": 0,
                "z": 1
            }
        ];
    }
};

TRAFFICSIM_APP.game.Road.prototype.initializeNodes = function (positions) {
    var self = this;

    positions.forEach(function (position) {
        var node = new TRAFFICSIM_APP.game.RoadNode(self._worldController, position);
        self._roadNodes.push(node);
    });
};

TRAFFICSIM_APP.game.Road.prototype.getRoadType = function () {
    return this._roadType;
};
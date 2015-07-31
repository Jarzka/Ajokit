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

TRAFFICSIM_APP.game.Road = function (roadRouteController, model, roadType) {
    var self = this;

    this._roadRouteController = roadRouteController;
    this._roadType = roadType;

    function constructor(worldController, model) {
        TRAFFICSIM_APP.game.GameplayObject.call(self, worldController, model);
    }

    constructor(roadRouteController.getWorldController(), model);
};

TRAFFICSIM_APP.game.Road.prototype = Object.create(TRAFFICSIM_APP.game.GameplayObject.prototype);

TRAFFICSIM_APP.game.Road.prototype.getNodePositions = function () {
    /* Node position is relative to the parent object's width and height:
     * [0, 0] is the upper left corner, [1, 1] is the lower right corner, [0.5, 0.5] is the center and so on...
     *
     * Node's position in the array determines its "name". For example the first node in the array is node number 0,
     * the second is node 1 etc.
     */
    if (this._roadType === "VERTICAL") {
        return [
            {
                "x": 0.27,
                "y": 0,
                "z": 0
            },
            {
                "x": 0.73,
                "y": 0,
                "z": 0
            },
            {
                "x": 0.27,
                "y": 0,
                "z": 1
            },
            {
                "x": 0.73,
                "y": 0,
                "z": 1
            }
        ];
    }
};


TRAFFICSIM_APP.game.Road.prototype.getNodeConnections = function () {
    /* Connections is an array in which each element is an array of a pair of connected nodes.
     * For example [[1, 3], [2, 4]] means that there are two connections:
     * nodes 1 and 3 are connected and
     * nodes 2 and 4 are connected. */
    if (this._roadType === "VERTICAL") {
        return [
            [0, 2],
            [1, 3]
        ];
    }
};

TRAFFICSIM_APP.game.Road.prototype.getRoadType = function () {
    return this._roadType;
};
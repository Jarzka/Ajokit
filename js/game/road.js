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
    this._roadRoutes = [];

    function constructor() {
        TRAFFICSIM_APP.game.GameplayObject.call(self, worldController, model);
        var nodePositions = self.getNodePositionsByRoadType(self._roadType);
        var nodeConnections = self.getNodeConnectionsByRoadType(self._roadType);
        self.initializeNodes(nodePositions, nodeConnections);
    }

    constructor(worldController, model);
};

TRAFFICSIM_APP.game.Road.prototype = Object.create(TRAFFICSIM_APP.game.GameplayObject.prototype);

TRAFFICSIM_APP.game.Road.prototype.getNodePositionsByRoadType = function (roadType) {
    /* Node position is relative to the parent object's width and height:
     * [0, 0] is the upper left corner, [1, 1] is the lower right corner, [0.5, 0.5] is the center and so on...
     *
     * Node's position in the array determines its "name". For example the first node in the array is node number 1,
     * the second is node 2 etc.
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


TRAFFICSIM_APP.game.Road.prototype.getNodeConnectionsByRoadType = function (roadType) {
    /* Connections is an array in which each element is an array of a pair of connected nodes.
     * For example [[1, 3], [2, 4]] means that there are two connections:
     * nodes 1 and 3 are connected and
     * nodes 2 and 4 are connected. */
    if (roadType === "VERTICAL") {
        return [
            [1, 3],
            [2, 4]
        ];
    }
};

TRAFFICSIM_APP.game.Road.prototype.initializeNodes = function (positions, connections) {
    var self = this;

    positions.forEach(function (position) {
        var node = new TRAFFICSIM_APP.game.RoadNode(self._worldController, position);
        self._roadNodes.push(node);
    });

    connections.forEach(function (connection) {
        var route = new TRAFFICSIM_APP.game.RoadRoute(self._worldController,
            self._roadNodes[connection[0]],
            self._roadNodes[connection[1]]
        );
        self._roadRoutes.push(route);
    });
};

TRAFFICSIM_APP.game.Road.prototype.getRoadType = function () {
    return this._roadType;
};
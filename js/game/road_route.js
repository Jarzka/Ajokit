// RoadRoute is a connection between RoadNode objects.

TRAFFICSIM_APP.game = TRAFFICSIM_APP.game || {};

// TODO Add segments (or use bezier curve?)

TRAFFICSIM_APP.game.RoadRoute = function(worldController, startNode, endNode) {
    var self = this;
    this._worldController = worldController;

    this._startNode = startNode;
    this._endNode = endNode;
};

TRAFFICSIM_APP.game.RoadRoute.prototype.getStartNode = function() {
    return this._startNode;
};

TRAFFICSIM_APP.game.RoadRoute.prototype.getEndNode = function() {
    return this._endNode;
};
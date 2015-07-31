// RoadRoute is a connection between RoadNode objects.

TRAFFICSIM_APP.game = TRAFFICSIM_APP.game || {};

// TODO Add segments (or use bezier curve?)

TRAFFICSIM_APP.game.RoadRoute = function(worldController, startNode, endNode) {
    var self = this;
    this._worldController = worldController;

    this._startNode = startNode;
    this._endNode = endNode;

    this.getStartNode = function() {
        return startNode;
    };

    this.getEndNode = function() {
        return endNode;
    };
};
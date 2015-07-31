// RoadRoute is a connection between RoadNode objects.

TRAFFICSIM_APP.game = TRAFFICSIM_APP.game || {};

// TODO Add segments (or use bezier curve?)

TRAFFICSIM_APP.game.RoadRoute = function(worldController, startNode, endNode) {
    this._worldController = worldController;

    this.startNode = startNode;
    this.endNode = endNode;
};
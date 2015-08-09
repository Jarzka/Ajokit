// RoadRoute is a connection between RoadNode objects.

TRAFFICSIM_APP.game = TRAFFICSIM_APP.game || {};

TRAFFICSIM_APP.game._nextRoadRouteId = 0;

TRAFFICSIM_APP.game.RoadRoute = function(worldController, startNode, endNode) {
    this._worldController = worldController;

    this.startNode = startNode;
    this.endNode = endNode;
    this._routeId = TRAFFICSIM_APP.game._nextRoadRouteId++;
};
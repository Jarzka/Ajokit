// RoadNode is a single point in 3D space used for connecting RoadRoutes.

TRAFFICSIM_APP.game = TRAFFICSIM_APP.game || {};

TRAFFICSIM_APP.game.RoadNode = function (worldController, position) {
    this._worldController = worldController;
    this.position = position;
    this._connectedRoutes = [];
};

TRAFFICSIM_APP.game.RoadNode.prototype.getConnectedRoutes = function() {
    return this._connectedRoutes;
};

TRAFFICSIM_APP.game.RoadNode.prototype.addConnectedRoute = function (route) {
    this._connectedRoutes.push(route);
};
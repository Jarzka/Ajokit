// RoadNode is a single point in 3D space used for connecting RoadRoutes.

TRAFFICSIM_APP.game = TRAFFICSIM_APP.game || {};

TRAFFICSIM_APP.game.RoadNode = function (worldController, position) {
    var self = this;

    this._worldController = worldController;
    this.position = position;
};
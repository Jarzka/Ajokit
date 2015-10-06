(function () {

// RoadNode is a single point in 3D space used for connecting RoadRoutes.

    TRAFFICSIM_APP.game = TRAFFICSIM_APP.game || {};

    var Vector3 = TRAFFICSIM_APP.utils.Vector3;

    TRAFFICSIM_APP.game._nextRoadNodeId = 0;

    TRAFFICSIM_APP.game.RoadNode = function (worldController, position) {
        this._worldController = worldController;
        this.position = new Vector3(position.x, position.y, position.z);
        this._connectedRoutes = [];
        this._nodeId = TRAFFICSIM_APP.game._nextRoadNodeId++;
    };

    TRAFFICSIM_APP.game.RoadNode.prototype.getConnectedRoutes = function () {
        return this._connectedRoutes;
    };

    TRAFFICSIM_APP.game.RoadNode.prototype.getConnectedStartingRoutes = function () {
        var self = this;
        return this._connectedRoutes.filter(function (route) {
            return route.startNode == self;
        });
    };

    TRAFFICSIM_APP.game.RoadNode.prototype.getConnectedFreeStartingRoutes = function () {
        var self = this;
        return this._connectedRoutes.filter(function (route) {
            return route.startNode == self && route.isFree();
        });
    };

    TRAFFICSIM_APP.game.RoadNode.prototype.addConnectedRoute = function (route) {
        this._connectedRoutes.push(route);
    };

    TRAFFICSIM_APP.game.RoadNode.prototype.removeConnectedRoute = function (route) {
        var index = this._connectedRoutes.indexOf(route);
        if (index > -1) {
            this._connectedRoutes.splice(index, 1);
        }
    }

})();
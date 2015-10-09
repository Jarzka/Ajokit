(function () {
    // RoadNode is a single point in 3D space used for connecting RoadRoutes.
    TRAFFICSIM_APP.game = TRAFFICSIM_APP.game || {};
    TRAFFICSIM_APP.game.road_node = TRAFFICSIM_APP.game.road_node || {};

    var NS = TRAFFICSIM_APP.game.road_node;
    var Vector3 = TRAFFICSIM_APP.utils.Vector3;

    TRAFFICSIM_APP.game._nextRoadNodeId = 0;

    NS.RoadNode = function (worldController, position) {
        this._worldController = worldController;
        this.position = new Vector3(position.x, position.y, position.z);
        this._connectedRoutes = [];
        this._nodeId = TRAFFICSIM_APP.game._nextRoadNodeId++;
    };

    NS.RoadNode.prototype.getConnectedRoutes = function () {
        return this._connectedRoutes;
    };

    NS.RoadNode.prototype.getConnectedStartingRoutes = function () {
        var self = this;
        return this._connectedRoutes.filter(function (route) {
            return route.startNode == self;
        });
    };

    NS.RoadNode.prototype.getConnectedFreeStartingRoutes = function () {
        var self = this;
        return this._connectedRoutes.filter(function (route) {
            return route.startNode == self && route.isFree();
        });
    };

    NS.RoadNode.prototype.addConnectedRoute = function (route) {
        this._connectedRoutes.push(route);
    };

    NS.RoadNode.prototype.removeConnectedRoute = function (route) {
        var index = this._connectedRoutes.indexOf(route);
        if (index > -1) {
            this._connectedRoutes.splice(index, 1);
        }
    }

})();
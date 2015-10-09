(function() {
    // RoadRoute is a connection between RoadNode objects.

    TRAFFICSIM_APP.game = TRAFFICSIM_APP.game || {};
    TRAFFICSIM_APP.game.road_route = TRAFFICSIM_APP.game.road_route || {};

    TRAFFICSIM_APP.game.road_route.RoadRoute = function(worldController, road, startNode, endNode) {
        this._worldController = worldController;
        this.startNode = startNode;
        this.endNode = endNode;
        this._routeId = null;
        this._isFree = true;
        this._road = road;
    };

    TRAFFICSIM_APP.game.road_route.RoadRoute.prototype.isFree = function() {
        return this._isFree;
    };

    TRAFFICSIM_APP.game.road_route.RoadRoute.prototype.setFree = function(boolean) {
        this._isFree = boolean;
    };

    TRAFFICSIM_APP.game.road_route.RoadRoute.prototype.getRouteId = function() {
        return this._routeId;
    };

    TRAFFICSIM_APP.game.road_route.RoadRoute.prototype.setRouteId = function(routeId) {
        this._routeId = routeId;
    };

    TRAFFICSIM_APP.game.road_route.RoadRoute.prototype.getRoad = function() {
        return this._road;
    };

    TRAFFICSIM_APP.game.road_route.RoadRoute.prototype.getTargetNode = function() {
        return this.endNode;
    };
})();
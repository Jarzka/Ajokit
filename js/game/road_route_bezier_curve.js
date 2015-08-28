TRAFFICSIM_APP.game = TRAFFICSIM_APP.game || {};

TRAFFICSIM_APP.game.RoadRouteBezierCurve = function(worldController, startNode, endNode) {
    TRAFFICSIM_APP.game.RoadRoute.call(this, worldController, startNode, endNode);
};

TRAFFICSIM_APP.game.RoadRouteBezierCurve.prototype = Object.create(TRAFFICSIM_APP.game.RoadRoute.prototype);
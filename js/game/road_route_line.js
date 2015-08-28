TRAFFICSIM_APP.game = TRAFFICSIM_APP.game || {};

TRAFFICSIM_APP.game.RoadRouteLine = function(worldController, startNode, endNode) {
    TRAFFICSIM_APP.game.RoadRoute.call(this, worldController, startNode, endNode);
};

TRAFFICSIM_APP.game.RoadRouteLine.prototype = Object.create(TRAFFICSIM_APP.game.RoadRoute.prototype);
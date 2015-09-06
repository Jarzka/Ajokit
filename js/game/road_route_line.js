(function () {
    var math = TRAFFICSIM_APP.utils.math;
    var Vector2 = TRAFFICSIM_APP.utils.Vector2;

    TRAFFICSIM_APP.game = TRAFFICSIM_APP.game || {};

    TRAFFICSIM_APP.game.RoadRouteLine = function (worldController, startNode, endNode) {
        TRAFFICSIM_APP.game.RoadRoute.call(this, worldController, startNode, endNode);
    };

    TRAFFICSIM_APP.game.RoadRouteLine.prototype = Object.create(TRAFFICSIM_APP.game.RoadRoute.prototype);

    TRAFFICSIM_APP.game.RoadRouteLine.prototype.getNextPoint = function () {
        return this.endNode.position;
    };

    TRAFFICSIM_APP.game.RoadRouteLine.prototype.getNextPoint = function (position) {
        return new Vector2(
            Math.cos(math.angleBetweenPoints(position.x,
                -position.y,
                this.endNode.position.x,
                -this.endNode.position.y) * 0.05),
            Math.sin(math.angleBetweenPoints(position.x,
                    -position.y,
                    this.endNode.position.x,
                    -this.endNode.position.y) * 0.05)
        );
    };

    TRAFFICSIM_APP.game.RoadRouteLine.prototype.getNextPoint = function (position, distance) {
        var nextPoint = new Vector2(
            Math.cos(math.angleBetweenPoints(position.x,
                    -position.y,
                    this.endNode.position.x,
                    -this.endNode.position.y) * distance),
            Math.sin(math.angleBetweenPoints(position.x,
                    -position.y,
                    this.endNode.position.x,
                    -this.endNode.position.y) * distance)
        );

        // Make sure does not go over the end point!
        if (math.distance(nextPoint.x, nextPoint.y, 0, this.endNode.position.x, this.endNode.position.y, 0)
        > math.distance(position.x, position.y, 0, this.endNode.position.x, this.endNode.position.y, 0)) {
            return this.endNode.position;
        }

        return nextPoint;
    };

})();
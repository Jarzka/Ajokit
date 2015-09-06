(function () {
    var math = TRAFFICSIM_APP.utils.math;
    var Vector3 = TRAFFICSIM_APP.utils.Vector3;

    TRAFFICSIM_APP.game = TRAFFICSIM_APP.game || {};

    TRAFFICSIM_APP.game.RoadRouteLine = function (worldController, startNode, endNode) {
        TRAFFICSIM_APP.game.RoadRoute.call(this, worldController, startNode, endNode);
    };

    TRAFFICSIM_APP.game.RoadRouteLine.prototype = Object.create(TRAFFICSIM_APP.game.RoadRoute.prototype);

    /** Returns a point which is a bit more near the end point than the given point. */
    TRAFFICSIM_APP.game.RoadRouteLine.prototype.getNextPoint = function (position) {
        return new Vector3(
            position.x + Math.cos(math.angleBetweenPointsWhenYIncreasesDown(
                position.x,
                position.z,
                this.endNode.position.x,
                this.endNode.position.z)) * 0.05,
            0,
            position.z - Math.sin(math.angleBetweenPointsWhenYIncreasesDown(
                position.x,
                position.z,
                this.endNode.position.x,
                this.endNode.position.z)) * 0.05);
    };

    /** Returns a point which is the given distance near the end point starting from the given position. */
    TRAFFICSIM_APP.game.RoadRouteLine.prototype.getNextPointAtDistance = function (position, distance) {
        // Make sure it does not go over the end point!
        if (distance > math.distance(position.x, position.y, 0, this.endNode.position.x, this.endNode.position.y, 0)) {
            return this.endNode.position;
        }

        return new Vector3(
            position.x + Math.cos(math.angleBetweenPointsWhenYIncreasesDown(
                position.x,
                position.z,
                this.endNode.position.x,
                this.endNode.position.z)) * 0.05,
            0,
            position.z - Math.sin(math.angleBetweenPointsWhenYIncreasesDown(
                position.x,
                position.z,
                this.endNode.position.x,
                this.endNode.position.z)) * 0.05);
    };

    /** Returns a point which is the given distance near the end point starting from the given position.
     * If the calculated next point goes over the end point, continues using the given nextRoute */
    TRAFFICSIM_APP.game.RoadRouteLine.prototype.getNextPointAtDistanceOrContinue = function (position, distance, nextRoute) {
        // If goes over the end point, continue using the next route.
        if (distance > math.distance(position.x, position.y, 0, this.endNode.position.x, this.endNode.position.y, 0)) {
            return nextRoute.getNextPoint(
                nextRoute.startNode.position,
                distance - math.distance(position.x, position.y, 0, this.endNode.position.x, this.endNode.position.y, 0));
        }

        return new Vector3(
            position.x + Math.cos(math.angleBetweenPointsWhenYIncreasesDown(
                position.x,
                position.z,
                this.endNode.position.x,
                this.endNode.position.z)) * 0.05,
            0,
            position.z - Math.sin(math.angleBetweenPointsWhenYIncreasesDown(
                position.x,
                position.z,
                this.endNode.position.x,
                this.endNode.position.z)) * 0.05);
    };

})();
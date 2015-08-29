TRAFFICSIM_APP.game = TRAFFICSIM_APP.game || {};

TRAFFICSIM_APP.game.RoadRouteBezierCurve = function(worldController, startNode, endNode, controlPoints) {
    this._controlPoints = controlPoints;

    TRAFFICSIM_APP.game.RoadRoute.call(this, worldController, startNode, endNode);
};

TRAFFICSIM_APP.game.RoadRouteBezierCurve.prototype = Object.create(TRAFFICSIM_APP.game.RoadRoute.prototype);

/** t is a value between 0-1. 0 returns the starting point and 1 returns the ending point.
 * Anything between 0 and 1 returns a corresponding point in the bezier curve. */
TRAFFICSIM_APP.game.RoadRouteBezierCurve.prototype.getPointAtBezierCurve = function (t, x1, z1, x2, z2, cp1x, cp1z, cp2x, cp2z) {
    var x = Math.pow(1 - t, 3) * x1 + 3 * Math.pow(1 - t, 2) * t * cp1x + 3 * (1 - t) * Math.pow(t, 2) * cp2x + Math.pow(t, 3) * x2;
    var z = Math.pow(1 - t, 3) * z1 + 3 * Math.pow(1 - t, 2) * t * cp1z + 3 * (1 - t) * Math.pow(t, 2) * cp2z + Math.pow(t, 3) * z2;

    return new TRAFFICSIM_APP.utils.Vector3(x, 0, z);
};

/** Given coordinates x and z, returns an approximate T which corresponds the closest point at bezier curve.
 * The more you give accuracy the more accurate the found point in the curve will be but the calculation will also be slower.
 * Recommended value is 30. */
TRAFFICSIM_APP.game.RoadRouteBezierCurve.prototype.getTAtBezierCurve = function (x, z, accuracy) {
    // This might not be the most optimized way to do this, but it works reasonably well for this application.

    // Divide the curve in to n points. n is the same as the accuracy variable.
    var curvePoints = [];
    var step = 1 / accuracy;
    for (var i = 0; i <= 1; i = i + step) {
        curvePoints.push({
            "t": i,
            "position": this.getPointAtBezierCurve(
                i,
                this.startNode.position.x,
                this.startNode.position.z,
                this.endNode.position.x,
                this.endNode.position.z,
                this._controlPoints[0].x,
                this._controlPoints[0].z,
                this._controlPoints[1].x,
                this._controlPoints[1].z)}
        );
    }

    // Find the closest point
    var closesPointDistance = Number.MAX_VALUE;
    var closesPoint = null;
    curvePoints.forEach(function(point) {
        var distance = TRAFFICSIM_APP.utils.math.distance(x, 0, z, point.position.x, 0, point.position.z);

        if (distance < closesPointDistance) {
            closesPointDistance = distance;
            closesPoint = point;
        }
    });

    return closesPoint.t;
};


/** Returns the next x and y coordinates on the bezier curve.
 * currentT = Current point at bezier curve
 * step = How much T is incremented to resolve the next point */
TRAFFICSIM_APP.game.RoadRouteBezierCurve.prototype.getNextPointAtBezierCurve = function (currentT, step) {
    var nextT = currentT + step;

    if (nextT <= 0) {
        return this.startNode.position;
    }

    if (nextT >= 1) {
        return this.endNode.position;
    }

    return this.getPointAtBezierCurve(
        nextT,
        this.startNode.position.x,
        this.startNode.position.z,
        this.endNode.position.x,
        this.endNode.position.z,
        this._controlPoints[0].x,
        this._controlPoints[0].z,
        this._controlPoints[1].x,
        this._controlPoints[1].z)
};

/** Returns a approximate length of the bezier curve.
 * The more you give accuracy the more accurate the result will be but the calculation will also be slower.
 * Recommended value is 30. */
TRAFFICSIM_APP.game.RoadRouteBezierCurve.prototype.getCurveLength = function (accuracy) {
    // This might not be the most optimized way to do this, but it works reasonably well for this application.

    // Divide the curve in to n points. n is the same as the accuracy variable.
    var curvePoints = [];
    var step = 1 / accuracy;
    for (var i = 0; i <= 1; i = i + step) {
        curvePoints.push({
                "position": this.getPointAtBezierCurve(
                    i,
                    this.startNode.position.x,
                    this.startNode.position.z,
                    this.endNode.position.x,
                    this.endNode.position.z,
                    this._controlPoints[0].x,
                    this._controlPoints[0].z,
                    this._controlPoints[1].x,
                    this._controlPoints[1].z)}
        );
    }

    // Calculate distance between points
    var sum = 0;
    for (var j = 0; j < curvePoints.length - 1; j++) {
        var current = curvePoints[j];
        var next = curvePoints[j + 1];
        sum += TRAFFICSIM_APP.utils.math.distance(current.position.x, 0, current.position.z, next.position.x, 0, next.position.z)
    }

    return sum;
};

TRAFFICSIM_APP.game.RoadRouteBezierCurve.prototype.getNextPoint = function(position) {
    return this.getNextPointAtBezierCurve(this.getTAtBezierCurve(position.x, position.z, 30), 0.05);
};
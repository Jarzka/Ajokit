(function () {
    TRAFFICSIM_APP.utils = TRAFFICSIM_APP.utils || {};
    TRAFFICSIM_APP.utils.math = TRAFFICSIM_APP.utils.math || {};

    var self = TRAFFICSIM_APP.utils.math;

    TRAFFICSIM_APP.utils.math.distance = function (x1, y1, z1, x2, y2, z2) {
        return Math.sqrt(
            Math.pow(Math.abs(x1 - x2), 2)
            + Math.pow(Math.abs(y1 - y2), 2)
            + Math.pow(Math.abs(z1 - z2), 2)
        );
    };

    TRAFFICSIM_APP.utils.math.radians = function (degrees) {
        return degrees * Math.PI / 180;
    };

    TRAFFICSIM_APP.utils.math.degrees = function (radians) {
        return radians * 180 / Math.PI;
    };

    /** Returns random value between inclusive min and inclusive max.*/
    TRAFFICSIM_APP.utils.math.randomValue = function (min, max) {
        return Math.floor(Math.random() * (max + 1 - min) + min);
    };

    /** Returns a new polygon in which y and z have been swapped.*/
    TRAFFICSIM_APP.utils.math.swapPolygonZAndY = function (polygon) {
        var newPolygon = [];

        polygon.forEach(function(point) {
            newPolygon.push(
                {
                    "x": point.x,
                    "y": point.z,
                    "z": point.y
                })
        });

        return newPolygon;
    };

    /** Returns a new array of points in which y and z have been swapped.*/
    TRAFFICSIM_APP.utils.math.swapPointsZAndY = function (points) {
        var newPoints = [];

        points.forEach(function(point) {
            newPoints.push(
                {
                    "x": point.x,
                    "y": point.z,
                    "z": point.y
                })
        });

        return newPoints;
    };

    /* Uses Separating Axis Theorem (SAT) to find collision between to convex polygons.
     * Polygon points are presented simply as an array in which is item is a map of x and y positions.
     * Polygon edges are created in order.
     * Method explanation for example: http://www.sevenson.com.au/actionscript/sat/ */
    TRAFFICSIM_APP.utils.math.polygonCollision = function (polygon1, polygon2) {
        // TODO
    };

    /** Returns a new collision mask which is rotated around center. */
    TRAFFICSIM_APP.utils.math.rotateCollisionMaskWhenYIncreasesDown = function (collisionMask, newAngle) {
        var newCollisionMask = [];

        collisionMask.forEach(function (point) {
            var defaultAngle = self.angleBetweenPointsWhenYIncreasesDown(0, 0, point.x, point.y);
            var distanceBetweenPointAndCenter = self.distance(0, 0, 0, point.x, point.y, 0);

            var finalAngle = defaultAngle + newAngle;

            // No more than 360 degrees
            while (finalAngle > Math.PI * 2) {
                finalAngle -= Math.PI * 2;
            }

            newCollisionMask.push({
               "x": Math.cos(finalAngle) * distanceBetweenPointAndCenter,
               "y": -Math.sin(finalAngle) * distanceBetweenPointAndCenter
            });
        });

        return newCollisionMask;
    };

    /** Returns the positive angle between given points in radians. */
    TRAFFICSIM_APP.utils.math.angleBetweenPoints = function (x1, y1, x2, y2) {
        var radians = Math.atan2(y2 - y1, x2 - x1);

        // No negative angles
        while (radians < 0) {
            radians += Math.PI * 2;
        }

        return radians;
    };

    /** Returns the positive angle between given points in radians when y points down. */
    TRAFFICSIM_APP.utils.math.angleBetweenPointsWhenYIncreasesDown = function (x1, y1, x2, y2) {
        var radians = Math.atan2(-(y2 - y1), x2 - x1);
        // No negative angles
        while (radians < 0) {
            radians += Math.PI * 2;
        }

        return radians;
    };

    module.exports = TRAFFICSIM_APP.utils.math;

})();
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
        var edges = getEdges(polygon1, "polygon1").concat(polygon2, "polygon2");

        /* Loop through all edges, project all points to the edge's normal vector and check if there is gap.
         * If at least one gap is found, the two polygon are not colliding. However, if no gaps are found, the
         * polygons are in collision with each other. */
        for (var i = 0; i < edges.length; i++) {
            var edge = edges[i];
            var projectedPoints = projectPointsToNormalVectorOfEdge(edge, polygon1.concat(polygon2));

            if (isThereGapBetweenProjectedPoints(projectedPoints)) {
                return false;
            }
        }

        return true;

        function getEdges(polygon, ownerName) {
            var edges = [];
            for (var i = 0; i < polygon.length; i++) {
                var edge = {};

                if (i == polygon.length - 1) {
                    edge = {
                        "owner": ownerName,
                        "start": polygon[i],
                        "end": polygon[0]
                    };
                } else {
                    edge = {
                        "owner": ownerName,
                        "start": polygon[i],
                        "end": polygon[i + 1]
                    };
                }

                edges.push(edge);
            }

            return edges;
        }

        function projectPointsToNormalVectorOfEdge (edge, points) {

        }

        function isThereGapBetweenProjectedPoints(points) {

        }
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
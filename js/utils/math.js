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

    /** Returns a new array of Vector3s in which y and z have been swapped.*/
    TRAFFICSIM_APP.utils.math.swapVector3ZAndY = function (points3d) {
        var newPoints = [];

        points3d.forEach(function (point) {
            newPoints.push(new TRAFFICSIM_APP.utils.vector3.Vector3(point.x, point.z, point.y));
        });

        return newPoints;
    };

    /** Returns an array of Vector3s in which Y is the opposite value. */
    TRAFFICSIM_APP.utils.math.oppositeVector3Y = function (points3d) {
        var newPoints = [];

        points3d.forEach(function (point) {
            newPoints.push(new TRAFFICSIM_APP.utils.vector3.Vector3(point.x, -point.y, point.z));
        });

        return newPoints;
    };

    /* Uses Separating Axis Theorem (SAT) to find collision between two convex polygons.
     * Polygon points are presented simply as an array in which each item is a map of x and y positions.
     * Method explanation: http://www.sevenson.com.au/actionscript/sat/ */
    TRAFFICSIM_APP.utils.math.polygonCollision = function (polygon1, polygon2) {
        var self = this;
        var namedPolygon1 = namePolygon(polygon1, "polygon1");
        var namedPolygon2 = namePolygon(polygon2, "polygon2");
        var edges = getEdges(namedPolygon1.concat(namedPolygon2));
        return checkEdgeCollision(edges);

        function namePolygon(polygon, name) {
            var newPolygon = [];

            polygon.forEach(function (point) {
                var newPoint = new TRAFFICSIM_APP.utils.vector2.Vector2(point.x, point.y);
                newPoint.___name = name;
                newPolygon.push(newPoint);
            });

            return newPolygon;
        }

        function getEdges(polygon) {
            var edges = [];
            for (var i = 0; i < polygon.length; i++) {
                var edge = {};

                if (i == polygon.length - 1) {
                    edge = {
                        "start": polygon[i],
                        "end": polygon[0]
                    };
                } else {
                    edge = {
                        "start": polygon[i],
                        "end": polygon[i + 1]
                    };
                }

                edges.push(edge);
            }

            return edges;
        }

        /** Loops through all edges, projects all points to the edge's normal vector and checks if there is a gap.
         * If at least one gap is found, two polygon are not colliding. However, if no gaps are found, the
         * polygons are in collision with each other. */
        function checkEdgeCollision(edges) {
            for (var i = 0; i < edges.length; i++) {
                var projectedPoints = projectPointsToNormalVectorOfEdge(edges[i], namedPolygon1.concat(namedPolygon2));

                if (isThereGapBetweenProjectedPoints(projectedPoints)) {
                    return false;
                }
            }

            return true;
        }

        function projectPointsToNormalVectorOfEdge(edge, points) {
            var edgeAngle = self.angleBetweenPoints(edge.start.x, edge.start.y, edge.end.x, edge.end.y);
            var edgeAsVector = new TRAFFICSIM_APP.utils.vector2.Vector2(Math.cos(edgeAngle), Math.sin(edgeAngle));
            var normalVector = edgeAsVector.normalVector();
            var projectedPoints = [];

            points.forEach(function(point) {
                var m;
                if (normalVector.x != 0) {
                    m = normalVector.y / normalVector.x;
                } else {
                    m = 0;
                }

                var x = (m * point.y + point.x) / (m * m + 1);
                var y = (m * m * point.y + m * point.x) / (m * m + 1);

                var projectedPoint = new TRAFFICSIM_APP.utils.vector2.Vector2(x, y);
                projectedPoint.___name = point.___name;
                projectedPoints.push(projectedPoint);
            });

            return projectedPoints;
        }

        function isThereGapBetweenProjectedPoints(points) {
            return findGap(sortPointsByLocation(points));

            function sortPointsByLocation(points) {
                // Sort points by x-axis (except if x is the same for all points, sort by y).
                var sortFunction;
                if (points.every(function(point) {
                        return point.x == points[0].x
                    })) {
                    sortFunction = function(a, b) {
                        return a.y >= b.y;
                    }
                } else {
                    sortFunction = function(a, b) {
                        return a.x >= b.x;
                    }
                }

                return points.slice().sort(sortFunction);
            }

            function findGap(sortedPoints) {
                // Go through all points. If the point's owner polygon changes only once, there is a gap.
                var switchesCount = 0;
                for (var i = 1; i < sortedPoints.length; i++) {
                    if (sortedPoints[i].___name != sortedPoints[i - 1].___name) {
                        switchesCount++;
                    }
                }

                return switchesCount <= 1;
            }

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

    /** Returns a new collision mask which is rotated around center. */
    TRAFFICSIM_APP.utils.math.rotateCollisionMask = function (collisionMask, newAngle) {
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
                "y": Math.sin(finalAngle) * distanceBetweenPointAndCenter
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

    /** Returns the positive angle between given points in radians. */
    TRAFFICSIM_APP.utils.math.angleBetweenPoints = function (x1, y1, x2, y2) {
        var radians = Math.atan2(y2 - y1, x2 - x1);
        // No negative angles
        while (radians < 0) {
            radians += Math.PI * 2;
        }

        return radians;
    };

    module.exports = TRAFFICSIM_APP.utils.math;

})();
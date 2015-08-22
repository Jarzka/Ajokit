(function () {
    TRAFFICSIM_APP.utils = TRAFFICSIM_APP.utils || {};
    TRAFFICSIM_APP.utils.math = TRAFFICSIM_APP.utils.math || {};

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

    TRAFFICSIM_APP.utils.math.polygonCollision = function (polygon1, polygon2) {
        // TODO
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
    TRAFFICSIM_APP.utils.math.angleBetweenPointsWhenYPointsDown = function (x1, y1, x2, y2) {
        var radians = Math.atan2(-(y2 - y1), x2 - x1); // y points down in computer graphics

        // No negative angles
        while (radians < 0) {
            radians += Math.PI * 2;
        }

        return radians;
    };

    module.exports = TRAFFICSIM_APP.utils.math;

})();
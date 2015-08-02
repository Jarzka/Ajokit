TRAFFICSIM_APP.utils = TRAFFICSIM_APP.utils || {};
TRAFFICSIM_APP.utils.math = TRAFFICSIM_APP.utils.math || {};

TRAFFICSIM_APP.utils.math.distance = function (x1, y1, z1, x2, y2, z2) {
    return Math.sqrt(
        Math.pow(Math.abs(x1 - x2), 2)
        + Math.pow(Math.abs(y1 - y2), 2)
        + Math.pow(Math.abs(z1 - z2), 2)
    );
};

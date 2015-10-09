(function () {
    TRAFFICSIM_APP.utils = TRAFFICSIM_APP.utils || {};
    TRAFFICSIM_APP.utils.vector = TRAFFICSIM_APP.utils.vector || {};

    var NS = TRAFFICSIM_APP.utils.vector;

    NS.Vector = function (x, y) {
        this.x = x || 0;
        this.y = y || 0;
    };

    module.exports = NS;

})();
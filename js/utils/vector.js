(function () {
    TRAFFICSIM_APP.utils = TRAFFICSIM_APP.utils || {};
    TRAFFICSIM_APP.utils.Vector = function (x, y) {
        this.x = x || 0;
        this.y = y || 0;
    };

    module.exports = TRAFFICSIM_APP.utils.Vector;

})();
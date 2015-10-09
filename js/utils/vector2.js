(function () {
    TRAFFICSIM_APP.utils = TRAFFICSIM_APP.utils || {};
    TRAFFICSIM_APP.utils.vector2 = TRAFFICSIM_APP.utils.vector2 || {};

    var NS = TRAFFICSIM_APP.utils.vector2;

    NS.Vector2 = function (x, y) {
        TRAFFICSIM_APP.utils.vector.Vector.call(this, x, y);
    };

    NS.Vector2.prototype = Object.create(TRAFFICSIM_APP.utils.vector.Vector.prototype);

    NS.Vector2.prototype.add = function (vector2) {
        return new NS.Vector2(this.x + vector2.x, this.y + vector2.y);
    };

    NS.Vector2.prototype.subtract = function (vector2) {
        return new NS.Vector2(this.x - vector2.x, this.y - vector2.y);
    };

    NS.Vector2.prototype.copy = function () {
        return new NS.Vector2(this.x, this.y);
    };

    NS.Vector2.prototype.normalVector = function () {
        return new NS.Vector2(-this.y, this.x);
    };

    module.exports = NS.Vector2;

})();
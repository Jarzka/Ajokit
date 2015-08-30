(function () {
    TRAFFICSIM_APP.utils = TRAFFICSIM_APP.utils || {};
    TRAFFICSIM_APP.utils.Vector2 = function (x, y) {
        TRAFFICSIM_APP.utils.Vector.call(this, x, y);
    };

    TRAFFICSIM_APP.utils.Vector2.prototype = Object.create(TRAFFICSIM_APP.utils.Vector.prototype);

    TRAFFICSIM_APP.utils.Vector2.prototype.set = function (vector2) {
        this.x = vector2.x;
        this.y = vector2.y;
        return this;
    };

    TRAFFICSIM_APP.utils.Vector2.prototype.add = function (vector2) {
        this.x += vector2.x;
        this.y += vector2.y;
        return this;
    };

    TRAFFICSIM_APP.utils.Vector2.prototype.subtract = function (vector2) {
        this.x -= vector2.x;
        this.y -= vector2.y;
        return this;
    };

    TRAFFICSIM_APP.utils.Vector2.prototype.copy = function () {
        return new TRAFFICSIM_APP.utils.Vector2(this.x, this.y);
    };

    module.exports = TRAFFICSIM_APP.utils.Vector2;

})();
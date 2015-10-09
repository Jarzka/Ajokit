(function () {
    TRAFFICSIM_APP.utils = TRAFFICSIM_APP.utils || {};
    TRAFFICSIM_APP.utils.vector3 = TRAFFICSIM_APP.utils.vector3 || {};

    var NS = TRAFFICSIM_APP.utils.vector3;

    NS.Vector3 = function (x, y, z) {
        this.z = z || 0;
        TRAFFICSIM_APP.utils.vector.Vector.call(this, x, y);
    };

    NS.Vector3.prototype = Object.create(TRAFFICSIM_APP.utils.vector.Vector.prototype);

    NS.Vector3.prototype.add = function (vector3) {
        return new NS.Vector3(this.x + vector3.x, this.y + vector3.y, this.z + vector3.z);
    };

    NS.Vector3.prototype.subtract = function (vector3) {
        return new NS.Vector3(this.x - vector3.x, this.y - vector3.y, this.z - vector3.z);
    };

    NS.Vector3.prototype.copy = function () {
        return new NS.Vector3(this.x, this.y, this.z);
    };

    module.exports = NS.Vector3;

})();
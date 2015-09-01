(function () {
    TRAFFICSIM_APP.utils = TRAFFICSIM_APP.utils || {};
    TRAFFICSIM_APP.utils.Vector3 = function (x, y, z) {
        this.z = z || 0;
        TRAFFICSIM_APP.utils.Vector.call(this, x, y);
    };

    TRAFFICSIM_APP.utils.Vector3.prototype = Object.create(TRAFFICSIM_APP.utils.Vector.prototype);

    TRAFFICSIM_APP.utils.Vector3.prototype.add = function (vector3) {
        return new TRAFFICSIM_APP.utils.Vector3(this.x + vector3.x, this.y + vector3.y, this.z + vector3.z);
    };

    TRAFFICSIM_APP.utils.Vector3.prototype.subtract = function (vector3) {
        return new TRAFFICSIM_APP.utils.Vector3(this.x - vector3.x, this.y - vector3.y, this.z - vector3.z);
    };

    TRAFFICSIM_APP.utils.Vector3.prototype.copy = function () {
        return new TRAFFICSIM_APP.utils.Vector3(this.x, this.y, this.z);
    };

    module.exports = TRAFFICSIM_APP.utils.Vector3;

})();
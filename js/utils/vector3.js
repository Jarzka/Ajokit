(function () {
    TRAFFICSIM_APP.utils = TRAFFICSIM_APP.utils || {};
    TRAFFICSIM_APP.utils.Vector3 = function (x, y, z) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    };

    TRAFFICSIM_APP.utils.Vector3.prototype.set = function (vector3) {
        this.x = vector3.x;
        this.y = vector3.y;
        this.z = vector3.z;
        return this;
    };

    TRAFFICSIM_APP.utils.Vector3.prototype.copy = function () {
        return new TRAFFICSIM_APP.utils.Vector3(this.x, this.y, this.z);
    };


    TRAFFICSIM_APP.utils.Vector3.rotate = function () {
        var x = this.x;
        this.x = this.y;
        this.y = -x;
        return this;
    };

    TRAFFICSIM_APP.utils.Vector3.prototype.add = function (vector3) {
        this.x += vector3.x;
        this.y += vector3.y;
        this.c += vector3.z;
        return this;
    };

    TRAFFICSIM_APP.utils.Vector3.prototype.subtract = function (vector3) {
        this.x -= vector3.x;
        this.y -= vector3.y;
        this.c -= vector3.z;
        return this;
    };

})();
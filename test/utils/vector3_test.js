global.TRAFFICSIM_APP = {};

var assert = require("assert");
var Vector3 = require("../../js/utils/vector3.js");

describe('Vector3', function() {
    describe('add', function () {
        it('should add vector to vector', function () {
            var vector3A = new Vector3(-1, 0, -3);
            var vector3B = new Vector3(1, 1, 1);

            vector3A.add(vector3B);
            assert.equal(vector3A.x, 0);
            assert.equal(vector3A.y, 1);
            assert.equal(vector3A.z, -2);

        });
    });
});
global.TRAFFICSIM_APP = {};

var assert = require("assert");
require("../../js/utils/vector.js");
var Vector3 = require("../../js/utils/vector3.js"); // FIXME Does not find Vector?

describe('Vector3', function() {
    describe('add', function () {
        it('should add vector to vector', function () {
            var vector3A = new Vector3(-1, 0, -3);
            var vector3B = new Vector3(1, 1, 1);

            var newVector = vector3A.add(vector3B);
            assert.equal(newVector.x, 0);
            assert.equal(newVector.y, 1);
            assert.equal(newVector.z, -2);

        });
    });
});
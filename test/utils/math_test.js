global.TRAFFICSIM_APP = {};

var assert = require("assert");
var math = require("../../js/utils/math.js");

describe('Math', function() {
    describe('randomValue', function () {
        it('should return random values', function () {
            // Fill array with random values between 0 and 10
            var values = [];
            for (var i = 0; i < 10000; i++) {
                values.push(math.randomValue(0, 10));
            }

            // Count numbers
            var result = {};
            values.forEach(function(number) {
                var numberAsString = number.toString();
                result[numberAsString] = result[numberAsString] + 1 || 1;
            });

            // There must be at least two of each number
            assert.equal(Object.keys(result).length, 11);
            Object.keys(result).forEach(function(key) {
                console.log(result[key]);
                assert.equal(true, result[key] > 1);
            });
        });
    });
});
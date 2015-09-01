global.TRAFFICSIM_APP = {};

var assert = require("assert");
var Vector = require("../../js/utils/vector.js");
var Vector2 = require("../../js/utils/vector2.js");
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

    describe('angleBetweenPointsWhenYIncreasesDown', function () {
        it('should return angle between points', function () {
            var angleRadians = math.angleBetweenPointsWhenYIncreasesDown(0, 0, 1, -1);
            var angleDegree = math.degrees(angleRadians);

            assert.equal(angleDegree, 45);
        });
    });

    describe('angleBetweenPointsWhenYIncreasesDown', function () {
        it('should return angle between points', function () {
            var angleRadians = math.angleBetweenPointsWhenYIncreasesDown(0, 0, -1, -1);
            var angleDegree = math.degrees(angleRadians);

            assert.equal(angleDegree, 135);
        });
    });

    describe('angleBetweenPointsWhenYIncreasesDown', function () {
        it('should return angle between points', function () {
            var angleRadians = math.angleBetweenPointsWhenYIncreasesDown(0, 0, -1, 1);
            var angleDegree = math.degrees(angleRadians);

            assert.equal(angleDegree, 225);
        });
    });

    describe('polygonCollision', function () {
        it('should detect two colliding polygons', function () {
            var polygon1 = [
                new Vector2(0, 0),
                new Vector2(1, 0),
                new Vector2(1, -1),
                new Vector2(0, -1)
            ];
            var polygon2 = [
                new Vector2(4, 4),
                new Vector2(5, 4),
                new Vector2(5, 5),
                new Vector2(4, 5)
            ];

            assert.equal(math.polygonCollision(polygon1, polygon2), true);
        });

        it('should return false', function () {
            var polygon1 = [
                new Vector2(0, 0),
                new Vector2(1, 0),
                new Vector2(1, -1),
                new Vector2(0, -1)
            ];
            var polygon2 = [
                new Vector2(0.5, -0.5),
                new Vector2(2, -2),
                new Vector2(2, -3),
                new Vector2(0.5, -2)
            ];

            assert.equal(math.polygonCollision(polygon1, polygon2), false);
        });
    });
});
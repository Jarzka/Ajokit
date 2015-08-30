global.TRAFFICSIM_APP = {};

var assert = require("assert");
var math = require("../../js/utils/math.js");
//var vector2 = require("../../js/utils/vector2.js");

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
                {
                    "x": 0,
                    "y": 0
                },
                {
                    "x": 1,
                    "y": 0
                },
                {
                    "x": 1,
                    "y": -1
                },
                {
                    "x": 0,
                    "y": -1
                }
            ];
            var polygon2 = [
                {
                    "x": 0.5,
                    "y": -0.5
                },
                {
                    "x": 2,
                    "y": -2
                },
                {
                    "x": 2,
                    "y": -3
                },
                {
                    "x": 0.5,
                    "y": -2
                }
            ];

            assert.equal(math.polygonCollision(polygon1, polygon2), true);
        });

        it('should return false', function () {
            var polygon1 = [
                {
                    "x": 0,
                    "y": 0
                },
                {
                    "x": 1,
                    "y": 0
                },
                {
                    "x": 1,
                    "y": -1
                },
                {
                    "x": 0,
                    "y": -1
                }
            ];
            var polygon2 = [
                {
                    "x": 4,
                    "y": -4
                },
                {
                    "x": 5,
                    "y": -5
                },
                {
                    "x": 5,
                    "y": -6
                },
                {
                    "x": 4,
                    "y": -3
                }
            ];

            assert.equal(math.polygonCollision(polygon1, polygon2), false);
        });
    });
});
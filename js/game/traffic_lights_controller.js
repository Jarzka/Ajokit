(function() {
    TRAFFICSIM_APP.game = TRAFFICSIM_APP.game || {};
    TRAFFICSIM_APP.game.traffic_light_controller = TRAFFICSIM_APP.game.traffic_light_controller || {};

    var NS = TRAFFICSIM_APP.game.traffic_light_controller;
    var logger = TRAFFICSIM_APP.utils.logger;
    var math = TRAFFICSIM_APP.utils.math;
    var Vector3 = TRAFFICSIM_APP.utils.Vector3;

    NS.TrafficLightPosition = {
        "TOP": 0,
        "RIGHT": 1,
        "BOTTOM": 2,
        "LEFT": 3
    };

    NS.TrafficLightsController = function (road) {
        this._road = road;
        this._trafficLights = [];

        this._initializeTrafficLights();
    };

    NS.TrafficLightsController.prototype._initializeTrafficLights = function () {
        var trafficLightPositions = this.getTrafficLightPositionsRelativeToRoad();
        var map = this._road.getWorldController().getMap();
        var self = this;
        var roadPosition = this._road.getPosition();

        var trafficLight = null;
        switch (this._road.getRoadType()) {
            case TRAFFICSIM_APP.game.road.RoadType.CROSSROADS:
                trafficLight = insertTopTrafficLight();
                trafficLight = insertRightTrafficLight(trafficLight);
                trafficLight = insertBottomTrafficLight(trafficLight);
                insertLeftTrafficLight(trafficLight);
                break;
            case TRAFFICSIM_APP.game.road.RoadType.DOWN_LEFT_RIGHT:
                trafficLight = insertRightTrafficLight();
                trafficLight = insertBottomTrafficLight(trafficLight);
                insertLeftTrafficLight(trafficLight);
                break;
            case TRAFFICSIM_APP.game.road.RoadType.UP_LEFT_DOWN:
                trafficLight = insertTopTrafficLight();
                trafficLight = insertBottomTrafficLight(trafficLight);
                insertLeftTrafficLight(trafficLight);
                break;
            case TRAFFICSIM_APP.game.road.RoadType.UP_LEFT_RIGHT:
                trafficLight = insertTopTrafficLight();
                trafficLight = insertRightTrafficLight(trafficLight);
                insertLeftTrafficLight(trafficLight);
                break;
            case TRAFFICSIM_APP.game.road.RoadType.UP_RIGHT_DOWN:
                trafficLight = insertTopTrafficLight();
                trafficLight = insertRightTrafficLight(trafficLight);
                insertBottomTrafficLight(trafficLight);
                break;
        }

        if (this._trafficLights.length > 0) {
            this._trafficLights[0].setNextTrafficLight(this._trafficLights[this._trafficLights.length - 1]);
            this._trafficLights[math.randomValue(0, this._trafficLights.length - 1)].setActive(true);
        }

        function insertTopTrafficLight(nextTrafficLight) {
            var relativePositionTop = trafficLightPositions.filter(function (position) {
                return position.positionName == NS.TrafficLightPosition.TOP;
            })[0];
            var trafficLightTopPositionInWorld = new Vector3(roadPosition.x - (map.getTileSize() / 2) + (relativePositionTop.x * map.getTileSize()),
                0,
                roadPosition.z - (map.getTileSize() / 2) + (relativePositionTop.z * map.getTileSize()));
            var trafficLightTop = new TRAFFICSIM_APP.game.traffic_light.TrafficLight(self, nextTrafficLight, NS.TrafficLightPosition.TOP, trafficLightTopPositionInWorld);
            self._trafficLights.push(trafficLightTop);
            return trafficLightTop;
        }

        function insertRightTrafficLight(nextTrafficLight) {
            var relativePositionRight = trafficLightPositions.filter(function (position) {
                return position.positionName == NS.TrafficLightPosition.RIGHT;
            })[0];
            var trafficLightRightPositionInWorld = new Vector3(roadPosition.x - (map.getTileSize() / 2) + (relativePositionRight.x * map.getTileSize()),
                0,
                roadPosition.z - (map.getTileSize() / 2) + (relativePositionRight.z * map.getTileSize()));
            var trafficLightRight =
                new TRAFFICSIM_APP.game.traffic_light.TrafficLight(self, nextTrafficLight, NS.TrafficLightPosition.RIGHT, trafficLightRightPositionInWorld);
            self._trafficLights.push(trafficLightRight);
            return trafficLightRight;
        }

        function insertBottomTrafficLight(nextTrafficLight) {
            var relativePositionBottom = trafficLightPositions.filter(function (position) {
                return position.positionName == NS.TrafficLightPosition.BOTTOM;
            })[0];
            var trafficLightBottomPositionInWorld = new Vector3(roadPosition.x - (map.getTileSize() / 2) + (relativePositionBottom.x * map.getTileSize()),
                0,
                roadPosition.z - (map.getTileSize() / 2) + (relativePositionBottom.z * map.getTileSize()));
            var trafficLightBottom = new TRAFFICSIM_APP.game.traffic_light.TrafficLight(self, nextTrafficLight, NS.TrafficLightPosition.BOTTOM, trafficLightBottomPositionInWorld);
            self._trafficLights.push(trafficLightBottom);
            return trafficLightBottom;
        }

        function insertLeftTrafficLight(nextTrafficLight) {
            var relativePositionLeft = trafficLightPositions.filter(function (position) {
                return position.positionName == NS.TrafficLightPosition.LEFT;
            })[0];
            var trafficLightLeftPositionInWorld = new Vector3(roadPosition.x - (map.getTileSize() / 2) + (relativePositionLeft.x * map.getTileSize()),
                0,
                roadPosition.z - (map.getTileSize() / 2) + (relativePositionLeft.z * map.getTileSize()));
            var trafficLightLeft = new TRAFFICSIM_APP.game.traffic_light.TrafficLight(self, nextTrafficLight, NS.TrafficLightPosition.LEFT, trafficLightLeftPositionInWorld);
            self._trafficLights.push(trafficLightLeft);
            return trafficLightLeft;
        }
    };

    /** Returns traffic light positions related to the current road.
     * Traffic light position is relative to the parent object's width and height:
     * [0, 0] is the upper left corner, [1, 1] is the lower right corner, [0.5, 0.5] is the center and so on...
     */
    NS.TrafficLightsController.prototype.getTrafficLightPositionsRelativeToRoad = function () {
        return [
            {
                "positionName": NS.TrafficLightPosition.TOP,
                "x": -0.1,
                "y": 0,
                "z": -0.1
            },
            {
                "positionName": NS.TrafficLightPosition.RIGHT,
                "x": 1.1,
                "y": 0,
                "z": -0.1
            },
            {
                "positionName": NS.TrafficLightPosition.BOTTOM,
                "x": 1.1,
                "y": 0,
                "z": 1.1
            },
            {
                "positionName": NS.TrafficLightPosition.LEFT,
                "x": -0.1,
                "y": 0,
                "z": 1.1
            }
        ];
    };

    NS.TrafficLightsController.prototype.update = function (deltaTime) {
        this._trafficLights.forEach(function(trafficLight) {
            trafficLight.update();
        });
    };

    NS.TrafficLightsController.prototype.getRoad = function () {
        return this._road;
    };

    NS.TrafficLightsController.prototype.getTrafficLights = function() {
        return this._trafficLights;
    }
})();

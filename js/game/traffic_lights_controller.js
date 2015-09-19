(function() {
    TRAFFICSIM_APP.game = TRAFFICSIM_APP.game || {};

    var logger = TRAFFICSIM_APP.utils.logger;
    var Vector3 = TRAFFICSIM_APP.utils.Vector3;

    TRAFFICSIM_APP.game.TrafficLightPosition = {
        "TOP": 0,
        "RIGHT": 1,
        "BOTTOM": 2,
        "LEFT": 3
    };

    TRAFFICSIM_APP.game.TrafficLightsController = function (road) {
        this._road = road;
        this._trafficLights = [];

        this._initializeTrafficLights();
    };

    TRAFFICSIM_APP.game.TrafficLightsController.prototype._initializeTrafficLights = function () {
        var trafficLightPositions = this.getTrafficLightPositionsRelativeToRoad();
        var map = this._road.getWorldController().getMap();
        var roadPosition = this._road.getPosition();

        if (this._road.getRoadType() == TRAFFICSIM_APP.game.RoadType.CROSSROADS) {
            // ---- TOP ----

            var relativePositionTop = trafficLightPositions.filter(function(position) {
                return position.positionName == TRAFFICSIM_APP.game.TrafficLightPosition.TOP;
            })[0];
            var trafficLightTopPositionInWorld = new Vector3(roadPosition.x - (map.getTileSize() / 2) + (relativePositionTop.x * map.getTileSize()),
                0,
                roadPosition.z - (map.getTileSize() / 2) + (relativePositionTop.z * map.getTileSize()));
            var trafficLightTop = new TRAFFICSIM_APP.game.TrafficLight(this, null, TRAFFICSIM_APP.game.TrafficLightPosition.TOP, trafficLightTopPositionInWorld);
            this._trafficLights.push(trafficLightTop);

            // ---- RIGHT ----

            var relativePositionRight = trafficLightPositions.filter(function(position) {
                return position.positionName == TRAFFICSIM_APP.game.TrafficLightPosition.RIGHT;
            })[0];
            var trafficLightRightPositionInWorld = new Vector3(roadPosition.x - (map.getTileSize() / 2) + (relativePositionRight.x * map.getTileSize()),
                0,
                roadPosition.z - (map.getTileSize() / 2) + (relativePositionRight.z * map.getTileSize()));
            var trafficLightRight =
                new TRAFFICSIM_APP.game.TrafficLight(this, this._trafficLights[0], TRAFFICSIM_APP.game.TrafficLightPosition.RIGHT, trafficLightRightPositionInWorld);
            this._trafficLights.push(trafficLightRight);

            // ---- BOTTOM ----

            var relativePositionBottom = trafficLightPositions.filter(function(position) {
                return position.positionName == TRAFFICSIM_APP.game.TrafficLightPosition.BOTTOM;
            })[0];
            var trafficLightBottomPositionInWorld = new Vector3(roadPosition.x - (map.getTileSize() / 2) + (relativePositionBottom.x * map.getTileSize()),
                0,
                roadPosition.z - (map.getTileSize() / 2) + (relativePositionBottom.z * map.getTileSize()));
            var trafficLightBottom = new TRAFFICSIM_APP.game.TrafficLight(this, this._trafficLights[1], TRAFFICSIM_APP.game.TrafficLightPosition.BOTTOM, trafficLightBottomPositionInWorld);
            this._trafficLights.push(trafficLightBottom);

            // ---- LEFT ----

            var relativePositionLeft = trafficLightPositions.filter(function(position) {
                return position.positionName == TRAFFICSIM_APP.game.TrafficLightPosition.LEFT;
            })[0];
            var trafficLightLeftPositionInWorld = new Vector3(roadPosition.x - (map.getTileSize() / 2) + (relativePositionLeft.x * map.getTileSize()),
                0,
                roadPosition.z - (map.getTileSize() / 2) + (relativePositionLeft.z * map.getTileSize()));
            var trafficLightLeft = new TRAFFICSIM_APP.game.TrafficLight(this, this._trafficLights[2], TRAFFICSIM_APP.game.TrafficLightPosition.LEFT, trafficLightLeftPositionInWorld);
            this._trafficLights.push(trafficLightLeft);

            this._trafficLights[0].setNextTrafficLight(this._trafficLights[3]);
            this._trafficLights[0].setActive(true);
        }
    };

    /** Returns traffic light positions related to the current road.
     * Traffic light position is relative to the parent object's width and height:
     * [0, 0] is the upper left corner, [1, 1] is the lower right corner, [0.5, 0.5] is the center and so on...
     */
    TRAFFICSIM_APP.game.TrafficLightsController.prototype.getTrafficLightPositionsRelativeToRoad = function () {
        switch (this._road.getRoadType()) {
            case TRAFFICSIM_APP.game.RoadType.CROSSROADS:
                return [
                    {
                        "positionName": TRAFFICSIM_APP.game.TrafficLightPosition.TOP,
                        "x": -0.1,
                        "y": 0,
                        "z": -0.1
                    },
                    {
                        "positionName": TRAFFICSIM_APP.game.TrafficLightPosition.RIGHT,
                        "x": 1.1,
                        "y": 0,
                        "z": 0.1
                    },
                    {
                        "positionName": TRAFFICSIM_APP.game.TrafficLightPosition.BOTTOM,
                        "x": 1.1,
                        "y": 0,
                        "z": 1.1
                    },
                    {
                        "positionName": TRAFFICSIM_APP.game.TrafficLightPosition.LEFT,
                        "x": -0.1,
                        "y": 0,
                        "z": 1.1
                    }
                ];
        }
    };

    TRAFFICSIM_APP.game.TrafficLightsController.prototype.update = function (deltaTime) {
        this._trafficLights.forEach(function(trafficLight) {
            trafficLight.update();
        });
    };

    TRAFFICSIM_APP.game.TrafficLightsController.prototype.getRoad = function () {
        return this._road;
    }
})();

// Road is a physical road cell in the grid

TRAFFICSIM_APP.game = TRAFFICSIM_APP.game || {};

TRAFFICSIM_APP.game.RoadType = {
    "HORIZONTAL": 1,
    "VERTICAL": 2,
    "UP_LEFT": 3,
    "UP_RIGHT": 4,
    "DOWN_LEFT": 5,
    "DOWN_RIGHT": 6,
    "CROSSROADS": 7
};

TRAFFICSIM_APP.game.Road = function (worldController, roadType) {
    var self = this;

    this._roadType = roadType;
    this._trafficLightsController = null;

    TRAFFICSIM_APP.game.GameplayObject.call(self, worldController, self.resolveRoadModelByType(roadType, worldController));

    if (roadType == TRAFFICSIM_APP.game.RoadType.CROSSROADS) {
        this._trafficLightsController = new TRAFFICSIM_APP.game.TrafficLightsController(this);
    }
};

TRAFFICSIM_APP.game.Road.prototype = Object.create(TRAFFICSIM_APP.game.GameplayObject.prototype);

TRAFFICSIM_APP.game.Road.prototype.resolveRoadModelByType = function (roadType, worldController) {
    switch (this._roadType) {
        case TRAFFICSIM_APP.game.RoadType.VERTICAL:
            return worldController.getGameplayScene().getApplication().getModelContainer().getModelByName("road_vertical").clone();
        case TRAFFICSIM_APP.game.RoadType.HORIZONTAL:
            return worldController.getGameplayScene().getApplication().getModelContainer().getModelByName("road_horizontal").clone();
        case TRAFFICSIM_APP.game.RoadType.UP_LEFT:
            return worldController.getGameplayScene().getApplication().getModelContainer().getModelByName("road_up_left").clone();
        case TRAFFICSIM_APP.game.RoadType.UP_RIGHT:
            return worldController.getGameplayScene().getApplication().getModelContainer().getModelByName("road_up_right").clone();
        case TRAFFICSIM_APP.game.RoadType.DOWN_LEFT:
            return worldController.getGameplayScene().getApplication().getModelContainer().getModelByName("road_down_left").clone();
        case TRAFFICSIM_APP.game.RoadType.DOWN_RIGHT:
            return worldController.getGameplayScene().getApplication().getModelContainer().getModelByName("road_down_right").clone();
        case TRAFFICSIM_APP.game.RoadType.CROSSROADS:
            return worldController.getGameplayScene().getApplication().getModelContainer().getModelByName("road_crossroads").clone();
    }

    throw new TRAFFICSIM_APP.exceptions.GeneralException("Unknown road type");
};

TRAFFICSIM_APP.game.Road.prototype.getNodePositionsRelativeToRoad = function () {
    /* Returns nodes related to this road. Nodes are just positions that will be connected by routes.
     * Usually nodes are placed at some edge of this road so they act like a connection point between
     * this road's route lines and other roads' route lines.
     *
     * Node position is relative to the parent object's width and height:
     * [0, 0] is the upper left corner, [1, 1] is the lower right corner, [0.5, 0.5] is the center and so on...
     *
     * Node's position in the array determines its "name". For example the first node in the array is node number 0,
     * the second is node 1 etc. */
    switch (this._roadType) {
        case  TRAFFICSIM_APP.game.RoadType.VERTICAL:
            return [
                {
                    "x": 0.27,
                    "y": 0,
                    "z": 0
                },
                {
                    "x": 0.27,
                    "y": 0,
                    "z": 1
                },
                {
                    "x": 0.73,
                    "y": 0,
                    "z": 1
                },
                {
                    "x": 0.73,
                    "y": 0,
                    "z": 0
                }
            ];
        case  TRAFFICSIM_APP.game.RoadType.HORIZONTAL:
            return [
                {
                    "x": 1,
                    "y": 0,
                    "z": 0.27
                },
                {
                    "x": 0,
                    "y": 0,
                    "z": 0.27
                },
                {
                    "x": 0,
                    "y": 0,
                    "z": 0.73
                },
                {
                    "x": 1,
                    "y": 0,
                    "z": 0.73
                }

            ];
        case  TRAFFICSIM_APP.game.RoadType.UP_LEFT:
            return [
                {
                    "x": 0.27,
                    "y": 0,
                    "z": 0
                },
                {
                    "x": 0,
                    "y": 0,
                    "z": 0.27
                },
                {
                    "x": 0,
                    "y": 0,
                    "z": 0.73
                },
                {
                    "x": 0.73,
                    "y": 0,
                    "z": 0
                }

            ];
        case  TRAFFICSIM_APP.game.RoadType.UP_RIGHT:
            return [
                {
                    "x": 0.27,
                    "y": 0,
                    "z": 0
                },
                {
                    "x": 1,
                    "y": 0,
                    "z": 0.73
                },
                {
                    "x": 1,
                    "y": 0,
                    "z": 0.27
                },
                {
                    "x": 0.73,
                    "y": 0,
                    "z": 0
                }

            ];
        case  TRAFFICSIM_APP.game.RoadType.DOWN_LEFT:
            return [
                {
                    "x": 0.73,
                    "y": 0,
                    "z": 1
                },
                {
                    "x": 0,
                    "y": 0,
                    "z": 0.27
                },
                {
                    "x": 0,
                    "y": 0,
                    "z": 0.73
                },
                {
                    "x": 0.27,
                    "y": 0,
                    "z": 1
                }
            ];
        case  TRAFFICSIM_APP.game.RoadType.DOWN_RIGHT:
            return [
                {
                    "x": 1,
                    "y": 0,
                    "z": 0.27
                },
                {
                    "x": 0.27,
                    "y": 0,
                    "z": 1
                },
                {
                    "x": 0.73,
                    "y": 0,
                    "z": 1
                },
                {
                    "x": 1,
                    "y": 0,
                    "z": 0.73
                }
            ];
        case  TRAFFICSIM_APP.game.RoadType.CROSSROADS:
            return [
                // Horizontal lines
                {
                    "x": 1,
                    "y": 0,
                    "z": 0.27
                },
                {
                    "x": 0,
                    "y": 0,
                    "z": 0.27
                },
                {
                    "x": 0,
                    "y": 0,
                    "z": 0.73
                },
                {
                    "x": 1,
                    "y": 0,
                    "z": 0.73
                },
                // Vertical lines
                {
                    "x": 0.27,
                    "y": 0,
                    "z": 0
                },
                {
                    "x": 0.27,
                    "y": 0,
                    "z": 1
                },
                {
                    "x": 0.73,
                    "y": 0,
                    "z": 1
                },
                {
                    "x": 0.73,
                    "y": 0,
                    "z": 0
                },
                // Turning right from bottom
                {
                    "x": 0.73,
                    "y": 0,
                    "z": 1
                },
                {
                    "x": 1,
                    "y": 0,
                    "z": 0.73
                },
                // Turning right from right
                {
                    "x": 1,
                    "y": 0,
                    "z": 0.27
                },
                {
                    "x": 0.73,
                    "y": 0,
                    "z": 0
                },
                // Turning right from top
                {
                    "x": 0.27,
                    "y": 0,
                    "z": 0
                },
                {
                    "x": 0,
                    "y": 0,
                    "z": 0.27
                },
                // Turning right from left
                {
                    "x": 0,
                    "y": 0,
                    "z": 0.73
                },
                {
                    "x": 0.27,
                    "y": 0,
                    "z": 1
                },
                // Turning left from bottom
                {
                    "x": 0.73,
                    "y": 0,
                    "z": 1
                },
                {
                    "x": 0,
                    "y": 0,
                    "z": 0.27
                },
                // Turning left from right
                {
                    "x": 1,
                    "y": 0,
                    "z": 0.27
                },
                {
                    "x": 0.27,
                    "y": 0,
                    "z": 1
                },
                // Turning left from top
                {
                    "x": 0.27,
                    "y": 0,
                    "z": 0
                },
                {
                    "x": 1,
                    "y": 0,
                    "z": 0.73
                },
                // Turning left from left
                {
                    "x": 0,
                    "y": 0,
                    "z": 0.73
                },
                {
                    "x": 0.73,
                    "y": 0,
                    "z": 0
                }
            ];
    }

    return [];
};


TRAFFICSIM_APP.game.Road.prototype.getNodeConnections = function () {
    /* Connections is an array in which each element is a pair of connected nodes.
     * A pair of nodes is presented as an array of two integers.
     * These integers are indexes in an array returned by getNodePositionsRelativeToRoad.
     * For example [[1, 3], [2, 4]] means that there are two connections:
     * nodes 1 and 3 are connected and
     * nodes 2 and 4 are connected.
     *
     * The order of the pairs matters since when creating a route between nodes, the first node is
     * the start node and the second is the end node. This also determines the driving direction. */
    switch (this._roadType) {
        case TRAFFICSIM_APP.game.RoadType.VERTICAL:
            return [
                [0, 1],
                [2, 3]
            ];
        case TRAFFICSIM_APP.game.RoadType.HORIZONTAL:
            return [
                [0, 1],
                [2, 3]
            ];
        case TRAFFICSIM_APP.game.RoadType.UP_LEFT:
            return [
                [0, 1],
                [2, 3]
            ];
        case TRAFFICSIM_APP.game.RoadType.UP_RIGHT:
            return [
                [0, 1],
                [2, 3]
            ];
        case TRAFFICSIM_APP.game.RoadType.DOWN_LEFT:
            return [
                [0, 1],
                [2, 3]
            ];
        case TRAFFICSIM_APP.game.RoadType.DOWN_RIGHT:
            return [
                [0, 1],
                [2, 3]
            ];
        case TRAFFICSIM_APP.game.RoadType.CROSSROADS:
            return [
                // Horizontal lines
                [0, 1],
                [2, 3],
                // Vertical lines
                [4, 5],
                [6, 7],
                // Turning right lines
                [8, 9],
                [10, 11],
                [12, 13],
                [14, 15],
                // Turning left lines
                [16, 17],
                [18, 19],
                [20, 21],
                [22, 23]
            ];
    }

    return [];
};

TRAFFICSIM_APP.game.Road.prototype.getRoadType = function () {
    return this._roadType;
};

TRAFFICSIM_APP.game.Road.prototype.update = function(deltaTime) {
    if (this._trafficLightsController) {{
        this._trafficLightsController.update(deltaTime);
    }}
};
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

    function constructor(worldController) {
        TRAFFICSIM_APP.game.GameplayObject.call(self, worldController, self.resolveRoadModelByType(roadType, worldController));
    }

    constructor(worldController);
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
    /* Returns nodes related to this road. Nodes are just positions that are connected by routes.
     * Usually nodes are placed at some edge of this road so they act like a connection point between
     * this road's route lines and other roads.
     *
     * Node position is relative to the parent object's width and height:
     * [0, 0] is the upper left corner, [1, 1] is the lower right corner, [0.5, 0.5] is the center and so on...
     *
     * Node's position in the array determines its "name". For example the first node in the array is node number 0,
     * the second is node 1 etc.
     */
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
                    "z": 0
                },

                {
                    "x": 0.73,
                    "y": 0,
                    "z": 1
                }
            ];
        case  TRAFFICSIM_APP.game.RoadType.HORIZONTAL:
            return [
                {
                    "x": 0,
                    "y": 0,
                    "z": 0.27
                },
                {
                    "x": 1,
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
                    "x": 0.73,
                    "y": 0,
                    "z": 0
                },
                {
                    "x": 0,
                    "y": 0,
                    "z": 0.73
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
                    "x": 0.73,
                    "y": 0,
                    "z": 0
                },
                {
                    "x": 1,
                    "y": 0,
                    "z": 0.27
                }
            ];
        case  TRAFFICSIM_APP.game.RoadType.DOWN_LEFT:
            return [
                {
                    "x": 0,
                    "y": 0,
                    "z": 0.27
                },
                {
                    "x": 0.73,
                    "y": 0,
                    "z": 1
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
                    "x": 0.27,
                    "y": 0,
                    "z": 1
                },
                {
                    "x": 1,
                    "y": 0,
                    "z": 0.27
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
                {
                    "x": 0,
                    "y": 0,
                    "z": 0.27
                },
                {
                    "x": 1,
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
    }

    return [];
};


TRAFFICSIM_APP.game.Road.prototype.getNodeConnections = function () {
    /* Connections is an array in which each element is a pair of connected nodes.
     * A pair of nodes is presented as an array of two integers.
     * These integers are indexes in an array returned by getNodePositionsRelativeToRoad.
     * For example [[1, 3], [2, 4]] means that there are two connections:
     * nodes 1 and 3 are connected and
     * nodes 2 and 4 are connected. */
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
                [0, 1],
                [2, 3]
            ];
    }

    return [];
};

TRAFFICSIM_APP.game.Road.prototype.getRoadType = function () {
    return this._roadType;
};
(function () {
    // Road is a physical road cell in the grid

    TRAFFICSIM_APP.game = TRAFFICSIM_APP.game || {};
    TRAFFICSIM_APP.game.road = TRAFFICSIM_APP.game.road || {};

    var NS = TRAFFICSIM_APP.game.road;
    var logger = TRAFFICSIM_APP.utils.logger;

    NS.RoadType = {
        "HORIZONTAL": 1,
        "VERTICAL": 2,
        "UP_LEFT": 3,
        "UP_RIGHT": 4,
        "DOWN_LEFT": 5,
        "DOWN_RIGHT": 6,
        "CROSSROADS": 7,
        "DOWN_LEFT_RIGHT": 8,
        "UP_LEFT_DOWN": 9,
        "UP_LEFT_RIGHT": 10,
        "UP_RIGHT_DOWN": 11,
        "UP_END": 12,
        "RIGHT_END": 13,
        "LEFT_END": 14,
        "DOWN_END": 15
    };

    NS.Road = function (worldController, roadType, position) {
        TRAFFICSIM_APP.game.gameplay_object.GameplayObject.call(this, worldController, this.resolveRoadModelByType(roadType, worldController));

        this.setPosition(position);
        this._worldController = worldController;
        this._roadType = roadType;
        this._trafficLightsController = null;
        this._routes = [];

        if (roadType == NS.RoadType.CROSSROADS
        || roadType == NS.RoadType.UP_LEFT_DOWN
        || roadType == NS.RoadType.UP_RIGHT_DOWN
        || roadType == NS.RoadType.UP_LEFT_RIGHT
        || roadType == NS.RoadType.DOWN_LEFT_RIGHT) {
            this._trafficLightsController = new TRAFFICSIM_APP.game.TrafficLightsController(this);
        }
    };

    NS.Road.prototype = Object.create(TRAFFICSIM_APP.game.gameplay_object.GameplayObject.prototype);

    NS.Road.prototype.resolveRoadModelByType = function (roadType, worldController) {
        switch (roadType) {
            case NS.RoadType.VERTICAL:
                return worldController.getGameplayScene().getApplication().getModelContainer().getModelByName("road_vertical").clone();
            case NS.RoadType.HORIZONTAL:
                return worldController.getGameplayScene().getApplication().getModelContainer().getModelByName("road_horizontal").clone();
            case NS.RoadType.UP_LEFT:
                return worldController.getGameplayScene().getApplication().getModelContainer().getModelByName("road_up_left").clone();
            case NS.RoadType.UP_RIGHT:
                return worldController.getGameplayScene().getApplication().getModelContainer().getModelByName("road_up_right").clone();
            case NS.RoadType.DOWN_LEFT:
                return worldController.getGameplayScene().getApplication().getModelContainer().getModelByName("road_down_left").clone();
            case NS.RoadType.DOWN_RIGHT:
                return worldController.getGameplayScene().getApplication().getModelContainer().getModelByName("road_down_right").clone();
            case NS.RoadType.CROSSROADS:
                return worldController.getGameplayScene().getApplication().getModelContainer().getModelByName("road_crossroads").clone();
            case NS.RoadType.UP_RIGHT_DOWN:
                return worldController.getGameplayScene().getApplication().getModelContainer().getModelByName("road_up_right_down").clone();
            case NS.RoadType.UP_LEFT_DOWN:
                return worldController.getGameplayScene().getApplication().getModelContainer().getModelByName("road_up_left_down").clone();
            case NS.RoadType.UP_LEFT_RIGHT:
                return worldController.getGameplayScene().getApplication().getModelContainer().getModelByName("road_up_left_right").clone();
            case NS.RoadType.DOWN_LEFT_RIGHT:
                return worldController.getGameplayScene().getApplication().getModelContainer().getModelByName("road_down_left_right").clone();
            case NS.RoadType.UP_END:
                return worldController.getGameplayScene().getApplication().getModelContainer().getModelByName("road_up_end").clone();
            case NS.RoadType.RIGHT_END:
                return worldController.getGameplayScene().getApplication().getModelContainer().getModelByName("road_right_end").clone();
            case NS.RoadType.LEFT_END:
                return worldController.getGameplayScene().getApplication().getModelContainer().getModelByName("road_left_end").clone();
            case NS.RoadType.DOWN_END:
                return worldController.getGameplayScene().getApplication().getModelContainer().getModelByName("road_down_end").clone();
        }

        var errorMessage = "Unknown road type: " + roadType;
        logger.log(logger.LogType.ERROR, errorMessage);
        throw new TRAFFICSIM_APP.exceptions.GeneralException(errorMessage);
    };

    /** Returns nodes related to this road. Nodes are just positions that will be connected by routes.
     * Usually nodes are placed at some edge of this road so they act like a connection point between
     * this road's route lines and other roads' route lines.
     *
     * Node position is relative to the parent object's width and height:
     * [0, 0] is the upper left corner, [1, 1] is the lower right corner, [0.5, 0.5] is the center and so on...
     *
     * Node's position in the array determines its "name". For example the first node in the array is node number 0,
     * the second is node 1 etc. */
    NS.Road.prototype.getNodePositionsRelativeToRoad = function () {
        switch (this._roadType) {
            case NS.RoadType.VERTICAL:
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
            case NS.RoadType.HORIZONTAL:
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
            case NS.RoadType.UP_LEFT:
                return [
                    { // Inner
                        "x": 0.27,
                        "y": 0,
                        "z": 0
                    },
                    {
                        "x": 0,
                        "y": 0,
                        "z": 0.27
                    }, // Outer
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
            case NS.RoadType.UP_RIGHT:
                return [
                    { // Outer
                        "x": 0.27,
                        "y": 0,
                        "z": 0
                    },
                    {
                        "x": 1,
                        "y": 0,
                        "z": 0.73
                    }, // Inner
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
            case NS.RoadType.DOWN_LEFT:
                return [
                    { // Outer
                        "x": 0.73,
                        "y": 0,
                        "z": 1
                    },
                    {
                        "x": 0,
                        "y": 0,
                        "z": 0.27
                    },
                    { // Inner
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
            case NS.RoadType.DOWN_RIGHT:
                return [
                    { // Outer
                        "x": 1,
                        "y": 0,
                        "z": 0.27
                    },
                    {
                        "x": 0.27,
                        "y": 0,
                        "z": 1
                    },
                    { // Inner
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
            case NS.RoadType.CROSSROADS:
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
            case NS.RoadType.UP_LEFT_DOWN:
                return [
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
            case NS.RoadType.UP_LEFT_RIGHT:
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
            case NS.RoadType.UP_RIGHT_DOWN:
                return [
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
                    }
                ];
            case NS.RoadType.DOWN_LEFT_RIGHT:
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
                    }
                ];
            case NS.RoadType.DOWN_END:
                return [
                    {
                        "x": 0.27,
                        "y": 0,
                        "z": 0
                    },
                    {
                        "x": 0.5,
                        "y": 0,
                        "z": 0.73
                    },
                    {
                        "x": 0.73,
                        "y": 0,
                        "z": 0
                    }
                ];
            case NS.RoadType.UP_END:
                return [
                    {
                        "x": 0.73,
                        "y": 0,
                        "z": 1
                    },
                    {
                        "x": 0.5,
                        "y": 0,
                        "z": 0
                    },
                    {
                        "x": 0.27,
                        "y": 0,
                        "z": 1
                    }
                ];
            case NS.RoadType.LEFT_END:
                return [
                    {
                        "x": 1,
                        "y": 0,
                        "z": 0.27
                    },
                    {
                        "x": 0.27,
                        "y": 0,
                        "z": 0.5
                    },
                    {
                        "x": 1,
                        "y": 0,
                        "z": 0.73
                    }
                ];
            case NS.RoadType.RIGHT_END:
                return [
                    {
                        "x": 0,
                        "y": 0,
                        "z": 0.73
                    },
                    {
                        "x": 0.73,
                        "y": 0,
                        "z": 0.5
                    },
                    {
                        "x": 0,
                        "y": 0,
                        "z": 0.27
                    }
                ];
        }

        return [];
    };

    /** Connections are presented as array of maps.
     * Each map contains the connection's starting and ending node's index in array
     * returned by getNodePositionsRelativeToRoad.
     *
     * The connection may also contain control points if the connection is bezier curve. */
    NS.Road.prototype.getNodeConnections = function () {
        switch (this._roadType) {
            case NS.RoadType.VERTICAL:
                return [
                    {
                        "start": 0,
                        "end": 1
                    },
                    {
                        "start": 2,
                        "end": 3
                    }
                ];
            case NS.RoadType.HORIZONTAL:
                return [
                    {
                        "start": 0,
                        "end": 1
                    },
                    {
                        "start": 2,
                        "end": 3
                    }
                ];
            case NS.RoadType.UP_LEFT:
                return [
                    { // Inner
                        "start": 0,
                        "end": 1,
                        "controlPoints": [
                            {
                                "x": 0.27,
                                "y": 0,
                                "z": 0.27
                            },
                            {
                                "x": 0.27,
                                "y": 0,
                                "z": 0.27
                            }
                        ]
                    },
                    { // Outer
                        "start": 2,
                        "end": 3,
                        "controlPoints": [
                            {
                                "x": 0.73,
                                "y": 0,
                                "z": 0.73
                            },
                            {
                                "x": 0.73,
                                "y": 0,
                                "z": 0.73
                            }
                        ]
                    }
                ];
            case NS.RoadType.UP_RIGHT:
                return [
                    { // Outer
                        "start": 0,
                        "end": 1,
                        "controlPoints": [
                            {
                                "x": 0.27,
                                "y": 0,
                                "z": 0.73
                            },
                            {
                                "x": 0.27,
                                "y": 0,
                                "z": 0.73
                            }
                        ]
                    },
                    {  // Inner
                        "start": 2,
                        "end": 3,
                        "controlPoints": [
                            {
                                "x": 0.73,
                                "y": 0,
                                "z": 0.27
                            },
                            {
                                "x": 0.73,
                                "y": 0,
                                "z": 0.27
                            }
                        ]
                    }
                ];
            case NS.RoadType.DOWN_LEFT:
                return [
                    { // Outer
                        "start": 0,
                        "end": 1,
                        "controlPoints": [
                            {
                                "x": 0.73,
                                "y": 0,
                                "z": 0.27
                            },
                            {
                                "x": 0.73,
                                "y": 0,
                                "z": 0.27
                            }
                        ]
                    },
                    { // Inner
                        "start": 2,
                        "end": 3,
                        "controlPoints": [
                            {
                                "x": 0.27,
                                "y": 0,
                                "z": 0.73
                            },
                            {
                                "x": 0.27,
                                "y": 0,
                                "z": 0.73
                            }
                        ]
                    }
                ];
            case NS.RoadType.DOWN_RIGHT:
                return [
                    { // Outer
                        "start": 0,
                        "end": 1,
                        "controlPoints": [
                            {
                                "x": 0.27,
                                "y": 0,
                                "z": 0.27
                            },
                            {
                                "x": 0.27,
                                "y": 0,
                                "z": 0.27
                            }
                        ]
                    },
                    { // Inner
                        "start": 2,
                        "end": 3,
                        "controlPoints": [
                            {
                                "x": 0.73,
                                "y": 0,
                                "z": 0.73
                            },
                            {
                                "x": 0.73,
                                "y": 0,
                                "z": 0.73
                            }
                        ]
                    }
                ];
            case NS.RoadType.CROSSROADS:
                return [
                    // Horizontal lines
                    {
                        "id": "from-right-to-left",
                        "start": 0,
                        "end": 1
                    },
                    {
                        "id": "from-left-to-right",
                        "start": 2,
                        "end": 3
                    },
                    // Vertical lines
                    {
                        "id": "from-top-to-bottom",
                        "start": 4,
                        "end": 5
                    },
                    {
                        "id": "from-bottom-to-top",
                        "start": 6,
                        "end": 7
                    },
                    // Turning right lines
                    {
                        "id": "from-bottom-to-right",
                        "start": 8,
                        "end": 9,
                        "controlPoints": [
                            {
                                "x": 0.73,
                                "y": 0,
                                "z": 0.73
                            },
                            {
                                "x": 0.73,
                                "y": 0,
                                "z": 0.73
                            }
                        ]
                    },
                    {
                        "id": "from-right-to-top",
                        "start": 10,
                        "end": 11,
                        "controlPoints": [
                            {
                                "x": 0.73,
                                "y": 0,
                                "z": 0.27
                            },
                            {
                                "x": 0.73,
                                "y": 0,
                                "z": 0.27
                            }
                        ]
                    },
                    {
                        "id": "from-top-to-left",
                        "start": 12,
                        "end": 13,
                        "controlPoints": [
                            {
                                "x": 0.27,
                                "y": 0,
                                "z": 0.27
                            },
                            {
                                "x": 0.27,
                                "y": 0,
                                "z": 0.27
                            }
                        ]
                    },
                    {
                        "id": "from-left-to-bottom",
                        "start": 14,
                        "end": 15,
                        "controlPoints": [
                            {
                                "x": 0.27,
                                "y": 0,
                                "z": 0.73
                            },
                            {
                                "x": 0.27,
                                "y": 0,
                                "z": 0.73
                            }
                        ]
                    },
                    // Turning left lines
                    {
                        "id": "from-bottom-to-left",
                        "start": 16,
                        "end": 17,
                        "controlPoints": [
                            {
                                "x": 0.73,
                                "y": 0,
                                "z": 0.27
                            },
                            {
                                "x": 0.73,
                                "y": 0,
                                "z": 0.27
                            }
                        ]
                    },
                    {
                        "id": "from-right-to-bottom",
                        "start": 18,
                        "end": 19,
                        "controlPoints": [
                            {
                                "x": 0.27,
                                "y": 0,
                                "z": 0.27
                            },
                            {
                                "x": 0.27,
                                "y": 0,
                                "z": 0.27
                            }
                        ]
                    },
                    {
                        "id": "from-top-to-right",
                        "start": 20,
                        "end": 21,
                        "controlPoints": [
                            {
                                "x": 0.27,
                                "y": 0,
                                "z": 0.73
                            },
                            {
                                "x": 0.27,
                                "y": 0,
                                "z": 0.73
                            }
                        ]
                    },
                    {
                        "id": "from-left-to-top",
                        "start": 22,
                        "end": 23,
                        "controlPoints": [
                            {
                                "x": 0.73,
                                "y": 0,
                                "z": 0.73
                            },
                            {
                                "x": 0.73,
                                "y": 0,
                                "z": 0.73
                            }
                        ]
                    }
                ];
            case NS.RoadType.UP_LEFT_DOWN:
                return [
                    // Vertical lines
                    {
                        "id": "from-top-to-bottom",
                        "start": 0,
                        "end": 1
                    },
                    {
                        "id": "from-bottom-to-top",
                        "start": 2,
                        "end": 3
                    },
                    // Turning right lines
                    {
                        "id": "from-top-to-left",
                        "start": 4,
                        "end": 5,
                        "controlPoints": [
                            {
                                "x": 0.27,
                                "y": 0,
                                "z": 0.27
                            },
                            {
                                "x": 0.27,
                                "y": 0,
                                "z": 0.27
                            }
                        ]
                    },
                    {
                        "id": "from-left-to-bottom",
                        "start": 6,
                        "end": 7,
                        "controlPoints": [
                            {
                                "x": 0.27,
                                "y": 0,
                                "z": 0.73
                            },
                            {
                                "x": 0.27,
                                "y": 0,
                                "z": 0.73
                            }
                        ]
                    },
                    // Turning left lines
                    {
                        "id": "from-bottom-to-left",
                        "start": 8,
                        "end": 9,
                        "controlPoints": [
                            {
                                "x": 0.73,
                                "y": 0,
                                "z": 0.27
                            },
                            {
                                "x": 0.73,
                                "y": 0,
                                "z": 0.27
                            }
                        ]
                    },
                    {
                        "id": "from-left-to-top",
                        "start": 10,
                        "end": 11,
                        "controlPoints": [
                            {
                                "x": 0.73,
                                "y": 0,
                                "z": 0.73
                            },
                            {
                                "x": 0.73,
                                "y": 0,
                                "z": 0.73
                            }
                        ]
                    }
                ];
            case NS.RoadType.UP_LEFT_RIGHT:
                return [
                    // Horizontal lines
                    {
                        "id": "from-right-to-left",
                        "start": 0,
                        "end": 1
                    },
                    {
                        "id": "from-left-to-right",
                        "start": 2,
                        "end": 3
                    },
                    // Turning right lines
                    {
                        "id": "from-right-to-top",
                        "start": 4,
                        "end": 5,
                        "controlPoints": [
                            {
                                "x": 0.73,
                                "y": 0,
                                "z": 0.27
                            },
                            {
                                "x": 0.73,
                                "y": 0,
                                "z": 0.27
                            }
                        ]
                    },
                    {
                        "id": "from-top-to-left",
                        "start": 6,
                        "end": 7,
                        "controlPoints": [
                            {
                                "x": 0.27,
                                "y": 0,
                                "z": 0.27
                            },
                            {
                                "x": 0.27,
                                "y": 0,
                                "z": 0.27
                            }
                        ]
                    },
                    // Turning left lines
                    {
                        "id": "from-top-to-right",
                        "start": 8,
                        "end": 9,
                        "controlPoints": [
                            {
                                "x": 0.27,
                                "y": 0,
                                "z": 0.73
                            },
                            {
                                "x": 0.27,
                                "y": 0,
                                "z": 0.73
                            }
                        ]
                    },
                    {
                        "id": "from-left-to-top",
                        "start": 10,
                        "end": 11,
                        "controlPoints": [
                            {
                                "x": 0.73,
                                "y": 0,
                                "z": 0.73
                            },
                            {
                                "x": 0.73,
                                "y": 0,
                                "z": 0.73
                            }
                        ]
                    }
                ];
            case NS.RoadType.UP_RIGHT_DOWN:
                return [
                    // Vertical lines
                    {
                        "id": "from-top-to-bottom",
                        "start": 0,
                        "end": 1
                    },
                    {
                        "id": "from-bottom-to-top",
                        "start": 2,
                        "end": 3
                    },
                    // Turning right lines
                    {
                        "id": "from-bottom-to-right",
                        "start": 4,
                        "end": 5,
                        "controlPoints": [
                            {
                                "x": 0.73,
                                "y": 0,
                                "z": 0.73
                            },
                            {
                                "x": 0.73,
                                "y": 0,
                                "z": 0.73
                            }
                        ]
                    },
                    {
                        "id": "from-right-to-top",
                        "start": 6,
                        "end": 7,
                        "controlPoints": [
                            {
                                "x": 0.73,
                                "y": 0,
                                "z": 0.27
                            },
                            {
                                "x": 0.73,
                                "y": 0,
                                "z": 0.27
                            }
                        ]
                    },
                    // Turning left lines
                    {
                        "id": "from-right-to-bottom",
                        "start": 8,
                        "end": 9,
                        "controlPoints": [
                            {
                                "x": 0.27,
                                "y": 0,
                                "z": 0.27
                            },
                            {
                                "x": 0.27,
                                "y": 0,
                                "z": 0.27
                            }
                        ]
                    },
                    {
                        "id": "from-top-to-right",
                        "start": 10,
                        "end": 11,
                        "controlPoints": [
                            {
                                "x": 0.27,
                                "y": 0,
                                "z": 0.73
                            },
                            {
                                "x": 0.27,
                                "y": 0,
                                "z": 0.73
                            }
                        ]
                    }
                ];
            case NS.RoadType.DOWN_LEFT_RIGHT:
                return [
                    // Horizontal lines
                    {
                        "id": "from-right-to-left",
                        "start": 0,
                        "end": 1
                    },
                    {
                        "id": "from-left-to-right",
                        "start": 2,
                        "end": 3
                    },
                    // Turning right lines
                    {
                        "id": "from-bottom-to-right",
                        "start": 4,
                        "end": 5,
                        "controlPoints": [
                            {
                                "x": 0.73,
                                "y": 0,
                                "z": 0.73
                            },
                            {
                                "x": 0.73,
                                "y": 0,
                                "z": 0.73
                            }
                        ]
                    },
                    {
                        "id": "from-left-to-bottom",
                        "start": 6,
                        "end": 7,
                        "controlPoints": [
                            {
                                "x": 0.27,
                                "y": 0,
                                "z": 0.73
                            },
                            {
                                "x": 0.27,
                                "y": 0,
                                "z": 0.73
                            }
                        ]
                    },
                    // Turning left lines
                    {
                        "id": "from-bottom-to-left",
                        "start": 8,
                        "end": 9,
                        "controlPoints": [
                            {
                                "x": 0.73,
                                "y": 0,
                                "z": 0.27
                            },
                            {
                                "x": 0.73,
                                "y": 0,
                                "z": 0.27
                            }
                        ]
                    },
                    {
                        "id": "from-right-to-bottom",
                        "start": 10,
                        "end": 11,
                        "controlPoints": [
                            {
                                "x": 0.27,
                                "y": 0,
                                "z": 0.27
                            },
                            {
                                "x": 0.27,
                                "y": 0,
                                "z": 0.27
                            }
                        ]
                    }
                ];
            case NS.RoadType.DOWN_END:
                return [
                    {
                        "start": 0,
                        "end": 1,
                        "controlPoints": [
                            {
                                "x": 0.27,
                                "y": 0,
                                "z": 0.73
                            },
                            {
                                "x": 0.27,
                                "y": 0,
                                "z": 0.73
                            }
                        ]
                    },
                    {
                        "start": 1,
                        "end": 2,
                        "controlPoints": [
                            {
                                "x": 0.73,
                                "y": 0,
                                "z": 0.73
                            },
                            {
                                "x": 0.73,
                                "y": 0,
                                "z": 0.73
                            }
                        ]
                    }
                ];
            case NS.RoadType.UP_END:
                return [
                    {
                        "start": 0,
                        "end": 1,
                        "controlPoints": [
                            {
                                "x": 0.73,
                                "y": 0,
                                "z": 0.27
                            },
                            {
                                "x": 0.73,
                                "y": 0,
                                "z": 0.27
                            }
                        ]
                    },
                    {
                        "start": 1,
                        "end": 2,
                        "controlPoints": [
                            {
                                "x": 0.27,
                                "y": 0,
                                "z": 0.27
                            },
                            {
                                "x": 0.27,
                                "y": 0,
                                "z": 0.27
                            }
                        ]
                    }
                ];
            case NS.RoadType.RIGHT_END:
                return [
                    {
                        "start": 0,
                        "end": 1,
                        "controlPoints": [
                            {
                                "x": 0.73,
                                "y": 0,
                                "z": 0.73
                            },
                            {
                                "x": 0.73,
                                "y": 0,
                                "z": 0.73
                            }
                        ]
                    },
                    {
                        "start": 1,
                        "end": 2,
                        "controlPoints": [
                            {
                                "x": 0.73,
                                "y": 0,
                                "z": 0.27
                            },
                            {
                                "x": 0.73,
                                "y": 0,
                                "z": 0.27
                            }
                        ]
                    }
                ];
            case NS.RoadType.LEFT_END:
                return [
                    {
                        "start": 0,
                        "end": 1,
                        "controlPoints": [
                            {
                                "x": 0.27,
                                "y": 0,
                                "z": 0.27
                            },
                            {
                                "x": 0.27,
                                "y": 0,
                                "z": 0.27
                            }
                        ]
                    },
                    {
                        "start": 1,
                        "end": 2,
                        "controlPoints": [
                            {
                                "x": 0.27,
                                "y": 0,
                                "z": 0.73
                            },
                            {
                                "x": 0.27,
                                "y": 0,
                                "z": 0.73
                            }
                        ]
                    }
                ];
        }

        return [];
    };

    NS.Road.prototype.getRoadType = function () {
        return this._roadType;
    };

    NS.Road.prototype.setRoutes = function (routes) {
        this._routes = routes;
    };

    NS.Road.prototype.getRoutes = function () {
        return this._routes;
    };

    NS.Road.prototype.update = function () {
        if (this._trafficLightsController) {
            this._trafficLightsController.update();
        }
    };

    NS.Road.prototype.die = function() {
        TRAFFICSIM_APP.game.gameplay_object.GameplayObject.prototype.die.call(this);

        // Remove routes
        var vehicles = this._worldController.getVehicleController().getVehicles();
        var routes = this._worldController.getRoadController().getRoutes();
        this._routes.forEach(function(route) {
            route.startNode.removeConnectedRoute(route);
            route.endNode.removeConnectedRoute(route);

            vehicles.forEach(function(vehicle) {
               vehicle.notifyRouteRemoved(route);
            });

            var index = routes.indexOf(route);
            if (index > -1) {
                routes.splice(index, 1);
            }
        });

        // Remove possible traffic lights
        if (this._trafficLightsController) {
            this._trafficLightsController.getTrafficLights().forEach(function(trafficLight) {
                trafficLight.die();
            })
        }

        // Remove road
        var roads = this._worldController.getRoadController().getRoads();
        var index = roads.indexOf(this);
        if (index > -1) {
            roads.splice(index, 1);
        }
    };

    NS.Road.prototype.getWorldController = function () {
        return this._worldController;
    }
})();
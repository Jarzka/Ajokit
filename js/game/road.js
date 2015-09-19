(function() {
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
        this._worldController = worldController;
        this._roadType = roadType;
        this._trafficLightsController = null;
        this._routes = [];

        TRAFFICSIM_APP.game.GameplayObject.call(this, worldController, this.resolveRoadModelByType(roadType, worldController));

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
            case TRAFFICSIM_APP.game.RoadType.VERTICAL:
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
            case TRAFFICSIM_APP.game.RoadType.HORIZONTAL:
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
            case TRAFFICSIM_APP.game.RoadType.UP_LEFT:
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
            case TRAFFICSIM_APP.game.RoadType.UP_RIGHT:
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
            case TRAFFICSIM_APP.game.RoadType.DOWN_LEFT:
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
            case TRAFFICSIM_APP.game.RoadType.DOWN_RIGHT:
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
            case TRAFFICSIM_APP.game.RoadType.CROSSROADS:
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
        /* Connections are presented as array of maps.
         * Each map contains the connection's starting and ending node's index in array
         * returned by getNodePositionsRelativeToRoad.
         *
         * The connection may also contain control points if the connection is bezier curve. */
        switch (this._roadType) {
            case TRAFFICSIM_APP.game.RoadType.VERTICAL:
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
            case TRAFFICSIM_APP.game.RoadType.HORIZONTAL:
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
            case TRAFFICSIM_APP.game.RoadType.UP_LEFT:
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
            case TRAFFICSIM_APP.game.RoadType.UP_RIGHT:
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
            case TRAFFICSIM_APP.game.RoadType.DOWN_LEFT:
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
            case TRAFFICSIM_APP.game.RoadType.DOWN_RIGHT:
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
            case TRAFFICSIM_APP.game.RoadType.CROSSROADS:
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
        }

        return [];
    };

    TRAFFICSIM_APP.game.Road.prototype.getRoadType = function () {
        return this._roadType;
    };

    TRAFFICSIM_APP.game.Road.prototype.setRoutes = function (routes) {
        this._routes = routes;
    };

    TRAFFICSIM_APP.game.Road.prototype.getRoutes = function () {
        return this._routes;
    };

    TRAFFICSIM_APP.game.Road.prototype.update = function() {
        if (this._trafficLightsController) {{
            this._trafficLightsController.update();
        }}
    };

    TRAFFICSIM_APP.game.Road.prototype.getWorldController = function() {
        return this._worldController;
    }
})();
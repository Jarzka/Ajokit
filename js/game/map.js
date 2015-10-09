(function() {
    TRAFFICSIM_APP.game = TRAFFICSIM_APP.game || {};
    TRAFFICSIM_APP.game.map = TRAFFICSIM_APP.game.map || {};

    TRAFFICSIM_APP.game.map.Map = function () {
        var TILE_SIZE = 8; // Measured in meters in real world

        /* Map object types:
         * Q = Road up left
         * E = Road up right
         * W = Road down left
         * R = Road bottom right
         * T = Road horizontal
         * Y = Road vertical
         * I = Crossroads
         * O = Road down left right
         * P = Road up left down
         * S = Road up left right
         * A = Road up right down
         * D = Road up end
         * F = Road down end
         * G = Road left end
         * H = Road right end
         *   = Nothing
         * X = Road type calculated automatically
         */
        var map =
            "             \n" +
            "  XXXXXXXXXX \n" +
            " XX X  X   X \n" +
            " X  X  X  XX \n" +
            " X  XXXXXXX  \n" +
            " X  X  X  X  \n" +
            " XX X XX  X  \n" +
            "  XXXXX   XX \n" +
            "             ";

        this.getWidth = function () {
            var highest = 0;
            var lines = map.split("\n");
            for (var i = 0; i < lines.length; i++) {
                highest = Math.max(lines[i].length, highest);
            }

            return highest * this.getTileSize();
        };

        this.getNumberOfColumns = function() {
            var highest = 0;
            var lines = map.split("\n");
            for (var i = 0; i < lines.length; i++) {
                highest = Math.max(lines[i].length, highest);
            }

            return highest;
        };

        this.getHeight = function () {
            return map.split("\n").length * this.getTileSize();
        };

        this.getNumberOfRows = function () {
            return map.split("\n").length;
        };

        this.insertObjectToLocation = function(id, row, column) {
            var rows = map.split("\n");
            rows[row] = rows[row].substr(0, column) + id + rows[row].substr(column + id.length); // Replace object in row
            map = rows.join("\n");
        };

        this.convertMouseCoordinateToRowAndColumn = function (mouseX, mouseZ) {
            var row = Math.floor(mouseZ / this.getTileSize());
            var column = Math.floor(mouseX / this.getTileSize());

            if (row >= 0
                && row <= this.getNumberOfRows()
                && column >= 0
                && column <= this.getNumberOfColumns()) {
                return {
                    "row": row,
                    "column": column
                };
            }

            return null;
        };

        this.getTileSize = function () {
            return TILE_SIZE;
        };

        this.getMapAsString = function () {
            return map;
        };

        this.getMapAsArray = function () {
            return map.split("\n");
        };

        this.isRoad = function (objectType) {
            if (objectType === '') {
                return false;
            }

            var roadTypes = "QEWRTYIOPSADFGHX";
            return roadTypes.indexOf(objectType) !== -1;
        };

        /* Returns object type in the given position. If object is not found, returns '' */
        this.getObjectTypeAtPosition = function (lineIndex, columnIndex) {
            var line = this.getMapAsArray()[lineIndex];
            if (line) {
                var column = line[columnIndex];

                if (column) {
                    return column;
                }
            }

            return null;
        };

        this.resolveRoadType = function(lineIndex, columnIndex) {
            // Crossroads
            if (this.isRoad(this.getObjectTypeAtPosition(lineIndex - 1, columnIndex))
                && this.isRoad(this.getObjectTypeAtPosition(lineIndex + 1, columnIndex))
                && this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex + 1))
                && this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex - 1))) {
                return TRAFFICSIM_APP.game.road.RoadType.CROSSROADS;
            }

            // Down left right
            if (this.isRoad(this.getObjectTypeAtPosition(lineIndex + 1, columnIndex))
                && this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex + 1))
                && this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex - 1))) {
                return TRAFFICSIM_APP.game.road.RoadType.DOWN_LEFT_RIGHT;
            }

            // Up left down
            if (this.isRoad(this.getObjectTypeAtPosition(lineIndex - 1, columnIndex))
                && this.isRoad(this.getObjectTypeAtPosition(lineIndex + 1, columnIndex))
                && this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex - 1))) {
                return TRAFFICSIM_APP.game.road.RoadType.UP_LEFT_DOWN;
            }

            // Up left right
            if (this.isRoad(this.getObjectTypeAtPosition(lineIndex - 1, columnIndex))
                && this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex + 1))
                && this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex - 1))) {
                return TRAFFICSIM_APP.game.road.RoadType.UP_LEFT_RIGHT;
            }

            // Up right down
            if (this.isRoad(this.getObjectTypeAtPosition(lineIndex - 1, columnIndex))
                && this.isRoad(this.getObjectTypeAtPosition(lineIndex + 1, columnIndex))
                && this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex + 1))) {
                return TRAFFICSIM_APP.game.road.RoadType.UP_RIGHT_DOWN;
            }

            // Vertical road
            if (this.isRoad(this.getObjectTypeAtPosition(lineIndex - 1, columnIndex))
                && this.isRoad(this.getObjectTypeAtPosition(lineIndex + 1, columnIndex))) {
                return TRAFFICSIM_APP.game.road.RoadType.VERTICAL;
            }

            // Horizontal road
            if (this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex - 1))
                && this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex + 1))) {
                return TRAFFICSIM_APP.game.road.RoadType.HORIZONTAL;
            }

            // Up right
            if (this.isRoad(this.getObjectTypeAtPosition(lineIndex - 1, columnIndex))
                && this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex + 1))) {
                return TRAFFICSIM_APP.game.road.RoadType.UP_RIGHT;
            }

            // Up left
            if (this.isRoad(this.getObjectTypeAtPosition(lineIndex - 1, columnIndex))
                && this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex - 1))) {
                return TRAFFICSIM_APP.game.road.RoadType.UP_LEFT;
            }

            // Down right
            if (this.isRoad(this.getObjectTypeAtPosition(lineIndex + 1, columnIndex))
                && this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex + 1))) {
                return TRAFFICSIM_APP.game.road.RoadType.DOWN_RIGHT;
            }

            // Down left
            if (this.isRoad(this.getObjectTypeAtPosition(lineIndex + 1, columnIndex))
                && this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex - 1))) {
                return TRAFFICSIM_APP.game.road.RoadType.DOWN_LEFT;
            }

            // Up end
            if (!this.isRoad(this.getObjectTypeAtPosition(lineIndex - 1, columnIndex))
                && this.isRoad(this.getObjectTypeAtPosition(lineIndex + 1, columnIndex))
                && !this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex + 1))
                && !this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex - 1))) {
                return TRAFFICSIM_APP.game.road.RoadType.UP_END;
            }

            // Right end
            if (!this.isRoad(this.getObjectTypeAtPosition(lineIndex - 1, columnIndex))
                && !this.isRoad(this.getObjectTypeAtPosition(lineIndex + 1, columnIndex))
                && !this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex + 1))
                && this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex - 1))) {
                return TRAFFICSIM_APP.game.road.RoadType.RIGHT_END;
            }

            // Down end
            if (this.isRoad(this.getObjectTypeAtPosition(lineIndex - 1, columnIndex))
                && !this.isRoad(this.getObjectTypeAtPosition(lineIndex + 1, columnIndex))
                && !this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex + 1))
                && !this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex - 1))) {
                return TRAFFICSIM_APP.game.road.RoadType.DOWN_END;
            }

            // Left end
            if (!this.isRoad(this.getObjectTypeAtPosition(lineIndex - 1, columnIndex))
                && !this.isRoad(this.getObjectTypeAtPosition(lineIndex + 1, columnIndex))
                && this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex + 1))
                && !this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex - 1))) {
                return TRAFFICSIM_APP.game.road.RoadType.LEFT_END;
            }

            return TRAFFICSIM_APP.game.road.RoadType.HORIZONTAL; // Default type
        }
    };
})();
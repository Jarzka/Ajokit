TRAFFICSIM_APP.game = TRAFFICSIM_APP.game || {};

TRAFFICSIM_APP.game.Map = function () {
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
        " XXXXXXXX  X \n" +
        " X X   X X X \n" +
        " XXXXXXXXX X \n" +
        " X   X X X X \n" +
        " X XXX XXXXX \n" +
        " XXX   X X X \n" +
        "  X  XXXXX X \n" +
        "           ";

    this.getWidth = function () {
        var highest = 0;
        var lines = map.split("\n");
        for (var i = 0; i < lines.length; i++) {
            highest = Math.max(lines[i].length, highest);
        }

        return highest * this.getTileSize();
    };

    this.getHeight = function () {
        return map.split("\n").length * this.getTileSize();
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

        var roadTypes = "QWERTYIX";
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

        return '';
    };

    this.resolveRoadType = function(lineIndex, columnIndex) {
        // Crossroads
        if (this.isRoad(this.getObjectTypeAtPosition(lineIndex - 1, columnIndex))
            && this.isRoad(this.getObjectTypeAtPosition(lineIndex + 1, columnIndex))
            && this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex + 1))
            && this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex - 1))) {
            return 'I';
        }

        // Down left right
        if (this.isRoad(this.getObjectTypeAtPosition(lineIndex + 1, columnIndex))
            && this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex + 1))
            && this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex - 1))) {
            return 'O';
        }

        // Up left down
        if (this.isRoad(this.getObjectTypeAtPosition(lineIndex - 1, columnIndex))
            && this.isRoad(this.getObjectTypeAtPosition(lineIndex + 1, columnIndex))
            && this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex - 1))) {
            return 'P';
        }

        // Up left right
        if (this.isRoad(this.getObjectTypeAtPosition(lineIndex - 1, columnIndex))
            && this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex + 1))
            && this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex - 1))) {
            return 'S';
        }

        // Up right down
        if (this.isRoad(this.getObjectTypeAtPosition(lineIndex - 1, columnIndex))
            && this.isRoad(this.getObjectTypeAtPosition(lineIndex + 1, columnIndex))
            && this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex + 1))) {
            return 'A';
        }

        // Vertical road
        if (this.isRoad(this.getObjectTypeAtPosition(lineIndex - 1, columnIndex))
            && this.isRoad(this.getObjectTypeAtPosition(lineIndex + 1, columnIndex))) {
            return 'Y';
        }

        // Horizontal road
        if (this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex - 1))
            && this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex + 1))) {
            return 'T';
        }

        // Up right
        if (this.isRoad(this.getObjectTypeAtPosition(lineIndex - 1, columnIndex))
            && this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex + 1))) {
            return 'E';
        }

        // Up left
        if (this.isRoad(this.getObjectTypeAtPosition(lineIndex - 1, columnIndex))
            && this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex - 1))) {
            return 'Q';
        }

        // Down right
        if (this.isRoad(this.getObjectTypeAtPosition(lineIndex + 1, columnIndex))
            && this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex + 1))) {
            return 'R';
        }

        // Down left
        if (this.isRoad(this.getObjectTypeAtPosition(lineIndex + 1, columnIndex))
            && this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex - 1))) {
            return 'W';
        }

        // Up end
        if (!this.isRoad(this.getObjectTypeAtPosition(lineIndex - 1, columnIndex))
            && this.isRoad(this.getObjectTypeAtPosition(lineIndex + 1, columnIndex))
            && !this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex + 1))
            && !this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex - 1))) {
            return 'D';
        }

        // Right end
        if (!this.isRoad(this.getObjectTypeAtPosition(lineIndex - 1, columnIndex))
            && !this.isRoad(this.getObjectTypeAtPosition(lineIndex + 1, columnIndex))
            && !this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex + 1))
            && this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex - 1))) {
            return 'G';
        }

        // Down end
        if (this.isRoad(this.getObjectTypeAtPosition(lineIndex - 1, columnIndex))
            && !this.isRoad(this.getObjectTypeAtPosition(lineIndex + 1, columnIndex))
            && !this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex + 1))
            && !this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex - 1))) {
            return 'F';
        }

        // Left end
        if (!this.isRoad(this.getObjectTypeAtPosition(lineIndex - 1, columnIndex))
            && !this.isRoad(this.getObjectTypeAtPosition(lineIndex + 1, columnIndex))
            && this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex + 1))
            && !this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex - 1))) {
            return 'G';
        }

        return '';
    }

};
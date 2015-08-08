TRAFFICSIM_APP.game = TRAFFICSIM_APP.game || {};

TRAFFICSIM_APP.game.Map = function () {
    var TILE_SIZE = 8; // Measured in meters in real world

    /* Map object types:
     * Q = Road left/up
     * W = Road left/down
     * E = Road right/up
     * R = Road right/down
     * T = Road horizontal
     * Y = Road vertical
     * I = Crossroads
     *   = Nothing
     * X = Road type calculated automatically
     */
    var map =
        "         \n" +
        " XXXXX   \n" +
        " X   X   \n" +
        " XXXXXXX \n" +
        "     X X \n" +
        "     XXX \n" +
        "         ";

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
    }
};
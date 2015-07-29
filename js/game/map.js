TRAFFICSIM_APP.game = TRAFFICSIM_APP.game || {};

TRAFFICSIM_APP.game.Map = function () {
    var TILE_SIZE = 8; // Measured in meters in real world

    /* Map legend:
     * Q = Road left/up
     * W = Road left/down
     * E = Road right/up
     * R = Road right/down
     * T = Road horizontal
     * Y = Road vertical
     *   = Nothing
     */
    /*var map =
        "          \n" +
        " RTTTTTTTW\n" +
        " Y      RQ\n" +
        " ETTW   Y \n" +
        "    ETTTY \n";*/

    /*var map =
        "    \n" +
        " Y  \n" +
        " Y  \n" +
        " Y  \n" +
        "    \n";
        */

    var map =
        " Y \n" +
        " Y \n" +
        " Y \n";

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

    this.getMap = function() {
        return map;
    }
};
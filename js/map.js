/* Map is used to construct the game world using a simple text-based presentation. It is not updated if the world is changed. */

TRAFFICSIM_APP.Map = function () {
    /* Map legend:
     * X = Wall
     *   = Free space
     * R = Respawn point
     */
    var map =
        "XXXXXXXXXXXXXXXX\n" +
        "X    R         X\n" +
        "X RX X X   XX  X\n" +
        "X XXXXR   XX   X\n" +
        "X XR           X\n" +
        "X      X XXXXXXX\n" +
        "X XXXXXX X\n" +
        "X     RX X\n" +
        "X  X     X\n" +
        "XXXXXXXXXX\n";

    this.getWidth = function () {
        var highest = 0;
        var lines = map.split("\n");
        for (var i = 0; i < lines.length; i++) {
            if (lines[i].length > highest) {
                highest = lines[i].length;
            }
        }

        return highest * this.getTileSize();
    };

    this.getHeight = function () {
        return map.split("\n").length * this.getTileSize();
    };

    this.getTileSize = function () {
        return 100;
    };

    this.getMap = function () {
        return map;
    }
};
TRAFFICSIM_APP.game = TRAFFICSIM_APP.game || {};

TRAFFICSIM_APP.game.GameplayObject = function (worldController) {
    var self = this;
    var worldController = worldController;

    var position = {
        "x": 0,
        "y": 0,
        "z": 0
    };

    function constructor() {
        initialize();
    }

    function initialize() {
    }

    constructor();
};
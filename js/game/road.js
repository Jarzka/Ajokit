// Road is a physical road cell in the grid

TRAFFICSIM_APP.game = TRAFFICSIM_APP.game || {};

TRAFFICSIM_APP.game.Road = function(worldController) {
    var self = this;
    var worldController = worldController;

    function constructor() {
        initialize();
    }

    function initialize() {
    }

    constructor();
};

TRAFFICSIM_APP.game.Road.prototype = new TRAFFICSIM_APP.game.GameplayObject;
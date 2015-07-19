TRAFFICSIM_APP.SimulationApp = function() {
    var self = this;

    var activeScene;

    function constructor() {
        initialize();
        run();
    }

    function initialize() {
        activeScene = new TRAFFICSIM_APP.scenes.LoadingGameScene(self);
    }

    function run() {
        console.log("Running the game");
        window.requestAnimationFrame(executeGameFrame);
    }

    function executeGameFrame() {
        activeScene.update();
        window.requestAnimationFrame(executeGameFrame);
    }

    this.changeScene = function (scene) {
        activeScene = scene;
    };

    constructor();
};
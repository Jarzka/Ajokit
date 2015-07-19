TRAFFICSIM_APP.SimulationApp = function () {
    var self = this;

    var textureContainer = new TextureContainer();
    var activeScene;

    function constructor() {
        initialize();
        run();
    }

    function initialize() {
        activeScene = new LoadingGameScene(self);
    }

    function run() {
        console.log("Running the game")
        window.requestAnimationFrame(executeGameFrame);
    }

    function executeGameFrame() {
        activeScene.update();
        window.requestAnimationFrame(executeGameFrame);
    }

    this.changeScene = function (scene) {
        activeScene = scene;
    };

    this.getTextureContainer = function () {
        return textureContainer;
    };

    constructor();
};
TRAFFICSIM_APP.SimulationApp = function() {
    var self = this;

    var textureContainer = new TRAFFICSIM_APP.TextureContainer();
    var modelCotainer = new TRAFFICSIM_APP.ModelContainer(self);
    var activeScene;

    function constructor() {
        initialize();
        run();
    }

    function initialize() {
        activeScene = new TRAFFICSIM_APP.scenes.LoadingGameScene(self);
    }

    function run() {
        window.requestAnimationFrame(executeGameFrame);
    }

    function executeGameFrame() {
        activeScene.update();
        window.requestAnimationFrame(executeGameFrame);
    }

    this.changeScene = function(scene) {
        activeScene = scene;
    };

    this.getTextureContainer = function() {
        return textureContainer;
    };

    this.getModelContainer = function() {
        return modelCotainer;
    };

    constructor();
};
TRAFFICSIM_APP.scenes = TRAFFICSIM_APP.scenes || {};

TRAFFICSIM_APP.scenes.GameplayScene = function (application) {
    var self = this;
    var application = application;
    var clock;

    var worldController;
    var worldRenderer;
    
    var fpsCounterTimestamp = 0;
    var frameCounter = 0;
    var deltaTime;

    function constructor() {
        initialize();
    }

    function initialize() {
        clock = new THREE.Clock();
        worldController = new TRAFFICSIM_APP.WorldController(self);
        worldRenderer = new TRAFFICSIM_APP.WorldRenderer(worldController);
    }

    this.update = function () {
        worldController.update();
        worldRenderer.render();

        deltaTime = clock.getDelta();
        handleFps();
    };

    function handleFps() {
        frameCounter++;

        if (Date.now() >= fpsCounterTimestamp + 1000) {
            $(".fps").text(frameCounter + "fps");
            frameCounter = 0;
            fpsCounterTimestamp = Date.now();
        }
    }

    this.getApplication = function () {
        return application;
    };

    constructor();
};
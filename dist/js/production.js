"use strict"; // NOTE: Once the app is built, all JS files are concatenated together and this affects all files.

var TRAFFICSIM_APP = {};;/* Map is used to construct the game world using a simple text-based presentation. It is not updated if the world is changed. */

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
};;TRAFFICSIM_APP.WorldRenderer = function (worldController) {
    var renderer;
    var worldController = worldController;

    function constructor() {
        initialize();
    }

    function initialize() {
        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMapEnabled = true;
        renderer.shadowMapSoft = true;
        document.body.appendChild(renderer.domElement);
    }

    this.render = function () {
        renderer.render(worldController.getThreeJSScene(), worldController.getCamera());
    };

    constructor();

};;TRAFFICSIM_APP.WorldController = function (gameplayScene) {
    var gameplayScene = gameplayScene;
    var scene;
    var camera;
    var player;

    function constructor() {
        initialize();
    }

    function initialize() {
        initializeScene();
        initializeCamera();
        initializeWorld();
    }

    function initializeScene() {
        scene = new THREE.Scene();
    }

    function initializeCamera() {
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    }

    function initializeMap() {
    }

    function initializeWorld() {
        initializeMap();
    }

    this.update = function () {
    };

    this.getCamera = function () {
        return camera;
    };

    this.getThreeJSScene = function () {
        return scene;
    };

    this.getGameplayScene = function () {
        return gameplayScene;
    };

    this.getPlayer = function () {
        return player;
    };

    constructor();
};;"use strict";

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
};;"use strict";

TRAFFICSIM_APP.scenes.LoadingGameScene = function(application) {
    var application = application;

    this.update = function () {
        console.log("Loading done!");
        application.changeScene(new TRAFFICSIM_APP.scenes.GameplayScene(application));
    };
};;TRAFFICSIM_APP.SimulationApp = function() {
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
};;$(document).ready(function() {
    console.log("Starting app!");
    new TRAFFICSIM_APP.SimulationApp();
});
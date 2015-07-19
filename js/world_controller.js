TRAFFICSIM_APP.WorldController = function (gameplayScene) {
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
};
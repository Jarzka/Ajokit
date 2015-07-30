TRAFFICSIM_APP.WorldController = function(gameplayScene) {
    var gameplayScene = gameplayScene;
    var map;
    var scene;
    var camera;

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
        camera.position.x = 8;
        camera.position.y = 6;
        camera.position.z = 24;
        camera.rotation.x = -45 * Math.PI / 180;
    }

    function initializeMap() {
        map = new TRAFFICSIM_APP.game.Map();
        var mapLines = map.getMap().split("\n");
        for (var lineIndex = 0; lineIndex < mapLines.length; lineIndex++) {
            var line = mapLines[lineIndex];
            for (var charIndex = 0; charIndex < line.length; charIndex++) {
                insertGameplayObjectToWorld(line.charAt(charIndex), charIndex * map.getTileSize(), 0, lineIndex * map.getTileSize());
            }
        }

        // Floor
        var geometry = new THREE.PlaneGeometry(map.getWidth(), map.getHeight(), 1, 1);
        var material = new THREE.MeshBasicMaterial({map: gameplayScene.getApplication().getTextureContainer().getTextureByName("grass")});
        var floor = new THREE.Mesh(geometry, material);
        floor.position.x = map.getWidth() / 2 - (map.getTileSize() / 2);
        floor.position.z = map.getHeight() / 2 - (map.getTileSize() / 2);
        floor.rotation.x = -90 * Math.PI / 180;
        floor.castShadow = true;
        floor.receiveShadow = true;
        scene.add(floor);

        // Light
        var light = new THREE.DirectionalLight(0xf6e86d, 1);
        light.position.x = -map.getTileSize();
        light.position.y = map.getTileSize() * 3;
        light.position.z = -map.getTileSize();
        light.target.position.x = map.getTileSize() * 5;
        light.target.position.y = 80;
        light.target.position.z = map.getTileSize() * 5;
        light.castShadow = true;
        scene.add(light);
    }

    function initializeSky() {
        // TODO INITIALIZE IN CONTAINER (and use skybox.png)
        var sky = new THREE.Mesh(
            new THREE.CubeGeometry(5000, 5000, 5000),
            new THREE.MeshFaceMaterial(gameplayScene.getApplication().getTextureContainer().getTextureByName("skybox")));
        sky.position.x = map.getWidth() / 2;
        sky.position.z = map.getHeight() / 2;
        scene.add(sky);
    }

    function insertGameplayObjectToWorld(id, x, y, z) {
        if (id == 'Y') {
            var road = gameplayScene.getApplication().getModelContainer().getModelByName("road").clone();
            road.position.x = x;
            road.position.y = 0;
            road.position.z = z;
            scene.add(road);
        }
    }

    function initializeWorld() {
        initializeMap();
        initializeSky();
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
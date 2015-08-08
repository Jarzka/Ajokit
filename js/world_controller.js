TRAFFICSIM_APP.WorldController = function (gameplayScene) {
    var self = this;

    var gameplayScene = gameplayScene;
    var map;
    var scene;
    var camera;

    var logger = TRAFFICSIM_APP.utils.logger;
    var logType = TRAFFICSIM_APP.utils.logger.LogType;

    var roadController;
    var vehicleController;

    function constructor() {
        map = new TRAFFICSIM_APP.game.Map();
        roadController = new TRAFFICSIM_APP.game.RoadController(self);
        vehicleController = new TRAFFICSIM_APP.game.VehicleController(self);

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
        camera.position.x = 35;
        camera.position.y = 20;
        camera.position.z = 50;
        camera.rotation.x = -55 * Math.PI / 180;
    }

    function resolveRoadType(lineIndex, columnIndex) {
        // Vertical road
        if (map.isRoad(map.getObjectTypeAtPosition(lineIndex - 1, columnIndex))
            && map.isRoad(map.getObjectTypeAtPosition(lineIndex + 1, columnIndex))) {
            return 'Y';
        }

        // Horizontal road
        if (map.isRoad(map.getObjectTypeAtPosition(lineIndex, columnIndex - 1))
            && map.isRoad(map.getObjectTypeAtPosition(lineIndex, columnIndex + 1))) {
            return 'T';
        }

        // Up right
        if (map.isRoad(map.getObjectTypeAtPosition(lineIndex - 1, columnIndex))
            && map.isRoad(map.getObjectTypeAtPosition(lineIndex, columnIndex + 1))) {
            return 'E';
        }

        // Up left
        if (map.isRoad(map.getObjectTypeAtPosition(lineIndex - 1, columnIndex))
            && map.isRoad(map.getObjectTypeAtPosition(lineIndex, columnIndex - 1))) {
            return 'Q';
        }

        // Down right
        if (map.isRoad(map.getObjectTypeAtPosition(lineIndex + 1, columnIndex))
            && map.isRoad(map.getObjectTypeAtPosition(lineIndex, columnIndex + 1))) {
            return 'R';
        }

        // Down left
        if (map.isRoad(map.getObjectTypeAtPosition(lineIndex + 1, columnIndex))
            && map.isRoad(map.getObjectTypeAtPosition(lineIndex, columnIndex - 1))) {
            return 'W';
        }

        return '';
    }

    function initializeMap() {
        var mapLines = map.getMapAsArray();
        for (var lineIndex = 0; lineIndex < mapLines.length; lineIndex++) {
            var line = mapLines[lineIndex];
            for (var columnIndex = 0; columnIndex < line.length; columnIndex++) {
                var objectType = line.charAt(columnIndex);
                if (line.charAt(columnIndex) === 'X') {
                    objectType = resolveRoadType(lineIndex, columnIndex);
                }

                insertGameplayObjectToWorld(objectType, columnIndex * map.getTileSize(), 0, lineIndex * map.getTileSize());
            }
        }
    }

    function initializeTerrain() {
        var geometry = new THREE.PlaneGeometry(map.getWidth(), map.getHeight(), 1, 1);
        var material = new THREE.MeshBasicMaterial({map: gameplayScene.getApplication().getTextureContainer().getTextureByName("grass")});
        var floor = new THREE.Mesh(geometry, material);
        floor.position.x = map.getWidth() / 2 - (map.getTileSize() / 2);
        floor.position.z = map.getHeight() / 2 - (map.getTileSize() / 2);
        floor.rotation.x = -90 * Math.PI / 180;
        floor.castShadow = true;
        floor.receiveShadow = true;
        scene.add(floor);
    }

    function initializeLights() {
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
        // TODO use skybox.png)
        var sky = new THREE.Mesh(
            new THREE.CubeGeometry(5000, 5000, 5000),
            new THREE.MeshFaceMaterial(gameplayScene.getApplication().getTextureContainer().getTextureByName("skybox")));
        sky.position.x = map.getWidth() / 2;
        sky.position.z = map.getHeight() / 2;
        scene.add(sky);
    }

    function insertGameplayObjectToWorld(id, x, y, z) {
        switch (id) {
            case 'Y':
                logger.log(logType.DEBUG, "About to insert vertical road to the world at x:" + x + " y:" + y + "z:" + z);
                roadController.insertRoad(TRAFFICSIM_APP.game.RoadType.VERTICAL, x, z);
                break;
            case 'T':
                logger.log(logType.DEBUG, "About to insert horizontal to the world at x:" + x + " y:" + y + "z:" + z);
                roadController.insertRoad(TRAFFICSIM_APP.game.RoadType.HORIZONTAL, x, z);
                break;
            case 'Q':
                logger.log(logType.DEBUG, "About to insert up-left road to the world at x:" + x + " y:" + y + "z:" + z);
                roadController.insertRoad(TRAFFICSIM_APP.game.RoadType.UP_LEFT, x, z);
                break;
            case 'E':
                logger.log(logType.DEBUG, "About to insert up-right road to the world at x:" + x + " y:" + y + "z:" + z);
                roadController.insertRoad(TRAFFICSIM_APP.game.RoadType.UP_RIGHT, x, z);
                break;
            case 'W':
                logger.log(logType.DEBUG, "About to insert down-left road to the world at x:" + x + " y:" + y + "z:" + z);
                roadController.insertRoad(TRAFFICSIM_APP.game.RoadType.DOWN_LEFT, x, z);
                break;
            case 'R':
                logger.log(logType.DEBUG, "About to insert down-right road to the world at x:" + x + " y:" + y + "z:" + z);
                roadController.insertRoad(TRAFFICSIM_APP.game.RoadType.DOWN_RIGHT, x, z);
                break;
        }
    }

    function initializeCars() {
        vehicleController.initializeCars();
    }

    function initializeWorld() {
        initializeMap();
        roadController.mergeAllRoadNodes();
        initializeTerrain();
        initializeLights();
        initializeSky();
        initializeCars();
    }

    this.update = function (deltaTime) {
        vehicleController.update(deltaTime);
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

    this.getMap = function () {
        return map;
    };

    this.getRoadController = function() {
        return roadController;
    };

    constructor();
};
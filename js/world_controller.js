TRAFFICSIM_APP.WorldController = function (gameplayScene) {
    var self = this;

    var gameplayScene = gameplayScene;
    var map;
    var scene;
    var camera;
    var keyboardButtonsPressedOnLastFrame = [];
    var math = TRAFFICSIM_APP.utils.math;

    var keyboard;
    var mouseWorldCoordinates = null;

    var logger = TRAFFICSIM_APP.utils.logger;

    var roadController;
    var vehicleController;

    var currentCameraPositionId = 1;
    var cameraTarget = null;
    var lastAutomaticCameraPositionSwitch = 0;
    var switchCameraPositionAutomatically = false;

    function constructor() {
        map = new TRAFFICSIM_APP.game.Map();
        roadController = new TRAFFICSIM_APP.game.RoadController(self);
        vehicleController = new TRAFFICSIM_APP.game.VehicleController(self);
        keyboard = new THREEx.KeyboardState();

        initialize();
    }

    function initialize() {
        initializeScene();
        initializeCamera();
        initializeWorld();
        initializeEventListeners();
    }

    function initializeScene() {
        scene = new THREE.Scene();
    }

    function initializeCamera() {
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
        adjustCameraPosition(1);
    }

    function initializeEventListeners() {
        window.addEventListener("mousemove", function(event) {
            var position = new THREE.Vector3(0, 0, 0);
            var mousePosition = new THREE.Vector3(
                (event.clientX / window.innerWidth ) * 2 - 1,
                - ( event.clientY / window.innerHeight ) * 2 + 1,
                1);
            mousePosition.unproject(camera);
            var cameraPosition = camera.position;
            var m = mousePosition.y / ( mousePosition.y - cameraPosition.y );
            position.x = mousePosition.x + ( cameraPosition.x - mousePosition.x ) * m;
            position.z = mousePosition.z + ( cameraPosition.z - mousePosition.z ) * m;
            mouseWorldCoordinates = position;
        });
    }

    function synchronizeGameWorldWithMap() {
        var mapLines = map.getMapAsArray();
        for (var lineIndex = 0; lineIndex < mapLines.length; lineIndex++) {
            var line = mapLines[lineIndex];
            for (var columnIndex = 0; columnIndex < line.length; columnIndex++) {
                var objectType = line.charAt(columnIndex);
                if (line.charAt(columnIndex) === 'X') {
                    objectType = map.resolveRoadType(lineIndex, columnIndex);
                }

                var x = columnIndex * map.getTileSize();
                var z = lineIndex * map.getTileSize();

                if (objectType !== null) {
                    // Try to find out if this object already exists in the game world
                    var objectInWorld = roadController.getRoads().filter(function(road) {
                        return road.getPosition().x == x && road.getPosition().z == z;
                    })[0];

                    if (objectInWorld && objectInWorld.getRoadType() != objectType) {
                        objectInWorld.die();
                        insertGameplayObjectToWorld(objectType, x, 0, z);
                    }

                    if (!objectInWorld) {
                        insertGameplayObjectToWorld(objectType, x, 0, z);
                    }
                }
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
        var light = new THREE.DirectionalLight(0xefe694, 1);
        light.target.position.x = map.getTileSize() * 5;
        light.target.position.y = 40;
        light.target.position.z = map.getTileSize() * 5;
        light.position.x = map.getTileSize() * 7;
        light.position.y = map.getTileSize() * 8;
        light.position.z = -map.getTileSize();

        light.castShadow = true;
        light.shadowDarkness = 0.5;
        scene.add(light);
    }

    function initializeSky() {
        var sky = new THREE.Mesh(
            new THREE.CubeGeometry(5000, 5000, 5000),
            new THREE.MeshFaceMaterial(gameplayScene.getApplication().getTextureContainer().getTextureByName("skybox")));
        sky.position.x = map.getWidth() / 2;
        sky.position.z = map.getHeight() / 2;
        scene.add(sky);
    }

    function insertGameplayObjectToWorld(id, x, y, z) {
        switch (id) {
            case TRAFFICSIM_APP.game.RoadType.VERTICAL:
                roadController.insertRoad(id, x, z);
                break;
            case TRAFFICSIM_APP.game.RoadType.HORIZONTAL:
                roadController.insertRoad(id, x, z);
                break;
            case TRAFFICSIM_APP.game.RoadType.UP_LEFT:
                roadController.insertRoad(id, x, z);
                break;
            case TRAFFICSIM_APP.game.RoadType.UP_RIGHT:
                roadController.insertRoad(id, x, z);
                break;
            case TRAFFICSIM_APP.game.RoadType.DOWN_LEFT:
                roadController.insertRoad(id, x, z);
                break;
            case TRAFFICSIM_APP.game.RoadType.DOWN_RIGHT:
                roadController.insertRoad(id, x, z);
                break;
            case TRAFFICSIM_APP.game.RoadType.CROSSROADS:
                roadController.insertRoad(id, x, z);
                break;
            case TRAFFICSIM_APP.game.RoadType.DOWN_LEFT_RIGHT:
                roadController.insertRoad(id, x, z);
                break;
            case TRAFFICSIM_APP.game.RoadType.UP_LEFT_DOWN:
                roadController.insertRoad(id, x, z);
                break;
            case TRAFFICSIM_APP.game.RoadType.UP_LEFT_RIGHT:
                roadController.insertRoad(id, x, z);
                break;
            case TRAFFICSIM_APP.game.RoadType.UP_RIGHT_DOWN:
                roadController.insertRoad(id, x, z);
                break;
            case TRAFFICSIM_APP.game.RoadType.UP_END:
                roadController.insertRoad(id, x, z);
                break;
            case TRAFFICSIM_APP.game.RoadType.DOWN_END:
                roadController.insertRoad(id, x, z);
                break;
            case TRAFFICSIM_APP.game.RoadType.LEFT_END:
                roadController.insertRoad(id, x, z);
                break;
            case TRAFFICSIM_APP.game.RoadType.RIGHT_END:
                roadController.insertRoad(id, x, z);
                break;
        }
    }

    function initializeCars() {
        vehicleController.initializeCars();
    }

    function initializeWorld() {
        synchronizeGameWorldWithMap();
        roadController.mergeNodesCloseToEachOther();
        initializeTerrain();
        initializeLights();
        initializeSky();
        initializeCars();
    }

    function readInput() {
        cameraPosition();
        automaticCameraPositionSwitch();

        function cameraPosition() {
            for (var i = 1; i <= 5; i++) {
                if (keyboard.pressed(i.toString())) {
                    // Keyboard button was not down on last frame
                    if (keyboardButtonsPressedOnLastFrame.indexOf(i.toString()) == -1) {
                        cameraTarget = null;
                        keyboardButtonsPressedOnLastFrame.push(i.toString());
                        currentCameraPositionId = i;
                    }
                } else {
                    if (keyboardButtonsPressedOnLastFrame.indexOf(i.toString()) > -1) {
                        keyboardButtonsPressedOnLastFrame.splice(keyboardButtonsPressedOnLastFrame.indexOf(i.toString()), 1);
                    }
                }
            }
        }

        function automaticCameraPositionSwitch() {
            var A = "A";
            if (keyboard.pressed(A)) {
                if (keyboardButtonsPressedOnLastFrame.indexOf(A) == -1) {
                    keyboardButtonsPressedOnLastFrame.push(A);
                    switchCameraPositionAutomatically = !switchCameraPositionAutomatically;
                }
            } else {
                if (keyboardButtonsPressedOnLastFrame.indexOf(A) > -1) {
                    keyboardButtonsPressedOnLastFrame.splice(keyboardButtonsPressedOnLastFrame.indexOf(A), 1);
                }
            }
        }
    }

    function updateMouseWorldPosition() {

    }

    function adjustCameraPosition() {
        switchCameraAutomaticallyIfTurnedOn();
        updateCameraPosition();

        function switchCameraAutomaticallyIfTurnedOn() {
            if (switchCameraPositionAutomatically && lastAutomaticCameraPositionSwitch + 7000 < Date.now()) {
                lastAutomaticCameraPositionSwitch = Date.now();
                cameraTarget = null;
                currentCameraPositionId++;

                if (currentCameraPositionId > 4) {
                    currentCameraPositionId = 1;
                }
            }
        }

        function updateCameraPosition() {
            switch (currentCameraPositionId) {
                case 1:
                    camera.position.x = 50;
                    camera.position.y = 28;
                    camera.position.z = 65;
                    camera.rotation.x = math.radians(-55);
                    camera.rotation.y = 0;
                    camera.rotation.z = 0;
                    break;
                case 2:
                    followCarFromTop();
                    break;
                case 3:
                    followCrossRoads();
                    break;
                case 4:
                    followCarThirdPersonView();
                    break;
                case 5:
                    followCarFirstPersonView();
                    break;
                default:
                    currentCameraPositionId = 1;
                    break;
            }
        }

        function followCrossRoads() {
            if (!cameraTarget) {
                setNewCrossRoadsTargetForCamera();
            }

            camera.position.x = cameraTarget.getPosition().x + 10;
            camera.position.y = 3;
            camera.position.z = cameraTarget.getPosition().z - 5;

            camera.rotation.x = math.radians(20);
            camera.rotation.y = math.radians(120);
            camera.rotation.z = math.radians(-17);
        }

        function followCarFromTop() {
            if (!cameraTarget) {
                setNewVehicleTargetForCamera();
            }

            camera.position.x = cameraTarget.getPosition().x;
            camera.position.y = 10;
            camera.position.z = cameraTarget.getPosition().z + 8;
            camera.rotation.x = -55 * Math.PI / 180;
            camera.rotation.y = 0;
            camera.rotation.z = 0;
        }

        function followCarThirdPersonView() {
            if (!cameraTarget) {
                setNewVehicleTargetForCamera();
            }

            camera.position.x = cameraTarget.getPosition().x + 5;
            camera.position.y = 3;
            camera.position.z = cameraTarget.getPosition().z - 3;

            camera.rotation.x = math.radians(20);
            camera.rotation.y = math.radians(120);
            camera.rotation.z = math.radians(-17);
        }

        function followCarFirstPersonView() {
            // FIXME Implement...
            if (!cameraTarget) {
                setNewVehicleTargetForCamera();
            }

            camera.position.x = cameraTarget.getPosition().x;
            camera.position.y = 10;
            camera.position.z = cameraTarget.getPosition().z + 8;
            camera.rotation.x = -55 * Math.PI / 180;
            camera.rotation.y = 0;
            camera.rotation.z = 0;
        }

        function setNewCrossRoadsTargetForCamera() {
            var roads = roadController.getRoads();
            var crossRoads = roads.filter(function(road) {
                return road.getRoadType() == TRAFFICSIM_APP.game.RoadType.CROSSROADS;
            });

            cameraTarget = crossRoads[math.randomValue(0, crossRoads.length - 1)];
        }

        function setNewVehicleTargetForCamera() {
            var cars = vehicleController.getVehicles();
            cameraTarget = cars[math.randomValue(0, cars.length - 1)];
        }
    }

    this.update = function (deltaTime) {
        vehicleController.update(deltaTime);
        readInput();
        adjustCameraPosition();
        roadController.update();
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

    this.getVehicleController = function() {
        return vehicleController;
    };

    constructor();
};
(function() {
    TRAFFICSIM_APP.game = TRAFFICSIM_APP.game || {};
    TRAFFICSIM_APP.game.world_controller = TRAFFICSIM_APP.game.world_controller || {};

    var NS = TRAFFICSIM_APP.game.world_controller;

    NS.WorldController = function (gameplayScene) {
        var self = this;

        var gameplayScene = gameplayScene;
        var map;
        var scene;
        var camera;
        var buttonsPressedOnLastFrame = [];
        var math = TRAFFICSIM_APP.utils.math;

        var keyboard;
        var mouse = {
            "LEFT_BUTTON_PRESSED": false,
            "RIGHT_BUTTON_PRESSED": false
        };
        var mouseWorldCoordinates = null;

        var logger = TRAFFICSIM_APP.utils.logger;

        var roadController;
        var vehicleController;

        var editMode = false;

        var currentCameraPositionId = 1;
        var cameraTarget = null;
        var lastAutomaticCameraPositionSwitch = 0;
        var switchCameraPositionAutomatically = false;

        function constructor() {
            map = new TRAFFICSIM_APP.game.map.Map();
            roadController = new TRAFFICSIM_APP.game.road_controller.RoadController(self);
            vehicleController = new TRAFFICSIM_APP.game.vehicle_controller.VehicleController(self);
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

                /* If ever needed, here are world coordinates on XY plane:
                 var vector = new THREE.Vector3();
                 vector.set((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1, 0.5);
                 vector.unproject(camera);
                 var dir = vector.sub(camera.position).normalize();
                 var distance = - camera.position.z / dir.z;
                 var position = camera.position.clone().add(dir.multiplyScalar(distance));
                 */
            });

            // Edit Mode

            $(".button-edit-mode").click(function() {
                editMode = !editMode;

                if (editMode) {
                    currentCameraPositionId = 1;
                    switchCameraPositionAutomatically = false;
                    $(this).text("Edit Mode ON");
                } else {
                    $(this).text("Edit Mode OFF");
                }
            });

            $(".button-add-car").click(function() {
                if (editMode) {
                    vehicleController.addCarAtRandomFreePosition(roadController.getNodes(), map);
                }
            });

            $(".button-remove-car").click(function() {
                if (editMode) {
                    vehicleController.removeRandomCar();
                }
            });

            // Mouse state

            document.body.onmousedown = function(evt) {
                if (evt.button === 0) {
                    mouse.LEFT_BUTTON_PRESSED = true;
                }

                if (evt.button === 2) {
                    mouse.RIGHT_BUTTON_PRESSED = true;
                }
            };

            document.body.onmouseup = function(evt) {
                if (evt.button === 0) {
                    mouse.LEFT_BUTTON_PRESSED = false;
                }

                if (evt.button === 2) {
                    mouse.RIGHT_BUTTON_PRESSED = false;
                }
            };
        }

        function synchronizeGameWorldWithMap() {
            var mapLines = map.getMapAsArray();
            for (var lineIndex = 0; lineIndex < mapLines.length; lineIndex++) {
                var line = mapLines[lineIndex];
                for (var columnIndex = 0; columnIndex < line.length; columnIndex++) {
                    var objectType = line.charAt(columnIndex);
                    handleRoadType(objectType);
                    handleEmptyType(objectType);
                }
            }

            function handleRoadType(objectType) {
                var roadType = null;
                if (objectType === 'X') {
                    roadType = map.resolveRoadType(lineIndex, columnIndex);
                }

                if (roadType !== null) { // Try to find out if the road already exists in the game world
                    var x = columnIndex * map.getTileSize() + (map.getTileSize() / 2);
                    var z = lineIndex * map.getTileSize() + (map.getTileSize() / 2);
                    var objectInWorld = roadController.getRoads().filter(function(road) {
                        return road.getPosition().x == x && road.getPosition().z == z;
                    })[0];

                    if (objectInWorld && objectInWorld.getRoadType() != roadType) {
                        objectInWorld.die();
                        insertGameplayObjectToWorld(roadType, x, 0, z);
                    }

                    if (!objectInWorld) {
                        insertGameplayObjectToWorld(roadType, x, 0, z);
                    }
                }
            }

            function handleEmptyType(objectType) {
                if (objectType === ' ') {
                    // Check that there is no object at this position in game world and if there is, remove it
                    var x = columnIndex * map.getTileSize() + (map.getTileSize() / 2);
                    var z = lineIndex * map.getTileSize() + (map.getTileSize() / 2);

                    var objectInWorld = roadController.getRoads().filter(function(road) {
                        return road.getPosition().x == x && road.getPosition().z == z;
                    })[0];

                    if (objectInWorld) {
                        objectInWorld.die();
                    }
                }
            }
        }

        function initializeTerrain() {
            var geometry = new THREE.PlaneGeometry(map.getWidth(), map.getHeight(), 1, 1);
            var material = new THREE.MeshBasicMaterial({map: gameplayScene.getApplication().getTextureContainer().getTextureByName("grass")});
            var terrain = new THREE.Mesh(geometry, material);
            terrain.position.x = map.getWidth() / 2;
            terrain.position.z = map.getHeight() / 2;
            terrain.rotation.x = -90 * Math.PI / 180;
            terrain.castShadow = true;
            terrain.receiveShadow = true;
            scene.add(terrain);
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
                case TRAFFICSIM_APP.game.road.RoadType.VERTICAL:
                    roadController.insertRoad(id, x, z);
                    break;
                case TRAFFICSIM_APP.game.road.RoadType.HORIZONTAL:
                    roadController.insertRoad(id, x, z);
                    break;
                case TRAFFICSIM_APP.game.road.RoadType.UP_LEFT:
                    roadController.insertRoad(id, x, z);
                    break;
                case TRAFFICSIM_APP.game.road.RoadType.UP_RIGHT:
                    roadController.insertRoad(id, x, z);
                    break;
                case TRAFFICSIM_APP.game.road.RoadType.DOWN_LEFT:
                    roadController.insertRoad(id, x, z);
                    break;
                case TRAFFICSIM_APP.game.road.RoadType.DOWN_RIGHT:
                    roadController.insertRoad(id, x, z);
                    break;
                case TRAFFICSIM_APP.game.road.RoadType.CROSSROADS:
                    roadController.insertRoad(id, x, z);
                    break;
                case TRAFFICSIM_APP.game.road.RoadType.DOWN_LEFT_RIGHT:
                    roadController.insertRoad(id, x, z);
                    break;
                case TRAFFICSIM_APP.game.road.RoadType.UP_LEFT_DOWN:
                    roadController.insertRoad(id, x, z);
                    break;
                case TRAFFICSIM_APP.game.road.RoadType.UP_LEFT_RIGHT:
                    roadController.insertRoad(id, x, z);
                    break;
                case TRAFFICSIM_APP.game.road.RoadType.UP_RIGHT_DOWN:
                    roadController.insertRoad(id, x, z);
                    break;
                case TRAFFICSIM_APP.game.road.RoadType.UP_END:
                    roadController.insertRoad(id, x, z);
                    break;
                case TRAFFICSIM_APP.game.road.RoadType.DOWN_END:
                    roadController.insertRoad(id, x, z);
                    break;
                case TRAFFICSIM_APP.game.road.RoadType.LEFT_END:
                    roadController.insertRoad(id, x, z);
                    break;
                case TRAFFICSIM_APP.game.road.RoadType.RIGHT_END:
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

        function isMouseOnMap() {
            return mouseWorldCoordinates.x > 0
                && mouseWorldCoordinates.x < map.getWidth()
                && mouseWorldCoordinates.z > 0
                && mouseWorldCoordinates.z < map.getHeight()
        }

        function readInput() {
            if (!editMode) {
                handleCameraPosition();
                handleAutomaticCameraPositionSwitch();
            }

            handleEditMode();

            // FIXME Duplicated code on these function --> refactor
            function handleCameraPosition() {
                for (var i = 1; i <= 4; i++) {
                    if (keyboard.pressed(i.toString())) {
                        // Keyboard button was not down on last frame
                        if (buttonsPressedOnLastFrame.indexOf(i.toString()) == -1) {
                            cameraTarget = null;
                            buttonsPressedOnLastFrame.push(i.toString());
                            currentCameraPositionId = i;
                        }
                    } else {
                        if (buttonsPressedOnLastFrame.indexOf(i.toString()) > -1) {
                            buttonsPressedOnLastFrame.splice(buttonsPressedOnLastFrame.indexOf(i.toString()), 1);
                        }
                    }
                }
            }

            function handleAutomaticCameraPositionSwitch() {
                var A = "A";
                if (keyboard.pressed(A)) {
                    if (buttonsPressedOnLastFrame.indexOf(A) == -1) {
                        buttonsPressedOnLastFrame.push(A);
                        switchCameraPositionAutomatically = !switchCameraPositionAutomatically;
                    }
                } else {
                    if (buttonsPressedOnLastFrame.indexOf(A) > -1) {
                        buttonsPressedOnLastFrame.splice(buttonsPressedOnLastFrame.indexOf(A), 1);
                    }
                }
            }

            function handleEditMode() {
                if (editMode) {
                    handleInsertRoad();
                    handleRemoveRoad();

                    function handleInsertRoad() {
                        if (mouse.LEFT_BUTTON_PRESSED) {
                            var mapPosition = map.convertMouseCoordinateToRowAndColumn(mouseWorldCoordinates.x, mouseWorldCoordinates.z);
                            if (mapPosition && isMouseOnMap()) {
                                var mapChanged = map.insertObjectToLocation('X', mapPosition.row, mapPosition.column);
                                if (mapChanged) {
                                    synchronizeGameWorldWithMap();
                                }
                            }

                        }
                    }

                    function handleRemoveRoad() {
                        if (mouse.RIGHT_BUTTON_PRESSED) {
                            var mapPosition = map.convertMouseCoordinateToRowAndColumn(mouseWorldCoordinates.x, mouseWorldCoordinates.z);
                            if (mapPosition && isMouseOnMap()) {
                                var mapChanged = map.insertObjectToLocation(' ', mapPosition.row, mapPosition.column);
                                if (mapChanged) {
                                    synchronizeGameWorldWithMap();
                                }
                            }
                        }
                    }
                }
            }
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
                        camera.position.x = map.getWidth() / 2;
                        camera.position.y = 35;
                        camera.position.z = map.getHeight() / 2 + 40;
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
                    return road.getRoadType() == TRAFFICSIM_APP.game.road.RoadType.CROSSROADS;
                });

                cameraTarget = crossRoads[math.randomValue(0, crossRoads.length - 1)];
            }

            function setNewVehicleTargetForCamera() {
                var cars = vehicleController.getVehicles();
                cameraTarget = cars[math.randomValue(0, cars.length - 1)];
            }
        }


        function updateInfoTexts() {
            if (editMode) {
                $(".info").css("display", "none");
                $(".edit-mode-actions").css("display", "block");
            } else {
                $(".info").css("display", "block");
                $(".edit-mode-actions").css("display", "none");
            }
        }

        this.update = function (deltaTime) {
            vehicleController.update(deltaTime);
            readInput();
            adjustCameraPosition();
            roadController.update();
            updateInfoTexts();
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

        this.isEditModeOn = function() {
            return editMode;
        };

        this.getMouseWorldCoordinates = function() {
            return mouseWorldCoordinates;
        };

        this.isMouseOnMap = function() {
            return isMouseOnMap();
        };

        constructor();
    };
})();
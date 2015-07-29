"use strict"; // NOTE: Once the app is built, all JS files are concatenated together and this affects all files.

var TRAFFICSIM_APP = {};;TRAFFICSIM_APP.game = TRAFFICSIM_APP.game || {};

TRAFFICSIM_APP.game.GameplayObject = function (worldController) {
    var self = this;
    var worldController = worldController;

    var position = {
        "x": 0,
        "y": 0,
        "z": 0
    };

    function constructor() {
        initialize();
    }

    function initialize() {
    }

    constructor();
};;// Road is a physical road cell in the grid

TRAFFICSIM_APP.game = TRAFFICSIM_APP.game || {};

TRAFFICSIM_APP.game.Road = function(worldController) {
    var self = this;
    var worldController = worldController;

    function constructor() {
        initialize();
    }

    function initialize() {
    }

    constructor();
};

TRAFFICSIM_APP.game.Road.prototype = new TRAFFICSIM_APP.game.GameplayObject;;// RoadNode is a single point in 3D space used for connecting RoadRoutes.

TRAFFICSIM_APP.game = TRAFFICSIM_APP.game || {};

TRAFFICSIM_APP.game.RoadNode = function(worldController) {
    var self = this;
    var worldController = worldController;

    function constructor() {
        initialize();
    }

    function initialize() {
    }

    constructor();
};

TRAFFICSIM_APP.game.RoadNode.prototype = new TRAFFICSIM_APP.game.GameplayObject;;// RoadRoute is a connection between RoadNode objects.

TRAFFICSIM_APP.game = TRAFFICSIM_APP.game || {};

// TODO Add segments (or use bezier curve?)

TRAFFICSIM_APP.game.RoadRoute = function(worldController, startNode, endNode) {
    var self = this;
    var worldController = worldController;

    var startNode = startNode;
    var endNode = endNode;

    this.getStartNode = function() {
        return startNode;
    };

    this.getEndNode = function() {
        return endNode;
    };
};;TRAFFICSIM_APP.game = TRAFFICSIM_APP.game || {};

TRAFFICSIM_APP.game.Map = function () {
    var TILE_SIZE = 8; // Measured in meters in real world

    /* Map legend:
     * Q = Road left/up
     * W = Road left/down
     * E = Road right/up
     * R = Road right/down
     * T = Road horizontal
     * Y = Road vertical
     *   = Nothing
     */
    /*var map =
        "          \n" +
        " RTTTTTTTW\n" +
        " Y      RQ\n" +
        " ETTW   Y \n" +
        "    ETTTY \n";*/

    /*var map =
        "    \n" +
        " Y  \n" +
        " Y  \n" +
        " Y  \n" +
        "    \n";
        */

    var map =
        "   \n" +
        " Y \n" +
        "   \n";

    this.getWidth = function () {
        var highest = 0;
        var lines = map.split("\n");
        for (var i = 0; i < lines.length; i++) {
            highest = Math.max(lines[i].length, highest);
        }

        return highest * this.getTileSize();
    };

    this.getHeight = function () {
        return map.split("\n").length * this.getTileSize();
    };

    this.getTileSize = function () {
        return TILE_SIZE;
    };

    this.getMap = function() {
        return map;
    }
};;TRAFFICSIM_APP.TextureContainer = function () {
    var textures = {};

    var texturesLoadedSum = 0;
    var allTexturesSum = 7; // TODO HARDCODED

    this.loadTexturesAsynchronously = function () {
        THREE.ImageUtils.loadTexture("img/grass.jpg", undefined, function (texture) {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(10, 10);
            textures["grass"] = texture;
            texturesLoadedSum++;
        });

        textures["skybox"] = [
            new THREE.MeshBasicMaterial({
                map: THREE.ImageUtils.loadTexture("img/sky_right.jpg", undefined, function(texture) {
                    texturesLoadedSum++;
                }),
                side: THREE.BackSide
            }),
            new THREE.MeshBasicMaterial({
                map: THREE.ImageUtils.loadTexture("img/sky_left.jpg", undefined, function(texture) {
                    texturesLoadedSum++;
                }),
                side: THREE.BackSide
            }),
            new THREE.MeshBasicMaterial({
                map: THREE.ImageUtils.loadTexture("img/sky_top.jpg", undefined, function(texture) {
                    texturesLoadedSum++;
                }),
                side: THREE.BackSide
            }),
            new THREE.MeshBasicMaterial({
                map: THREE.ImageUtils.loadTexture("img/sky_base.jpg", undefined, function(texture) {
                    texturesLoadedSum++;
                }),
                side: THREE.BackSide
            }),
            new THREE.MeshBasicMaterial({
                map: THREE.ImageUtils.loadTexture("img/sky_front.jpg", undefined, function(texture) {
                    texturesLoadedSum++;
                }),
                side: THREE.BackSide
            }),
            new THREE.MeshBasicMaterial({
                map: THREE.ImageUtils.loadTexture("img/sky_back.jpg", undefined, function(texture) {
                    texturesLoadedSum++;
                }),
                side: THREE.BackSide
            })
        ];
    };

    this.allTexturesLoaded = function () {
        return texturesLoadedSum >= allTexturesSum;
    };

    this.getTextureByName = function (name) {
        if (textures.hasOwnProperty(name)) {
            return textures[name];
        } else {
            // TODO Throw exception
        }
    }

};;TRAFFICSIM_APP.ModelContainer = function(application) {
    var application = application;
    var models = {};

    var loader = new THREE.JSONLoader();
    var modelsLoadedSum = 0;
    var allModelsSum = 1; // TODO HARDCODED

    this.loadModelsAsynchronously = function() {
        loader.load('models/road.json', function(geometry, materials) {
            var material = new THREE.MeshBasicMaterial({map: application.getTextureContainer().getTextureByName("grass")});
            // var material = new THREE.MeshBasicMaterial({color: 'blue'}); FIXME Just testing, works.
            var mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
            var object = new THREE.Object3D();
            object.add(mesh);
            console.log("Imported geometry: ");
            console.log(mesh.geometry);
            models["road"] = object;

            modelsLoadedSum++;
        });
    };

    this.allModelsLoaded = function() {
        return modelsLoadedSum >= allModelsSum;
    };

    this.getModelByName = function(name) {
        if (models.hasOwnProperty(name)) {
            return models[name];
        } else {
            // TODO Throw exception
        }
    }

};;TRAFFICSIM_APP.WorldRenderer = function (worldController) {
    var renderer;
    var worldController = worldController;

    function constructor() {
        initialize();
        addEventListeners();
    }

    function addEventListeners() {
        $(window).resize(function() {
            renderer.setSize(window.innerWidth, window.innerHeight);
            worldController.getCamera().width(window.innerWidth);
            worldController.getCamera().height(window.innerHeight);
        });
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
};;TRAFFICSIM_APP.WorldController = function(gameplayScene) {
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
        camera.position.y = 8;
        camera.position.z = 16;
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
            road.position.y = 0.1;
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
};;TRAFFICSIM_APP.scenes.LoadingGameScene = function (application) {
    var textureContainer = application.getTextureContainer();
    var modelContainer = application.getModelContainer();
    var startedLoadingTextures = false;
    var startedLoadingModels = false;

    this.update = function () {
        startLoadingTextures();
        startLoadingModels();
        checkLoadingState();
        render();
    };

    function startLoadingTextures() {
        if (!startedLoadingTextures) {
            textureContainer.loadTexturesAsynchronously();
            startedLoadingTextures = true;
        }
    }

    function startLoadingModels() {
        if (textureContainer.allTexturesLoaded() && !startedLoadingModels) {
            modelContainer.loadModelsAsynchronously();
            startedLoadingModels = true;
        }
    }

    function checkLoadingState() {
        if (textureContainer.allTexturesLoaded() && modelContainer.allModelsLoaded()) {
            application.changeScene(new TRAFFICSIM_APP.scenes.GameplayScene(application));
        }
    }

    function render() {
        // TODO
    }
};;TRAFFICSIM_APP.SimulationApp = function() {
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
        console.log("Running the game");
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
};;$(document).ready(function() {
    console.log("Starting app!");
    new TRAFFICSIM_APP.SimulationApp();
});
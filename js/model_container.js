TRAFFICSIM_APP.ModelContainer = function(application) {
    var application = application;
    var models = {};

    var logger = TRAFFICSIM_APP.utils.logger;

    var loader = new THREE.JSONLoader();
    var modelsLoadedSum = 0;
    var allModelsSum = 9;

    this.loadModelsAsynchronously = function() {
        loader.load('models/road_vertical.json', function(geometry) {
            var texture = application.getTextureContainer().getTextureByName("road");
            var material = new THREE.MeshLambertMaterial({map: texture});

            models["road_vertical"] = new THREE.Mesh(geometry, material);
            modelsLoadedSum++;
        });

        loader.load('models/road_horizontal.json', function(geometry) {
            var texture = application.getTextureContainer().getTextureByName("road");
            var material = new THREE.MeshLambertMaterial({map: texture});

            models["road_horizontal"] = new THREE.Mesh(geometry, material);
            modelsLoadedSum++;
        });

        loader.load('models/road_down_left.json', function(geometry) {
            var texture = application.getTextureContainer().getTextureByName("road");
            var material = new THREE.MeshLambertMaterial({map: texture});

            models["road_down_left"] = new THREE.Mesh(geometry, material);
            modelsLoadedSum++;
        });

        loader.load('models/road_down_right.json', function(geometry) {
            var texture = application.getTextureContainer().getTextureByName("road");
            var material = new THREE.MeshLambertMaterial({map: texture});

            models["road_down_right"] = new THREE.Mesh(geometry, material);
            modelsLoadedSum++;
        });

        loader.load('models/road_up_left.json', function(geometry) {
            var texture = application.getTextureContainer().getTextureByName("road");
            var material = new THREE.MeshLambertMaterial({map: texture});

            models["road_up_left"] = new THREE.Mesh(geometry, material);
            modelsLoadedSum++;
        });

        loader.load('models/road_up_right.json', function(geometry) {
            var texture = application.getTextureContainer().getTextureByName("road");
            var material = new THREE.MeshLambertMaterial({map: texture});

            models["road_up_right"] = new THREE.Mesh(geometry, material);
            modelsLoadedSum++;
        });

        loader.load('models/road_crossroads.json', function(geometry) {
            var texture = application.getTextureContainer().getTextureByName("road");
            var material = new THREE.MeshLambertMaterial({map: texture});

            models["road_crossroads"] = new THREE.Mesh(geometry, material);
            modelsLoadedSum++;
        });

        loader.load('models/traffic_light.json', function(geometry) {
            var texture = application.getTextureContainer().getTextureByName("metal");
            var material = new THREE.MeshLambertMaterial({map: texture});

            models["traffic_light"] = new THREE.Mesh(geometry, material);
            modelsLoadedSum++;
        });

        loader.load('models/car.json', function(geometry) {
            var material = new THREE.MeshBasicMaterial({ color: 0x00ee88 });
            var mesh = new THREE.Mesh(geometry, material);
            mesh.receiveShadow = false; // FIXME all shadows are buggy...
            mesh.castShadow = false;
            mesh.traverse ( function (child) {
                if (child instanceof THREE.Mesh) {
                    child.castShadow = false;
                    child.receiveShadow = false;
                }
            });

            models["car"] = mesh;
            modelsLoadedSum++;
        });
    };

    this.allModelsLoaded = function() {
        return modelsLoadedSum >= allModelsSum;
    };

    this.getModelByName = function(name) {
        if (models.hasOwnProperty(name)) {
            return models[name];
        }

        var errorMessage = "Model " + name + " not found!";
        logger.log(logger.LogType.ERROR, errorMessage);
        throw new TRAFFICSIM_APP.exceptions.GeneralException(errorMessage);
    }

};
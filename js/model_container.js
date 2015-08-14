TRAFFICSIM_APP.ModelContainer = function(application) {
    var application = application;
    var models = {};

    var loader = new THREE.JSONLoader();
    var modelsLoadedSum = 0;
    var allModelsSum = 8;

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

        loader.load('models/car.json', function(geometry) {
            var material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff });
            var mesh = new THREE.Mesh(geometry, material);
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

        throw new TRAFFICSIM_APP.exceptions.GeneralException("Model not found!");
    }

};
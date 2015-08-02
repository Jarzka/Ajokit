TRAFFICSIM_APP.ModelContainer = function(application) {
    var application = application;
    var models = {};

    var loader = new THREE.JSONLoader();
    var modelsLoadedSum = 0;
    var allModelsSum = 2; // TODO HARDCODED

    this.loadModelsAsynchronously = function() {
        loader.load('models/road.json', function(geometry) {
            var texture = application.getTextureContainer().getTextureByName("road_vertical");
            var material = new THREE.MeshLambertMaterial({map: texture});

            var mesh = new THREE.Mesh(geometry, material);

            models["road_vertical"] = mesh;
            modelsLoadedSum++;
        });

        loader.load('models/car.json', function(geometry) {
            var material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff });
            var mesh = new THREE.Mesh(geometry, material);
            mesh.rotation.y = -90 * Math.PI / 180; // FIXME Rotate to the zero-angle in 3D modelling program

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
        } else {
            // FIXME Throw exception
        }
    }

};
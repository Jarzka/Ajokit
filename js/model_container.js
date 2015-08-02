TRAFFICSIM_APP.ModelContainer = function(application) {
    var application = application;
    var models = {};

    var loader = new THREE.JSONLoader();
    var modelsLoadedSum = 0;
    var allModelsSum = 2; // TODO HARDCODED

    this.loadModelsAsynchronously = function() {
        loader.load('models/road.json', function(geometry, material) {
            //var material = new THREE.MeshFaceMaterial(material);
            var texture = application.getTextureContainer().getTextureByName("road_vertical");
            var material = new THREE.MeshLambertMaterial({map: texture});

            var mesh = new THREE.Mesh(geometry, material);

            models["road_vertical"] = mesh;
            modelsLoadedSum++;
        });

        loader.load('models/car.json', function(geometry, material) {
            var material = new THREE.MeshFaceMaterial(material);

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
        } else {
            // FIXME Throw exception
        }
    }

};
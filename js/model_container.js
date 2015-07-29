TRAFFICSIM_APP.ModelContainer = function(application) {
    var application = application;
    var models = {};

    var loader = new THREE.JSONLoader();
    var modelsLoadedSum = 0;
    var allModelsSum = 1; // TODO HARDCODED

    this.loadModelsAsynchronously = function() {
        loader.load('models/road.json', function(geometry, material) {
            var material = new THREE.MeshFaceMaterial(material);
            //var texture = THREE.ImageUtils.loadTexture("img/grass.jpg");
            //var material = new THREE.MeshLambertMaterial({map: texture});

            var mesh = new THREE.Mesh(geometry, material);

            models["road"] = mesh;
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

};
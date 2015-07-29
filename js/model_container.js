TRAFFICSIM_APP.ModelContainer = function() {
    var models = {};

    var modelsLoadedSum = 0;
    var allModelsSum = 1; // TODO HARDCODED

    this.loadModelsAsynchronously = function() {
        var loader = new THREE.JSONLoader();
        loader.load('models/road.json', function(geometry) {
            var material = new THREE.MeshBasicMaterial({
                wireframe: true,
                color: 'blue'
            });
            var mesh = new THREE.Mesh(geometry, material);
            var object = new THREE.Object3D();
            object.add(mesh);
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

};
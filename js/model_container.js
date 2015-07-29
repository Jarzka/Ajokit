TRAFFICSIM_APP.ModelContainer = function(application) {
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

};
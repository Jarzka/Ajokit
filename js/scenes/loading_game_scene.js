TRAFFICSIM_APP.scenes.LoadingGameScene = function (application) {
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
};
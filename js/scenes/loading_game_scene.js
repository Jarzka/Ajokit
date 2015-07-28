TRAFFICSIM_APP.scenes.LoadingGameScene = function (application) {
    var textureContainer = application.getTextureContainer();
    var startedLoadingTextures = false;

    this.update = function () {
        startLoadingTextures();
        checkTextureLoadingState();
        render();
    };

    function startLoadingTextures() {
        if (!startedLoadingTextures) {
            textureContainer.loadTexturesAsynchronously();
            startedLoadingTextures = true;
        }
    }

    function checkTextureLoadingState() {
        if (textureContainer.allTexturesLoaded()) {
            application.changeScene(new TRAFFICSIM_APP.scenes.GameplayScene(application));
        }
    }

    function render() {
        // TODO
    }
};
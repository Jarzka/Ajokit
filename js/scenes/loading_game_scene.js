(function() {
    TRAFFICSIM_APP.scenes = TRAFFICSIM_APP.scenes || {};
    TRAFFICSIM_APP.scenes.loading_game_scene = TRAFFICSIM_APP.scenes.loading_game_scene || {};

    var NS = TRAFFICSIM_APP.scenes.loading_game_scene;

    NS.LoadingGameScene = function (application) {
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
                $(".loadingDescription").text("Loading world...");
                application.changeScene(new TRAFFICSIM_APP.scenes.gameplay_scene.GameplayScene(application));
            }
        }

        function render() {
            if (!textureContainer.allTexturesLoaded()) {
                $(".loadingDescription").text("Loading textures & models...");
            }
        }
    };
})();
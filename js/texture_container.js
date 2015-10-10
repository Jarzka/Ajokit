(function() {
    TRAFFICSIM_APP.TextureContainer = function () {
        var logger = TRAFFICSIM_APP.utils.logger;

        var textures = {};

        var texturesLoadedSum = 0;
        var allTexturesSum = 12;

        this.loadTexturesAsynchronously = function () {
            THREE.ImageUtils.loadTexture("img/grass.jpg", undefined, function (texture) {
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(25, 25);
                textures["grass"] = texture;
                texturesLoadedSum++;
            });

            THREE.ImageUtils.loadTexture("img/road.jpg", undefined, function (texture) {
                textures["road"] = texture;
                texturesLoadedSum++;
            });

            THREE.ImageUtils.loadTexture("img/metal.jpg", undefined, function (texture) {
                textures["metal"] = texture;
                texturesLoadedSum++;
            });

            THREE.ImageUtils.loadTexture("img/car.jpg", undefined, function (texture) {
                textures["car"] = texture;
                texturesLoadedSum++;
            });

            THREE.ImageUtils.loadTexture("img/car_slow.jpg", undefined, function (texture) {
                textures["car_slow"] = texture;
                texturesLoadedSum++;
            });

            THREE.ImageUtils.loadTexture("img/car_fast.jpg", undefined, function (texture) {
                textures["car_fast"] = texture;
                texturesLoadedSum++;
            });


            textures["skybox"] = [
                new THREE.MeshBasicMaterial({
                    map: THREE.ImageUtils.loadTexture("img/sky_right.jpg", undefined, function (texture) {
                        texturesLoadedSum++;
                    }),
                    side: THREE.BackSide
                }),
                new THREE.MeshBasicMaterial({
                    map: THREE.ImageUtils.loadTexture("img/sky_left.jpg", undefined, function (texture) {
                        texturesLoadedSum++;
                    }),
                    side: THREE.BackSide
                }),
                new THREE.MeshBasicMaterial({
                    map: THREE.ImageUtils.loadTexture("img/sky_top.jpg", undefined, function (texture) {
                        texturesLoadedSum++;
                    }),
                    side: THREE.BackSide
                }),
                new THREE.MeshBasicMaterial({
                    map: THREE.ImageUtils.loadTexture("img/sky_base.jpg", undefined, function (texture) {
                        texturesLoadedSum++;
                    }),
                    side: THREE.BackSide
                }),
                new THREE.MeshBasicMaterial({
                    map: THREE.ImageUtils.loadTexture("img/sky_front.jpg", undefined, function (texture) {
                        texturesLoadedSum++;
                    }),
                    side: THREE.BackSide
                }),
                new THREE.MeshBasicMaterial({
                    map: THREE.ImageUtils.loadTexture("img/sky_back.jpg", undefined, function (texture) {
                        texturesLoadedSum++;
                    }),
                    side: THREE.BackSide
                })
            ];
        };

        this.allTexturesLoaded = function () {
            return texturesLoadedSum >= allTexturesSum;
        };

        this.getTextureByName = function (name) {
            if (textures.hasOwnProperty(name)) {
                return textures[name];
            }

            var errorMessage = "Texture " + name + " not found!";
            logger.log(logger.LogType.ERROR, errorMessage);
            throw new TRAFFICSIM_APP.exceptions.GeneralException(errorMessage);
        };
    };
})();
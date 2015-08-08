TRAFFICSIM_APP.TextureContainer = function () {
    var textures = {};

    var texturesLoadedSum = 0;
    var allTexturesSum = 7;

    this.loadTexturesAsynchronously = function () {
        THREE.ImageUtils.loadTexture("img/grass.jpg", undefined, function (texture) {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(10, 10);
            textures["grass"] = texture;
            texturesLoadedSum++;
        });

        THREE.ImageUtils.loadTexture("img/road.png", undefined, function (texture) {
            textures["road"] = texture;
            texturesLoadedSum++;
        });

        textures["skybox"] = [
            new THREE.MeshBasicMaterial({
                map: THREE.ImageUtils.loadTexture("img/sky_right.jpg", undefined, function(texture) {
                    texturesLoadedSum++;
                }),
                side: THREE.BackSide
            }),
            new THREE.MeshBasicMaterial({
                map: THREE.ImageUtils.loadTexture("img/sky_left.jpg", undefined, function(texture) {
                    texturesLoadedSum++;
                }),
                side: THREE.BackSide
            }),
            new THREE.MeshBasicMaterial({
                map: THREE.ImageUtils.loadTexture("img/sky_top.jpg", undefined, function(texture) {
                    texturesLoadedSum++;
                }),
                side: THREE.BackSide
            }),
            new THREE.MeshBasicMaterial({
                map: THREE.ImageUtils.loadTexture("img/sky_base.jpg", undefined, function(texture) {
                    texturesLoadedSum++;
                }),
                side: THREE.BackSide
            }),
            new THREE.MeshBasicMaterial({
                map: THREE.ImageUtils.loadTexture("img/sky_front.jpg", undefined, function(texture) {
                    texturesLoadedSum++;
                }),
                side: THREE.BackSide
            }),
            new THREE.MeshBasicMaterial({
                map: THREE.ImageUtils.loadTexture("img/sky_back.jpg", undefined, function(texture) {
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

        throw new TRAFFICSIM_APP.exceptions.GeneralException("Texture " + name + " not found!");
    }

};
(function () {
    TRAFFICSIM_APP.game = TRAFFICSIM_APP.game || {};

    var logger = TRAFFICSIM_APP.utils.logger;

    TRAFFICSIM_APP.game.TrafficLightBall = function (trafficLight, color, worldController, position) {
        TRAFFICSIM_APP.game.GameplayObject.call(this, worldController, createMesh(color));

        this._trafficLight = trafficLight;
        this.setPosition(position);

        function createMesh(color) {
            var geometry = new THREE.SphereGeometry(0.2, 32, 32);
            var material = new THREE.MeshBasicMaterial({color: color});
            return new THREE.Mesh(geometry, material);
        }
    };

    TRAFFICSIM_APP.game.TrafficLightBall.prototype = Object.create(TRAFFICSIM_APP.game.GameplayObject.prototype);

    TRAFFICSIM_APP.game.TrafficLightBall.prototype.changeColor = function(newColor) {
        this._model.material.color.setHex(newColor);
    }
})();

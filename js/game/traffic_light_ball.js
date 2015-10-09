(function () {
    TRAFFICSIM_APP.game = TRAFFICSIM_APP.game || {};
    TRAFFICSIM_APP.game.traffic_light_ball = TRAFFICSIM_APP.game.traffic_light_ball || {};

    var NS = TRAFFICSIM_APP.game.traffic_light_ball;
    var logger = TRAFFICSIM_APP.utils.logger;

    NS.TrafficLightBall = function (trafficLight, color, worldController, position) {
        TRAFFICSIM_APP.game.gameplay_object.GameplayObject.call(this, worldController, createMesh(color));

        this._trafficLight = trafficLight;
        this.setPosition(position);

        function createMesh(color) {
            var geometry = new THREE.SphereGeometry(0.2, 32, 32);
            var material = new THREE.MeshBasicMaterial({color: color});
            return new THREE.Mesh(geometry, material);
        }
    };

    NS.TrafficLightBall.prototype = Object.create(TRAFFICSIM_APP.game.gameplay_object.GameplayObject.prototype);

    NS.TrafficLightBall.prototype.changeColor = function (newColor) {
        this._model.material.color.setHex(newColor);
    };

    NS.TrafficLightBall.prototype.die = function () {
        TRAFFICSIM_APP.game.gameplay_object.GameplayObject.prototype.die.call(this);
    }

})();

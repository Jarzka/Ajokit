TRAFFICSIM_APP.WorldRenderer = function (worldController) {
    var renderer;
    var worldController = worldController;
    var drawDebugInfo = {
        "roadRouteLines": false
    };

    var roadRouteDebugLines = [];
    var roadRouteDebugPoints = [];
    var carCollisionMaskLines = [];

    initialize();
    addEventListeners();

    function addEventListeners() {
        $(window).resize(function() { // FIXME Still does not work correctly
            worldController.getCamera().aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    function initialize() {
        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMapEnabled = true;
        renderer.shadowMapSoft = true;
        document.body.appendChild(renderer.domElement);
        setupDebugLines();
    }

    function setupDebugLines() {
        if (drawDebugInfo.roadRouteLines) {
            insertRoadRouteDebugLinesAndPoints();
        }
    }

    this.render = function () {
        updateDebugLines();
        renderer.render(worldController.getThreeJSScene(), worldController.getCamera());
    };

    function updateDebugLines() {
        updateCarMaskDebugLines();
    }

    function updateCarMaskDebugLines() {
        // FIXME Very slow...
        carCollisionMaskLines.forEach(function(line) {
            worldController.getThreeJSScene().remove(line)
        });

        carCollisionMaskLines = [];

        worldController.getVehicleController().getVehicles().forEach(function(vehicle) {
            var collisionMaskPoints = vehicle.getCollisionMask();

            for (var i = 0; i < collisionMaskPoints.length; i++) {
                var startPoint, endPoint = null;
                if (i < collisionMaskPoints.length - 1) {
                    startPoint = collisionMaskPoints[i];
                    endPoint = collisionMaskPoints[i + 1];
                } else {
                    startPoint = collisionMaskPoints[i];
                    endPoint = collisionMaskPoints[0];
                }

                var debugLine = new THREE.Geometry();
                debugLine.vertices.push(new THREE.Vector3(
                    vehicle.getPosition().x + startPoint.x,
                    2,
                    vehicle.getPosition().z + startPoint.z));
                debugLine.vertices.push(new THREE.Vector3(
                    vehicle.getPosition().x + endPoint.x,
                    2,
                    vehicle.getPosition().z + endPoint.z));
                var material = new THREE.LineBasicMaterial({color: 0xffff00, linewidth: 2});
                debugLine = new THREE.Line(debugLine, material);
                carCollisionMaskLines.push(debugLine);
                worldController.getThreeJSScene().add(debugLine);
            }

        });
    }

    function insertRoadRouteDebugLinesAndPoints() {
        worldController.getRoadController().getRoutes().forEach(function (route) {
            var debugLine = new THREE.Geometry();
            debugLine.vertices.push(new THREE.Vector3(
                route.startNode.position.x,
                0.15,
                route.startNode.position.z));
            debugLine.vertices.push(new THREE.Vector3(
                route.endNode.position.x,
                0.15,
                route.endNode.position.z));
            var material = new THREE.LineBasicMaterial({color: 0x00ff00, linewidth: 2});
            debugLine = new THREE.Line(debugLine, material);
            roadRouteDebugLines.push(debugLine);
            worldController.getThreeJSScene().add(debugLine);
        });

        worldController.getRoadController().getNodes().forEach(function (node) {
            var debugLine = new THREE.Geometry();
            debugLine.vertices.push(new THREE.Vector3(
                node.position.x,
                0,
                node.position.z));
            debugLine.vertices.push(new THREE.Vector3(
                node.position.x,
                0.50,
                node.position.z));
            var material = new THREE.LineBasicMaterial({color: 0xff0000, linewidth: 4});
            debugLine = new THREE.Line(debugLine, material);
            roadRouteDebugLines.push(debugLine);
            worldController.getThreeJSScene().add(debugLine);
        });
    }
};
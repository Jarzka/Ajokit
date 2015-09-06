TRAFFICSIM_APP.WorldRenderer = function (worldController) {
    var renderer;
    var worldController = worldController;
    var drawDebugInfo = {
        "roadRouteLines": false,
        "collisionMasks": true,
        "vehicleCollisionPredictionPoints": true
    };

    var roadRouteDebugLines = [];
    var roadRouteDebugPoints = [];
    var vehicleCollisionMaskLines = [];
    var vehicleCollisionPredictionMaskLines = [];

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
        if (drawDebugInfo.collisionMasks) {
            updateCarMaskDebugLines();
        }

        if (drawDebugInfo.vehicleCollisionPredictionPoints) {
            updateVehicleCollisionPredictionPoints();
        }
    }

    function updateCarMaskDebugLines() {
        /* FIXME Very slow to destroy and re-create objects on every frame. There should be a way to easily
        /* update the existing debug lines... */
        vehicleCollisionMaskLines.forEach(function(line) {
            worldController.getThreeJSScene().remove(line)
        });

        vehicleCollisionMaskLines = [];

        worldController.getVehicleController().getVehicles().forEach(function(vehicle) {
            var collisionMaskPoints = vehicle.getCollisionMaskInWorld();

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
                    startPoint.x,
                    1,
                    startPoint.z));
                debugLine.vertices.push(new THREE.Vector3(
                    endPoint.x,
                    1,
                    endPoint.z));
                var material = new THREE.LineBasicMaterial({color: 0xffff00, linewidth: 2});
                debugLine = new THREE.Line(debugLine, material);
                vehicleCollisionMaskLines.push(debugLine);
                worldController.getThreeJSScene().add(debugLine);
            }

        });
    }

    function updateVehicleCollisionPredictionPoints() {
        /* FIXME Very slow to destroy and re-create objects on every frame. There should be a way to easily
         /* update the existing debug lines... */
        vehicleCollisionPredictionMaskLines.forEach(function(line) {
            worldController.getThreeJSScene().remove(line)
        });

        vehicleCollisionPredictionMaskLines = [];

        worldController.getVehicleController().getVehicles().forEach(function(vehicle) {
            var collisionPredictionPolygon = vehicle.getCollisionPredictionPolygon();

            if (collisionPredictionPolygon) {
                for (var i = 0; i < collisionPredictionPolygon.length; i++) {
                    var startPoint, endPoint = null;
                    if (i < collisionPredictionPolygon.length - 1) {
                        startPoint = collisionPredictionPolygon[i];
                        endPoint = collisionPredictionPolygon[i + 1];
                    } else {
                        startPoint = collisionPredictionPolygon[i];
                        endPoint = collisionPredictionPolygon[0];
                    }

                    var debugLine = new THREE.Geometry();
                    debugLine.vertices.push(new THREE.Vector3(
                        startPoint.x,
                        1,
                        startPoint.z));
                    debugLine.vertices.push(new THREE.Vector3(
                        endPoint.x,
                        1,
                        endPoint.z));
                    var material = new THREE.LineBasicMaterial({color: 0xff0f00, linewidth: 2});
                    debugLine = new THREE.Line(debugLine, material);
                    vehicleCollisionPredictionMaskLines.push(debugLine);
                    worldController.getThreeJSScene().add(debugLine);
                }
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
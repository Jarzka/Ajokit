TRAFFICSIM_APP.WorldRenderer = function (worldController) {
    var renderer;
    var worldController = worldController;
    var drawDebugInfo = {
        "roadRouteLines": false,
        "collisionMasks": false,
        "vehicleCollisionPredictionPoints": false
    };

    var roadRouteDebugLines = [];
    var roadRouteDebugPoints = [];
    var vehicleCollisionMaskLines = [];
    var vehicleCollisionPredictionMaskLines = [];
    var editModeRectangle = [];

    initialize();
    addEventListeners();

    function addEventListeners() {
        $(window).resize(function() {
            if (worldController.getCamera) {
                worldController.getCamera().aspect = window.innerWidth / window.innerHeight;
                worldController.getCamera().updateProjectionMatrix();

                renderer.setSize(window.innerWidth, window.innerHeight);
            }
        });
    }

    function initialize() {
        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMapEnabled = true;
        renderer.shadowMapSoft = true;
        document.body.appendChild(renderer.domElement);
    }

    this.render = function () {
        updateDebugLines();
        updateEditModeRectangle();
        renderer.render(worldController.getThreeJSScene(), worldController.getCamera());
    };

    function updateDebugLines() {
        if (drawDebugInfo.roadRouteLines) {
            updateRoadRouteDebugLinesAndPoints();
        }

        if (drawDebugInfo.collisionMasks) {
            updateCarMaskDebugLines();
        }

        if (drawDebugInfo.vehicleCollisionPredictionPoints) {
            updateVehicleCollisionPredictionPoints();
        }
    }

    function updateEditModeRectangle() {
        updateLinesInScene();
        updateLinePositions();

        function updateLinePositions() {
            if (editModeRectangle.length > 0) {
                var tileSize = worldController.getMap().getTileSize();
                editModeRectangle[0].geometry.vertices[0] = new THREE.Vector3(
                    Math.floor(worldController.getMouseWorldCoordinates().x / tileSize) * tileSize,
                    1,
                    (Math.floor(worldController.getMouseWorldCoordinates().z  / tileSize) * tileSize));
                editModeRectangle[0].geometry.verticesNeedUpdate = true;
                editModeRectangle[0].geometry.vertices[1] = new THREE.Vector3(
                    Math.floor((worldController.getMouseWorldCoordinates().x + tileSize) / tileSize) * tileSize,
                    1,
                    (Math.floor(worldController.getMouseWorldCoordinates().z / tileSize) * tileSize));
                editModeRectangle[0].geometry.verticesNeedUpdate = true;

                editModeRectangle[1].geometry.vertices[0] = new THREE.Vector3(
                    Math.floor((worldController.getMouseWorldCoordinates().x + tileSize) / tileSize) * tileSize,
                    1,
                    (Math.floor(worldController.getMouseWorldCoordinates().z / tileSize) * tileSize));
                editModeRectangle[1].geometry.verticesNeedUpdate = true;
                editModeRectangle[1].geometry.vertices[1] = new THREE.Vector3(
                    Math.floor((worldController.getMouseWorldCoordinates().x + tileSize) / tileSize) * tileSize,
                    1,
                    (Math.floor((worldController.getMouseWorldCoordinates().z + tileSize) / tileSize) * tileSize));
                editModeRectangle[1].geometry.verticesNeedUpdate = true;

                editModeRectangle[2].geometry.vertices[0] = new THREE.Vector3(
                    Math.floor((worldController.getMouseWorldCoordinates().x + tileSize) / tileSize) * tileSize,
                    1,
                    (Math.floor((worldController.getMouseWorldCoordinates().z + tileSize) / tileSize) * tileSize));
                editModeRectangle[2].geometry.verticesNeedUpdate = true;
                editModeRectangle[2].geometry.vertices[1] = new THREE.Vector3(
                    Math.floor(worldController.getMouseWorldCoordinates().x / tileSize) * tileSize,
                    1,
                    (Math.floor((worldController.getMouseWorldCoordinates().z + tileSize) / tileSize) * tileSize));
                editModeRectangle[2].geometry.verticesNeedUpdate = true;

                editModeRectangle[3].geometry.vertices[0] = new THREE.Vector3(
                    Math.floor(worldController.getMouseWorldCoordinates().x / tileSize) * tileSize,
                    1,
                    (Math.floor((worldController.getMouseWorldCoordinates().z + tileSize) / tileSize) * tileSize));
                editModeRectangle[3].geometry.verticesNeedUpdate = true;
                editModeRectangle[3].geometry.vertices[1] = new THREE.Vector3(
                    Math.floor(worldController.getMouseWorldCoordinates().x / tileSize) * tileSize,
                    1,
                    (Math.floor(worldController.getMouseWorldCoordinates().z / tileSize) * tileSize));
                editModeRectangle[3].geometry.verticesNeedUpdate = true;
            }
        }

        function updateLinesInScene() {
            if (worldController.isEditModeOn()) {
                if (editModeRectangle.length === 0) {
                    // TOP

                    var rectangleTop = new THREE.Geometry();
                    rectangleTop.vertices.push(new THREE.Vector3(0, 1, 0));
                    rectangleTop.vertices.push(new THREE.Vector3(8, 1, 0));
                    var topMaterial = new THREE.LineBasicMaterial({color: 0x00ffff, linewidth: 2});
                    rectangleTop = new THREE.Line(rectangleTop, topMaterial);
                    editModeRectangle.push(rectangleTop);
                    worldController.getThreeJSScene().add(rectangleTop);

                    // RIGHT

                    var rectangleRight = new THREE.Geometry();
                    rectangleRight.vertices.push(new THREE.Vector3(8, 1, 0));
                    rectangleRight.vertices.push(new THREE.Vector3(8, 1, 8));
                    var rightMaterial = new THREE.LineBasicMaterial({color: 0x00ffff, linewidth: 2});
                    rectangleRight = new THREE.Line(rectangleRight, rightMaterial);
                    editModeRectangle.push(rectangleRight);
                    worldController.getThreeJSScene().add(rectangleRight);

                    // BOTTOM

                    var rectangleBottom = new THREE.Geometry();
                    rectangleBottom.vertices.push(new THREE.Vector3(8, 1, 8));
                    rectangleBottom.vertices.push(new THREE.Vector3(0, 1, 8));
                    var bottomMaterial = new THREE.LineBasicMaterial({color: 0x00ffff, linewidth: 2});
                    rectangleBottom = new THREE.Line(rectangleBottom, bottomMaterial);
                    editModeRectangle.push(rectangleBottom);
                    worldController.getThreeJSScene().add(rectangleBottom);

                    // LEFT

                    var rectangleLeft = new THREE.Geometry();
                    rectangleLeft.vertices.push(new THREE.Vector3(0, 1, 8));
                    rectangleLeft.vertices.push(new THREE.Vector3(0, 1, 0));
                    var leftMaterial = new THREE.LineBasicMaterial({color: 0x00ffff, linewidth: 2});
                    rectangleLeft = new THREE.Line(rectangleLeft, leftMaterial);
                    editModeRectangle.push(rectangleLeft);
                    worldController.getThreeJSScene().add(rectangleLeft);
                }
            } else {
                editModeRectangle.forEach(function(line) {
                    worldController.getThreeJSScene().remove(line);
                });

                editModeRectangle = [];
            }
        }

    }

    function updateCarMaskDebugLines() {
        // FIXME VERY SLOW, but used only in development machines so proably there is no immediate need to fix this
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
        // FIXME VERY SLOW, but used only in development machines so proably there is no immediate need to fix this
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

    function  updateRoadRouteDebugLinesAndPoints() {
        // FIXME VERY SLOW, but used only in development machines so proably there is no immediate need to fix this
        roadRouteDebugLines.forEach(function(line) {
            worldController.getThreeJSScene().remove(line)
        });

        roadRouteDebugPoints.forEach(function(point) {
            worldController.getThreeJSScene().remove(point)
        });

        roadRouteDebugLines = [];
        roadRouteDebugPoints = [];

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
            var material = new THREE.LineBasicMaterial({color: resolveRouteLineColor(route), linewidth: 2});
            debugLine = new THREE.Line(debugLine, material);
            roadRouteDebugLines.push(debugLine);
            worldController.getThreeJSScene().add(debugLine);
        });

        worldController.getRoadController().getNodes().forEach(function (node) {
            var debugPoint = new THREE.Geometry();
            debugPoint.vertices.push(new THREE.Vector3(
                node.position.x,
                0,
                node.position.z));
            debugPoint.vertices.push(new THREE.Vector3(
                node.position.x,
                0.50,
                node.position.z));
            var material = new THREE.LineBasicMaterial({color: 0xff0000, linewidth: 4});
            debugPoint = new THREE.Line(debugPoint, material);
            roadRouteDebugPoints.push(debugPoint);
            worldController.getThreeJSScene().add(debugPoint);
        });

        function resolveRouteLineColor(route) {
            if (route.isFree()) {
                return 0x00ff00;
            }

            return 0xff0000;
        }
    }
};
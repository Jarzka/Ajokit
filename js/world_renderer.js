TRAFFICSIM_APP.WorldRenderer = function (worldController) {
    var renderer;
    var worldController = worldController;
    var drawDebugInfo = {
        "roadRouteLines": false
    };

    var roadRouteDebugLines = [];
    var roadRouteDebugPoints = [];

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
            insertDebugLinesAndPoints();
        }
    }

    this.render = function () {
        renderer.render(worldController.getThreeJSScene(), worldController.getCamera());
    };


    function insertDebugLinesAndPoints() {
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
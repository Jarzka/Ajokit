TRAFFICSIM_APP.game = TRAFFICSIM_APP.game || {};

TRAFFICSIM_APP.game.RoadRouteController = function (worldController) {
    var self = this;

    var worldController = worldController;
    var map = worldController.getMap();
    var roads = [];
    var nodes = [];
    var routes = [];
    var routeLines = [];

    this.getWorldController = function () {
        return this._worldController;
    };

    this.initializeRoadRoute = function (road) {
        var newNodes = [];
        road.getNodePositions().forEach(function (position) {
            var node = new TRAFFICSIM_APP.game.RoadNode(self._worldController, position);
            newNodes.push(node);
        });

        var newRoutes = [];
        road.getNodeConnections().forEach(function (connection) {
            var route = new TRAFFICSIM_APP.game.RoadRoute(self._worldController,
                newNodes[connection[0]],
                newNodes[connection[1]]
            );
            newRoutes.push(route);
        });

        nodes = nodes.concat(newNodes);
        routes = routes.concat(newRoutes);

        // Initialize debug lines
        newRoutes.forEach(function (route) {
            var x = road.getPosition().x;
            var z = road.getPosition().z;

            var line = new THREE.Geometry();
            line.vertices.push(new THREE.Vector3(
                x - (map.getTileSize() / 2) + (route.getStartNode().position.x * map.getTileSize()),
                0.15,
                z - (map.getTileSize() / 2) + (route.getStartNode().position.z)));
            line.vertices.push(new THREE.Vector3(
                x - (map.getTileSize() / 2) + (route.getEndNode().position.x * map.getTileSize()),
                0.15,
                z - (map.getTileSize() / 2) + (route.getEndNode().position.z * map.getTileSize())));
            var material = new THREE.LineBasicMaterial({color: 0x00ff00, linewidth: 2});
            line = new THREE.Line(line, material);
            routeLines.push(line);
            worldController.getThreeJSScene().add(line);
        });
    };

    this.insertRoad = function (type, x, z) {
        var road = new TRAFFICSIM_APP.game.Road(
            worldController,
            worldController.getGameplayScene().getApplication().getModelContainer().getModelByName("road_vertical").clone(),
            "VERTICAL");
        road.setPosition(
            {
                "x": x,
                "y": 0,
                "z": z
            });
        roads.push(road);
        worldController.getThreeJSScene().add(road.getModel());

        this.initializeRoadRoute(road);
    }
};
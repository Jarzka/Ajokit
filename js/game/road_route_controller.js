TRAFFICSIM_APP.game = TRAFFICSIM_APP.game || {};

TRAFFICSIM_APP.game.RoadRouteController = function (worldController) {
    var self = this;

    var worldController = worldController;
    var map = worldController.getMap();
    var roads = [];
    var nodes = [];
    var routes = [];

    var debugLines = [];
    var debugPoints = [];

    this.getWorldController = function () {
        return this._worldController;
    };

    // FIXME NOT TESTED!
    function mergeNodes(node1, node2) {
        var mergedNode = new TRAFFICSIM_APP.game.RoadNode(self._worldController, node1.position);

        routes.forEach(function(route) {
            if (route.startNode == node1 || route.startNode == node2) {
                route.startNode = mergedNode;
            }

            if (route.endNode == node1 || route.endNode == node2) {
                route.endNode = mergedNode;
            }
        });
    }

    // FIXME NOT TESTED!
    function mergeAllRoadNodes() {
        var mergedNodes = [];

        nodes.forEach(function (node) {
            if (!node.isMerged) {
                // Check if there is a node close to this node
                nodes.forEach(function (otherNode) {
                    if (otherNode != node) {
                        if (TRAFFICSIM_APP.utils.math.distance(
                                node.getPosition().x,
                                node.getPosition().y,
                                otherNode.getPosition().x,
                                otherNode.getPosition().y) <= 0.1) {
                            mergedNodes.push(mergeNodes(node, otherNode));

                            otherNode.isMerged = false;
                        }
                    }
                });

                node.isMerged = true;
            }
        });

        nodes = mergedNodes;
    }

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

        // Initialize debug lines & points
        newRoutes.forEach(function (route) {
            var x = road.getPosition().x;
            var z = road.getPosition().z;

            var debugLine = new THREE.Geometry();
            debugLine.vertices.push(new THREE.Vector3(
                x - (map.getTileSize() / 2) + (route.startNode.position.x * map.getTileSize()),
                0.15,
                z - (map.getTileSize() / 2) + (route.startNode.position.z)));
            debugLine.vertices.push(new THREE.Vector3(
                x - (map.getTileSize() / 2) + (route.endNode.position.x * map.getTileSize()),
                0.15,
                z - (map.getTileSize() / 2) + (route.endNode.position.z * map.getTileSize())));
            var material = new THREE.LineBasicMaterial({color: 0x00ff00, linewidth: 2});
            debugLine = new THREE.Line(debugLine, material);
            debugLines.push(debugLine);
            worldController.getThreeJSScene().add(debugLine);

            var debugPoint = new THREE.Geometry();
            debugPoint.vertices.push(new THREE.Vector3(
                x - (map.getTileSize() / 2) + (route.startNode.position.x * map.getTileSize()),
                0,
                z - (map.getTileSize() / 2) + (route.startNode.position.z)));
            debugPoint.vertices.push(new THREE.Vector3(
                x - (map.getTileSize() / 2) + (route.startNode.position.x * map.getTileSize()),
                0.25,
                z - (map.getTileSize() / 2) + (route.startNode.position.z)));
            var material = new THREE.LineBasicMaterial({color: 0xff0000, linewidth: 4});
            debugPoint = new THREE.Line(debugPoint, material);
            debugPoints.push(debugPoint);
            worldController.getThreeJSScene().add(debugPoint);
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

        //mergeAllRoadNodes();
    }
};
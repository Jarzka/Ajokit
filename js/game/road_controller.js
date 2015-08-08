(function () {

    TRAFFICSIM_APP.game = TRAFFICSIM_APP.game || {};

    var logger = TRAFFICSIM_APP.utils.logger;

    TRAFFICSIM_APP.game.RoadController = function (worldController) {
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

        this.getNodes = function () {
            return nodes;
        };

        function mergeNodes(node1, node2) {
            var mergedNode = new TRAFFICSIM_APP.game.RoadNode(self._worldController, node1.position);

            routes.forEach(function (route) {
                if (route.startNode == node1 || route.startNode == node2) {
                    route.startNode = mergedNode;
                    mergedNode.addConnectedRoute(route);
                }

                if (route.endNode == node1 || route.endNode == node2) {
                    route.endNode = mergedNode;
                    mergedNode.addConnectedRoute(route);
                }
            });

            return mergedNode;
        }

        function checkThereAreNoOrphanNodes() {
            nodes.forEach(function (node) {
                if (node.getConnectedRoutes().length === 0) {
                    logger.log(logger.LogType.ERROR, "Node has no connections!");
                }
            });
        }

        /** Merges all nodes that are close to each other. */
        // FIXME Works if for each node there are no more than one node to be merged.
        this.mergeAllRoadNodes = function () {
            logger.log(logger.LogType.DEBUG, "Mergin all road nodes...");
            var allMergedNodes = [];

            nodes.forEach(function (node) {
                if (!node.__isMerged) {
                    var mergedToThisNode = [];
                    // Check if there is a node close to this node
                    nodes.forEach(function (otherNode) {
                        if (otherNode != node) {
                            var distance = TRAFFICSIM_APP.utils.math.distance(
                                node.position.x,
                                node.position.y,
                                node.position.z,
                                otherNode.position.x,
                                otherNode.position.y,
                                otherNode.position.z);
                            if (distance <= 0.1) {
                                logger.log(logger.LogType.DEBUG, "Merging two nodes that are close to each other. Distance: " + distance);
                                mergedToThisNode.push(mergeNodes(node, otherNode));

                                otherNode.__isMerged = true;
                            }
                        }
                    });

                    node.__isMerged = true;

                    if (mergedToThisNode.length == 0) {
                        mergedToThisNode.push(node);
                    }

                    allMergedNodes = allMergedNodes.concat(mergedToThisNode);
                }
            });

            // Operation completed, clear merged status.
            nodes.forEach(function (node) {
                node.__isMerged = false;
            });

            logger.log(logger.LogType.DEBUG, "Before merge there are " + nodes.length + " nodes.");
            nodes = allMergedNodes;
            logger.log(logger.LogType.DEBUG, "After merge there are " + nodes.length + " nodes left.");

            checkThereAreNoOrphanNodes();
        };

        /** Takes road object as input and creates its nodes and routes. */
        this.initializeRoadRoute = function (road) {
            if (road.getNodePositionsRelativeToRoad().length != 0) {
                var newNodes = [];
                road.getNodePositionsRelativeToRoad().forEach(function (relativePosition) {
                    var positionInWorld =
                    {
                        "x": road.getPosition().x - (map.getTileSize() / 2) + (relativePosition.x * map.getTileSize()),
                        "y": 0,
                        "z": road.getPosition().z - (map.getTileSize() / 2) + (relativePosition.z * map.getTileSize())
                    };
                    var node = new TRAFFICSIM_APP.game.RoadNode(self._worldController, positionInWorld);
                    newNodes.push(node);
                });

                var newRoutes = [];
                road.getNodeConnections().forEach(function (connection) {
                    var route = new TRAFFICSIM_APP.game.RoadRoute(self._worldController,
                        newNodes[connection[0]],
                        newNodes[connection[1]]
                    );
                    newNodes[connection[0]].addConnectedRoute(route);
                    newNodes[connection[1]].addConnectedRoute(route);
                    newRoutes.push(route);
                });

                nodes = nodes.concat(newNodes);
                routes = routes.concat(newRoutes);

                checkThereAreNoOrphanNodes();
            }
        };

        function updateDebugLinesAndPoints() {
            /* FIXME There has to be a better way to do this, if an object is removed or its properties are changed,
             * it should be possible to update ThreeJS scene too - and easily. */
            debugLines.forEach(function (line) {
                worldController.getThreeJSScene().remove(line);
            });
            debugPoints.forEach(function (point) {
                worldController.getThreeJSScene().remove(point);
            });
            debugLines = [];
            debugPoints = [];

            routes.forEach(function (route) {
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
                debugLines.push(debugLine);
                worldController.getThreeJSScene().add(debugLine);
            });

            nodes.forEach(function (node) {
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
                debugLines.push(debugLine);
                worldController.getThreeJSScene().add(debugLine);
            });
        }

        this.insertRoad = function (type, x, z) {
            var road = new TRAFFICSIM_APP.game.Road(
                worldController,
                type);
            road.setPosition(
                {
                    "x": x,
                    "y": 0,
                    "z": z
                });
            roads.push(road);
            worldController.getThreeJSScene().add(road.getModel());

            this.initializeRoadRoute(road);

            updateDebugLinesAndPoints();
        };
    };

})();
(function () {

    TRAFFICSIM_APP.game = TRAFFICSIM_APP.game || {};
    TRAFFICSIM_APP.game.road_controller = TRAFFICSIM_APP.game.road_controller || {};

    var NS = TRAFFICSIM_APP.game.road_controller;
    var logger = TRAFFICSIM_APP.utils.logger;
    var Vector3 = TRAFFICSIM_APP.utils.vector3.Vector3;

   NS.RoadController = function (worldController) {
        var self = this;

        var worldController = worldController;
        var map = worldController.getMap();
        var roads = [];
        var nodes = [];
        var routes = [];

        this.getWorldController = function () {
            return this._worldController;
        };

        this.getNodes = function () {
            return nodes;
        };

        function mergeNodes(node1, node2) {
            var mergedNode = new TRAFFICSIM_APP.game.road_node.RoadNode(self._worldController, node1.position);

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

        this.removeOrphanNodes = function() {
            var orphantNodes = nodes.filter(function (node) {
                return node.getConnectedRoutes().length === 0;
            });

            orphantNodes.forEach(function(node) {
                var index = nodes.indexOf(node);
                if (index > -1) {
                    nodes.splice(index, 1);
                }
            });
        };

        /** Merges all nodes that are close to each other. */
        this.mergeNodesCloseToEachOther = function () {
            mergingLoop:
                while (true) {
                    for (var i = 0; i < nodes.length; i++) {
                        var node = nodes[i];
                        for (var j = 0; j < nodes.length; j++) {
                            var otherNode = nodes[j];

                            if (otherNode != node) {
                                var distance = TRAFFICSIM_APP.utils.math.distance(
                                    node.position.x,
                                    node.position.y,
                                    node.position.z,
                                    otherNode.position.x,
                                    otherNode.position.y,
                                    otherNode.position.z);
                                if (distance <= 0.1) {
                                    var mergedNode = mergeNodes(node, otherNode);
                                    nodes.splice(nodes.indexOf(node), 1);
                                    nodes.splice(nodes.indexOf(otherNode), 1);
                                    nodes.push(mergedNode);
                                    continue mergingLoop; // Collection changed, start again. FIXME: Slow...
                                }
                            }
                        }
                    }

                    break; // All nodes merged, stop merging
                }
        };

        /** Takes road object as input and creates its nodes and routes. */
        this.initializeRoadRoute = function (road) {
            if (road.getNodePositionsRelativeToRoad().length != 0) {
                var newNodes = [];
                road.getNodePositionsRelativeToRoad().forEach(function (relativePosition) {
                    var positionInWorld = new Vector3(road.getPosition().x - (map.getTileSize() / 2) + (relativePosition.x * map.getTileSize()),
                        0,
                        road.getPosition().z - (map.getTileSize() / 2) + (relativePosition.z * map.getTileSize()));
                    var node = new TRAFFICSIM_APP.game.road_node.RoadNode(worldController, positionInWorld);
                    newNodes.push(node);
                });

                var newRoutes = [];
                road.getNodeConnections().forEach(function (connection) {
                    if (connection.controlPoints) {
                        var controlPointsInWorld = [];
                        connection.controlPoints.forEach(function (relativeControlPoint) {
                            var controlPointInWorld = new Vector3(road.getPosition().x - (map.getTileSize() / 2) + (relativeControlPoint.x * map.getTileSize()),
                                0,
                                road.getPosition().z - (map.getTileSize() / 2) + (relativeControlPoint.z * map.getTileSize()));
                            controlPointsInWorld.push(controlPointInWorld);
                        });
                        var route = new TRAFFICSIM_APP.game.road_route_bezier_curve.RoadRouteBezierCurve(worldController,
                            road,
                            newNodes[connection.start],
                            newNodes[connection.end],
                            controlPointsInWorld
                        );
                    } else {
                        var route = new TRAFFICSIM_APP.game.road_route_line.RoadRouteLine(worldController,
                            road,
                            newNodes[connection.start],
                            newNodes[connection.end]
                        );
                    }

                    newNodes[connection.start].addConnectedRoute(route);
                    newNodes[connection.end].addConnectedRoute(route);
                    route.setRouteId(connection.id);
                    newRoutes.push(route);
                });

                road.setRoutes(newRoutes);

                nodes = nodes.concat(newNodes);
                routes = routes.concat(newRoutes);
            }
        };

        this.insertRoad = function (type, x, z) {
            var road = new TRAFFICSIM_APP.game.road.Road(
                worldController,
                type,
                new Vector3(x, 0, z));
            roads.push(road);

            this.initializeRoadRoute(road);
            this.mergeAndRemoveOrphans();
        };

       this.mergeAndRemoveOrphans = function () {
           this.mergeNodesCloseToEachOther();
           this.removeOrphanNodes();
       };

        this.update = function() {
            roads.forEach(function (road) {
                road.update();
            });
        };

        this.getRoutes = function() {
            return routes;
        };

        this.getRoads = function() {
            return roads;
        };

        this.getNodes = function() {
            return nodes;
        };

    };

})();
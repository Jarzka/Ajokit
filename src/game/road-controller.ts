import { RoadNode } from "./road-node";
import { Road } from "./road";
import { RoadRouteLine } from "./road-route-line";
import { RoadRouteBezierCurve } from "./road-route-bezier-curve";
import { Vector3 } from "../utils/vector3";
import * as math from "../utils/math";
import type { RoadRoute } from "./road-route";
import type { WorldController } from "./world-controller";

export class RoadController {
  private readonly _worldController: WorldController;
  private readonly _map: any;
  private readonly _roads: Road[] = [];
  private _nodes: RoadNode[] = [];
  private _routes: RoadRoute[] = [];

  constructor(worldController: WorldController) {
    this._worldController = worldController;
    this._map = worldController.getMap();
  }

  public getWorldController(): WorldController {
    return this._worldController;
  }

  public getNodes(): RoadNode[] {
    return this._nodes;
  }

  private _mergeNodes(node1: RoadNode, node2: RoadNode): RoadNode {
    const mergedNode = new RoadNode(this._worldController, node1.position);

    for (const route of this._routes) {
      if (route.startNode === node1 || route.startNode === node2) {
        route.startNode = mergedNode;
        mergedNode.addConnectedRoute(route);
      }

      if (route.endNode === node1 || route.endNode === node2) {
        route.endNode = mergedNode;
        mergedNode.addConnectedRoute(route);
      }
    }

    return mergedNode;
  }

  public removeOrphanNodes(): void {
    const orphanNodes = this._nodes.filter((node) => {
      return node.getConnectedRoutes().length === 0;
    });

    for (const node of orphanNodes) {
      const index = this._nodes.indexOf(node);
      if (index > -1) {
        this._nodes.splice(index, 1);
      }
    }
  }

  /** Merges all nodes that are close to each other. */
  public mergeNodesCloseToEachOther(): void {
    mergingLoop: while (true) {
      for (let i = 0; i < this._nodes.length; i++) {
        const node = this._nodes[i];
        for (let j = 0; j < this._nodes.length; j++) {
          const otherNode = this._nodes[j];

          if (otherNode !== node) {
            const dist = math.distance(
              node.position.x,
              node.position.y,
              node.position.z,
              otherNode.position.x,
              otherNode.position.y,
              otherNode.position.z
            );
            if (dist <= 0.1) {
              const mergedNode = this._mergeNodes(node, otherNode);
              this._nodes.splice(this._nodes.indexOf(node), 1);
              this._nodes.splice(this._nodes.indexOf(otherNode), 1);
              this._nodes.push(mergedNode);
              continue mergingLoop; // Collection changed, start again. FIXME: Slow...
            }
          }
        }
      }

      break; // All nodes merged, stop merging
    }
  }

  /** Takes road object as input and creates its nodes and routes. */
  public initializeRoadRoute(road: Road): void {
    if (road.getNodePositionsRelativeToRoad().length !== 0) {
      const newNodes: RoadNode[] = [];
      for (const relativePosition of road.getNodePositionsRelativeToRoad()) {
        const positionInWorld = new Vector3(
          road.getPosition().x - this._map.getTileSize() / 2 + relativePosition.x * this._map.getTileSize(),
          0,
          road.getPosition().z - this._map.getTileSize() / 2 + relativePosition.z * this._map.getTileSize()
        );
        const node = new RoadNode(this._worldController, positionInWorld);
        newNodes.push(node);
      }

      const newRoutes: RoadRoute[] = [];
      for (const connection of road.getNodeConnections()) {
        let route: RoadRoute;
        if (connection.controlPoints) {
          const controlPointsInWorld: Vector3[] = [];
          for (const relativeControlPoint of connection.controlPoints) {
            const controlPointInWorld = new Vector3(
              road.getPosition().x - this._map.getTileSize() / 2 + relativeControlPoint.x * this._map.getTileSize(),
              0,
              road.getPosition().z - this._map.getTileSize() / 2 + relativeControlPoint.z * this._map.getTileSize()
            );
            controlPointsInWorld.push(controlPointInWorld);
          }
          route = new RoadRouteBezierCurve(
            this._worldController,
            road as any,
            newNodes[connection.start],
            newNodes[connection.end],
            controlPointsInWorld
          );
        } else {
          route = new RoadRouteLine(
            this._worldController,
            road as any,
            newNodes[connection.start],
            newNodes[connection.end]
          );
        }

        newNodes[connection.start].addConnectedRoute(route);
        newNodes[connection.end].addConnectedRoute(route);
        route.setRouteId(connection.id);
        newRoutes.push(route);
      }

      road.setRoutes(newRoutes);

      this._nodes = this._nodes.concat(newNodes);
      this._routes = this._routes.concat(newRoutes);
    }
  }

  public insertRoad(type: number, x: number, z: number): void {
    const road = new Road(this._worldController, type, new Vector3(x, 0, z));
    this._roads.push(road);

    this.initializeRoadRoute(road);
    this.mergeAndRemoveOrphans();
  }

  public mergeAndRemoveOrphans(): void {
    this.mergeNodesCloseToEachOther();
    this.removeOrphanNodes();
  }

  public update(): void {
    for (const road of this._roads) {
      road.update();
    }
  }

  public getRoutes(): RoadRoute[] {
    return this._routes;
  }

  public getRoads(): Road[] {
    return this._roads;
  }
}

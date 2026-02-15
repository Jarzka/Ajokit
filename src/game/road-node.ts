import { Vector3 } from "../utils/vector3";
import type { RoadRoute } from "./road-route";
import type { WorldController } from "./world-controller";

let _nextRoadNodeId = 0;

export class RoadNode {
  public readonly position: Vector3;
  private readonly _worldController: WorldController;
  private readonly _connectedRoutes: RoadRoute[] = [];
  private readonly _nodeId: number;

  constructor(worldController: WorldController, position: { x: number; y: number; z: number }) {
    this._worldController = worldController;
    this.position = new Vector3(position.x, position.y, position.z);
    this._nodeId = _nextRoadNodeId++;
  }

  public getConnectedRoutes(): RoadRoute[] {
    return this._connectedRoutes;
  }

  public getConnectedStartingRoutes(): RoadRoute[] {
    return this._connectedRoutes.filter((route) => route.startNode === this);
  }

  public getConnectedFreeStartingRoutes(): RoadRoute[] {
    return this._connectedRoutes.filter((route) => route.startNode === this && route.isFree());
  }

  public addConnectedRoute(route: RoadRoute): void {
    this._connectedRoutes.push(route);
  }

  public removeConnectedRoute(route: RoadRoute): void {
    const index = this._connectedRoutes.indexOf(route);
    if (index > -1) {
      this._connectedRoutes.splice(index, 1);
    }
  }
}

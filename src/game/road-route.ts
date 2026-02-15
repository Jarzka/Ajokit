import type { Road } from "./road";
import type { WorldController } from "./world-controller";
import type { RoadNode } from "./road-node";

export abstract class RoadRoute {
  protected readonly _worldController: WorldController;
  public startNode: RoadNode;
  public endNode: RoadNode;
  protected _routeId: string | undefined = undefined;
  private _isFree: boolean = true;
  protected readonly _road: Road;

  constructor(worldController: WorldController, road: Road, startNode: RoadNode, endNode: RoadNode) {
    this._worldController = worldController;
    this.startNode = startNode;
    this.endNode = endNode;
    this._road = road;
  }

  public isFree(): boolean {
    return this._isFree;
  }

  public setFree(value: boolean): void {
    this._isFree = value;
  }

  public getRouteId(): string | undefined {
    return this._routeId;
  }

  public setRouteId(routeId: string | undefined): void {
    this._routeId = routeId;
  }

  public getRoad(): Road {
    return this._road;
  }

  public getTargetNode(): RoadNode {
    return this.endNode;
  }

  public abstract getNextPoint(position: { x: number; y: number; z: number }): { x: number; y: number; z: number };

  public abstract getNextPointAtDistance(
    position: { x: number; y: number; z: number },
    distance: number
  ): { x: number; y: number; z: number };

  public abstract getNextPointAtDistanceOrContinue(
    position: { x: number; y: number; z: number },
    distance: number,
    nextRoute: RoadRoute | undefined
  ): { x: number; y: number; z: number };
}

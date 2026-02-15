import { RoadRoute } from "./road-route";
import { Vector3 } from "../utils/vector3";
import * as math from "../utils/math";
import type { Road } from "./road";
import type { WorldController } from "./world-controller";
import type { RoadNode } from "./road-node";

export class RoadRouteBezierCurve extends RoadRoute {
  private readonly _controlPoints: { x: number; y?: number; z: number }[];

  constructor(
    worldController: WorldController,
    road: Road,
    startNode: RoadNode,
    endNode: RoadNode,
    controlPoints: { x: number; y?: number; z: number }[]
  ) {
    super(worldController, road, startNode, endNode);
    this._controlPoints = controlPoints;
  }

  /** t is a value between 0-1. 0 returns the starting point and 1 returns the ending point.
   * Anything between 0 and 1 returns a corresponding point in the bezier curve. */
  public getPointAtBezierCurve(
    t: number,
    x1: number,
    z1: number,
    x2: number,
    z2: number,
    cp1x: number,
    cp1z: number,
    cp2x: number,
    cp2z: number
  ): Vector3 {
    const x =
      (1 - t) ** 3 * x1 +
      3 * (1 - t) ** 2 * t * cp1x +
      3 * (1 - t) * t ** 2 * cp2x +
      t ** 3 * x2;
    const z =
      (1 - t) ** 3 * z1 +
      3 * (1 - t) ** 2 * t * cp1z +
      3 * (1 - t) * t ** 2 * cp2z +
      t ** 3 * z2;

    return new Vector3(x, 0, z);
  }

  /** Given coordinates x and z, returns an approximate T which corresponds the closest point at bezier curve. */
  public getTAtBezierCurve(x: number, z: number, accuracy: number): number {
    const curvePoints: { t: number; position: Vector3 }[] = [];
    const step = 1 / accuracy;
    for (let i = 0; i <= 1; i = i + step) {
      curvePoints.push({
        t: i,
        position: this.getPointAtBezierCurve(
          i,
          this.startNode.position.x,
          this.startNode.position.z,
          this.endNode.position.x,
          this.endNode.position.z,
          this._controlPoints[0].x,
          this._controlPoints[0].z,
          this._controlPoints[1].x,
          this._controlPoints[1].z
        ),
      });
    }

    // Find the closest point
    let closestPointDistance = Number.MAX_VALUE;
    let closestPoint: { t: number; position: Vector3 } | undefined = undefined;
    for (const point of curvePoints) {
      const dist = math.distance(x, 0, z, point.position.x, 0, point.position.z);
      if (dist < closestPointDistance) {
        closestPointDistance = dist;
        closestPoint = point;
      }
    }

    return closestPoint!.t;
  }

  /** Returns the next x and z coordinates on the bezier curve. */
  public getNextPointAtBezierCurve(currentT: number, step: number): Vector3 {
    const nextT = currentT + step;

    if (nextT <= 0) {
      return new Vector3(this.startNode.position.x, this.startNode.position.y, this.startNode.position.z);
    }

    if (nextT >= 1) {
      return new Vector3(this.endNode.position.x, this.endNode.position.y, this.endNode.position.z);
    }

    return this.getPointAtBezierCurve(
      nextT,
      this.startNode.position.x,
      this.startNode.position.z,
      this.endNode.position.x,
      this.endNode.position.z,
      this._controlPoints[0].x,
      this._controlPoints[0].z,
      this._controlPoints[1].x,
      this._controlPoints[1].z
    );
  }

  /** Returns an approximate length of the bezier curve starting from t. */
  public getCurveLength(accuracy: number, t?: number): number {
    const curvePoints: { position: Vector3 }[] = [];
    const step = 1 / accuracy;
    for (let i = t || 0; i <= 1; i = i + step) {
      curvePoints.push({
        position: this.getPointAtBezierCurve(
          i,
          this.startNode.position.x,
          this.startNode.position.z,
          this.endNode.position.x,
          this.endNode.position.z,
          this._controlPoints[0].x,
          this._controlPoints[0].z,
          this._controlPoints[1].x,
          this._controlPoints[1].z
        ),
      });
    }

    // Calculate distance between points
    let sum = 0;
    for (let j = 0; j < curvePoints.length - 1; j++) {
      sum += math.distance(
        curvePoints[j].position.x,
        0,
        curvePoints[j].position.z,
        curvePoints[j + 1].position.x,
        0,
        curvePoints[j + 1].position.z
      );
    }

    return sum;
  }

  public override getNextPoint(position: { x: number; y: number; z: number }): { x: number; y: number; z: number } {
    return this.getNextPointAtBezierCurve(this.getTAtBezierCurve(position.x, position.z, 30), 0.05);
  }

  public override getNextPointAtDistance(
    position: { x: number; y: number; z: number },
    distance: number
  ): { x: number; y: number; z: number } {
    const currentT = this.getTAtBezierCurve(position.x, position.z, 30);
    const remainingLength = this.getCurveLength(30, currentT);

    if (distance > remainingLength) {
      return this.endNode.position;
    }

    const step = distance / this.getCurveLength(30);
    return this.getNextPointAtBezierCurve(currentT, step);
  }

  public override getNextPointAtDistanceOrContinue(
    position: { x: number; y: number; z: number },
    distance: number,
    nextRoute: RoadRoute | undefined
  ): { x: number; y: number; z: number } {
    const currentT = this.getTAtBezierCurve(position.x, position.z, 30);
    const remainingLength = this.getCurveLength(30, currentT);

    if (distance > remainingLength) {
      if (nextRoute) {
        return nextRoute.getNextPointAtDistanceOrContinue(
          nextRoute.startNode.position,
          distance - remainingLength,
          undefined
        );
      }
      return this.endNode.position;
    }

    return this.getNextPointAtDistance(position, distance);
  }
}

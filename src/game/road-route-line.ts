import { RoadRoute } from "./road-route";
import { Vector3 } from "../utils/vector3";
import * as math from "../utils/math";
import type { Road } from "./road";
import type { WorldController } from "./world-controller";
import type { RoadNode } from "./road-node";

export class RoadRouteLine extends RoadRoute {
  constructor(worldController: WorldController, road: Road, startNode: RoadNode, endNode: RoadNode) {
    super(worldController, road, startNode, endNode);
  }

  /** Returns a point which is a bit more near the end point than the given point. */
  public override getNextPoint(position: { x: number; y: number; z: number }): Vector3 {
    return this.getNextPointAtDistance(position, 0.05);
  }

  /** Returns a point which is the given distance near the end point starting from the given position. */
  public override getNextPointAtDistance(position: { x: number; y: number; z: number }, distance: number): Vector3 {
    // Make sure it does not go over the end point!
    if (distance > math.distance(position.x, 0, position.z, this.endNode.position.x, 0, this.endNode.position.z)) {
      return new Vector3(this.endNode.position.x, this.endNode.position.y, this.endNode.position.z);
    }

    return new Vector3(
      position.x +
        Math.cos(
          math.angleBetweenPointsWhenYIncreasesDown(
            position.x,
            position.z,
            this.endNode.position.x,
            this.endNode.position.z
          )
        ) *
          distance,
      0,
      position.z -
        Math.sin(
          math.angleBetweenPointsWhenYIncreasesDown(
            position.x,
            position.z,
            this.endNode.position.x,
            this.endNode.position.z
          )
        ) *
          distance
    );
  }

  /** Returns a point which is the given distance near the end point starting from the given position.
   * If the calculated next point goes over the end point, continues using the given nextRoute */
  public override getNextPointAtDistanceOrContinue(
    position: { x: number; y: number; z: number },
    distance: number,
    nextRoute: RoadRoute | undefined
  ): { x: number; y: number; z: number } {
    // If goes over the end point, continue using the next route.
    if (distance > math.distance(position.x, 0, position.z, this.endNode.position.x, 0, this.endNode.position.z)) {
      if (nextRoute) {
        return nextRoute.getNextPointAtDistanceOrContinue(
          nextRoute.startNode.position,
          distance - math.distance(position.x, 0, position.z, this.endNode.position.x, 0, this.endNode.position.z),
          undefined
        );
      }
      return this.endNode.position;
    }

    return this.getNextPointAtDistance(position, distance);
  }
}

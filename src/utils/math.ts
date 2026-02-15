import { Vector2 } from "./vector2";
import { Vector3 } from "./vector3";

export function distance(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): number {
  return Math.sqrt(
    Math.abs(x1 - x2) ** 2 +
    Math.abs(y1 - y2) ** 2 +
    Math.abs(z1 - z2) ** 2
  );
}

export function radians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function degrees(rad: number): number {
  return (rad * 180) / Math.PI;
}

/** Returns random value between inclusive min and inclusive max. */
export function randomValue(min: number, max: number): number {
  return Math.floor(Math.random() * (max + 1 - min) + min);
}

/** Returns a new array of Vector3s in which y and z have been swapped. */
export function swapVector3ZAndY(points3d: { x: number; y: number; z: number }[]): Vector3[] {
  const newPoints: Vector3[] = [];
  for (const point of points3d) {
    newPoints.push(new Vector3(point.x, point.z, point.y));
  }
  return newPoints;
}

/** Returns an array of Vector3s in which Y is the opposite value. */
export function oppositeVector3Y(points3d: Vector3[]): Vector3[] {
  const newPoints: Vector3[] = [];
  for (const point of points3d) {
    newPoints.push(new Vector3(point.x, -point.y, point.z));
  }
  return newPoints;
}

interface NamedPoint extends Vector2 {
  ___name?: string;
}

/* Uses Separating Axis Theorem (SAT) to find collision between two convex polygons.
 * Polygon points are presented simply as an array in which each item is a map of x and y positions.
 * Method explanation: http://www.sevenson.com.au/actionscript/sat/ */
export function polygonCollision(
  polygon1: { x: number; y: number }[],
  polygon2: { x: number; y: number }[]
): boolean {
  const namedPolygon1 = namePolygon(polygon1, "polygon1");
  const namedPolygon2 = namePolygon(polygon2, "polygon2");
  const edges = getEdges(namedPolygon1.concat(namedPolygon2));
  return checkEdgeCollision(edges);

  function namePolygon(polygon: { x: number; y: number }[], name: string): NamedPoint[] {
    const newPolygon: NamedPoint[] = [];
    for (const point of polygon) {
      const newPoint: NamedPoint = new Vector2(point.x, point.y);
      newPoint.___name = name;
      newPolygon.push(newPoint);
    }
    return newPolygon;
  }

  function getEdges(polygon: NamedPoint[]): { start: NamedPoint; end: NamedPoint }[] {
    const edges: { start: NamedPoint; end: NamedPoint }[] = [];
    for (let i = 0; i < polygon.length; i++) {
      let edge: { start: NamedPoint; end: NamedPoint };
      if (i === polygon.length - 1) {
        edge = { start: polygon[i], end: polygon[0] };
      } else {
        edge = { start: polygon[i], end: polygon[i + 1] };
      }
      edges.push(edge);
    }
    return edges;
  }

  /** Loops through all edges, projects all points to the edge"s normal vector and checks if there is a gap.
   * If at least one gap is found, two polygon are not colliding. However, if no gaps are found, the
   * polygons are in collision with each other. */
  function checkEdgeCollision(edges: { start: NamedPoint; end: NamedPoint }[]): boolean {
    for (let i = 0; i < edges.length; i++) {
      const projectedPoints = projectPointsToNormalVectorOfEdge(edges[i], namedPolygon1.concat(namedPolygon2));
      if (isThereGapBetweenProjectedPoints(projectedPoints)) {
        return false;
      }
    }
    return true;
  }

  function projectPointsToNormalVectorOfEdge(
    edge: { start: NamedPoint; end: NamedPoint },
    points: NamedPoint[]
  ): NamedPoint[] {
    const edgeAngle = angleBetweenPoints(edge.start.x, edge.start.y, edge.end.x, edge.end.y);
    const edgeAsVector = new Vector2(Math.cos(edgeAngle), Math.sin(edgeAngle));
    const normalVector = edgeAsVector.normalVector();
    const projectedPoints: NamedPoint[] = [];

    for (const point of points) {
      let m: number;
      if (normalVector.x !== 0) {
        m = normalVector.y / normalVector.x;
      } else {
        m = 0;
      }

      const x = (m * point.y + point.x) / (m * m + 1);
      const y = (m * m * point.y + m * point.x) / (m * m + 1);

      const projectedPoint: NamedPoint = new Vector2(x, y);
      projectedPoint.___name = point.___name;
      projectedPoints.push(projectedPoint);
    }

    return projectedPoints;
  }

  function isThereGapBetweenProjectedPoints(points: NamedPoint[]): boolean {
    return findGap(sortPointsByLocation(points));

    function sortPointsByLocation(pts: NamedPoint[]): NamedPoint[] {
      let sortFunction: (a: NamedPoint, b: NamedPoint) => number;
      if (pts.every((point) => point.x === pts[0].x)) {
        sortFunction = (a, b) => a.y - b.y;
      } else {
        sortFunction = (a, b) => a.x - b.x;
      }
      return pts.slice().sort(sortFunction);
    }

    function findGap(sortedPoints: NamedPoint[]): boolean {
      // Go through all points. If the point"s owner polygon changes only once, there is a gap.
      let switchesCount = 0;
      for (let i = 1; i < sortedPoints.length; i++) {
        if (sortedPoints[i].___name !== sortedPoints[i - 1].___name) {
          switchesCount++;
        }
      }
      return switchesCount <= 1;
    }
  }
}

/** Returns a new collision mask which is rotated around center. */
export function rotateCollisionMaskWhenYIncreasesDown(
  collisionMask: { x: number; y: number }[],
  newAngle: number
): { x: number; y: number }[] {
  const newCollisionMask: { x: number; y: number }[] = [];

  for (const point of collisionMask) {
    const defaultAngle = angleBetweenPointsWhenYIncreasesDown(0, 0, point.x, point.y);
    const distanceBetweenPointAndCenter = distance(0, 0, 0, point.x, point.y, 0);

    let finalAngle = defaultAngle + newAngle;

    // No more than 360 degrees
    while (finalAngle > Math.PI * 2) {
      finalAngle -= Math.PI * 2;
    }

    newCollisionMask.push({
      x: Math.cos(finalAngle) * distanceBetweenPointAndCenter,
      y: -Math.sin(finalAngle) * distanceBetweenPointAndCenter,
    });
  }

  return newCollisionMask;
}

/** Returns a new collision mask which is rotated around center. */
export function rotateCollisionMask(
  collisionMask: { x: number; y: number }[],
  newAngle: number
): { x: number; y: number }[] {
  const newCollisionMask: { x: number; y: number }[] = [];

  for (const point of collisionMask) {
    const defaultAngle = angleBetweenPointsWhenYIncreasesDown(0, 0, point.x, point.y);
    const distanceBetweenPointAndCenter = distance(0, 0, 0, point.x, point.y, 0);

    let finalAngle = defaultAngle + newAngle;

    // No more than 360 degrees
    while (finalAngle > Math.PI * 2) {
      finalAngle -= Math.PI * 2;
    }

    newCollisionMask.push({
      x: Math.cos(finalAngle) * distanceBetweenPointAndCenter,
      y: Math.sin(finalAngle) * distanceBetweenPointAndCenter,
    });
  }

  return newCollisionMask;
}

/** Returns the positive angle between given points in radians when y points down. */
export function angleBetweenPointsWhenYIncreasesDown(x1: number, y1: number, x2: number, y2: number): number {
  let rad = Math.atan2(-(y2 - y1), x2 - x1);
  // No negative angles
  while (rad < 0) {
    rad += Math.PI * 2;
  }
  return rad;
}

/** Returns the positive angle between given points in radians. */
export function angleBetweenPoints(x1: number, y1: number, x2: number, y2: number): number {
  let rad = Math.atan2(y2 - y1, x2 - x1);
  // No negative angles
  while (rad < 0) {
    rad += Math.PI * 2;
  }
  return rad;
}

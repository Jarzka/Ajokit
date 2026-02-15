import { TrafficLight } from "./traffic-light";
import { TrafficLightPosition } from "./traffic-light.types";
import { RoadType } from "./road.types";
import { Vector3 } from "../utils/vector3";
import * as math from "../utils/math";
import type { Road } from "./road";

interface TrafficLightPositionData {
  positionName: TrafficLightPosition;
  x: number;
  y: number;
  z: number;
}

export class TrafficLightsController {
  private readonly _road: Road;
  private readonly _trafficLights: TrafficLight[] = [];

  constructor(road: Road) {
    this._road = road;
    this._initializeTrafficLights();
  }

  private _initializeTrafficLights(): void {
    const trafficLightPositions = this.getTrafficLightPositionsRelativeToRoad();
    const map = this._road.getWorldController().getMap();
    const roadPosition = this._road.getPosition();

    const insertTopTrafficLight = (nextTrafficLight?: TrafficLight): TrafficLight => {
      const relativePositionTop = trafficLightPositions.filter(
        (position) => position.positionName === TrafficLightPosition.TOP
      )[0];
      const trafficLightTopPositionInWorld = new Vector3(
        roadPosition.x - map.getTileSize() / 2 + relativePositionTop.x * map.getTileSize(),
        0,
        roadPosition.z - map.getTileSize() / 2 + relativePositionTop.z * map.getTileSize()
      );
      const trafficLightTop = new TrafficLight(
        this,
        nextTrafficLight,
        TrafficLightPosition.TOP,
        trafficLightTopPositionInWorld
      );
      this._trafficLights.push(trafficLightTop);
      return trafficLightTop;
    };

    const insertRightTrafficLight = (nextTrafficLight?: TrafficLight): TrafficLight => {
      const relativePositionRight = trafficLightPositions.filter(
        (position) => position.positionName === TrafficLightPosition.RIGHT
      )[0];
      const trafficLightRightPositionInWorld = new Vector3(
        roadPosition.x - map.getTileSize() / 2 + relativePositionRight.x * map.getTileSize(),
        0,
        roadPosition.z - map.getTileSize() / 2 + relativePositionRight.z * map.getTileSize()
      );
      const trafficLightRight = new TrafficLight(
        this,
        nextTrafficLight,
        TrafficLightPosition.RIGHT,
        trafficLightRightPositionInWorld
      );
      this._trafficLights.push(trafficLightRight);
      return trafficLightRight;
    };

    const insertBottomTrafficLight = (nextTrafficLight?: TrafficLight): TrafficLight => {
      const relativePositionBottom = trafficLightPositions.filter(
        (position) => position.positionName === TrafficLightPosition.BOTTOM
      )[0];
      const trafficLightBottomPositionInWorld = new Vector3(
        roadPosition.x - map.getTileSize() / 2 + relativePositionBottom.x * map.getTileSize(),
        0,
        roadPosition.z - map.getTileSize() / 2 + relativePositionBottom.z * map.getTileSize()
      );
      const trafficLightBottom = new TrafficLight(
        this,
        nextTrafficLight,
        TrafficLightPosition.BOTTOM,
        trafficLightBottomPositionInWorld
      );
      this._trafficLights.push(trafficLightBottom);
      return trafficLightBottom;
    };

    const insertLeftTrafficLight = (nextTrafficLight?: TrafficLight): TrafficLight => {
      const relativePositionLeft = trafficLightPositions.filter(
        (position) => position.positionName === TrafficLightPosition.LEFT
      )[0];
      const trafficLightLeftPositionInWorld = new Vector3(
        roadPosition.x - map.getTileSize() / 2 + relativePositionLeft.x * map.getTileSize(),
        0,
        roadPosition.z - map.getTileSize() / 2 + relativePositionLeft.z * map.getTileSize()
      );
      const trafficLightLeft = new TrafficLight(
        this,
        nextTrafficLight,
        TrafficLightPosition.LEFT,
        trafficLightLeftPositionInWorld
      );
      this._trafficLights.push(trafficLightLeft);
      return trafficLightLeft;
    };

    let trafficLight: TrafficLight | undefined = undefined;
    const roadType = this._road.getRoadType();

    switch (roadType) {
      case RoadType.CROSSROADS:
        trafficLight = insertTopTrafficLight();
        trafficLight = insertRightTrafficLight(trafficLight);
        trafficLight = insertBottomTrafficLight(trafficLight);
        insertLeftTrafficLight(trafficLight);
        break;
      case RoadType.DOWN_LEFT_RIGHT:
        trafficLight = insertRightTrafficLight();
        trafficLight = insertBottomTrafficLight(trafficLight);
        insertLeftTrafficLight(trafficLight);
        break;
      case RoadType.UP_LEFT_DOWN:
        trafficLight = insertTopTrafficLight();
        trafficLight = insertBottomTrafficLight(trafficLight);
        insertLeftTrafficLight(trafficLight);
        break;
      case RoadType.UP_LEFT_RIGHT:
        trafficLight = insertTopTrafficLight();
        trafficLight = insertRightTrafficLight(trafficLight);
        insertLeftTrafficLight(trafficLight);
        break;
      case RoadType.UP_RIGHT_DOWN:
        trafficLight = insertTopTrafficLight();
        trafficLight = insertRightTrafficLight(trafficLight);
        insertBottomTrafficLight(trafficLight);
        break;
    }

    if (this._trafficLights.length > 0) {
      this._trafficLights[0].setNextTrafficLight(this._trafficLights[this._trafficLights.length - 1]);
      this._trafficLights[math.randomValue(0, this._trafficLights.length - 1)].setActive(true);
    }
  }

  /** Returns traffic light positions related to the current road.
   * Traffic light position is relative to the parent object"s width and height:
   * [0, 0] is the upper left corner, [1, 1] is the lower right corner, [0.5, 0.5] is the center and so on...
   */
  public getTrafficLightPositionsRelativeToRoad(): TrafficLightPositionData[] {
    return [
      { positionName: TrafficLightPosition.TOP, x: -0.1, y: 0, z: -0.1 },
      { positionName: TrafficLightPosition.RIGHT, x: 1.1, y: 0, z: -0.1 },
      { positionName: TrafficLightPosition.BOTTOM, x: 1.1, y: 0, z: 1.1 },
      { positionName: TrafficLightPosition.LEFT, x: -0.1, y: 0, z: 1.1 },
    ];
  }

  public update(_deltaTime?: number): void {
    for (const trafficLight of this._trafficLights) {
      trafficLight.update();
    }
  }

  public getRoad(): Road {
    return this._road;
  }

  public getTrafficLights(): TrafficLight[] {
    return this._trafficLights;
  }
}

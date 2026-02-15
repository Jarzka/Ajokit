import * as THREE from "three";
import { GameplayObject } from "./gameplay-object";
import { TrafficLightsController } from "./traffic-lights-controller";
import { RoadType } from "./road.types";
import { log, LogType } from "../utils/logger";
import { GeneralException } from "../exceptions";
import type { NodePosition, NodeConnection } from "../types";
import type { RoadRoute } from "./road-route";
import type { WorldController } from "./world-controller";
import { Vector3 } from "../utils/vector3";

export class Road extends GameplayObject {
  private readonly _roadType: RoadType;
  private readonly _trafficLightsController: TrafficLightsController | undefined = undefined;
  private _routes: RoadRoute[] = [];

  constructor(worldController: WorldController, roadType: RoadType, position: Vector3) {
    super(worldController, Road._resolveRoadModelByType(roadType, worldController));
    this.setPosition(position);
    this._roadType = roadType;

    if (
      roadType === RoadType.CROSSROADS ||
      roadType === RoadType.UP_LEFT_DOWN ||
      roadType === RoadType.UP_RIGHT_DOWN ||
      roadType === RoadType.UP_LEFT_RIGHT ||
      roadType === RoadType.DOWN_LEFT_RIGHT
    ) {
      this._trafficLightsController = new TrafficLightsController(this as any);
    }
  }

  private static _resolveRoadModelByType(roadType: RoadType, worldController: WorldController): THREE.Mesh {
    const modelContainer = worldController.getGameplayScene().getApplication().getModelContainer();

    switch (roadType) {
      case RoadType.VERTICAL:
        return modelContainer.getModelByName("road_vertical").clone();
      case RoadType.HORIZONTAL:
        return modelContainer.getModelByName("road_horizontal").clone();
      case RoadType.UP_LEFT:
        return modelContainer.getModelByName("road_up_left").clone();
      case RoadType.UP_RIGHT:
        return modelContainer.getModelByName("road_up_right").clone();
      case RoadType.DOWN_LEFT:
        return modelContainer.getModelByName("road_down_left").clone();
      case RoadType.DOWN_RIGHT:
        return modelContainer.getModelByName("road_down_right").clone();
      case RoadType.CROSSROADS:
        return modelContainer.getModelByName("road_crossroads").clone();
      case RoadType.UP_RIGHT_DOWN:
        return modelContainer.getModelByName("road_up_right_down").clone();
      case RoadType.UP_LEFT_DOWN:
        return modelContainer.getModelByName("road_up_left_down").clone();
      case RoadType.UP_LEFT_RIGHT:
        return modelContainer.getModelByName("road_up_left_right").clone();
      case RoadType.DOWN_LEFT_RIGHT:
        return modelContainer.getModelByName("road_down_left_right").clone();
      case RoadType.UP_END:
        return modelContainer.getModelByName("road_up_end").clone();
      case RoadType.RIGHT_END:
        return modelContainer.getModelByName("road_right_end").clone();
      case RoadType.LEFT_END:
        return modelContainer.getModelByName("road_left_end").clone();
      case RoadType.DOWN_END:
        return modelContainer.getModelByName("road_down_end").clone();
      default:
        log(LogType.ERROR, `Road._resolveRoadModelByType: Unknown road type: ${roadType}`);
        throw new GeneralException(`Road._resolveRoadModelByType: Unknown road type: ${roadType}`);
    }
  }

  public getNodePositionsRelativeToRoad(): NodePosition[] {
    switch (this._roadType) {
      case RoadType.VERTICAL:
        return [
          { x: 0.27, y: 0, z: 0 },
          { x: 0.27, y: 0, z: 1 },
          { x: 0.73, y: 0, z: 1 },
          { x: 0.73, y: 0, z: 0 },
        ];
      case RoadType.HORIZONTAL:
        return [
          { x: 1, y: 0, z: 0.27 },
          { x: 0, y: 0, z: 0.27 },
          { x: 0, y: 0, z: 0.73 },
          { x: 1, y: 0, z: 0.73 },
        ];
      case RoadType.UP_LEFT:
        return [
          { x: 0.27, y: 0, z: 0 },
          { x: 0, y: 0, z: 0.27 },
          { x: 0, y: 0, z: 0.73 },
          { x: 0.73, y: 0, z: 0 },
        ];
      case RoadType.UP_RIGHT:
        return [
          { x: 0.27, y: 0, z: 0 },
          { x: 1, y: 0, z: 0.73 },
          { x: 1, y: 0, z: 0.27 },
          { x: 0.73, y: 0, z: 0 },
        ];
      case RoadType.DOWN_LEFT:
        return [
          { x: 0.73, y: 0, z: 1 },
          { x: 0, y: 0, z: 0.27 },
          { x: 0, y: 0, z: 0.73 },
          { x: 0.27, y: 0, z: 1 },
        ];
      case RoadType.DOWN_RIGHT:
        return [
          { x: 1, y: 0, z: 0.27 },
          { x: 0.27, y: 0, z: 1 },
          { x: 0.73, y: 0, z: 1 },
          { x: 1, y: 0, z: 0.73 },
        ];
      case RoadType.CROSSROADS:
        return [
          { x: 1, y: 0, z: 0.27 },
          { x: 0, y: 0, z: 0.27 },
          { x: 0, y: 0, z: 0.73 },
          { x: 1, y: 0, z: 0.73 },
          { x: 0.27, y: 0, z: 0 },
          { x: 0.27, y: 0, z: 1 },
          { x: 0.73, y: 0, z: 1 },
          { x: 0.73, y: 0, z: 0 },
          { x: 0.73, y: 0, z: 1 },
          { x: 1, y: 0, z: 0.73 },
          { x: 1, y: 0, z: 0.27 },
          { x: 0.73, y: 0, z: 0 },
          { x: 0.27, y: 0, z: 0 },
          { x: 0, y: 0, z: 0.27 },
          { x: 0, y: 0, z: 0.73 },
          { x: 0.27, y: 0, z: 1 },
          { x: 0.73, y: 0, z: 1 },
          { x: 0, y: 0, z: 0.27 },
          { x: 1, y: 0, z: 0.27 },
          { x: 0.27, y: 0, z: 1 },
          { x: 0.27, y: 0, z: 0 },
          { x: 1, y: 0, z: 0.73 },
          { x: 0, y: 0, z: 0.73 },
          { x: 0.73, y: 0, z: 0 },
        ];
      case RoadType.UP_LEFT_DOWN:
        return [
          { x: 0.27, y: 0, z: 0 },
          { x: 0.27, y: 0, z: 1 },
          { x: 0.73, y: 0, z: 1 },
          { x: 0.73, y: 0, z: 0 },
          { x: 0.27, y: 0, z: 0 },
          { x: 0, y: 0, z: 0.27 },
          { x: 0, y: 0, z: 0.73 },
          { x: 0.27, y: 0, z: 1 },
          { x: 0.73, y: 0, z: 1 },
          { x: 0, y: 0, z: 0.27 },
          { x: 0, y: 0, z: 0.73 },
          { x: 0.73, y: 0, z: 0 },
        ];
      case RoadType.UP_LEFT_RIGHT:
        return [
          { x: 1, y: 0, z: 0.27 },
          { x: 0, y: 0, z: 0.27 },
          { x: 0, y: 0, z: 0.73 },
          { x: 1, y: 0, z: 0.73 },
          { x: 1, y: 0, z: 0.27 },
          { x: 0.73, y: 0, z: 0 },
          { x: 0.27, y: 0, z: 0 },
          { x: 0, y: 0, z: 0.27 },
          { x: 0.27, y: 0, z: 0 },
          { x: 1, y: 0, z: 0.73 },
          { x: 0, y: 0, z: 0.73 },
          { x: 0.73, y: 0, z: 0 },
        ];
      case RoadType.UP_RIGHT_DOWN:
        return [
          { x: 0.27, y: 0, z: 0 },
          { x: 0.27, y: 0, z: 1 },
          { x: 0.73, y: 0, z: 1 },
          { x: 0.73, y: 0, z: 0 },
          { x: 0.73, y: 0, z: 1 },
          { x: 1, y: 0, z: 0.73 },
          { x: 1, y: 0, z: 0.27 },
          { x: 0.73, y: 0, z: 0 },
          { x: 1, y: 0, z: 0.27 },
          { x: 0.27, y: 0, z: 1 },
          { x: 0.27, y: 0, z: 0 },
          { x: 1, y: 0, z: 0.73 },
        ];
      case RoadType.DOWN_LEFT_RIGHT:
        return [
          { x: 1, y: 0, z: 0.27 },
          { x: 0, y: 0, z: 0.27 },
          { x: 0, y: 0, z: 0.73 },
          { x: 1, y: 0, z: 0.73 },
          { x: 0.73, y: 0, z: 1 },
          { x: 1, y: 0, z: 0.73 },
          { x: 0, y: 0, z: 0.73 },
          { x: 0.27, y: 0, z: 1 },
          { x: 0.73, y: 0, z: 1 },
          { x: 0, y: 0, z: 0.27 },
          { x: 1, y: 0, z: 0.27 },
          { x: 0.27, y: 0, z: 1 },
        ];
      case RoadType.DOWN_END:
        return [
          { x: 0.27, y: 0, z: 0 },
          { x: 0.5, y: 0, z: 0.73 },
          { x: 0.73, y: 0, z: 0 },
        ];
      case RoadType.UP_END:
        return [
          { x: 0.73, y: 0, z: 1 },
          { x: 0.5, y: 0, z: 0 },
          { x: 0.27, y: 0, z: 1 },
        ];
      case RoadType.LEFT_END:
        return [
          { x: 1, y: 0, z: 0.27 },
          { x: 0.27, y: 0, z: 0.5 },
          { x: 1, y: 0, z: 0.73 },
        ];
      case RoadType.RIGHT_END:
        return [
          { x: 0, y: 0, z: 0.73 },
          { x: 0.73, y: 0, z: 0.5 },
          { x: 0, y: 0, z: 0.27 },
        ];
      default:
        return [];
    }
  }

  public getNodeConnections(): NodeConnection[] {
    switch (this._roadType) {
      case RoadType.VERTICAL:
        return [
          { start: 0, end: 1 },
          { start: 2, end: 3 },
        ];
      case RoadType.HORIZONTAL:
        return [
          { start: 0, end: 1 },
          { start: 2, end: 3 },
        ];
      case RoadType.UP_LEFT:
        return [
          {
            start: 0,
            end: 1,
            controlPoints: [
              { x: 0.27, y: 0, z: 0.27 },
              { x: 0.27, y: 0, z: 0.27 },
            ],
          },
          {
            start: 2,
            end: 3,
            controlPoints: [
              { x: 0.73, y: 0, z: 0.73 },
              { x: 0.73, y: 0, z: 0.73 },
            ],
          },
        ];
      case RoadType.UP_RIGHT:
        return [
          {
            start: 0,
            end: 1,
            controlPoints: [
              { x: 0.27, y: 0, z: 0.73 },
              { x: 0.27, y: 0, z: 0.73 },
            ],
          },
          {
            start: 2,
            end: 3,
            controlPoints: [
              { x: 0.73, y: 0, z: 0.27 },
              { x: 0.73, y: 0, z: 0.27 },
            ],
          },
        ];
      case RoadType.DOWN_LEFT:
        return [
          {
            start: 0,
            end: 1,
            controlPoints: [
              { x: 0.73, y: 0, z: 0.27 },
              { x: 0.73, y: 0, z: 0.27 },
            ],
          },
          {
            start: 2,
            end: 3,
            controlPoints: [
              { x: 0.27, y: 0, z: 0.73 },
              { x: 0.27, y: 0, z: 0.73 },
            ],
          },
        ];
      case RoadType.DOWN_RIGHT:
        return [
          {
            start: 0,
            end: 1,
            controlPoints: [
              { x: 0.27, y: 0, z: 0.27 },
              { x: 0.27, y: 0, z: 0.27 },
            ],
          },
          {
            start: 2,
            end: 3,
            controlPoints: [
              { x: 0.73, y: 0, z: 0.73 },
              { x: 0.73, y: 0, z: 0.73 },
            ],
          },
        ];
      case RoadType.CROSSROADS:
        return [
          { id: "from-right-to-left", start: 0, end: 1 },
          { id: "from-left-to-right", start: 2, end: 3 },
          { id: "from-top-to-bottom", start: 4, end: 5 },
          { id: "from-bottom-to-top", start: 6, end: 7 },
          {
            id: "from-bottom-to-right",
            start: 8,
            end: 9,
            controlPoints: [
              { x: 0.73, y: 0, z: 0.73 },
              { x: 0.73, y: 0, z: 0.73 },
            ],
          },
          {
            id: "from-right-to-top",
            start: 10,
            end: 11,
            controlPoints: [
              { x: 0.73, y: 0, z: 0.27 },
              { x: 0.73, y: 0, z: 0.27 },
            ],
          },
          {
            id: "from-top-to-left",
            start: 12,
            end: 13,
            controlPoints: [
              { x: 0.27, y: 0, z: 0.27 },
              { x: 0.27, y: 0, z: 0.27 },
            ],
          },
          {
            id: "from-left-to-bottom",
            start: 14,
            end: 15,
            controlPoints: [
              { x: 0.27, y: 0, z: 0.73 },
              { x: 0.27, y: 0, z: 0.73 },
            ],
          },
          {
            id: "from-bottom-to-left",
            start: 16,
            end: 17,
            controlPoints: [
              { x: 0.73, y: 0, z: 0.27 },
              { x: 0.73, y: 0, z: 0.27 },
            ],
          },
          {
            id: "from-right-to-bottom",
            start: 18,
            end: 19,
            controlPoints: [
              { x: 0.27, y: 0, z: 0.27 },
              { x: 0.27, y: 0, z: 0.27 },
            ],
          },
          {
            id: "from-top-to-right",
            start: 20,
            end: 21,
            controlPoints: [
              { x: 0.27, y: 0, z: 0.73 },
              { x: 0.27, y: 0, z: 0.73 },
            ],
          },
          {
            id: "from-left-to-top",
            start: 22,
            end: 23,
            controlPoints: [
              { x: 0.73, y: 0, z: 0.73 },
              { x: 0.73, y: 0, z: 0.73 },
            ],
          },
        ];
      case RoadType.UP_LEFT_DOWN:
        return [
          { id: "from-top-to-bottom", start: 0, end: 1 },
          { id: "from-bottom-to-top", start: 2, end: 3 },
          {
            id: "from-top-to-left",
            start: 4,
            end: 5,
            controlPoints: [
              { x: 0.27, y: 0, z: 0.27 },
              { x: 0.27, y: 0, z: 0.27 },
            ],
          },
          {
            id: "from-left-to-bottom",
            start: 6,
            end: 7,
            controlPoints: [
              { x: 0.27, y: 0, z: 0.73 },
              { x: 0.27, y: 0, z: 0.73 },
            ],
          },
          {
            id: "from-bottom-to-left",
            start: 8,
            end: 9,
            controlPoints: [
              { x: 0.73, y: 0, z: 0.27 },
              { x: 0.73, y: 0, z: 0.27 },
            ],
          },
          {
            id: "from-left-to-top",
            start: 10,
            end: 11,
            controlPoints: [
              { x: 0.73, y: 0, z: 0.73 },
              { x: 0.73, y: 0, z: 0.73 },
            ],
          },
        ];
      case RoadType.UP_LEFT_RIGHT:
        return [
          { id: "from-right-to-left", start: 0, end: 1 },
          { id: "from-left-to-right", start: 2, end: 3 },
          {
            id: "from-right-to-top",
            start: 4,
            end: 5,
            controlPoints: [
              { x: 0.73, y: 0, z: 0.27 },
              { x: 0.73, y: 0, z: 0.27 },
            ],
          },
          {
            id: "from-top-to-left",
            start: 6,
            end: 7,
            controlPoints: [
              { x: 0.27, y: 0, z: 0.27 },
              { x: 0.27, y: 0, z: 0.27 },
            ],
          },
          {
            id: "from-top-to-right",
            start: 8,
            end: 9,
            controlPoints: [
              { x: 0.27, y: 0, z: 0.73 },
              { x: 0.27, y: 0, z: 0.73 },
            ],
          },
          {
            id: "from-left-to-top",
            start: 10,
            end: 11,
            controlPoints: [
              { x: 0.73, y: 0, z: 0.73 },
              { x: 0.73, y: 0, z: 0.73 },
            ],
          },
        ];
      case RoadType.UP_RIGHT_DOWN:
        return [
          { id: "from-top-to-bottom", start: 0, end: 1 },
          { id: "from-bottom-to-top", start: 2, end: 3 },
          {
            id: "from-bottom-to-right",
            start: 4,
            end: 5,
            controlPoints: [
              { x: 0.73, y: 0, z: 0.73 },
              { x: 0.73, y: 0, z: 0.73 },
            ],
          },
          {
            id: "from-right-to-top",
            start: 6,
            end: 7,
            controlPoints: [
              { x: 0.73, y: 0, z: 0.27 },
              { x: 0.73, y: 0, z: 0.27 },
            ],
          },
          {
            id: "from-right-to-bottom",
            start: 8,
            end: 9,
            controlPoints: [
              { x: 0.27, y: 0, z: 0.27 },
              { x: 0.27, y: 0, z: 0.27 },
            ],
          },
          {
            id: "from-top-to-right",
            start: 10,
            end: 11,
            controlPoints: [
              { x: 0.27, y: 0, z: 0.73 },
              { x: 0.27, y: 0, z: 0.73 },
            ],
          },
        ];
      case RoadType.DOWN_LEFT_RIGHT:
        return [
          { id: "from-right-to-left", start: 0, end: 1 },
          { id: "from-left-to-right", start: 2, end: 3 },
          {
            id: "from-bottom-to-right",
            start: 4,
            end: 5,
            controlPoints: [
              { x: 0.73, y: 0, z: 0.73 },
              { x: 0.73, y: 0, z: 0.73 },
            ],
          },
          {
            id: "from-left-to-bottom",
            start: 6,
            end: 7,
            controlPoints: [
              { x: 0.27, y: 0, z: 0.73 },
              { x: 0.27, y: 0, z: 0.73 },
            ],
          },
          {
            id: "from-bottom-to-left",
            start: 8,
            end: 9,
            controlPoints: [
              { x: 0.73, y: 0, z: 0.27 },
              { x: 0.73, y: 0, z: 0.27 },
            ],
          },
          {
            id: "from-right-to-bottom",
            start: 10,
            end: 11,
            controlPoints: [
              { x: 0.27, y: 0, z: 0.27 },
              { x: 0.27, y: 0, z: 0.27 },
            ],
          },
        ];
      case RoadType.DOWN_END:
        return [
          {
            start: 0,
            end: 1,
            controlPoints: [
              { x: 0.27, y: 0, z: 0.73 },
              { x: 0.27, y: 0, z: 0.73 },
            ],
          },
          {
            start: 1,
            end: 2,
            controlPoints: [
              { x: 0.73, y: 0, z: 0.73 },
              { x: 0.73, y: 0, z: 0.73 },
            ],
          },
        ];
      case RoadType.UP_END:
        return [
          {
            start: 0,
            end: 1,
            controlPoints: [
              { x: 0.73, y: 0, z: 0.27 },
              { x: 0.73, y: 0, z: 0.27 },
            ],
          },
          {
            start: 1,
            end: 2,
            controlPoints: [
              { x: 0.27, y: 0, z: 0.27 },
              { x: 0.27, y: 0, z: 0.27 },
            ],
          },
        ];
      case RoadType.RIGHT_END:
        return [
          {
            start: 0,
            end: 1,
            controlPoints: [
              { x: 0.73, y: 0, z: 0.73 },
              { x: 0.73, y: 0, z: 0.73 },
            ],
          },
          {
            start: 1,
            end: 2,
            controlPoints: [
              { x: 0.73, y: 0, z: 0.27 },
              { x: 0.73, y: 0, z: 0.27 },
            ],
          },
        ];
      case RoadType.LEFT_END:
        return [
          {
            start: 0,
            end: 1,
            controlPoints: [
              { x: 0.27, y: 0, z: 0.27 },
              { x: 0.27, y: 0, z: 0.27 },
            ],
          },
          {
            start: 1,
            end: 2,
            controlPoints: [
              { x: 0.27, y: 0, z: 0.73 },
              { x: 0.27, y: 0, z: 0.73 },
            ],
          },
        ];
      default:
        return [];
    }
  }

  public getRoadType(): RoadType {
    return this._roadType;
  }

  public setRoutes(routes: RoadRoute[]): void {
    this._routes = routes;
  }

  public getRoutes(): RoadRoute[] {
    return this._routes;
  }

  public update(): void {
    if (this._trafficLightsController) {
      this._trafficLightsController.update();
    }
  }

  public override die(): void {
    super.die();

    // Remove routes
    const vehicles = this._worldController.getVehicleController().getVehicles();
    const routes = this._worldController.getRoadController().getRoutes();
    for (const route of this._routes) {
      route.startNode.removeConnectedRoute(route);
      route.endNode.removeConnectedRoute(route);

      for (const vehicle of vehicles) {
        vehicle.notifyRouteRemoved(route);
      }

      const index = routes.indexOf(route);
      if (index > -1) {
        routes.splice(index, 1);
      }
    }

    // Remove possible traffic lights
    if (this._trafficLightsController) {
      for (const trafficLight of this._trafficLightsController.getTrafficLights()) {
        trafficLight.die();
      }
    }

    // Remove road
    const roads = this._worldController.getRoadController().getRoads();
    const index = roads.indexOf(this as any);
    if (index > -1) {
      roads.splice(index, 1);
    }
  }

  public getWorldController(): WorldController {
    return this._worldController;
  }
}

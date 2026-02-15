import { Vehicle } from "./vehicle";
import { VehicleType, DriverPersonality } from "./vehicle.types";
import * as math from "../utils/math";
import { Vector3 } from "../utils/vector3";
import type { WorldController } from "./world-controller";
import type { CollisionMaskPoint } from "../types";
import type { RoadNode } from "./road-node";
import type { GameMap } from "./map";

export class VehicleController {
  private readonly _worldController: WorldController;
  private readonly _vehicles: Vehicle[] = [];

  constructor(worldController: WorldController) {
    this._worldController = worldController;
  }

  public getWorldController(): WorldController {
    return this._worldController;
  }

  private _initializeRandomCars(numberOfCars: number): void {
    for (let i = 0; i < numberOfCars; i++) {
      let personality: DriverPersonality = DriverPersonality.NEUTRAL;
      const random = math.randomValue(0, 100);
      if (random >= 90) {
        personality = DriverPersonality.GRANNY;
      } else if (random <= 20) {
        personality = DriverPersonality.CRAZY;
      }

      const car = new Vehicle(this._worldController, VehicleType.CAR, personality);
      const nodes = this._worldController.getRoadController().getNodes();

      if (nodes[i * 4]) {
        const node = nodes[i * 4];
        car.setNode(node);
        const position = new Vector3(node.position.x, node.position.y, node.position.z);
        position.y = 0.1;
        car.setPosition(position);
        this._vehicles.push(car);
      }
    }
  }

  public initializeCars(): void {
    this._initializeRandomCars(15);
  }

  public update(deltaTime: number): void {
    for (const vehicle of this._vehicles) {
      vehicle.update(deltaTime);
    }
  }

  public getVehicles(): Vehicle[] {
    return this._vehicles;
  }

  public removeRandomCar(driverPersonality: DriverPersonality): void {
    const matchedVehicles = this._vehicles.filter((vehicle) => {
      return vehicle.getPersonality() === driverPersonality;
    });

    if (matchedVehicles.length > 0) {
      const randomIndex = math.randomValue(0, matchedVehicles.length - 1);
      const randomVehicle = matchedVehicles[randomIndex];
      randomVehicle.die();
    }
  }

  public insertCarAtRandomFreePosition(driverPersonality: DriverPersonality, routeNodes: RoadNode[], _map: GameMap): void {
    routeNodes.some((node) => {
      /* Create an invisible rectangle, a little bit bigger than the size of the vehicle collision mask.
       * Use this rectangle to check if a car can be created at certain position. */
      const rectangleAtNode: CollisionMaskPoint[] = [
        { x: node.position.x - 2.2, y: 0, z: node.position.y - 2.2 },
        { x: node.position.x + 2.2, y: 0, z: node.position.z - 2.2 },
        { x: node.position.x + 2.2, y: 0, z: node.position.z + 2.2 },
        { x: node.position.x - 2.2, y: 0, z: node.position.z + 2.2 },
      ];

      const vehiclesCollidingWithRectangle = this._vehicles.filter((vehicle) => {
        return math.polygonCollision(
          math.oppositeVector3Y(math.swapVector3ZAndY(vehicle.getCollisionMaskInWorld())),
          math.oppositeVector3Y(math.swapVector3ZAndY(rectangleAtNode))
        );
      });

      if (vehiclesCollidingWithRectangle.length === 0) {
        const car = new Vehicle(this._worldController, VehicleType.CAR, driverPersonality);
        car.setNode(node);
        const position = new Vector3(node.position.x, node.position.y, node.position.z);
        position.y = 0.1;
        car.setPosition(position);
        this._vehicles.push(car);
        return true;
      }

      return false;
    });
  }
}

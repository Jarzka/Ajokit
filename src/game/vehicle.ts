import { GameplayObject } from "./gameplay-object";
import { VehicleType, DriverPersonality } from "./vehicle.types";
import { log, LogType } from "../utils/logger";
import * as math from "../utils/math";
import { Vector3 } from "../utils/vector3";
import type { WorldController } from "./world-controller";
import type { CollisionMaskPoint } from "../types";
import type { RoadRoute } from "./road-route";
import type { RoadNode } from "./road-node";

export class Vehicle extends GameplayObject {
  private readonly _vehicleType: VehicleType;
  private _currentNode: RoadNode | undefined = undefined;
  private _currentRoute: RoadRoute | undefined = undefined;
  private _nextRoute: RoadRoute | undefined = undefined;

  private readonly _driverPersonality: DriverPersonality;
  private _speed: number = 0;
  private _targetSpeed: number | undefined = undefined;
  private _acceleratorPedal: number = 0;
  private _brakePedal: number = 0;

  private readonly _maxSpeed: number;
  private readonly _acceleration: number;
  private readonly _deceleration: number;
  private readonly _brakeDeceleration: number;

  protected _collisionMaskTemplate: CollisionMaskPoint[] = [];

  constructor(worldController: WorldController, vehicleType: VehicleType, driverPersonality: DriverPersonality) {
    let modelName: string;
    if (driverPersonality === DriverPersonality.GRANNY) {
      modelName = "car_slow";
    } else if (driverPersonality === DriverPersonality.CRAZY) {
      modelName = "car_fast";
    } else {
      modelName = "car";
    }
    const model = worldController
      .getGameplayScene()
      .getApplication()
      .getModelContainer()
      .getModelByName(modelName)
      .clone();
    super(worldController, model);

    this._vehicleType = vehicleType;
    this._driverPersonality = driverPersonality;

    if (this._driverPersonality === DriverPersonality.CRAZY) {
      this._maxSpeed = 11;
      this._acceleration = 8;
    } else if (this._driverPersonality === DriverPersonality.GRANNY) {
      this._maxSpeed = 2.5;
      this._acceleration = 2.5;
    } else {
      this._maxSpeed = 5;
      this._acceleration = 5;
    }

    this._deceleration = this._acceleration;
    this._brakeDeceleration = this._acceleration / 2;

    this._setCollisionMask();
  }

  private _setCollisionMask(): void {
    switch (this._vehicleType) {
      case VehicleType.CAR: {
        const collisionMask: CollisionMaskPoint[] = [
          { x: -2, y: 0, z: -1 },
          { x: 2, y: 0, z: -1 },
          { x: 2, y: 0, z: 1 },
          { x: -2, y: 0, z: 1 },
        ];
        this._collisionMask = collisionMask;
        this._collisionMaskTemplate = collisionMask;
        break;
      }
    }
  }

  public setNode(node: RoadNode): void {
    this._currentNode = node;
  }

  public override updateCollisionMask(): void {
    const rotatedCollisionMask = math.rotateCollisionMaskWhenYIncreasesDown(
      math.swapVector3ZAndY(this._collisionMaskTemplate),
      this._angle
    );
    this._collisionMask = math.swapVector3ZAndY(rotatedCollisionMask.map((point) => {
      return { x: point.x, y: point.y, z: 0 };
    }));
  }

  public onCollision(): boolean {
    const otherVehicles = this._worldController
      .getVehicleController()
      .getVehicles()
      .filter((vehicle) => vehicle !== this);

    return otherVehicles.some((vehicle) => {
      return math.polygonCollision(
        math.oppositeVector3Y(math.swapVector3ZAndY(this.getCollisionMaskInWorld())),
        math.oppositeVector3Y(math.swapVector3ZAndY(vehicle.getCollisionMaskInWorld()))
      );
    });
  }

  public getCollisionMaskInWorld(): CollisionMaskPoint[] {
    const collisionMaskInWorld: CollisionMaskPoint[] = [];

    if (this._collisionMask) {
      for (const point of this._collisionMask) {
        collisionMaskInWorld.push({
          x: this._position.x + point.x,
          y: 0,
          z: this._position.z + point.z,
        });
      }
    }

    return collisionMaskInWorld;
  }

  public getCollisionPredictionPoint(): Vector3 | undefined {
    if (this._currentRoute) {
      const point = this._currentRoute.getNextPointAtDistanceOrContinue(this._position, 5, this._nextRoute);
      return new Vector3(point.x, 0, point.z);
    }

    return undefined;
  }

  public getSpeed(): number {
    return this._speed;
  }

  public getCollisionPredictionPolygon(): CollisionMaskPoint[] | undefined {
    const pointForward = this.getCollisionPredictionPoint();

    if (pointForward) {
      return [
        { x: pointForward.x - 0.5, y: 0, z: pointForward.z - 0.5 },
        { x: pointForward.x + 0.5, y: 0, z: pointForward.z - 0.5 },
        { x: pointForward.x + 0.5, y: 0, z: pointForward.z + 0.5 },
        { x: pointForward.x - 0.5, y: 0, z: pointForward.z + 0.5 },
      ];
    }

    return undefined;
  }

  public override die(): void {
    super.die();

    const vehicles = this._worldController.getVehicleController().getVehicles();
    const index = vehicles.indexOf(this as any);
    if (index > -1) {
      vehicles.splice(index, 1);
    }
  }

  public getPersonality(): DriverPersonality {
    return this._driverPersonality;
  }

  public notifyRouteRemoved(route: RoadRoute): void {
    if (this._currentRoute === route) {
      this.die();
    }

    if (this._nextRoute === route) {
      this._nextRoute = undefined;
    }
  }

  public update(deltaTime: number): void {
    if (this._handleRouteFinding()) {
      this._handleLogicalMotion();
      this._handlePhysicalMotion(deltaTime);
      this._handleTargetReached();
    } else {
      log(LogType.DEBUG, "Destroying vehicle because it has no valid route.");
      this.die();
      log(LogType.DEBUG, "Vehicle destroyed.");
    }
  }

  private _handleLogicalMotion(): void {
    this._acceleratorPedal = 1;
    this._brakePedal = 0;
    this._handleCollisionPrediction();
    this._handleTargetSpeed();
    this._stopAtTrafficLights();
    this._handleSteeringWheel();
  }

  private _handleCollisionPrediction(): void {
    const collisionPredictionPolygon = this.getCollisionPredictionPolygon();

    if (collisionPredictionPolygon) {
      const otherVehicles = this._worldController
        .getVehicleController()
        .getVehicles()
        .filter((vehicle) => vehicle !== this);

      let collisionTarget: Vehicle | undefined = undefined;
      const isFutureCollisionPossible = otherVehicles.some((vehicle) => {
        const collision = math.polygonCollision(
          math.oppositeVector3Y(math.swapVector3ZAndY(collisionPredictionPolygon)),
          math.oppositeVector3Y(math.swapVector3ZAndY(vehicle.getCollisionMaskInWorld()))
        );

        if (collision) {
          collisionTarget = vehicle;
        }

        return collision;
      });

      if (isFutureCollisionPossible && collisionTarget !== undefined) {
        const distanceBetweenCurrentPointAndPredictedCollisionPoint = math.distance(
          this._position.x,
          0,
          this._position.z,
          (collisionTarget as Vehicle).getPosition().x,
          0,
          (collisionTarget as Vehicle).getPosition().z
        );

        if (distanceBetweenCurrentPointAndPredictedCollisionPoint > 7) {
          this._targetSpeed = (collisionTarget as Vehicle).getSpeed();
        }

        if (distanceBetweenCurrentPointAndPredictedCollisionPoint <= 7) {
          this._acceleratorPedal = 0;
          this._targetSpeed = undefined;
        }

        if (distanceBetweenCurrentPointAndPredictedCollisionPoint <= 5) {
          this._brakePedal = 1;
          this._targetSpeed = undefined;
        }
      } else {
        this._targetSpeed = undefined;
      }
    }
  }

  private _handleTargetSpeed(): void {
    if (this._targetSpeed !== undefined) {
      if (this._targetSpeed > this._speed) {
        this._acceleratorPedal = 1;
      }

      if (this._targetSpeed < this._speed) {
        this._acceleratorPedal = 0;
      }
    }
  }

  private _stopAtTrafficLights(): void {
    if (this._nextRoute && !this._nextRoute.isFree()) {
      const distanceBetweenCurrentPointAndTargetPoint = math.distance(
        this._position.x,
        this._position.z,
        0,
        this._nextRoute.startNode.position.x,
        this._nextRoute.startNode.position.z,
        0
      );

      if (distanceBetweenCurrentPointAndTargetPoint < 5 && distanceBetweenCurrentPointAndTargetPoint > 3) {
        this._acceleratorPedal = 0;
      }

      if (distanceBetweenCurrentPointAndTargetPoint <= 3 && distanceBetweenCurrentPointAndTargetPoint >= 2) {
        this._brakePedal = 1;
      }
    }
  }

  private _handleSteeringWheel(): void {
    if (this._currentRoute) {
      const nextPoint = this._currentRoute.getNextPoint(this._position);
      const angleBetweenCurrentAndTargetPoint = math.angleBetweenPointsWhenYIncreasesDown(
        this._position.x,
        this._position.z,
        nextPoint.x,
        nextPoint.z
      );
      this.setAngle(angleBetweenCurrentAndTargetPoint);
    }
  }

  private _handlePhysicalMotion(deltaTime: number): void {
    this._handleAcceleration(deltaTime);
    this._handleDeceleration(deltaTime);
    this._handleBrake();
    this._handleSpeed(deltaTime);
  }

  private _handleAcceleration(deltaTime: number): void {
    if (this._acceleratorPedal > 0) {
      this._speed += this._acceleration * deltaTime;

      if (this._speed > this._maxSpeed) {
        this._speed = this._maxSpeed;
      }
    }
  }

  private _handleDeceleration(deltaTime: number): void {
    if (this._acceleratorPedal === 0) {
      this._speed -= this._deceleration * deltaTime;

      if (this._speed < 0) {
        this._speed = 0;
      }
    }
  }

  private _handleBrake(): void {
    if (this._brakePedal > 0) {
      this._speed -= this._brakeDeceleration * this._brakePedal;
    }

    if (this._speed < 0) {
      this._speed = 0;
    }
  }

  private _handleSpeed(deltaTime: number): void {
    // Store current position and angle
    const oldPosition = new Vector3(this._position.x, this._position.y, this._position.z);
    const oldAngle = this._angle;

    // Move towards next target point
    this.setPosition(
      new Vector3(
        this._position.x + Math.cos(this._angle) * this._speed * deltaTime,
        this._position.y,
        this._position.z - Math.sin(this._angle) * this._speed * deltaTime
      )
    );

    // Rollback if on collision
    if (this.onCollision()) {
      this.setPosition(oldPosition);
      this.setAngle(oldAngle);
      this._speed = 0;
    }
  }

  private _handleTargetReached(): void {
    if (this._isDestinationReached()) {
      this._currentNode = this._currentRoute!.getTargetNode();
      this._currentRoute = undefined;
    }
  }

  private _isDestinationReached(): boolean {
    if (this._currentRoute && this._currentRoute.getTargetNode()) {
      const targetNode = this._currentRoute.getTargetNode()!;
      return (
        math.distance(
          this._position.x,
          this._position.y,
          this._position.z,
          targetNode.position.x,
          targetNode.position.y,
          targetNode.position.z
        ) <= 0.3
      );
    }

    return false;
  }

  /** Returns true if vehicle was able to find next route. */
  private _handleRouteFinding(): boolean {
    if (!this._nextRoute) {
      this._nextRoute = this._findNextRoute();
    }

    if (this._currentNode) {
      this._takeNextRoute();
    }

    return this._nextRoute !== undefined;
  }

  private _takeNextRoute(): void {
    this._currentRoute = this._nextRoute;
    this._currentNode = undefined;
    this._nextRoute = this._findNextRoute();
  }

  private _findNextRoute(): RoadRoute | undefined {
    let startingConnections: RoadRoute[] | undefined = undefined;
    if (this._currentNode) {
      startingConnections = this._currentNode.getConnectedStartingRoutes();
    } else if (this._currentRoute) {
      startingConnections = this._currentRoute.endNode.getConnectedStartingRoutes();
    }

    if (startingConnections && startingConnections.length > 0) {
      return startingConnections[math.randomValue(0, startingConnections.length - 1)];
    }

    log(LogType.WARNING, "Vehicle is unable to find next route!");
    return undefined;
  }
}

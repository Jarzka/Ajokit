import * as THREE from "three";
import { Vector3 } from "../utils/vector3";
import type { WorldController } from "./world-controller";
import type { CollisionMaskPoint } from "../types";

export class GameplayObject {
  protected readonly _worldController: WorldController;
  protected readonly _model: THREE.Mesh | undefined;
  protected _angle: number = 0; // in radians
  protected _position: Vector3 = new Vector3(0, 0, 0);
  protected _collisionMask: CollisionMaskPoint[] | undefined = undefined;
  protected _collisionMaskTemplate: CollisionMaskPoint[] | undefined = undefined;

  constructor(worldController: WorldController, model: THREE.Mesh | undefined) {
    this._worldController = worldController;
    this._model = model;
    if (model) {
      worldController.getThreeJSScene().add(model);
    }
  }

  public getModel(): THREE.Mesh | undefined {
    return this._model;
  }

  public getPosition(): Vector3 {
    return this._position;
  }

  public setPosition(vector3: Vector3): void {
    this._position = vector3;

    if (this._model) {
      this._model.position.x = vector3.x;
      this._model.position.y = vector3.y;
      this._model.position.z = vector3.z;
    }
  }

  /** Sets current angle in radians. */
  public setAngle(angle: number): void {
    this._angle = angle;

    if (this._collisionMask) {
      this.updateCollisionMask();
    }

    if (this._model) {
      this._model.rotation.y = angle;
    }
  }

  public updateCollisionMask(): void {
    // To be overridden by subclasses
  }

  public die(): void {
    if (this._model) {
      this._worldController.getThreeJSScene().remove(this._model);
    }
  }
}

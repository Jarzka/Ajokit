import * as THREE from "three";
import { GameplayObject } from "./gameplay-object";
import { Vector3 } from "../utils/vector3";
import type { WorldController } from "./world-controller";

export class TrafficLightBall extends GameplayObject {
  private readonly _trafficLight: unknown; // parent traffic light

  constructor(trafficLight: unknown, color: number, worldController: WorldController, position: Vector3) {
    const geometry = new THREE.SphereGeometry(0.2, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color });
    const mesh = new THREE.Mesh(geometry, material);
    super(worldController, mesh);

    this._trafficLight = trafficLight;
    this.setPosition(position);
  }

  public changeColor(newColor: number): void {
    if (this._model) {
      (this._model as THREE.Mesh).material.color.setHex(newColor);
    }
  }

  public override die(): void {
    super.die();
  }
}

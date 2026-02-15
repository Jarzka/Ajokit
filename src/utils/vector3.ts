import { Vector } from "./vector";

export class Vector3 extends Vector {
  public z: number;

  constructor(x: number, y: number, z: number) {
    super(x, y);
    this.z = z;
  }

  public add(vector3: Vector3): Vector3 {
    return new Vector3(this.x + vector3.x, this.y + vector3.y, this.z + vector3.z);
  }

  public subtract(vector3: Vector3): Vector3 {
    return new Vector3(this.x - vector3.x, this.y - vector3.y, this.z - vector3.z);
  }

  public copy(): Vector3 {
    return new Vector3(this.x, this.y, this.z);
  }
}

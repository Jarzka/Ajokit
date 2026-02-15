import { Vector } from "./vector";

export class Vector2 extends Vector {
  constructor(x: number, y: number) {
    super(x, y);
  }

  public add(vector2: Vector2): Vector2 {
    return new Vector2(this.x + vector2.x, this.y + vector2.y);
  }

  public subtract(vector2: Vector2): Vector2 {
    return new Vector2(this.x - vector2.x, this.y - vector2.y);
  }

  public copy(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  public normalVector(): Vector2 {
    return new Vector2(-this.y, this.x);
  }
}

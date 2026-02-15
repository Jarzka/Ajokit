import { RoadType } from "./road.types";

export class GameMap {
  private readonly _TILE_SIZE = 8; // Measured in meters in real world

  /* Map object types:
   * Q = Road up left
   * E = Road up right
   * W = Road down left
   * R = Road bottom right
   * T = Road horizontal
   * Y = Road vertical
   * I = Crossroads
   * O = Road down left right
   * P = Road up left down
   * S = Road up left right
   * A = Road up right down
   * D = Road up end
   * F = Road down end
   * G = Road left end
   * H = Road right end
   *   = Nothing
   * X = Road type calculated automatically
   */
  private _map: string = [
    "             ",
    "  XXXXXXXXXX ",
    " XX X  X   X ",
    " X  X  X  XX ",
    " X  XXXXXXX  ",
    " X  X  X  X  ",
    " XX X XX  X  ",
    "  XXXXX   XX ",
    "             ",
  ].join("\n");

  public getWidth(): number {
    let highest = 0;
    const lines = this._map.split("\n");
    for (let i = 0; i < lines.length; i++) {
      highest = Math.max(lines[i].length, highest);
    }

    return highest * this.getTileSize();
  }

  public getNumberOfColumns(): number {
    let highest = 0;
    const lines = this._map.split("\n");
    for (let i = 0; i < lines.length; i++) {
      highest = Math.max(lines[i].length, highest);
    }

    return highest;
  }

  public getHeight(): number {
    return this._map.split("\n").length * this.getTileSize();
  }

  public getNumberOfRows(): number {
    return this._map.split("\n").length;
  }

  /** Inserts the given id to the given position in map. Return true if map changed. */
  public insertObjectToLocation(id: string, row: number, column: number): boolean {
    const rows = this._map.split("\n");
    const previousId = rows[row].slice(column, column + 1);
    rows[row] = rows[row].slice(0, column) + id + rows[row].slice(column + id.length);
    this._map = rows.join("\n");

    return id !== previousId;
  }

  public convertMouseCoordinateToRowAndColumn(mouseX: number, mouseZ: number): { row: number; column: number } | undefined {
    const row = Math.floor(mouseZ / this.getTileSize());
    const column = Math.floor(mouseX / this.getTileSize());

    if (row >= 0 && row <= this.getNumberOfRows() && column >= 0 && column <= this.getNumberOfColumns()) {
      return { row, column };
    }

    return undefined;
  }

  public getTileSize(): number {
    return this._TILE_SIZE;
  }

  public getMapAsString(): string {
    return this._map;
  }

  public getMapAsArray(): string[] {
    return this._map.split("\n");
  }

  public isRoad(objectType: string | undefined): boolean {
    if (objectType === "" || objectType === undefined) {
      return false;
    }

    const roadTypes = "QEWRTYIOPSADFGHX";
    return roadTypes.includes(objectType);
  }

  /* Returns object type in the given position. If object is not found, returns undefined */
  public getObjectTypeAtPosition(lineIndex: number, columnIndex: number): string | undefined {
    const line = this.getMapAsArray()[lineIndex];
    if (line) {
      const column = line[columnIndex];

      if (column) {
        return column;
      }
    }

    return undefined;
  }

  public resolveRoadType(lineIndex: number, columnIndex: number): RoadType {
    // Crossroads
    if (
      this.isRoad(this.getObjectTypeAtPosition(lineIndex - 1, columnIndex)) &&
      this.isRoad(this.getObjectTypeAtPosition(lineIndex + 1, columnIndex)) &&
      this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex + 1)) &&
      this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex - 1))
    ) {
      return RoadType.CROSSROADS;
    }

    // Down left right
    if (
      this.isRoad(this.getObjectTypeAtPosition(lineIndex + 1, columnIndex)) &&
      this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex + 1)) &&
      this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex - 1))
    ) {
      return RoadType.DOWN_LEFT_RIGHT;
    }

    // Up left down
    if (
      this.isRoad(this.getObjectTypeAtPosition(lineIndex - 1, columnIndex)) &&
      this.isRoad(this.getObjectTypeAtPosition(lineIndex + 1, columnIndex)) &&
      this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex - 1))
    ) {
      return RoadType.UP_LEFT_DOWN;
    }

    // Up left right
    if (
      this.isRoad(this.getObjectTypeAtPosition(lineIndex - 1, columnIndex)) &&
      this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex + 1)) &&
      this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex - 1))
    ) {
      return RoadType.UP_LEFT_RIGHT;
    }

    // Up right down
    if (
      this.isRoad(this.getObjectTypeAtPosition(lineIndex - 1, columnIndex)) &&
      this.isRoad(this.getObjectTypeAtPosition(lineIndex + 1, columnIndex)) &&
      this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex + 1))
    ) {
      return RoadType.UP_RIGHT_DOWN;
    }

    // Vertical road
    if (
      this.isRoad(this.getObjectTypeAtPosition(lineIndex - 1, columnIndex)) &&
      this.isRoad(this.getObjectTypeAtPosition(lineIndex + 1, columnIndex))
    ) {
      return RoadType.VERTICAL;
    }

    // Horizontal road
    if (
      this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex - 1)) &&
      this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex + 1))
    ) {
      return RoadType.HORIZONTAL;
    }

    // Up right
    if (
      this.isRoad(this.getObjectTypeAtPosition(lineIndex - 1, columnIndex)) &&
      this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex + 1))
    ) {
      return RoadType.UP_RIGHT;
    }

    // Up left
    if (
      this.isRoad(this.getObjectTypeAtPosition(lineIndex - 1, columnIndex)) &&
      this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex - 1))
    ) {
      return RoadType.UP_LEFT;
    }

    // Down right
    if (
      this.isRoad(this.getObjectTypeAtPosition(lineIndex + 1, columnIndex)) &&
      this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex + 1))
    ) {
      return RoadType.DOWN_RIGHT;
    }

    // Down left
    if (
      this.isRoad(this.getObjectTypeAtPosition(lineIndex + 1, columnIndex)) &&
      this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex - 1))
    ) {
      return RoadType.DOWN_LEFT;
    }

    // Up end
    if (
      !this.isRoad(this.getObjectTypeAtPosition(lineIndex - 1, columnIndex)) &&
      this.isRoad(this.getObjectTypeAtPosition(lineIndex + 1, columnIndex)) &&
      !this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex + 1)) &&
      !this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex - 1))
    ) {
      return RoadType.UP_END;
    }

    // Right end
    if (
      !this.isRoad(this.getObjectTypeAtPosition(lineIndex - 1, columnIndex)) &&
      !this.isRoad(this.getObjectTypeAtPosition(lineIndex + 1, columnIndex)) &&
      !this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex + 1)) &&
      this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex - 1))
    ) {
      return RoadType.RIGHT_END;
    }

    // Down end
    if (
      this.isRoad(this.getObjectTypeAtPosition(lineIndex - 1, columnIndex)) &&
      !this.isRoad(this.getObjectTypeAtPosition(lineIndex + 1, columnIndex)) &&
      !this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex + 1)) &&
      !this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex - 1))
    ) {
      return RoadType.DOWN_END;
    }

    // Left end
    if (
      !this.isRoad(this.getObjectTypeAtPosition(lineIndex - 1, columnIndex)) &&
      !this.isRoad(this.getObjectTypeAtPosition(lineIndex + 1, columnIndex)) &&
      this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex + 1)) &&
      !this.isRoad(this.getObjectTypeAtPosition(lineIndex, columnIndex - 1))
    ) {
      return RoadType.LEFT_END;
    }

    return RoadType.HORIZONTAL; // Default type
  }
}

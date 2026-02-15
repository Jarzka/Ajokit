import { describe, it, expect } from "vitest";
import { Vector3 } from "../../src/utils/vector3";

describe("Vector3", () => {
  describe("add", () => {
    it("should add two vectors", () => {
      const vector = new Vector3(-1, 0, -3);
      const result = vector.add(new Vector3(1, 1, 1));

      expect(result.x).toBe(0);
      expect(result.y).toBe(1);
      expect(result.z).toBe(-2);
    });
  });
});

import { describe, it, expect } from 'vitest';
import { Vector2 } from '../../src/utils/vector2';
import * as math from '../../src/utils/math';

describe('Math', () => {
  describe('randomValue', () => {
    it('should return random values', () => {
      // Fill array with random values between 0 and 10
      const values: number[] = [];
      for (let i = 0; i < 10000; i++) {
        values.push(math.randomValue(0, 10));
      }

      // Count numbers
      const result: Record<string, number> = {};
      values.forEach((number) => {
        const numberAsString = number.toString();
        result[numberAsString] = (result[numberAsString] || 0) + 1;
      });

      // There must be at least two of each number
      expect(Object.keys(result).length).toBe(11);
      Object.keys(result).forEach((key) => {
        expect(result[key]).toBeGreaterThan(1);
      });
    });
  });

  describe('angleBetweenPointsWhenYIncreasesDown', () => {
    it('should return 45 degrees for (0,0) to (1,-1)', () => {
      const angleRadians = math.angleBetweenPointsWhenYIncreasesDown(0, 0, 1, -1);
      const angleDegree = math.degrees(angleRadians);

      expect(angleDegree).toBe(45);
    });

    it('should return 135 degrees for (0,0) to (-1,-1)', () => {
      const angleRadians = math.angleBetweenPointsWhenYIncreasesDown(0, 0, -1, -1);
      const angleDegree = math.degrees(angleRadians);

      expect(angleDegree).toBe(135);
    });

    it('should return 225 degrees for (0,0) to (-1,1)', () => {
      const angleRadians = math.angleBetweenPointsWhenYIncreasesDown(0, 0, -1, 1);
      const angleDegree = math.degrees(angleRadians);

      expect(angleDegree).toBe(225);
    });
  });

  describe('polygonCollision', () => {
    it('should detect two colliding polygons', () => {
      const polygon1 = [
        new Vector2(0, 0),
        new Vector2(1, 0),
        new Vector2(1, -1),
        new Vector2(0, -1),
      ];
      // polygon2 has a corner at (0.5, -0.5) which is inside polygon1
      const polygon2 = [
        new Vector2(0.5, -0.5),
        new Vector2(2, -2),
        new Vector2(2, -3),
        new Vector2(0.5, -2),
      ];

      expect(math.polygonCollision(polygon1, polygon2)).toBe(true);
    });

    it("should return false for non-colliding polygons", () => {
      const polygon1 = [
        new Vector2(0, 0),
        new Vector2(1, 0),
        new Vector2(1, -1),
        new Vector2(0, -1),
      ];
      // polygon2 is far away from polygon1 - no overlap
      const polygon2 = [
        new Vector2(4, 4),
        new Vector2(5, 4),
        new Vector2(5, 5),
        new Vector2(4, 5),
      ];

      expect(math.polygonCollision(polygon1, polygon2)).toBe(false);
    });
  });
});

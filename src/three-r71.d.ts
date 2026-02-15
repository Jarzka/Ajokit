/**
 * Type declarations for three@0.71.0 (r71).
 * This version predates official @types/three and uses many APIs
 * that were later deprecated or removed. We declare them here so
 * TypeScript doesn"t error on the legacy API surface.
 */

declare module "three" {
  // ---- Core ----
  export class WebGLRenderer {
    constructor(parameters?: { antialias?: boolean });
    setSize(width: number, height: number): void;
    render(scene: Scene, camera: Camera): void;
    domElement: HTMLCanvasElement;
    shadowMapEnabled: boolean;
    shadowMapSoft: boolean;
  }

  export class Scene {
    add(object: Object3D): void;
    remove(object: Object3D): void;
  }

  export class Object3D {
    position: Vector3;
    rotation: Euler;
    castShadow: boolean;
    receiveShadow: boolean;
    clone(): this;
  }

  export class Euler {
    x: number;
    y: number;
    z: number;
  }

  export class Vector3 {
    constructor(x?: number, y?: number, z?: number);
    x: number;
    y: number;
    z: number;
    set(x: number, y: number, z: number): this;
    unproject(camera: Camera): this;
    sub(v: Vector3): this;
    normalize(): this;
    add(v: Vector3): this;
    clone(): Vector3;
    multiplyScalar(s: number): this;
  }

  export class Camera extends Object3D {
    aspect?: number;
    updateProjectionMatrix?(): void;
  }

  export class PerspectiveCamera extends Camera {
    constructor(fov: number, aspect: number, near: number, far: number);
    aspect: number;
    updateProjectionMatrix(): void;
  }

  export class Clock {
    constructor(autoStart?: boolean);
    getDelta(): number;
  }

  // ---- Geometry ----
  export class Geometry {
    vertices: Vector3[];
    verticesNeedUpdate: boolean;
  }

  export class PlaneGeometry extends Geometry {
    constructor(width: number, height: number, widthSegments?: number, heightSegments?: number);
  }

  export class SphereGeometry extends Geometry {
    constructor(radius: number, widthSegments: number, heightSegments: number);
  }

  /** r71 name for BoxGeometry */
  export class CubeGeometry extends Geometry {
    constructor(width: number, height: number, depth: number);
  }

  export class BoxGeometry extends Geometry {
    constructor(width: number, height: number, depth: number);
  }

  // ---- Materials ----
  export class Material {
    color: Color;
    map?: Texture;
  }

  export class MeshBasicMaterial extends Material {
    constructor(parameters?: { color?: number; map?: Texture; side?: number });
  }

  export class MeshLambertMaterial extends Material {
    constructor(parameters?: { color?: number; map?: Texture });
  }

  export class LineBasicMaterial extends Material {
    constructor(parameters?: { color?: number; linewidth?: number });
  }

  /** r71 legacy: array of materials passed to Mesh */
  export class MeshFaceMaterial {
    constructor(materials: Material[]);
  }

  // ---- Objects ----
  export class Mesh extends Object3D {
    constructor(geometry: Geometry, material: Material | MeshFaceMaterial);
    material: Material;
    geometry: Geometry;
  }

  export class Line extends Object3D {
    constructor(geometry: Geometry, material: Material);
    geometry: Geometry;
  }

  // ---- Lights ----
  export class Light extends Object3D {
    shadowDarkness: number;
  }

  export class DirectionalLight extends Light {
    constructor(color: number, intensity: number);
    target: Object3D;
    castShadow: boolean;
    shadowDarkness: number;
  }

  // ---- Textures ----
  export class Texture {
    wrapS: number;
    wrapT: number;
    repeat: { set(x: number, y: number): void };
  }

  export class Color {
    constructor(color?: number | string);
    setHex(hex: number): void;
  }

  // ---- Loaders ----
  export class JSONLoader {
    constructor();
    load(url: string, callback: (geometry: Geometry) => void): void;
  }

  // ---- Constants ----
  export const RepeatWrapping: number;
  export const BackSide: number;

  // ---- Deprecated utilities ----
  export namespace ImageUtils {
    function loadTexture(
      url: string,
      mapping?: undefined,
      onLoad?: (texture: Texture) => void,
      onError?: (error: any) => void
    ): Texture;
  }
}

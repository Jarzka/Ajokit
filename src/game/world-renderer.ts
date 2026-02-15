import * as THREE from "three";
import type { WorldController } from "./world-controller";

export class WorldRenderer {
  private _renderer!: THREE.WebGLRenderer;
  private readonly _worldController: WorldController;
  private readonly _drawDebugInfo = {
    roadRouteLines: false,
    collisionMasks: false,
    vehicleCollisionPredictionPoints: false,
  };

  private _roadRouteDebugLines: THREE.Line[] = [];
  private _roadRouteDebugPoints: THREE.Line[] = [];
  private _vehicleCollisionMaskLines: THREE.Line[] = [];
  private _vehicleCollisionPredictionMaskLines: THREE.Line[] = [];
  private _editModeRectangle: THREE.Line[] = [];

  constructor(worldController: WorldController) {
    this._worldController = worldController;
    this._initialize();
    this._addEventListeners();
  }

  private _addEventListeners(): void {
    window.addEventListener("resize", () => {
      if (this._worldController.getCamera) {
        this._worldController.getCamera().aspect = window.innerWidth / window.innerHeight;
        this._worldController.getCamera().updateProjectionMatrix();

        this._renderer.setSize(window.innerWidth, window.innerHeight);
      }
    });
  }

  private _initialize(): void {
    this._renderer = new THREE.WebGLRenderer({ antialias: true });
    this._renderer.setSize(window.innerWidth, window.innerHeight);
    (this._renderer as any).shadowMapEnabled = true;
    (this._renderer as any).shadowMapSoft = true;
    document.body.appendChild(this._renderer.domElement);
  }

  public render(): void {
    this._updateDebugLines();
    this._updateEditModeRectangle();
    this._renderer.render(this._worldController.getThreeJSScene(), this._worldController.getCamera());
  }

  private _updateDebugLines(): void {
    if (this._drawDebugInfo.roadRouteLines) {
      this._updateRoadRouteDebugLinesAndPoints();
    }

    if (this._drawDebugInfo.collisionMasks) {
      this._updateCarMaskDebugLines();
    }

    if (this._drawDebugInfo.vehicleCollisionPredictionPoints) {
      this._updateVehicleCollisionPredictionPoints();
    }
  }

  private _updateEditModeRectangle(): void {
    this._updateEditModeRectangleLinesInScene();
    this._updateEditModeRectangleLinePositions();
  }

  private _updateEditModeRectangleLinePositions(): void {
    const mouseCoords = this._worldController.getMouseWorldCoordinates();
    if (this._editModeRectangle.length > 0 && mouseCoords) {
      const tileSize = this._worldController.getMap().getTileSize();
      const mouseXGrid = Math.floor(mouseCoords.x / tileSize) * tileSize;
      const mouseZGrid = Math.floor(mouseCoords.z / tileSize) * tileSize;
      const positionY = 0.1;

      // TOP
      (this._editModeRectangle[0].geometry as THREE.Geometry).vertices[0] = new THREE.Vector3(mouseXGrid, positionY, mouseZGrid);
      (this._editModeRectangle[0].geometry as THREE.Geometry).verticesNeedUpdate = true;
      (this._editModeRectangle[0].geometry as THREE.Geometry).vertices[1] = new THREE.Vector3(mouseXGrid + tileSize, positionY, mouseZGrid);
      (this._editModeRectangle[0].geometry as THREE.Geometry).verticesNeedUpdate = true;

      // RIGHT
      (this._editModeRectangle[1].geometry as THREE.Geometry).vertices[0] = new THREE.Vector3(mouseXGrid + tileSize, positionY, mouseZGrid);
      (this._editModeRectangle[1].geometry as THREE.Geometry).verticesNeedUpdate = true;
      (this._editModeRectangle[1].geometry as THREE.Geometry).vertices[1] = new THREE.Vector3(mouseXGrid + tileSize, positionY, mouseZGrid + tileSize);
      (this._editModeRectangle[1].geometry as THREE.Geometry).verticesNeedUpdate = true;

      // BOTTOM
      (this._editModeRectangle[2].geometry as THREE.Geometry).vertices[0] = new THREE.Vector3(mouseXGrid + tileSize, positionY, mouseZGrid + tileSize);
      (this._editModeRectangle[2].geometry as THREE.Geometry).verticesNeedUpdate = true;
      (this._editModeRectangle[2].geometry as THREE.Geometry).vertices[1] = new THREE.Vector3(mouseXGrid, positionY, mouseZGrid + tileSize);
      (this._editModeRectangle[2].geometry as THREE.Geometry).verticesNeedUpdate = true;

      // LEFT
      (this._editModeRectangle[3].geometry as THREE.Geometry).vertices[0] = new THREE.Vector3(mouseXGrid, positionY, mouseZGrid + tileSize);
      (this._editModeRectangle[3].geometry as THREE.Geometry).verticesNeedUpdate = true;
      (this._editModeRectangle[3].geometry as THREE.Geometry).vertices[1] = new THREE.Vector3(mouseXGrid, positionY, mouseZGrid);
      (this._editModeRectangle[3].geometry as THREE.Geometry).verticesNeedUpdate = true;
    }
  }

  private _updateEditModeRectangleLinesInScene(): void {
    if (this._worldController.isEditModeOn() && this._worldController.isMouseOnMap()) {
      if (this._editModeRectangle.length === 0) {
        const scene = this._worldController.getThreeJSScene();

        // TOP
        let rectangleTop: any = new THREE.Geometry();
        rectangleTop.vertices.push(new THREE.Vector3(0, 1, 0));
        rectangleTop.vertices.push(new THREE.Vector3(8, 1, 0));
        const topMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff, linewidth: 2 });
        rectangleTop = new THREE.Line(rectangleTop, topMaterial);
        this._editModeRectangle.push(rectangleTop);
        scene.add(rectangleTop);

        // RIGHT
        let rectangleRight: any = new THREE.Geometry();
        rectangleRight.vertices.push(new THREE.Vector3(8, 1, 0));
        rectangleRight.vertices.push(new THREE.Vector3(8, 1, 8));
        const rightMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff, linewidth: 2 });
        rectangleRight = new THREE.Line(rectangleRight, rightMaterial);
        this._editModeRectangle.push(rectangleRight);
        scene.add(rectangleRight);

        // BOTTOM
        let rectangleBottom: any = new THREE.Geometry();
        rectangleBottom.vertices.push(new THREE.Vector3(8, 1, 8));
        rectangleBottom.vertices.push(new THREE.Vector3(0, 1, 8));
        const bottomMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff, linewidth: 2 });
        rectangleBottom = new THREE.Line(rectangleBottom, bottomMaterial);
        this._editModeRectangle.push(rectangleBottom);
        scene.add(rectangleBottom);

        // LEFT
        let rectangleLeft: any = new THREE.Geometry();
        rectangleLeft.vertices.push(new THREE.Vector3(0, 1, 8));
        rectangleLeft.vertices.push(new THREE.Vector3(0, 1, 0));
        const leftMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff, linewidth: 2 });
        rectangleLeft = new THREE.Line(rectangleLeft, leftMaterial);
        this._editModeRectangle.push(rectangleLeft);
        scene.add(rectangleLeft);
      }
    } else {
      for (const line of this._editModeRectangle) {
        this._worldController.getThreeJSScene().remove(line);
      }

      this._editModeRectangle = [];
    }
  }

  private _updateCarMaskDebugLines(): void {
    // FIXME VERY SLOW, but used only in development machines so probably there is no immediate need to fix this
    for (const line of this._vehicleCollisionMaskLines) {
      this._worldController.getThreeJSScene().remove(line);
    }

    this._vehicleCollisionMaskLines = [];

    for (const vehicle of this._worldController.getVehicleController().getVehicles()) {
      const collisionMaskPoints = vehicle.getCollisionMaskInWorld();

      for (let i = 0; i < collisionMaskPoints.length; i++) {
        let startPoint: any, endPoint: any = undefined;
        if (i < collisionMaskPoints.length - 1) {
          startPoint = collisionMaskPoints[i];
          endPoint = collisionMaskPoints[i + 1];
        } else {
          startPoint = collisionMaskPoints[i];
          endPoint = collisionMaskPoints[0];
        }

        let debugLine: any = new THREE.Geometry();
        debugLine.vertices.push(new THREE.Vector3(startPoint.x, 1, startPoint.z));
        debugLine.vertices.push(new THREE.Vector3(endPoint.x, 1, endPoint.z));
        const material = new THREE.LineBasicMaterial({ color: 0xffff00, linewidth: 2 });
        debugLine = new THREE.Line(debugLine, material);
        this._vehicleCollisionMaskLines.push(debugLine);
        this._worldController.getThreeJSScene().add(debugLine);
      }
    }
  }

  private _updateVehicleCollisionPredictionPoints(): void {
    // FIXME VERY SLOW, but used only in development machines so probably there is no immediate need to fix this
    for (const line of this._vehicleCollisionPredictionMaskLines) {
      this._worldController.getThreeJSScene().remove(line);
    }

    this._vehicleCollisionPredictionMaskLines = [];

    for (const vehicle of this._worldController.getVehicleController().getVehicles()) {
      const collisionPredictionPolygon = vehicle.getCollisionPredictionPolygon();

      if (collisionPredictionPolygon) {
        for (let i = 0; i < collisionPredictionPolygon.length; i++) {
          let startPoint: any, endPoint: any = undefined;
          if (i < collisionPredictionPolygon.length - 1) {
            startPoint = collisionPredictionPolygon[i];
            endPoint = collisionPredictionPolygon[i + 1];
          } else {
            startPoint = collisionPredictionPolygon[i];
            endPoint = collisionPredictionPolygon[0];
          }

          let debugLine: any = new THREE.Geometry();
          debugLine.vertices.push(new THREE.Vector3(startPoint.x, 1, startPoint.z));
          debugLine.vertices.push(new THREE.Vector3(endPoint.x, 1, endPoint.z));
          const material = new THREE.LineBasicMaterial({ color: 0xff0f00, linewidth: 2 });
          debugLine = new THREE.Line(debugLine, material);
          this._vehicleCollisionPredictionMaskLines.push(debugLine);
          this._worldController.getThreeJSScene().add(debugLine);
        }
      }
    }
  }

  private _updateRoadRouteDebugLinesAndPoints(): void {
    // FIXME VERY SLOW, but used only in development machines so probably there is no immediate need to fix this
    for (const line of this._roadRouteDebugLines) {
      this._worldController.getThreeJSScene().remove(line);
    }

    for (const point of this._roadRouteDebugPoints) {
      this._worldController.getThreeJSScene().remove(point);
    }

    this._roadRouteDebugLines = [];
    this._roadRouteDebugPoints = [];

    for (const route of this._worldController.getRoadController().getRoutes()) {
      let debugLine: any = new THREE.Geometry();
      debugLine.vertices.push(new THREE.Vector3(route.startNode.position.x, 0.15, route.startNode.position.z));
      debugLine.vertices.push(new THREE.Vector3(route.endNode.position.x, 0.15, route.endNode.position.z));
      const material = new THREE.LineBasicMaterial({
        color: route.isFree() ? 0x00ff00 : 0xff0000,
        linewidth: 2,
      });
      debugLine = new THREE.Line(debugLine, material);
      this._roadRouteDebugLines.push(debugLine);
      this._worldController.getThreeJSScene().add(debugLine);
    }

    for (const node of this._worldController.getRoadController().getNodes()) {
      let debugPoint: any = new THREE.Geometry();
      debugPoint.vertices.push(new THREE.Vector3(node.position.x, 0, node.position.z));
      debugPoint.vertices.push(new THREE.Vector3(node.position.x, 0.5, node.position.z));
      const material = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 4 });
      debugPoint = new THREE.Line(debugPoint, material);
      this._roadRouteDebugPoints.push(debugPoint);
      this._worldController.getThreeJSScene().add(debugPoint);
    }
  }
}

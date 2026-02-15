import * as THREE from "three";
import { GameMap } from "./map";
import { RoadController } from "./road-controller";
import { VehicleController } from "./vehicle-controller";
import { KeyboardState } from "../lib/keyboard-state";
import { RoadType } from "./road.types";
import { DriverPersonality } from "./vehicle.types";
import * as math from "../utils/math";
import { log, LogType } from "../utils/logger";
import type { GameplayScene } from "../scenes/gameplay-scene";

interface DomNodes {
  "button-edit-mode": HTMLElement | undefined;
  info: HTMLElement | undefined;
  "edit-mode-actions": HTMLElement | undefined;
  "automatic-camera": HTMLElement | undefined;
}

interface MouseState {
  LEFT_BUTTON_PRESSED: boolean;
  RIGHT_BUTTON_PRESSED: boolean;
}

export class WorldController {
  private readonly _gameplayScene: GameplayScene;
  private readonly _map: GameMap;
  private _scene!: THREE.Scene;
  private _camera!: THREE.PerspectiveCamera;
  private readonly _buttonsPressedOnLastFrame: string[] = [];

  private readonly _keyboard!: KeyboardState;
  private readonly _mouse: MouseState = {
    LEFT_BUTTON_PRESSED: false,
    RIGHT_BUTTON_PRESSED: false,
  };
  private _mouseWorldCoordinates: THREE.Vector3 | undefined = undefined;

  private readonly _roadController: RoadController;
  private readonly _vehicleController: VehicleController;

  private readonly _domNodes: DomNodes;

  private _editMode = false;

  private _currentCameraPositionId = 1;
  private _cameraTarget: any = undefined;
  private _lastAutomaticCameraPositionSwitch = 0;
  private _switchCameraPositionAutomatically = false;
  private _isHudEnabled: boolean = false;

  constructor(gameplayScene: GameplayScene) {
    this._gameplayScene = gameplayScene;
    this._map = new GameMap();
    this._roadController = new RoadController(this as any);
    this._vehicleController = new VehicleController(this as any);
    this._keyboard = new KeyboardState();

    this._domNodes = {
      "button-edit-mode": (document.querySelector(".button-edit-mode") ?? undefined) as HTMLElement | undefined,
      info: (document.querySelector(".info") ?? undefined) as HTMLElement | undefined,
      "edit-mode-actions": (document.querySelector(".edit-mode-actions") ?? undefined) as HTMLElement | undefined,
      "automatic-camera": (document.querySelector(".automatic-camera") ?? undefined) as HTMLElement | undefined,
    };

    this._initialize();
  }

  private _initialize(): void {
    this._initializeScene();
    this._initializeCamera();
    this._initializeWorld();
    this._initializeEventListeners();
  }

  private _initializeScene(): void {
    this._scene = new THREE.Scene();
  }

  private _initializeCamera(): void {
    this._camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    this._adjustCameraPosition();
  }

  private _initializeEventListeners(): void {
    window.addEventListener("mousemove", (event: MouseEvent) => {
      const position = new THREE.Vector3(0, 0, 0);
      const mousePosition = new THREE.Vector3(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1,
        1
      );
      mousePosition.unproject(this._camera);
      const cameraPosition = this._camera.position;
      const m = mousePosition.y / (mousePosition.y - cameraPosition.y);
      position.x = mousePosition.x + (cameraPosition.x - mousePosition.x) * m;
      position.z = mousePosition.z + (cameraPosition.z - mousePosition.z) * m;
      this._mouseWorldCoordinates = position;
    });

    // Edit Mode
    document.querySelector(".button-edit-mode")?.addEventListener("click", () => {
      this._editMode = !this._editMode;

      if (this._editMode) {
        this._currentCameraPositionId = 1;
        this._switchCameraPositionAutomatically = false;
      }
    });

    document.querySelector(".button-add-normal-car")?.addEventListener("click", () => {
      if (this._editMode) {
        this._vehicleController.insertCarAtRandomFreePosition(
          DriverPersonality.NEUTRAL,
          this._roadController.getNodes(),
          this._map as any
        );
      }
    });

    document.querySelector(".button-remove-normal-car")?.addEventListener("click", () => {
      if (this._editMode) {
        this._vehicleController.removeRandomCar(DriverPersonality.NEUTRAL);
      }
    });

    document.querySelector(".button-add-fast-car")?.addEventListener("click", () => {
      if (this._editMode) {
        this._vehicleController.insertCarAtRandomFreePosition(
          DriverPersonality.CRAZY,
          this._roadController.getNodes(),
          this._map as any
        );
      }
    });

    document.querySelector(".button-remove-fast-car")?.addEventListener("click", () => {
      if (this._editMode) {
        this._vehicleController.removeRandomCar(DriverPersonality.CRAZY);
      }
    });

    document.querySelector(".button-add-slow-car")?.addEventListener("click", () => {
      if (this._editMode) {
        this._vehicleController.insertCarAtRandomFreePosition(
          DriverPersonality.GRANNY,
          this._roadController.getNodes(),
          this._map as any
        );
      }
    });

    document.querySelector(".button-remove-slow-car")?.addEventListener("click", () => {
      if (this._editMode) {
        this._vehicleController.removeRandomCar(DriverPersonality.GRANNY);
      }
    });

    // Mouse state
    document.body.onmousedown = (evt: MouseEvent) => {
      if (evt.button === 0) {
        this._mouse.LEFT_BUTTON_PRESSED = true;
      }

      if (evt.button === 2) {
        this._mouse.RIGHT_BUTTON_PRESSED = true;
      }
    };

    document.body.onmouseup = (evt: MouseEvent) => {
      if (evt.button === 0) {
        this._mouse.LEFT_BUTTON_PRESSED = false;
      }

      if (evt.button === 2) {
        this._mouse.RIGHT_BUTTON_PRESSED = false;
      }
    };
  }

  private _synchronizeGameWorldWithMap(): void {
    const mapLines = this._map.getMapAsArray();
    for (let lineIndex = 0; lineIndex < mapLines.length; lineIndex++) {
      const line = mapLines[lineIndex];
      for (let columnIndex = 0; columnIndex < line.length; columnIndex++) {
        const objectType = line.charAt(columnIndex);
        this._handleRoadType(objectType, lineIndex, columnIndex);
        this._handleEmptyType(objectType, lineIndex, columnIndex);
      }
    }
  }

  private _handleRoadType(objectType: string, lineIndex: number, columnIndex: number): void {
    let roadType: RoadType | undefined = undefined;
    if (objectType === "X") {
      roadType = this._map.resolveRoadType(lineIndex, columnIndex);
    }

    if (roadType !== undefined) {
      const x = columnIndex * this._map.getTileSize() + this._map.getTileSize() / 2;
      const z = lineIndex * this._map.getTileSize() + this._map.getTileSize() / 2;
      const objectInWorld = this._roadController.getRoads().filter((road) => {
        return road.getPosition().x === x && road.getPosition().z === z;
      })[0];

      if (objectInWorld && objectInWorld.getRoadType() !== roadType) {
        objectInWorld.die();
        this._insertGameplayObjectToWorld(roadType, x, 0, z);
      }

      if (!objectInWorld) {
        this._insertGameplayObjectToWorld(roadType, x, 0, z);
      }
    }
  }

  private _handleEmptyType(objectType: string, lineIndex: number, columnIndex: number): void {
    if (objectType === " ") {
      const x = columnIndex * this._map.getTileSize() + this._map.getTileSize() / 2;
      const z = lineIndex * this._map.getTileSize() + this._map.getTileSize() / 2;

      const objectInWorld = this._roadController.getRoads().filter((road) => {
        return road.getPosition().x === x && road.getPosition().z === z;
      })[0];

      if (objectInWorld) {
        objectInWorld.die();
        this._roadController.mergeAndRemoveOrphans();
      }
    }
  }

  private _initializeTerrain(): void {
    const geometry = new THREE.PlaneGeometry(this._map.getWidth(), this._map.getHeight(), 1, 1);
    const material = new THREE.MeshBasicMaterial({
      map: this._gameplayScene.getApplication().getTextureContainer().getTextureByName("grass"),
    });
    const terrain = new THREE.Mesh(geometry, material);
    terrain.position.x = this._map.getWidth() / 2;
    terrain.position.z = this._map.getHeight() / 2;
    terrain.rotation.x = (-90 * Math.PI) / 180;
    terrain.castShadow = true;
    terrain.receiveShadow = true;
    this._scene.add(terrain);
  }

  private _initializeLights(): void {
    const light = new THREE.DirectionalLight(0xefe694, 1);
    light.target.position.x = this._map.getTileSize() * 5;
    light.target.position.y = 40;
    light.target.position.z = this._map.getTileSize() * 5;
    light.position.x = this._map.getTileSize() * 7;
    light.position.y = this._map.getTileSize() * 8;
    light.position.z = -this._map.getTileSize();

    light.castShadow = true;
    (light as any).shadowDarkness = 0.5;
    this._scene.add(light);
  }

  private _initializeSky(): void {
    const sky = new THREE.Mesh(
      new (THREE as any).CubeGeometry(5000, 5000, 5000),
      new (THREE as any).MeshFaceMaterial(
        this._gameplayScene.getApplication().getTextureContainer().getTextureByName("skybox")
      )
    );
    sky.position.x = this._map.getWidth() / 2;
    sky.position.z = this._map.getHeight() / 2;
    this._scene.add(sky);
  }

  private _insertGameplayObjectToWorld(id: RoadType, x: number, _y: number, z: number): void {
    this._roadController.insertRoad(id, x, z);
  }

  private _initializeCars(): void {
    this._vehicleController.initializeCars();
  }

  private _initializeWorld(): void {
    this._synchronizeGameWorldWithMap();
    this._roadController.mergeAndRemoveOrphans();
    this._initializeTerrain();
    this._initializeLights();
    this._initializeSky();
    this._initializeCars();
  }

  private _isMouseOnMap(): boolean {
    if (!this._mouseWorldCoordinates) return false;
    return (
      this._mouseWorldCoordinates.x > 0 &&
      this._mouseWorldCoordinates.x < this._map.getWidth() &&
      this._mouseWorldCoordinates.z > 0 &&
      this._mouseWorldCoordinates.z < this._map.getHeight()
    );
  }

  private _readInput(): void {
    if (!this._editMode) {
      this._handleCameraPosition();
      this._handleAutomaticCameraPositionSwitch();
    }

    this._handleEditMode();
  }

  private _handleCameraPosition(): void {
    for (let i = 1; i <= 4; i++) {
      if (this._keyboard.pressed(i.toString())) {
        if (!this._buttonsPressedOnLastFrame.includes(i.toString())) {
          this._cameraTarget = undefined;
          this._buttonsPressedOnLastFrame.push(i.toString());
          this._currentCameraPositionId = i;
        }
      } else {
        const idx = this._buttonsPressedOnLastFrame.indexOf(i.toString());
        if (idx > -1) {
          this._buttonsPressedOnLastFrame.splice(idx, 1);
        }
      }
    }
  }

  private _handleAutomaticCameraPositionSwitch(): void {
    const A = "A";
    if (this._keyboard.pressed(A)) {
      if (!this._buttonsPressedOnLastFrame.includes(A)) {
        this._buttonsPressedOnLastFrame.push(A);
        this._switchCameraPositionAutomatically = !this._switchCameraPositionAutomatically;
      }
    } else {
      const idx = this._buttonsPressedOnLastFrame.indexOf(A);
      if (idx > -1) {
        this._buttonsPressedOnLastFrame.splice(idx, 1);
      }
    }
  }

  private _handleEditMode(): void {
    if (this._editMode) {
      this._handleInsertRoad();
      this._handleRemoveRoad();
    }
  }

  private _handleInsertRoad(): void {
    if (this._mouse.LEFT_BUTTON_PRESSED && this._mouseWorldCoordinates) {
      const mapPosition = this._map.convertMouseCoordinateToRowAndColumn(
        this._mouseWorldCoordinates.x,
        this._mouseWorldCoordinates.z
      );
      if (mapPosition && this._isMouseOnMap()) {
        const mapChanged = this._map.insertObjectToLocation("X", mapPosition.row, mapPosition.column);
        if (mapChanged) {
          this._synchronizeGameWorldWithMap();
        }
      }
    }
  }

  private _handleRemoveRoad(): void {
    if (this._mouse.RIGHT_BUTTON_PRESSED && this._mouseWorldCoordinates) {
      const mapPosition = this._map.convertMouseCoordinateToRowAndColumn(
        this._mouseWorldCoordinates.x,
        this._mouseWorldCoordinates.z
      );
      if (mapPosition && this._isMouseOnMap()) {
        const mapChanged = this._map.insertObjectToLocation(" ", mapPosition.row, mapPosition.column);
        if (mapChanged) {
          this._synchronizeGameWorldWithMap();
        }
      }
    }
  }

  private _adjustCameraPosition(): void {
    this._switchCameraAutomaticallyIfTurnedOn();
    this._updateCameraPosition();
  }

  private _switchCameraAutomaticallyIfTurnedOn(): void {
    if (
      this._switchCameraPositionAutomatically &&
      this._lastAutomaticCameraPositionSwitch + 7000 < Date.now()
    ) {
      this._lastAutomaticCameraPositionSwitch = Date.now();
      this._cameraTarget = undefined;
      this._currentCameraPositionId++;

      if (this._currentCameraPositionId > 4) {
        this._currentCameraPositionId = 1;
      }
    }
  }

  private _updateCameraPosition(): void {
    switch (this._currentCameraPositionId) {
      case 1:
        this._camera.position.x = this._map.getWidth() / 2;
        this._camera.position.y = 35;
        this._camera.position.z = this._map.getHeight() / 2 + 40;
        this._camera.rotation.x = math.radians(-55);
        this._camera.rotation.y = 0;
        this._camera.rotation.z = 0;
        break;
      case 2:
        this._followCarFromTop();
        break;
      case 3:
        this._followCrossRoads();
        break;
      case 4:
        this._followCarThirdPersonView();
        break;
      default:
        this._currentCameraPositionId = 1;
        break;
    }
  }

  private _followCarFromTop(): void {
    if (!this._cameraTarget) {
      this._setNewVehicleTargetForCamera();
    }

    if (this._cameraTarget) {
      this._camera.position.x = this._cameraTarget.getPosition().x;
      this._camera.position.y = 10;
      this._camera.position.z = this._cameraTarget.getPosition().z + 8;
      this._camera.rotation.x = (-55 * Math.PI) / 180;
      this._camera.rotation.y = 0;
      this._camera.rotation.z = 0;
    } else {
      this._currentCameraPositionId++;
    }
  }

  private _followCrossRoads(): void {
    if (!this._cameraTarget) {
      this._setNewCrossRoadsTargetForCamera();
    }

    if (this._cameraTarget) {
      this._camera.position.x = this._cameraTarget.getPosition().x + 10;
      this._camera.position.y = 3;
      this._camera.position.z = this._cameraTarget.getPosition().z - 5;

      this._camera.rotation.x = math.radians(20);
      this._camera.rotation.y = math.radians(120);
      this._camera.rotation.z = math.radians(-17);
    } else {
      this._currentCameraPositionId++;
    }
  }

  private _followCarThirdPersonView(): void {
    if (!this._cameraTarget) {
      this._setNewVehicleTargetForCamera();
    }

    if (this._cameraTarget) {
      this._camera.position.x = this._cameraTarget.getPosition().x + 5;
      this._camera.position.y = 3;
      this._camera.position.z = this._cameraTarget.getPosition().z - 3;

      this._camera.rotation.x = math.radians(20);
      this._camera.rotation.y = math.radians(120);
      this._camera.rotation.z = math.radians(-17);
    } else {
      this._currentCameraPositionId = 1;
    }
  }

  private _setNewCrossRoadsTargetForCamera(): boolean {
    const roads = this._roadController.getRoads();
    const crossRoads = roads.filter((road) => {
      return road.getRoadType() === RoadType.CROSSROADS;
    });

    if (crossRoads.length > 0) {
      this._cameraTarget = crossRoads[math.randomValue(0, crossRoads.length - 1)];
    }

    return this._cameraTarget !== undefined;
  }

  private _setNewVehicleTargetForCamera(): boolean {
    const cars = this._vehicleController.getVehicles();

    if (cars.length > 0) {
      this._cameraTarget = cars[math.randomValue(0, cars.length - 1)];
    }

    return this._cameraTarget !== undefined;
  }

  private _updateHUD(): void {
    if (!this._isHudEnabled) {
      this._isHudEnabled = true;
      const hudEl = document.querySelector(".hud");
      if (hudEl) {
        hudEl.classList.remove("hidden");
      }
    }

    if (this._editMode) {
      if (this._domNodes["button-edit-mode"]) {
        this._domNodes["button-edit-mode"].textContent = "Edit Mode ON";
      }
      if (this._domNodes.info) {
        this._domNodes.info.style.display = "none";
      }
      if (this._domNodes["edit-mode-actions"]) {
        this._domNodes["edit-mode-actions"].style.display = "block";
      }
    } else {
      if (this._domNodes["button-edit-mode"]) {
        this._domNodes["button-edit-mode"].textContent = "Edit Mode OFF";
      }
      if (this._domNodes.info) {
        this._domNodes.info.style.display = "block";
      }
      if (this._domNodes["edit-mode-actions"]) {
        this._domNodes["edit-mode-actions"].style.display = "none";
      }
    }

    if (this._switchCameraPositionAutomatically) {
      if (this._domNodes["automatic-camera"]) {
        this._domNodes["automatic-camera"].textContent = "(ON)";
      }
    } else {
      if (this._domNodes["automatic-camera"]) {
        this._domNodes["automatic-camera"].textContent = "(OFF)";
      }
    }
  }

  public update(deltaTime: number): void {
    this._vehicleController.update(deltaTime);
    this._readInput();
    this._adjustCameraPosition();
    this._roadController.update();
    this._updateHUD();
  }

  public getCamera(): THREE.PerspectiveCamera {
    return this._camera;
  }

  public getThreeJSScene(): THREE.Scene {
    return this._scene;
  }

  public getGameplayScene(): GameplayScene {
    return this._gameplayScene;
  }

  public getMap(): GameMap {
    return this._map;
  }

  public getRoadController(): RoadController {
    return this._roadController;
  }

  public getVehicleController(): VehicleController {
    return this._vehicleController;
  }

  public isEditModeOn(): boolean {
    return this._editMode;
  }

  public getMouseWorldCoordinates(): THREE.Vector3 | undefined {
    return this._mouseWorldCoordinates;
  }

  public isMouseOnMap(): boolean {
    return this._isMouseOnMap();
  }
}

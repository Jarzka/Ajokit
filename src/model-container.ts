import * as THREE from "three";
import { log, LogType } from "./utils/logger";
import { GeneralException } from "./exceptions";
import type { SimulationApp } from "./simulation-app";

export class ModelContainer {
  private readonly _application: SimulationApp;
  private readonly _models: Record<string, THREE.Mesh> = {};
  private readonly _loader: any;
  private _modelsLoadedSum = 0;
  private readonly _allModelsSum = 19;

  constructor(application: SimulationApp) {
    this._application = application;
    this._loader = new (THREE as any).JSONLoader();
  }

  public loadModelsAsynchronously(): void {
    const textureContainer = this._application.getTextureContainer();

    this._loader.load("models/road_vertical.json", (geometry: any) => {
      const texture = textureContainer.getTextureByName("road");
      const material = new THREE.MeshLambertMaterial({ map: texture });
      this._models["road_vertical"] = new THREE.Mesh(geometry, material);
      this._modelsLoadedSum++;
    });

    this._loader.load("models/road_horizontal.json", (geometry: any) => {
      const texture = textureContainer.getTextureByName("road");
      const material = new THREE.MeshLambertMaterial({ map: texture });
      this._models["road_horizontal"] = new THREE.Mesh(geometry, material);
      this._modelsLoadedSum++;
    });

    this._loader.load("models/road_down_left.json", (geometry: any) => {
      const texture = textureContainer.getTextureByName("road");
      const material = new THREE.MeshLambertMaterial({ map: texture });
      this._models["road_down_left"] = new THREE.Mesh(geometry, material);
      this._modelsLoadedSum++;
    });

    this._loader.load("models/road_down_right.json", (geometry: any) => {
      const texture = textureContainer.getTextureByName("road");
      const material = new THREE.MeshLambertMaterial({ map: texture });
      this._models["road_down_right"] = new THREE.Mesh(geometry, material);
      this._modelsLoadedSum++;
    });

    this._loader.load("models/road_up_left.json", (geometry: any) => {
      const texture = textureContainer.getTextureByName("road");
      const material = new THREE.MeshLambertMaterial({ map: texture });
      this._models["road_up_left"] = new THREE.Mesh(geometry, material);
      this._modelsLoadedSum++;
    });

    this._loader.load("models/road_up_right.json", (geometry: any) => {
      const texture = textureContainer.getTextureByName("road");
      const material = new THREE.MeshLambertMaterial({ map: texture });
      this._models["road_up_right"] = new THREE.Mesh(geometry, material);
      this._modelsLoadedSum++;
    });

    this._loader.load("models/road_crossroads.json", (geometry: any) => {
      const texture = textureContainer.getTextureByName("road");
      const material = new THREE.MeshLambertMaterial({ map: texture });
      this._models["road_crossroads"] = new THREE.Mesh(geometry, material);
      this._modelsLoadedSum++;
    });

    this._loader.load("models/road_up_left_down.json", (geometry: any) => {
      const texture = textureContainer.getTextureByName("road");
      const material = new THREE.MeshLambertMaterial({ map: texture });
      this._models["road_up_left_down"] = new THREE.Mesh(geometry, material);
      this._modelsLoadedSum++;
    });

    this._loader.load("models/road_up_left_right.json", (geometry: any) => {
      const texture = textureContainer.getTextureByName("road");
      const material = new THREE.MeshLambertMaterial({ map: texture });
      this._models["road_up_left_right"] = new THREE.Mesh(geometry, material);
      this._modelsLoadedSum++;
    });

    this._loader.load("models/road_up_right_down.json", (geometry: any) => {
      const texture = textureContainer.getTextureByName("road");
      const material = new THREE.MeshLambertMaterial({ map: texture });
      this._models["road_up_right_down"] = new THREE.Mesh(geometry, material);
      this._modelsLoadedSum++;
    });

    this._loader.load("models/road_down_left_right.json", (geometry: any) => {
      const texture = textureContainer.getTextureByName("road");
      const material = new THREE.MeshLambertMaterial({ map: texture });
      this._models["road_down_left_right"] = new THREE.Mesh(geometry, material);
      this._modelsLoadedSum++;
    });

    this._loader.load("models/road_right_end.json", (geometry: any) => {
      const texture = textureContainer.getTextureByName("road");
      const material = new THREE.MeshLambertMaterial({ map: texture });
      this._models["road_right_end"] = new THREE.Mesh(geometry, material);
      this._modelsLoadedSum++;
    });

    this._loader.load("models/road_left_end.json", (geometry: any) => {
      const texture = textureContainer.getTextureByName("road");
      const material = new THREE.MeshLambertMaterial({ map: texture });
      this._models["road_left_end"] = new THREE.Mesh(geometry, material);
      this._modelsLoadedSum++;
    });

    this._loader.load("models/road_down_end.json", (geometry: any) => {
      const texture = textureContainer.getTextureByName("road");
      const material = new THREE.MeshLambertMaterial({ map: texture });
      this._models["road_down_end"] = new THREE.Mesh(geometry, material);
      this._modelsLoadedSum++;
    });

    this._loader.load("models/road_up_end.json", (geometry: any) => {
      const texture = textureContainer.getTextureByName("road");
      const material = new THREE.MeshLambertMaterial({ map: texture });
      this._models["road_up_end"] = new THREE.Mesh(geometry, material);
      this._modelsLoadedSum++;
    });

    this._loader.load("models/traffic_light.json", (geometry: any) => {
      const texture = textureContainer.getTextureByName("metal");
      const material = new THREE.MeshLambertMaterial({ map: texture });
      this._models["traffic_light"] = new THREE.Mesh(geometry, material);
      this._modelsLoadedSum++;
    });

    this._loader.load("models/car.json", (geometry: any) => {
      const texture = textureContainer.getTextureByName("car");
      const material = new THREE.MeshLambertMaterial({ map: texture });
      this._models["car"] = new THREE.Mesh(geometry, material);
      this._modelsLoadedSum++;
    });

    this._loader.load("models/car.json", (geometry: any) => {
      const texture = textureContainer.getTextureByName("car_slow");
      const material = new THREE.MeshLambertMaterial({ map: texture });
      this._models["car_slow"] = new THREE.Mesh(geometry, material);
      this._modelsLoadedSum++;
    });

    this._loader.load("models/car.json", (geometry: any) => {
      const texture = textureContainer.getTextureByName("car_fast");
      const material = new THREE.MeshLambertMaterial({ map: texture });
      this._models["car_fast"] = new THREE.Mesh(geometry, material);
      this._modelsLoadedSum++;
    });
  }

  public allModelsLoaded(): boolean {
    return this._modelsLoadedSum >= this._allModelsSum;
  }

  public getModelByName(name: string): THREE.Mesh {
    if (Object.hasOwn(this._models, name)) {
      return this._models[name];
    }

    const errorMessage = `Model ${name} not found!`;
    log(LogType.ERROR, errorMessage);
    throw new GeneralException(errorMessage);
  }
}

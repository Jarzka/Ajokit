import { GameplayScene } from "./gameplay-scene";
import type { SimulationApp } from "../simulation-app";
import type { Scene } from "../types";

export class LoadingGameScene implements Scene {
  private readonly _application: SimulationApp;
  private readonly _textureContainer: any;
  private readonly _modelContainer: any;
  private _startedLoadingTextures = false;
  private _startedLoadingModels = false;

  constructor(application: SimulationApp) {
    this._application = application;
    this._textureContainer = application.getTextureContainer();
    this._modelContainer = application.getModelContainer();
  }

  public update(): void {
    this._startLoadingTextures();
    this._startLoadingModels();
    this._checkLoadingState();
    this._render();
  }

  private _startLoadingTextures(): void {
    if (!this._startedLoadingTextures) {
      this._textureContainer.loadTexturesAsynchronously();
      this._startedLoadingTextures = true;
    }
  }

  private _startLoadingModels(): void {
    if (this._textureContainer.allTexturesLoaded() && !this._startedLoadingModels) {
      this._modelContainer.loadModelsAsynchronously();
      this._startedLoadingModels = true;
    }
  }

  private _checkLoadingState(): void {
    if (this._textureContainer.allTexturesLoaded() && this._modelContainer.allModelsLoaded()) {
      const loadingDescEl = document.querySelector(".loadingDescription");
      if (loadingDescEl) {
        loadingDescEl.textContent = "Loading world...";
      }
      this._application.changeScene(new GameplayScene(this._application));
    }
  }

  private _render(): void {
    if (!this._textureContainer.allTexturesLoaded()) {
      const loadingDescEl = document.querySelector(".loadingDescription");
      if (loadingDescEl) {
        loadingDescEl.textContent = "Loading textures & models...";
      }
    }
  }

  public getApplication(): SimulationApp {
    return this._application;
  }
}

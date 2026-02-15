import * as THREE from "three";
import { WorldController } from "../game/world-controller";
import { WorldRenderer } from "../game/world-renderer";
import type { SimulationApp } from "../simulation-app";
import type { Scene } from "../types";

export class GameplayScene implements Scene {
  private readonly _application: SimulationApp;
  private _clock!: THREE.Clock;

  private _worldController!: WorldController;
  private _worldRenderer!: WorldRenderer;

  private _fpsCounterTimestamp = 0;
  private _frameCounter = 0;
  private _deltaTime = 0;

  constructor(application: SimulationApp) {
    this._application = application;
    this._initialize();
  }

  private _initialize(): void {
    this._clock = new THREE.Clock();
    this._worldController = new WorldController(this as any);
    this._worldRenderer = new WorldRenderer(this._worldController);

    const loadingEl = (document.querySelector(".loading") ?? undefined) as HTMLElement | undefined;
    if (loadingEl) {
      loadingEl.style.display = "none";
    }

  }

  public update(): void {
    this._worldController.update(this._deltaTime);
    this._worldRenderer.render();

    this._deltaTime = Math.min(this._clock.getDelta(), 0.05);
    this._handleFps();
  }

  private _handleFps(): void {
    this._frameCounter++;

    if (Date.now() >= this._fpsCounterTimestamp + 1000) {
      const fpsEl = document.querySelector(".fps");
      if (fpsEl) {
        fpsEl.textContent = `${this._frameCounter}fps`;
      }
      this._frameCounter = 0;
      this._fpsCounterTimestamp = Date.now();
    }
  }

  public getApplication(): SimulationApp {
    return this._application;
  }
}

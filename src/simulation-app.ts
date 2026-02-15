import { TextureContainer } from "./texture-container";
import { ModelContainer } from "./model-container";
import { LoadingGameScene } from "./scenes/loading-game-scene";
import type { Scene } from "./types";

export class SimulationApp {
  private readonly _textureContainer: TextureContainer;
  private readonly _modelContainer: ModelContainer;
  private _activeScene!: Scene;

  constructor() {
    this._textureContainer = new TextureContainer();
    this._modelContainer = new ModelContainer(this);
    this._initialize();
    this._run();
  }

  private _initialize(): void {
    this._activeScene = new LoadingGameScene(this);

    // Disable right click in canvas
    document.body.addEventListener("contextmenu", (e: Event) => {
      if ((e.target as HTMLElement)?.tagName === "CANVAS") {
        e.preventDefault();
      }
    });

    this._addUIListeners();
  }

  private _addUIListeners(): void {
    document.querySelector(".dialog-box-close")?.addEventListener("click", () => {
      const dialogBox = (document.querySelector(".dialog-box") ?? undefined) as HTMLElement | undefined;
      if (dialogBox) {
        dialogBox.style.display = "none";
      }
    });

    document.querySelector(".button-credits")?.addEventListener("click", () => {
      const dialogBoxCredits = (document.querySelector(".dialog-box-credits") ?? undefined) as HTMLElement | undefined;
      if (dialogBoxCredits) {
        dialogBoxCredits.style.display = "block";
      }
    });
  }

  private _run(): void {
    window.requestAnimationFrame(() => this._executeGameFrame());
  }

  private _executeGameFrame(): void {
    this._activeScene.update();
    window.requestAnimationFrame(() => this._executeGameFrame());
  }

  public changeScene(scene: Scene): void {
    this._activeScene = scene;
  }

  public getTextureContainer(): TextureContainer {
    return this._textureContainer;
  }

  public getModelContainer(): ModelContainer {
    return this._modelContainer;
  }
}

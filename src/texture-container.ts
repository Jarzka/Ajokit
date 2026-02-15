import * as THREE from "three";
import { log, LogType } from "./utils/logger";
import { GeneralException } from "./exceptions";

export class TextureContainer {
  private readonly _textures: Record<string, any> = {};
  private _texturesLoadedSum = 0;
  private readonly _allTexturesSum = 12;

  public loadTexturesAsynchronously(): void {
    (THREE as any).ImageUtils.loadTexture("img/grass.jpg", undefined, (texture: any) => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(25, 25);
      this._textures["grass"] = texture;
      this._texturesLoadedSum++;
    });

    (THREE as any).ImageUtils.loadTexture("img/road.jpg", undefined, (texture: any) => {
      this._textures["road"] = texture;
      this._texturesLoadedSum++;
    });

    (THREE as any).ImageUtils.loadTexture("img/metal.jpg", undefined, (texture: any) => {
      this._textures["metal"] = texture;
      this._texturesLoadedSum++;
    });

    (THREE as any).ImageUtils.loadTexture("img/car.jpg", undefined, (texture: any) => {
      this._textures["car"] = texture;
      this._texturesLoadedSum++;
    });

    (THREE as any).ImageUtils.loadTexture("img/car_slow.jpg", undefined, (texture: any) => {
      this._textures["car_slow"] = texture;
      this._texturesLoadedSum++;
    });

    (THREE as any).ImageUtils.loadTexture("img/car_fast.jpg", undefined, (texture: any) => {
      this._textures["car_fast"] = texture;
      this._texturesLoadedSum++;
    });

    this._textures["skybox"] = [
      new THREE.MeshBasicMaterial({
        map: (THREE as any).ImageUtils.loadTexture("img/sky_right.jpg", undefined, () => {
          this._texturesLoadedSum++;
        }),
        side: THREE.BackSide,
      }),
      new THREE.MeshBasicMaterial({
        map: (THREE as any).ImageUtils.loadTexture("img/sky_left.jpg", undefined, () => {
          this._texturesLoadedSum++;
        }),
        side: THREE.BackSide,
      }),
      new THREE.MeshBasicMaterial({
        map: (THREE as any).ImageUtils.loadTexture("img/sky_top.jpg", undefined, () => {
          this._texturesLoadedSum++;
        }),
        side: THREE.BackSide,
      }),
      new THREE.MeshBasicMaterial({
        map: (THREE as any).ImageUtils.loadTexture("img/sky_base.jpg", undefined, () => {
          this._texturesLoadedSum++;
        }),
        side: THREE.BackSide,
      }),
      new THREE.MeshBasicMaterial({
        map: (THREE as any).ImageUtils.loadTexture("img/sky_front.jpg", undefined, () => {
          this._texturesLoadedSum++;
        }),
        side: THREE.BackSide,
      }),
      new THREE.MeshBasicMaterial({
        map: (THREE as any).ImageUtils.loadTexture("img/sky_back.jpg", undefined, () => {
          this._texturesLoadedSum++;
        }),
        side: THREE.BackSide,
      }),
    ];
  }

  public allTexturesLoaded(): boolean {
    return this._texturesLoadedSum >= this._allTexturesSum;
  }

  public getTextureByName(name: string): any {
    if (Object.hasOwn(this._textures, name)) {
      return this._textures[name];
    }

    const errorMessage = `Texture ${name} not found!`;
    log(LogType.ERROR, errorMessage);
    throw new GeneralException(errorMessage);
  }
}

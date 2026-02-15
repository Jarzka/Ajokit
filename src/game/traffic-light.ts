import { GameplayObject } from "./gameplay-object";
import { TrafficLightBall } from "./traffic-light-ball";
import { Vector3 } from "../utils/vector3";
import * as math from "../utils/math";
import { TrafficLightPosition, CurrentLightState, LightStateMs } from "./traffic-light.types";
import type { RoadRoute } from "./road-route";
import type { TrafficLightsController } from "./traffic-lights-controller";

export class TrafficLight extends GameplayObject {
  private readonly _trafficLightController: TrafficLightsController;
  private _lastStateChangeTimestamp: number = 0;
  private _nextTrafficLight: TrafficLight | undefined;
  private _isActive: boolean = false;
  private readonly _routeDirection: TrafficLightPosition;
  private _currentLightState: CurrentLightState = CurrentLightState.RED;
  private readonly _lightGreen: TrafficLightBall;
  private readonly _lightYellow: TrafficLightBall;
  private readonly _lightRed: TrafficLightBall;

  constructor(
    trafficLightController: TrafficLightsController,
    nextTrafficLight: TrafficLight | undefined,
    routeDirection: TrafficLightPosition,
    position: Vector3
  ) {
    const worldController = trafficLightController.getRoad().getWorldController();
    const model = worldController
      .getGameplayScene()
      .getApplication()
      .getModelContainer()
      .getModelByName("traffic_light")
      .clone();
    super(worldController, model);

    this._trafficLightController = trafficLightController;
    this._nextTrafficLight = nextTrafficLight;
    this._routeDirection = routeDirection;

    this.setPosition(position);
    switch (this._routeDirection) {
      case TrafficLightPosition.TOP:
        this.setAngle(math.radians(90));
        break;
      case TrafficLightPosition.RIGHT:
        this.setAngle(math.radians(0));
        break;
      case TrafficLightPosition.BOTTOM:
        this.setAngle(math.radians(270));
        break;
      case TrafficLightPosition.LEFT:
        this.setAngle(math.radians(180));
        break;
    }

    const lightGreenPosition = new Vector3(
      this._position.x + Math.cos(this._angle) * 0.2,
      this._position.y + 2.9,
      this._position.z - Math.sin(this._angle) * 0.2
    );
    const lightYellowPosition = new Vector3(
      this._position.x + Math.cos(this._angle) * 0.2,
      this._position.y + 3.4,
      this._position.z - Math.sin(this._angle) * 0.2
    );
    const lightRedPosition = new Vector3(
      this._position.x + Math.cos(this._angle) * 0.2,
      this._position.y + 3.9,
      this._position.z - Math.sin(this._angle) * 0.2
    );
    this._lightGreen = new TrafficLightBall(this, 0x006000, this._worldController, lightGreenPosition);
    this._lightYellow = new TrafficLightBall(this, 0x606000, this._worldController, lightYellowPosition);
    this._lightRed = new TrafficLightBall(this, 0x600000, this._worldController, lightRedPosition);
  }

  public update(): void {
    if (this._isActive) {
      this._updateState();
    }
    this._updateLightBallsState();
    this._handleRouteState();
  }

  private _updateState(): void {
    if (this._currentLightState === CurrentLightState.RED) {
      this._currentLightState = CurrentLightState.RED_YELLOW;
      this._lastStateChangeTimestamp = Date.now();
    } else if (
      this._currentLightState === CurrentLightState.RED_YELLOW &&
      this._lastStateChangeTimestamp + LightStateMs.RED_YELLOW < Date.now()
    ) {
      this._currentLightState = CurrentLightState.GREEN;
      this._lastStateChangeTimestamp = Date.now();
    } else if (
      this._currentLightState === CurrentLightState.GREEN &&
      this._lastStateChangeTimestamp + LightStateMs.GREEN < Date.now()
    ) {
      this._currentLightState = CurrentLightState.YELLOW;
      this._lastStateChangeTimestamp = Date.now();
    } else if (
      this._currentLightState === CurrentLightState.YELLOW &&
      this._lastStateChangeTimestamp + LightStateMs.YELLOW < Date.now()
    ) {
      this._currentLightState = CurrentLightState.RED;
      this._lastStateChangeTimestamp = Date.now();
      this._isActive = false;
      if (this._nextTrafficLight) {
        this._nextTrafficLight.setActive(true);
      }
    }
  }

  private _updateLightBallsState(): void {
    if (this._currentLightState === CurrentLightState.RED) {
      this._lightRed.changeColor(0xff0000);
      this._lightGreen.changeColor(0x006000);
      this._lightYellow.changeColor(0x606000);
    } else if (this._currentLightState === CurrentLightState.RED_YELLOW) {
      this._lightRed.changeColor(0xff0000);
      this._lightGreen.changeColor(0x006000);
      this._lightYellow.changeColor(0xffff00);
    } else if (this._currentLightState === CurrentLightState.GREEN) {
      this._lightRed.changeColor(0x600000);
      this._lightGreen.changeColor(0x00ff00);
      this._lightYellow.changeColor(0x606000);
    } else if (this._currentLightState === CurrentLightState.YELLOW) {
      this._lightRed.changeColor(0x600000);
      this._lightGreen.changeColor(0x006000);
      this._lightYellow.changeColor(0xffff00);
    }
  }

  private _handleRouteState(): void {
    if (this._currentLightState === CurrentLightState.GREEN) {
      this._changeRouteFreeStateById(this._getRouteIdsByCurrentDirection(), true);
    } else {
      this._changeRouteFreeStateById(this._getRouteIdsByCurrentDirection(), false);
    }
  }

  private _getRouteIdsByCurrentDirection(): string[] {
    switch (this._routeDirection) {
      case TrafficLightPosition.TOP:
        return ["from-top-to-bottom", "from-top-to-right", "from-top-to-left"];
      case TrafficLightPosition.RIGHT:
        return ["from-right-to-left", "from-right-to-top", "from-right-to-bottom"];
      case TrafficLightPosition.BOTTOM:
        return ["from-bottom-to-top", "from-bottom-to-right", "from-bottom-to-left"];
      case TrafficLightPosition.LEFT:
        return ["from-left-to-right", "from-left-to-top", "from-left-to-bottom"];
      default:
        return [];
    }
  }

  private _changeRouteFreeStateById(routeIds: string[], newState: boolean): void {
    const foundRoutes = this._trafficLightController
      .getRoad()
      .getRoutes()
      .filter((route: RoadRoute) => {
        return routeIds.some((routeId) => routeId === route.getRouteId());
      });

    for (const route of foundRoutes) {
      route.setFree(newState);
    }
  }

  public setNextTrafficLight(nextTrafficLight: TrafficLight): void {
    this._nextTrafficLight = nextTrafficLight;
  }

  public setActive(value: boolean): void {
    this._isActive = value;
  }

  public override die(): void {
    super.die();
    this._lightGreen.die();
    this._lightRed.die();
    this._lightYellow.die();
  }
}

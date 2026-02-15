export enum TrafficLightPosition {
  TOP = 0,
  RIGHT = 1,
  BOTTOM = 2,
  LEFT = 3,
}

export enum CurrentLightState {
  RED = 0,
  YELLOW = 1,
  GREEN = 2,
  RED_YELLOW = 3,
}

export const LightStateMs = {
  YELLOW: 3000,
  GREEN: 5000,
  RED_YELLOW: 1000,
} as const;

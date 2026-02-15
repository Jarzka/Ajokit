export interface CollisionMaskPoint {
  x: number;
  y: number;
  z: number;
}

export interface Scene {
  update(): void;
}

export interface NodePosition {
  x: number;
  y: number;
  z: number;
}

export interface NodeConnection {
  id?: string;
  start: number;
  end: number;
  controlPoints?: NodePosition[];
}

export interface DomNodes {
  buttonEditMode: HTMLElement;
  info: HTMLElement;
  editModeActions: HTMLElement;
  automaticCamera: HTMLElement;
}

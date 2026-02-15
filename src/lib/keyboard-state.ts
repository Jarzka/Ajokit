/**
 * KeyboardState - keep the current state of the keyboard.
 * It is possible to query it at any time. No need of an event.
 * This is particularly convenient in loop driven case, like in
 * 3D demos or games.
 *
 * Originally THREEx.KeyboardState.js - converted to TypeScript module.
 */
const MODIFIERS = ["shift", "ctrl", "alt", "meta"];

const ALIAS: Record<string, string> = {
  left: "ArrowLeft",
  up: "ArrowUp",
  right: "ArrowRight",
  down: "ArrowDown",
  space: "Space",
  pageup: "PageUp",
  pagedown: "PageDown",
  tab: "Tab",
};

export class KeyboardState {
  public readonly keyCodes: Record<string, boolean> = {};
  public readonly modifiers: Record<string, boolean> = {};

  private readonly _onKeyDown: (event: KeyboardEvent) => void;
  private readonly _onKeyUp: (event: KeyboardEvent) => void;

  constructor() {
    this._onKeyDown = (event: KeyboardEvent) => {
      this._onKeyChange(event, true);
    };
    this._onKeyUp = (event: KeyboardEvent) => {
      this._onKeyChange(event, false);
    };

    document.addEventListener("keydown", this._onKeyDown, false);
    document.addEventListener("keyup", this._onKeyUp, false);
  }

  public destroy(): void {
    document.removeEventListener("keydown", this._onKeyDown, false);
    document.removeEventListener("keyup", this._onKeyUp, false);
  }

  private _onKeyChange(event: KeyboardEvent, pressed: boolean): void {
    this.keyCodes[event.code] = pressed;

    this.modifiers["shift"] = event.shiftKey;
    this.modifiers["ctrl"] = event.ctrlKey;
    this.modifiers["alt"] = event.altKey;
    this.modifiers["meta"] = event.metaKey;
  }

  /** Converts a human-friendly key description to an event.code string. */
  private _keyToCode(key: string): string {
    if (key in ALIAS) {
      return ALIAS[key];
    }
    if (/^\d$/.test(key)) {
      return `Digit${key}`;
    }
    if (/^[a-zA-Z]$/.test(key)) {
      return `Key${key.toUpperCase()}`;
    }
    return key;
  }

  /**
   * Query keyboard state to know if a key is pressed or not.
   * @param keyDesc the description of the key. format: modifiers+key e.g shift+A
   * @returns true if the key is pressed, false otherwise
   */
  public pressed(keyDesc: string): boolean {
    const keys = keyDesc.split("+");
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      let pressed: boolean | undefined;
      if (MODIFIERS.includes(key)) {
        pressed = this.modifiers[key];
      } else {
        pressed = this.keyCodes[this._keyToCode(key)];
      }
      if (!pressed) return false;
    }
    return true;
  }
}

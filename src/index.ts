export * from "./type";
import { Config, initConfig, Event, Cb, State } from "./type";

export class GamePad {
  fps: number;
  fpsInterval: number;
  preState: State[];
  curState: State[];
  preTime: number;
  cbMap = new Map<Event, Set<Cb>>();
  constructor(config?: Config) {
    const c = { ...initConfig, ...config };
    this.fps = c.fps;
    this.preState = [];
    this.curState = [];
    this.preTime = performance.now();
    this.fpsInterval = 1000 / this.fps;
    this.run();
  }
  private getState(g: Gamepad): State {
    const s: State = {
      index: g.index,
      buttons: Array(g.buttons.length).fill(Event.None),
      axes: Array.from(g.axes),
    };
    const preState: State = this.preState.find((i) => i.index === g.index) || {
      index: g.index,
      buttons: Array(g.buttons.length).fill(-1),
      axes: Array.from([1]),
    };
    const buttons = g.buttons;
    // console.log("curState", preState.button, g.buttons);
    for (let i = 0; i < buttons.length; i++) {
      if (
        (preState.buttons[i].state === Event.Press ||
          preState.buttons[i].state === Event.Down) &&
        buttons[i].pressed
      ) {
        s.buttons[i] = {
          state: Event.Press,
          value: buttons[i].value,
        };
      } else if (
        (preState.buttons[i].state === Event.Press ||
          preState.buttons[i].state === Event.Down) &&
        !buttons[i].pressed
      ) {
        s.buttons[i] = {
          state: Event.Up,
          value: buttons[i].value,
        };
      } else if (
        preState.buttons[i].state === Event.None &&
        buttons[i].pressed
      ) {
        s.buttons[i] = {
          state: Event.Down,
          value: buttons[i].value,
        };
      } else {
        s.buttons[i] = {
          state: Event.None,
          value: 0,
        };
      }
    }
    return s;
  }
  private run() {
    requestAnimationFrame(() => this.run());
    const now = performance.now();
    if (now - this.preTime <= this.fpsInterval) {
      return;
    }
    this.preTime = now;
    const gamepads = Array.from(navigator.getGamepads?.() ?? []).filter(
      (i): i is Gamepad => i !== null
    );
    const state = gamepads.map((i) => this.getState(i));
    this.preState = state;
    for (const e of [
      Event.Down,
      Event.Up,
      Event.Press,
      Event.Axes,
      Event.All,
    ]) {
      const s = this.cbMap.get(e);
      if (
        e === Event.Down &&
        s &&
        state.some((i) => i.buttons.find((i) => i.state === Event.Down))
      ) {
        s.forEach((f) => f(state));
      } else if (
        e === Event.Up &&
        s &&
        state.some((i) => i.buttons.find((i) => i.state === Event.Up))
      ) {
        s.forEach((f) => f(state));
      } else if (
        e === Event.Press &&
        s &&
        state.some((i) => i.buttons.find((i) => i.state === Event.Press))
      ) {
        s.forEach((f) => f(state));
      } else if (e === Event.Axes && s) {
        s.forEach((f) => f(state));
      } else if (e === Event.All && s) {
        s.forEach((f) => f(state));
      }
    }
  }

  on<T extends Event>(e: T, cb: Cb) {
    const s = this.cbMap.get(e);
    if (s) {
      s.add(cb);
    } else {
      this.cbMap.set(e, new Set([cb]));
    }
  }
  off<T extends Event>(e: T, cb: Cb) {
    const s = this.cbMap.get(e);
    if (s) {
      s.delete(cb);
    }
  }
  onAll(cb: Cb) {
    const s = this.cbMap.get(Event.All);
    if (s) {
      s.add(cb);
    } else {
      this.cbMap.set(Event.All, new Set([cb]));
    }
  }
}

// export const init = (c?: Config) => {
//   return new GamePad(c);
// };

// export const sum = (a: number, b: number) => {
//   if ('development' === process.env.NODE_ENV) {
//     console.log('boop');
//   }
//   return a + b;
// };

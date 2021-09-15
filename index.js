import { GamePad, Event } from "./dist/e-gamepad.esm.js";
import { createApp } from "https://unpkg.com/petite-vue?module";
const fps = 60;
const pad = new GamePad({ fps });
createApp({
  state: [],
  classMap: {
    [Event.Down]: "down",
    [Event.Up]: "up",
    [Event.None]: "none",
    [Event.Press]: "press",
  },
  increment() {
    this.count++;
  },
  mounted() {
    pad.onAll((data) => {
      for (const p of data) {
        for (const b of p.buttons) {
          b.style = {
            width: `${b.value * 100}%`,
          };
        }
      }
      for (let i = 0; i < data.length; i++) {
        this.state[i] = data[i];
      }
    });
  },
}).mount();

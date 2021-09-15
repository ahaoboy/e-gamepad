## Demo
### -demo1  [`demo1`](https://e-gamepad.vercel.app/move.html)
### -deme2  [`demo2`](https://e-gamepad.vercel.app/index.html)

## install
```
yarn add e-gamepad
```

## use
```
import { GamePad, Event } from "./dist/e-gamepad.esm.js";
const fps = 60;
const pad = new GamePad({ fps });
pad.on(Event.Down, (data) => {
    // ...
});


pad.onAll((data) => {
    // ...
});
```
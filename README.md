## Demo

### -[demo1](https://e-gamepad.vercel.app/move.html)
### -[demo2](https://e-gamepad.vercel.app/index.html)
### -[demo3](https://e-nes.vercel.app/)
### -[npm](https://www.npmjs.com/package/e-gamepad)

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

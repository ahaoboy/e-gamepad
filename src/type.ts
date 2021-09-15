export type Config = {
  fps?: number;
};
export const initConfig: Required<Config> = {
  fps: 60,
};
export enum Event {
  None,
  Up,
  Down,
  Press,
  Axes,
  All,
}
export type State = { index: number; buttons: number[]; axes: number[] };
export type Cb = (data: State[]) => void;

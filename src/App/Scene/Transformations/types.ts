import { vec3 } from "gl-matrix";

export const enum Axis {
  X,
  Y,
}

export const RECT = [
  vec3.fromValues(0, 0, 1),
  vec3.fromValues(1, 0, 1),
  vec3.fromValues(1, 1, 1),
  vec3.fromValues(0, 1, 1),
];

export const enum Transform {
  "SCALE_X_RIGHT" = "SCALE_X_RIGHT",
  "SCALE_Y_DOWN" = "SCALE_Y_DOWN",
  "SCALE_X_LEFT" = "SCALE_X_LEFT",
  "SCALE_Y_UP" = "SCALE_Y_UP",
}

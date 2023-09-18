import { vec3 } from "gl-matrix";

export const enum Axis {
  X,
  Y,
}

export const enum GrowDirection {
  P = 1,
  N = -1,
}

export const RECT = [
  vec3.fromValues(0, 0, 1),
  vec3.fromValues(1, 0, 1),
  vec3.fromValues(1, 1, 1),
  vec3.fromValues(0, 1, 1),
];

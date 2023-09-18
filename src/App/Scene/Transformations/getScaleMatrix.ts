import { mat3, vec2, vec3 } from "gl-matrix";
import { Axis, GrowDirection } from "./types";

interface Scale {
  axis: Axis;
  dir: GrowDirection;
}

const getScaleMatrix = (mpdelta: vec2, T: mat3, axes: Scale[]) => {
  const TI = mat3.invert(mat3.create(), T);
  const mpdelta_t = vec3.transformMat3(
    vec3.create(),
    vec3.fromValues(mpdelta[0], mpdelta[1], 0),
    TI
  );
  const scale = vec2.fromValues(1, 1);

  axes.forEach(({ axis, dir }) => (scale[axis] = 1 + dir * mpdelta_t[axis]));

  return mat3.fromScaling(mat3.create(), scale);
};

export { getScaleMatrix };

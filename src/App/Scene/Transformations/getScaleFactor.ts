import { mat3, vec2, vec3 } from "gl-matrix";
import { SceneNode } from "../Graph";
import { Axis } from "./types";

function extractRotationAngleFrom(matrix: mat3) {
  let theta = Math.atan2(matrix[1], matrix[0]);
  if (theta < 0) {
    theta += 2 * Math.PI;
  }
  return theta;
}

const getScaleFactor = (mpdelta: vec2, node: SceneNode) => {
  const T = node.transformations[0];
  const angle = extractRotationAngleFrom(T);
  vec2.rotate(mpdelta, mpdelta, vec2.fromValues(0, 0), -angle);
  mpdelta[Axis.X] =
    mpdelta[Axis.X] /
    vec3.length(
      vec3.subtract(vec3.create(), node.vertices[1], node.vertices[0])
    );
  mpdelta[Axis.Y] =
    mpdelta[Axis.Y] /
    vec3.length(
      vec3.subtract(vec3.create(), node.vertices[0], node.vertices[3])
    );

  return mpdelta;
};

export { getScaleFactor };

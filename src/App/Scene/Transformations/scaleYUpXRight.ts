import { mat3, vec2, vec3 } from "gl-matrix";
import { SceneNode, cloneNode } from "../Graph";
import { Axis, GrowDirection, RECT } from "./types";
import { getScaleMatrix } from "./getScaleMatrix";

const scaleYUpXRight = (scene: SceneNode, name: string, mpdelta: vec2) => {
  const explore = (node: SceneNode) => {
    const nnode = cloneNode(node);

    if (node.name === name) {
      const T = nnode.transformations[0];
      const S = getScaleMatrix(mpdelta, T, [
        { axis: Axis.X, dir: GrowDirection.P },
        { axis: Axis.Y, dir: GrowDirection.P },
      ]);

      mat3.multiply(T, T, S);

      nnode.transformations = [T];
      nnode.vertices = RECT.map((v) => vec3.transformMat3(vec3.create(), v, T));
      return nnode;
    }

    nnode.children = nnode.children.map(explore);
    return nnode;
  };

  return explore(scene);
};

export { scaleYUpXRight };

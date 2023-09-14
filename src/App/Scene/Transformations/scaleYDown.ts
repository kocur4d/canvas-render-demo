import { mat3, vec2, vec3 } from "gl-matrix";
import { SceneNode, cloneNode } from "../Graph";
import { Axis, RECT } from "./types";
import { getScaleFactor } from "./getScaleFactor";

const scaleYDown = (scene: SceneNode, name: string, mpdelta: vec2) => {
  const explore = (node: SceneNode) => {
    const nnode = cloneNode(node);

    if (node.name === name) {
      const scale = vec2.fromValues(1, 1);
      getScaleFactor(mpdelta, nnode);
      scale[Axis.Y] = 1 - mpdelta[Axis.Y];
      const T = nnode.transformations[0];
      const C = mat3.fromTranslation(mat3.create(), vec2.fromValues(0, -1));
      const CI = mat3.invert(mat3.create(), C);
      const S = mat3.create();
      mat3.fromScaling(S, scale);
      mat3.multiply(T, T, CI);
      mat3.multiply(T, T, S);
      mat3.multiply(T, T, C);

      nnode.transformations = [T];
      nnode.vertices = RECT.map((v) => vec3.transformMat3(vec3.create(), v, T));

      return nnode;
    }

    nnode.children = nnode.children.map(explore);

    return nnode;
  };

  return explore(scene);
};

export { scaleYDown };

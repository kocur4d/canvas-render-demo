import { mat3, vec2, vec3 } from "gl-matrix";
import { SceneNode, cloneNode } from "../Graph";
import { AxesToScale, RECT } from "./types";
import { getScaleMatrix } from "./getScaleMatrix";

const scale = (
  scene: SceneNode,
  name: string,
  mpdelta: vec2,
  axes: AxesToScale[],
  translate: vec2
) => {
  const explore = (node: SceneNode) => {
    const nnode = cloneNode(node);

    if (node.name === name) {
      const T = nnode.transformations[0];
      const SCALE = getScaleMatrix(mpdelta, T, axes);
      const TRANSLATE = mat3.fromTranslation(mat3.create(), translate);
      const TRANSLATE_I = mat3.invert(mat3.create(), TRANSLATE);

      mat3.multiply(T, T, TRANSLATE_I);
      mat3.multiply(T, T, SCALE);
      mat3.multiply(T, T, TRANSLATE);

      nnode.transformations = [T];
      nnode.vertices = RECT.map((v) => vec3.transformMat3(vec3.create(), v, T));
      return nnode;
    }

    nnode.children = nnode.children.map(explore);
    return nnode;
  };

  return explore(scene);
};

export { scale };

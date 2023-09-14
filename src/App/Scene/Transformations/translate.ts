import { mat3, vec2, vec3 } from "gl-matrix";
import { SceneNode, cloneNode } from "../Graph";
import { RECT } from "./types";

const translate = (scene: SceneNode, name: string, mpdelta: vec2) => {
  const explore = (node: SceneNode) => {
    const nnode = cloneNode(node);

    if (node.name === name) {
      const T = nnode.transformations[0];
      const TR = mat3.fromTranslation(mat3.create(), mpdelta);

      mat3.multiply(T, TR, T);

      nnode.transformations = [T];
      nnode.vertices = RECT.map((v) => vec3.transformMat3(vec3.create(), v, T));

      return nnode;
    }

    nnode.children = nnode.children.map(explore);

    return nnode;
  };

  return explore(scene);
};

export { translate };

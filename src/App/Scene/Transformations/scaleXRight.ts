import { mat3, vec2, vec3 } from "gl-matrix";
import { SceneNode, cloneNode } from "../Graph";
import { Axis, RECT } from "./types";

const scaleXRight = (scene: SceneNode, name: string, mpdelta: vec2) => {
  const explore = (node: SceneNode) => {
    const nnode = cloneNode(node);

    if (node.name === name) {
      const scale = vec2.fromValues(1, 1);
      scale[Axis.X] =
        1 +
        mpdelta[Axis.X] /
          vec3.length(
            vec3.subtract(vec3.create(), nnode.vertices[1], nnode.vertices[0])
          );
      const T = nnode.transformations[0];
      const S = mat3.create();
      mat3.fromScaling(S, scale);
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

export { scaleXRight };

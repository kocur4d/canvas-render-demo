import { mat3, vec2, vec3 } from "gl-matrix";
import { SceneNode, cloneNode } from "../Graph";
import { RECT } from "./types";

const SENSITIVITY = 0.001;

const centerTransform = (vertices: vec3[]) => {
  const mp1x = (vertices[0][0] + vertices[2][0]) / 2;
  const mp1y = (vertices[0][1] + vertices[2][1]) / 2;
  const mp2x = (vertices[1][0] + vertices[3][0]) / 2;
  const mp2y = (vertices[1][1] + vertices[3][1]) / 2;

  return vec2.fromValues((mp1x + mp2x) / 2, (mp1y + mp2y) / 2);
};

const rotate = (scene: SceneNode, name: string, delta: number) => {
  const explore = (node: SceneNode) => {
    const nnode = cloneNode(node);

    if (node.name === name) {
      const rotation = delta * SENSITIVITY;
      const center = centerTransform(node.vertices);
      const T = nnode.transformations[0];
      const C = mat3.fromTranslation(mat3.create(), center);
      const CI = mat3.invert(mat3.create(), C);
      const R = mat3.fromRotation(mat3.create(), rotation);

      mat3.multiply(C, C, R);
      mat3.multiply(C, C, CI);
      mat3.multiply(C, C, T);

      nnode.transformations = [C];
      nnode.vertices = RECT.map((v) => vec3.transformMat3(vec3.create(), v, C));

      return nnode;
    }

    nnode.children = nnode.children.map(explore);

    return nnode;
  };

  return explore(scene);
};

export { rotate };

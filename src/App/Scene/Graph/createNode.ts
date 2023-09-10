import { mat3, vec3 } from "gl-matrix";

export type SceneNode = {
  name: string;
  children: SceneNode[];
  transformations: mat3[];
  material: string;
  vertices: vec3[];
};

const createNode = ({ name }: Pick<SceneNode, "name">): SceneNode => {
  return {
    name,
    children: [],
    transformations: [],
    vertices: [],
    material: "black",
  };
};

export { createNode };

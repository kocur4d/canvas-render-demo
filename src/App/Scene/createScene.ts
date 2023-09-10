import { vec3 } from "gl-matrix";
import { createNode } from "./Graph";
import { ShapeGeometry, transformationMatrixFromGeometry } from "../../la";

export interface Shape {
  name: string;
  geometry: ShapeGeometry;
}

const createScene = (shapes: Shape[]) => {
  const canvas = createNode({ name: "Canvas" });
  shapes.forEach((shape) => {
    const T = transformationMatrixFromGeometry(shape.geometry);
    const node = createNode({ name: shape.name });
    node.transformations.push(T);
    node.vertices = [
      vec3.fromValues(0, 0, 1),
      vec3.fromValues(1, 0, 1),
      vec3.fromValues(1, 1, 1),
      vec3.fromValues(0, 1, 1),
    ].map((v) => vec3.transformMat3(vec3.create(), v, T));
    canvas.children.push(node);
  });
  return canvas;
};

export { createScene };

import { vec3 } from "gl-matrix";
import { createNode } from "./Graph/createNode";
import { ShapeGeometry, transformationMatrixFromGeometry } from "../../la";

export interface Shape {
  name: string;
  geometry: ShapeGeometry;
}

const createScene = (shapes: Shape[]) => {
  const canvas = createNode({ name: "Canvas" });
  shapes.forEach((shape) => {
    const node = createNode({ name: shape.name });
    node.transformations.push(transformationMatrixFromGeometry(shape.geometry));
    node.vertices = [
      vec3.fromValues(-0.5, 0.5, 1),
      vec3.fromValues(0.5, 0.5, 1),
      vec3.fromValues(0.5, -0.5, 1),
      vec3.fromValues(-0.5, -0.5, 1),
    ];
    canvas.children.push(node);
  });
  return canvas;
};

export { createScene };

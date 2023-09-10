import { SceneNode, createNode } from "./createNode";

const cloneNode = (node: SceneNode) => {
  const newNode = createNode({ name: node.name });
  newNode.children = node.children;
  newNode.material = node.material;
  newNode.transformations = node.transformations;
  newNode.vertices = node.vertices;
  return newNode;
};

export { cloneNode };

import { useCallback, useEffect, useState } from "react";
import { mat3, vec3 } from "gl-matrix";
import { SceneNode } from "./Graph/createNode";

export interface ProcessedSceneNode extends SceneNode {
  processedVertices: vec3[];
}

const useProcessScene = (scene: SceneNode) => {
  const [processdScene, setProcessedScene] = useState<
    (ProcessedSceneNode | undefined)[]
  >([]);

  const process = useCallback((node: SceneNode, transform: mat3) => {
    const newTransform = mat3.clone(transform);
    if (node.transformations.length > 0) {
      const result = mat3.create();
      node.transformations.forEach((value) => {
        mat3.multiply(result, result, value);
      });
      mat3.multiply(newTransform, newTransform, result);
    }

    if (node.vertices.length > 0) {
      const vectors = [];
      for (let i = 0; i < node.vertices.length; i += 1) {
        vectors.push(
          vec3.transformMat3(vec3.create(), node.vertices[i], newTransform)
        );
      }
      return { ...node, processedVertices: vectors };
    }

    const result = node.children.map((child) => process(child, newTransform));
    setProcessedScene(result);
  }, []);

  useEffect(() => {
    process(scene, mat3.create());
  }, [process, scene]);

  return { processdScene, setProcessedScene };
};

export { useProcessScene };

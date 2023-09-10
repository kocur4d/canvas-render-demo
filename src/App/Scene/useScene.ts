import { useEffect, useState } from "react";
import { createScene, Shape } from "./createScene";
import { vec2, vec3 } from "gl-matrix";
import { drawShape } from "./drawShape";
import { Axis } from "../../la";
import { ProcessedSceneNode, useProcessScene } from "./useProcessScene";

const OFFSET = 20;

export type SceneEvent = {
  type: string;
  target: ProcessedSceneNode;
  data: number[];
};

const useScene = (
  ctx: CanvasRenderingContext2D | undefined,
  shapes: Shape[]
) => {
  const [scene] = useState(() => createScene(shapes));
  const { processdScene, setProcessedScene } = useProcessScene(scene);

  useEffect(() => {
    if (ctx) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      processdScene.forEach(
        (node) =>
          node?.processedVertices &&
          drawShape(ctx, node.processedVertices, "black")
      );
    }
  }, [ctx, processdScene]);

  const edgeCross = (vectors: vec3[]) => {
    const [ab, ap] = vectors;
    return ab[0] * ap[1] - ab[1] * ap[0];
  };

  const vertexPointVectors = (a: vec3, b: vec3, point: vec2) => {
    const p = vec3.fromValues(point[Axis.X], point[Axis.Y], 1);
    const ab = vec3.subtract(vec3.create(), b, a);
    const ap = vec3.subtract(vec3.create(), p, a);
    return [ab, ap];
  };

  const sceneOnHover = (mp: vec2, callback: (event: SceneEvent) => void) => {
    for (let i = 0; i < processdScene.length; i++) {
      const node = processdScene[i];
      if (node) {
        const { processedVertices: pv } = node;

        if (pv.length > 0) {
          const w0p = vertexPointVectors(pv[0], pv[1], mp);
          const w1p = vertexPointVectors(pv[1], pv[2], mp);
          const w2p = vertexPointVectors(pv[2], pv[3], mp);
          const w3p = vertexPointVectors(pv[3], pv[0], mp);

          const isOutside = [w0p, w1p, w2p, w3p].some((vectors) => {
            return edgeCross(vectors) < 0;
          });

          if (!isOutside) {
            const edges = [w0p, w1p, w2p, w3p].reduce<number[]>(
              (acc, val, idx) => {
                const [ab, ap] = val;
                const dot = vec3.dot(ab, ap);
                const squaredLength = vec3.squaredLength(ap);
                const scaleFactor = dot / squaredLength;
                const result = vec3.create();
                vec3.scale(result, ap, scaleFactor);
                vec3.subtract(result, ab, result);
                const distance = vec3.length(result);

                if (distance < OFFSET) return [...acc, idx];
                return acc;
              },
              []
            );
            callback({
              type: "EDGE",
              target: node,
              data: edges,
            });
            break;
          }
        }
      }
    }
  };

  const updateVertices = (name: string, vertices: any) => {
    const updatedNodes = processdScene.map((node) =>
      node?.name === name ? { ...node, processedVertices: vertices } : node
    );
    setProcessedScene(updatedNodes);
  };

  return {
    sceneOnHover,
    updateVertices,
  };
};

export { useScene };

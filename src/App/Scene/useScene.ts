import { useCallback, useState } from "react";
import { createScene, Shape } from "./createScene";
import { vec2, vec3 } from "gl-matrix";
import { useDrawScene } from "./useDrawScene";
import { SceneNode } from "./Graph";
import {
  scaleXLeft,
  scaleXRight,
  scaleYDown,
  scaleYUp,
} from "./Transformations";
import { Axis, Transform } from "./Transformations/types";

const OFFSET = 20;

export type SceneEvent = {
  type: string;
  target: SceneNode;
  data: number[];
};

const useScene = (
  ctx: CanvasRenderingContext2D | undefined,
  shapes: Shape[]
) => {
  const [scene, setScene] = useState(() => createScene(shapes));
  useDrawScene(ctx, scene);

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

  const explore = useCallback(
    (node: SceneNode, mp: vec2, callback: (event: SceneEvent) => void) => {
      if (node.vertices.length > 0) {
        const { vertices: pv } = node;

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
          }
        }
      }
      node.children.forEach((child) => explore(child, mp, callback));
    },
    []
  );

  const sceneOnHover = (mp: vec2, callback: (event: SceneEvent) => void) => {
    explore(scene, mp, callback);
  };

  const updateNode = (name: string, mpdelta: vec2, type: string) => {
    if (type === Transform.SCALE_X_RIGHT)
      setScene(scaleXRight(scene, name, mpdelta));
    if (type === Transform.SCALE_Y_DOWN)
      setScene(scaleYDown(scene, name, mpdelta));
    if (type === Transform.SCALE_Y_UP) setScene(scaleYUp(scene, name, mpdelta));
    if (type === Transform.SCALE_X_LEFT)
      setScene(scaleXLeft(scene, name, mpdelta));
  };

  return {
    sceneOnHover,
    updateNode,
  };
};

export { useScene };

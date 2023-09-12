import { useCallback, useState } from "react";
import { SceneNode } from "./Graph";
import { vec2, vec3 } from "gl-matrix";
import { Axis } from "./Transformations/types";

export const enum HoverTarget {
  EDGE_0 = "EDGE_0",
  EDGE_1 = "EDGE_1",
  EDGE_2 = "EDGE_2",
  EDGE_3 = "EDGE_3",
  VERTEX_0 = "VERTEX_0",
  VERTEX_1 = "VERTEX_1",
  VERTEX_2 = "VERTEX_2",
  VERTEX_3 = "VERTEX_3",
  RECT = "RECT",
}

const OFFSET = 20;

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

const useHoverDetect = (node: SceneNode | null) => {
  const [hoverTarget, setHoverTarget] = useState<HoverTarget | null>(null);

  const detectTarget = useCallback(
    (mp: vec2) => {
      if (node) {
        const { vertices: pv } = node;
        const w0p = vertexPointVectors(pv[0], pv[1], mp);
        const w1p = vertexPointVectors(pv[1], pv[2], mp);
        const w2p = vertexPointVectors(pv[2], pv[3], mp);
        const w3p = vertexPointVectors(pv[3], pv[0], mp);

        const edges = [w0p, w1p, w2p, w3p].reduce<number[]>((acc, val, idx) => {
          const [ab] = val;
          const z = edgeCross(val);
          const abl = vec3.length(ab);
          const distance = z / abl;

          if (distance < OFFSET) return [...acc, idx];
          return acc;
        }, []);

        if (edges.length === 0) setHoverTarget(HoverTarget.RECT);
        if (edges.length === 1) {
          if (edges[0] === 0) setHoverTarget(HoverTarget.EDGE_0);
          if (edges[0] === 1) setHoverTarget(HoverTarget.EDGE_1);
          if (edges[0] === 2) setHoverTarget(HoverTarget.EDGE_2);
          if (edges[0] === 3) setHoverTarget(HoverTarget.EDGE_3);
        }
        if (edges.length === 2) {
          if (edges[0] === 0 && edges[1] === 3)
            setHoverTarget(HoverTarget.VERTEX_0);
          if (edges[0] === 0 && edges[1] === 1)
            setHoverTarget(HoverTarget.VERTEX_1);
          if (edges[0] === 1 && edges[1] === 2)
            setHoverTarget(HoverTarget.VERTEX_2);
          if (edges[0] === 2 && edges[1] === 3)
            setHoverTarget(HoverTarget.VERTEX_3);
        }
      } else {
        setHoverTarget(null);
      }
    },
    [node]
  );

  return { hoverTarget, detectTarget };
};

export { useHoverDetect };

import { useCallback, useState } from "react";
import { SceneNode } from "./Graph";
import { vec2, vec3 } from "gl-matrix";
import { Axis } from "./Transformations/types";

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

const useNode = () => {
  const [node, setNode] = useState<SceneNode | null>(null);

  const explore = useCallback((node: SceneNode, mp: vec2) => {
    if (node.vertices.length > 0) {
      const { vertices: pv } = node;

      if (pv.length > 0) {
        const w0p = vertexPointVectors(pv[0], pv[1], mp);
        const w1p = vertexPointVectors(pv[1], pv[2], mp);
        const w2p = vertexPointVectors(pv[2], pv[3], mp);
        const w3p = vertexPointVectors(pv[3], pv[0], mp);

        const isInside = ![w0p, w1p, w2p, w3p].some((vectors) => {
          return edgeCross(vectors) < 0;
        });

        return isInside ? node : false;
      }
    }
    const found = node.children.find((child) => explore(child, mp));
    if (found) setNode(found);
    else setNode(null);
  }, []);

  return { node, hoverExplore: explore };
};

export { useNode };

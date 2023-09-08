import React, { useEffect, useState, MouseEvent, useRef } from "react";
import { useSetupCanvas } from "./useSetupCanvas";
import { vec2, vec3 } from "gl-matrix";
import { Axis, transformVectors } from "../la/transformVectors";
import { useMousePosition } from "./useMousePosition";

const OFFSET = 20;
const SCALE = 0.007;
const coords = [500, 500, 600, 500, 600, 600, 500, 600];

type DragTarget = "EDGE";

export const drawShape =
  (ctx: CanvasRenderingContext2D | undefined) =>
  (coordinates: vec3[], material: string) => {
    if (ctx) {
      ctx.beginPath();
      ctx.fillStyle = material;
      ctx.strokeStyle = material;
      const [first, ...rest] = coordinates;
      ctx.moveTo(first[0], first[1]);
      for (let i = 0; i < rest.length; i += 1) {
        ctx.lineTo(rest[i][0], rest[i][1]);
      }
      ctx.fill();
      ctx.stroke();
    }
  };

const edge_cross = (vectors: vec3[]) => {
  const [ab, ap] = vectors;
  return ab[0] * ap[1] - ab[1] * ap[0];
};

const vertexPointVectors = (a: vec3, b: vec3, point: vec2) => {
  const p = vec3.fromValues(point[Axis.X], point[Axis.Y], 1);
  const ab = vec3.subtract(vec3.create(), b, a);
  const ap = vec3.subtract(vec3.create(), p, a);
  return [ab, ap];
};

function App() {
  const { ref, ctx } = useSetupCanvas();
  const [table, setTable] = useState<vec3[]>(() => [
    vec3.fromValues(coords[0], coords[1], 1),
    vec3.fromValues(coords[2], coords[3], 1),
    vec3.fromValues(coords[4], coords[5], 1),
    vec3.fromValues(coords[6], coords[7], 1),
  ]);
  const { mousePositionOnMouseMove } = useMousePosition();
  const [edges, setEdges] = useState<number[]>([]);
  const [dragTarget, setDragTarget] = useState<DragTarget | null>(null);

  const handleOnMouseMove = (event: MouseEvent) => {
    if (ctx) {
      const { mp, mpdelta } = mousePositionOnMouseMove(event, ctx);

      const w0p = vertexPointVectors(table[0], table[1], mp);
      const w1p = vertexPointVectors(table[1], table[2], mp);
      const w2p = vertexPointVectors(table[2], table[3], mp);
      const w3p = vertexPointVectors(table[3], table[0], mp);
      const isOutside = [w0p, w1p, w2p, w3p].some(
        (vectors) => edge_cross(vectors) < 0
      );

      if (!dragTarget) {
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
          setEdges(edges);
        } else {
          setEdges([]);
        }
      }

      if (dragTarget === "EDGE") {
        const scale = vec2.fromValues(1, 1);

        if (edges[0] === 0) {
          scale[1] = 1 + mpdelta[1] / (table[0][1] - table[3][1]);
          setTable(transformVectors(table, table[3], scale));
        }
        if (edges[0] === 1) {
          scale[0] = 1 + mpdelta[0] / (table[1][0] - table[0][0]);
          setTable(transformVectors(table, table[0], scale));
        }
        if (edges[0] === 2) {
          scale[1] = 1 + mpdelta[1] / (table[3][1] - table[0][1]);
          setTable(transformVectors(table, table[0], scale));
        }
        if (edges[0] === 3) {
          scale[0] = 1 + mpdelta[0] / (table[0][0] - table[1][0]);
          setTable(transformVectors(table, table[1], scale));
        }
      }
    }
  };

  const handleOnMouseDown = (event: MouseEvent) => {
    if (edges.length > 1) {
      console.log("Point");
    } else if (edges.length > 0) {
      console.log("Edge");
      setDragTarget("EDGE");
    }
  };

  const handleOnMouseUp = () => {
    setDragTarget(null);
    setEdges([]);
  };

  useEffect(() => {
    if (ctx) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      drawShape(ctx)(table, "green");
    }
  }, [ctx, table]);

  return (
    <canvas
      ref={ref}
      onMouseMove={handleOnMouseMove}
      onMouseDown={handleOnMouseDown}
      onMouseUp={handleOnMouseUp}
    />
  );
}

export default App;

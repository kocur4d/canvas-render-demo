import React, { useState, MouseEvent } from "react";
import { useSetupCanvas } from "./useSetupCanvas";
import { vec2 } from "gl-matrix";
import { transformVectors } from "../la/transformVectors";
import { useMousePosition } from "./useMousePosition";
import { SceneEvent, useScene } from "./Scene/useScene";

const shapes = [
  {
    name: "Table 2",
    geometry: {
      x: 100,
      y: 100,
      h: 100,
      w: 100,
      a: 0,
    },
  },
  {
    name: "Table 1",
    geometry: {
      x: 500,
      y: 500,
      h: 100,
      w: 100,
      a: 45,
    },
  },
];

function App() {
  const [isDragging, setIsDragging] = useState(false);
  const [sceneEvent, setSceneEvent] = useState<SceneEvent | null>(null);

  const { ref, ctx } = useSetupCanvas();
  const { sceneOnHover, updateVertices } = useScene(ctx, shapes);
  const { mousePositionOnMouseMove } = useMousePosition();

  const handleOnMouseMove = (event: MouseEvent) => {
    if (ctx) {
      const { mp, mpdelta } = mousePositionOnMouseMove(event, ctx);

      if (!isDragging) sceneOnHover(mp, setSceneEvent);

      if (isDragging && sceneEvent?.type === "EDGE") {
        const { target, data } = sceneEvent;
        const scale = vec2.fromValues(1, 1);
        const vertices = target.processedVertices;

        if (data[0] === 0) {
          scale[1] = 1 + mpdelta[1] / (vertices[0][1] - vertices[3][1]);
          updateVertices(
            target.name,
            transformVectors(vertices, vertices[3], scale)
          );
        }
        if (data[0] === 1) {
          scale[0] = 1 + mpdelta[0] / (vertices[1][0] - vertices[0][0]);
          updateVertices(
            target.name,
            transformVectors(vertices, vertices[0], scale)
          );
        }
        if (data[0] === 2) {
          scale[1] = 1 + mpdelta[1] / (vertices[3][1] - vertices[0][1]);
          updateVertices(
            target.name,
            transformVectors(vertices, vertices[0], scale)
          );
        }
        if (data[0] === 3) {
          scale[0] = 1 + mpdelta[0] / (vertices[0][0] - vertices[1][0]);
          updateVertices(
            target.name,
            transformVectors(vertices, vertices[1], scale)
          );
        }
      }
    }
  };

  const handleOnMouseDown = () => {
    if (sceneEvent?.type === "EDGE") {
      setIsDragging(true);
    }
  };

  const handleOnMouseUp = () => {
    setIsDragging(false);
  };

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

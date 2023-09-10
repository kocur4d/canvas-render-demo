import React, { useState, MouseEvent } from "react";
import { useSetupCanvas } from "./useSetupCanvas";
import { useMousePosition } from "./useMousePosition";
import { useScene, SceneEvent } from "./Scene/useScene";
import { Transform } from "./Scene/Transformations/types";

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
  const { sceneOnHover, updateNode } = useScene(ctx, shapes);
  const { mousePositionOnMouseMove } = useMousePosition();

  const handleOnMouseMove = (event: MouseEvent) => {
    if (ctx) {
      const { mp, mpdelta } = mousePositionOnMouseMove(event, ctx);

      if (!isDragging) sceneOnHover(mp, setSceneEvent);
      if (isDragging && sceneEvent?.type === "EDGE") {
        const { target, data } = sceneEvent;
        if (data[0] === 0) {
          updateNode(target.name, mpdelta, Transform.SCALE_Y_DOWN);
        }
        if (data[0] === 1) {
          updateNode(target.name, mpdelta, Transform.SCALE_X_RIGHT);
        }
        if (data[0] === 2) {
          updateNode(target.name, mpdelta, Transform.SCALE_Y_UP);
        }
        if (data[0] === 3) {
          updateNode(target.name, mpdelta, Transform.SCALE_X_LEFT);
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

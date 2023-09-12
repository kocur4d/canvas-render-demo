import React, { MouseEvent } from "react";
import { useSetupCanvas } from "./useSetupCanvas";
import { useMousePosition } from "./useMousePosition";
import { useScene } from "./Scene/useScene";
import { shapes } from "./data/shapes";

function App() {
  const { ref, ctx } = useSetupCanvas();
  const { sceneOnMouseMove, sceneOnMouseDown, sceneOnMouseUp } = useScene(
    ctx,
    shapes
  );
  const { mousePositionOnMouseMove } = useMousePosition();

  const handleOnMouseMove = (event: MouseEvent) => {
    if (ctx) {
      const { mp, mpdelta } = mousePositionOnMouseMove(event, ctx);

      sceneOnMouseMove(mp, mpdelta);
    }
  };

  const handleOnMouseDown = () => {
    sceneOnMouseDown();
  };

  const handleOnMouseUp = () => {
    sceneOnMouseUp();
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

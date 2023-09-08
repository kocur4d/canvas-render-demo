import { MouseEvent, useRef } from "react";
import { vec2 } from "gl-matrix";

const useMousePosition = () => {
  const previousMousePosition = useRef<vec2 | null>(null);

  const mousePositionOnMouseMove = (
    event: MouseEvent,
    ctx: CanvasRenderingContext2D
  ) => {
    const currentMousePosition = vec2.fromValues(
      event.clientX - ctx.canvas.getBoundingClientRect().left,
      event.clientY - ctx.canvas.getBoundingClientRect().top
    );

    if (!previousMousePosition.current)
      previousMousePosition.current = currentMousePosition;

    const delta = vec2.fromValues(
      currentMousePosition[0] - previousMousePosition.current[0],
      currentMousePosition[1] - previousMousePosition.current[1]
    );

    previousMousePosition.current = currentMousePosition;

    return {
      mp: currentMousePosition,
      pmp: previousMousePosition,
      mpdelta: delta,
    };
  };

  return { mousePositionOnMouseMove };
};

export { useMousePosition };

import { useState } from "react";
import { createScene, Shape } from "./createScene";
import { vec2 } from "gl-matrix";
import { useDrawScene } from "./useDrawScene";
import { rotate, scale, translate } from "./Transformations";
import { useNode } from "./useNode";
import { HoverTarget, useHoverDetect } from "./useHoverDetect";
import { Axis, GrowDirection } from "./Transformations/types";

const useScene = (
  ctx: CanvasRenderingContext2D | undefined,
  shapes: Shape[]
) => {
  const [scene, setScene] = useState(() => createScene(shapes));
  const { node, hoverExplore } = useNode();
  const { hoverTarget, detectTarget } = useHoverDetect(node);

  const [isDragging, setIsDragging] = useState(false);

  useDrawScene(ctx, scene);

  const sceneOnMouseMove = (mp: vec2, mpdelta: vec2) => {
    if (!isDragging) {
      hoverExplore(scene, mp);
      detectTarget(mp);
    }
    if (isDragging && node && hoverTarget) {
      updateNode(node.name, mpdelta, hoverTarget);
    }
  };

  const sceneOnMouseDown = () => {
    if (node) {
      setIsDragging(true);
    }
  };

  const sceneOnMouseUp = () => {
    setIsDragging(false);
  };

  const sceneOnWheel = (delta: number) => {
    if (node && hoverTarget === HoverTarget.RECT) {
      setScene(rotate(scene, node.name, delta));
    }
  };

  const updateNode = (name: string, mpdelta: vec2, type: HoverTarget) => {
    if (type === HoverTarget.RECT) setScene(translate(scene, name, mpdelta));
    if (type === HoverTarget.EDGE_0)
      setScene(
        scale(
          scene,
          name,
          mpdelta,
          [
            {
              axis: Axis.Y,
              dir: GrowDirection.N,
            },
          ],
          vec2.fromValues(0, -1)
        )
      );
    if (type === HoverTarget.EDGE_1)
      setScene(
        scale(
          scene,
          name,
          mpdelta,
          [{ axis: Axis.X, dir: GrowDirection.P }],
          vec2.fromValues(0, 0)
        )
      );
    if (type === HoverTarget.EDGE_2)
      setScene(
        scale(
          scene,
          name,
          mpdelta,
          [{ axis: Axis.Y, dir: GrowDirection.P }],
          vec2.fromValues(0, 0)
        )
      );
    if (type === HoverTarget.EDGE_3)
      setScene(
        scale(
          scene,
          name,
          mpdelta,
          [{ axis: Axis.X, dir: GrowDirection.N }],
          vec2.fromValues(-1, 0)
        )
      );
    if (type === HoverTarget.VERTEX_0)
      setScene(
        scale(
          scene,
          name,
          mpdelta,
          [
            { axis: Axis.X, dir: GrowDirection.N },
            { axis: Axis.Y, dir: GrowDirection.N },
          ],
          vec2.fromValues(-1, -1)
        )
      );
    if (type === HoverTarget.VERTEX_1)
      setScene(
        scale(
          scene,
          name,
          mpdelta,
          [
            { axis: Axis.X, dir: GrowDirection.P },
            { axis: Axis.Y, dir: GrowDirection.N },
          ],
          vec2.fromValues(0, -1)
        )
      );
    if (type === HoverTarget.VERTEX_2)
      setScene(
        scale(
          scene,
          name,
          mpdelta,
          [
            { axis: Axis.X, dir: GrowDirection.P },
            { axis: Axis.Y, dir: GrowDirection.P },
          ],
          vec2.fromValues(0, 0)
        )
      );
    if (type === HoverTarget.VERTEX_3)
      setScene(
        scale(
          scene,
          name,
          mpdelta,
          [
            { axis: Axis.X, dir: GrowDirection.N },
            { axis: Axis.Y, dir: GrowDirection.P },
          ],
          vec2.fromValues(-1, 0)
        )
      );
  };

  return {
    sceneOnMouseMove,
    sceneOnMouseDown,
    sceneOnMouseUp,
    sceneOnWheel,
  };
};

export { useScene };

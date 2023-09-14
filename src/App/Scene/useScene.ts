import { useState } from "react";
import { createScene, Shape } from "./createScene";
import { vec2 } from "gl-matrix";
import { useDrawScene } from "./useDrawScene";
import {
  scaleXLeft,
  scaleXRight,
  scaleYDown,
  scaleYUp,
} from "./Transformations";
import { useNode } from "./useNode";
import { HoverTarget, useHoverDetect } from "./useHoverDetect";
import { rotate } from "./Transformations/rotate";
import { translate } from "./Transformations/translate";

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
    if (type === HoverTarget.EDGE_1)
      setScene(scaleXRight(scene, name, mpdelta));
    if (type === HoverTarget.EDGE_0) setScene(scaleYDown(scene, name, mpdelta));
    if (type === HoverTarget.EDGE_2) setScene(scaleYUp(scene, name, mpdelta));
    if (type === HoverTarget.EDGE_3) setScene(scaleXLeft(scene, name, mpdelta));
    if (type === HoverTarget.RECT) setScene(translate(scene, name, mpdelta));
  };

  return {
    sceneOnMouseMove,
    sceneOnMouseDown,
    sceneOnMouseUp,
    sceneOnWheel,
  };
};

export { useScene };

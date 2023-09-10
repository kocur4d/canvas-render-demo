import { useCallback, useEffect } from "react";
import { SceneNode } from "./Graph";
import { drawShape } from "./drawShape";

const useDrawScene = (
  ctx: CanvasRenderingContext2D | undefined,
  scene: SceneNode
) => {
  const explore = useCallback(
    (node: SceneNode) => {
      if (node.vertices.length > 0) drawShape(ctx, node.vertices, "black");
      node.children.forEach((child) => explore(child));
    },
    [ctx]
  );

  useEffect(() => {
    if (ctx) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      explore(scene);
    }
  }, [ctx, explore, scene]);
};

export { useDrawScene };

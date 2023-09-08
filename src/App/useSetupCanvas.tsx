import { useCallback, useEffect, useState } from "react";

export const useSetupCanvas = () => {
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();

  const ref = useCallback((node: HTMLCanvasElement) => {
    if (node) {
      const ctx = node.getContext("2d");
      if (ctx) {
        setCtx(ctx);
      }
    }
  }, []);

  useEffect(() => {
    if (ctx) {
      const canvas = ctx.canvas;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  }, [ctx]);

  return { ref, ctx };
};

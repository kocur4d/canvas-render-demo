import { vec3 } from "gl-matrix";

const drawShape = (
  ctx: CanvasRenderingContext2D | undefined,
  vectors: vec3[],
  material: string
) => {
  if (ctx) {
    ctx.beginPath();
    ctx.fillStyle = material;
    ctx.strokeStyle = material;
    const [first, ...rest] = vectors;
    ctx.moveTo(first[0], first[1]);
    for (let i = 0; i < rest.length; i += 1) {
      ctx.lineTo(rest[i][0], rest[i][1]);
    }
    ctx.fill();
    ctx.stroke();
  }
};

export { drawShape };

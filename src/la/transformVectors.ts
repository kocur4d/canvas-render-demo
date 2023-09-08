import { mat3, vec2, vec3 } from "gl-matrix";

export const enum Axis {
  X,
  Y,
}

const transformVectors = (vectors: vec3[], origin: vec3, scale: vec2) => {
  const result = [...vectors];
  const combined = mat3.create();
  const m = mat3.fromTranslation(
    mat3.create(),
    vec2.fromValues(origin[Axis.X], origin[Axis.Y])
  );
  const minv = mat3.invert(mat3.create(), m);
  const s = mat3.fromScaling(mat3.create(), scale);

  mat3.multiply(combined, m, s);
  mat3.multiply(combined, combined, minv);

  for (let i = 0; i < vectors.length; i++) {
    vec3.transformMat3(result[i], vectors[i], combined);
  }
  return result;
};

export { transformVectors };

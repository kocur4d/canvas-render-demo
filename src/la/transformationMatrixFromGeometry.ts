import { mat3 } from "gl-matrix";
import { ShapeGeometry } from "./types";

const degToRedians = (deg: number) => deg * (Math.PI / 180);

const transformationMatrixFromGeometry = ({ x, y, h, w, a }: ShapeGeometry) => {
  const result = mat3.create();
  const T = mat3.fromTranslation(mat3.create(), [x + w / 2, y + h / 2]);
  const S = mat3.fromScaling(mat3.create(), [w, h]);
  console.log(degToRedians(0), x, y);
  const R = mat3.fromRotation(mat3.create(), degToRedians(a));
  mat3.multiply(result, T, R);
  mat3.multiply(result, result, S);
  return result;
};

export { transformationMatrixFromGeometry };

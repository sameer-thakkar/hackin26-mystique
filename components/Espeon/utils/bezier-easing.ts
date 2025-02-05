/**
 * Generates a cubic Bezier easing function based on the control points provided.
 *
 * @param {number} x1 - The x-coordinate of the first control point.
 * @param {number} y1 - The y-coordinate of the first control point.
 * @param {number} x2 - The x-coordinate of the second control point.
 * @param {number} y2 - The y-coordinate of the second control point.
 * @returns {(t: number) => number} - A function that computes the eased value for a given progress (t) between 0 and 1.
 *
 * @description
 * This function uses the cubic Bézier curve defined by the control points `(x1, y1)` and `(x2, y2)` to interpolate
 * values. It uses the Newton-Raphson method to solve for the parameter `t` given a progress value, and then computes
 * the corresponding eased value using the cubic Bézier formula.
 *
 * The function supports easing effects commonly used in animations, such as ease-in, ease-out, and ease-in-out.
 */
export const cubicBezier = (x1: number, y1: number, x2: number, y2: number) => {
  const cubic = (a: number, b: number, t: number) =>
    3 * a * (1 - t) ** 2 * t + 3 * b * (1 - t) * t ** 2 + t ** 3;

  const derivative = (a: number, b: number, t: number) =>
    3 * (1 - t) ** 2 * a + 6 * (1 - t) * t * b + 3 * t ** 2;

  return (t: number) => {
    let currentT = t;
    let iteration = 0;
    const maxIterations = 10; // Avoid infinite loops
    const epsilon = 1e-5; // Precision for solving cubic roots

    while (iteration < maxIterations) {
      const x = cubic(x1, x2, currentT) - t;
      if (Math.abs(x) < epsilon) break;

      const d = derivative(x1, x2, currentT);
      if (Math.abs(d) < epsilon) break; // Avoid division by 0

      currentT -= x / d; // Newton-Raphson iteration
      iteration++;
    }

    return cubic(y1, y2, currentT);
  };
};

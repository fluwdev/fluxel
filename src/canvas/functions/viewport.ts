/**
 * Calculates the new viewport dimensions for a canvas based on the pixel size and the number of pixels.
 *
 * @param {number} oldWidth - The original width of the canvas in pixels.
 * @param {number} oldHeight - The original height of the canvas in pixels.
 * @param {number} newPixelSize - The size of each pixel in the new canvas.
 * @returns {{ width: number, height: number }} The new viewport dimensions (width and height).
 *
 * @example
 * const viewport = calViewport(100, 200, 5);
 * console.log(viewport); // { width: 500, height: 1000 }
 */
export function calculateViewportSize(
  oldWidth: number,
  oldHeight: number,
  newPixelSize: number
): { width: number; height: number } {
  const width = oldWidth * newPixelSize
  const height = oldHeight * newPixelSize

  return { width, height }
}

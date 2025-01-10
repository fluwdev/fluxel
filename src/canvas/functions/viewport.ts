import { CanvasState } from '../store/canvas'

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

/**
 * Resizes the canvas by adding pixels in the specified direction.
 *
 * @param {'up' | 'down' | 'left' | 'right'} direction - The direction in which pixels should be added to the canvas.
 * @param {number} pixels - The number of pixels to add in the specified direction.
 * @param {CanvasState} canvas - The current state of the canvas, including its dimensions and pixel size.
 * @returns {CanvasState} - A new canvas state object with updated dimensions based on the specified resize operation.
 *
 * @description
 * This function adjusts the dimensions of the canvas based on the user's specified direction and number of pixels.
 * It clones the current canvas state, calculates the new dimensions using the `calculateViewportSize` function,
 * and updates the canvas width or height accordingly.
 *
 * @example
 * const currentCanvas = {
 *   canvas: { width: 500, height: 300, sizePixel: 10 },
 *   otherState: { ... }
 * };
 *
 * const updatedCanvas = resizeCanvas('right', 5, currentCanvas);
 * console.log(updatedCanvas.canvas.width); // 550
 */
export const resizeCanvas = (
  direction: 'up' | 'down' | 'left' | 'right',
  pixels: number,
  canvas: CanvasState
) => {
  const newPixelSize = canvas.canvas.sizePixel
  const { width, height } = calculateViewportSize(
    canvas.canvas.width / newPixelSize,
    canvas.canvas.height / newPixelSize,
    newPixelSize
  )

  const newCanvas = structuredClone(canvas)

  switch (direction) {
    case 'up':
      newCanvas.canvas.height = height + pixels * newPixelSize
      break
    case 'down':
      newCanvas.canvas.height = height + pixels * newPixelSize
      break
    case 'left':
      newCanvas.canvas.width = width + pixels * newPixelSize
      break
    case 'right':
      newCanvas.canvas.width = width + pixels * newPixelSize
      break
    default:
      break
  }
  return newCanvas
}

/**
 * Applies zoom to the canvas and adjusts the offset to keep the zoom centered around the mouse position.
 *
 * @param {number} currentZoom - Current zoom level.
 * @param {number} deltaY - Wheel delta value to determine zoom direction.
 * @param {{ x: number, y: number }} offset - Current canvas offset.
 * @param {{ x: number, y: number }} mousePosition - Mouse position relative to the canvas.
 * @returns {{ newZoom: number, offset: { x: number, y: number } }} - The new zoom level and adjusted offset.
 */
export const applyZoom = (
  currentZoom: number,
  deltaY: number,
  offset: { x: number; y: number },
  mousePosition: { x: number; y: number }
) => {
  const zoomFactor = 0.1
  const newZoom = Math.max(
    0.5,
    Math.min(5, currentZoom - deltaY * zoomFactor * 0.01)
  ) // Clamp zoom between 0.5x and 5x

  // Calculate new offset to keep zoom centered on the mouse position
  const zoomRatio = newZoom / currentZoom
  const offsetX = (mousePosition.x - offset.x) * (1 - zoomRatio)
  const offsetY = (mousePosition.y - offset.y) * (1 - zoomRatio)

  return {
    newZoom,
    offset: {
      x: offset.x + offsetX,
      y: offset.y + offsetY,
    },
  }
}

/**
 * Constrains the canvas offset to ensure it doesn't go out of bounds.
 *
 * @param {{ x: number, y: number }} offset - Current canvas offset.
 * @param {number} zoom - Current zoom level.
 * @param {number} canvasWidth - Canvas width.
 * @param {number} canvasHeight - Canvas height.
 * @returns {{ x: number, y: number }} - Adjusted offset within bounds.
 */
export const constrainCanvasPosition = (
  offset: { x: number; y: number },
  zoom: number,
  canvasWidth: number,
  canvasHeight: number
) => {
  const maxOffsetX = (canvasWidth * (zoom - 1)) / zoom
  const maxOffsetY = (canvasHeight * (zoom - 1)) / zoom

  return {
    x: Math.min(0, Math.max(-maxOffsetX, offset.x)),
    y: Math.min(0, Math.max(-maxOffsetY, offset.y)),
  }
}

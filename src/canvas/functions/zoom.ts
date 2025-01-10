import { clamp } from './clamp'

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
  delta: number,
  canvasOffset: { x: number; y: number },
  pointerPosition: { x: number; y: number },
  minZoom: number = 0.5, // Limit Min
  maxZoom: number = 3 // Limit Max
) => {
  const zoomFactor = delta > 0 ? 0.9 : 1.1 // Scale
  let newZoom = currentZoom * zoomFactor

  // Aplicar clamping al zoom
  newZoom = clamp(newZoom, minZoom, maxZoom)

  // Ajustar el offset para centrar el zoom en el puntero
  const zoomChange = newZoom / currentZoom
  const offsetX = pointerPosition.x - pointerPosition.x * zoomChange
  const offsetY = pointerPosition.y - pointerPosition.y * zoomChange

  return {
    newZoom,
    offset: {
      x: canvasOffset.x + offsetX,
      y: canvasOffset.y + offsetY,
    },
  }
}

/**
 * Constrains the canvas offset to ensure it doesn't go out of bounds.
 *
 * @param {{ x: number, y: number }} offset - Current canvas offset.
 * @param {{width: number, height: number}} canvasSize - Canvas size.
 * @param {{width: number, height: number}} viewportSize - Viewport Size.
 * @param {number} zoom - Current zoom level.
 * @returns {{ x: number, y: number }} - Adjusted offset within bounds.
 */
export const constrainCanvasPosition = (
  offset: { x: number; y: number },
  canvasSize: { width: number; height: number },
  viewportSize: { width: number; height: number },
  zoom: number
) => {
  const maxOffsetX = Math.max(0, canvasSize.width - viewportSize.width / zoom)
  const maxOffsetY = Math.max(0, canvasSize.height - viewportSize.height / zoom)

  return {
    x: clamp(offset.x, 0, maxOffsetX),
    y: clamp(offset.y, 0, maxOffsetY),
  }
}

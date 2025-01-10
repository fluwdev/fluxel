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
  minZoom: number = 0.5, // Límite mínimo
  maxZoom: number = 3 // Límite máximo
) => {
  const zoomFactor = delta > 0 ? 0.9 : 1.1 // Escalar según el desplazamiento
  let newZoom = currentZoom * zoomFactor

  // Aplicar límites al zoom
  if (newZoom < minZoom) newZoom = minZoom
  if (newZoom > maxZoom) newZoom = maxZoom

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

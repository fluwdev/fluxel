/**
 * Draws a line on a 2D canvas context.
 *
 * @param {CanvasRenderingContext2D} ctx - The 2D canvas context where the line will be drawn.
 * @param {number} x1 - The x-coordinate of the starting point of the line.
 * @param {number} y1 - The y-coordinate of the starting point of the line.
 * @param {number} x2 - The x-coordinate of the ending point of the line.
 * @param {number} y2 - The y-coordinate of the ending point of the line.
 * @param {string} color - The color of the line.
 *
 * @example
 * const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
 * const ctx = canvas.getContext('2d');
 * if (ctx) {
 *   drawLine(ctx, 10, 10, 100, 100, 'black');
 * }
 */
export function drawLine(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string = 'black'
) {
  ctx.strokeStyle = color
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
}

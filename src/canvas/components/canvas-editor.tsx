import { useEffect, useRef, useState } from 'react'
import { useCanvasStore } from '../store/canvas'
import { drawLine } from '../functions/draw-line'
import { applyZoom } from '@canvas/functions/zoom'

export default function CanvasEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { canvas } = useCanvasStore((state) => state)
  const [zoom, setZoom] = useState(1) // Initial zoom level
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 }) // Offset for panning

  useEffect(() => {
    drawingGrid()
  }, [zoom])

  const drawingGrid = () => {
    // Get the canvas context
    if (!canvasRef.current) return
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()

    // Apply zoom and offset
    ctx.scale(zoom, zoom)

    // Draw Y Axis
    for (let i = 0; i < canvas.width; i += canvas.sizePixel) {
      drawLine(ctx, i, 0, i, canvas.height, canvas.colorGrid)
    }

    // Draw X Axis
    for (let i = 0; i < canvas.height; i += canvas.sizePixel) {
      drawLine(ctx, 0, i, canvas.width, i, canvas.colorGrid)
    }
    ctx.restore()
  }

  const handleWheel = (event: React.WheelEvent) => {
    if (event.altKey) {
      event.preventDefault()

      const { newZoom, offset } = applyZoom(
        zoom,
        event.deltaY,
        canvasOffset,
        { x: event.clientX, y: event.clientY },
        1, // Zoom mínimo
        3 // Zoom máximo
      )

      setZoom(newZoom)
      setCanvasOffset(offset)
    }
  }

  return (
    <div
      onWheel={handleWheel}
      tabIndex={0}
      className='w-full h-full flex items-center justify-center'
    >
      <canvas
        ref={canvasRef}
        width={canvas.width}
        height={canvas.height}
        className='bg-neutral-50 absolute m-auto'
      />
    </div>
  )
}

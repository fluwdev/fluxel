import { useEffect, useRef } from 'react'
import { useCanvasStore } from '../store/canvas'
import { drawLine } from '../functions/draw-line'

export default function CanvasEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { canvas } = useCanvasStore((state) => state)

  useEffect(() => {
    drawingGrid()
  }, [])

  const drawingGrid = () => {
    // Get the canvas context
    if (!canvasRef.current) return
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return

    // Draw Y Axis
    for (let i = 0; i < canvas.width; i += canvas.sizePixel) {
      drawLine(ctx, i, 0, i, canvas.height, canvas.colorGrid)
    }

    // Draw X Axis
    for (let i = 0; i < canvas.height; i += canvas.sizePixel) {
      drawLine(ctx, 0, i, canvas.width, i, canvas.colorGrid)
    }
  }

  return (
    <div className='w-full h-full flex items-center justify-center'>
      <canvas
        ref={canvasRef}
        width={canvas.width}
        height={canvas.height}
        className='bg-neutral-50 absolute m-auto'
      />
    </div>
  )
}

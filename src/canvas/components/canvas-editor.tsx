import { useEffect, useRef, useState } from 'react'
import { useCanvasStore } from '../store/canvas'
import { drawLine } from '../functions/draw-line'
import { applyZoom, constrainCanvasPosition } from '@canvas/functions/zoom'

export default function CanvasEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { canvas } = useCanvasStore((state) => state)
  const [zoom, setZoom] = useState(1) // Initial zoom level
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 }) // Offset for panning
  const [isDragging, setIsDragging] = useState(false) // Dragging state
  const [lastMousePosition, setLastMousePosition] = useState<{
    x: number
    y: number
  } | null>(null)
  const [isSpacePressed, setIsSpacePressed] = useState(false) // Space key state

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
    ctx.translate(canvasOffset.x / zoom, canvasOffset.y / zoom)

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
    if (!event.altKey) return

    event.preventDefault()
    const { newZoom, offset } = applyZoom(zoom, event.deltaY, canvasOffset, {
      x: event.clientX,
      y: event.clientY,
    })

    setZoom(newZoom)
    setCanvasOffset(offset)
  }

  const handleMouseDown = (event: React.MouseEvent) => {
    if (!isSpacePressed) return // Only start dragging if space is pressed
    setIsDragging(true)
    setLastMousePosition({ x: event.clientX, y: event.clientY })
  }

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging || !lastMousePosition) return

    const dx = event.clientX - lastMousePosition.x
    const dy = event.clientY - lastMousePosition.y

    // Update offset and constrain the position
    const newOffset = constrainCanvasPosition(
      { x: canvasOffset.x + dx, y: canvasOffset.y + dy },
      zoom,
      canvas.width,
      canvas.height
    )

    setCanvasOffset(newOffset)
    setLastMousePosition({ x: event.clientX, y: event.clientY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setLastMousePosition(null)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.code === 'Space') {
      setIsSpacePressed(true)
    }
  }

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.code === 'Space') {
      setIsSpacePressed(false)
    }
  }

  return (
    <div
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
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

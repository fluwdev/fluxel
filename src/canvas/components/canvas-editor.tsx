import { useEffect, useRef, useState } from 'react'
import { useCanvasStore } from '../store/canvas'
import { drawLine } from '../functions/draw-line'
import { applyZoom, constrainCanvasPosition } from '@canvas/functions/zoom'

const constrainViewport = (
  offset: { x: number; y: number },
  canvasSize: { width: number; height: number },
  viewportSize: { width: number; height: number },
  zoom: number
) => {
  const maxOffsetX = Math.max(0, canvasSize.width * zoom - viewportSize.width)
  const maxOffsetY = Math.max(0, canvasSize.height * zoom - viewportSize.height)

  return {
    x: Math.max(0, Math.min(offset.x, maxOffsetX)),
    y: Math.max(0, Math.min(offset.y, maxOffsetY)),
  }
}

export default function CanvasEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { canvas } = useCanvasStore((state) => state)
  const [zoom, setZoom] = useState(1) // Initial zoom level
  const [offset, setOffset] = useState({ x: 0, y: 0 }) // Offset for panning
  const [isDragging, setIsDragging] = useState(true)
  const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 })
  const viewportSize = {
    width: canvas.size.width / 2,
    height: canvas.size.height / 2,
  }

  useEffect(() => {
    drawingGrid()
  }, [zoom])

  const drawingGrid = () => {
    // Get the canvas context
    if (!canvasRef.current) return
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.size.width, canvas.size.height)
    ctx.save()

    // Apply zoom and offset
    ctx.scale(zoom, zoom)
    ctx.translate(-offset.x, -offset.y)
    ctx.fillRect(0, 0, 50, 50)

    // Draw Y Axis
    for (let i = 0; i < canvas.size.width; i += canvas.sizePixel) {
      drawLine(ctx, i, 0, i, canvas.size.height, canvas.colorGrid)
    }

    // Draw X Axis
    for (let i = 0; i < canvas.size.height; i += canvas.sizePixel) {
      drawLine(ctx, 0, i, canvas.size.width, i, canvas.colorGrid)
    }
    ctx.restore()
  }

  const handleZoom = (delta: number, center: { x: number; y: number }) => {
    const { newZoom, offset: newOffset } = applyZoom(
      zoom,
      delta,
      offset,
      center,
      1
    )

    setZoom(newZoom)
    setOffset(
      constrainCanvasPosition(newOffset, canvas.size, viewportSize, newZoom)
    )
  }

  const handleMouseDown = (event: React.MouseEvent) => {
    setIsDragging(true)
    setLastMousePosition({ x: event.clientX, y: event.clientY })
  }

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging) return
    const movement = {
      x: event.clientX - lastMousePosition.x,
      y: event.clientY - lastMousePosition.y,
    }

    const newOffset = {
      x: offset.x - movement.x,
      y: offset.y - movement.y,
    }

    setOffset(constrainViewport(newOffset, canvas.size, viewportSize, zoom))

    setLastMousePosition({ x: event.clientX, y: event.clientY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleWheel = (event: React.WheelEvent) => {
    if (event.altKey) {
      const center = { x: event.clientX, y: event.clientY }
      handleZoom(event.deltaY, center)
    }
  }
  return (
    <div
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      tabIndex={0}
      className='w-full h-full flex items-center justify-center'
    >
      <canvas
        ref={canvasRef}
        width={canvas.size.width}
        height={canvas.size.height}
        className='bg-neutral-50 absolute z-50 m-auto'
      />
    </div>
  )
}

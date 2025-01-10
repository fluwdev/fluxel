import { create } from 'zustand'

export type CanvasState = {
  canvas: {
    width: number
    height: number
    sizePixel: number
    gridVisible: boolean
    colorGrid: string
    backgroundColor: string
    zoom: number
  }
  changeViewport: (width: number, height: number) => void
  changeBackgroundColor: (color: string) => void
}

export const useCanvasStore = create<CanvasState>((set) => ({
  // The canvas configuration
  canvas: {
    width: 480,
    height: 480,
    sizePixel: 16,
    gridVisible: true,
    colorGrid: 'rgba(0, 0, 0, 0.1)',
    backgroundColor: 'white',
    zoom: 1,
  },
  // Change the viewport size
  changeViewport: (width, height) =>
    set((state) => ({ canvas: { ...state.canvas, width, height } })),
  // Change the background color
  changeBackgroundColor: (color) =>
    set((state) => ({ canvas: { ...state.canvas, backgroundColor: color } })),
}))

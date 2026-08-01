import {
  useRef,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type RefObject,
  type WheelEvent,
} from 'react'
import { useTranslation } from 'react-i18next'
import { CANVAS_SIZE, clampZoom } from './layout'

export interface ViewState {
  x: number
  y: number
  zoom: number
}

interface CanvasSurfaceProps {
  view: ViewState
  onViewChange: (view: ViewState) => void
  viewportRef?: RefObject<HTMLDivElement | null>
  children: ReactNode
}

export function CanvasSurface({ view, onViewChange, viewportRef: externalRef, children }: CanvasSurfaceProps) {
  const { t } = useTranslation()
  const internalRef = useRef<HTMLDivElement>(null)
  const viewportRef = externalRef ?? internalRef
  const pointers = useRef<Map<number, { x: number; y: number }>>(new Map())
  const panRef = useRef<{ id: number; startX: number; startY: number; panX: number; panY: number } | null>(null)
  const pinchRef = useRef<{ dist: number; zoom: number } | null>(null)

  function localPoint(event: { clientX: number; clientY: number }): { x: number; y: number } {
    const rect = viewportRef.current?.getBoundingClientRect()
    return { x: event.clientX - (rect?.left ?? 0), y: event.clientY - (rect?.top ?? 0) }
  }

  function zoomAround(px: number, py: number, nextZoom: number) {
    const zoom = clampZoom(nextZoom)
    // Keep the world point under (px, py) fixed while zooming.
    const worldX = (px - view.x) / view.zoom
    const worldY = (py - view.y) / view.zoom
    onViewChange({ zoom, x: px - worldX * zoom, y: py - worldY * zoom })
  }

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    // Only pan when the background (not a widget) is grabbed.
    if ((event.target as HTMLElement).closest('.canvas-item')) return
    const p = localPoint(event)
    pointers.current.set(event.pointerId, p)
    event.currentTarget.setPointerCapture(event.pointerId)

    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()]
      pinchRef.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), zoom: view.zoom }
      panRef.current = null
    } else {
      panRef.current = { id: event.pointerId, startX: p.x, startY: p.y, panX: view.x, panY: view.y }
    }
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!pointers.current.has(event.pointerId)) return
    const p = localPoint(event)
    pointers.current.set(event.pointerId, p)

    if (pointers.current.size === 2 && pinchRef.current) {
      const [a, b] = [...pointers.current.values()]
      const dist = Math.hypot(a.x - b.x, a.y - b.y)
      const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
      zoomAround(mid.x, mid.y, (dist / pinchRef.current.dist) * pinchRef.current.zoom)
      return
    }

    const pan = panRef.current
    if (pan && pan.id === event.pointerId) {
      onViewChange({ zoom: view.zoom, x: pan.panX + (p.x - pan.startX), y: pan.panY + (p.y - pan.startY) })
    }
  }

  function endPointer(event: ReactPointerEvent<HTMLDivElement>) {
    pointers.current.delete(event.pointerId)
    if (pointers.current.size < 2) pinchRef.current = null
    if (panRef.current?.id === event.pointerId) panRef.current = null
  }

  function onWheel(event: WheelEvent<HTMLDivElement>) {
    const p = localPoint(event)
    const factor = event.deltaY < 0 ? 1.1 : 1 / 1.1
    zoomAround(p.x, p.y, view.zoom * factor)
  }

  function zoomButton(factor: number) {
    const rect = viewportRef.current?.getBoundingClientRect()
    zoomAround((rect?.width ?? 0) / 2, (rect?.height ?? 0) / 2, view.zoom * factor)
  }

  return (
    <div className="canvas">
      <div
        ref={viewportRef}
        className="canvas-viewport"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
        onWheel={onWheel}
      >
        <div
          className="canvas-world"
          style={{
            width: CANVAS_SIZE,
            height: CANVAS_SIZE,
            transform: `translate(${view.x}px, ${view.y}px) scale(${view.zoom})`,
          }}
        >
          {children}
        </div>
      </div>
      <div className="canvas-controls" role="group" aria-label={t('canvas.controls')}>
        <button type="button" aria-label={t('canvas.zoomOut')} onClick={() => zoomButton(1 / 1.2)}>
          <span aria-hidden="true">−</span>
        </button>
        <span className="canvas-controls__zoom" aria-hidden="true">
          {Math.round(view.zoom * 100)}%
        </span>
        <button type="button" aria-label={t('canvas.zoomIn')} onClick={() => zoomButton(1.2)}>
          <span aria-hidden="true">+</span>
        </button>
        <button type="button" onClick={() => onViewChange({ x: 0, y: 0, zoom: 1 })}>
          {t('canvas.resetView')}
        </button>
      </div>
    </div>
  )
}

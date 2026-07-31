import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { useTranslation } from 'react-i18next'
import type { WhiteboardPersist, WhiteboardStroke } from '../state'

const COLORS = ['#111827', '#b42318', '#245dcc', '#176b3a']
const WIDTHS = [2, 4, 8]

interface WhiteboardWidgetProps {
  state: WhiteboardPersist
  onChange: (next: WhiteboardPersist) => void
}

export function WhiteboardWidget({ state, onChange }: WhiteboardWidgetProps) {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const strokeRef = useRef<WhiteboardStroke | null>(null)
  const pointerRef = useRef<{ id: number; type: string } | null>(null)

  const [color, setColor] = useState(COLORS[0])
  const [width, setWidth] = useState(WIDTHS[1])

  const strokes = state.strokes

  const drawStroke = useCallback((ctx: CanvasRenderingContext2D, stroke: WhiteboardStroke, w: number, h: number) => {
    if (stroke.points.length === 0) return
    ctx.strokeStyle = stroke.color
    ctx.lineWidth = stroke.width
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    ctx.beginPath()
    stroke.points.forEach(([nx, ny], i) => {
      const x = nx * w
      const y = ny * h
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.stroke()
  }, [])

  const redraw = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (const stroke of strokes) drawStroke(ctx, stroke, canvas.width, canvas.height)
    if (strokeRef.current) drawStroke(ctx, strokeRef.current, canvas.width, canvas.height)
  }, [strokes, drawStroke])

  // Keep the canvas backing size matched to its box, and redraw on resize.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const observer = new ResizeObserver(() => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = Math.max(1, Math.floor(rect.width))
      canvas.height = Math.max(1, Math.floor(rect.height))
      redraw()
    })
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [redraw])

  useEffect(redraw, [redraw])

  function normalized(event: ReactPointerEvent<HTMLCanvasElement>): [number, number] {
    const rect = event.currentTarget.getBoundingClientRect()
    return [(event.clientX - rect.left) / rect.width, (event.clientY - rect.top) / rect.height]
  }

  function onPointerDown(event: ReactPointerEvent<HTMLCanvasElement>) {
    // One stroke at a time. While a stroke is active, additional contacts (e.g.
    // a resting palm) are ignored — see the pen/touch guard in onPointerMove.
    if (pointerRef.current) return
    pointerRef.current = { id: event.pointerId, type: event.pointerType }
    strokeRef.current = { color, width, points: [normalized(event)] }
    event.currentTarget.setPointerCapture(event.pointerId)
    redraw()
  }

  function onPointerMove(event: ReactPointerEvent<HTMLCanvasElement>) {
    const active = pointerRef.current
    if (!active || active.id !== event.pointerId || !strokeRef.current) return
    // If a pen is active, drop any concurrent touch (palm).
    if (active.type === 'pen' && event.pointerType === 'touch') return
    strokeRef.current.points.push(normalized(event))
    redraw()
  }

  function finishStroke(event: ReactPointerEvent<HTMLCanvasElement>) {
    const active = pointerRef.current
    if (!active || active.id !== event.pointerId) return
    const stroke = strokeRef.current
    pointerRef.current = null
    strokeRef.current = null
    if (stroke && stroke.points.length > 0) {
      onChange({ strokes: [...strokes, stroke] })
    }
  }

  function undo() {
    onChange({ strokes: strokes.slice(0, -1) })
  }

  function clear() {
    if (strokes.length > 0 && !window.confirm(t('whiteboard.confirmClear'))) return
    onChange({ strokes: [] })
  }

  return (
    <div className="whiteboard">
      <div className="whiteboard__toolbar" role="group" aria-label={t('whiteboard.toolbar')}>
        <div className="whiteboard__colors" role="group" aria-label={t('whiteboard.colorLabel')}>
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              className={`whiteboard__swatch${color === c ? ' whiteboard__swatch--active' : ''}`}
              style={{ background: c }}
              aria-pressed={color === c}
              aria-label={t('whiteboard.color', { color: c })}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
        <div className="whiteboard__widths" role="group" aria-label={t('whiteboard.widthLabel')}>
          {WIDTHS.map((w) => (
            <button
              key={w}
              type="button"
              className={`whiteboard__width${width === w ? ' whiteboard__width--active' : ''}`}
              aria-pressed={width === w}
              aria-label={t('whiteboard.width', { width: w })}
              onClick={() => setWidth(w)}
            >
              <span aria-hidden="true" style={{ width: w * 2, height: w * 2 }} />
            </button>
          ))}
        </div>
        <div className="whiteboard__actions">
          <button type="button" onClick={undo} disabled={strokes.length === 0}>
            {t('whiteboard.undo')}
          </button>
          <button type="button" className="whiteboard__clear" onClick={clear} disabled={strokes.length === 0}>
            {t('whiteboard.clear')}
          </button>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        className="whiteboard__canvas"
        role="img"
        aria-label={t('whiteboard.canvasLabel')}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={finishStroke}
        onPointerCancel={finishStroke}
      />
    </div>
  )
}

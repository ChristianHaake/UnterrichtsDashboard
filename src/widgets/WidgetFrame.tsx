import { useRef, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { MoveDirection } from './types'

interface WidgetFrameProps {
  title: string
  onRemove: () => void
  onMove: (direction: MoveDirection) => void
  /** Pointer drag on the header; deltas are in screen pixels. */
  onDrag: (clientDx: number, clientDy: number) => void
  children: ReactNode
}

const MOVE_CONTROLS: { direction: MoveDirection; glyph: string; labelKey: string }[] = [
  { direction: 'left', glyph: '←', labelKey: 'widget.moveLeft' },
  { direction: 'up', glyph: '↑', labelKey: 'widget.moveUp' },
  { direction: 'down', glyph: '↓', labelKey: 'widget.moveDown' },
  { direction: 'right', glyph: '→', labelKey: 'widget.moveRight' },
]

export function WidgetFrame({ title, onRemove, onMove, onDrag, children }: WidgetFrameProps) {
  const { t } = useTranslation()
  const dragRef = useRef<{ x: number; y: number } | null>(null)

  function onHeaderPointerDown(event: ReactPointerEvent<HTMLElement>) {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    dragRef.current = { x: event.clientX, y: event.clientY }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function onHeaderPointerMove(event: ReactPointerEvent<HTMLElement>) {
    const last = dragRef.current
    if (!last) return
    onDrag(event.clientX - last.x, event.clientY - last.y)
    dragRef.current = { x: event.clientX, y: event.clientY }
  }

  function onHeaderPointerUp() {
    dragRef.current = null
  }

  return (
    <section className="widget-frame" aria-label={title}>
      <header
        className="widget-frame__bar widget-frame__drag"
        onPointerDown={onHeaderPointerDown}
        onPointerMove={onHeaderPointerMove}
        onPointerUp={onHeaderPointerUp}
        onPointerCancel={onHeaderPointerUp}
      >
        <h2 className="widget-frame__title">{title}</h2>
        <div className="widget-frame__controls">
          <div
            className="widget-frame__move"
            role="group"
            aria-label={t('widget.moveGroup', { title })}
          >
            {MOVE_CONTROLS.map(({ direction, glyph, labelKey }) => (
              <button
                key={direction}
                type="button"
                className="widget-frame__btn"
                aria-label={t(labelKey, { title })}
                onClick={() => onMove(direction)}
                onPointerDown={(event) => event.stopPropagation()}
              >
                <span aria-hidden="true">{glyph}</span>
              </button>
            ))}
          </div>
          <button
            type="button"
            className="widget-frame__btn widget-frame__remove"
            aria-label={t('widget.remove', { title })}
            onClick={onRemove}
            onPointerDown={(event) => event.stopPropagation()}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
      </header>
      <div className="widget-frame__body">{children}</div>
    </section>
  )
}

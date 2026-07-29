import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { MoveDirection } from './types'

interface WidgetFrameProps {
  title: string
  onRemove: () => void
  onMove: (direction: MoveDirection) => void
  children: ReactNode
}

const MOVE_CONTROLS: { direction: MoveDirection; glyph: string; labelKey: string }[] = [
  { direction: 'left', glyph: '←', labelKey: 'widget.moveLeft' },
  { direction: 'up', glyph: '↑', labelKey: 'widget.moveUp' },
  { direction: 'down', glyph: '↓', labelKey: 'widget.moveDown' },
  { direction: 'right', glyph: '→', labelKey: 'widget.moveRight' },
]

export function WidgetFrame({ title, onRemove, onMove, children }: WidgetFrameProps) {
  const { t } = useTranslation()

  return (
    <section className="widget-frame" aria-label={title}>
      <header className="widget-frame__bar">
        {/* Drag handle for pointer users; keyboard users use the move buttons. */}
        <h2 className="widget-frame__title widget-frame__drag">{title}</h2>
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
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
      </header>
      <div className="widget-frame__body">{children}</div>
    </section>
  )
}

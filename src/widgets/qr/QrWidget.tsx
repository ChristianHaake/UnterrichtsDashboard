import { useEffect, useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toCanvas } from 'qrcode'
import type { QrPersist } from '../state'

interface QrWidgetProps {
  state: QrPersist
  onChange: (next: QrPersist) => void
}

export function QrWidget({ state, onChange }: QrWidgetProps) {
  const { t } = useTranslation()
  const inputId = useId()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [error, setError] = useState(false)
  const value = state.value.trim()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (!value) {
      canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height)
      setError(false)
      return
    }
    // Rendered entirely on-device; no network request. Errors (e.g. too long).
    toCanvas(canvas, value, { width: 200, margin: 1 })
      .then(() => setError(false))
      .catch(() => setError(true))
  }, [value])

  return (
    <div className="qr">
      <label className="qr__label" htmlFor={inputId}>
        {t('qr.label')}
      </label>
      <input
        id={inputId}
        type="text"
        className="qr__input"
        value={state.value}
        placeholder={t('qr.placeholder')}
        onChange={(event) => onChange({ value: event.target.value })}
      />
      <div className="qr__output">
        {value ? (
          <canvas
            ref={canvasRef}
            className="qr__canvas"
            role="img"
            aria-label={t('qr.imageLabel', { value })}
            hidden={error}
          />
        ) : (
          <p className="qr__hint">{t('qr.empty')}</p>
        )}
        {error && (
          <p className="qr__error" role="alert">
            {t('qr.error')}
          </p>
        )}
      </div>
    </div>
  )
}

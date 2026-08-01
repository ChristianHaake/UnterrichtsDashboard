import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { classifyLevel, computeRms, toDisplayLevel } from '../../domain/noise'
import type { NoiseMeterPersist } from '../state'

interface NoiseMeterWidgetProps {
  state: NoiseMeterPersist
  onChange: (next: NoiseMeterPersist) => void
}

export function NoiseMeterWidget({ state, onChange }: NoiseMeterWidgetProps) {
  const { t } = useTranslation()
  const [active, setActive] = useState(false)
  const [level, setLevel] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const streamRef = useRef<MediaStream | null>(null)
  const ctxRef = useRef<AudioContext | null>(null)
  const rafRef = useRef<number | null>(null)
  const smoothed = useRef(0)

  function stop() {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    void ctxRef.current?.close()
    ctxRef.current = null
    smoothed.current = 0
    setLevel(0)
    setActive(false)
  }

  // Release the microphone if the widget unmounts while listening.
  useEffect(() => stop, [])

  async function start() {
    setError(null)
    try {
      // Ask the browser NOT to normalize the signal; note this is not honored on
      // all devices (notably iOS Safari), so the meter stays a relative indicator.
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { autoGainControl: false, noiseSuppression: false, echoCancellation: false },
      })
      streamRef.current = stream
      const ctx = new AudioContext()
      ctxRef.current = ctx
      const source = ctx.createMediaStreamSource(stream)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 1024
      source.connect(analyser)
      const buffer = new Float32Array(analyser.fftSize)
      setActive(true)

      const loop = () => {
        analyser.getFloatTimeDomainData(buffer)
        const display = toDisplayLevel(computeRms(buffer))
        smoothed.current = smoothed.current * 0.8 + display * 0.2
        setLevel(smoothed.current)
        rafRef.current = requestAnimationFrame(loop)
      }
      loop()
    } catch {
      setError(t('noise.denied'))
      stop()
    }
  }

  const condition = classifyLevel(level, state.threshold)

  return (
    <div className="noise">
      <div className={`noise__meter noise__meter--${condition}`}>
        <div className="noise__bar" style={{ width: `${Math.round(level * 100)}%` }} />
        <div
          className="noise__threshold"
          style={{ left: `${Math.round(state.threshold * 100)}%` }}
          aria-hidden="true"
        />
      </div>
      <p className={`noise__state noise__state--${condition}`} role="status" aria-live="polite">
        {active ? t(`noise.states.${condition}`) : t('noise.idle')}
      </p>

      <label className="noise__threshold-label">
        {t('noise.threshold')}
        <input
          type="range"
          min={0.1}
          max={1}
          step={0.05}
          value={state.threshold}
          onChange={(event) => onChange({ threshold: Number(event.target.value) })}
        />
      </label>

      <div className="noise__controls">
        {active ? (
          <button type="button" onClick={stop}>
            {t('noise.stop')}
          </button>
        ) : (
          <button type="button" className="noise__start" onClick={() => void start()}>
            {t('noise.start')}
          </button>
        )}
      </div>

      {error && (
        <p className="noise__error" role="alert">
          {error}
        </p>
      )}
      <p className="noise__note">{t('noise.note')}</p>
    </div>
  )
}

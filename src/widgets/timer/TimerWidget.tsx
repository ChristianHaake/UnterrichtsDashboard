import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  createTimer,
  formatDuration,
  isFinished,
  pauseTimer,
  resetTimer,
  setDuration,
  startTimer,
  tickTimer,
} from '../../domain/timer'
import type { TimerPersist } from '../state'
import { useHeartbeat } from './useHeartbeat'

const STEP_MS = 60_000

interface TimerWidgetProps {
  state: TimerPersist
  onChange: (next: TimerPersist) => void
}

export function TimerWidget({ state: persisted, onChange }: TimerWidgetProps) {
  const { t } = useTranslation()
  const [timer, setTimer] = useState(() => createTimer(persisted.durationMs))

  // Re-sync the running timer when the persisted duration changes (hydrate/import).
  useEffect(() => {
    setTimer(createTimer(persisted.durationMs))
  }, [persisted.durationMs])

  useHeartbeat(timer.running, () => setTimer((s) => tickTimer(s, Date.now())))

  const finished = isFinished(timer)

  function changeDuration(delta: number) {
    const next = setDuration(timer, timer.durationMs + delta)
    setTimer(next)
    onChange({ durationMs: next.durationMs })
  }

  return (
    <div className="timer">
      <p className={`timer__display${finished ? ' timer__display--done' : ''}`}>
        {formatDuration(timer.remainingMs)}
      </p>

      {!timer.running && (
        <div className="timer__adjust" role="group" aria-label={t('timer.adjust')}>
          <button type="button" aria-label={t('timer.minusMinute')} onClick={() => changeDuration(-STEP_MS)}>
            −1&nbsp;min
          </button>
          <button type="button" aria-label={t('timer.plusMinute')} onClick={() => changeDuration(STEP_MS)}>
            +1&nbsp;min
          </button>
        </div>
      )}

      <div className="timer__controls">
        {timer.running ? (
          <button type="button" onClick={() => setTimer((s) => pauseTimer(s, Date.now()))}>
            {t('timer.pause')}
          </button>
        ) : (
          <button
            type="button"
            className="timer__start"
            disabled={timer.remainingMs <= 0}
            onClick={() => setTimer((s) => startTimer(s, Date.now()))}
          >
            {t('timer.start')}
          </button>
        )}
        <button type="button" onClick={() => setTimer((s) => resetTimer(s))}>
          {t('timer.reset')}
        </button>
      </div>

      <p className="timer__status" role="status">
        {finished ? t('timer.done') : ''}
      </p>
    </div>
  )
}

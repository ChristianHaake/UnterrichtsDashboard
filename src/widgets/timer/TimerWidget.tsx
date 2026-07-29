import { useState } from 'react'
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
import { useHeartbeat } from './useHeartbeat'

const DEFAULT_MS = 5 * 60_000
const STEP_MS = 60_000

export function TimerWidget() {
  const { t } = useTranslation()
  const [state, setState] = useState(() => createTimer(DEFAULT_MS))

  useHeartbeat(state.running, () => setState((s) => tickTimer(s, Date.now())))

  const finished = isFinished(state)

  return (
    <div className="timer">
      <p className={`timer__display${finished ? ' timer__display--done' : ''}`}>
        {formatDuration(state.remainingMs)}
      </p>

      {!state.running && (
        <div className="timer__adjust" role="group" aria-label={t('timer.adjust')}>
          <button
            type="button"
            aria-label={t('timer.minusMinute')}
            onClick={() => setState((s) => setDuration(s, s.durationMs - STEP_MS))}
          >
            −1&nbsp;min
          </button>
          <button
            type="button"
            aria-label={t('timer.plusMinute')}
            onClick={() => setState((s) => setDuration(s, s.durationMs + STEP_MS))}
          >
            +1&nbsp;min
          </button>
        </div>
      )}

      <div className="timer__controls">
        {state.running ? (
          <button type="button" onClick={() => setState((s) => pauseTimer(s, Date.now()))}>
            {t('timer.pause')}
          </button>
        ) : (
          <button
            type="button"
            className="timer__start"
            disabled={state.remainingMs <= 0}
            onClick={() => setState((s) => startTimer(s, Date.now()))}
          >
            {t('timer.start')}
          </button>
        )}
        <button type="button" onClick={() => setState((s) => resetTimer(s))}>
          {t('timer.reset')}
        </button>
      </div>

      <p className="timer__status" role="status">
        {finished ? t('timer.done') : ''}
      </p>
    </div>
  )
}

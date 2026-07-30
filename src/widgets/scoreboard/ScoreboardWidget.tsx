import { useId, useRef, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import type { ScoreEntry, ScoreboardPersist } from '../state'

interface ScoreboardWidgetProps {
  state: ScoreboardPersist
  onChange: (next: ScoreboardPersist) => void
}

export function ScoreboardWidget({ state, onChange }: ScoreboardWidgetProps) {
  const { t } = useTranslation()
  const idPrefix = useId()
  const counter = useRef(0)
  const [draft, setDraft] = useState('')

  const entries = state.entries

  function update(next: ScoreEntry[]) {
    onChange({ entries: next })
  }

  function addEntry(event: FormEvent) {
    event.preventDefault()
    const name = draft.trim()
    if (!name) return
    update([...entries, { id: `${idPrefix}-${counter.current++}`, name, score: 0 }])
    setDraft('')
  }

  function changeScore(id: string, delta: number) {
    update(entries.map((entry) => (entry.id === id ? { ...entry, score: entry.score + delta } : entry)))
  }

  function removeEntry(id: string) {
    update(entries.filter((entry) => entry.id !== id))
  }

  function resetScores() {
    update(entries.map((entry) => ({ ...entry, score: 0 })))
  }

  return (
    <div className="scoreboard">
      <form className="scoreboard__add" onSubmit={addEntry}>
        <label className="scoreboard__label" htmlFor={`${idPrefix}-draft`}>
          {t('scoreboard.newLabel')}
        </label>
        <div className="scoreboard__add-row">
          <input
            id={`${idPrefix}-draft`}
            type="text"
            value={draft}
            placeholder={t('scoreboard.placeholder')}
            onChange={(event) => setDraft(event.target.value)}
          />
          <button type="submit">{t('scoreboard.add')}</button>
        </div>
      </form>

      {entries.length === 0 ? (
        <p className="scoreboard__empty">{t('scoreboard.empty')}</p>
      ) : (
        <ul className="scoreboard__list">
          {entries.map((entry) => (
            <li key={entry.id} className="scoreboard__item">
              <span className="scoreboard__name">{entry.name}</span>
              <span className="scoreboard__score" aria-live="polite">
                {entry.score}
              </span>
              <div className="scoreboard__controls">
                <button
                  type="button"
                  aria-label={t('scoreboard.minus', { name: entry.name })}
                  onClick={() => changeScore(entry.id, -1)}
                >
                  <span aria-hidden="true">−</span>
                </button>
                <button
                  type="button"
                  aria-label={t('scoreboard.plus', { name: entry.name })}
                  onClick={() => changeScore(entry.id, 1)}
                >
                  <span aria-hidden="true">+</span>
                </button>
                <button
                  type="button"
                  className="scoreboard__remove"
                  aria-label={t('scoreboard.remove', { name: entry.name })}
                  onClick={() => removeEntry(entry.id)}
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {entries.length > 0 && (
        <button type="button" className="scoreboard__reset" onClick={resetScores}>
          {t('scoreboard.reset')}
        </button>
      )}
    </div>
  )
}

import { useId, useRef, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import type { PhasesPersist } from '../state'

interface PhasesWidgetProps {
  state: PhasesPersist
  onChange: (next: PhasesPersist) => void
}

export function PhasesWidget({ state, onChange }: PhasesWidgetProps) {
  const { t } = useTranslation()
  const idPrefix = useId()
  const counter = useRef(0)
  const [draft, setDraft] = useState('')

  const { phases, activeId } = state

  function addPhase(event: FormEvent) {
    event.preventDefault()
    const name = draft.trim()
    if (!name) return
    const id = `${idPrefix}-${counter.current++}`
    onChange({ phases: [...phases, { id, name }], activeId })
    setDraft('')
  }

  function removePhase(id: string) {
    onChange({
      phases: phases.filter((phase) => phase.id !== id),
      activeId: activeId === id ? null : activeId,
    })
  }

  function activate(id: string) {
    onChange({ phases, activeId: id })
  }

  return (
    <div className="phases">
      {phases.length === 0 ? (
        <p className="phases__empty">{t('phases.empty')}</p>
      ) : (
        <ol className="phases__list">
          {phases.map((phase) => {
            const isActive = phase.id === activeId
            return (
              <li key={phase.id} className={`phases__item${isActive ? ' phases__item--active' : ''}`}>
                <button
                  type="button"
                  className="phases__activate"
                  aria-pressed={isActive}
                  onClick={() => activate(phase.id)}
                >
                  {isActive && (
                    <span className="phases__marker" aria-hidden="true">
                      ▶
                    </span>
                  )}
                  <span>{phase.name}</span>
                  {isActive && <span className="phases__active-text"> — {t('phases.activeLabel')}</span>}
                </button>
                <button
                  type="button"
                  className="phases__remove"
                  aria-label={t('phases.remove', { name: phase.name })}
                  onClick={() => removePhase(phase.id)}
                >
                  <span aria-hidden="true">×</span>
                </button>
              </li>
            )
          })}
        </ol>
      )}

      <form className="phases__add" onSubmit={addPhase}>
        <label className="phases__add-label" htmlFor={`${idPrefix}-draft`}>
          {t('phases.newLabel')}
        </label>
        <div className="phases__add-row">
          <input
            id={`${idPrefix}-draft`}
            type="text"
            value={draft}
            placeholder={t('phases.placeholder')}
            onChange={(event) => setDraft(event.target.value)}
          />
          <button type="submit">{t('phases.add')}</button>
        </div>
      </form>
    </div>
  )
}

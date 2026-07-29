import { useRef, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'

interface Phase {
  id: string
  name: string
}

export function PhasesWidget() {
  const { t } = useTranslation()
  const counter = useRef(0)
  const nextId = () => `phase-${counter.current++}`

  const [phases, setPhases] = useState<Phase[]>(() =>
    [t('phases.default1'), t('phases.default2'), t('phases.default3')].map((name) => ({
      id: nextId(),
      name,
    })),
  )
  const [activeId, setActiveId] = useState<string | null>(() => null)
  const [draft, setDraft] = useState('')

  function addPhase(event: FormEvent) {
    event.preventDefault()
    const name = draft.trim()
    if (!name) return
    setPhases((current) => [...current, { id: nextId(), name }])
    setDraft('')
  }

  function removePhase(id: string) {
    setPhases((current) => current.filter((phase) => phase.id !== id))
    setActiveId((current) => (current === id ? null : current))
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
                  onClick={() => setActiveId(phase.id)}
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
        <label className="phases__add-label" htmlFor="phase-draft">
          {t('phases.newLabel')}
        </label>
        <div className="phases__add-row">
          <input
            id="phase-draft"
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

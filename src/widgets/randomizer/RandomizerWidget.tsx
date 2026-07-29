import { useId, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { shuffle } from '../../domain/shuffle'
import { makeGroups } from '../../domain/groups'
import type { RandomizerPersist } from '../state'

interface RandomizerWidgetProps {
  state: RandomizerPersist
  onChange: (next: RandomizerPersist) => void
}

export function RandomizerWidget({ state, onChange }: RandomizerWidgetProps) {
  const { t } = useTranslation()
  const inputId = useId()
  const [draft, setDraft] = useState('')
  const [groupSize, setGroupSize] = useState(2)
  const [pick, setPick] = useState<string | null>(null)
  const [groups, setGroups] = useState<string[][] | null>(null)

  const names = state.names

  function addName(event: FormEvent) {
    event.preventDefault()
    const name = draft.trim()
    if (!name) return
    onChange({ names: [...names, name] })
    setDraft('')
  }

  function removeName(index: number) {
    onChange({ names: names.filter((_, i) => i !== index) })
  }

  function pickOne() {
    if (names.length === 0) return
    setGroups(null)
    setPick(shuffle(names)[0])
  }

  function formGroups() {
    if (names.length === 0) return
    setPick(null)
    setGroups(makeGroups(names, groupSize))
  }

  return (
    <div className="randomizer">
      <form className="randomizer__add" onSubmit={addName}>
        <label className="randomizer__label" htmlFor={inputId}>
          {t('randomizer.newLabel')}
        </label>
        <div className="randomizer__add-row">
          <input
            id={inputId}
            type="text"
            value={draft}
            placeholder={t('randomizer.placeholder')}
            onChange={(event) => setDraft(event.target.value)}
          />
          <button type="submit">{t('randomizer.add')}</button>
        </div>
      </form>

      {names.length > 0 && (
        <ul className="randomizer__list">
          {names.map((name, index) => (
            <li key={`${name}-${index}`}>
              <span>{name}</span>
              <button
                type="button"
                aria-label={t('randomizer.remove', { name })}
                onClick={() => removeName(index)}
              >
                <span aria-hidden="true">×</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="randomizer__actions">
        <button type="button" disabled={names.length === 0} onClick={pickOne}>
          {t('randomizer.pick')}
        </button>
        <label className="randomizer__size">
          {t('randomizer.groupSize')}
          <input
            type="number"
            min={1}
            value={groupSize}
            onChange={(event) => setGroupSize(Math.max(1, Number(event.target.value) || 1))}
          />
        </label>
        <button type="button" disabled={names.length === 0} onClick={formGroups}>
          {t('randomizer.formGroups')}
        </button>
      </div>

      <div className="randomizer__result" role="status" aria-live="polite">
        {pick && <p className="randomizer__pick">{pick}</p>}
        {groups && (
          <ol className="randomizer__groups">
            {groups.map((group, index) => (
              <li key={index}>
                <strong>{t('randomizer.group', { number: index + 1 })}:</strong> {group.join(', ')}
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}

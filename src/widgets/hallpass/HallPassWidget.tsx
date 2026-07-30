import { useId, useRef, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { formatDuration } from '../../domain/timer'
import { useHeartbeat } from '../timer/useHeartbeat'
import type { HallPassPersist, HallPassStudent } from '../state'

interface HallPassWidgetProps {
  state: HallPassPersist
  onChange: (next: HallPassPersist) => void
}

export function HallPassWidget({ state, onChange }: HallPassWidgetProps) {
  const { t } = useTranslation()
  const idPrefix = useId()
  const counter = useRef(0)
  const [draft, setDraft] = useState('')
  const [, forceTick] = useState(0)

  const students = state.students
  const anyOut = students.some((student) => student.since !== null)

  // Re-render on a heartbeat while someone is out, so elapsed time stays live.
  useHeartbeat(anyOut, () => forceTick((n) => n + 1))

  function update(next: HallPassStudent[]) {
    onChange({ students: next })
  }

  function addStudent(event: FormEvent) {
    event.preventDefault()
    const name = draft.trim()
    if (!name) return
    update([...students, { id: `${idPrefix}-${counter.current++}`, name, since: null }])
    setDraft('')
  }

  function toggle(id: string) {
    update(
      students.map((student) =>
        student.id === id
          ? { ...student, since: student.since === null ? Date.now() : null }
          : student,
      ),
    )
  }

  function removeStudent(id: string) {
    update(students.filter((student) => student.id !== id))
  }

  const now = Date.now()

  return (
    <div className="hallpass">
      <form className="hallpass__add" onSubmit={addStudent}>
        <label className="hallpass__label" htmlFor={`${idPrefix}-draft`}>
          {t('hallpass.newLabel')}
        </label>
        <div className="hallpass__add-row">
          <input
            id={`${idPrefix}-draft`}
            type="text"
            value={draft}
            placeholder={t('hallpass.placeholder')}
            onChange={(event) => setDraft(event.target.value)}
          />
          <button type="submit">{t('hallpass.add')}</button>
        </div>
      </form>

      {students.length === 0 ? (
        <p className="hallpass__empty">{t('hallpass.empty')}</p>
      ) : (
        <ul className="hallpass__list">
          {students.map((student) => {
            const out = student.since !== null
            return (
              <li key={student.id} className={`hallpass__item${out ? ' hallpass__item--out' : ''}`}>
                <span className="hallpass__name">{student.name}</span>
                {out && (
                  <span className="hallpass__elapsed" aria-live="polite">
                    {t('hallpass.outLabel')} {formatDuration(now - (student.since as number))}
                  </span>
                )}
                <div className="hallpass__controls">
                  <button
                    type="button"
                    aria-label={t(out ? 'hallpass.back' : 'hallpass.out', { name: student.name })}
                    onClick={() => toggle(student.id)}
                  >
                    {out ? t('hallpass.backShort') : t('hallpass.outShort')}
                  </button>
                  <button
                    type="button"
                    className="hallpass__remove"
                    aria-label={t('hallpass.remove', { name: student.name })}
                    onClick={() => removeStudent(student.id)}
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

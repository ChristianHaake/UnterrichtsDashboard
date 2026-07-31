import { useId, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { STICKY_COLORS, type StickyColor, type StickyNote, type StickyNotesPersist } from '../state'

interface StickyNotesWidgetProps {
  state: StickyNotesPersist
  onChange: (next: StickyNotesPersist) => void
}

export function StickyNotesWidget({ state, onChange }: StickyNotesWidgetProps) {
  const { t } = useTranslation()
  const idPrefix = useId()
  const counter = useRef(0)
  const notes = state.notes

  function update(next: StickyNote[]) {
    onChange({ notes: next })
  }

  function addNote() {
    update([...notes, { id: `${idPrefix}-${counter.current++}`, text: '', color: 'yellow' }])
  }

  function setText(id: string, text: string) {
    update(notes.map((note) => (note.id === id ? { ...note, text } : note)))
  }

  function setColor(id: string, color: StickyColor) {
    update(notes.map((note) => (note.id === id ? { ...note, color } : note)))
  }

  function removeNote(id: string) {
    update(notes.filter((note) => note.id !== id))
  }

  return (
    <div className="sticky">
      <button type="button" className="sticky__add" onClick={addNote}>
        <span aria-hidden="true">＋ </span>
        {t('stickynotes.add')}
      </button>

      {notes.length === 0 ? (
        <p className="sticky__empty">{t('stickynotes.empty')}</p>
      ) : (
        <ul className="sticky__list">
          {notes.map((note, index) => (
            <li key={note.id} className={`sticky__note sticky__note--${note.color}`}>
              <textarea
                className="sticky__text"
                value={note.text}
                aria-label={t('stickynotes.noteLabel', { number: index + 1 })}
                placeholder={t('stickynotes.placeholder')}
                onChange={(event) => setText(note.id, event.target.value)}
                rows={3}
              />
              <div className="sticky__bar">
                <div
                  className="sticky__colors"
                  role="group"
                  aria-label={t('stickynotes.colorLabel', { number: index + 1 })}
                >
                  {STICKY_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`sticky__color sticky__color--${color}${
                        note.color === color ? ' sticky__color--active' : ''
                      }`}
                      aria-pressed={note.color === color}
                      aria-label={t(`stickynotes.colors.${color}`)}
                      onClick={() => setColor(note.id, color)}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  className="sticky__remove"
                  aria-label={t('stickynotes.remove', { number: index + 1 })}
                  onClick={() => removeNote(note.id)}
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

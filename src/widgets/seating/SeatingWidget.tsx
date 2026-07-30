import { useId, useRef, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { clampDim, resizeSeats } from '../../domain/seating'
import type { SeatingPersist, SeatName } from '../state'

interface SeatingWidgetProps {
  state: SeatingPersist
  onChange: (next: SeatingPersist) => void
}

export function SeatingWidget({ state, onChange }: SeatingWidgetProps) {
  const { t } = useTranslation()
  const idPrefix = useId()
  const counter = useRef(0)
  const [draft, setDraft] = useState('')
  const [activeName, setActiveName] = useState<string | null>(null)

  const { rows, cols, names, seats } = state
  const nameById = (id: string | null) => names.find((n) => n.id === id) ?? null

  function addName(event: FormEvent) {
    event.preventDefault()
    const name = draft.trim()
    if (!name) return
    onChange({ ...state, names: [...names, { id: `${idPrefix}-${counter.current++}`, name }] })
    setDraft('')
  }

  function removeName(id: string) {
    onChange({
      ...state,
      names: names.filter((n) => n.id !== id),
      seats: seats.map((seat) => (seat === id ? null : seat)),
    })
    if (activeName === id) setActiveName(null)
  }

  function setDimension(dim: 'rows' | 'cols', value: number) {
    const next = clampDim(value)
    const newRows = dim === 'rows' ? next : rows
    const newCols = dim === 'cols' ? next : cols
    onChange({ ...state, rows: newRows, cols: newCols, seats: resizeSeats(seats, rows, cols, newRows, newCols) })
  }

  function seatClick(index: number) {
    const current = seats[index]
    if (current) {
      // Clear an occupied seat.
      onChange({ ...state, seats: seats.map((s, i) => (i === index ? null : s)) })
      return
    }
    if (!activeName) return
    // Place the active name here, removing it from any previous seat.
    onChange({
      ...state,
      seats: seats.map((s, i) => (i === index ? activeName : s === activeName ? null : s)),
    })
  }

  const seatedIds = new Set(seats.filter((s): s is string => s !== null))

  return (
    <div className="seating">
      <div className="seating__dims" role="group" aria-label={t('seating.sizeLabel')}>
        <label>
          {t('seating.rows')}
          <input
            type="number"
            min={1}
            max={12}
            value={rows}
            onChange={(e) => setDimension('rows', Number(e.target.value))}
          />
        </label>
        <label>
          {t('seating.cols')}
          <input
            type="number"
            min={1}
            max={12}
            value={cols}
            onChange={(e) => setDimension('cols', Number(e.target.value))}
          />
        </label>
      </div>

      <form className="seating__add" onSubmit={addName}>
        <label className="seating__add-label" htmlFor={`${idPrefix}-draft`}>
          {t('seating.newLabel')}
        </label>
        <div className="seating__add-row">
          <input
            id={`${idPrefix}-draft`}
            type="text"
            value={draft}
            placeholder={t('seating.placeholder')}
            onChange={(e) => setDraft(e.target.value)}
          />
          <button type="submit">{t('seating.add')}</button>
        </div>
      </form>

      {names.length > 0 && (
        <div className="seating__pool" role="group" aria-label={t('seating.poolLabel')}>
          {names.map((seatName: SeatName) => (
            <span key={seatName.id} className="seating__pool-item">
              <button
                type="button"
                className={`seating__name${activeName === seatName.id ? ' seating__name--active' : ''}`}
                aria-pressed={activeName === seatName.id}
                onClick={() => setActiveName(activeName === seatName.id ? null : seatName.id)}
              >
                {seatName.name}
                {seatedIds.has(seatName.id) && <span className="seating__seated" aria-hidden="true"> ✓</span>}
              </button>
              <button
                type="button"
                className="seating__name-remove"
                aria-label={t('seating.remove', { name: seatName.name })}
                onClick={() => removeName(seatName.id)}
              >
                <span aria-hidden="true">×</span>
              </button>
            </span>
          ))}
        </div>
      )}

      <div
        className="seating__grid"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        role="group"
        aria-label={t('seating.gridLabel')}
      >
        {seats.map((seat, index) => {
          const occupant = nameById(seat)
          return (
            <button
              key={index}
              type="button"
              className={`seating__seat${occupant ? ' seating__seat--filled' : ''}`}
              aria-label={t('seating.seat', {
                number: index + 1,
                name: occupant ? occupant.name : t('seating.free'),
              })}
              onClick={() => seatClick(index)}
            >
              {occupant ? occupant.name : ''}
            </button>
          )
        })}
      </div>
    </div>
  )
}

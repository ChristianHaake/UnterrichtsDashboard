import { type ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import type { SocialForm, SymbolsPersist } from '../state'

const FORMS: { id: SocialForm; icon: ReactElement }[] = [
  {
    id: 'silent',
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="16" r="8" fill="currentColor" />
        <path d="M10 40c0-8 6-14 14-14s14 6 14 14z" fill="currentColor" />
        <path d="M30 8l10 32" stroke="var(--surface)" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'whisper',
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="16" r="8" fill="currentColor" />
        <path d="M10 40c0-8 6-14 14-14s14 6 14 14z" fill="currentColor" />
        <path d="M36 14c3 3 3 7 0 10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'partner',
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="16" cy="16" r="7" fill="currentColor" />
        <circle cx="32" cy="16" r="7" fill="currentColor" />
        <path d="M4 40c0-7 5-12 12-12s12 5 12 12z" fill="currentColor" />
        <path d="M20 40c0-7 5-12 12-12s12 5 12 12z" fill="currentColor" opacity="0.7" />
      </svg>
    ),
  },
  {
    id: 'group',
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="14" cy="14" r="6" fill="currentColor" />
        <circle cx="34" cy="14" r="6" fill="currentColor" />
        <circle cx="24" cy="30" r="6" fill="currentColor" />
        <circle cx="24" cy="22" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
]

interface SymbolsWidgetProps {
  state: SymbolsPersist
  onChange: (next: SymbolsPersist) => void
}

export function SymbolsWidget({ state, onChange }: SymbolsWidgetProps) {
  const { t } = useTranslation()
  const active = state.active

  return (
    <div className="symbols">
      <p className="symbols__current" role="status" aria-live="polite">
        {t(`symbols.${active}`)}
      </p>
      <div className="symbols__grid" role="group" aria-label={t('symbols.groupLabel')}>
        {FORMS.map(({ id, icon }) => (
          <button
            key={id}
            type="button"
            className={`symbols__item${active === id ? ' symbols__item--active' : ''}`}
            aria-pressed={active === id}
            onClick={() => onChange({ active: id })}
          >
            <span className="symbols__icon">{icon}</span>
            <span className="symbols__label">{t(`symbols.${id}`)}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

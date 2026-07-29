import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import type { TextPersist } from '../state'

interface TextWidgetProps {
  state: TextPersist
  onChange: (next: TextPersist) => void
}

export function TextWidget({ state, onChange }: TextWidgetProps) {
  const { t } = useTranslation()
  const labelId = useId()

  return (
    <div className="text-widget">
      <label className="text-widget__label" htmlFor={labelId}>
        {t('text.label')}
      </label>
      <textarea
        id={labelId}
        className="text-widget__area"
        value={state.value}
        placeholder={t('text.placeholder')}
        onChange={(event) => onChange({ value: event.target.value })}
        rows={4}
      />
    </div>
  )
}

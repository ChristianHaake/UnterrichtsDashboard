import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'

export function TextWidget() {
  const { t } = useTranslation()
  const [value, setValue] = useState('')
  const labelId = useId()

  return (
    <div className="text-widget">
      <label className="text-widget__label" htmlFor={labelId}>
        {t('text.label')}
      </label>
      <textarea
        id={labelId}
        className="text-widget__area"
        value={value}
        placeholder={t('text.placeholder')}
        onChange={(event) => setValue(event.target.value)}
        rows={4}
      />
    </div>
  )
}

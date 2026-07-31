import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import type { WidgetKind } from './types'
import { MANIFESTS } from './manifest'

interface WidgetHostProps {
  kind: WidgetKind
  state: unknown
  onChange: (next: unknown) => void
}

export function WidgetHost({ kind, state, onChange }: WidgetHostProps) {
  const { t } = useTranslation()
  const { Lazy } = MANIFESTS[kind]
  return (
    <Suspense fallback={<p className="widget-loading">{t('widgets.loading')}</p>}>
      <Lazy state={state} onChange={onChange} />
    </Suspense>
  )
}

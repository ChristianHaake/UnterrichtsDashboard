import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export function Dashboard() {
  const { t } = useTranslation()

  useEffect(() => {
    document.title = 'UnterrichtsDashboard'
  }, [])

  return (
    <section className="dashboard" aria-label={t('dashboard.regionLabel')}>
      <h1 className="dashboard__title">{t('dashboard.title')}</h1>
      <div className="dashboard__empty">
        <p>{t('dashboard.emptyTitle')}</p>
        <p className="dashboard__empty-hint">{t('dashboard.emptyHint')}</p>
      </div>
    </section>
  )
}

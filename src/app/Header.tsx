import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from './LanguageSwitcher'

export function Header() {
  const { t } = useTranslation()

  return (
    <header className="app-header">
      <div className="app-header__identity">
        <Link to="/" className="app-header__brand">
          UnterrichtsDashboard
        </Link>
        <p className="app-header__tagline">{t('app.tagline')}</p>
      </div>
      <div className="app-header__meta">
        <p className="app-header__local" role="note">
          {t('app.localProcessing')}
        </p>
        <LanguageSwitcher />
      </div>
    </header>
  )
}

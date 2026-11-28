import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export function SupportPage() {
  const { t } = useTranslation()

  const title = t('support.title')

  useEffect(() => {
    const previousTitle = document.title
    document.title = title

    return () => {
      document.title = previousTitle
    }
  }, [title])

  return (
    <article className="content-article support-page">
      <h1>{title}</h1>
      <p>{t('support.intro')}</p>
      <a
        className="support-link"
        href="https://buymeacoffee.com/Haake"
        target="_blank"
        rel="noopener noreferrer"
        aria-describedby="support-privacy"
      >
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3" /></svg>
        {t('support.coffee')}
      </a>
      <p id="support-privacy">{t('support.privacy')}</p>
      <h2>{t('support.feedback')}</h2>
      <div className="support-page__links">
        <a
          href="https://haak3.atlassian.net/jira/software/form/69a50efc-0474-445e-8f01-66eb6b747cc1"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('support.bug')}
        </a>
        <a
          href="https://haak3.atlassian.net/jira/software/form/50d4fc51-bff4-4e21-b46e-8fd987b90d24"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('support.idea')}
        </a>
        <a href="mailto:apps@haak3.de?subject=UnterrichtsDashboard%20Feedback">{t('support.email')}</a>
      </div>
      <Link to="/" className="support-page__back">{t('content.back')}</Link>
    </article>
  )
}

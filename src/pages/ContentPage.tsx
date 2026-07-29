import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import MarkdownIt from 'markdown-it'
import { CONTENT, type ContentSlug } from '../content'

// html: false excludes raw HTML from the source, satisfying the standard's
// requirement to disable or sanitize unsafe HTML in Markdown content.
const md = new MarkdownIt({ html: false, linkify: true })

interface ContentPageProps {
  slug: ContentSlug
  notFound?: boolean
}

export function ContentPage({ slug, notFound = false }: ContentPageProps) {
  const { t } = useTranslation()
  const html = useMemo(() => md.render(CONTENT[slug]), [slug])

  useEffect(() => {
    document.title = `${t(`content.${slug}`)} · UnterrichtsDashboard`
  }, [slug, t])

  return (
    <div className="content-page">
      <Link to="/" className="content-page__back">
        ← {t('content.back')}
      </Link>
      {notFound && (
        <p className="content-page__notice" role="status">
          {t('content.notFound')}
        </p>
      )}
      <article
        className="content-article"
        lang="de"
        // Content is our own build-time Markdown rendered with raw HTML disabled.
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}

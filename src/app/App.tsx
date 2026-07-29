import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Header } from './Header'
import { Footer } from './Footer'
import { Dashboard } from '../pages/Dashboard'
import { ContentPage } from '../pages/ContentPage'

export function App() {
  const { i18n } = useTranslation()

  useEffect(() => {
    document.documentElement.lang = i18n.language
  }, [i18n.language])

  return (
    <div className="app-shell">
      <Header />
      <main id="main" className="app-main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/hilfe" element={<ContentPage slug="hilfe" />} />
          <Route path="/datenschutz" element={<ContentPage slug="datenschutz" />} />
          <Route path="/impressum" element={<ContentPage slug="impressum" />} />
          <Route path="/ueber" element={<ContentPage slug="ueber" />} />
          <Route path="*" element={<ContentPage slug="hilfe" notFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

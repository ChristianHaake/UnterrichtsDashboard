import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { formatTemperature, weatherCodeToCondition } from '../../domain/weather'
import type { MorningBoardPersist } from '../state'
import { fetchCurrentWeather, geocode } from './weatherApi'

const STALE_MS = 30 * 60_000

interface MorningBoardWidgetProps {
  state: MorningBoardPersist
  onChange: (next: MorningBoardPersist) => void
}

export function MorningBoardWidget({ state, onChange }: MorningBoardWidgetProps) {
  const { t, i18n } = useTranslation()
  const wordId = useId()
  const searchId = useId()
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState(false)
  const stateRef = useRef(state)
  stateRef.current = state

  const { location, weather, word } = state

  const dateLabel = new Date().toLocaleDateString(i18n.language, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  async function refresh(loc: { lat: number; lon: number }) {
    setLoading(true)
    setFailed(false)
    const result = await fetchCurrentWeather(loc.lat, loc.lon)
    setLoading(false)
    if (!result) {
      setFailed(true)
      return
    }
    onChange({ ...stateRef.current, weather: { ...result, fetchedAt: Date.now() } })
  }

  // Refresh on location change if the cached snapshot is missing or stale.
  useEffect(() => {
    if (!location) return
    const stale = !weather || Date.now() - weather.fetchedAt > STALE_MS
    if (stale) void refresh(location)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location?.lat, location?.lon])

  async function onSearch(event: FormEvent) {
    event.preventDefault()
    const query = search.trim()
    if (!query) return
    setLoading(true)
    setFailed(false)
    const found = await geocode(query, i18n.language)
    if (!found) {
      setLoading(false)
      setFailed(true)
      return
    }
    setSearch('')
    onChange({ ...stateRef.current, location: found, weather: null })
    await refresh(found)
  }

  const condition = weather ? weatherCodeToCondition(weather.code) : null

  return (
    <div className="morning">
      <p className="morning__date">{dateLabel}</p>

      <section className="morning__weather" aria-label={t('morningboard.weatherLabel')}>
        {location ? (
          <>
            <div className="morning__weather-row">
              <span className="morning__place">{location.name}</span>
              <button
                type="button"
                className="morning__refresh"
                onClick={() => void refresh(location)}
                disabled={loading}
              >
                {t('morningboard.refresh')}
              </button>
            </div>
            <p className="morning__temp" role="status" aria-live="polite">
              {loading
                ? t('morningboard.loading')
                : weather
                  ? `${formatTemperature(weather.tempC)} · ${t(`morningboard.conditions.${condition}`)}`
                  : t('morningboard.unavailable')}
            </p>
            {failed && weather && <p className="morning__note">{t('morningboard.offlineCached')}</p>}
          </>
        ) : (
          <form className="morning__search" onSubmit={onSearch}>
            <label htmlFor={searchId}>{t('morningboard.locationLabel')}</label>
            <div className="morning__search-row">
              <input
                id={searchId}
                type="text"
                value={search}
                placeholder={t('morningboard.searchPlaceholder')}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="submit" disabled={loading}>
                {t('morningboard.search')}
              </button>
            </div>
            {failed && (
              <p className="morning__note" role="alert">
                {t('morningboard.notFound')}
              </p>
            )}
          </form>
        )}
      </section>

      <section className="morning__word">
        <label htmlFor={wordId}>{t('morningboard.wordLabel')}</label>
        <input
          id={wordId}
          type="text"
          value={word}
          placeholder={t('morningboard.wordPlaceholder')}
          onChange={(e) => onChange({ ...state, word: e.target.value })}
        />
      </section>
    </div>
  )
}

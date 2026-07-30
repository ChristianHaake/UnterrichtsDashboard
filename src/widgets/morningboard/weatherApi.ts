import type { GeoLocation } from '../state'

// Open-Meteo: free, no API key, CORS-enabled, no cookies. Only the queried
// location (city name or coordinates) is sent. Both hosts are allowlisted in
// the production CSP connect-src and documented in the privacy page.
const GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'

export async function geocode(query: string, language = 'de'): Promise<GeoLocation | null> {
  const url = `${GEOCODE_URL}?name=${encodeURIComponent(query)}&count=1&language=${language}&format=json`
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const data: unknown = await res.json()
    const result = (data as { results?: unknown[] })?.results?.[0] as
      | { name?: unknown; admin1?: unknown; latitude?: unknown; longitude?: unknown }
      | undefined
    if (!result || typeof result.latitude !== 'number' || typeof result.longitude !== 'number') {
      return null
    }
    const name =
      typeof result.name === 'string'
        ? typeof result.admin1 === 'string'
          ? `${result.name}, ${result.admin1}`
          : result.name
        : query
    return { name, lat: result.latitude, lon: result.longitude }
  } catch {
    return null
  }
}

export async function fetchCurrentWeather(
  lat: number,
  lon: number,
): Promise<{ tempC: number; code: number } | null> {
  const url = `${FORECAST_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const data = (await res.json()) as { current?: { temperature_2m?: unknown; weather_code?: unknown } }
    const current = data?.current
    if (!current || typeof current.temperature_2m !== 'number') return null
    const code = typeof current.weather_code === 'number' ? current.weather_code : -1
    return { tempC: current.temperature_2m, code }
  } catch {
    return null
  }
}

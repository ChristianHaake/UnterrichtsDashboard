export type WeatherCondition = 'clear' | 'cloudy' | 'fog' | 'rain' | 'snow' | 'thunder' | 'unknown'

/** Map a WMO weather interpretation code to a coarse condition bucket. */
export function weatherCodeToCondition(code: number): WeatherCondition {
  if (code === 0) return 'clear'
  if (code >= 1 && code <= 3) return 'cloudy'
  if (code === 45 || code === 48) return 'fog'
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'rain'
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snow'
  if (code >= 95 && code <= 99) return 'thunder'
  return 'unknown'
}

/** Round to a whole degree and append the unit. */
export function formatTemperature(tempC: number): string {
  return `${Math.round(tempC)} °C`
}

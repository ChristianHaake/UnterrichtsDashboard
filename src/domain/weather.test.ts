import { describe, expect, it } from 'vitest'
import { formatTemperature, weatherCodeToCondition } from './weather'

describe('weatherCodeToCondition', () => {
  it('maps representative WMO codes to buckets', () => {
    expect(weatherCodeToCondition(0)).toBe('clear')
    expect(weatherCodeToCondition(2)).toBe('cloudy')
    expect(weatherCodeToCondition(48)).toBe('fog')
    expect(weatherCodeToCondition(61)).toBe('rain')
    expect(weatherCodeToCondition(81)).toBe('rain')
    expect(weatherCodeToCondition(73)).toBe('snow')
    expect(weatherCodeToCondition(86)).toBe('snow')
    expect(weatherCodeToCondition(96)).toBe('thunder')
    expect(weatherCodeToCondition(123)).toBe('unknown')
  })
})

describe('formatTemperature', () => {
  it('rounds to a whole degree', () => {
    expect(formatTemperature(12.4)).toBe('12 °C')
    expect(formatTemperature(-3.6)).toBe('-4 °C')
  })
})

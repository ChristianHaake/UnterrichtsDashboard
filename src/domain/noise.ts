/** Root-mean-square amplitude of time-domain samples (each in [-1, 1]). */
export function computeRms(samples: Float32Array): number {
  if (samples.length === 0) return 0
  let sum = 0
  for (let i = 0; i < samples.length; i++) sum += samples[i] * samples[i]
  return Math.sqrt(sum / samples.length)
}

/**
 * Map an RMS value to a relative display level in [0, 1]. This is a relative
 * indicator, not a calibrated sound-pressure measurement — browser microphones
 * cannot be reliably calibrated (see docs/standard-conformance.md).
 */
export function toDisplayLevel(rms: number, gain = 4): number {
  return Math.min(1, Math.max(0, rms * gain))
}

export type NoiseLevel = 'quiet' | 'ok' | 'loud'

/** Classify a display level against the teacher-set threshold. */
export function classifyLevel(level: number, threshold: number): NoiseLevel {
  if (level >= threshold) return 'loud'
  if (level >= threshold * 0.6) return 'ok'
  return 'quiet'
}

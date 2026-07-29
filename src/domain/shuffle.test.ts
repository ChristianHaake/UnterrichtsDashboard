import { describe, expect, it } from 'vitest'
import { shuffle } from './shuffle'

describe('shuffle', () => {
  it('does not mutate the input array', () => {
    const input = [1, 2, 3, 4]
    const copy = [...input]
    shuffle(input)
    expect(input).toEqual(copy)
  })

  it('preserves all elements (is a permutation)', () => {
    const input = ['a', 'b', 'c', 'd', 'e']
    const result = shuffle(input, () => 0.42)
    expect([...result].sort()).toEqual([...input].sort())
    expect(result).toHaveLength(input.length)
  })

  it('is deterministic for a fixed random source', () => {
    const input = [1, 2, 3, 4, 5]
    const seeded = () => 0.7
    expect(shuffle(input, seeded)).toEqual(shuffle(input, seeded))
  })

  it('produces a roughly uniform distribution over positions', () => {
    // Each element should land in each position with non-trivial frequency.
    const input = [0, 1, 2]
    const counts = input.map(() => input.map(() => 0))
    let seed = 1
    const rng = () => {
      // Simple LCG for reproducible pseudo-randomness without external deps.
      seed = (seed * 1103515245 + 12345) & 0x7fffffff
      return seed / 0x7fffffff
    }
    const runs = 6000
    for (let i = 0; i < runs; i++) {
      const out = shuffle(input, rng)
      out.forEach((value, position) => {
        counts[value][position]++
      })
    }
    for (const row of counts) {
      for (const count of row) {
        expect(count).toBeGreaterThan(runs / input.length / 2)
      }
    }
  })
})

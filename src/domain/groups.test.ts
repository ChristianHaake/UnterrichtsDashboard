import { describe, expect, it } from 'vitest'
import { makeGroups } from './groups'

const names = ['a', 'b', 'c', 'd', 'e']

describe('makeGroups', () => {
  it('partitions all items exactly once', () => {
    const groups = makeGroups(names, 2, () => 0)
    expect(groups.flat().sort()).toEqual([...names].sort())
  })

  it('respects the maximum group size, last group may be smaller', () => {
    const groups = makeGroups(names, 2, () => 0)
    expect(groups.map((g) => g.length)).toEqual([2, 2, 1])
  })

  it('returns a single group when size exceeds the count', () => {
    expect(makeGroups(names, 99, () => 0)).toHaveLength(1)
  })

  it('clamps a non-positive size to 1', () => {
    const groups = makeGroups(names, 0, () => 0)
    expect(groups).toHaveLength(names.length)
    expect(groups.every((g) => g.length === 1)).toBe(true)
  })

  it('does not mutate the input', () => {
    const input = [...names]
    makeGroups(input, 2)
    expect(input).toEqual(names)
  })

  it('returns no groups for an empty list', () => {
    expect(makeGroups([], 3)).toEqual([])
  })
})

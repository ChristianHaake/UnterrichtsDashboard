import { shuffle } from './shuffle'

/**
 * Randomly partition items into groups of at most `groupSize`. Returns a new
 * array of groups; the input is not mutated. `random` is injectable for tests.
 */
export function makeGroups<T>(
  items: readonly T[],
  groupSize: number,
  random: () => number = Math.random,
): T[][] {
  const size = Math.max(1, Math.floor(groupSize))
  const shuffled = shuffle(items, random)
  const groups: T[][] = []
  for (let i = 0; i < shuffled.length; i += size) {
    groups.push(shuffled.slice(i, i + size))
  }
  return groups
}

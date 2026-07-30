export const MIN_DIM = 1
export const MAX_DIM = 12

export function clampDim(value: number): number {
  if (!Number.isFinite(value)) return MIN_DIM
  return Math.min(MAX_DIM, Math.max(MIN_DIM, Math.floor(value)))
}

/**
 * Resize a seat grid, preserving assignments that still fit. Returns a new
 * array of length `newRows * newCols`; extra seats are empty (null), and seats
 * outside the new bounds are dropped.
 */
export function resizeSeats(
  seats: readonly (string | null)[],
  oldRows: number,
  oldCols: number,
  newRows: number,
  newCols: number,
): (string | null)[] {
  const result: (string | null)[] = new Array(newRows * newCols).fill(null)
  const rows = Math.min(oldRows, newRows)
  const cols = Math.min(oldCols, newCols)
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      result[r * newCols + c] = seats[r * oldCols + c] ?? null
    }
  }
  return result
}

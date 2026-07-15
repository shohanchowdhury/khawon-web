/** Fisher–Yates shuffle; returns a new array. */
export function shuffleArray<T>(items: readonly T[]): T[] {
  const shuffled = [...items]
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const current = shuffled[i]
    const swap = shuffled[j]
    if (current !== undefined && swap !== undefined) {
      shuffled[i] = swap
      shuffled[j] = current
    }
  }
  return shuffled
}

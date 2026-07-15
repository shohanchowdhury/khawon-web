/** Pick one random image URL from a pool (e.g. product images for a sub type). */
export function pickRandomImageUrl(urls: string[]): string | null {
  const filtered = urls.filter(Boolean)
  if (filtered.length === 0) return null
  const index = Math.floor(Math.random() * filtered.length)
  return filtered[index] ?? null
}

import type { CanonicalDishMatch } from '@/types/api'

const FEATURED_LIMIT = 6
export const POPULAR_HOME_LIMIT = 18

export type PopularPicksStrategy = 'random' | 'top_reviewed'

export function getTopRatedDishes(
  dishes: CanonicalDishMatch[],
  limit = FEATURED_LIMIT,
): CanonicalDishMatch[] {
  return [...dishes]
    .filter((dish) => dish.average_rating != null)
    .sort((a, b) => (b.average_rating ?? 0) - (a.average_rating ?? 0))
    .slice(0, limit)
}

function shuffleDishes(dishes: CanonicalDishMatch[]): CanonicalDishMatch[] {
  const shuffled = [...dishes]
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const current = shuffled[i]
    const swap = shuffled[j]
    if (current && swap) {
      shuffled[i] = swap
      shuffled[j] = current
    }
  }
  return shuffled
}

/** Placeholder until a real popularity signal exists — swap strategy in one place. */
export function getPopularPicks(
  dishes: CanonicalDishMatch[],
  limit = FEATURED_LIMIT,
  excludeIds: Set<number> = new Set(),
  strategy: PopularPicksStrategy = 'random',
): CanonicalDishMatch[] {
  const pool = dishes.filter((dish) => !excludeIds.has(dish.id))
  if (pool.length === 0) return []

  if (strategy === 'top_reviewed') {
    return [...pool]
      .sort((a, b) => b.restaurant_count - a.restaurant_count)
      .slice(0, limit)
  }

  return shuffleDishes(pool).slice(0, limit)
}

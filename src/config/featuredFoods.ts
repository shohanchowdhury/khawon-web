import type { FoodTypeOut, FoodTypePopularOut } from '@/types/api'
import type { PosterFood, PosterFoodConfig } from '@/types/domain/featuredFood'

export const HOME_CAROUSEL_LIMIT = 5

export const HOME_CAROUSEL_EXCLUDE = ['Beef Tehari'] as const

export const POSTER_FOODS = [
  {
    name: 'Ramen',
    fallbackImage: '/featured/ramen.webp',
    accent: '#ef233c',
    slug: 'ramen',
  },
  {
    name: 'Biriyani',
    fallbackImage: '/featured/biriyani.webp',
    accent: '#d80032',
    slug: 'biriyani',
  },
  {
    name: 'Fuchka',
    fallbackImage: '/featured/fuchka.webp',
    accent: '#ef233c',
    slug: 'fuchka',
  },
  {
    name: 'Pizza',
    fallbackImage: '/featured/pizza.webp',
    accent: '#d80032',
    slug: 'pizza',
  },
] as const satisfies readonly PosterFoodConfig[]

export function resolvePosterFoods(
  allFoods: FoodTypeOut[] | null | undefined,
  enrichedFoods: FoodTypePopularOut[] = [],
): PosterFood[] {
  const byName = new Map(
    (allFoods ?? []).map((food) => [food.name.toLowerCase(), food]),
  )
  const statsByName = new Map(
    enrichedFoods.map((food) => [food.name.toLowerCase(), food]),
  )

  return POSTER_FOODS.map((poster) => {
    const match = byName.get(poster.name.toLowerCase())
    const stats = statsByName.get(poster.name.toLowerCase())
    return {
      ...poster,
      id: match?.id ?? stats?.id,
      image_url: match?.image_url ?? stats?.image_url,
      review_count: stats?.review_count ?? 0,
      restaurant_count: stats?.restaurant_count ?? 0,
      average_rating: stats?.average_rating,
    }
  })
}

export function buildCarouselFoods(
  allFoods: FoodTypeOut[] | null | undefined,
  topList: FoodTypePopularOut[] | null | undefined,
): Array<PosterFood | FoodTypePopularOut> {
  const posters = resolvePosterFoods(allFoods, topList ?? [])
  const posterNames = new Set(posters.map((food) => food.name.toLowerCase()))
  const excludeNames = new Set(
    HOME_CAROUSEL_EXCLUDE.map((name) => name.toLowerCase()),
  )
  const rest = (topList ?? []).filter(
    (food) =>
      !posterNames.has(food.name.toLowerCase()) &&
      !excludeNames.has(food.name.toLowerCase()),
  )
  return [...posters, ...rest]
}

export function getFoodDisplayImage(
  food: { image_url?: string | null; fallbackImage?: string },
): string | null {
  return food.image_url || food.fallbackImage || null
}

export function isPosterFood(name: string | null | undefined): boolean {
  return POSTER_FOODS.some(
    (poster) => poster.name.toLowerCase() === (name ?? '').toLowerCase(),
  )
}

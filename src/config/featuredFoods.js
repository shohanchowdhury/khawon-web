export const HOME_CAROUSEL_LIMIT = 5

export const HOME_CAROUSEL_EXCLUDE = ['Beef Tehari']

export const POSTER_FOODS = [
  {
    name: 'Ramen',
    fallbackImage: '/featured/ramen.webp',
    accent: '#ea580c',
    slug: 'ramen',
  },
  {
    name: 'Biriyani',
    fallbackImage: '/featured/biriyani.webp',
    accent: '#dc2626',
    slug: 'biriyani',
  },
  {
    name: 'Fuchka',
    fallbackImage: '/featured/fuchka.webp',
    accent: '#facc15',
    slug: 'fuchka',
  },
  {
    name: 'Pizza',
    fallbackImage: '/featured/pizza.webp',
    accent: '#c2410c',
    slug: 'pizza',
  },
]

export function resolvePosterFoods(allFoods, enrichedFoods = []) {
  const byName = new Map(
    (allFoods || []).map((food) => [food.name.toLowerCase(), food]),
  )
  const statsByName = new Map(
    (enrichedFoods || []).map((food) => [food.name.toLowerCase(), food]),
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

export function buildCarouselFoods(allFoods, topList) {
  const posters = resolvePosterFoods(allFoods, topList)
  const posterNames = new Set(posters.map((food) => food.name.toLowerCase()))
  const excludeNames = new Set(
    HOME_CAROUSEL_EXCLUDE.map((name) => name.toLowerCase()),
  )
  const rest = (topList || []).filter(
    (food) =>
      !posterNames.has(food.name.toLowerCase()) &&
      !excludeNames.has(food.name.toLowerCase()),
  )
  return [...posters, ...rest]
}

export function getFoodDisplayImage(food) {
  return food.image_url || food.fallbackImage || null
}

export function isPosterFood(name) {
  return POSTER_FOODS.some(
    (poster) => poster.name.toLowerCase() === (name || '').toLowerCase(),
  )
}

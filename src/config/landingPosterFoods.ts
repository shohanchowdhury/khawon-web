import { POSTER_FOODS } from '@/config/featuredFoods'
import { listFoodTypePosters } from '@/config/foodTypePosters'

const DEFAULT_ACCENT = '#ef233c'

const ACCENT_BY_SLUG = Object.fromEntries(
  POSTER_FOODS.map((food) => [food.slug, food.accent]),
) as Record<string, string>

export interface LandingPosterFood {
  id: string
  slug: string
  name: string
  image: string
  accent: string
}

export function buildLandingPosters(): LandingPosterFood[] {
  return listFoodTypePosters().map((poster) => ({
    id: poster.slug,
    slug: poster.slug,
    name: poster.name,
    image: poster.image,
    accent: ACCENT_BY_SLUG[poster.slug] ?? DEFAULT_ACCENT,
  }))
}

import { requireFoodTypePoster } from '@/config/foodTypePosters'

export interface LandingPosterFood {
  id: string
  image: string
  accent: string
}

/** Landing hero carousel — uses shared food-type-posters assets. */
export const LANDING_POSTER_FOODS = [
  {
    id: 'fuchka',
    image: requireFoodTypePoster('Fuchka'),
    accent: '#ef233c',
  },
  {
    id: 'ramen',
    image: requireFoodTypePoster('Ramen'),
    accent: '#ef233c',
  },
  {
    id: 'burger',
    image: requireFoodTypePoster('Burger'),
    accent: '#d80032',
  },
  {
    id: 'pizza',
    image: requireFoodTypePoster('Pizza'),
    accent: '#d80032',
  },
  {
    id: 'biriyani',
    image: requireFoodTypePoster('Biriyani'),
    accent: '#ef233c',
  },
] as const satisfies readonly LandingPosterFood[]

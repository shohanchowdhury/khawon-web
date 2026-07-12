import type { FoodTypePopularOut } from '../api/foodType'

export interface PosterFoodConfig {
  name: string
  fallbackImage: string
  accent: string
  slug: string
}

export interface PosterFood extends PosterFoodConfig {
  id?: number
  image_url?: string | null
  review_count: number
  restaurant_count: number
  average_rating?: number | null
}

export type CarouselFood = PosterFood | FoodTypePopularOut

export interface FeaturedFoodWithDisplay extends PosterFood {
  id?: number
  image_url?: string | null
}

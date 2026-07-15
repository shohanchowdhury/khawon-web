/** Mirrors khawon-api/schemas.py — DishOut, DishVariationOut, CanonicalDish* */

import type { FoodTypeOut } from './foodType'

export interface DishVariationOut {
  label: string | null
  price_bdt: number | null
}

export interface CuisineOut {
  id: number
  name: string
}

export interface FlavorTagOut {
  id: number
  name: string
}

export interface RestaurantSummaryOut {
  id: number
  name: string
  area: string | null
  address: string | null
  image_url: string | null
  google_place_id: string | null
}

export interface DishOut {
  id: number
  name: string
  description: string | null
  price_bdt: number | null
  image_url: string | null
  is_sold_out: boolean
  is_active: boolean
  category_raw: string | null
  variations: DishVariationOut[] | null
  food_type: FoodTypeOut | null
  canonical_dish_id: number | null
  cuisines: CuisineOut[]
  flavor_tags: FlavorTagOut[]
  restaurant: RestaurantSummaryOut
  average_rating: number | null
  review_count: number
}

export interface CanonicalDishOut {
  id: number
  name: string
  food_type: FoodTypeOut | null
  aliases: string[] | null
  image_url: string | null
}

export interface CanonicalDishMatch extends CanonicalDishOut {
  restaurant_count: number
  dish_count: number
  average_rating: number | null
  min_price_bdt: number | null
  max_price_bdt: number | null
}

export interface DishSearchResult {
  query: string
  canonical_matches: CanonicalDishMatch[]
  total: number
  offset: number
  limit: number
  dishes: DishOut[]
}

export interface DishCompareResult {
  canonical_dish: CanonicalDishOut
  dishes: DishOut[]
  total: number
  offset: number
  limit: number
  average_rating: number | null
  min_price_bdt: number | null
  max_price_bdt: number | null
}

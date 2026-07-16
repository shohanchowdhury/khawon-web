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

import type { RestaurantRatingSource } from './restaurant'

export interface RestaurantSummaryOut {
  id: number
  name: string
  area: string | null
  address: string | null
  image_url: string | null
  google_place_id: string | null
  display_rating: number | null
  display_rating_source: RestaurantRatingSource
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

export interface BrandOut {
  id: number
  name: string
}

export interface BrandDishOut {
  brand: BrandOut
  food_type_id: number | null
  slug: string
  name: string
  description: string | null
  image_url: string | null
  category_raw: string | null
  food_type: FoodTypeOut | null
  cuisines: CuisineOut[]
  flavor_tags: FlavorTagOut[]
  canonical_dish_id: number | null
  price_min_bdt: number
  price_max_bdt: number
  price_varies: boolean
  branch_count: number
  brand_branch_total: number
  is_sold_out_everywhere: boolean
  average_rating: number | null
  review_count: number
}

export interface BrandBranchOut {
  restaurant_id: number
  restaurant_name: string
  area: string | null
  product_id: number
  price_bdt: number
  is_sold_out: boolean
  average_rating: number | null
  review_count: number
}

export interface BrandDishDetailOut extends BrandDishOut {
  branches: BrandBranchOut[]
}

export interface BrandDetailOut {
  id: number
  name: string
  branch_count: number
  branches: RestaurantSummaryOut[]
  display_rating: number | null
  display_rating_source: RestaurantRatingSource
}

export interface DishSearchResult {
  query: string
  canonical_matches: CanonicalDishMatch[]
  total: number
  offset: number
  limit: number
  dishes: BrandDishOut[]
}

export interface DishCompareResult {
  canonical_dish: CanonicalDishOut
  dishes: BrandDishOut[]
  total: number
  offset: number
  limit: number
  average_rating: number | null
  min_price_bdt: number | null
  max_price_bdt: number | null
}

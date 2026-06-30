/** Mirrors khawon-api/schemas.py — SearchResult, FoodDetailResult */

import type { FoodTypeOut, FoodTypePopularOut } from './foodType'
import type { RestaurantOut } from './restaurant'

export interface SearchResult {
  food_type: FoodTypeOut
  restaurants: RestaurantOut[]
}

export interface FoodDetailResult {
  food_type: FoodTypePopularOut
  restaurants: RestaurantOut[]
}

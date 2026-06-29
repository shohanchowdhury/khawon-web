/** Mirrors khawon-api/schemas.py — SearchResult */

import type { FoodTypeOut } from './foodType'
import type { RestaurantOut } from './restaurant'

export interface SearchResult {
  food_type: FoodTypeOut
  restaurants: RestaurantOut[]
}

/** Mirrors khawon-api/schemas.py — FoodDetailResult */

import type { FoodTypePopularOut } from './foodType'
import type { BrandListOut } from './restaurant'

export interface FoodDetailResult {
  food_type: FoodTypePopularOut
  restaurants: BrandListOut[]
}

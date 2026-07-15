import type { FoodTypeOut } from './foodType'

export interface FoodSubTypeOut {
  id: number
  name: string
  food_type_id: number
  dish_count: number
  image_urls: string[]
}

export interface FoodSubTypeListResult {
  food_type: FoodTypeOut
  sub_types: FoodSubTypeOut[]
}

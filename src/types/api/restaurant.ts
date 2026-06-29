/** Mirrors khawon-api/schemas.py — RestaurantOut, RestaurantCreate */

import type { FoodTypeOut } from './foodType'

export interface RestaurantOut {
  id: number
  name: string
  area: string | null
  address: string | null
  phone: string | null
  google_maps_url: string | null
  website_url: string | null
  google_place_id: string | null
  image_url: string | null
  food_types: FoodTypeOut[]
  average_rating: number | null
  review_count: number
}

export interface RestaurantCreatePayload {
  name: string
  area?: string
  address?: string
  phone?: string
  google_maps_url?: string
  website_url?: string
  google_place_id?: string
  google_photo_name?: string
  food_type_ids?: number[]
  image?: File
}

export interface RestaurantPhotoUpdatePayload {
  google_photo_name?: string
  image?: File
}

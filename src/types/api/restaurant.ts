/** Mirrors khawon-api/schemas.py — RestaurantOut, RestaurantCreate */

import type { FoodTypeOut } from './foodType'

export type RestaurantRatingSource = 'khawon' | 'foodpanda' | null

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
  display_rating: number | null
  display_review_count: number
  display_rating_source: RestaurantRatingSource
  match_status?: string | null
  source_restaurant_code?: string | null
  chain_name?: string | null
  chain_code?: string | null
  budget?: number | null
  foodpanda_rating?: number | null
  foodpanda_review_number?: number | null
  raw_cuisines?: string[] | null
  logo_url?: string | null
  latitude?: number | null
  longitude?: number | null
}

export interface RestaurantCreatePayload {
  name: string
  area?: string
  address?: string
  phone?: string
  google_place_id?: string
  google_photo_name?: string
  image?: File
}

export interface RestaurantPhotoUpdatePayload {
  google_photo_name?: string
  image?: File
}

export interface RestaurantCatalogueResult {
  restaurants: RestaurantOut[]
  total: number
  offset: number
  limit: number
}

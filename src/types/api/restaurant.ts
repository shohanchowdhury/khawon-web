/** Mirrors khawon-api/schemas.py — brand browse + legacy branch admin shapes */

import type { FoodTypeOut } from './foodType'

export type RestaurantRatingSource = 'khawon' | 'foodpanda' | null

/** One brand in restaurant browse — id is chain_id everywhere public. */
export interface BrandListOut {
  id: number
  name: string
  branch_count: number
  areas: string[]
  image_url: string | null
  food_types: FoodTypeOut[]
  cuisines: string[]
  display_rating: number | null
  display_rating_source: RestaurantRatingSource
  display_review_count: number
}

/** Legacy branch row shape (admin/contribute via /branches/*). */
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

export interface BranchResolveOut {
  id: number
  chain_id: number
  name: string
  area: string | null
  address: string | null
  phone: string | null
  google_place_id: string | null
  image_url: string | null
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
  restaurants: BrandListOut[]
  total: number
  offset: number
  limit: number
}

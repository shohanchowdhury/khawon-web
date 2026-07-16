/** Mirrors khawon-api/schemas.py — brand browse + branch admin shapes */

import type { FoodTypeOut } from './foodType'
import type { RestaurantSummaryOut } from './dish'

export type RestaurantRatingSource = 'khawon' | 'foodpanda' | null

/** One brand in restaurant browse — slug is the URL key; id is chain_id (POST only). */
export interface BrandListOut {
  id: number
  slug: string
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

export interface BranchResolveOut {
  id: number
  chain_id: number
  chain_slug: string
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

/** Paginated brand browse — response of GET /restaurants. */
export interface RestaurantCatalogueResult {
  restaurants: BrandListOut[]
  total: number
  offset: number
  limit: number
}

/** Paginated branch list — response of GET /branches (manage screens). */
export interface BranchListResult {
  branches: RestaurantSummaryOut[]
  total: number
  offset: number
  limit: number
}

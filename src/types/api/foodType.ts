/** Mirrors khawon-api/schemas.py — FoodTypeOut, FoodTypePopularOut, FoodImageSearch* */

export interface FoodTypeOut {
  id: number
  name: string
  description: string | null
  image_url: string | null
  parent_id?: number | null
}

export interface FoodTypePopularOut extends FoodTypeOut {
  restaurant_count: number
  review_count: number
  average_rating: number | null
}

export interface FoodImageSearchResult {
  id: string
  image_url: string
  thumbnail_url: string
  title: string | null
  source_url: string | null
}

export interface FoodImageSearchResponse {
  photos: FoodImageSearchResult[]
  search_help: string | null
}

export interface FoodTypeCreatePayload {
  name: string
  description?: string
  image?: File
  ai_image_id?: string
}

export interface FoodTypeUpdatePayload {
  name: string
  description?: string
  image?: File
  ai_image_id?: string
}

export interface FoodTypePhotoUpdatePayload {
  ai_image_id?: string
  image?: File
}

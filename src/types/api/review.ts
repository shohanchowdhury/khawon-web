/** Mirrors khawon-api/schemas.py — ReviewOut, ReviewCreate */

export interface ReviewCreate {
  dish_id: number
  rating: number
  comment?: string
}

export interface ReviewOut {
  id: number
  dish_id: number
  restaurant_id: number
  dish_name: string | null
  username: string
  rating: number
  comment: string | null
  is_verified: boolean
  created_at: string
}

export interface ReviewListResult {
  reviews: ReviewOut[]
  total: number
  offset: number
  limit: number
}

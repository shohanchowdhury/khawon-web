/** Mirrors khawon-api/schemas.py — RestaurantReview* */

export interface RestaurantReviewCreate {
  branch_id: number
  rating: number
  comment?: string
}

export interface RestaurantReviewOut {
  id: number
  restaurant_id: number
  branch_name: string | null
  branch_area: string | null
  username: string
  rating: number
  comment: string | null
  is_verified: boolean
  created_at: string
}

export interface RestaurantReviewListResult {
  reviews: RestaurantReviewOut[]
  total: number
  offset: number
  limit: number
}

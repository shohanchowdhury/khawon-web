/** Mirrors khawon-api/schemas.py — ReviewOut, ReviewCreate */

export interface ReviewCreate {
  restaurant_id: number
  food_type_id: number
  rating: number
  comment?: string
}

export interface ReviewOut {
  id: number
  restaurant_id: number
  food_type_id: number
  reviewer_name: string | null
  rating: number
  comment: string | null
  created_at: string
}

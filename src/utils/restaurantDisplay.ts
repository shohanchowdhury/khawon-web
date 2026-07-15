import type { RestaurantOut, RestaurantRatingSource } from '@/types/api'

export interface RestaurantDisplayRating {
  rating: number | null
  reviewCount: number
  source: RestaurantRatingSource
}

export function getRestaurantDisplayRating(
  restaurant: Pick<
    RestaurantOut,
    'display_rating' | 'display_review_count' | 'display_rating_source' | 'average_rating' | 'review_count'
  >,
): RestaurantDisplayRating {
  return {
    rating: restaurant.display_rating ?? restaurant.average_rating,
    reviewCount: restaurant.display_review_count ?? restaurant.review_count,
    source: restaurant.display_rating_source ?? null,
  }
}

export function getGoogleMapsUrl(
  restaurant: Pick<RestaurantOut, 'google_maps_url' | 'google_place_id'>,
): string | null {
  if (restaurant.google_maps_url) {
    return restaurant.google_maps_url
  }
  if (restaurant.google_place_id) {
    const params = new URLSearchParams({
      api: '1',
      query_place_id: restaurant.google_place_id,
    })
    return `https://www.google.com/maps/search/?${params.toString()}`
  }
  return null
}

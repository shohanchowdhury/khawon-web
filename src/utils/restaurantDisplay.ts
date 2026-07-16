import type { BrandListOut, RestaurantRatingSource } from '@/types/api'

export interface RestaurantDisplayRating {
  rating: number | null
  reviewCount: number
  source: RestaurantRatingSource
}

type RatingFields = {
  display_rating?: number | null
  display_review_count?: number
  display_rating_source?: RestaurantRatingSource
  average_rating?: number | null
  review_count?: number
}

export function getRestaurantDisplayRating(
  restaurant: RatingFields,
): RestaurantDisplayRating {
  return {
    rating: restaurant.display_rating ?? restaurant.average_rating ?? null,
    reviewCount: restaurant.display_review_count ?? restaurant.review_count ?? 0,
    source: restaurant.display_rating_source ?? null,
  }
}

export function getBrandListDisplayRating(brand: BrandListOut): RestaurantDisplayRating {
  return {
    rating: brand.display_rating,
    reviewCount: brand.display_review_count,
    source: brand.display_rating_source,
  }
}

export function getGoogleMapsUrl(
  place: { google_maps_url?: string | null; google_place_id?: string | null },
): string | null {
  if (place.google_maps_url) {
    return place.google_maps_url
  }
  if (place.google_place_id) {
    const params = new URLSearchParams({
      api: '1',
      query_place_id: place.google_place_id,
    })
    return `https://www.google.com/maps/search/?${params.toString()}`
  }
  return null
}

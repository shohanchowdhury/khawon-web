import type { RestaurantOut } from '@/types/api'
import { getRestaurantDisplayRating } from '@/utils/restaurantDisplay'

export interface RestaurantReviewHighlight {
  quote: string
  average_rating: number | null
  review_count: number
}

const MOCK_QUOTES_BY_RESTAURANT_ID: Record<number, string> = {
  1: 'Rich, aromatic broth and tender chashu — easily the best bowl in Gulshan.',
  2: 'Quick service and a solid tonkotsu base. Noodles had good bite every time.',
  3: 'Cozy spot with consistent ramen. The spicy miso option is worth trying.',
}

const FALLBACK_QUOTES_WITH_REVIEWS = [
  'Regulars praise the flavor and portion size for the price.',
  'A reliable pick — reviewers mention friendly staff and quick turnaround.',
  'Well liked locally; most comments highlight freshness and consistency.',
]

export function getMockReviewHighlight(
  restaurant: RestaurantOut,
  foodName: string,
): RestaurantReviewHighlight {
  const display = getRestaurantDisplayRating(restaurant)
  const overrideQuote = MOCK_QUOTES_BY_RESTAURANT_ID[restaurant.id]

  if (overrideQuote) {
    return {
      quote: overrideQuote,
      average_rating: display.rating,
      review_count: display.reviewCount,
    }
  }

  if (display.reviewCount > 0) {
    const quoteIndex = restaurant.id % FALLBACK_QUOTES_WITH_REVIEWS.length
    const quote = FALLBACK_QUOTES_WITH_REVIEWS.at(quoteIndex) ?? 'Well liked locally.'
    return {
      quote,
      average_rating: display.rating,
      review_count: display.reviewCount,
    }
  }

  return {
    quote: `No reviews yet for ${foodName} here.`,
    average_rating: null,
    review_count: 0,
  }
}

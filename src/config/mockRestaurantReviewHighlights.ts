import type { BrandListOut } from '@/types/api'

interface MockReviewHighlight {
  quote: string
  average_rating: number | null
  review_count: number
}

const FALLBACK_QUOTES = [
  'Solid pick — regulars keep coming back.',
  'Worth a try if you are in the area.',
  'Consistently good when you want something reliable.',
]

export function getMockReviewHighlight(
  restaurant: BrandListOut,
  foodName: string,
): MockReviewHighlight {
  const seed = restaurant.id + foodName.length
  const quote = FALLBACK_QUOTES[seed % FALLBACK_QUOTES.length] ?? 'Worth a try if you are in the area.'
  return {
    quote,
    average_rating: restaurant.display_rating,
    review_count: restaurant.display_review_count,
  }
}

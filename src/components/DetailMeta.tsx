import StarRating from '@/components/StarRating'
import type { RestaurantRatingSource } from '@/types/api'

interface DetailMetaProps {
  rating: number | null | undefined
  reviewCount: number
  restaurantCount?: number
  ratingSize?: 'sm' | 'lg'
  ratingSource?: RestaurantRatingSource
}

export default function DetailMeta({
  rating,
  reviewCount,
  restaurantCount,
  ratingSize = 'lg',
  ratingSource,
}: DetailMetaProps) {
  return (
    <div className="detail-meta">
      <StarRating rating={rating ?? null} size={ratingSize} />
      <span className="review-count">
        {reviewCount} review{reviewCount !== 1 ? 's' : ''}
        {ratingSource === 'foodpanda' && (
          <span className="muted"> (Foodpanda)</span>
        )}
      </span>
      {restaurantCount !== undefined && restaurantCount > 0 && (
        <span className="badge badge--soft">
          {restaurantCount} spot{restaurantCount !== 1 ? 's' : ''}
        </span>
      )}
    </div>
  )
}

import StarRating from '@/components/StarRating'

interface DetailMetaProps {
  rating: number | null | undefined
  reviewCount: number
  restaurantCount?: number
  ratingSize?: 'sm' | 'lg'
}

export default function DetailMeta({
  rating,
  reviewCount,
  restaurantCount,
  ratingSize = 'lg',
}: DetailMetaProps) {
  return (
    <div className="detail-meta">
      <StarRating rating={rating ?? null} size={ratingSize} />
      <span className="review-count">
        {reviewCount} review{reviewCount !== 1 ? 's' : ''}
      </span>
      {restaurantCount !== undefined && restaurantCount > 0 && (
        <span className="badge badge--soft">
          {restaurantCount} spot{restaurantCount !== 1 ? 's' : ''}
        </span>
      )}
    </div>
  )
}

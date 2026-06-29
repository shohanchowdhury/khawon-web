interface StarRatingProps {
  rating: number | null | undefined
  size?: 'sm' | 'md' | 'lg'
}

export default function StarRating({ rating, size = 'md' }: StarRatingProps) {
  if (rating == null) {
    return <span className="star-rating star-rating--empty">No ratings yet</span>
  }

  const stars = []
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span
        key={i}
        className={`star ${i <= Math.round(rating) ? 'star--filled' : ''} star--${size}`}
      >
        ★
      </span>,
    )
  }

  return (
    <span className="star-rating">
      {stars}
      <span className="star-rating__value">{rating.toFixed(1)}</span>
    </span>
  )
}

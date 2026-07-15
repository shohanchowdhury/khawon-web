import { Link } from 'react-router-dom'
import type { CanonicalDishMatch } from '@/types/api'
import FoodImage from '@/components/FoodImage'
import StarRating from '@/components/StarRating'

interface CanonicalDishCardProps {
  match: CanonicalDishMatch
  priority?: boolean
  compact?: boolean
}

export default function CanonicalDishCard({
  match,
  priority,
  compact = false,
}: CanonicalDishCardProps) {
  return (
    <Link
      to={`/dishes/compare/${match.id}`}
      className={
        compact
          ? 'canonical-dish-card canonical-dish-card--compact'
          : 'canonical-dish-card'
      }
    >
      <div className="canonical-dish-card__media">
        <FoodImage
          name={match.name}
          imageUrl={match.image_url}
          className="canonical-dish-card__image"
          priority={priority}
        />
      </div>
      <div className="canonical-dish-card__body">
        <h3 className="canonical-dish-card__title">{match.name}</h3>
        <div className="canonical-dish-card__meta">
          {match.food_type && (
            <span className="canonical-dish-card__type">{match.food_type.name}</span>
          )}
          {match.average_rating != null ? (
            <StarRating rating={match.average_rating} size="sm" />
          ) : (
            <span className="muted canonical-dish-card__unrated">No reviews yet</span>
          )}
        </div>
      </div>
    </Link>
  )
}

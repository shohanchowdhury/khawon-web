import { Link } from 'react-router-dom'
import type { FoodTypePopularOut } from '@/types/api'
import FoodImage from '@/components/FoodImage'
import StarRating from '@/components/StarRating'

interface TopFoodCardProps {
  food: FoodTypePopularOut
}

export default function TopFoodCard({ food }: TopFoodCardProps) {
  const params = new URLSearchParams({ q: food.name })

  return (
    <Link to={`/search?${params.toString()}`} className="food-card">
      <FoodImage name={food.name} imageUrl={food.image_url} />
      <div className="food-card__body">
        <div className="food-card__header">
          <h3>{food.name}</h3>
          {food.restaurant_count > 0 && (
            <span className="badge">
              {food.restaurant_count} spot{food.restaurant_count !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        {food.description && (
          <p className="food-card__desc">{food.description}</p>
        )}
        <div className="food-card__meta">
          <StarRating rating={food.average_rating} size="sm" />
          <span className="review-count">
            {food.review_count} review{food.review_count !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </Link>
  )
}

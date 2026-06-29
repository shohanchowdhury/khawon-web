import { Link } from 'react-router-dom'
import type { RestaurantOut } from '@/types/api'
import FoodImage from '@/components/FoodImage'
import StarRating from '@/components/StarRating'

interface RestaurantCardProps {
  restaurant: RestaurantOut
  foodTypeId?: number
  searchQuery?: string
  showFoodTypes?: boolean
  showImage?: boolean
}

export default function RestaurantCard({
  restaurant,
  foodTypeId,
  searchQuery,
  showFoodTypes = false,
  showImage = true,
}: RestaurantCardProps) {
  const params = new URLSearchParams()
  if (foodTypeId) params.set('foodTypeId', String(foodTypeId))
  if (searchQuery) params.set('q', searchQuery)
  const query = params.toString()

  return (
    <Link
      to={`/restaurant/${restaurant.id}${query ? `?${query}` : ''}`}
      className={`restaurant-card${showImage ? ' restaurant-card--with-image' : ''}`}
    >
      {showImage && (
        <FoodImage
          name={restaurant.name}
          imageUrl={restaurant.image_url}
          className="restaurant-card__image"
        />
      )}
      <div className="restaurant-card__body">
        <div className="restaurant-card__header">
          <h3>{restaurant.name}</h3>
          {restaurant.area && <span className="badge">{restaurant.area}</span>}
        </div>
        <div className="restaurant-card__meta">
          <StarRating rating={restaurant.average_rating} />
          <span className="review-count">
            {restaurant.review_count} review{restaurant.review_count !== 1 ? 's' : ''}
          </span>
        </div>
        {showFoodTypes && restaurant.food_types.length > 0 && (
          <div className="restaurant-card__foods">
            {restaurant.food_types.map((ft) => (
              <span key={ft.id} className="badge badge--soft">{ft.name}</span>
            ))}
          </div>
        )}
        {restaurant.address && (
          <p className="restaurant-card__address">{restaurant.address}</p>
        )}
      </div>
    </Link>
  )
}

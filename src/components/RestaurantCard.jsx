import { Link } from 'react-router-dom'
import StarRating from './StarRating'

export default function RestaurantCard({ restaurant, foodTypeId, searchQuery }) {
  const params = new URLSearchParams()
  if (foodTypeId) params.set('foodTypeId', foodTypeId)
  if (searchQuery) params.set('q', searchQuery)

  return (
    <Link
      to={`/restaurant/${restaurant.id}?${params.toString()}`}
      className="restaurant-card"
    >
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
      {restaurant.address && (
        <p className="restaurant-card__address">{restaurant.address}</p>
      )}
    </Link>
  )
}

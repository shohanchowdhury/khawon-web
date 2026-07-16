import { Link } from 'react-router-dom'
import type { BrandListOut } from '@/types/api'
import BrandAreaTags from '@/components/BrandAreaTags'
import FoodImage from '@/components/FoodImage'
import StarRating from '@/components/StarRating'
import { buildRestaurantLink } from '@/utils/restaurantLink'
import { getBrandListDisplayRating } from '@/utils/restaurantDisplay'

interface RestaurantCardProps {
  restaurant: BrandListOut
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
  const display = getBrandListDisplayRating(restaurant)

  return (
    <Link
      to={buildRestaurantLink(restaurant.slug, { foodTypeId, searchQuery })}
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
          {restaurant.branch_count > 1 && (
            <span className="badge">{restaurant.branch_count} locations</span>
          )}
        </div>
        <BrandAreaTags areas={restaurant.areas} />
        <div className="restaurant-card__meta">
          <StarRating rating={display.rating} />
          <span className="review-count">
            {display.reviewCount} review{display.reviewCount !== 1 ? 's' : ''}
            {display.source === 'foodpanda' && (
              <span className="muted"> (Foodpanda)</span>
            )}
          </span>
        </div>
        {showFoodTypes && restaurant.food_types.length > 0 && (
          <div className="restaurant-card__foods">
            {restaurant.food_types.map((ft) => (
              <span key={ft.id} className="badge badge--soft">{ft.name}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}

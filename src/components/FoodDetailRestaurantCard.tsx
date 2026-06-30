import { Link } from 'react-router-dom'
import type { RestaurantOut } from '@/types/api'
import { getMockReviewHighlight } from '@/config/mockRestaurantReviewHighlights'
import DetailMeta from '@/components/DetailMeta'
import RestaurantThumb from '@/components/RestaurantThumb'
import ReviewHighlightSummary from '@/components/ReviewHighlightSummary'
import { buildRestaurantLink } from '@/utils/restaurantLink'

interface FoodDetailRestaurantCardProps {
  restaurant: RestaurantOut
  foodTypeId?: number
  searchQuery?: string
  foodName: string
}

export default function FoodDetailRestaurantCard({
  restaurant,
  foodTypeId,
  searchQuery,
  foodName,
}: FoodDetailRestaurantCardProps) {
  const highlight = getMockReviewHighlight(restaurant, foodName)

  return (
    <Link
      to={buildRestaurantLink(restaurant.id, { foodTypeId, searchQuery })}
      className="food-detail-restaurant-card"
    >
      <RestaurantThumb
        name={restaurant.name}
        imageUrl={restaurant.image_url}
        className="food-detail-restaurant-card__thumb"
      />

      <div className="food-detail-restaurant-card__main">
        <div className="food-detail-restaurant-card__header">
          <h3 className="food-detail-restaurant-card__name">{restaurant.name}</h3>
          {restaurant.area && <span className="badge">{restaurant.area}</span>}
        </div>
        <DetailMeta
          rating={restaurant.average_rating}
          reviewCount={restaurant.review_count}
          ratingSize="sm"
        />
        {restaurant.address && (
          <p className="food-detail-restaurant-card__address">{restaurant.address}</p>
        )}
      </div>

      <ReviewHighlightSummary
        quote={highlight.quote}
        rating={highlight.average_rating}
        reviewCount={highlight.review_count}
        className="food-detail-restaurant-card__reviews"
      />
    </Link>
  )
}

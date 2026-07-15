import { Link } from 'react-router-dom'
import type { RestaurantOut } from '@/types/api'
import { getMockReviewHighlight } from '@/config/mockRestaurantReviewHighlights'
import DetailMeta from '@/components/DetailMeta'
import RestaurantThumb from '@/components/RestaurantThumb'
import ReviewHighlightSummary from '@/components/ReviewHighlightSummary'
import { buildRestaurantLink } from '@/utils/restaurantLink'
import { getRestaurantDisplayRating } from '@/utils/restaurantDisplay'

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
  const display = getRestaurantDisplayRating(restaurant)

  return (
    <Link
      to={buildRestaurantLink(restaurant.id, {
        foodTypeId,
        category: foodName,
        searchQuery,
      })}
      className="food-detail-restaurant-card"
    >
      <RestaurantThumb
        name={restaurant.name}
        imageUrl={restaurant.image_url}
        fallbackUrl={restaurant.logo_url}
        className="food-detail-restaurant-card__thumb"
      />

      <div className="food-detail-restaurant-card__main">
        <div className="food-detail-restaurant-card__header">
          <h3 className="food-detail-restaurant-card__name">{restaurant.name}</h3>
          {restaurant.area && <span className="badge">{restaurant.area}</span>}
        </div>
        <DetailMeta
          rating={display.rating}
          reviewCount={display.reviewCount}
          ratingSize="sm"
          ratingSource={display.source}
        />
        {restaurant.address && (
          <p className="food-detail-restaurant-card__address">{restaurant.address}</p>
        )}
      </div>

      <ReviewHighlightSummary
        quote={highlight.quote}
        rating={highlight.average_rating ?? display.rating}
        reviewCount={highlight.review_count || display.reviewCount}
        className="food-detail-restaurant-card__reviews"
      />
    </Link>
  )
}

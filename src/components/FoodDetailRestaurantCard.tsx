import { Link } from 'react-router-dom'
import type { BrandListOut } from '@/types/api'
import BrandAreaTags from '@/components/BrandAreaTags'
import { getMockReviewHighlight } from '@/config/mockRestaurantReviewHighlights'
import DetailMeta from '@/components/DetailMeta'
import RestaurantThumb from '@/components/RestaurantThumb'
import ReviewHighlightSummary from '@/components/ReviewHighlightSummary'
import { buildRestaurantLink } from '@/utils/restaurantLink'
import { getBrandListDisplayRating } from '@/utils/restaurantDisplay'

interface FoodDetailRestaurantCardProps {
  restaurant: BrandListOut
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
  const display = getBrandListDisplayRating(restaurant)

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
        className="food-detail-restaurant-card__thumb"
      />

      <div className="food-detail-restaurant-card__main">
        <div className="food-detail-restaurant-card__header">
          <h3 className="food-detail-restaurant-card__name">{restaurant.name}</h3>
          {restaurant.branch_count > 1 && (
            <span className="badge">{restaurant.branch_count} locations</span>
          )}
        </div>
        <BrandAreaTags areas={restaurant.areas} />
        <DetailMeta
          rating={display.rating}
          reviewCount={display.reviewCount}
          ratingSize="sm"
          ratingSource={display.source}
        />
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

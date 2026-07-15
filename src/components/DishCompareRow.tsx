import { Link } from 'react-router-dom'
import type { DishOut } from '@/types/api'
import FoodImage from '@/components/FoodImage'
import StarRating from '@/components/StarRating'
import { getDishDisplayPrice } from '@/utils/formatPriceBdt'
import { buildRestaurantLink } from '@/utils/restaurantLink'

interface DishCompareRowProps {
  dish: DishOut
  priority?: boolean
  foodTypeId?: number | null
  category?: string | null
  imageUrl?: string | null
  fallbackUrl?: string | null
}

export default function DishCompareRow({
  dish,
  priority = false,
  foodTypeId,
  category,
  imageUrl,
  fallbackUrl,
}: DishCompareRowProps) {
  const price = getDishDisplayPrice(dish)
  const primaryImageUrl = imageUrl !== undefined ? imageUrl : dish.image_url
  const imageFallbackUrl =
    fallbackUrl !== undefined ? fallbackUrl : dish.restaurant.image_url

  return (
    <li className="dish-compare-row">
      <Link
        to={buildRestaurantLink(dish.restaurant.id, {
          foodTypeId: foodTypeId ?? undefined,
          category: category ?? undefined,
        })}
        className="dish-compare-card"
      >
        <div className="dish-compare-card__media">
          <FoodImage
            name={dish.name}
            imageUrl={primaryImageUrl}
            fallbackUrl={imageFallbackUrl}
            className="dish-compare-card__image"
            priority={priority}
          />
        </div>

        <div className="dish-compare-card__body">
          <span className="dish-compare-card__restaurant">{dish.restaurant.name}</span>
          <h3 className="dish-compare-card__name">{dish.name}</h3>
          <div className="dish-compare-card__meta">
            {price && (
              <span className="dish-compare-card__price">
                {price.prefix && (
                  <span className="dish-compare-card__price-prefix">{price.prefix} </span>
                )}
                {price.text}
              </span>
            )}
            {dish.average_rating != null ? (
              <StarRating rating={dish.average_rating} size="sm" />
            ) : (
              <span className="muted dish-compare-card__unrated">No reviews yet</span>
            )}
          </div>
        </div>
      </Link>
    </li>
  )
}

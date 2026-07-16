import { Link } from 'react-router-dom'
import type { BrandDishOut } from '@/types/api'
import FoodImage from '@/components/FoodImage'
import StarRating from '@/components/StarRating'
import {
  formatBranchAvailability,
  getBrandDishDisplayPrice,
} from '@/utils/formatPriceBdt'
import {
  buildBrandDishLink,
  buildBrandLink,
  resolveBrandDishFoodTypeId,
} from '@/utils/brandLink'

interface BrandDishCardProps {
  dish: BrandDishOut
  priority?: boolean
  imageUrl?: string | null
  fallbackUrl?: string | null
}

export default function BrandDishCard({
  dish,
  priority = false,
  imageUrl,
  fallbackUrl,
}: BrandDishCardProps) {
  const price = getBrandDishDisplayPrice(dish)
  const availability = formatBranchAvailability(dish.branch_count, dish.brand_branch_total)
  const foodTypeId = resolveBrandDishFoodTypeId(dish)
  const primaryImageUrl = imageUrl !== undefined ? imageUrl : dish.image_url
  const linkTarget =
    foodTypeId != null
      ? buildBrandDishLink(dish.brand.slug, foodTypeId, dish.slug)
      : buildBrandLink(dish.brand.slug)

  return (
    <Link to={linkTarget} className="brand-dish-card">
      <div className="brand-dish-card__media">
        <FoodImage
          name={dish.name}
          imageUrl={primaryImageUrl}
          fallbackUrl={fallbackUrl}
          className="brand-dish-card__image"
          priority={priority}
        />
      </div>
      <div className="brand-dish-card__body">
        <span className="brand-dish-card__brand">{dish.brand.name}</span>
        <h3 className="brand-dish-card__title">{dish.name}</h3>
        <div className="brand-dish-card__meta">
          {price && (
            <span className="brand-dish-card__price">
              {price.prefix && (
                <span className="brand-dish-card__price-prefix">{price.prefix} </span>
              )}
              {price.text}
            </span>
          )}
          {availability && (
            <span className="brand-dish-card__availability muted">{availability}</span>
          )}
          {dish.average_rating != null ? (
            <StarRating rating={dish.average_rating} size="sm" />
          ) : (
            <span className="muted brand-dish-card__unrated">No reviews yet</span>
          )}
        </div>
      </div>
    </Link>
  )
}

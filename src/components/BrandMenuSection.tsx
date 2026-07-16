import { useMemo, useState } from 'react'
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
  resolveBrandDishFoodTypeId,
} from '@/utils/brandLink'

interface BrandMenuSectionProps {
  dishes: BrandDishOut[]
  brandSlug: string
  loading?: boolean
  initialFoodTypeId?: number
}

export default function BrandMenuSection({
  dishes,
  brandSlug,
  loading = false,
  initialFoodTypeId,
}: BrandMenuSectionProps) {
  const foodTypes = useMemo(
    () =>
      Array.from(
        new Map(
          dishes
            .filter((dish) => dish.food_type)
            .map((dish) => [dish.food_type!.id, dish.food_type!]),
        ).values(),
      ).sort((a, b) => a.name.localeCompare(b.name)),
    [dishes],
  )

  const [selectedFoodTypeId, setSelectedFoodTypeId] = useState<number | null>(() =>
    initialFoodTypeId && foodTypes.some((ft) => ft.id === initialFoodTypeId)
      ? initialFoodTypeId
      : null,
  )

  const visibleDishes = selectedFoodTypeId
    ? dishes.filter((dish) => dish.food_type?.id === selectedFoodTypeId)
    : dishes

  if (loading) {
    return <p className="loading">Loading menu...</p>
  }

  if (dishes.length === 0) {
    return <p className="empty">No menu items listed yet.</p>
  }

  return (
    <section className="restaurant-menu" id="restaurant-menu">
      <h2>Menu</h2>

      {foodTypes.length > 1 && (
        <div className="restaurant-menu__chips restaurant-menu__chips--food-type">
          <button
            type="button"
            className={
              selectedFoodTypeId === null
                ? 'restaurant-menu__chip restaurant-menu__chip--active'
                : 'restaurant-menu__chip'
            }
            onClick={() => setSelectedFoodTypeId(null)}
          >
            All
          </button>
          {foodTypes.map((foodType) => (
            <button
              key={foodType.id}
              type="button"
              className={
                selectedFoodTypeId === foodType.id
                  ? 'restaurant-menu__chip restaurant-menu__chip--active'
                  : 'restaurant-menu__chip'
              }
              onClick={() => setSelectedFoodTypeId(foodType.id)}
            >
              {foodType.name}
            </button>
          ))}
        </div>
      )}

      <div className="brand-menu-grid">
        {visibleDishes.map((dish, index) => {
          const price = getBrandDishDisplayPrice(dish)
          const availability = formatBranchAvailability(
            dish.branch_count,
            dish.brand_branch_total,
          )
          const foodTypeId = resolveBrandDishFoodTypeId(dish)
          const linkTarget =
            foodTypeId != null
              ? buildBrandDishLink(brandSlug, foodTypeId, dish.slug)
              : null

          const card = (
            <>
              <div className="brand-menu-grid__media">
                <FoodImage
                  name={dish.name}
                  imageUrl={dish.image_url}
                  className="brand-menu-grid__image"
                  priority={index < 4}
                />
              </div>
              <div className="brand-menu-grid__body">
                <h3 className="brand-menu-grid__title">{dish.name}</h3>
                <div className="brand-menu-grid__meta">
                  {price && (
                    <span className="brand-menu-grid__price">
                      {price.prefix && (
                        <span className="brand-menu-grid__price-prefix">{price.prefix} </span>
                      )}
                      {price.text}
                    </span>
                  )}
                  {availability && (
                    <span className="muted brand-menu-grid__availability">{availability}</span>
                  )}
                  {dish.average_rating != null ? (
                    <StarRating rating={dish.average_rating} size="sm" />
                  ) : null}
                </div>
              </div>
            </>
          )

          if (!linkTarget) {
            return (
              <article key={`${dish.slug}-${dish.food_type_id}`} className="brand-menu-grid__card">
                {card}
              </article>
            )
          }

          return (
            <Link
              key={`${dish.slug}-${dish.food_type_id}`}
              to={linkTarget}
              className="brand-menu-grid__card"
            >
              {card}
            </Link>
          )
        })}
      </div>
    </section>
  )
}

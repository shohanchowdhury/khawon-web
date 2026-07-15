import type { DishOut } from '@/types/api'
import FoodImage from '@/components/FoodImage'
import { getDishDisplayPrice } from '@/utils/formatPriceBdt'

interface RestaurantDishCardProps {
  dish: DishOut
}

export default function RestaurantDishCard({ dish }: RestaurantDishCardProps) {
  const price = getDishDisplayPrice(dish)

  return (
    <article
      className={
        dish.is_sold_out
          ? 'restaurant-dish-card restaurant-dish-card--sold-out'
          : 'restaurant-dish-card'
      }
    >
      <div className="restaurant-dish-card__media">
        <FoodImage
          name={dish.name}
          imageUrl={dish.image_url}
          className="restaurant-dish-card__image"
        />
      </div>

      <div className="restaurant-dish-card__body">
        <div className="restaurant-dish-card__header">
          <h3 className="restaurant-dish-card__name">{dish.name}</h3>
          {dish.is_sold_out && (
            <span className="restaurant-dish-card__badge">Sold out</span>
          )}
        </div>

        {dish.description && (
          <p className="restaurant-dish-card__desc">{dish.description}</p>
        )}

        {price && (
          <div className="restaurant-dish-card__price">
            {price.prefix && (
              <span className="restaurant-dish-card__price-prefix">{price.prefix}</span>
            )}
            <span className="restaurant-dish-card__price-value">{price.text}</span>
          </div>
        )}
      </div>
    </article>
  )
}

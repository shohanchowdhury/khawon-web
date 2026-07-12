import type { DishOut } from '@/types/api'
import FoodImage from '@/components/FoodImage'
import { getDishDisplayPrice } from '@/utils/formatPriceBdt'

interface RestaurantDishRowProps {
  dish: DishOut
}

export default function RestaurantDishRow({ dish }: RestaurantDishRowProps) {
  const price = getDishDisplayPrice(dish)

  return (
    <article
      className={
        dish.is_sold_out
          ? 'restaurant-dish-row restaurant-dish-row--sold-out'
          : 'restaurant-dish-row'
      }
    >
      <div className="restaurant-dish-row__media">
        <FoodImage
          name={dish.name}
          imageUrl={dish.image_url}
          className="restaurant-dish-row__image"
        />
      </div>

      <div className="restaurant-dish-row__body">
        <div className="restaurant-dish-row__header">
          <h3 className="restaurant-dish-row__name">{dish.name}</h3>
          {dish.is_sold_out && (
            <span className="restaurant-dish-row__badge">Sold out</span>
          )}
        </div>

        {dish.description && (
          <p className="restaurant-dish-row__desc">{dish.description}</p>
        )}
      </div>

      {price && (
        <div className="restaurant-dish-row__price">
          {price.prefix && (
            <span className="restaurant-dish-row__price-prefix">{price.prefix}</span>
          )}
          <span className="restaurant-dish-row__price-value">{price.text}</span>
        </div>
      )}
    </article>
  )
}

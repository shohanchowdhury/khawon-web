import { Link } from 'react-router-dom'
import { getFoodDisplayImage } from '../config/featuredFoods'
import FoodImage from './FoodImage'

export default function CarouselFoodCard({ food, active = false, size = 'default' }) {
  const params = new URLSearchParams({ q: food.name })
  const imageUrl = getFoodDisplayImage(food)
  const sizeClass =
    size === 'focused'
      ? ' carousel-food-card--focused'
      : size === 'fullscreen'
        ? ' carousel-food-card--fullscreen'
        : size === 'hero'
          ? ' carousel-food-card--hero'
          : ''

  return (
    <Link
      to={`/search?${params.toString()}`}
      className={`carousel-food-card${active ? ' carousel-food-card--active' : ''}${sizeClass}`}
      role="listitem"
    >
      <div className="carousel-food-card__media">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={food.name}
            className="carousel-food-card__image"
            loading="lazy"
          />
        ) : (
          <FoodImage name={food.name} className="carousel-food-card__image" />
        )}
        <div className="carousel-food-card__overlay carousel-food-card__overlay--top">
          <h3 className="carousel-food-card__title">{food.name}</h3>
        </div>
      </div>
    </Link>
  )
}

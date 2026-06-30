import { Link } from 'react-router-dom'
import { getFoodDisplayImage } from '@/config/featuredFoods'
import type { CarouselFood } from '@/types/domain/featuredFood'
import FoodImage from '@/components/FoodImage'

type CarouselCardSize = 'default' | 'focused' | 'fullscreen' | 'hero'

interface CarouselFoodCardProps {
  food: CarouselFood
  active?: boolean
  size?: CarouselCardSize
}

export default function CarouselFoodCard({
  food,
  active = false,
  size = 'default',
}: CarouselFoodCardProps) {
  const imageUrl = getFoodDisplayImage(food)
  const sizeClass =
    size === 'focused'
      ? ' carousel-food-card--focused'
      : size === 'fullscreen'
        ? ' carousel-food-card--fullscreen'
        : size === 'hero'
          ? ' carousel-food-card--hero'
          : ''

  const href =
    'id' in food && food.id
      ? `/food/${food.id}`
      : `/search?q=${encodeURIComponent(food.name)}`

  return (
    <Link
      to={href}
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

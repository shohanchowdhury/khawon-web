import type { CSSProperties } from 'react'
import type { CarouselFood } from '@/types/domain/featuredFood'
import { getFoodDisplayImage } from '@/config/featuredFoods'
import FoodImage from '@/components/FoodImage'

export function getShowcaseAccent(food: CarouselFood): string {
  return 'accent' in food && food.accent ? food.accent : '#ef233c'
}

interface ShowcaseFoodProps {
  food: CarouselFood
  priority?: boolean
  className?: string
}

export default function ShowcaseFood({
  food,
  priority,
  className = 'landing-showcase__food',
}: ShowcaseFoodProps) {
  const imageUrl = getFoodDisplayImage(food)
  const style = { '--showcase-accent': getShowcaseAccent(food) } as CSSProperties

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt=""
        className={className}
        style={style}
        loading={priority ? 'eager' : 'lazy'}
      />
    )
  }

  return (
    <FoodImage
      name={food.name}
      className={className}
      style={style}
      priority={priority}
    />
  )
}

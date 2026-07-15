import { useMemo } from 'react'
import type { FoodSubTypeOut } from '@/types/api'
import FoodImage from '@/components/FoodImage'
import { pickRandomImageUrl } from '@/utils/pickRandomImage'

interface FoodSubTypeCardProps {
  subType: FoodSubTypeOut
  active?: boolean
  onSelect?: () => void
}

export default function FoodSubTypeCard({
  subType,
  active = false,
  onSelect,
}: FoodSubTypeCardProps) {
  const imageUrl = useMemo(
    () => pickRandomImageUrl(subType.image_urls),
    [subType.id, subType.image_urls.join('|')],
  )

  return (
    <button
      type="button"
      className={
        active
          ? 'food-subtype-card food-subtype-card--active'
          : 'food-subtype-card'
      }
      onClick={onSelect}
      aria-pressed={active}
    >
      <FoodImage
        name={subType.name}
        imageUrl={imageUrl}
        className="food-subtype-card__image"
      />
      <span className="food-subtype-card__body">
        <span className="food-subtype-card__name">{subType.name}</span>
        <span className="food-subtype-card__count muted">
          {subType.dish_count} dish{subType.dish_count !== 1 ? 'es' : ''}
        </span>
      </span>
    </button>
  )
}

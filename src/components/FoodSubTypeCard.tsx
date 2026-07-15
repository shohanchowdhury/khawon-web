import type { FoodSubTypeOut } from '@/types/api'
import CyclingDishImage from '@/components/CyclingDishImage'

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
      <CyclingDishImage
        imageUrls={subType.image_urls}
        alt={subType.name}
        imageClassName="food-subtype-card__image"
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

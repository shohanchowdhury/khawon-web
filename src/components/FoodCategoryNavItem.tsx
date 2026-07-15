import { getFoodTypePoster } from '@/config/foodTypePosters'
import FoodImage from '@/components/FoodImage'

interface FoodCategoryNavItemProps {
  name: string
  restaurantCount: number
  active: boolean
  pinned?: boolean
  onSelect: () => void
}

export default function FoodCategoryNavItem({
  name,
  restaurantCount,
  active,
  pinned = false,
  onSelect,
}: FoodCategoryNavItemProps) {
  const posterUrl = getFoodTypePoster(name)

  const className = [
    'foods-category-nav-item',
    active ? 'foods-category-nav-item--active' : '',
    pinned ? 'foods-category-nav-item--pinned' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type="button"
      className={className}
      onClick={onSelect}
      aria-current={active ? 'true' : undefined}
    >
      <span className="foods-category-nav-item__thumb" aria-hidden="true">
        <FoodImage
          name={name}
          imageUrl={posterUrl}
          className="foods-category-nav-item__image"
        />
      </span>
      <span className="foods-category-nav-item__copy">
        <span className="foods-category-nav-item__name">{name}</span>
        <span className="foods-category-nav-item__count muted">{restaurantCount}</span>
      </span>
    </button>
  )
}

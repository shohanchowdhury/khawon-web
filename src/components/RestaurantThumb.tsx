import FoodImage from '@/components/FoodImage'

interface RestaurantThumbProps {
  name: string
  imageUrl?: string | null
  size?: 'sm' | 'md'
  className?: string
}

export default function RestaurantThumb({
  name,
  imageUrl,
  size = 'sm',
  className,
}: RestaurantThumbProps) {
  return (
    <div
      className={[
        'restaurant-thumb',
        size === 'sm' ? 'restaurant-thumb--sm' : 'restaurant-thumb--md',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <FoodImage
        name={name}
        imageUrl={imageUrl}
        className="restaurant-thumb__image"
      />
    </div>
  )
}

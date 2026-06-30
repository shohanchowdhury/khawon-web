import { Link } from 'react-router-dom'
import type { FeaturedFoodWithDisplay } from '@/types/domain/featuredFood'
import FoodImage from '@/components/FoodImage'

interface FeaturedFoodTilesProps {
  foods: FeaturedFoodWithDisplay[]
}

export default function FeaturedFoodTiles({ foods }: FeaturedFoodTilesProps) {
  return (
    <div className="featured-tiles">
      {foods.map((food, index) => {
        const imageUrl = food.image_url || food.fallbackImage
        const href = food.id
          ? `/food/${food.id}`
          : `/search?q=${encodeURIComponent(food.name)}`

        return (
          <Link
            key={food.name}
            to={href}
            className={`featured-tile featured-tile--${food.slug}`}
            style={{
              '--tile-accent': food.accent,
              '--tile-rotate': `${(index - 1) * 3}deg`,
              zIndex: foods.length - index,
            }}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={food.name}
                className="featured-tile__image"
                loading={index === 0 ? 'eager' : 'lazy'}
                fetchPriority={index === 0 ? 'high' : 'auto'}
              />
            ) : (
              <FoodImage name={food.name} className="featured-tile__image" />
            )}
            <div className="featured-tile__overlay">
              <span className="featured-tile__name">{food.name}</span>
              {food.review_count > 0 && (
                <span className="featured-tile__meta">
                  {food.review_count} review{food.review_count !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </Link>
        )
      })}
    </div>
  )
}

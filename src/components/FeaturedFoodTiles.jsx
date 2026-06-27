import { Link } from 'react-router-dom'
import FoodImage from './FoodImage'

export default function FeaturedFoodTiles({ foods }) {
  return (
    <div className="featured-tiles">
      {foods.map((food, index) => {
        const params = new URLSearchParams({ q: food.name })
        const imageUrl = food.image_url || food.fallbackImage

        return (
          <Link
            key={food.name}
            to={`/search?${params.toString()}`}
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

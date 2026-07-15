import { Link } from 'react-router-dom'
import type { DishOut } from '@/types/api'
import StarRating from '@/components/StarRating'

interface DishCompareRowProps {
  dish: DishOut
}

export default function DishCompareRow({ dish }: DishCompareRowProps) {
  return (
    <li className="dish-compare-row">
      <Link to={`/restaurant/${dish.restaurant.id}`} className="dish-compare-row__link">
        <div className="dish-compare-row__main">
          <strong>{dish.restaurant.name}</strong>
          <span className="muted"> — {dish.name}</span>
        </div>
        <div className="dish-compare-row__meta">
          {dish.price_bdt != null && <span>{dish.price_bdt} tk</span>}
          {dish.average_rating != null ? (
            <StarRating rating={dish.average_rating} size="sm" />
          ) : (
            <span className="muted">No reviews yet</span>
          )}
        </div>
      </Link>
    </li>
  )
}

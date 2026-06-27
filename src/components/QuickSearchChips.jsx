import { Link } from 'react-router-dom'
import { POSTER_FOODS } from '../config/featuredFoods'

export default function QuickSearchChips() {
  return (
    <div className="quick-chips">
      <span className="quick-chips__label muted">Try:</span>
      {POSTER_FOODS.map((food) => {
        const params = new URLSearchParams({ q: food.name })
        return (
          <Link
            key={food.name}
            to={`/search?${params.toString()}`}
            className="quick-chips__pill"
            style={{ '--chip-accent': food.accent }}
          >
            {food.name}
          </Link>
        )
      })}
    </div>
  )
}

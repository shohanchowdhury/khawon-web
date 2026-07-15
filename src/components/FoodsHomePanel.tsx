import CanonicalDishCard from '@/components/CanonicalDishCard'
import type { CanonicalDishMatch } from '@/types/api'

interface FoodsHomePanelProps {
  dishes: CanonicalDishMatch[]
  loading?: boolean
}

export default function FoodsHomePanel({
  dishes,
  loading = false,
}: FoodsHomePanelProps) {
  if (loading) {
    return <p className="loading foods-home__loading">Loading popular picks...</p>
  }

  if (dishes.length === 0) {
    return (
      <p className="empty foods-home__empty">
        No dishes to highlight yet. Pick a category to browse.
      </p>
    )
  }

  return (
    <div className="foods-home">
      <header className="foods-home__header">
        <h2 className="foods-home__title">Popular picks</h2>
        <p className="muted foods-home__subtitle">
          A few dishes to explore — pick a category for more.
        </p>
      </header>

      <div className="foods-home__grid">
        {dishes.map((match, index) => (
          <CanonicalDishCard
            key={match.id}
            match={match}
            priority={index < 4}
            compact
          />
        ))}
      </div>
    </div>
  )
}

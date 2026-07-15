import CanonicalDishCard from '@/components/CanonicalDishCard'
import type { CanonicalDishMatch } from '@/types/api'

interface FoodsFeaturedStripProps {
  topRated: CanonicalDishMatch[]
  popular: CanonicalDishMatch[]
  loading?: boolean
  homeLayout?: boolean
}

function FeaturedRow({
  title,
  dishes,
  layout = 'scroll',
  fill = false,
}: {
  title: string
  dishes: CanonicalDishMatch[]
  layout?: 'scroll' | 'grid'
  fill?: boolean
}) {
  if (dishes.length === 0) return null

  const rowClass = fill
    ? 'foods-featured__row foods-featured__row--fill'
    : 'foods-featured__row'

  return (
    <section className={rowClass}>
      <h2 className="foods-featured__title">{title}</h2>
      <div
        className={
          layout === 'grid'
            ? 'foods-featured__grid'
            : 'foods-featured__scroll'
        }
      >
        {dishes.map((match, index) => (
          <CanonicalDishCard
            key={match.id}
            match={match}
            priority={index < 3}
            compact={layout === 'scroll'}
          />
        ))}
      </div>
    </section>
  )
}

export default function FoodsFeaturedStrip({
  topRated,
  popular,
  loading = false,
  homeLayout = false,
}: FoodsFeaturedStripProps) {
  if (loading) {
    return (
      <p className="loading foods-featured__loading foods-featured__loading--home">
        Loading featured dishes...
      </p>
    )
  }

  if (topRated.length === 0 && popular.length === 0) {
    return null
  }

  return (
    <div className={homeLayout ? 'foods-featured foods-featured--home' : 'foods-featured'}>
      {!homeLayout && (
        <FeaturedRow title="Top rated" dishes={topRated} />
      )}
      <FeaturedRow
        title="Popular picks"
        dishes={popular}
        layout={homeLayout ? 'grid' : 'scroll'}
        fill={homeLayout}
      />
      {homeLayout && (
        <p className="muted foods-featured__home-hint">
          Pick a category or search from the nav bar to browse comparable dishes.
        </p>
      )}
    </div>
  )
}

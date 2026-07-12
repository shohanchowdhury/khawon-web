import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { compareDish, searchDishes } from '@/api/client'
import type { CanonicalDishMatch, DishOut } from '@/types/api'
import PageScroll from '@/components/PageScroll'
import StarRating from '@/components/StarRating'

function formatPriceRange(match: CanonicalDishMatch): string | null {
  if (match.min_price_bdt == null) return null
  if (match.max_price_bdt == null || match.max_price_bdt === match.min_price_bdt) {
    return `${match.min_price_bdt} tk`
  }
  return `${match.min_price_bdt}–${match.max_price_bdt} tk`
}

function DishRow({ dish }: { dish: DishOut }) {
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

function CanonicalMatchCard({ match }: { match: CanonicalDishMatch }) {
  const [expanded, setExpanded] = useState(false)
  const [dishes, setDishes] = useState<DishOut[] | null>(null)
  const [loading, setLoading] = useState(false)
  const priceRange = formatPriceRange(match)

  async function toggle() {
    const next = !expanded
    setExpanded(next)
    if (next && dishes === null && !loading) {
      setLoading(true)
      try {
        const result = await compareDish(match.id)
        setDishes(result.dishes)
      } catch {
        setDishes([])
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <article className="canonical-match-card">
      <button type="button" className="canonical-match-card__head" onClick={toggle}>
        <div>
          <h3>{match.name}</h3>
          <p className="muted">
            {match.restaurant_count} restaurant{match.restaurant_count !== 1 ? 's' : ''}
            {priceRange ? ` · ${priceRange}` : ''}
            {match.food_type ? ` · ${match.food_type.name}` : ''}
          </p>
        </div>
        <div className="canonical-match-card__side">
          {match.average_rating != null && (
            <StarRating rating={match.average_rating} size="sm" />
          )}
          <span aria-hidden="true">{expanded ? '▴' : '▾'}</span>
        </div>
      </button>

      {expanded && (
        <div className="canonical-match-card__body">
          {loading && <p className="loading">Comparing...</p>}
          {dishes && dishes.length > 0 && (
            <ul className="dish-compare-list">
              {dishes.map((dish) => (
                <DishRow key={dish.id} dish={dish} />
              ))}
            </ul>
          )}
          {dishes && dishes.length === 0 && !loading && (
            <p className="muted">Could not load the comparison.</p>
          )}
        </div>
      )}
    </article>
  )
}

export default function SearchResults() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [canonicalMatches, setCanonicalMatches] = useState<CanonicalDishMatch[]>([])
  const [dishes, setDishes] = useState<DishOut[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!query) {
      setCanonicalMatches([])
      setDishes([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')

    searchDishes(query)
      .then((result) => {
        setCanonicalMatches(result.canonical_matches)
        setDishes(result.dishes)
      })
      .catch((err) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false))
  }, [query])

  const hasResults = canonicalMatches.length > 0 || dishes.length > 0

  return (
    <div className="page search-page">
      <PageScroll>
        <main className="page-content">
        {!query && <p className="empty">Search for a dish, e.g. kacchi or burger.</p>}

        {loading && <p className="loading">Loading...</p>}

        {error && (
          <div className="error-box">
            <p>{error}</p>
            <p className="muted">Try biriyani, kacchi, or burger.</p>
          </div>
        )}

        {!loading && !error && query && (
          <>
            <div className="results-header">
              <h1>Results for &ldquo;{query}&rdquo;</h1>
              <p className="results-count muted">
                {canonicalMatches.length > 0 &&
                  `${canonicalMatches.length} dish${canonicalMatches.length !== 1 ? 'es' : ''} to compare · `}
                {dishes.length} menu item{dishes.length !== 1 ? 's' : ''} found
              </p>
            </div>

            {!hasResults && (
              <p className="empty">No dishes match your search. Try a different name.</p>
            )}

            {canonicalMatches.length > 0 && (
              <section className="canonical-matches">
                <h2>Compare across restaurants</h2>
                {canonicalMatches.map((match) => (
                  <CanonicalMatchCard key={match.id} match={match} />
                ))}
              </section>
            )}

            {dishes.length > 0 && (
              <section className="dish-results">
                <h2>All matching menu items</h2>
                <ul className="dish-compare-list">
                  {dishes.map((dish) => (
                    <DishRow key={dish.id} dish={dish} />
                  ))}
                </ul>
              </section>
            )}
          </>
        )}
        </main>
      </PageScroll>
    </div>
  )
}

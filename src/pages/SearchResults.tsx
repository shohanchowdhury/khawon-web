import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getFoodCatalogue } from '@/api/client'
import type { FoodTypePopularOut } from '@/types/api'
import PageScroll from '@/components/PageScroll'
import TopFoodCard from '@/components/TopFoodCard'

export default function SearchResults() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [foods, setFoods] = useState<FoodTypePopularOut[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!query) {
      setFoods([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')

    getFoodCatalogue(query)
      .then(setFoods)
      .catch((err) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false))
  }, [query])

  return (
    <div className="page search-page">
      <PageScroll>
        <main className="page-content">
        {!query && <p className="empty">Enter a food type to search.</p>}

        {loading && <p className="loading">Loading...</p>}

        {error && (
          <div className="error-box">
            <p>{error}</p>
            <p className="muted">Try biriyani, ramen, or fuchka.</p>
          </div>
        )}

        {!loading && !error && query && (
          <>
            <div className="results-header">
              <h1>Results for &ldquo;{query}&rdquo;</h1>
              <p className="results-count muted">
                {foods.length} food{foods.length !== 1 ? 's' : ''} found
              </p>
            </div>

            {foods.length === 0 ? (
              <p className="empty">No foods match your search. Try a different name.</p>
            ) : (
              <div className="top-foods__grid catalogue-grid food-search-results">
                {foods.map((food) => (
                  <TopFoodCard key={food.id} food={food} fromSearch={query} />
                ))}
              </div>
            )}
          </>
        )}
        </main>
      </PageScroll>
    </div>
  )
}

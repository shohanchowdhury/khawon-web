import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getRestaurants } from '@/api/client'
import type { BrandListOut } from '@/types/api'
import PageScroll from '@/components/PageScroll'
import PaginationControls from '@/components/PaginationControls'
import RestaurantCard from '@/components/RestaurantCard'

const CATALOGUE_PAGE_SIZE = 24

export default function RestaurantCatalogue() {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [page, setPage] = useState(0)
  const [restaurants, setRestaurants] = useState<BrandListOut[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    setPage(0)
  }, [debouncedQuery])

  useEffect(() => {
    setLoading(true)
    setError('')
    getRestaurants(debouncedQuery, {
      offset: page * CATALOGUE_PAGE_SIZE,
      limit: CATALOGUE_PAGE_SIZE,
    })
      .then((result) => {
        setRestaurants(result.restaurants)
        setTotal(result.total)
      })
      .catch((err) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false))
  }, [debouncedQuery, page])

  return (
    <div className="page">
      <PageScroll>
        <main className="page-content">
        <div className="catalogue-header">
          <div>
            <h1>Restaurants</h1>
            <p className="muted">
              Browse every restaurant on Khawon — tap one for details and reviews
            </p>
          </div>
        </div>

        <p className="catalogue-crosslink muted">
          Looking for foods?{' '}
          <Link to="/foods">Browse foods →</Link>
        </p>

        <label className="catalogue-search">
          Filter restaurants
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by name, area, or address..."
          />
        </label>

        {!loading && !error && (
          <p className="catalogue-count muted">
            {total} restaurant{total !== 1 ? 's' : ''}
            {debouncedQuery.trim() ? ` matching "${debouncedQuery.trim()}"` : ''}
          </p>
        )}

        {loading && <p className="loading">Loading restaurants...</p>}
        {error && <div className="error-box"><p>{error}</p></div>}

        {!loading && !error && total === 0 && (
          <p className="empty">
            {query.trim()
              ? `No restaurants match "${query.trim()}".`
              : 'No restaurants yet. Sign in to add the first one!'}
          </p>
        )}

        {!loading && restaurants.length > 0 && (
          <>
            <div className="restaurant-grid catalogue-restaurant-grid">
              {restaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  showFoodTypes
                />
              ))}
            </div>

            <PaginationControls
              page={page}
              pageSize={CATALOGUE_PAGE_SIZE}
              total={total}
              onPageChange={setPage}
              loading={loading}
            />
          </>
        )}
      </main>
      </PageScroll>
    </div>
  )
}

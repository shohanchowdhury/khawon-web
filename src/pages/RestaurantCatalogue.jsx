import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getRestaurantCatalogue } from '../api/client'
import NavBar from '../components/NavBar'
import RestaurantCard from '../components/RestaurantCard'

export default function RestaurantCatalogue() {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    setLoading(true)
    setError('')
    getRestaurantCatalogue(debouncedQuery)
      .then(setRestaurants)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [debouncedQuery])

  return (
    <div className="page">
      <header className="page-header page-header--stacked">
        <NavBar compact />
      </header>

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
            {restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''}
            {debouncedQuery.trim() ? ` matching "${debouncedQuery.trim()}"` : ''}
          </p>
        )}

        {loading && <p className="loading">Loading restaurants...</p>}
        {error && <div className="error-box"><p>{error}</p></div>}

        {!loading && !error && restaurants.length === 0 && (
          <p className="empty">
            {query.trim()
              ? `No restaurants match "${query.trim()}".`
              : 'No restaurants yet. Sign in to add the first one!'}
          </p>
        )}

        {!loading && restaurants.length > 0 && (
          <div className="restaurant-grid catalogue-restaurant-grid">
            {restaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                showFoodTypes
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

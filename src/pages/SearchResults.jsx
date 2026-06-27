import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { searchFood } from '../api/client'
import SearchBar from '../components/SearchBar'
import RestaurantCard from '../components/RestaurantCard'

export default function SearchResults() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!query) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')
    searchFood(query)
      .then(setResult)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [query])

  return (
    <div className="page">
      <header className="page-header">
        <Link to="/" className="logo-link">খাওন</Link>
        <SearchBar defaultValue={query} />
      </header>

      <main className="page-content">
        {!query && <p className="empty">Enter a food type to search.</p>}

        {loading && <p className="loading">Searching...</p>}

        {error && (
          <div className="error-box">
            <p>{error}</p>
            <p className="muted">Try biriyani, ramen, or fuchka.</p>
          </div>
        )}

        {result && (
          <>
            <div className="results-header">
              <h1>
                Best <span className="highlight">{result.food_type.name}</span> in Bangladesh
              </h1>
              {result.food_type.description && (
                <p className="muted">{result.food_type.description}</p>
              )}
              <p className="results-count">
                {result.restaurants.length} restaurant{result.restaurants.length !== 1 ? 's' : ''} found
              </p>
            </div>

            {result.restaurants.length === 0 ? (
              <p className="empty">No restaurants serve this food type yet.</p>
            ) : (
              <div className="restaurant-grid">
                {result.restaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    foodTypeId={result.food_type.id}
                    searchQuery={query}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

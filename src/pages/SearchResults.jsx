import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchFood } from '../api/client'
import FoodImage from '../components/FoodImage'
import SearchBar from '../components/SearchBar'
import NavBar from '../components/NavBar'
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
      <header className="page-header page-header--stacked">
        <NavBar compact />
        <SearchBar defaultValue={query} />
      </header>

      <main className="page-content">
        {!query && <p className="empty">Enter a food type to search.</p>}

        {loading && <p className="loading">Loading...</p>}

        {error && (
          <div className="error-box">
            <p>{error}</p>
            <p className="muted">Try biriyani, ramen, or fuchka.</p>
          </div>
        )}

        {result && (
          <>
            <section className="food-hero">
              <FoodImage
                name={result.food_type.name}
                imageUrl={result.food_type.image_url}
                className="food-hero__media"
                priority
              />
              <div className="food-hero__text">
                <h1>{result.food_type.name}</h1>
                {result.food_type.description && (
                  <p className="food-hero__desc">{result.food_type.description}</p>
                )}
              </div>
            </section>

            <section className="food-restaurants">
              <div className="results-header">
                <h2>Top restaurants</h2>
                <p className="results-count">
                  {result.restaurants.length} restaurant
                  {result.restaurants.length !== 1 ? 's' : ''} serving{' '}
                  {result.food_type.name}
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
            </section>
          </>
        )}
      </main>
    </div>
  )
}

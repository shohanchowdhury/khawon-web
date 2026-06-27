import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getFoodCatalogue } from '../api/client'
import NavBar from '../components/NavBar'
import TopFoodCard from '../components/TopFoodCard'

export default function Catalogue() {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [foods, setFoods] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    setLoading(true)
    setError('')
    getFoodCatalogue(debouncedQuery)
      .then(setFoods)
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
            <h1>Food catalogue</h1>
            <p className="muted">
              Browse every food type on Khawon — tap one to find restaurants
            </p>
          </div>
          <Link to="/" className="back-link">← Back to home</Link>
        </div>

        <label className="catalogue-search">
          Filter catalogue
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by name — biriyani, fuchka..."
          />
        </label>

        {!loading && !error && (
          <p className="catalogue-count muted">
            {foods.length} item{foods.length !== 1 ? 's' : ''}
            {debouncedQuery.trim() ? ` matching "${debouncedQuery.trim()}"` : ''}
          </p>
        )}

        {loading && <p className="loading">Loading catalogue...</p>}
        {error && <div className="error-box"><p>{error}</p></div>}

        {!loading && !error && foods.length === 0 && (
          <p className="empty">
            {query.trim()
              ? `No foods match "${query.trim()}".`
              : 'No food types yet. Sign in to add the first one!'}
          </p>
        )}

        {!loading && foods.length > 0 && (
          <div className="top-foods__grid catalogue-grid">
            {foods.map((food) => (
              <TopFoodCard key={food.id} food={food} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

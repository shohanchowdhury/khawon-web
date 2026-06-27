import { useEffect, useState } from 'react'
import { getTopFoodTypes } from '../api/client'
import NavBar from '../components/NavBar'
import SearchBar from '../components/SearchBar'
import TopFoodCard from '../components/TopFoodCard'

export default function Home() {
  const [topFoods, setTopFoods] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getTopFoodTypes(8)
      .then(setTopFoods)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="home-page">
      <NavBar />

      <section className="hero hero--compact">
        <p className="hero__eyebrow">Bangladesh food finder</p>
        <h1 className="hero__title">Find the best places to eat</h1>
        <p className="hero__subtitle">
          Search by food type, explore ranked restaurants, and share your reviews.
        </p>
        <SearchBar large />
      </section>

      <section className="top-foods">
        <div className="top-foods__inner">
          <h2 className="top-foods__heading">Top foods in Bangladesh</h2>
          <p className="top-foods__subheading muted">
            Ranked by reviews — tap a food to see the best spots
          </p>

          {loading && <p className="loading">Loading top foods...</p>}
          {error && <div className="error-box"><p>{error}</p></div>}

          {!loading && !error && topFoods.length === 0 && (
            <p className="empty">No food types yet. Be the first to add one!</p>
          )}

          {!loading && topFoods.length > 0 && (
            <div className="top-foods__grid">
              {topFoods.map((food) => (
                <TopFoodCard key={food.id} food={food} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

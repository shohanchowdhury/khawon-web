import { useEffect, useState } from 'react'
import { getTopFoodTypes, listFoodTypes } from '../api/client'
import { buildCarouselFoods, HOME_CAROUSEL_LIMIT } from '../config/featuredFoods'
import NavBar from '../components/NavBar'
import TopFoodCarousel from '../components/TopFoodCarousel'

export default function Home() {
  const [carouselFoods, setCarouselFoods] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([listFoodTypes(), getTopFoodTypes(12)])
      .then(([allFoods, topList]) => {
        setCarouselFoods(buildCarouselFoods(allFoods, topList).slice(0, HOME_CAROUSEL_LIMIT))
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="home-page home-page--feed">
      <NavBar showSearch />

      {loading && <p className="loading home-page__loading">Loading...</p>}
      {error && (
        <div className="error-box home-page__error">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && carouselFoods.length > 0 && (
        <TopFoodCarousel foods={carouselFoods} variant="focused" />
      )}

      {!loading && !error && carouselFoods.length === 0 && (
        <p className="empty home-page__loading">No food types yet.</p>
      )}
    </div>
  )
}

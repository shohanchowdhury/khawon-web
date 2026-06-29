import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getFoodCatalogue, getTopFoodTypes, listFoodTypes } from '@/api/client'
import { buildCarouselFoods, HOME_CAROUSEL_LIMIT } from '@/config/featuredFoods'
import type { FoodTypePopularOut } from '@/types/api'
import type { CarouselFood } from '@/types/domain/featuredFood'
import FoodStage from '@/components/FoodStage'
import HomeAccentBackground from '@/components/HomeAccentBackground'
import NavBar from '@/components/NavBar'
import TopFoodCard from '@/components/TopFoodCard'

export default function Foods() {
  const location = useLocation()
  const navigate = useNavigate()
  const [stageIntro] = useState(() => location.state?.foodStageIntro === true)

  const [carouselFoods, setCarouselFoods] = useState<CarouselFood[]>([])
  const [stageLoading, setStageLoading] = useState(true)
  const [stageError, setStageError] = useState('')
  const [accent, setAccent] = useState('#ef233c')

  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [foods, setFoods] = useState<FoodTypePopularOut[]>([])
  const [catalogueLoading, setCatalogueLoading] = useState(true)
  const [catalogueError, setCatalogueError] = useState('')

  useEffect(() => {
    if (location.state?.foodStageIntro) {
      navigate('/foods', { replace: true, state: {} })
    }
  }, [location.state?.foodStageIntro, navigate])

  useEffect(() => {
    Promise.all([listFoodTypes(), getTopFoodTypes(12)])
      .then(([allFoods, topList]) => {
        setCarouselFoods(buildCarouselFoods(allFoods, topList).slice(0, HOME_CAROUSEL_LIMIT))
      })
      .catch((err) => setStageError(err instanceof Error ? err.message : String(err)))
      .finally(() => setStageLoading(false))
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    setCatalogueLoading(true)
    setCatalogueError('')
    getFoodCatalogue(debouncedQuery)
      .then(setFoods)
      .catch((err) => setCatalogueError(err instanceof Error ? err.message : String(err)))
      .finally(() => setCatalogueLoading(false))
  }, [debouncedQuery])

  return (
    <div className="foods-page">
      <NavBar showSearch />

      <section className="home-page home-page--feed foods-page__hero">
        <HomeAccentBackground accent={accent} />

        {stageLoading && <p className="loading home-page__loading">Loading...</p>}
        {stageError && (
          <div className="error-box home-page__error">
            <p>{stageError}</p>
          </div>
        )}

        {!stageLoading && !stageError && carouselFoods.length > 0 && (
          <FoodStage foods={carouselFoods} onAccentChange={setAccent} intro={stageIntro} />
        )}

        {!stageLoading && !stageError && carouselFoods.length === 0 && (
          <p className="empty home-page__loading">No food types yet.</p>
        )}
      </section>

      <motion.section
        className="foods-page__catalogue page-content"
        initial={stageIntro ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.35,
          delay: stageIntro ? 0.15 : 0,
        }}
      >
        <div className="catalogue-header">
          <div>
            <h2>All foods</h2>
            <p className="muted">
              Browse every food type on Khawon — tap one to find restaurants
            </p>
          </div>
        </div>

        <p className="catalogue-crosslink muted">
          Looking for restaurants?{' '}
          <Link to="/restaurants">Browse restaurants →</Link>
        </p>

        <label className="catalogue-search">
          Filter foods
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by name — biriyani, fuchka..."
          />
        </label>

        {!catalogueLoading && !catalogueError && (
          <p className="catalogue-count muted">
            {foods.length} item{foods.length !== 1 ? 's' : ''}
            {debouncedQuery.trim() ? ` matching "${debouncedQuery.trim()}"` : ''}
          </p>
        )}

        {catalogueLoading && <p className="loading">Loading catalogue...</p>}
        {catalogueError && <div className="error-box"><p>{catalogueError}</p></div>}

        {!catalogueLoading && !catalogueError && foods.length === 0 && (
          <p className="empty">
            {query.trim()
              ? `No foods match "${query.trim()}".`
              : 'No food types yet. Sign in to add the first one!'}
          </p>
        )}

        {!catalogueLoading && foods.length > 0 && (
          <div className="top-foods__grid catalogue-grid">
            {foods.map((food) => (
              <TopFoodCard key={food.id} food={food} />
            ))}
          </div>
        )}
      </motion.section>
    </div>
  )
}

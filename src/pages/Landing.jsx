import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getTopFoodTypes, listFoodTypes } from '../api/client'
import {
  buildCarouselFoods,
  getFoodDisplayImage,
  HOME_CAROUSEL_LIMIT,
} from '../config/featuredFoods'
import { LANDING_PATTERN } from '../config/landingBackground'
import { useAuth } from '../context/AuthContext'
import FoodImage from '../components/FoodImage'
import NavBar from '../components/NavBar'
import { useLandingPatternDrift } from '../hooks/useLandingPatternDrift'

const SHOWCASE_LIMIT = 3

function getAccent(food) {
  return food?.accent || '#dc2626'
}

export default function Landing() {
  const { isAuthenticated } = useAuth()
  const [showcaseFoods, setShowcaseFoods] = useState([])
  const patternRef = useLandingPatternDrift()

  useEffect(() => {
    Promise.all([listFoodTypes(), getTopFoodTypes(12)])
      .then(([allFoods, topList]) => {
        setShowcaseFoods(
          buildCarouselFoods(allFoods, topList)
            .slice(0, HOME_CAROUSEL_LIMIT)
            .slice(0, SHOWCASE_LIMIT),
        )
      })
      .catch(() => setShowcaseFoods([]))
  }, [])

  return (
    <div className="landing-page">
      <div className="landing-page__accent" aria-hidden="true" />
      <div
        ref={patternRef}
        className="landing-page__pattern"
        aria-hidden="true"
        style={{
          '--pattern-tile-w': `${LANDING_PATTERN.tileWidth}px`,
          '--pattern-tile-h': `${LANDING_PATTERN.tileHeight}px`,
          '--pattern-duration': `${LANDING_PATTERN.duration}s`,
        }}
      />
      <NavBar />

      <main className="landing-hero">
        <div className="landing-hero__copy">
          <p className="landing-hero__wordmark">খাওন</p>
          <h1 className="landing-hero__title">
            Find what to eat.
            <br />
            Find where to eat it.
          </h1>
          <p className="landing-hero__subtitle muted">
            Discover Bangladesh&apos;s best food and the restaurants that serve it.
          </p>

          <div className="landing-cta">
            <Link
              to="/foods"
              state={{ foodStageIntro: true }}
              className="landing-cta__btn landing-cta__btn--primary nav-btn nav-btn--primary"
            >
              Browse foods
            </Link>
            <Link to="/restaurants" className="landing-cta__btn landing-cta__btn--secondary nav-btn">
              Browse restaurants
            </Link>
          </div>

          {!isAuthenticated && (
            <p className="landing-hero__auth muted">
              <Link to="/login">Sign in</Link> to add listings and post reviews
            </p>
          )}
        </div>

        <div className="landing-showcase" aria-hidden="true">
          <div className="landing-showcase__glow" />
          {showcaseFoods.map((food, index) => {
            const imageUrl = getFoodDisplayImage(food)
            const className = `landing-showcase__food landing-showcase__food--${index}`

            return imageUrl ? (
              <img
                key={food.id ?? food.name}
                src={imageUrl}
                alt=""
                className={className}
                style={{ '--showcase-accent': getAccent(food) }}
                loading="eager"
              />
            ) : (
              <FoodImage
                key={food.id ?? food.name}
                name={food.name}
                className={className}
                style={{ '--showcase-accent': getAccent(food) }}
                priority
              />
            )
          })}
        </div>
      </main>
    </div>
  )
}

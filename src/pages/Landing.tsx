import { LANDING_PATTERN } from '@/config/landingBackground'
import { LANDING_POSTER_FOODS } from '@/config/landingPosterFoods'
import { useAuth } from '@/context/AuthContext'
import { useAuthModal } from '@/context/AuthModalContext'
import LandingCta from '@/components/LandingCta'
import LandingShowcase from '@/components/LandingShowcase'
import { useLandingPatternDrift } from '@/hooks/useLandingPatternDrift'

export default function Landing() {
  const { isAuthenticated } = useAuth()
  const { openAuthModal } = useAuthModal()
  const patternRef = useLandingPatternDrift()

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
      <main className="landing-hero khawon-scrollbar">
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

          <LandingCta />

          {!isAuthenticated && (
            <p className="landing-hero__auth muted">
              <button
                type="button"
                className="landing-hero__auth-btn"
                onClick={() => openAuthModal('login')}
              >
                Sign in
              </button>{' '}
              to add listings and post reviews
            </p>
          )}
        </div>

        <LandingShowcase posters={LANDING_POSTER_FOODS} />
      </main>
    </div>
  )
}

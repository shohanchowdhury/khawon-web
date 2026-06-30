import { NavButtonLink } from '@/components/NavButton'

export default function LandingCta() {
  return (
    <div className="landing-cta">
      <NavButtonLink
        to="/foods"
        state={{ foodStageIntro: true }}
        variant="primary"
        className="landing-cta__btn landing-cta__btn--primary"
      >
        Browse foods
      </NavButtonLink>
      <NavButtonLink
        to="/restaurants"
        className="landing-cta__btn landing-cta__btn--secondary"
      >
        Browse restaurants
      </NavButtonLink>
    </div>
  )
}

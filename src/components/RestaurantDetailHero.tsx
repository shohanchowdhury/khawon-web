import { motion } from 'framer-motion'
import type { Ref } from 'react'
import { Link } from 'react-router-dom'
import type { BrandDetailOut } from '@/types/api'
import BrandLocationBadges from '@/components/BrandLocationBadges'
import { NavButton } from '@/components/NavButton'
import DetailHeader from '@/components/DetailHeader'
import DetailMeta from '@/components/DetailMeta'
import FoodImage from '@/components/FoodImage'
import { getGoogleMapsUrl } from '@/utils/restaurantDisplay'

interface RestaurantDetailHeroProps {
  brand: BrandDetailOut
  heroImageUrl: string | null
  backHref: string | null
  backLabel: string
  backInNav?: boolean
  onBackAnchorRef?: Ref<HTMLDivElement | null>
  titleInNav?: boolean
  titleAnchorRef?: Ref<HTMLDivElement | null>
}

export default function RestaurantDetailHero({
  brand,
  heroImageUrl,
  backHref,
  backLabel,
  backInNav = false,
  onBackAnchorRef,
  titleInNav = false,
  titleAnchorRef,
}: RestaurantDetailHeroProps) {
  function scrollToMenu() {
    document.getElementById('restaurant-menu')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="food-detail-hero restaurant-detail-hero">
      <motion.div
        className="food-detail-hero__card restaurant-detail-hero__card"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="food-detail-hero__media">
          <FoodImage
            name={brand.name}
            imageUrl={heroImageUrl}
            className="food-detail-hero__image"
            priority
          />
        </div>

        <div className="food-detail-hero__copy">
          <div ref={onBackAnchorRef} className="food-detail-hero__back">
            {backHref && !backInNav ? (
              <motion.div layoutId="restaurant-detail-back">
                <Link to={backHref} className="back-link food-detail-hero__back-link">
                  {backLabel}
                </Link>
              </motion.div>
            ) : backHref ? (
              <span className="food-detail-hero__back-placeholder" aria-hidden="true">
                {backLabel}
              </span>
            ) : null}
          </div>

          <div className="food-detail-hero__body">
            <DetailHeader
              title={brand.name}
              titleClassName="food-detail-hero__title"
              titleAnchorRef={titleAnchorRef}
              titleInNav={titleInNav}
              titleLayoutId="restaurant-detail-title"
            >
              {brand.branch_count > 1 && (
                <span className="badge badge--large">
                  {brand.branch_count} locations
                </span>
              )}
              <DetailMeta
                rating={brand.display_rating}
                // must come from the brand, like rating/source above: passing
                // the khawon review total here renders a foodpanda rating next
                // to "0 reviews".
                reviewCount={brand.display_review_count}
                ratingSource={brand.display_rating_source}
              />
            </DetailHeader>

            <BrandLocationBadges branches={brand.branches} brandName={brand.name} />

            <div className="restaurant-detail-hero__links">
              {brand.branches.map((branch) => {
                const mapsUrl = getGoogleMapsUrl(branch)
                const label = branch.area || branch.name
                return (
                  <div key={branch.id} className="restaurant-detail-hero__branch">
                    <strong>{label}</strong>
                    {branch.address && (
                      <p className="restaurant-detail-hero__meta">{branch.address}</p>
                    )}
                    {mapsUrl && (
                      <p className="restaurant-detail-hero__meta">
                        <a href={mapsUrl} target="_blank" rel="noreferrer">
                          Google Maps
                        </a>
                      </p>
                    )}
                  </div>
                )
              })}
            </div>

            <NavButton
              variant="primary"
              className="food-detail-hero__cta"
              onClick={scrollToMenu}
            >
              View menu
            </NavButton>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

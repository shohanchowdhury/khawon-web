import { motion } from 'framer-motion'
import type { Ref } from 'react'
import { Link } from 'react-router-dom'
import type { RestaurantOut } from '@/types/api'
import { NavButton } from '@/components/NavButton'
import DetailHeader from '@/components/DetailHeader'
import DetailMeta from '@/components/DetailMeta'
import FoodImage from '@/components/FoodImage'

interface RestaurantDetailHeroProps {
  restaurant: RestaurantOut
  editHref?: string
  backHref: string | null
  backLabel: string
  backInNav?: boolean
  onBackAnchorRef?: Ref<HTMLDivElement | null>
  titleInNav?: boolean
  titleAnchorRef?: Ref<HTMLDivElement | null>
}

export default function RestaurantDetailHero({
  restaurant,
  editHref,
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
            name={restaurant.name}
            imageUrl={restaurant.image_url}
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
              title={restaurant.name}
              editHref={editHref}
              titleClassName="food-detail-hero__title"
              titleAnchorRef={titleAnchorRef}
              titleInNav={titleInNav}
              titleLayoutId="restaurant-detail-title"
            >
              {restaurant.area && <span className="badge badge--large">{restaurant.area}</span>}
              <DetailMeta
                rating={restaurant.average_rating}
                reviewCount={restaurant.review_count}
              />
            </DetailHeader>

            <div className="restaurant-detail-hero__links">
              {restaurant.address && (
                <p className="restaurant-detail-hero__meta">{restaurant.address}</p>
              )}
              {restaurant.phone && (
                <p className="restaurant-detail-hero__meta">
                  <a href={`tel:${restaurant.phone}`}>{restaurant.phone}</a>
                </p>
              )}
              {restaurant.google_maps_url && (
                <p className="restaurant-detail-hero__meta">
                  <a href={restaurant.google_maps_url} target="_blank" rel="noreferrer">
                    Google Maps
                  </a>
                </p>
              )}
              {restaurant.website_url && (
                <p className="restaurant-detail-hero__meta">
                  <a href={restaurant.website_url} target="_blank" rel="noreferrer">
                    Website
                  </a>
                </p>
              )}
            </div>

            {restaurant.food_types.length > 0 && (
              <div className="food-type-tags restaurant-detail-hero__tags">
                {restaurant.food_types.map((ft) => (
                  <span key={ft.id} className="tag">
                    {ft.name}
                  </span>
                ))}
              </div>
            )}

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

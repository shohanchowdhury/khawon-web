import { motion } from 'framer-motion'
import type { Ref } from 'react'
import { Link } from 'react-router-dom'
import type { FoodTypePopularOut } from '@/types/api'
import { NavButton } from '@/components/NavButton'
import DetailHeader from '@/components/DetailHeader'
import DetailMeta from '@/components/DetailMeta'
import FoodImage from '@/components/FoodImage'
import { getFoodDisplayImage, POSTER_FOODS } from '@/config/featuredFoods'

interface FoodDetailHeroProps {
  food: FoodTypePopularOut
  editHref?: string
  backHref: string
  backLabel: string
  backInNav?: boolean
  onBackAnchorRef?: Ref<HTMLDivElement | null>
  titleInNav?: boolean
  titleAnchorRef?: Ref<HTMLDivElement | null>
}

function getDetailImageUrl(food: FoodTypePopularOut): string | null {
  const poster = POSTER_FOODS.find(
    (entry) => entry.name.toLowerCase() === food.name.toLowerCase(),
  )
  return getFoodDisplayImage({ image_url: food.image_url, fallbackImage: poster?.fallbackImage })
}

export default function FoodDetailHero({
  food,
  editHref,
  backHref,
  backLabel,
  backInNav = false,
  onBackAnchorRef,
  titleInNav = false,
  titleAnchorRef,
}: FoodDetailHeroProps) {
  const imageUrl = getDetailImageUrl(food)

  function scrollToRestaurants() {
    document.getElementById('food-restaurants')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="food-detail-hero">
      <motion.div
        className="food-detail-hero__card"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="food-detail-hero__media">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={food.name}
              className="food-detail-hero__image"
              loading="eager"
              fetchPriority="high"
            />
          ) : (
            <FoodImage name={food.name} className="food-detail-hero__image" priority />
          )}
        </div>

        <div className="food-detail-hero__copy">
          <div ref={onBackAnchorRef} className="food-detail-hero__back">
            {!backInNav ? (
              <motion.div layoutId="food-detail-back">
                <Link to={backHref} className="back-link food-detail-hero__back-link">
                  {backLabel}
                </Link>
              </motion.div>
            ) : (
              <span className="food-detail-hero__back-placeholder" aria-hidden="true">
                {backLabel}
              </span>
            )}
          </div>

          <div className="food-detail-hero__body">
          <DetailHeader
            title={food.name}
            editHref={editHref}
            titleClassName="food-detail-hero__title"
            titleAnchorRef={titleAnchorRef}
            titleInNav={titleInNav}
            titleLayoutId="food-detail-title"
          >
            <DetailMeta
              rating={food.average_rating}
              reviewCount={food.review_count}
              restaurantCount={food.restaurant_count}
            />
          </DetailHeader>

          {food.description && (
            <p className="food-detail-hero__desc">{food.description}</p>
          )}

          <NavButton
            variant="primary"
            className="food-detail-hero__cta"
            onClick={scrollToRestaurants}
          >
            Find {food.name} near you
          </NavButton>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

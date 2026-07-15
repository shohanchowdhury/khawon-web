import { useEffect, useMemo, useRef, useState } from 'react'
import type { DishOut } from '@/types/api'
import RestaurantDishCard from '@/components/RestaurantDishCard'
import {
  dishCategorySlug,
  groupDishesByCategory,
} from '@/utils/groupDishesByCategory'
import {
  dishFoodTypeSlug,
  groupDishesByFoodType,
} from '@/utils/groupDishesByFoodType'

interface RestaurantMenuSectionProps {
  dishes: DishOut[]
  loading?: boolean
  initialFoodTypeId?: number
}

export default function RestaurantMenuSection({
  dishes,
  loading = false,
  initialFoodTypeId,
}: RestaurantMenuSectionProps) {
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null)
  const [selectedFoodTypeSlug, setSelectedFoodTypeSlug] = useState<string | null>(null)
  const initialFoodTypeHandled = useRef(false)

  const dishesForCategoryChips = useMemo(() => {
    if (!selectedFoodTypeSlug) return dishes
    return dishes.filter((dish) => dishFoodTypeSlug(dish) === selectedFoodTypeSlug)
  }, [dishes, selectedFoodTypeSlug])

  const dishesForFoodTypeChips = useMemo(() => {
    if (!selectedCategorySlug) return dishes
    return dishes.filter((dish) => dishCategorySlug(dish) === selectedCategorySlug)
  }, [dishes, selectedCategorySlug])

  const visibleCategoryGroups = useMemo(
    () => groupDishesByCategory(dishesForCategoryChips),
    [dishesForCategoryChips],
  )
  const visibleFoodTypeGroups = useMemo(
    () => groupDishesByFoodType(dishesForFoodTypeChips),
    [dishesForFoodTypeChips],
  )
  const showFoodTypeFilter = useMemo(() => {
    const allFoodTypeGroups = groupDishesByFoodType(dishes)
    return allFoodTypeGroups.some(
      (group) => group.label !== 'Other' || group.foodTypeId != null,
    )
  }, [dishes])

  useEffect(() => {
    setSelectedCategorySlug(null)
    setSelectedFoodTypeSlug(null)
    initialFoodTypeHandled.current = false
  }, [dishes])

  useEffect(() => {
    if (
      selectedCategorySlug &&
      !visibleCategoryGroups.some((category) => category.slug === selectedCategorySlug)
    ) {
      setSelectedCategorySlug(null)
    }
  }, [selectedCategorySlug, visibleCategoryGroups])

  useEffect(() => {
    if (
      selectedFoodTypeSlug &&
      !visibleFoodTypeGroups.some((foodType) => foodType.slug === selectedFoodTypeSlug)
    ) {
      setSelectedFoodTypeSlug(null)
    }
  }, [selectedFoodTypeSlug, visibleFoodTypeGroups])

  useEffect(() => {
    if (!initialFoodTypeId || initialFoodTypeHandled.current || dishes.length === 0) {
      return
    }

    const allFoodTypeGroups = groupDishesByFoodType(dishes)
    const match = allFoodTypeGroups.find((group) => group.foodTypeId === initialFoodTypeId)
    if (!match) return

    initialFoodTypeHandled.current = true
    setSelectedFoodTypeSlug(match.slug)
  }, [dishes, initialFoodTypeId])

  const filteredDishes = useMemo(() => {
    return dishes.filter((dish) => {
      if (selectedCategorySlug && dishCategorySlug(dish) !== selectedCategorySlug) {
        return false
      }
      if (selectedFoodTypeSlug && dishFoodTypeSlug(dish) !== selectedFoodTypeSlug) {
        return false
      }
      return true
    })
  }, [dishes, selectedCategorySlug, selectedFoodTypeSlug])

  const displayCategories = useMemo(
    () => groupDishesByCategory(filteredDishes),
    [filteredDishes],
  )

  if (loading) {
    return (
      <section id="restaurant-menu" className="restaurant-menu" aria-busy="true">
        <h2 className="restaurant-menu__heading">Menu</h2>
        <p className="loading">Loading menu...</p>
      </section>
    )
  }

  if (dishes.length === 0) {
    return (
      <section id="restaurant-menu" className="restaurant-menu">
        <h2 className="restaurant-menu__heading">Menu</h2>
        <p className="empty">No menu items yet.</p>
      </section>
    )
  }

  return (
    <section
      id="restaurant-menu"
      className={
        showFoodTypeFilter
          ? 'restaurant-menu restaurant-menu--with-food-type-filter'
          : 'restaurant-menu'
      }
    >
      <h2 className="restaurant-menu__heading">Menu</h2>

      <div className="restaurant-menu__filters">
        <div className="restaurant-menu__chips restaurant-menu__chips--category">
          <button
            type="button"
            className={
              selectedCategorySlug === null
                ? 'restaurant-menu__chip restaurant-menu__chip--active'
                : 'restaurant-menu__chip'
            }
            onClick={() => setSelectedCategorySlug(null)}
          >
            All categories
            <span className="restaurant-menu__chip-count">{dishesForCategoryChips.length}</span>
          </button>

          {visibleCategoryGroups.map((category) => (
            <button
              key={category.slug}
              type="button"
              className={
                selectedCategorySlug === category.slug
                  ? 'restaurant-menu__chip restaurant-menu__chip--active'
                  : 'restaurant-menu__chip'
              }
              onClick={() =>
                setSelectedCategorySlug((current) =>
                  current === category.slug ? null : category.slug,
                )
              }
            >
              {category.label}
              <span className="restaurant-menu__chip-count">{category.dishes.length}</span>
            </button>
          ))}
        </div>

        {showFoodTypeFilter && (
          <div className="restaurant-menu__chips restaurant-menu__chips--food-type">
            <button
              type="button"
              className={
                selectedFoodTypeSlug === null
                  ? 'restaurant-menu__chip restaurant-menu__chip--active'
                  : 'restaurant-menu__chip'
              }
              onClick={() => setSelectedFoodTypeSlug(null)}
            >
              All food types
              <span className="restaurant-menu__chip-count">{dishesForFoodTypeChips.length}</span>
            </button>

            {visibleFoodTypeGroups.map((foodType) => {
              const dishCount = foodType.categories.reduce(
                (total, category) => total + category.dishes.length,
                0,
              )

              return (
                <button
                  key={foodType.slug}
                  type="button"
                  className={
                    selectedFoodTypeSlug === foodType.slug
                      ? 'restaurant-menu__chip restaurant-menu__chip--active'
                      : 'restaurant-menu__chip'
                  }
                  onClick={() =>
                    setSelectedFoodTypeSlug((current) =>
                      current === foodType.slug ? null : foodType.slug,
                    )
                  }
                >
                  {foodType.label}
                  <span className="restaurant-menu__chip-count">{dishCount}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      <div className="restaurant-menu__sections">
        {displayCategories.length === 0 ? (
          <p className="empty">No dishes match the selected filters.</p>
        ) : (
          displayCategories.map((category) => (
            <section key={category.slug} className="restaurant-menu__category">
              <h3 className="restaurant-menu__category-title">{category.label}</h3>
              <div className="restaurant-menu__dishes">
                {category.dishes.map((dish) => (
                  <RestaurantDishCard key={dish.id} dish={dish} />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </section>
  )
}

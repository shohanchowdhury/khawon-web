import { Link } from 'react-router-dom'
import FoodCategoryNavItem from '@/components/FoodCategoryNavItem'
import type { FoodTypePopularOut } from '@/types/api'
import { partitionSidebarCategories } from '@/utils/foodsSidebarCategories'

interface FoodsCategorySidebarProps {
  categories: FoodTypePopularOut[]
  categoriesLoading: boolean
  categoriesError: string
  selectedCategory: string | null
  onSelectCategory: (name: string | null) => void
}

export default function FoodsCategorySidebar({
  categories,
  categoriesLoading,
  categoriesError,
  selectedCategory,
  onSelectCategory,
}: FoodsCategorySidebarProps) {
  const { selected, rest } = partitionSidebarCategories(
    categories,
    selectedCategory,
  )

  return (
    <aside className="foods-layout__split-sidebar">
      <div className="foods-sidebar__header">
        <div className="catalogue-header">
          <div>
            <h1>Foods</h1>
            <p className="muted">Browse by category</p>
          </div>
        </div>

        <p className="catalogue-crosslink muted">
          <Link to="/restaurants">Restaurants →</Link>
        </p>
      </div>

      {categoriesLoading && <p className="loading">Loading...</p>}
      {categoriesError && (
        <div className="error-box">
          <p>{categoriesError}</p>
        </div>
      )}

      <nav
        className="foods-layout__split-nav khawon-scrollbar"
        aria-label="Food categories"
      >
        <div className="foods-layout__split-nav-primary">
          <button
            type="button"
            className={
              selectedCategory === null
                ? 'foods-layout__split-nav-item foods-layout__split-nav-item--active'
                : 'foods-layout__split-nav-item'
            }
            onClick={() => onSelectCategory(null)}
          >
            All dishes
          </button>

          {selected && (
            <div className="foods-layout__split-nav-pinned">
              <FoodCategoryNavItem
                name={selected.name}
                restaurantCount={selected.restaurant_count}
                active
                pinned
                onSelect={() => onSelectCategory(selected.name)}
              />
            </div>
          )}
        </div>

        {rest.length > 0 && (
          <>
            {selected && (
              <p className="foods-layout__split-nav-label muted">All categories</p>
            )}
            <div className="foods-layout__split-nav-list">
              {rest.map((category) => (
                <FoodCategoryNavItem
                  key={category.id}
                  name={category.name}
                  restaurantCount={category.restaurant_count}
                  active={false}
                  onSelect={() => onSelectCategory(category.name)}
                />
              ))}
            </div>
          </>
        )}
      </nav>
    </aside>
  )
}

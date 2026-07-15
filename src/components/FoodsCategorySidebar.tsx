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
  const listCategories = selected ? rest : categories

  return (
    <aside className="foods-layout__split-sidebar">
      <div className="foods-sidebar__header">
        <h1>Foods</h1>
      </div>

      {categoriesLoading && <p className="loading">Loading...</p>}
      {categoriesError && (
        <div className="error-box">
          <p>{categoriesError}</p>
        </div>
      )}

      <nav className="foods-layout__split-nav" aria-label="Food categories">
        <div className="foods-layout__split-nav-primary">
          {selected ? (
            <FoodCategoryNavItem
              name={selected.name}
              restaurantCount={selected.restaurant_count}
              active
              onSelect={() => onSelectCategory(selected.name)}
              onClear={() => onSelectCategory(null)}
            />
          ) : (
            <button
              type="button"
              className="foods-category-nav-item foods-category-nav-item--active"
              onClick={() => onSelectCategory(null)}
            >
              <span
                className="foods-category-nav-item__thumb foods-category-nav-item__thumb--empty"
                aria-hidden="true"
              />
              <span className="foods-category-nav-item__copy">
                <span className="foods-category-nav-item__name">All dishes</span>
              </span>
            </button>
          )}
        </div>

        {listCategories.length > 0 && (
          <div className="foods-layout__split-nav-list khawon-scrollbar">
            {listCategories.map((category) => (
              <FoodCategoryNavItem
                key={category.id}
                name={category.name}
                restaurantCount={category.restaurant_count}
                active={false}
                onSelect={() => onSelectCategory(category.name)}
              />
            ))}
          </div>
        )}
      </nav>
    </aside>
  )
}

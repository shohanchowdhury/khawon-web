import { useEffect, useMemo, useState } from 'react'
import CanonicalDishGrid from '@/components/CanonicalDishGrid'
import FoodsCategorySidebar from '@/components/FoodsCategorySidebar'
import FoodsHomePanel from '@/components/FoodsHomePanel'
import FoodsSubTypeSection from '@/components/FoodsSubTypeSection'
import PageScroll from '@/components/PageScroll'
import { useFoodSubTypes } from '@/hooks/useFoodSubTypes'
import {
  DISH_BROWSE_PAGE_SIZE,
  useFoodsBrowseData,
  type FoodsBrowseData,
} from '@/hooks/useFoodsBrowseData'
import {
  getPopularPicks,
  POPULAR_HOME_LIMIT,
} from '@/utils/featuredDishes'

interface FoodsSplitLayoutProps {
  searchQuery: string
  browseData: FoodsBrowseData
  initialCategory?: string | null
}

export default function FoodsSplitLayout({
  searchQuery,
  browseData,
  initialCategory = null,
}: FoodsSplitLayoutProps) {
  const {
    categories,
    categoriesLoading,
    categoriesError,
    featuredDishes,
    featuredLoading,
  } = browseData
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSubType, setSelectedSubType] = useState<string | null>(null)
  const [dishPage, setDishPage] = useState(0)

  const trimmedQuery = searchQuery.trim()

  const selectedCategoryRecord = useMemo(
    () => categories.find((category) => category.name === selectedCategory) ?? null,
    [categories, selectedCategory],
  )

  const foodTypeId = selectedCategoryRecord?.id ?? null
  const { subTypes, loading: subTypesLoading, error: subTypesError } =
    useFoodSubTypes(trimmedQuery ? null : foodTypeId)

  const categoryBrowse = useFoodsBrowseData(
    searchQuery,
    selectedCategory,
    selectedSubType,
    dishPage,
    { loadSidebar: false },
  )

  useEffect(() => {
    setDishPage(0)
  }, [searchQuery, selectedCategory, selectedSubType])

  useEffect(() => {
    if (!initialCategory?.trim() || categoriesLoading) return

    const match = categories.find(
      (category) => category.name.toLowerCase() === initialCategory.trim().toLowerCase(),
    )
    if (match) {
      setSelectedCategory(match.name)
      setSelectedSubType(null)
    }
  }, [initialCategory, categories, categoriesLoading])

  const showFeatured = !trimmedQuery && !selectedCategory
  const showSubTypes = !trimmedQuery && selectedCategory != null
  const showDishGrid = Boolean(trimmedQuery || selectedCategory)

  const popular = useMemo(
    () => getPopularPicks(featuredDishes, POPULAR_HOME_LIMIT, new Set(), 'random'),
    [featuredDishes],
  )

  function handleSelectCategory(name: string | null) {
    setSelectedCategory(name)
    setSelectedSubType(null)
  }

  const pageModeClass = showFeatured
    ? 'foods-page--home'
    : selectedCategory
      ? 'foods-page--browse'
      : ''

  return (
    <div
      className={[
        'foods-page',
        'foods-layout',
        'foods-layout--split',
        pageModeClass,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <PageScroll className="foods-page__scroll foods-page__scroll--free">
        <div className="foods-layout__split">
          <FoodsCategorySidebar
            categories={categories}
            categoriesLoading={categoriesLoading}
            categoriesError={categoriesError}
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
          />

          <section className="foods-layout__split-main">
            {trimmedQuery && (
              <p className="catalogue-count muted foods-layout__search-label">
                Results for &ldquo;{trimmedQuery}&rdquo;
              </p>
            )}

            <div className="foods-category-chips foods-layout__split-chips">
              <button
                type="button"
                className={
                  selectedCategory === null
                    ? 'foods-category-chips__chip foods-category-chips__chip--active'
                    : 'foods-category-chips__chip'
                }
                onClick={() => handleSelectCategory(null)}
              >
                All
              </button>
              {categories.slice(0, 12).map((category) => (
                <button
                  key={category.id}
                  type="button"
                  className={
                    selectedCategory === category.name
                      ? 'foods-category-chips__chip foods-category-chips__chip--active'
                      : 'foods-category-chips__chip'
                  }
                  onClick={() => handleSelectCategory(category.name)}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {showFeatured && (
              <FoodsHomePanel dishes={popular} loading={featuredLoading} />
            )}

            {showSubTypes && selectedCategory && (
              <FoodsSubTypeSection
                foodTypeName={selectedCategory}
                subTypes={subTypes}
                loading={subTypesLoading}
                error={subTypesError}
                selectedSubType={selectedSubType}
                onSelectSubType={setSelectedSubType}
              />
            )}

            {showDishGrid && (
              <>
                <h2 className="foods-layout__section-title">
                  {selectedSubType
                    ? `${selectedSubType} dishes`
                    : selectedCategory
                      ? `${selectedCategory} dishes`
                      : 'Search results'}
                </h2>

                <CanonicalDishGrid
                  dishes={categoryBrowse.canonicalDishes}
                  loading={categoryBrowse.dishesLoading}
                  error={categoryBrowse.dishesError}
                  emptyMessage={
                    trimmedQuery
                      ? `No dishes match "${trimmedQuery}". Try the nav search.`
                      : selectedSubType
                        ? `No comparable dishes found for ${selectedSubType}.`
                        : selectedCategory
                          ? `No comparable dishes found for ${selectedCategory}.`
                          : 'Pick a category or search from the nav bar.'
                  }
                  countLabel={
                    !categoryBrowse.dishesLoading && categoryBrowse.dishesTotal > 0
                      ? `${categoryBrowse.dishesTotal} dish${
                          categoryBrowse.dishesTotal !== 1 ? 'es' : ''
                        } to compare${
                          selectedSubType
                            ? ` in ${selectedSubType}`
                            : selectedCategory
                              ? ` in ${selectedCategory}`
                              : ''
                        }`
                      : undefined
                  }
                  page={dishPage}
                  pageSize={DISH_BROWSE_PAGE_SIZE}
                  total={categoryBrowse.dishesTotal}
                  onPageChange={setDishPage}
                />
              </>
            )}
          </section>
        </div>
      </PageScroll>
    </div>
  )
}

import type { FoodSubTypeOut } from '@/types/api'
import FoodSubTypeCard from '@/components/FoodSubTypeCard'

interface FoodsSubTypeSectionProps {
  foodTypeName: string
  subTypes: FoodSubTypeOut[]
  loading?: boolean
  error?: string
  selectedSubType: string | null
  onSelectSubType: (name: string | null) => void
}

export default function FoodsSubTypeSection({
  foodTypeName,
  subTypes,
  loading = false,
  error = '',
  selectedSubType,
  onSelectSubType,
}: FoodsSubTypeSectionProps) {
  if (loading) {
    return (
      <section className="foods-subtype-section">
        <p className="loading">Loading varieties...</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="foods-subtype-section">
        <div className="error-box">
          <p>{error}</p>
        </div>
      </section>
    )
  }

  if (subTypes.length === 0) {
    return null
  }

  return (
    <section className="foods-subtype-section" aria-label={`${foodTypeName} varieties`}>
      <div className="foods-subtype-section__header">
        <h2 className="foods-subtype-section__title">{foodTypeName} varieties</h2>
        {selectedSubType && (
          <button
            type="button"
            className="foods-subtype-section__clear muted"
            onClick={() => onSelectSubType(null)}
          >
            All in {foodTypeName}
          </button>
        )}
      </div>

      <div className="foods-subtype-section__scroll">
        {subTypes.map((subType) => (
          <FoodSubTypeCard
            key={subType.id}
            subType={subType}
            active={selectedSubType === subType.name}
            onSelect={() =>
              onSelectSubType(
                selectedSubType === subType.name ? null : subType.name,
              )
            }
          />
        ))}
      </div>
    </section>
  )
}

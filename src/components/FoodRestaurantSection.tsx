import type { BrandListOut } from '@/types/api'
import FoodDetailRestaurantCard from '@/components/FoodDetailRestaurantCard'

interface FoodRestaurantSectionProps {
  restaurants: BrandListOut[]
  foodTypeId?: number
  searchQuery?: string
  foodName: string
}

export default function FoodRestaurantSection({
  restaurants,
  foodTypeId,
  searchQuery,
  foodName,
}: FoodRestaurantSectionProps) {
  if (restaurants.length === 0) {
    return <p className="empty">No restaurants serving this food yet.</p>
  }

  return (
    <div className="food-detail-restaurant-list">
      {restaurants.map((restaurant) => (
        <FoodDetailRestaurantCard
          key={restaurant.id}
          restaurant={restaurant}
          foodTypeId={foodTypeId}
          searchQuery={searchQuery}
          foodName={foodName}
        />
      ))}
    </div>
  )
}

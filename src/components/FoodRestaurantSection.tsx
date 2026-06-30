import type { FoodTypePopularOut, RestaurantOut } from '@/types/api'
import FoodDetailRestaurantCard from '@/components/FoodDetailRestaurantCard'

interface FoodRestaurantSectionProps {
  food: FoodTypePopularOut
  restaurants: RestaurantOut[]
  searchQuery?: string
}

export default function FoodRestaurantSection({
  food,
  restaurants,
  searchQuery,
}: FoodRestaurantSectionProps) {
  return (
    <section id="food-restaurants" className="food-restaurants">
      <div className="results-header">
        <h2>Top restaurants</h2>
        <p className="results-count">
          {restaurants.length} restaurant
          {restaurants.length !== 1 ? 's' : ''} serving {food.name}
        </p>
      </div>

      {restaurants.length === 0 ? (
        <p className="empty">No restaurants serve this food type yet.</p>
      ) : (
        <div className="restaurant-grid food-detail-restaurant-list">
          {restaurants.map((restaurant) => (
            <FoodDetailRestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              foodTypeId={food.id}
              searchQuery={searchQuery}
              foodName={food.name}
            />
          ))}
        </div>
      )}
    </section>
  )
}

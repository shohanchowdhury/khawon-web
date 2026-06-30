import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import AppNavBar from '@/components/AppNavBar'
import { NavBarProvider } from '@/context/NavBarContext'
import Landing from '@/pages/Landing'
import FoodDetail from '@/pages/FoodDetail'
import Foods from '@/pages/Foods'
import SearchResults from '@/pages/SearchResults'
import RestaurantDetail from '@/pages/RestaurantDetail'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Manage from '@/pages/Manage'
import EditFood from '@/pages/EditFood'
import EditRestaurant from '@/pages/EditRestaurant'
import RestaurantCatalogue from '@/pages/RestaurantCatalogue'

export default function AnimatedRoutes() {
  const location = useLocation()
  const layoutGroupId = /^\/food\/[^/]+$/.test(location.pathname)
    ? 'food-detail-header'
    : 'app-shell'

  return (
    <NavBarProvider>
      <LayoutGroup id={layoutGroupId}>
        <div className="route-shell">
          <AppNavBar />

          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              className="route-shell__content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.32,
                ease: 'easeInOut',
              }}
            >
              <Routes location={location}>
                <Route path="/" element={<Landing />} />
                <Route path="/foods" element={<Foods />} />
                <Route path="/food/:id" element={<FoodDetail />} />
                <Route path="/catalogue" element={<Navigate to="/foods" replace />} />
                <Route path="/restaurants" element={<RestaurantCatalogue />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/restaurant/:id" element={<RestaurantDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/contribute" element={<Navigate to="/manage" replace />} />
                <Route path="/manage" element={<Manage />} />
                <Route path="/manage/food/:id" element={<EditFood />} />
                <Route path="/manage/restaurant/:id" element={<EditRestaurant />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </div>
      </LayoutGroup>
    </NavBarProvider>
  )
}

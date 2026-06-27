import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Home from './pages/Home'
import SearchResults from './pages/SearchResults'
import RestaurantDetail from './pages/RestaurantDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import Contribute from './pages/Contribute'
import Manage from './pages/Manage'
import EditFood from './pages/EditFood'
import EditRestaurant from './pages/EditRestaurant'
import Catalogue from './pages/Catalogue'
import RestaurantCatalogue from './pages/RestaurantCatalogue'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/restaurants" element={<RestaurantCatalogue />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/restaurant/:id" element={<RestaurantDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contribute" element={<Contribute />} />
          <Route path="/manage" element={<Manage />} />
          <Route path="/manage/food/:id" element={<EditFood />} />
          <Route path="/manage/restaurant/:id" element={<EditRestaurant />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

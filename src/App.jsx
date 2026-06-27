import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Home from './pages/Home'
import SearchResults from './pages/SearchResults'
import RestaurantDetail from './pages/RestaurantDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import Contribute from './pages/Contribute'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/restaurant/:id" element={<RestaurantDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contribute" element={<Contribute />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

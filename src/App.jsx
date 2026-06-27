import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import SearchResults from './pages/SearchResults'
import RestaurantDetail from './pages/RestaurantDetail'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/restaurant/:id" element={<RestaurantDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

import { Navigate, useSearchParams } from 'react-router-dom'

/** Legacy alias — canonical search lives on /foods?q= */
export default function SearchResults() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q')?.trim()

  if (query) {
    return <Navigate to={`/foods?q=${encodeURIComponent(query)}`} replace />
  }

  return <Navigate to="/foods" replace />
}

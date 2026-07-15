import { useSearchParams } from 'react-router-dom'
import FoodsSplitLayout from '@/components/FoodsSplitLayout'
import { useFoodsBrowseData } from '@/hooks/useFoodsBrowseData'

export default function Foods() {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('q') ?? ''
  const initialCategory = searchParams.get('category')
  const browseData = useFoodsBrowseData(searchQuery)

  return (
    <FoodsSplitLayout
      searchQuery={searchQuery}
      browseData={browseData}
      initialCategory={initialCategory}
    />
  )
}

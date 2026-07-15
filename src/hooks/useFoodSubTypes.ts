import { useEffect, useState } from 'react'
import { getFoodSubTypes } from '@/api/client'
import type { FoodSubTypeOut } from '@/types/api'

export function useFoodSubTypes(foodTypeId: number | null) {
  const [subTypes, setSubTypes] = useState<FoodSubTypeOut[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (foodTypeId == null) {
      setSubTypes([])
      setLoading(false)
      setError('')
      return
    }

    setLoading(true)
    setError('')

    getFoodSubTypes(foodTypeId)
      .then((result) => setSubTypes(result.sub_types))
      .catch((err) => {
        setError(err instanceof Error ? err.message : String(err))
        setSubTypes([])
      })
      .finally(() => setLoading(false))
  }, [foodTypeId])

  return { subTypes, loading, error }
}

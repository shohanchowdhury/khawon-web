import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthModal } from '@/context/AuthModalContext'

export default function Login() {
  const { openAuthModal } = useAuthModal()
  const location = useLocation()
  const redirectTo =
    location.state && typeof location.state === 'object' && 'from' in location.state
      ? String((location.state as { from?: string }).from ?? '/')
      : '/'

  useEffect(() => {
    openAuthModal('login')
  }, [openAuthModal])

  return <Navigate to={redirectTo} replace />
}

import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthModal } from '@/context/AuthModalContext'

export default function Register() {
  const { openAuthModal } = useAuthModal()

  useEffect(() => {
    openAuthModal('register')
  }, [openAuthModal])

  return <Navigate to="/" replace />
}

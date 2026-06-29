import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { AuthModalProvider } from '@/context/AuthModalContext'
import { ThemeProvider } from '@/context/ThemeContext'
import AnimatedRoutes from '@/components/AnimatedRoutes'
import AuthModal from '@/components/AuthModal'
import ThemeTransition from '@/components/ThemeTransition'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AuthModalProvider>
          <BrowserRouter>
            <AnimatedRoutes />
            <AuthModal />
            <ThemeTransition />
          </BrowserRouter>
        </AuthModalProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

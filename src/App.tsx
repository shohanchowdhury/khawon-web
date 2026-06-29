import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'
import AnimatedRoutes from '@/components/AnimatedRoutes'
import ThemeTransition from '@/components/ThemeTransition'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AnimatedRoutes />
          <ThemeTransition />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

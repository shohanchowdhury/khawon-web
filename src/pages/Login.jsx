import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import NavBar from '../components/NavBar'

const DEV_CREDENTIALS = {
  username: 'shohanc',
  password: 'shohan123',
}

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function signIn(credentialsUsername, credentialsPassword) {
    setSubmitting(true)
    setError('')
    try {
      await login(credentialsUsername, credentialsPassword)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    await signIn(username, password)
  }

  async function handleDevSignIn() {
    await signIn(DEV_CREDENTIALS.username, DEV_CREDENTIALS.password)
  }

  return (
    <div className="page">
      <NavBar compact />
      <main className="page-content page-content--narrow auth-page">
        <h1>Sign in</h1>
        <p className="muted">Sign in to post reviews and add restaurants.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </label>
          {error && <p className="error">{error}</p>}
          <div className="auth-form__actions">
            <button type="submit" disabled={submitting}>
              {submitting ? 'Signing in...' : 'Sign in'}
            </button>
            {import.meta.env.DEV && (
              <button
                type="button"
                className="auth-form__dev-signin"
                onClick={handleDevSignIn}
                disabled={submitting}
              >
                Dev
              </button>
            )}
          </div>
        </form>

        <p className="auth-switch">
          No account? <Link to="/register">Register</Link>
        </p>
      </main>
    </div>
  )
}

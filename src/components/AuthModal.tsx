import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { useAuthModal } from '@/context/AuthModalContext'
import type { AuthModalMode } from '@/types/domain/authModal'

const DEV_CREDENTIALS = {
  username: 'shohanc',
  password: 'shohan123',
}

const MODAL_EASE = [0.22, 1, 0.36, 1] as const
const BACKDROP_TRANSITION = { duration: 0.22, ease: MODAL_EASE }
const DIALOG_TRANSITION = { type: 'spring' as const, stiffness: 420, damping: 32, mass: 0.85 }
const PANEL_TRANSITION = { duration: 0.2, ease: MODAL_EASE }
const PANEL_HEIGHT_TRANSITION = { duration: 0.32, ease: MODAL_EASE }

const TABS: { id: AuthModalMode; label: string }[] = [
  { id: 'login', label: 'Sign in' },
  { id: 'register', label: 'Sign up' },
]

export default function AuthModal() {
  const { isOpen, mode, closeAuthModal, openAuthModal } = useAuthModal()
  const { login, register, isAuthenticated } = useAuth()
  const titleId = useId()
  const tabsId = useId()
  const [mounted, setMounted] = useState(false)

  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const loginPanelRef = useRef<HTMLDivElement>(null)
  const registerPanelRef = useRef<HTMLDivElement>(null)
  const [panelHeights, setPanelHeights] = useState({ login: 0, register: 0 })

  const measurePanelHeights = useCallback(() => {
    setPanelHeights({
      login: loginPanelRef.current?.scrollHeight ?? 0,
      register: registerPanelRef.current?.scrollHeight ?? 0,
    })
  }, [])

  useLayoutEffect(() => {
    if (!isOpen) return undefined
    measurePanelHeights()
    const loginPanel = loginPanelRef.current
    const registerPanel = registerPanelRef.current
    if (!loginPanel && !registerPanel) return undefined

    const observer = new ResizeObserver(measurePanelHeights)
    if (loginPanel) observer.observe(loginPanel)
    if (registerPanel) observer.observe(registerPanel)
    return () => observer.disconnect()
  }, [isOpen, mode, error, measurePanelHeights])

  const activePanelHeight = mode === 'login' ? panelHeights.login : panelHeights.register

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isOpen) return undefined

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closeAuthModal()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, closeAuthModal])

  useEffect(() => {
    if (!isOpen) {
      setError('')
      setSubmitting(false)
      return
    }

    setError('')
    setSubmitting(false)
    if (mode === 'login') {
      setEmail('')
    }
  }, [isOpen, mode])

  useEffect(() => {
    if (isAuthenticated && isOpen) {
      closeAuthModal()
    }
  }, [isAuthenticated, isOpen, closeAuthModal])

  async function signIn(credentialsUsername: string, credentialsPassword: string) {
    setSubmitting(true)
    setError('')
    try {
      await login(credentialsUsername, credentialsPassword)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setSubmitting(false)
    }
  }

  async function handleLoginSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    await signIn(username, password)
  }

  async function handleDevSignIn() {
    setUsername(DEV_CREDENTIALS.username)
    setPassword(DEV_CREDENTIALS.password)
    await signIn(DEV_CREDENTIALS.username, DEV_CREDENTIALS.password)
  }

  async function handleRegisterSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await register(email, username, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setSubmitting(false)
    }
  }

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="auth-modal"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={BACKDROP_TRANSITION}
        >
          <motion.button
            type="button"
            className="auth-modal__backdrop"
            aria-label="Close sign in dialog"
            onClick={closeAuthModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={BACKDROP_TRANSITION}
          />
          <motion.div
            className="auth-modal__dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ opacity: 0, scale: 0.92, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={DIALOG_TRANSITION}
          >
            <h2 id={titleId} className="auth-modal__sr-title">
              {mode === 'login' ? 'Sign in' : 'Sign up'}
            </h2>

            <div className="auth-modal__header">
              <div
                id={tabsId}
                className="auth-modal__tabs"
                role="tablist"
                aria-label="Authentication"
              >
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    id={`${tabsId}-${tab.id}`}
                    className={`auth-modal__tab${mode === tab.id ? ' auth-modal__tab--active' : ''}`}
                    aria-selected={mode === tab.id}
                    aria-controls={`${tabsId}-${tab.id}-panel`}
                    onClick={() => openAuthModal(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="auth-modal__body">
              <motion.div
                className="auth-modal__panels"
                initial={false}
                animate={{ height: activePanelHeight > 0 ? activePanelHeight : 'auto' }}
                transition={PANEL_HEIGHT_TRANSITION}
              >
                <motion.div
                  ref={loginPanelRef}
                  id={`${tabsId}-login-panel`}
                  role="tabpanel"
                  aria-labelledby={`${tabsId}-login`}
                  aria-hidden={mode !== 'login'}
                  className={`auth-modal__panel${mode === 'login' ? ' auth-modal__panel--active' : ''}`}
                  animate={{ opacity: mode === 'login' ? 1 : 0 }}
                  transition={PANEL_TRANSITION}
                >
                  <p className="auth-modal__subtitle muted">
                    Sign in to post reviews and add restaurants.
                  </p>

                  <form className="auth-form auth-modal__form" onSubmit={handleLoginSubmit}>
                    <label>
                      Username
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        autoComplete="username"
                        tabIndex={mode === 'login' ? 0 : -1}
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
                        tabIndex={mode === 'login' ? 0 : -1}
                      />
                    </label>
                    <p className="auth-modal__error-slot">
                      {mode === 'login' && error ? <span className="error">{error}</span> : null}
                    </p>
                    <button type="submit" disabled={submitting} tabIndex={mode === 'login' ? 0 : -1}>
                      {submitting ? 'Signing in...' : 'Sign in'}
                    </button>
                    {import.meta.env.DEV && (
                      <button
                        type="button"
                        className="auth-form__dev-signin"
                        onClick={handleDevSignIn}
                        disabled={submitting}
                        tabIndex={mode === 'login' ? 0 : -1}
                      >
                        Dev
                      </button>
                    )}
                  </form>
                </motion.div>

                <motion.div
                  ref={registerPanelRef}
                  id={`${tabsId}-register-panel`}
                  role="tabpanel"
                  aria-labelledby={`${tabsId}-register`}
                  aria-hidden={mode !== 'register'}
                  className={`auth-modal__panel${mode === 'register' ? ' auth-modal__panel--active' : ''}`}
                  animate={{ opacity: mode === 'register' ? 1 : 0 }}
                  transition={PANEL_TRANSITION}
                >
                  <p className="auth-modal__subtitle muted">
                    Join Khawon to review restaurants and add new listings.
                  </p>

                  <form className="auth-form auth-modal__form" onSubmit={handleRegisterSubmit}>
                    <label>
                      Email
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                        tabIndex={mode === 'register' ? 0 : -1}
                      />
                    </label>
                    <label>
                      Username
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        minLength={3}
                        autoComplete="username"
                        tabIndex={mode === 'register' ? 0 : -1}
                      />
                    </label>
                    <label>
                      Password
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        autoComplete="new-password"
                        tabIndex={mode === 'register' ? 0 : -1}
                      />
                    </label>
                    <p className="auth-modal__error-slot">
                      {mode === 'register' && error ? <span className="error">{error}</span> : null}
                    </p>
                    <button type="submit" disabled={submitting} tabIndex={mode === 'register' ? 0 : -1}>
                      {submitting ? 'Creating account...' : 'Create account'}
                    </button>
                  </form>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

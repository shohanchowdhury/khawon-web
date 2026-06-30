import type { FormEvent } from 'react'
import AuthFormErrorSlot from '@/components/AuthFormErrorSlot'
import AuthFormField from '@/components/AuthFormField'

interface AuthLoginFormProps {
  email: string
  password: string
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  error?: string
  submitting: boolean
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onDevSignIn?: () => void
  inactive?: boolean
}

export default function AuthLoginForm({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  error,
  submitting,
  onSubmit,
  onDevSignIn,
  inactive = false,
}: AuthLoginFormProps) {
  const tabIndex = inactive ? -1 : 0

  return (
    <form className="auth-form auth-modal__form" onSubmit={onSubmit}>
      <AuthFormField
        label="Email address"
        type="email"
        value={email}
        onChange={onEmailChange}
        required
        autoComplete="email"
        placeholder="email@example.com"
        tabIndex={tabIndex}
      />
      <AuthFormField
        label="Password"
        type="password"
        value={password}
        onChange={onPasswordChange}
        required
        autoComplete="current-password"
        placeholder="Your password"
        tabIndex={tabIndex}
      />
      <AuthFormErrorSlot error={error} />
      <button type="submit" disabled={submitting} tabIndex={tabIndex}>
        {submitting ? 'Signing in...' : 'Sign in'}
      </button>
      {import.meta.env.DEV && onDevSignIn && (
        <button
          type="button"
          className="auth-form__dev-signin"
          onClick={onDevSignIn}
          disabled={submitting}
          tabIndex={tabIndex}
        >
          Dev sign in (shohanc)
        </button>
      )}
    </form>
  )
}

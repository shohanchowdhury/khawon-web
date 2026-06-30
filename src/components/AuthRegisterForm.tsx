import type { FormEvent } from 'react'
import AuthFormErrorSlot from '@/components/AuthFormErrorSlot'
import AuthFormField from '@/components/AuthFormField'

interface AuthRegisterFormProps {
  email: string
  username: string
  password: string
  onEmailChange: (value: string) => void
  onUsernameChange: (value: string) => void
  onPasswordChange: (value: string) => void
  error?: string
  submitting: boolean
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  inactive?: boolean
}

export default function AuthRegisterForm({
  email,
  username,
  password,
  onEmailChange,
  onUsernameChange,
  onPasswordChange,
  error,
  submitting,
  onSubmit,
  inactive = false,
}: AuthRegisterFormProps) {
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
        label="Username"
        type="text"
        value={username}
        onChange={onUsernameChange}
        required
        minLength={3}
        autoComplete="username"
        placeholder="Choose a username"
        tabIndex={tabIndex}
      />
      <AuthFormField
        label="Password"
        type="password"
        value={password}
        onChange={onPasswordChange}
        required
        minLength={6}
        autoComplete="new-password"
        placeholder="Minimum 6 characters"
        tabIndex={tabIndex}
      />
      <AuthFormErrorSlot error={error} />
      <button type="submit" disabled={submitting} tabIndex={tabIndex}>
        {submitting ? 'Creating account...' : 'Create account'}
      </button>
    </form>
  )
}

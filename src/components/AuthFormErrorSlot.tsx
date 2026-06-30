interface AuthFormErrorSlotProps {
  error?: string
}

export default function AuthFormErrorSlot({ error }: AuthFormErrorSlotProps) {
  return (
    <p className="auth-modal__error-slot">
      {error ? <span className="error">{error}</span> : null}
    </p>
  )
}

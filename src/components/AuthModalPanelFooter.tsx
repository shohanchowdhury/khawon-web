interface AuthModalPanelFooterProps {
  prompt: string
  actionLabel: string
  onAction: () => void
  inactive?: boolean
}

export default function AuthModalPanelFooter({
  prompt,
  actionLabel,
  onAction,
  inactive = false,
}: AuthModalPanelFooterProps) {
  const tabIndex = inactive ? -1 : 0

  return (
    <p className="auth-modal__footer muted">
      {prompt}{' '}
      <button type="button" className="auth-modal__switch" onClick={onAction} tabIndex={tabIndex}>
        {actionLabel}
      </button>
    </p>
  )
}

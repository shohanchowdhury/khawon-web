import { Link, type LinkProps } from 'react-router-dom'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type NavButtonVariant = 'primary' | 'default'

type NavButtonBaseProps = {
  variant?: NavButtonVariant
  className?: string
  children: ReactNode
}

function navBtnClass(variant: NavButtonVariant, className?: string): string {
  return ['nav-btn', variant === 'primary' ? 'nav-btn--primary' : '', className]
    .filter(Boolean)
    .join(' ')
}

export function NavButton({
  variant = 'default',
  className,
  children,
  type = 'button',
  ...props
}: NavButtonBaseProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={navBtnClass(variant, className)} {...props}>
      {children}
    </button>
  )
}

export function NavButtonLink({
  variant = 'default',
  className,
  children,
  ...props
}: NavButtonBaseProps & LinkProps) {
  return (
    <Link className={navBtnClass(variant, className)} {...props}>
      {children}
    </Link>
  )
}

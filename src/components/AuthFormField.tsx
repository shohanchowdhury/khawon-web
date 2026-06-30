import type { InputHTMLAttributes } from 'react'

export interface AuthFormFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  label: string
  value: string
  onChange: (value: string) => void
}

export default function AuthFormField({
  label,
  value,
  onChange,
  type = 'text',
  ...inputProps
}: AuthFormFieldProps) {
  return (
    <label>
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        {...inputProps}
      />
    </label>
  )
}

import type { ReactNode } from 'react'

export function Segment<T extends string>({
  label,
  value,
  options,
  onChange,
  format,
}: {
  label: string
  value: T
  options: readonly T[]
  onChange: (value: T) => void
  format?: (value: T) => string
}) {
  return (
    <fieldset className="control-group">
      <legend>{label}</legend>
      <div className="segmented-control">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className={value === option ? 'is-selected' : ''}
            aria-pressed={value === option}
            onClick={() => onChange(option)}
          >
            {format ? format(option) : option}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

/** An On/Off segment for boolean props. */
export function OnOff({
  label,
  value,
  onChange,
}: {
  label: string
  value: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <Segment
      label={label}
      value={value ? 'On' : 'Off'}
      options={['Off', 'On'] as const}
      onChange={(next) => onChange(next === 'On')}
    />
  )
}

/** A labelled live value under playground controls, with an optional note. */
export function Readout({
  title,
  value,
  children,
}: {
  title: string
  value: ReactNode
  children?: ReactNode
}) {
  return (
    <div className="coin-guide-readout" aria-live="polite">
      <span>{title}</span>
      <strong>{value}</strong>
      {children ? <p>{children}</p> : null}
    </div>
  )
}

export function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <div className="toggle-row">
      <label>
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
        />
        <span className="toggle-track" aria-hidden="true" />
        {label}
      </label>
    </div>
  )
}

/** Joins truthy class names. */
export function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ')
}

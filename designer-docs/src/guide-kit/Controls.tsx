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

export function Readout({ children }: { children: ReactNode }) {
  return (
    <p className="coin-new-readout" role="status">
      {children}
    </p>
  )
}

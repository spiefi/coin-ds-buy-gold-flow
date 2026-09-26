import type { ReactNode } from 'react'

// Documentation chrome shared by the Button Group, Bottom Nav Item, and
// Autoplay Control guides. New guides use ./guide-kit instead.

export function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ')
}

export { Segment } from './guide-kit'

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

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------

function SourceArrow() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" />
    </svg>
  )
}

export function SourceCards({
  figmaUrl,
  figmaDescription,
  storybookUrl,
  storybookDescription,
  stories,
  checked,
  children,
}: {
  figmaUrl: string
  figmaDescription: string
  storybookUrl: string
  storybookDescription: string
  stories: ReadonlyArray<{ label: string; url: string }>
  checked: string
  children: ReactNode
}) {
  return (
    <>
      <div className="sources-grid">
        <a href={figmaUrl} target="_blank" rel="noreferrer">
          <span className="source-index">01</span>
          <div>
            <h3>Coin Components Library</h3>
            <p>{figmaDescription}</p>
          </div>
          <SourceArrow />
        </a>
        <a href={storybookUrl} target="_blank" rel="noreferrer">
          <span className="source-index">02</span>
          <div>
            <h3>Canonical Storybook</h3>
            <p>{storybookDescription}</p>
          </div>
          <SourceArrow />
        </a>
      </div>
      <div className="coin-guide-story-links">
        {stories.map((story) => (
          <a
            key={story.url}
            className="source-link"
            href={story.url}
            target="_blank"
            rel="noreferrer"
          >
            {story.label}
            <SourceArrow />
          </a>
        ))}
      </div>
      <div className="verification-note">
        <span>{checked}</span>
        <p>{children}</p>
      </div>
    </>
  )
}

export { storyUrl } from './guide-kit'

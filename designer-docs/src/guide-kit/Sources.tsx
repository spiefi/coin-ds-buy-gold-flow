import type { ReactNode } from 'react'

const STORYBOOK = 'https://jfs-components-storybook.vercel.app'

/** Canonical Storybook story link, opened in the full Storybook UI. */
export function storyUrl(id: string) {
  return `${STORYBOOK}/?path=/story/${id}`
}

/** Canonical Storybook docs page for a component, e.g. docsUrl('badge'). */
export function docsUrl(component: string) {
  return `${STORYBOOK}/?path=/docs/components-${component}--docs`
}

export function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" />
    </svg>
  )
}

export function Sources({
  figmaUrl,
  storybookUrl,
  stories,
  checked,
  figmaDescription = 'Public component and designer properties',
  storybookDescription = 'Published examples and behavior',
  children,
}: {
  figmaUrl: string
  storybookUrl: string
  /** Story ids, e.g. { label: 'Default', id: 'components-badge--default' }. */
  stories: ReadonlyArray<{ label: string; id: string }>
  /** Date the sources were last verified, e.g. '23 September 2026'. */
  checked: string
  figmaDescription?: string
  storybookDescription?: string
  /** Verification note: versions, discrepancies, and limitations. */
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
          <ArrowIcon />
        </a>
        <a href={storybookUrl} target="_blank" rel="noreferrer">
          <span className="source-index">02</span>
          <div>
            <h3>Canonical Storybook</h3>
            <p>{storybookDescription}</p>
          </div>
          <ArrowIcon />
        </a>
      </div>
      <div className="gk-story-links">
        {stories.map((story) => (
          <a
            key={story.id}
            className="source-link"
            href={storyUrl(story.id)}
            target="_blank"
            rel="noreferrer"
          >
            {story.label}
            <ArrowIcon />
          </a>
        ))}
      </div>
      <div className="verification-note">
        <span>Checked {checked}</span>
        <p>{children}</p>
      </div>
    </>
  )
}

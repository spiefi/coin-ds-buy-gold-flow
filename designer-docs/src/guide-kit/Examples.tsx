import type { ReactNode } from 'react'

export function ExampleCard({
  title,
  children,
  description,
}: {
  title: string
  children: ReactNode
  description?: ReactNode
}) {
  return (
    <article className="coin-new-example-card">
      <div className="coin-new-example-stage">{children}</div>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
    </article>
  )
}

export function DoDont({
  good,
  bad,
  goodTitle,
  badTitle,
  goodCaption,
  badCaption,
}: {
  good: ReactNode
  bad: ReactNode
  goodTitle: string
  badTitle: string
  goodCaption: string
  badCaption: string
}) {
  return (
    <div className="comparison-row coin-new-comparison-row">
      <article className="comparison-card do-card">
        <p className="comparison-label">Do</p>
        <div className="comparison-preview coin-new-comparison-preview">{good}</div>
        <h3>{goodTitle}</h3>
        <p>{goodCaption}</p>
      </article>
      <article className="comparison-card dont-card">
        <p className="comparison-label">Don’t</p>
        <div className="comparison-preview coin-new-comparison-preview">{bad}</div>
        <h3>{badTitle}</h3>
        <p>{badCaption}</p>
      </article>
    </div>
  )
}

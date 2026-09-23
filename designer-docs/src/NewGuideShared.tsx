import { useEffect, useRef, useState, type ReactNode } from 'react'

export function GuideSegment<T extends string>({ label, value, options, onChange }: {
  label: string
  value: T
  options: readonly T[]
  onChange: (value: T) => void
}) {
  return <fieldset className="control-group"><legend>{label}</legend><div className="segmented-control">
    {options.map(option => <button key={option} type="button" className={value === option ? 'is-selected' : ''} aria-pressed={value === option} onClick={() => onChange(option)}>{option}</button>)}
  </div></fieldset>
}

export function GuideSources({ figmaUrl, storybookUrl, stories, note }: {
  figmaUrl: string
  storybookUrl: string
  stories: readonly { label: string; id: string }[]
  note: ReactNode
}) {
  return <>
    <div className="sources-grid">
      <a href={figmaUrl} target="_blank" rel="noreferrer"><span className="source-index">01</span><div><h3>Coin Components Library</h3><p>Public component and designer properties</p></div><span aria-hidden="true">↗</span></a>
      <a href={storybookUrl} target="_blank" rel="noreferrer"><span className="source-index">02</span><div><h3>Canonical Storybook</h3><p>Published examples and behavior</p></div><span aria-hidden="true">↗</span></a>
    </div>
    <div className="coin-new-story-links">{stories.map(story => <a key={story.id} href={`https://jfs-components-storybook.vercel.app/iframe.html?id=${story.id}&viewMode=story`} target="_blank" rel="noreferrer">{story.label}</a>)}</div>
    <div className="verification-note"><span>Checked 23 September 2026</span><p>{note}</p></div>
  </>
}

type AnatomyTarget = {
  selector: string
  label: string
  description: string
  /** Point to a visible edge or region of the real rendered part. */
  anchorX?: number
  anchorY?: number
  /** A short, straight leader placed beside this measured point. */
  side?: 'left' | 'top' | 'right'
}

export function GuideAnatomy({ children, targets }: { children: ReactNode; targets: readonly AnatomyTarget[] }) {
  const stageRef = useRef<HTMLDivElement>(null)
  const [marks, setMarks] = useState<({ x: number; y: number } | null)[]>([])
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const measure = () => {
      const frame = stage.getBoundingClientRect()
      setMarks(targets.map(target => {
        const rect = stage.querySelector(target.selector)?.getBoundingClientRect()
        return rect ? {
          x: rect.left - frame.left + rect.width * (target.anchorX ?? .5),
          y: rect.top - frame.top + rect.height * (target.anchorY ?? 0),
        } : null
      }))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(stage)
    stage.querySelectorAll<HTMLElement>('*').forEach(element => observer.observe(element))
    document.fonts.ready.then(measure)
    return () => observer.disconnect()
  }, [targets])

  return <div className="anatomy-card coin-new-anatomy-card">
    <div className="coin-new-anatomy-stage" ref={stageRef}>
      <div className="coin-new-anatomy-live">{children}</div>
      <svg className="coin-new-anatomy-leaders" aria-hidden="true">
        {marks.map((mark, index) => {
          if (!mark) return null
          const side = targets[index].side
          if (side === 'left') return <line key={index} x1={mark.x - 24} y1={mark.y} x2={mark.x} y2={mark.y} />
          if (side === 'top') return <line key={index} x1={mark.x} y1={mark.y - 24} x2={mark.x} y2={mark.y} />
          if (side === 'right') return <line key={index} x1={mark.x} y1={mark.y} x2={mark.x + 24} y2={mark.y} />
          const markerX = stageRef.current?.clientWidth ? stageRef.current.clientWidth * (index + 1) / (targets.length + 1) : 0
          const elbowY = 76 + index * 10
          return <polyline key={index} points={`${markerX},47 ${markerX},${elbowY} ${mark.x},${elbowY} ${mark.x},${mark.y}`} />
        })}
      </svg>
      {targets.map((target, index) => {
        const mark = marks[index]
        if (!mark) return null
        const side = target.side
        const centerX = side === 'left' ? mark.x - 34 : side === 'right' ? mark.x + 34 : mark.x
        const centerY = side === 'top' ? mark.y - 34 : side ? mark.y : 37
        return <span className="coin-new-anatomy-marker" key={target.label} style={{ left: side ? centerX : `${(index + 1) * 100 / (targets.length + 1)}%`, top: centerY - 10 }}>{index + 1}</span>
      })}
    </div>
    <ol className="anatomy-list">{targets.map((target, index) => <li key={target.label}><b><em className="coin-new-legend-number">{index + 1}</em>{target.label}</b><span>{target.description}</span></li>)}</ol>
  </div>
}

export function GuideExampleCard({ title, children, description }: { title: string; children: ReactNode; description?: ReactNode }) {
  return <article className="coin-new-example-card"><div className="coin-new-example-stage">{children}</div><h3>{title}</h3>{description && <p>{description}</p>}</article>
}

export function GuideDoDont({ good, bad, goodTitle, badTitle, goodCaption, badCaption }: {
  good: ReactNode; bad: ReactNode; goodTitle: string; badTitle: string; goodCaption: string; badCaption: string
}) {
  return <div className="comparison-row coin-new-comparison-row">
    <article className="comparison-card do-card"><p className="comparison-label">Do</p><div className="comparison-preview coin-new-comparison-preview">{good}</div><h3>{goodTitle}</h3><p>{goodCaption}</p></article>
    <article className="comparison-card dont-card"><p className="comparison-label">Don’t</p><div className="comparison-preview coin-new-comparison-preview">{bad}</div><h3>{badTitle}</h3><p>{badCaption}</p></article>
  </div>
}

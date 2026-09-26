import {
  useLayoutEffect,
  useState,
  type ReactNode,
  type RefObject,
} from 'react'

// Documentation chrome shared by the Button Group, Bottom Nav Item, and
// Autoplay Control guides. Nothing here renders or patches a Coin component.

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
// Measured anatomy
// ---------------------------------------------------------------------------

export type AnatomyBox = { left: number; top: number; width: number; height: number }

export type AnatomyShape =
  | { kind: 'bounds' | 'child' | 'gap'; box: AnatomyBox }
  | { kind: 'dimension'; path: string; label: string; x: number; y: number; align?: 'start' | 'middle' | 'end' }

export type AnatomyPin = { number: number; x: number; y: number; path: string }

export type AnatomyLayout = {
  width: number
  height: number
  pins: AnatomyPin[]
  shapes: AnatomyShape[]
}

export const PIN_RADIUS = 11

export function measureBox(node: Element, frame: DOMRect): AnatomyBox {
  const rect = node.getBoundingClientRect()
  return {
    left: rect.left - frame.left,
    top: rect.top - frame.top,
    width: rect.width,
    height: rect.height,
  }
}

export function clampPin(x: number, y: number, width: number, height: number) {
  const inset = PIN_RADIUS + 3
  return {
    x: Math.min(Math.max(x, inset), width - inset),
    y: Math.min(Math.max(y, inset), height - inset),
  }
}

function layoutSignature(layout: AnatomyLayout) {
  return JSON.stringify(layout, (_key, item) =>
    typeof item === 'number' ? Math.round(item * 10) / 10 : item,
  )
}

export function useAnatomyLayout(
  ref: RefObject<HTMLDivElement | null>,
  read: (frame: HTMLDivElement) => AnatomyLayout | null,
) {
  const [layout, setLayout] = useState<AnatomyLayout | null>(null)

  useLayoutEffect(() => {
    const frame = ref.current
    if (!frame) return
    let active = true
    let signature = ''
    const measure = () => {
      if (!active) return
      const next = read(frame)
      if (!next) return
      const nextSignature = layoutSignature(next)
      if (nextSignature === signature) return
      signature = nextSignature
      setLayout(next)
    }
    const observer =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure)
    observer?.observe(frame)
    frame.querySelectorAll('[data-anatomy-target]').forEach((node) => observer?.observe(node))
    const frameId = requestAnimationFrame(measure)
    void document.fonts?.ready.then(measure)
    window.addEventListener('resize', measure)
    return () => {
      active = false
      cancelAnimationFrame(frameId)
      observer?.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [read, ref])

  return layout
}

export function AnatomyOverlay({ layout }: { layout: AnatomyLayout | null }) {
  if (!layout || layout.width <= 0 || layout.height <= 0) return null
  return (
    <>
      <svg
        className="coin-guide-anatomy-svg"
        viewBox={`0 0 ${layout.width} ${layout.height}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {layout.shapes.map((shape, index) =>
          shape.kind === 'dimension' ? (
            <g className="coin-guide-anatomy-dimension" key={`shape-${index}`}>
              <path d={shape.path} />
              <text x={shape.x} y={shape.y} textAnchor={shape.align ?? 'middle'}>
                {shape.label}
              </text>
            </g>
          ) : (
            <rect
              className={`coin-guide-anatomy-${shape.kind}`}
              key={`shape-${index}`}
              x={shape.box.left}
              y={shape.box.top}
              width={Math.max(0, shape.box.width)}
              height={Math.max(0, shape.box.height)}
              rx={shape.kind === 'gap' ? 2 : 6}
            />
          ),
        )}
        {layout.pins.map((pin) => (
          <path className="coin-guide-anatomy-leader" d={pin.path} key={`leader-${pin.number}`} />
        ))}
      </svg>
      {layout.pins.map((pin) => (
        <span
          className="coin-guide-anatomy-pin"
          style={{ left: pin.x - PIN_RADIUS, top: pin.y - PIN_RADIUS }}
          key={`pin-${pin.number}`}
          aria-hidden="true"
        >
          {pin.number}
        </span>
      ))}
    </>
  )
}

export function AnatomyKey({
  number,
  label,
  children,
}: {
  number: number
  label: string
  children: ReactNode
}) {
  return (
    <li>
      <span className="coin-guide-anatomy-key" aria-hidden="true">{number}</span>
      <b>{label}</b>
      <span>{children}</span>
    </li>
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

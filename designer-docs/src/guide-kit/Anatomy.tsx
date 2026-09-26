import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'

// Documentation chrome only. Anatomy measures a live Coin instance and draws
// pins, leaders, and a numbered legend around it. It never styles or patches
// the component it annotates.

export type AnatomySide = 'top' | 'right' | 'bottom' | 'left'

export type AnatomyPart = {
  /** Legend name, one to three words. */
  name: string
  /** One short sentence shown in the legend. */
  note: string
  /** CSS selector resolved inside the specimen. Prefer byTestId(). */
  target: string
  /** Which side of the specimen the pin sits on. */
  side: AnatomySide
  /** Where the leader lands along the target's facing edge, 0–1. Default 0.5. */
  at?: number
}

export function byTestId(id: string) {
  return `[data-testid="${id}"]`
}

const PIN = 22
const LANE_GAP = 20
const PIN_SPACING = PIN + 8
const STAGE_PADDING = 56
const AUTO_STEPS = [3, 2.5, 2, 1.5] as const
const AUTO_MAX_WIDTH = 280
const AUTO_MAX_HEIGHT = 120
const MAX_NAME_LENGTH = 28
const MAX_NOTE_LENGTH = 120

type Point = { x: number; y: number }
type Box = { left: number; top: number; right: number; bottom: number }
type PinLayout = { number: number; x: number; y: number; anchor: Point; path: string }
type Geometry = {
  scale: number
  innerWidth: number | undefined
  frameWidth: number
  frameHeight: number
  stageWidth: number
  stageHeight: number
  pins: PinLayout[]
  issues: string[]
}

const INITIAL: Geometry = {
  scale: 1,
  innerWidth: undefined,
  frameWidth: 0,
  frameHeight: 0,
  stageWidth: 0,
  stageHeight: 0,
  pins: [],
  issues: [],
}

function pickScale(
  width: number,
  height: number,
  available: number,
  mode: 'auto' | number,
) {
  if (width <= 0 || height <= 0) return 1
  const fitting = Math.min(1, available / width)
  if (typeof mode === 'number') return Math.min(mode, available / width)
  for (const step of AUTO_STEPS) {
    if (
      width * step <= AUTO_MAX_WIDTH &&
      height * step <= AUTO_MAX_HEIGHT &&
      width * step <= available
    ) {
      return step
    }
  }
  return fitting
}

function relativeBox(rect: DOMRect, origin: DOMRect): Box {
  return {
    left: rect.left - origin.left,
    top: rect.top - origin.top,
    right: rect.right - origin.left,
    bottom: rect.bottom - origin.top,
  }
}

function anchorPoint(box: Box, side: AnatomySide, at: number): Point {
  const t = Math.min(Math.max(at, 0), 1)
  const x = box.left + (box.right - box.left) * t
  const y = box.top + (box.bottom - box.top) * t
  if (side === 'top') return { x, y: box.top }
  if (side === 'bottom') return { x, y: box.bottom }
  if (side === 'left') return { x: box.left, y }
  return { x: box.right, y }
}

/** Spread pins that share a lane so they never overlap, keeping order. */
function spread(values: number[], min: number, max: number) {
  const order = values.map((value, index) => ({ value, index })).sort((a, b) => a.value - b.value)
  const placed = order.map((item) => item.value)
  for (let i = 1; i < placed.length; i += 1) {
    placed[i] = Math.max(placed[i], placed[i - 1] + PIN_SPACING)
  }
  const overflow = placed.length ? placed[placed.length - 1] - max : 0
  if (overflow > 0) {
    for (let i = placed.length - 1; i >= 0; i -= 1) {
      placed[i] -= overflow
      if (i > 0) placed[i - 1] = Math.min(placed[i - 1], placed[i] - PIN_SPACING)
    }
  }
  const result = new Array<number>(values.length)
  order.forEach((item, i) => {
    result[item.index] = Math.max(placed[i], min)
  })
  return result
}

function leaderPath(side: AnatomySide, pin: Point, anchor: Point, frame: Box) {
  const r = PIN / 2
  const straight =
    side === 'top' || side === 'bottom'
      ? Math.abs(pin.x - anchor.x) < 0.5
      : Math.abs(pin.y - anchor.y) < 0.5
  if (side === 'top') {
    const knee = frame.top - LANE_GAP / 2
    return straight
      ? `M${pin.x} ${pin.y + r}V${anchor.y}`
      : `M${pin.x} ${pin.y + r}V${knee}H${anchor.x}V${anchor.y}`
  }
  if (side === 'bottom') {
    const knee = frame.bottom + LANE_GAP / 2
    return straight
      ? `M${pin.x} ${pin.y - r}V${anchor.y}`
      : `M${pin.x} ${pin.y - r}V${knee}H${anchor.x}V${anchor.y}`
  }
  if (side === 'left') {
    const knee = frame.left - LANE_GAP / 2
    return straight
      ? `M${pin.x + r} ${pin.y}H${anchor.x}`
      : `M${pin.x + r} ${pin.y}H${knee}V${anchor.y}H${anchor.x}`
  }
  const knee = frame.right + LANE_GAP / 2
  return straight
    ? `M${pin.x - r} ${pin.y}H${anchor.x}`
    : `M${pin.x - r} ${pin.y}H${knee}V${anchor.y}H${anchor.x}`
}

function signature(geometry: Geometry) {
  return JSON.stringify(geometry, (_key, value) =>
    typeof value === 'number' ? Math.round(value * 10) / 10 : value,
  )
}

const reported = new Set<string>()

function report(title: string, issues: string[]) {
  if (!import.meta.env.DEV || typeof window === 'undefined') return
  const store = ((window as unknown as { __guideKit?: Record<string, string[]> }).__guideKit ??= {})
  store[title] = issues
  for (const issue of issues) {
    const key = `${window.location.search}|${title}|${issue}`
    if (reported.has(key)) continue
    reported.add(key)
    console.warn(`[guide-kit] Anatomy "${title}": ${issue}`)
  }
}

export function Anatomy({
  parts,
  children,
  scale: scaleMode = 'auto',
  specimenWidth,
  surface = 'light',
  title = 'Anatomy',
}: {
  parts: readonly AnatomyPart[]
  children: ReactNode
  /** 'auto' enlarges small specimens in fixed steps (1.5×–3×). */
  scale?: 'auto' | number
  /** Layout width for specimens that fill their host, such as rows. */
  specimenWidth?: number
  surface?: 'light' | 'dark'
  /** Identifies this diagram in self-check warnings. */
  title?: string
}) {
  const stageRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const [geometry, setGeometry] = useState<Geometry>(INITIAL)
  const geometryRef = useRef(geometry)
  geometryRef.current = geometry
  const reportTimer = useRef<number | undefined>(undefined)
  const measureRef = useRef<() => void>(() => {})

  measureRef.current = () => {
    const stage = stageRef.current
    const inner = innerRef.current
    if (!stage || !inner) return
    const current = geometryRef.current
    const stageWidth = stage.clientWidth
    const available = Math.max(stageWidth - STAGE_PADDING * 2, 40)
    const innerWidth = specimenWidth ? Math.min(specimenWidth, available) : undefined
    if (innerWidth !== current.innerWidth) {
      setGeometry({ ...current, innerWidth })
      return
    }

    const naturalWidth = inner.offsetWidth
    const naturalHeight = inner.offsetHeight
    const scale = pickScale(naturalWidth, naturalHeight, available, scaleMode)
    const frameWidth = naturalWidth * scale
    const frameHeight = naturalHeight * scale
    if (
      Math.abs(scale - current.scale) > 0.001 ||
      Math.abs(frameWidth - current.frameWidth) > 0.5 ||
      Math.abs(frameHeight - current.frameHeight) > 0.5
    ) {
      setGeometry({ ...current, scale, frameWidth, frameHeight })
      return
    }

    const stageRect = stage.getBoundingClientRect()
    const frame = relativeBox(inner.getBoundingClientRect(), stageRect)
    const stageHeight = stage.clientHeight
    const issues: string[] = []
    const anchors = parts.map((part, index) => {
      if (part.name.length > MAX_NAME_LENGTH) {
        issues.push(`part ${index + 1} name is longer than ${MAX_NAME_LENGTH} characters`)
      }
      if (part.note.length > MAX_NOTE_LENGTH) {
        issues.push(`part ${index + 1} note is longer than ${MAX_NOTE_LENGTH} characters`)
      }
      const node = inner.querySelector(part.target)
      if (!node) {
        issues.push(`part ${index + 1} "${part.name}" target ${part.target} matched nothing`)
        return null
      }
      const box = relativeBox(node.getBoundingClientRect(), stageRect)
      return anchorPoint(box, part.side, part.at ?? 0.5)
    })

    const pins: PinLayout[] = []
    for (const side of ['top', 'right', 'bottom', 'left'] as const) {
      const indexes = parts
        .map((part, index) => (part.side === side && anchors[index] ? index : -1))
        .filter((index) => index >= 0)
      if (!indexes.length) continue
      const horizontalLane = side === 'top' || side === 'bottom'
      const laneLength = horizontalLane ? stageWidth : stageHeight
      const along = spread(
        indexes.map((index) => (horizontalLane ? anchors[index]!.x : anchors[index]!.y)),
        PIN / 2 + 4,
        laneLength - PIN / 2 - 4,
      )
      const offset = LANE_GAP + PIN / 2
      indexes.forEach((index, i) => {
        const anchor = anchors[index]!
        const pin =
          side === 'top'
            ? { x: along[i], y: frame.top - offset }
            : side === 'bottom'
              ? { x: along[i], y: frame.bottom + offset }
              : side === 'left'
                ? { x: frame.left - offset, y: along[i] }
                : { x: frame.right + offset, y: along[i] }
        pins.push({ number: index + 1, ...pin, anchor, path: leaderPath(side, pin, anchor, frame) })
      })
    }

    pins.sort((a, b) => a.number - b.number)
    for (const pin of pins) {
      const r = PIN / 2
      if (pin.x - r < 0 || pin.y - r < 0 || pin.x + r > stageWidth || pin.y + r > stageHeight) {
        issues.push(`pin ${pin.number} is clipped by the stage edge`)
      }
      for (const other of pins) {
        if (other.number <= pin.number) continue
        if (Math.hypot(pin.x - other.x, pin.y - other.y) < PIN) {
          issues.push(`pins ${pin.number} and ${other.number} overlap`)
        }
      }
    }

    const next: Geometry = {
      scale,
      innerWidth,
      frameWidth,
      frameHeight,
      stageWidth,
      stageHeight,
      pins,
      issues,
    }
    if (signature(next) !== signature(current)) setGeometry(next)
    // Report only once the layout has settled, so transient states stay quiet.
    window.clearTimeout(reportTimer.current)
    reportTimer.current = window.setTimeout(() => report(title, issues), 600)
  }

  // Re-measure after every render; measure only sets state when geometry
  // changes, so this converges in a couple of passes.
  useLayoutEffect(() => {
    measureRef.current()
  })

  useLayoutEffect(() => {
    const stage = stageRef.current
    const inner = innerRef.current
    if (!stage || !inner) return
    const measure = () => measureRef.current()
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure)
    observer?.observe(stage)
    observer?.observe(inner)
    const settleId = window.setTimeout(measure, 300)
    void document.fonts?.ready.then(measure)
    window.addEventListener('resize', measure)
    inner.addEventListener('load', measure, true)
    return () => {
      observer?.disconnect()
      window.clearTimeout(settleId)
      window.clearTimeout(reportTimer.current)
      window.removeEventListener('resize', measure)
      inner.removeEventListener('load', measure, true)
    }
  }, [])

  const shownScale = Math.round(geometry.scale * 10) / 10

  return (
    <div className={`gk-anatomy${surface === 'dark' ? ' is-dark' : ''}`}>
      <div
        className="gk-anatomy-stage"
        ref={stageRef}
        data-anatomy-issues={geometry.issues.length}
      >
        {shownScale > 1 && <span className="gk-anatomy-zoom">Shown at {shownScale}×</span>}
        <div
          className="gk-anatomy-frame"
          style={{ width: geometry.frameWidth, height: geometry.frameHeight }}
          aria-hidden="true"
          inert
        >
          <div
            className="gk-anatomy-specimen"
            ref={innerRef}
            style={{
              width: geometry.innerWidth,
              transform: geometry.scale === 1 ? undefined : `scale(${geometry.scale})`,
            }}
          >
            {children}
          </div>
        </div>
        {geometry.stageWidth > 0 && (
          <svg
            className="gk-anatomy-leaders"
            width={geometry.stageWidth}
            height={geometry.stageHeight}
            aria-hidden="true"
          >
            {geometry.pins.map((pin) => (
              <g key={pin.number}>
                <path d={pin.path} />
                <circle cx={pin.anchor.x} cy={pin.anchor.y} r={3} />
              </g>
            ))}
          </svg>
        )}
        {geometry.pins.map((pin) => (
          <span
            className="gk-pin gk-anatomy-pin"
            style={{ left: pin.x - PIN / 2, top: pin.y - PIN / 2 }}
            aria-hidden="true"
            key={pin.number}
          >
            {pin.number}
          </span>
        ))}
      </div>
      <ol className="gk-anatomy-legend">
        {parts.map((part, index) => (
          <li key={part.name}>
            <span className="gk-pin" aria-hidden="true">{index + 1}</span>
            <b>{part.name}</b>
            <span>{part.note}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

/** Lays out several captioned specimens side by side inside one Anatomy. */
export function SpecimenRow({ children }: { children: ReactNode }) {
  return <div className="gk-specimen-row">{children}</div>
}

export function Specimen({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    <div className="gk-specimen">
      {children}
      <span className="gk-specimen-caption">{caption}</span>
    </div>
  )
}

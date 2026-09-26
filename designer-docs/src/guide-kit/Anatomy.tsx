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
  target?: string
  /** Point at the space between two elements instead of an element. */
  between?: readonly [string, string]
  /** Which side of the specimen the pin sits on. */
  side: AnatomySide
  /** Where the leader lands along the target's facing edge, 0–1. Default 0.5. */
  at?: number
}

/**
 * Measured teaching marks drawn on the stage. Outlines show component or
 * child bounds, gaps show the space between two elements, and size marks
 * label a dimension in unscaled px.
 */
export type AnatomyMark =
  | { kind: 'outline'; target: string; variant?: 'bounds' | 'child'; each?: boolean }
  | { kind: 'gap'; from: string; to: string; label?: boolean }
  | { kind: 'size'; target: string; side: AnatomySide; label?: 'auto' | 'both' }
  | { kind: 'padding'; target: string }

export function byTestId(id: string) {
  return `[data-testid="${id}"]`
}

const PIN = 22
const LANE_GAP = 20
const PIN_SPACING = PIN + 8
const STAGE_PADDING = 56
const BARE_PADDING = 20
const AUTO_STEPS = [3, 2.5, 2, 1.5] as const
const AUTO_MAX_WIDTH = 280
const AUTO_MAX_HEIGHT = 240
const MAX_NAME_LENGTH = 28
const MAX_NOTE_LENGTH = 120

type Point = { x: number; y: number }
type Box = { left: number; top: number; right: number; bottom: number }
type PinLayout = { number: number; x: number; y: number; anchor: Point; path: string }
type MarkLayout =
  | { type: 'rect'; variant: 'bounds' | 'child' | 'gap' | 'padding'; x: number; y: number; w: number; h: number }
  | { type: 'dimension'; path: string; x: number; y: number; text: string }
type Geometry = {
  scale: number
  innerWidth: number | undefined
  frameWidth: number
  frameHeight: number
  stageWidth: number
  stageHeight: number
  pins: PinLayout[]
  marks: MarkLayout[]
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
  marks: [],
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

/** The space between two boxes: side by side if they do not overlap horizontally, else stacked. */
function gapBox(from: Box, to: Box): Box | null {
  const horizontal = to.left >= from.right - 0.5
  const box: Box = horizontal
    ? { left: from.right, right: to.left, top: Math.min(from.top, to.top), bottom: Math.max(from.bottom, to.bottom) }
    : { left: Math.min(from.left, to.left), right: Math.max(from.right, to.right), top: from.bottom, bottom: to.top }
  return box.right - box.left > 0 && box.bottom - box.top > 0 ? box : null
}

const DIMENSION_OFFSET = 12
const TICK = 4

function formatPx(value: number) {
  const rounded = Math.round(value * 2) / 2
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1)
}

function dimensionMark(box: Box, side: AnatomySide, text: string): MarkLayout {
  if (side === 'top' || side === 'bottom') {
    const y = side === 'top' ? box.top - DIMENSION_OFFSET : box.bottom + DIMENSION_OFFSET
    return {
      type: 'dimension',
      path: `M${box.left} ${y - TICK}V${y + TICK}M${box.left} ${y}H${box.right}M${box.right} ${y - TICK}V${y + TICK}`,
      x: (box.left + box.right) / 2,
      y,
      text,
    }
  }
  const x = side === 'left' ? box.left - DIMENSION_OFFSET : box.right + DIMENSION_OFFSET
  return {
    type: 'dimension',
    path: `M${x - TICK} ${box.top}H${x + TICK}M${x} ${box.top}V${box.bottom}M${x - TICK} ${box.bottom}H${x + TICK}`,
    x,
    y: (box.top + box.bottom) / 2,
    text,
  }
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
  parts = [],
  marks = [],
  legend = true,
  children,
  scale: scaleMode = 'auto',
  specimenWidth,
  surface = 'light',
  title = 'Anatomy',
}: {
  parts?: readonly AnatomyPart[]
  /** false renders only a compact measured stage, e.g. for Sizing examples. */
  legend?: boolean
  /** Optional measured outlines, gaps, and dimensions. */
  marks?: readonly AnatomyMark[]
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
    const available = Math.max(stageWidth - (legend ? STAGE_PADDING : BARE_PADDING) * 2, 40)
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
      if (part.between) {
        const [fromNode, toNode] = part.between.map((selector) => inner.querySelector(selector))
        if (!fromNode || !toNode) {
          issues.push(`part ${index + 1} "${part.name}" between [${part.between.join(', ')}] matched nothing`)
          return null
        }
        const box = gapBox(
          relativeBox(fromNode.getBoundingClientRect(), stageRect),
          relativeBox(toNode.getBoundingClientRect(), stageRect),
        )
        if (!box) {
          issues.push(`part ${index + 1} "${part.name}" found no space between its targets`)
          return null
        }
        return anchorPoint(box, part.side, part.at ?? 0.5)
      }
      const node = part.target ? inner.querySelector(part.target) : null
      if (!node) {
        issues.push(`part ${index + 1} "${part.name}" target ${part.target ?? '(none)'} matched nothing`)
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

    const boxOf = (selector: string, label: string) => {
      const node = inner.querySelector(selector)
      if (!node) {
        issues.push(`${label} target ${selector} matched nothing`)
        return null
      }
      return relativeBox(node.getBoundingClientRect(), stageRect)
    }
    const markLayouts: MarkLayout[] = []
    marks.forEach((mark, index) => {
      const label = `mark ${index + 1} (${mark.kind})`
      if (mark.kind === 'outline') {
        const nodes = mark.each
          ? Array.from(inner.querySelectorAll(mark.target))
          : [inner.querySelector(mark.target)].filter((node): node is Element => node !== null)
        if (!nodes.length) issues.push(`${label} target ${mark.target} matched nothing`)
        for (const node of nodes) {
          const box = relativeBox(node.getBoundingClientRect(), stageRect)
          markLayouts.push({
            type: 'rect',
            variant: mark.variant ?? 'bounds',
            x: box.left,
            y: box.top,
            w: box.right - box.left,
            h: box.bottom - box.top,
          })
        }
        return
      }
      if (mark.kind === 'gap') {
        const from = boxOf(mark.from, label)
        const to = boxOf(mark.to, label)
        if (!from || !to) return
        const gap = gapBox(from, to)
        if (!gap) {
          issues.push(`${label} found no space between its targets`)
          return
        }
        const horizontal = to.left >= from.right - 0.5
        markLayouts.push({ type: 'rect', variant: 'gap', x: gap.left, y: gap.top, w: gap.right - gap.left, h: gap.bottom - gap.top })
        if (mark.label !== false) {
          const size = (horizontal ? gap.right - gap.left : gap.bottom - gap.top) / scale
          markLayouts.push(dimensionMark(gap, horizontal ? 'bottom' : 'right', formatPx(size)))
        }
        return
      }
      if (mark.kind === 'padding') {
        const node = inner.querySelector<HTMLElement>(mark.target)
        if (!node) {
          issues.push(`${label} target ${mark.target} matched nothing`)
          return
        }
        const box = relativeBox(node.getBoundingClientRect(), stageRect)
        const style = getComputedStyle(node)
        const [top, right, bottom, left] = [
          style.paddingTop,
          style.paddingRight,
          style.paddingBottom,
          style.paddingLeft,
        ].map((value) => (parseFloat(value) || 0) * scale)
        if (top + right + bottom + left === 0) {
          issues.push(`${label} target has no padding; remove the mark`)
          return
        }
        const w = box.right - box.left
        const h = box.bottom - box.top
        const bands = [
          { x: box.left, y: box.top, w, h: top },
          { x: box.left, y: box.bottom - bottom, w, h: bottom },
          { x: box.left, y: box.top + top, w: left, h: h - top - bottom },
          { x: box.right - right, y: box.top + top, w: right, h: h - top - bottom },
        ]
        for (const band of bands) {
          if (band.w > 0 && band.h > 0) markLayouts.push({ type: 'rect', variant: 'padding', ...band })
        }
        return
      }
      const box = boxOf(mark.target, label)
      if (!box) return
      const width = (box.right - box.left) / scale
      const height = (box.bottom - box.top) / scale
      const text =
        mark.label === 'both'
          ? `${formatPx(width)} × ${formatPx(height)}`
          : formatPx(mark.side === 'top' || mark.side === 'bottom' ? width : height)
      markLayouts.push(dimensionMark(box, mark.side, text))
    })

    const dimensions = markLayouts.filter(
      (mark): mark is Extract<MarkLayout, { type: 'dimension' }> => mark.type === 'dimension',
    )
    dimensions.forEach((a, i) => {
      for (const b of dimensions.slice(i + 1)) {
        const apart = a.text.length * 3.2 + 6 + b.text.length * 3.2 + 6
        if (Math.abs(a.x - b.x) < apart - 1 && Math.abs(a.y - b.y) < 16) {
          issues.push(`size labels "${a.text}" and "${b.text}" overlap`)
        }
      }
    })
    for (const mark of markLayouts) {
      if (mark.type !== 'dimension') continue
      const halfWidth = mark.text.length * 3.2 + 6
      for (const pin of pins) {
        if (Math.abs(pin.x - mark.x) < halfWidth + PIN / 2 && Math.abs(pin.y - mark.y) < 9 + PIN / 2) {
          issues.push(`pin ${pin.number} covers the "${mark.text}" size label`)
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
      marks: markLayouts,
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
    // Components that draw after their own layout pass (charts) change
    // content without resizing; re-measure once per frame when that happens.
    let frameId = 0
    const mutations = new MutationObserver(() => {
      cancelAnimationFrame(frameId)
      frameId = requestAnimationFrame(measure)
    })
    mutations.observe(inner, { childList: true, subtree: true, attributes: true })
    const settleId = window.setTimeout(measure, 300)
    void document.fonts?.ready.then(measure)
    window.addEventListener('resize', measure)
    inner.addEventListener('load', measure, true)
    return () => {
      observer?.disconnect()
      mutations.disconnect()
      cancelAnimationFrame(frameId)
      window.clearTimeout(settleId)
      window.clearTimeout(reportTimer.current)
      window.removeEventListener('resize', measure)
      inner.removeEventListener('load', measure, true)
    }
  }, [])

  const shownScale = Math.round(geometry.scale * 10) / 10

  return (
    <div className={`gk-anatomy${surface === 'dark' ? ' is-dark' : ''}${legend ? '' : ' is-bare'}`}>
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
            {geometry.marks.map((mark, index) =>
              mark.type === 'rect' ? (
                <rect
                  key={`mark-${index}`}
                  className={`gk-mark-${mark.variant}`}
                  x={mark.x}
                  y={mark.y}
                  width={Math.max(0, mark.w)}
                  height={Math.max(0, mark.h)}
                  rx={mark.variant === 'gap' || mark.variant === 'padding' ? 0 : 4}
                />
              ) : (
                <g className="gk-mark-dimension" key={`mark-${index}`}>
                  <path d={mark.path} />
                  <rect
                    x={mark.x - (mark.text.length * 3.2 + 6)}
                    y={mark.y - 8}
                    width={mark.text.length * 6.4 + 12}
                    height={16}
                    rx={8}
                  />
                  <text x={mark.x} y={mark.y + 3.5} textAnchor="middle">
                    {mark.text}
                  </text>
                </g>
              ),
            )}
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
      {legend && <div className="gk-anatomy-legend">
        <ol>
          {parts.map((part, index) => (
            <li key={part.name}>
              <span className="gk-pin" aria-hidden="true">{index + 1}</span>
              <b>{part.name}</b>
              <span>{part.note}</span>
            </li>
          ))}
        </ol>
        {marks.length > 0 && <MarkKey marks={marks} />}
      </div>}
    </div>
  )
}

const MARK_KEY: Record<string, string> = {
  bounds: 'Component bounds',
  child: 'Child bounds',
  padding: 'Padding',
  gap: 'Gap',
  size: 'Measured size (px)',
}

function MarkKey({ marks }: { marks: readonly AnatomyMark[] }) {
  const kinds = new Set<string>()
  for (const mark of marks) {
    kinds.add(mark.kind === 'outline' ? (mark.variant ?? 'bounds') : mark.kind)
    if (mark.kind === 'gap' && mark.label !== false) kinds.add('size')
  }
  const order = ['bounds', 'child', 'padding', 'gap', 'size'].filter((kind) => kinds.has(kind))
  return (
    <ul className="gk-mark-key" aria-label="Diagram marks">
      {order.map((kind) => (
        <li key={kind}>
          <span className={`gk-mark-swatch is-${kind}`} aria-hidden="true" />
          {MARK_KEY[kind]}
        </li>
      ))}
    </ul>
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

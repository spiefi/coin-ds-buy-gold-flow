import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import {
  Badge,
  Button,
  HStack,
  NavArrow,
  Stack,
  Text as CoinText,
  VStack,
  type Modes,
  type StackLayoutDirection,
} from 'jfs-components'
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native'
import {
  GuideMobileBar,
  GuideSidebar,
  MobileComponentNav,
  MobilePageNav,
  useGuidePageNavigation,
} from './GuideNavigation'

export type LayoutGuideKey = 'hstack' | 'vstack' | 'stack' | 'breadcrumbs'

type Gap = 'XS' | 'S' | 'M' | 'L' | 'XL'
type Padding = 'Default' | 'None'
type ColorMode = 'Light' | 'Dark'

const STORYBOOK_HOST = 'https://jfs-components-storybook.vercel.app'
const FIGMA_COMPONENTS_URL =
  'https://www.figma.com/design/3z7bmhA73Ls7j8Eu4qhYhE/Coin-Components-Library'

const META: Record<
  LayoutGuideKey,
  {
    name: string
    eyebrow: string
    lede: string
    principle: string
    figmaUrl: string
    storybookUrl: string
    figmaSource: string
    storybookSource: string
  }
> = {
  hstack: {
    name: 'HStack',
    eyebrow: 'Layout / Horizontal',
    lede:
      'Use HStack for a row of related content. It owns horizontal rhythm, alignment, and optional wrapping while the host decides how much room the row has.',
    principle:
      'Keep related actions and values in one visual row. Let the available container decide when a wrapped row needs a second line.',
    figmaUrl: FIGMA_COMPONENTS_URL + '?node-id=9243-2201',
    storybookUrl: STORYBOOK_HOST + '/?path=/docs/components-hstack--docs',
    figmaSource: 'Coin Components Library · node 9243:2201',
    storybookSource: 'HStack component and live behavior',
  },
  vstack: {
    name: 'VStack',
    eyebrow: 'Layout / Vertical',
    lede:
      'Use VStack for page flow, grouped details, and ordered content. Its children follow token-driven spacing and padding while the host supplies the available height.',
    principle:
      'Use vertical rhythm to show hierarchy. A constrained height can let wrapped children flow into columns; it does not turn VStack into a responsive grid.',
    figmaUrl: FIGMA_COMPONENTS_URL + '?node-id=2841-190',
    storybookUrl: STORYBOOK_HOST + '/?path=/docs/components-vstack--docs',
    figmaSource: 'Coin Components Library · node 2841:190',
    storybookSource: 'VStack component and live behavior',
  },
  stack: {
    name: 'Stack',
    eyebrow: 'Layout / Slot composition',
    lede:
      'Use Stack when a public component slot needs one token-driven gap and an intentional vertical or horizontal direction.',
    principle:
      'Choose direction from the content role. Stack stays direction-locked; it does not switch because the viewport changed.',
    figmaUrl:
      'https://www.figma.com/design/dSlK8ueQ7wlbyUSZd4f8QO/Coin-Subcomponents?node-id=279-3',
    storybookUrl: STORYBOOK_HOST + '/?path=/docs/components-stack--docs',
    figmaSource: 'Coin Subcomponents anatomy reference · node 279:3',
    storybookSource: 'Stack export and live behavior',
  },
  breadcrumbs: {
    name: 'Breadcrumbs',
    eyebrow: 'Navigation / Hierarchy',
    lede:
      'Use Breadcrumbs when people need a compact path back through a hierarchy. The trail moves from the broadest ancestor to the current page.',
    principle:
      'Preserve route order and keep the current page visible. Chevrons, link treatment, and current-page state are supplied by the published component.',
    figmaUrl: FIGMA_COMPONENTS_URL + '?node-id=9788-1945',
    storybookUrl: STORYBOOK_HOST + '/?path=/docs/components-breadcrumbs--docs',
    figmaSource: 'Coin Components Library · node 9788:1945',
    storybookSource: 'Breadcrumbs stories and interaction',
  },
}

const BREADCRUMB_STORIES = {
  default:
    STORYBOOK_HOST +
    '/iframe.html?id=components-breadcrumbs--default&viewMode=story',
  wrapping:
    STORYBOOK_HOST +
    '/iframe.html?id=components-breadcrumbs--wrapping&viewMode=story',
  interactive:
    STORYBOOK_HOST +
    '/iframe.html?id=components-breadcrumbs--interactive&viewMode=story',
}

const BREADCRUMB_STORY_LABELS = {
  default: 'Default',
  wrapping: 'Wrapping',
  interactive: 'Interactive',
} as const

type BreadcrumbVariant = keyof typeof BREADCRUMB_STORIES

const BREADCRUMB_ROUTES: Record<BreadcrumbVariant, Array<{ label: string; current?: boolean }>> = {
  default: [
    { label: 'Cloud' },
    { label: 'ITR' },
    { label: '2024-25' },
    { label: 'Original', current: true },
  ],
  wrapping: [
    { label: 'Cloud' },
    { label: 'ITR' },
    { label: '2024-25' },
    { label: 'Original' },
    { label: 'Returns' },
    { label: 'Summary', current: true },
  ],
  interactive: [
    { label: 'Cloud' },
    { label: 'ITR' },
    { label: '2024-25' },
    { label: 'Original', current: true },
  ],
}

function classes(...values: Array<string | false | undefined>) {
  return values.filter(Boolean).join(' ')
}

function flattenedStyle(style?: StyleProp<ViewStyle>) {
  return style
    ? (StyleSheet.flatten(style) as React.CSSProperties)
    : undefined
}

function SourceLink({
  href,
  children,
}: {
  href: string
  children: string
}) {
  return (
    <a className="source-link" href={href} target="_blank" rel="noreferrer">
      <span>{children}</span>
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" />
      </svg>
    </a>
  )
}

function Segment<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: readonly T[]
  onChange: (value: T) => void
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
            {option}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

function LiveBadge({
  title,
  detail,
  long = false,
  modes,
  childId,
  style,
  alignSelf,
}: {
  title: string
  detail?: string
  long?: boolean
  modes?: Modes
  childId?: string
  style?: StyleProp<ViewStyle>
  alignSelf?: ViewStyle['alignSelf']
}) {
  const label = detail ? `${title}\n${detail}` : title
  const flattened = style ? (StyleSheet.flatten(style) as ViewStyle) : undefined
  const badgeStyle = alignSelf
    ? { ...(flattened || {}), alignSelf }
    : flattened
  return (
    <Badge
      label={label}
      modes={modes}
      disableTruncation={long}
      accessibilityLabel={label.replace(/\n/g, ' ')}
      testID={childId}
      style={badgeStyle}
    />
  )
}

function LiveAction({
  label,
  tone = 'Primary',
  modes,
  style,
}: {
  label: string
  tone?: 'Primary' | 'Neutral' | 'Secondary'
  modes?: Modes
  style?: StyleProp<ViewStyle>
}) {
  const buttonModes = useMemo(
    () =>
      ({
        ...(modes || {}),
        'Button / Size': 'S',
        Emphasis: 'High',
        'Semantic Intent': 'Brand',
        AppearanceBrand: tone,
        Context4: 'Button',
        'Button / State': 'Idle',
      }) as Modes,
    [modes, tone],
  )

  return (
    <div className="layout-live-action" style={flattenedStyle(style)}>
      <Button label={label} modes={buttonModes} accessibilityLabel={label} />
    </div>
  )
}

function HStackPreview({
  modes,
  wrap = false,
  reverse = false,
  align = 'Top Left',
  maxWidth = 570,
}: {
  modes: Modes
  wrap?: boolean
  reverse?: boolean
  align?: 'Top Left' | 'Left'
  maxWidth?: number
}) {
  const stack = (
    <HStack
      modes={modes}
      wrap={wrap}
      reverse={reverse}
      alignVertical={align === 'Top Left' ? 'flex-start' : 'center'}
      justifyHorizontal="flex-start"
      style={{ width: '100%', maxWidth: wrap ? 150 : maxWidth, minWidth: 0 }}
    >
      <LiveBadge title="Paid" alignSelf="auto" />
      <LiveBadge title="Due" detail="today" long alignSelf="auto" />
      <LiveBadge title="New" alignSelf="auto" />
    </HStack>
  )
  return (
    <div className={classes('layout-live-component', 'layout-live-component-hstack', wrap && 'layout-live-component-wrap')}>
      {wrap ? (
        <div className="layout-constrained-host layout-constrained-host-width">
          <span className="layout-constraint-label">Bounded width · 150px</span>
          {stack}
        </div>
      ) : stack}
    </div>
  )
}

function VStackPreview({
  modes,
  wrap = false,
  reverse = false,
  maxWidth = 570,
}: {
  modes: Modes
  wrap?: boolean
  reverse?: boolean
  maxWidth?: number
}) {
  const stack = (
    <VStack
      modes={modes}
      wrap={wrap}
      reverse={reverse}
      alignHorizontal={wrap ? 'flex-start' : undefined}
      style={{ width: '100%', maxWidth, minWidth: 0, ...(wrap ? { height: 92 } : {}) }}
    >
      <LiveBadge title="Paid" />
      <LiveBadge title="Due" detail="today" long />
      <LiveBadge title="New" />
    </VStack>
  )
  return (
    <div className={classes('layout-live-component', 'layout-live-component-vstack', wrap && 'layout-live-component-wrap')}>
      {wrap ? (
        <div className="layout-constrained-host layout-constrained-host-height">
          <span className="layout-constraint-label">Bounded height · 92px</span>
          {stack}
        </div>
      ) : stack}
    </div>
  )
}

function StackPreview({
  modes,
  direction = 'vertical',
  equalHeight = false,
  fillWidth = false,
  fixedChildren = false,
}: {
  modes: Modes
  direction?: StackLayoutDirection
  equalHeight?: boolean
  fillWidth?: boolean
  fixedChildren?: boolean
}) {
  return (
    <div className={classes('layout-live-component', 'layout-live-component-stack', 'layout-live-component-stack-' + direction)}>
      <Stack
        modes={modes}
        layoutDirection={direction}
        equalHeight={equalHeight}
        fillWidth={fillWidth}
        alignCrossAxis={!fillWidth && direction === 'vertical' ? 'flex-start' : undefined}
        justifyMainAxis="flex-start"
        style={{ width: '100%', maxWidth: 570, minWidth: 0 }}
      >
        <LiveBadge
          title="Paid"

          style={fixedChildren ? { width: 154, flexGrow: 0, flexShrink: 0 } : undefined}
        />
        <LiveBadge
          title="Due"
          detail="today"

          long
          style={fixedChildren ? { width: 154, flexGrow: 0, flexShrink: 0 } : undefined}
        />
      </Stack>
    </div>
  )
}

type AnatomyDirection = 'horizontal' | 'vertical'

type MeasuredRect = {
  left: number
  top: number
  width: number
  height: number
}

type LayoutAnatomyMetrics = {
  component: MeasuredRect
  children: MeasuredRect[]
  gaps: MeasuredRect[]
  padding: MeasuredRect[]
  cross: MeasuredRect
}

function LayoutAnatomyFrame({
  direction,
  showPadding = true,
  children,
}: {
  direction: AnatomyDirection
  showPadding?: boolean
  children: React.ReactNode
}) {
  const frameRef = useRef<HTMLDivElement>(null)
  const [metrics, setMetrics] = useState<LayoutAnatomyMetrics | null>(null)

  useLayoutEffect(() => {
    const frame = frameRef.current
    if (!frame) return

    const measure = () => {
      const slot = frame.querySelector<HTMLElement>('[data-layout-anatomy-slot]')
      const component = frame.querySelector<HTMLElement>('[data-layout-anatomy-component]')
      if (!slot || !component) return
      const badgeNodes = Array.from(
        slot.querySelectorAll<HTMLElement>('[data-testid^="layout-anatomy-child-"]'),
      )
      if (badgeNodes.length < 2) return

      const slotRect = slot.getBoundingClientRect()
      const componentRect = component.getBoundingClientRect()
      const localRect = (rect: DOMRect): MeasuredRect => ({
        left: rect.left - slotRect.left,
        top: rect.top - slotRect.top,
        width: rect.width,
        height: rect.height,
      })
      const componentBounds = localRect(componentRect)
      const badgeRects = badgeNodes.map((node) => localRect(node.getBoundingClientRect()))
      const childLeft = Math.min(...badgeRects.map((rect) => rect.left))
      const childTop = Math.min(...badgeRects.map((rect) => rect.top))
      const childRight = Math.max(...badgeRects.map((rect) => rect.left + rect.width))
      const childBottom = Math.max(...badgeRects.map((rect) => rect.top + rect.height))
      const childBounds: MeasuredRect = {
        left: childLeft,
        top: childTop,
        width: Math.max(0, childRight - childLeft),
        height: Math.max(0, childBottom - childTop),
      }
      const gaps = badgeRects.slice(0, -1).map((rect, index): MeasuredRect => {
        const next = badgeRects[index + 1]
        if (direction === 'horizontal') {
          return {
            left: rect.left + rect.width,
            top: Math.min(rect.top, next.top),
            width: Math.max(0, next.left - (rect.left + rect.width)),
            height: Math.max(rect.height, next.height),
          }
        }
        return {
          left: Math.min(rect.left, next.left),
          top: rect.top + rect.height,
          width: Math.max(rect.width, next.width),
          height: Math.max(0, next.top - (rect.top + rect.height)),
        }
      }).filter((rect) => rect.width > 0.5 && rect.height > 0.5)
      const padding = showPadding
        ? [
            { left: componentBounds.left, top: componentBounds.top, width: componentBounds.width, height: Math.max(0, childTop - componentBounds.top) },
            { left: componentBounds.left, top: childBottom, width: componentBounds.width, height: Math.max(0, (componentBounds.top + componentBounds.height) - childBottom) },
            { left: componentBounds.left, top: childTop, width: Math.max(0, childLeft - componentBounds.left), height: childBounds.height },
            { left: childRight, top: childTop, width: Math.max(0, (componentBounds.left + componentBounds.width) - childRight), height: childBounds.height },
          ].filter((rect) => rect.width > 0.5 && rect.height > 0.5)
        : []
      const cross = direction === 'horizontal'
        ? { left: childLeft, top: childTop + childBounds.height / 2, width: childBounds.width, height: 1 }
        : { left: childLeft, top: childTop, width: 1, height: childBounds.height }

      setMetrics({ component: componentBounds, children: badgeRects, gaps, padding, cross })
    }

    const animationFrame = requestAnimationFrame(measure)
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure)
    observer?.observe(frame)
    const observedSlot = frame.querySelector<HTMLElement>('[data-layout-anatomy-slot]')
    if (observedSlot) observer?.observe(observedSlot)
    frame.querySelectorAll<HTMLElement>('[data-testid^="layout-anatomy-child-"]').forEach((node) => observer?.observe(node))
    return () => {
      cancelAnimationFrame(animationFrame)
      observer?.disconnect()
    }
  }, [direction])

  const axis = direction === 'horizontal' ? '→' : '↓'
  return (
    <div ref={frameRef} className={classes('layout-anatomy-frame', 'layout-anatomy-frame-' + direction)}>
      <div className="layout-anatomy-direction">
        <span aria-hidden="true">{axis}</span>
        <strong>{direction === 'horizontal' ? 'Direction across the row' : 'Direction down the column'}</strong>
      </div>
      <div className="layout-anatomy-slot" data-layout-anatomy-slot>
        {metrics ? (
          <div className="layout-inspector-bands" aria-hidden="true">
            {metrics.padding.map((rect, index) => (
              <span className="layout-inspector-band layout-inspector-band-padding" style={rect} key={'padding-' + index} />
            ))}
            {metrics.gaps.map((rect, index) => (
              <span className="layout-inspector-band layout-inspector-band-gap" style={rect} key={'gap-' + index} />
            ))}
            <span className="layout-inspector-cross-axis" style={metrics.cross} />
          </div>
        ) : null}
        {children}
        {metrics ? (
          <div className="layout-inspector-outlines" aria-hidden="true">
            <span className="layout-inspector-component-bound" style={metrics.component} />
            {metrics.children.map((rect, index) => (
              <span className="layout-inspector-child-bound" style={rect} key={'child-' + index} />
            ))}
          </div>
        ) : null}
      </div>
      <p className="layout-anatomy-caption">Coin badges show the slot contents. Outlines and arrows explain the layout.</p>
      <div className="layout-inspector-legend" aria-label="Diagram key">
        <span><i className="layout-inspector-swatch layout-inspector-swatch-host" />Host</span>
        <span><i className="layout-inspector-swatch layout-inspector-swatch-component" />Component bounds</span>
        <span><i className="layout-inspector-swatch layout-inspector-swatch-child" />Children</span>
        {showPadding ? <span><i className="layout-inspector-swatch layout-inspector-swatch-padding" />Owner padding</span> : null}
        <span><i className="layout-inspector-swatch layout-inspector-swatch-gap" />Gap</span>
      </div>
    </div>
  )
}

function BreadcrumbTrail({
  variant = 'default',
  modes = {},
}: {
  variant?: BreadcrumbVariant
  modes?: Modes
}) {
  const [selectedAncestor, setSelectedAncestor] = useState<string | null>(null)
  const exampleId = useId().replace(/:/g, '')
  const items = BREADCRUMB_ROUTES[variant]
  const interactive = variant === 'interactive'
  const storyLabel = BREADCRUMB_STORY_LABELS[variant]

  return (
    <div id={exampleId} className={classes('layout-breadcrumb-reference', 'layout-breadcrumb-reference-' + variant)}>
      <div className="layout-breadcrumb-reference-topline">
        <span>{storyLabel} trail</span>
      </div>
      <nav aria-label={`${storyLabel} Breadcrumbs example`}>
        <ol className="layout-breadcrumb-trail">
          {items.map((item, index) => (
            <li className="layout-breadcrumb-item" key={item.label}>
              {index > 0 ? (
                <span className="layout-breadcrumb-separator" aria-hidden="true">
                  <NavArrow direction="Forward" modes={modes} style={{ width: 14, height: 18, backgroundColor: 'transparent' }} />
                </span>
              ) : null}
              {item.current ? (
                <span className="layout-breadcrumb-current" aria-current="page">
                  <CoinText text={item.label} modes={modes} singleLine style={{ fontWeight: '600' }} />
                </span>
              ) : (
                <a
                  className="layout-breadcrumb-link"
                  href={'#' + exampleId}
                  aria-label={`Open ${item.label}`}
                  onClick={(event) => {
                    event.preventDefault()
                    if (interactive) setSelectedAncestor(item.label)
                  }}
                >
                  <CoinText text={item.label} modes={modes} singleLine style={{ color: 'inherit' }} />
                </a>
              )}
            </li>
          ))}
        </ol>
      </nav>
      {interactive ? (
        <p className="layout-breadcrumb-interaction-status" role="status">
          {selectedAncestor
            ? `Selected ancestor: ${selectedAncestor}`
            : 'Select an ancestor to preview navigation.'}
        </p>
      ) : null}
    </div>
  )
}

function Header({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string
  title: string
  children: React.ReactNode
}) {
  return (
    <header className="section-header">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{children}</p>
    </header>
  )
}

function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
}: {
  id: string
  eyebrow: string
  title: string
  intro: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="doc-section anchor-section layout-section">
      <Header eyebrow={eyebrow} title={title}>
        {intro}
      </Header>
      {children}
    </section>
  )
}

function BreadcrumbsGapNote() {
  return (
    <div className="verification-note layout-package-note">
      <span>Package check · 0.1.60</span>
      <p>
        These previews are code-rendered documentation references built from
        public NavArrow and Text primitives with native anchors for keyboard
        semantics. Breadcrumbs is not yet
        included in the released component package; use the published stories
        for the shipped runtime.
      </p>
    </div>
  )
}

function Playground({
  guide,
  modes,
  gap,
  padding,
  colorMode,
  wrap,
  reverse,
  align,
  direction,
  equalHeight,
  fillWidth,
  setGap,
  setPadding,
  setColorMode,
  setWrap,
  setReverse,
  setAlign,
  setDirection,
  setEqualHeight,
  setFillWidth,
}: {
  guide: LayoutGuideKey
  modes: Modes
  gap: Gap
  padding: Padding
  colorMode: ColorMode
  wrap: boolean
  reverse: boolean
  align: 'Top Left' | 'Left'
  direction: StackLayoutDirection
  equalHeight: boolean
  fillWidth: boolean
  setGap: (value: Gap) => void
  setPadding: (value: Padding) => void
  setColorMode: (value: ColorMode) => void
  setWrap: (value: boolean) => void
  setReverse: (value: boolean) => void
  setAlign: (value: 'Top Left' | 'Left') => void
  setDirection: (value: StackLayoutDirection) => void
  setEqualHeight: (value: boolean) => void
  setFillWidth: (value: boolean) => void
}) {
  const meta = META[guide]
  const stageClass = classes(
    'preview-stage',
    'layout-preview-stage',
    colorMode === 'Dark' && 'is-dark',
    guide === 'breadcrumbs' && 'layout-breadcrumb-preview-stage',
  )

  return (
    <section className="playground layout-playground" aria-labelledby="playground-title">
      <div className="playground-heading">
        <div>
          <p className="eyebrow">Try it</p>
          <h2 id="playground-title">Explore {meta.name}</h2>
        </div>
        <p>
          {guide === 'breadcrumbs'
            ? 'Use the local route reference to inspect hierarchy, wrapping, and current-page behavior. Published runtime links live in Sources.'
            : 'Change the documented controls and watch the live public component respond inside a constrained host.'}
        </p>
      </div>
      <div className="playground-grid">
        <div className={stageClass}>
          {guide === 'hstack' ? (
            <HStackPreview modes={modes} wrap={wrap} reverse={reverse} align={align} />
          ) : guide === 'vstack' ? (
            <VStackPreview modes={modes} wrap={wrap} reverse={reverse} />
          ) : guide === 'stack' ? (
            <StackPreview
              modes={modes}
              direction={direction}
              equalHeight={equalHeight}
              fillWidth={fillWidth}
            />
          ) : (
            <BreadcrumbTrail variant="default" modes={modes} />
          )}
          <span className="stage-label">
            {guide === 'breadcrumbs'
              ? 'Documentation trail · Default'
              : `Live public ${meta.name} · ${guide === 'stack' ? direction : 'Slot gap ' + gap}`}
          </span>
        </div>
        <div className="controls-panel layout-controls-panel">
          {guide === 'breadcrumbs' ? (
            <div className="layout-control-explanation">
              <span className="context-label">Designer boundary</span>
              <h3>Read the trail as a system outcome</h3>
              <p>
                Breadcrumbs has no exposed Figma properties in the inspected
                source. Keep the ancestor order and current item meaningful;
                the component supplies chevrons and interaction semantics.
              </p>
              <SourceLink href={META.breadcrumbs.storybookUrl}>
                View the published stories
              </SourceLink>
            </div>
          ) : (
            <>
              <Segment
                label="Slot gap"
                value={gap}
                options={['XS', 'S', 'M', 'L', 'XL'] as const}
                onChange={setGap}
              />
              {guide !== 'stack' ? (
                <Segment
                  label="Padding"
                  value={padding}
                  options={['Default', 'None'] as const}
                  onChange={setPadding}
                />
              ) : null}
              {guide !== 'stack' ? (
                <Segment
                  label="Theme"
                  value={colorMode}
                  options={['Light', 'Dark'] as const}
                  onChange={setColorMode}
                />
              ) : null}
              {guide === 'hstack' ? (
                <Segment
                  label="Aligment"
                  value={align}
                  options={['Top Left', 'Left'] as const}
                  onChange={setAlign}
                />
              ) : null}
              {guide === 'stack' ? (
                <Segment
                  label="Direction"
                  value={direction}
                  options={['vertical', 'horizontal'] as const}
                  onChange={setDirection}
                />
              ) : null}
              {guide !== 'stack' ? (
                <div className="toggle-row layout-toggle-row">
                  <label>
                    <input
                      type="checkbox"
                      checked={wrap}
                      onChange={(event) => setWrap(event.target.checked)}
                    />
                    <span className="toggle-track" aria-hidden="true" />
                    Wrap within the host
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={reverse}
                      onChange={(event) => setReverse(event.target.checked)}
                    />
                    <span className="toggle-track" aria-hidden="true" />
                    Reverse visual direction
                  </label>
                </div>
              ) : (
                <div className="toggle-row layout-toggle-row">
                  <label>
                    <input
                      type="checkbox"
                      checked={equalHeight}
                      onChange={(event) => setEqualHeight(event.target.checked)}
                    />
                    <span className="toggle-track" aria-hidden="true" />
                    Equal height in a row
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={fillWidth}
                      onChange={(event) => setFillWidth(event.target.checked)}
                    />
                    <span className="toggle-track" aria-hidden="true" />
                    Fill width in a column
                  </label>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  )
}

function HStackAnatomy({ modes }: { modes: Modes }) {
  return (
    <div className="anatomy-card layout-anatomy-card">
      <div className="anatomy-stage layout-anatomy-stage">
        <LayoutAnatomyFrame direction="horizontal">
          <div className="layout-anatomy-component" data-layout-anatomy-component>
            <HStack
              modes={{ ...modes, 'Slot gap': 'M', Padding: 'Default' }}
              alignVertical="center"
              justifyHorizontal="flex-start"
              style={{ alignSelf: 'center' }}
            >
              <LiveBadge childId="layout-anatomy-child-h-1" title="Paid" alignSelf="auto" />
              <LiveBadge childId="layout-anatomy-child-h-2" title="Due" detail="today" long alignSelf="auto" />
              <LiveBadge childId="layout-anatomy-child-h-3" title="New" alignSelf="auto" />
            </HStack>
          </div>
        </LayoutAnatomyFrame>
      </div>
      <ol className="anatomy-list">
        <li>
          <b>Row direction</b>
          <span>Children are arranged left to right. Reverse changes visual direction only; DOM order stays the same.</span>
        </li>
        <li>
          <b>Token gap</b>
          <span>Use Slot gap to set rhythm. Keep spacing owned by HStack instead of adding child margins.</span>
        </li>
        <li>
          <b>Cross-axis alignment</b>
          <span>Figma exposes the variant named “Aligment”: Top Left maps to the top edge and Left centers the row vertically.</span>
        </li>
        <li>
          <b>Owner padding</b>
          <span>Default supplies the inset around the slot. Use None when the surrounding owner already supplies that edge.</span>
        </li>
      </ol>
    </div>
  )
}

function VStackAnatomy({ modes }: { modes: Modes }) {
  return (
    <div className="anatomy-card layout-anatomy-card">
      <div className="anatomy-stage layout-anatomy-stage">
        <LayoutAnatomyFrame direction="vertical">
          <div className="layout-anatomy-component" data-layout-anatomy-component>
            <VStack
              modes={{ ...modes, 'Slot gap': 'M', Padding: 'Default' }}
              style={{ alignSelf: 'center' }}
            >
              <LiveBadge childId="layout-anatomy-child-v-1" title="Paid" />
              <LiveBadge childId="layout-anatomy-child-v-2" title="Due" detail="today" long />
              <LiveBadge childId="layout-anatomy-child-v-3" title="New" />
            </VStack>
          </div>
        </LayoutAnatomyFrame>
      </div>
      <ol className="anatomy-list">
        <li>
          <b>Column direction</b>
          <span>Children follow a vertical page-flow order. Reverse is available when the content order genuinely needs it.</span>
        </li>
        <li>
          <b>Token gap</b>
          <span>Slot gap sets the repeated rhythm between children and remains consistent as content grows.</span>
        </li>
        <li>
          <b>Cross-axis edge</b>
          <span>Direct children share the owner’s cross-axis edge, while wrap flows into a new column only inside a height boundary.</span>
        </li>
        <li>
          <b>Padding</b>
          <span>Default or None comes from the component mode. Do not recreate its inset with local wrappers.</span>
        </li>
      </ol>
    </div>
  )
}

function StackAnatomy({ modes }: { modes: Modes }) {
  return (
    <div className="anatomy-card layout-anatomy-card">
      <div className="anatomy-stage layout-anatomy-stage">
        <LayoutAnatomyFrame direction="vertical" showPadding={false}>
          <div className="layout-anatomy-component" data-layout-anatomy-component>
            <Stack
              modes={{ ...modes, 'Slot gap': 'M' }}
              layoutDirection="vertical"
              fillWidth
              style={{ width: 220, alignSelf: 'center' }}
            >
              <LiveBadge childId="layout-anatomy-child-stack-1" title="Paid" />
              <LiveBadge childId="layout-anatomy-child-stack-2" title="Due" detail="today" long />
            </Stack>
          </div>
        </LayoutAnatomyFrame>
      </div>
      <ol className="anatomy-list">
        <li>
          <b>Direction</b>
          <span>Set layoutDirection to vertical or horizontal. The default is vertical.</span>
        </li>
        <li>
          <b>Token gap</b>
          <span>Slot gap provides repeated separation. Stack has no padding, wrap, or reverse control.</span>
        </li>
        <li>
          <b>Cross-axis fit</b>
          <span>fillWidth makes these vertical children share the host edge. Fixed child dimensions still win.</span>
        </li>
      </ol>
    </div>
  )
}

function BreadcrumbsAnatomy() {
  return (
    <div className="anatomy-card layout-anatomy-card layout-breadcrumb-anatomy">
      <div className="anatomy-stage layout-anatomy-stage">
        <div className="layout-breadcrumb-anatomy-stage">
          <BreadcrumbTrail variant="default" />
          <div className="layout-breadcrumb-callouts" aria-hidden="true">
            <span><b>1</b> Ancestor link</span>
            <span><b>2</b> Separator</span>
            <span><b>3</b> Current page</span>
          </div>
        </div>
      </div>
      <ol className="anatomy-list">
        <li>
          <b>Breadcrumb trail</b>
          <span>The published component communicates hierarchy without replacing the page title or primary navigation.</span>
        </li>
        <li>
          <b>Ancestor links</b>
          <span>Items are ordered from the broadest ancestor toward the current page. Each ancestor can take people back one level.</span>
        </li>
        <li>
          <b>Automatic chevrons</b>
          <span>Separators express the path between items. Do not add manual punctuation or duplicate chevrons.</span>
        </li>
        <li>
          <b>Current page</b>
          <span>The last item is current unless an explicit current item is supplied. The current page is identified in the published story.</span>
        </li>
      </ol>
    </div>
  )
}

function HStackConfig({ modes }: { modes: Modes }) {
  return (
    <>
      <div className="type-grid layout-type-grid">
        <article className="type-card">
          <div className="type-preview layout-type-preview">
            <HStack modes={{ ...modes, 'Slot gap': 'S' }} style={{ width: '100%', minWidth: 0 }}>
              <LiveAction label="Pay" />
              <LiveAction label="Save" tone="Neutral" />
            </HStack>
          </div>
          <div>
            <h3>Slot gap</h3>
            <p>Use XS through XL to set the rhythm of one row. The gap belongs to the HStack owner.</p>
            <span>Choose rhythm by relationship</span>
          </div>
        </article>
        <article className="type-card">
          <div className="type-preview layout-type-preview">
            <HStack modes={{ ...modes, Padding: 'Default' }} style={{ width: '100%', minWidth: 0 }}>
              <LiveBadge title="A" detail="Padded" />
            </HStack>
          </div>
          <div>
            <h3>Padding</h3>
            <p>Default gives the row its component inset. None is useful when the host already owns the edge.</p>
            <span>Keep one owner for the inset</span>
          </div>
        </article>
        <article className="type-card">
          <div className="type-preview layout-type-preview">
            <HStack modes={modes} wrap alignVertical="center" style={{ width: '100%', maxWidth: 270, minWidth: 0 }}>
              <LiveAction label="Transfer money" />
              <LiveAction label="View details" tone="Neutral" />
            </HStack>
          </div>
          <div>
            <h3>Wrap and alignment</h3>
            <p>Wrapping needs a constrained width. Alignment changes the cross-axis position; it never changes row direction.</p>
            <span>Let the host provide the constraint</span>
          </div>
        </article>
      </div>
      <div className="configuration-block layout-configuration-block">
        <div className="subsection-heading">
          <div>
            <p className="eyebrow">Mode context</p>
            <h3>Surface intent comes from the owner</h3>
          </div>
          <p>HStack and its children inherit the selected Coin mode context. Keep color mode and stack context consistent with the surrounding public component.</p>
        </div>
        <div className="layout-mode-chips">
          <span>Slot gap · XS–XL</span>
          <span>Padding · Default / None</span>
          <span>Stack Context · Root / Nested</span>
          <span>Color Mode · Light / Dark</span>
        </div>
      </div>
    </>
  )
}

function VStackConfig({ modes }: { modes: Modes }) {
  return (
    <>
      <div className="type-grid layout-type-grid">
        <article className="type-card">
          <div className="type-preview layout-type-preview">
            <VStack modes={{ ...modes, 'Slot gap': 'S' }} style={{ width: '100%', minWidth: 0 }}>
              <LiveBadge title="A" />
              <LiveBadge title="B" />
            </VStack>
          </div>
          <div>
            <h3>Slot gap</h3>
            <p>Use the token rhythm that matches the surrounding hierarchy. Do not tune each child independently.</p>
            <span>One vertical rhythm</span>
          </div>
        </article>
        <article className="type-card">
          <div className="type-preview layout-type-preview">
            <VStack modes={{ ...modes, Padding: 'None' }} style={{ width: '100%', minWidth: 0 }}>
              <LiveBadge title="A" detail="Host edge" />
              <LiveBadge title="B" />
            </VStack>
          </div>
          <div>
            <h3>Padding</h3>
            <p>Default and None are owner modes. Choose None when a containing pattern already supplies the page inset.</p>
            <span>Do not double the inset</span>
          </div>
        </article>
        <article className="type-card">
          <div className="type-preview layout-type-preview">
            <VStackPreview modes={modes} wrap maxWidth={270} />
          </div>
          <div>
            <h3>Wrap in a height constraint</h3>
            <p>VStack wraps into columns only when the host supplies a constrained height.</p>
            <span>System output of available height</span>
          </div>
        </article>
      </div>
      <div className="configuration-block layout-configuration-block">
        <div className="subsection-heading">
          <div>
            <p className="eyebrow">Mode context</p>
            <h3>Keep vertical flow legible</h3>
          </div>
          <p>Storybook exposes gap, padding, stack context, background, and color mode contexts. This guide keeps the examples focused on choices that alter the visible flow.</p>
        </div>
        <div className="layout-mode-chips">
          <span>Slot gap · XS–XL</span>
          <span>Padding · Default / None</span>
          <span>Stack Context · Root / Nested</span>
          <span>Color Mode · Light / Dark</span>
        </div>
      </div>
    </>
  )
}

function StackConfig({ modes }: { modes: Modes }) {
  return (
    <>
      <div className="type-grid layout-type-grid">
        <article className="type-card">
          <div className="type-preview layout-type-preview">
            <StackPreview modes={modes} direction="vertical" />
          </div>
          <div>
            <h3>Vertical</h3>
            <p>Use the default direction for a column of actions or supporting content inside a public slot.</p>
            <span>Default direction</span>
          </div>
        </article>
        <article className="type-card">
          <div className="type-preview layout-type-preview">
            <StackPreview modes={modes} direction="horizontal" equalHeight />
          </div>
          <div>
            <h3>Horizontal</h3>
            <p>Use a row when sibling actions or content belong on one line. Direction is explicit.</p>
            <span>Direction does not auto-switch</span>
          </div>
        </article>
        <article className="type-card">
          <div className="type-preview layout-type-preview">
            <StackPreview modes={{ ...modes, 'Slot gap': 'L' }} direction="horizontal" equalHeight />
          </div>
          <div>
            <h3>Cross-axis fit</h3>
            <p>equalHeight stretches a horizontal row; fillWidth stretches a vertical column. Fixed child sizes still win.</p>
            <span>Use only for the active direction</span>
          </div>
        </article>
      </div>
      <div className="configuration-block layout-configuration-block">
        <div className="subsection-heading">
          <div>
            <p className="eyebrow">Public consumer boundary</p>
            <h3>Use Stack through a public component slot</h3>
          </div>
          <p>Stack is a public JFS export and a documented layout primitive. The Figma source is a Coin Subcomponents anatomy reference, so designers should consume public components and patterns that own the slot.</p>
        </div>
        <div className="layout-mode-chips">
          <span>Direction · vertical / horizontal</span>
          <span>Slot gap · XS–XL</span>
          <span>equalHeight · horizontal</span>
          <span>fillWidth · vertical</span>
        </div>
      </div>
    </>
  )
}

function BreadcrumbsConfig() {
  return (
    <>
      <div className="type-grid layout-type-grid layout-breadcrumb-type-grid">
        <article className="type-card">
          <div className="type-preview layout-type-preview">
            <BreadcrumbTrail variant="default" />
          </div>
          <div>
            <h3>Ancestor to current</h3>
            <p>Order each item from the broadest ancestor to the current page.</p>
            <span>Preserve route order</span>
          </div>
        </article>
        <article className="type-card">
          <div className="type-preview layout-type-preview">
            <BreadcrumbTrail variant="wrapping" />
          </div>
          <div>
            <h3>Wrap inside the host</h3>
            <p>A constrained parent lets a long trail wrap. The component does not auto-collapse the route.</p>
            <span>System output of available width</span>
          </div>
        </article>
        <article className="type-card">
          <div className="type-preview layout-type-preview">
            <BreadcrumbTrail variant="interactive" />
          </div>
          <div>
            <h3>Current page stays current</h3>
            <p>The final item reads as current unless the published component receives an explicit current item.</p>
            <span>Do not duplicate primary navigation</span>
          </div>
        </article>
      </div>
    </>
  )
}

function States({
  guide,
  modes,
}: {
  guide: LayoutGuideKey
  modes: Modes
}) {
  if (guide === 'breadcrumbs') {
    return (
      <>
        <div className="state-grid layout-state-grid layout-breadcrumb-state-grid">
          <article className="state-card">
            <div className="state-preview layout-state-preview">
              <BreadcrumbTrail variant="default" />
            </div>
            <h3>Default trail</h3>
            <p>Cloud → ITR → 2024-25 → Original.</p>
          </article>
          <article className="state-card">
            <div className="state-preview layout-state-preview">
              <BreadcrumbTrail variant="wrapping" />
            </div>
            <h3>Long trail</h3>
            <p>Items wrap within the constrained parent.</p>
          </article>
          <article className="state-card">
            <div className="state-preview layout-state-preview">
              <BreadcrumbTrail variant="interactive" />
            </div>
            <h3>Interactive item</h3>
            <p>Ancestor items can navigate; current remains current.</p>
          </article>
        </div>
        <div className="guidance-note">
          <strong>State comes from the route.</strong>
          <p>The trail reflects hierarchy and available width. Do not represent a responsive collapse or item count as a designer-selected control.</p>
        </div>
      </>
    )
  }

  if (guide === 'stack') {
    return (
      <>
        <div className="state-grid layout-state-grid">
          <article className="state-card">
            <div className="state-preview layout-state-preview">
              <StackPreview modes={modes} direction="vertical" />
            </div>
            <h3>Vertical</h3>
            <p>Default column direction for grouped slot content.</p>
          </article>
          <article className="state-card">
            <div className="state-preview layout-state-preview">
              <StackPreview modes={modes} direction="horizontal" />
            </div>
            <h3>Horizontal</h3>
            <p>Explicit row direction for sibling content.</p>
          </article>
          <article className="state-card">
            <div className="state-preview layout-state-preview">
              <StackPreview modes={modes} direction="horizontal" equalHeight />
            </div>
            <h3>Equal height</h3>
            <p>Horizontal children share the tallest height when they can stretch.</p>
          </article>
          <article className="state-card">
            <div className="state-preview layout-state-preview">
              <StackPreview modes={modes} direction="vertical" fillWidth />
            </div>
            <h3>Fill width</h3>
            <p>Vertical children stretch across the stack when they can.</p>
          </article>
        </div>
        <div className="guidance-note">
          <strong>Direction is a configuration choice.</strong>
          <p>Stack does not add overlap, z-order, wrapping, padding, or automatic viewport switching. Use the public component that owns the slot.</p>
        </div>
      </>
    )
  }

  const isHStack = guide === 'hstack'
  const Preview = isHStack ? HStackPreview : VStackPreview
  const label = isHStack ? 'HStack' : 'VStack'
  return (
    <>
      <div className="state-grid layout-state-grid">
        <article className="state-card">
          <div className="state-preview layout-state-preview">
            <Preview modes={modes} />
          </div>
          <h3>Default</h3>
          <p>{label} uses its default direction and token rhythm.</p>
        </article>
        <article className="state-card">
          <div className="state-preview layout-state-preview">
            <Preview modes={{ ...modes, 'Slot gap': 'XL' }} />
          </div>
          <h3>Roomy rhythm</h3>
          <p>Changing the owner gap changes the whole group.</p>
        </article>
        <article className="state-card">
          <div className="state-preview layout-state-preview">
            <Preview modes={{ ...modes, Padding: 'None' }} />
          </div>
          <h3>Host-owned edge</h3>
          <p>None lets a containing pattern own the edge inset.</p>
        </article>
        <article className="state-card">
          <div className="state-preview layout-state-preview">
            <Preview modes={modes} wrap />
          </div>
          <h3>Constrained host</h3>
          <p>Wrapping appears when the host supplies a constraint.</p>
        </article>
      </div>
      <div className="guidance-note">
        <strong>Design the host relationship.</strong>
        <p>A stack is a layout result inside its parent. Make the container boundary and content order clear before changing gap or wrap.</p>
      </div>
    </>
  )
}

function Sizing({
  guide,
  modes,
}: {
  guide: LayoutGuideKey
  modes: Modes
}) {
  if (guide === 'breadcrumbs') {
    return (
      <>
        <div className="responsive-pair layout-responsive-pair">
          <article>
            <span className="context-label">Wide parent</span>
            <div className="layout-responsive-stage layout-wide-breadcrumb">
              <BreadcrumbTrail variant="default" />
            </div>
          </article>
          <article>
            <span className="context-label">Narrow parent</span>
            <div className="layout-responsive-stage layout-narrow-breadcrumb">
              <BreadcrumbTrail variant="wrapping" />
            </div>
          </article>
        </div>
        <p className="system-note">Width comes from the parent. A long trail wraps inside the available space; it does not auto-collapse into a menu.</p>
      </>
    )
  }

  if (guide === 'stack') {
    return (
      <>
        <div className="responsive-pair layout-responsive-pair">
          <article>
            <span className="context-label">Wide parent</span>
            <div className="layout-responsive-stage">
              <StackPreview modes={modes} direction="horizontal" equalHeight />
            </div>
          </article>
          <article>
            <span className="context-label">Narrow parent</span>
            <div className="layout-responsive-stage layout-narrow-stack">
              <StackPreview modes={modes} direction="horizontal" equalHeight />
            </div>
          </article>
        </div>
        <p className="system-note">Stack keeps the configured direction in both hosts. Choose a different public composition when the content role changes; the viewport does not switch layoutDirection for you.</p>
      </>
    )
  }

  const isHStack = guide === 'hstack'
  return (
    <>
      <div className="responsive-pair layout-responsive-pair">
        <article>
          <span className="context-label">Wide parent</span>
          <div className="layout-responsive-stage layout-wide-layout">
            {isHStack ? <HStackPreview modes={modes} /> : <VStackPreview modes={modes} />}
          </div>
        </article>
        <article>
          <span className="context-label">Constrained parent</span>
          <div className="layout-responsive-stage layout-narrow-layout">
            {isHStack ? (
              <HStackPreview modes={modes} wrap />
            ) : (
              <VStackPreview modes={modes} wrap maxWidth={280} />
            )}
          </div>
        </article>
      </div>
      <p className="system-note">
        {isHStack
          ? 'HStack can wrap when its width is constrained. DOM order remains stable.'
          : 'VStack wraps into columns only when its height is constrained. Width alone does not make columns.'}
      </p>
    </>
  )
}

function Content({ guide }: { guide: LayoutGuideKey }) {
  const copy =
    guide === 'hstack'
      ? [
          ['01', 'Group related siblings', 'Use HStack when items belong to one row and should share a rhythm.'],
          ['02', 'Keep order meaningful', 'Reverse changes visual order while assistive technology still follows the DOM order.'],
          ['03', 'Constrain deliberately', 'Wrap needs a meaningful parent width. Avoid a row that can spill beyond its owner.'],
          ['04', 'Use the public slot', 'Populate public component slots with HStack instead of recreating child margins.'],
        ]
      : guide === 'vstack'
        ? [
            ['01', 'Show hierarchy vertically', 'Use the column to make sequence, grouping, and supporting detail easy to scan.'],
            ['02', 'Keep one group together', 'Place related content in one slot so spacing stays contiguous as items change.'],
            ['03', 'Constrain height for wrap', 'Only use wrap when the host has a real height boundary and columns are meaningful.'],
            ['04', 'Let the host own edges', 'Use Default or None padding once. Avoid stacked insets from nested owners.'],
          ]
        : guide === 'stack'
          ? [
              ['01', 'Name the slot role', 'Use Stack for a clear group such as actions, metadata, or supporting copy.'],
              ['02', 'Choose one direction', 'Direction expresses the content relationship and remains stable through viewport changes.'],
              ['03', 'Stretch with intent', 'Use equalHeight for a row or fillWidth for a column when the content benefits from shared edges.'],
              ['04', 'Stay on the public path', 'Designers consume public patterns and component slots; hidden Subcomponents are anatomy references.'],
            ]
          : [
              ['01', 'Start broad', 'Order items from the broadest ancestor toward the current page.'],
              ['02', 'Name the current page', 'Keep the final item concise and aligned with the page title.'],
              ['03', 'Wrap, do not collapse', 'A constrained parent can wrap a long path; it does not invent a different navigation pattern.'],
              ['04', 'Keep it secondary', 'Breadcrumbs supports orientation. It should not compete with primary navigation or the page heading.'],
            ]

  return (
    <div className="content-guidance-grid layout-content-grid">
      {copy.map(([number, title, description], index) => (
        <article
          className={classes('content-rule', index === 0 && 'content-rule-featured')}
          key={number}
        >
          <span>{number}</span>
          <h3>{title}</h3>
          <p>{description}</p>
          {index === 0 ? (
            <div className="rule-example">
              {guide === 'hstack' ? (
                <HStackPreview modes={{ 'Slot gap': 'M', Padding: 'None' }} />
              ) : guide === 'vstack' ? (
                <VStackPreview modes={{ 'Slot gap': 'M', Padding: 'None' }} />
              ) : guide === 'stack' ? (
                <StackPreview modes={{ 'Slot gap': 'M' }} direction="vertical" />
              ) : (
                <BreadcrumbTrail variant="default" />
              )}
            </div>
          ) : null}
        </article>
      ))}
    </div>
  )
}

function Context({
  guide,
  modes,
}: {
  guide: LayoutGuideKey
  modes: Modes
}) {
  if (guide === 'breadcrumbs') {
    return (
      <div className="context-grid layout-context-grid">
        <article className="scenario-card layout-scenario-card">
          <span className="context-label">Report hierarchy</span>
          <h3 className="layout-scenario-title">Cloud / ITR / Original</h3>
          <p className="layout-scenario-copy">Orient people above a report page when the route has meaningful ancestors.</p>
          <BreadcrumbTrail variant="default" />
          <p className="scenario-caption">Breadcrumbs supports orientation.</p>
        </article>
        <article className="scenario-card layout-scenario-card">
          <span className="context-label">Long route</span>
          <h3 className="layout-scenario-title">Keep the path readable</h3>
          <p className="layout-scenario-copy">Keep a long route in its constrained parent so people can still parse each level.</p>
          <BreadcrumbTrail variant="wrapping" />
          <p className="scenario-caption">Wrapping is resolved by width.</p>
        </article>
        <article className="scenario-card media-scenario layout-scenario-card layout-breadcrumb-media-card">
          <span className="context-label">Current location</span>
          <h3 className="layout-scenario-title">Make the final item unmistakable</h3>
          <p className="layout-scenario-copy">The current page should agree with the visible heading and carry current-page semantics.</p>
          <BreadcrumbTrail variant="interactive" />
        </article>
      </div>
    )
  }

  if (guide === 'stack') {
    return (
      <div className="context-grid layout-context-grid">
        <article className="scenario-card layout-scenario-card">
          <span className="context-label">Action footer</span>
          <h3 className="layout-scenario-title">One group, one direction</h3>
          <p className="layout-scenario-copy">Use a vertical Stack when actions belong under supporting copy.</p>
          <StackPreview modes={modes} direction="vertical" fillWidth />
          <p className="scenario-caption">Vertical · fillWidth</p>
        </article>
        <article className="scenario-card layout-scenario-card">
          <span className="context-label">Action row</span>
          <h3 className="layout-scenario-title">Siblings share an edge</h3>
          <p className="layout-scenario-copy">Use horizontal direction when actions are a deliberate row.</p>
          <StackPreview modes={modes} direction="horizontal" equalHeight />
          <p className="scenario-caption">Horizontal · equalHeight</p>
        </article>
        <article className="scenario-card media-scenario layout-scenario-card layout-stack-media-card">
          <span className="context-label">Public slot ownership</span>
          <h3 className="layout-scenario-title">Let the component own the slot</h3>
          <p className="layout-scenario-copy">A public ActionFooter or related component gives this primitive its product meaning.</p>
          <div className="layout-context-diagram" aria-hidden="true">
            <span>Public component</span>
            <b>↓</b>
            <span>Stack slot</span>
            <b>↓</b>
            <span>Coin children</span>
          </div>
        </article>
      </div>
    )
  }

  const isHStack = guide === 'hstack'
  return (
    <div className="context-grid layout-context-grid">
      <article className="scenario-card layout-scenario-card">
        <span className="context-label">Summary row</span>
        <h3 className="layout-scenario-title">{isHStack ? 'Keep values on one line' : 'Keep the page in one flow'}</h3>
        <p className="layout-scenario-copy">
          {isHStack
            ? 'Pair a value, status, and action when they describe one decision.'
            : 'Group a heading, supporting copy, and next step in a clear sequence.'}
        </p>
        {isHStack ? <HStackPreview modes={modes} /> : <VStackPreview modes={modes} />}
        <p className="scenario-caption">{isHStack ? 'Horizontal · related siblings' : 'Vertical · ordered content'}</p>
      </article>
      <article className="scenario-card layout-scenario-card">
        <span className="context-label">Constrained host</span>
        <h3 className="layout-scenario-title">{isHStack ? 'Wrap the row when needed' : 'Keep the edge ownership clear'}</h3>
        <p className="layout-scenario-copy">
          {isHStack
            ? 'A narrow card can wrap the row once there is a real width boundary.'
            : 'A nested group can use None when the surrounding section owns the inset.'}
        </p>
        {isHStack ? <HStackPreview modes={modes} wrap /> : <VStackPreview modes={{ ...modes, Padding: 'None' }} />}
        <p className="scenario-caption">{isHStack ? 'Wrap · constrained width' : 'None · host-owned inset'}</p>
      </article>
      <article className="scenario-card media-scenario layout-scenario-card layout-layout-media-card">
        <span className="context-label">Coin composition</span>
        <h3 className="layout-scenario-title">{isHStack ? 'Make the row do one job' : 'Let vertical rhythm do the explaining'}</h3>
        <p className="layout-scenario-copy">
          {isHStack
            ? 'Use a horizontal stack for related siblings, not unrelated page sections.'
            : 'Use a vertical stack for one coherent group so each gap carries meaning.'}
        </p>
        <div className="layout-context-diagram" aria-hidden="true">
          <span>{isHStack ? 'Value' : 'Heading'}</span>
          <b>→</b>
          <span>{isHStack ? 'Status' : 'Details'}</span>
          <b>→</b>
          <span>{isHStack ? 'Action' : 'Next step'}</span>
        </div>
      </article>
    </div>
  )
}

function DosDonts({
  guide,
  modes,
}: {
  guide: LayoutGuideKey
  modes: Modes
}) {
  if (guide === 'breadcrumbs') {
    return (
      <div className="comparison-stack layout-comparison-stack">
        <div className="comparison-row">
          <article className="comparison-card do-card">
            <p className="comparison-label">Do</p>
            <div className="comparison-preview layout-comparison-preview">
              <BreadcrumbTrail variant="default" />
            </div>
            <h3>Order the trail from ancestor to current</h3>
            <p>The route becomes easier to scan and the current page has a clear endpoint.</p>
          </article>
          <article className="comparison-card dont-card">
            <p className="comparison-label">Don’t</p>
            <div className="comparison-preview layout-comparison-preview layout-bad-trail">
              <span className="layout-bad-trail-label">Illustration of incorrect route</span>
              <span>Original</span>
              <b>›</b>
              <span>Cloud</span>
              <b>›</b>
              <span>ITR</span>
            </div>
            <h3>Reverse the route to match a visual shortcut</h3>
            <p>The reading order stops matching the hierarchy and current location becomes ambiguous.</p>
          </article>
        </div>
        <div className="comparison-row">
          <article className="comparison-card do-card">
            <p className="comparison-label">Do</p>
            <div className="comparison-preview layout-comparison-preview">
              <BreadcrumbTrail variant="wrapping" />
            </div>
            <h3>Let a long trail wrap inside its parent</h3>
            <p>Available width stays visible and the route remains available for orientation.</p>
          </article>
          <article className="comparison-card dont-card">
            <p className="comparison-label">Don’t</p>
            <div className="comparison-preview layout-comparison-preview layout-bad-trail">
              <span className="layout-bad-trail-label">Illustration of incorrect route</span>
              <span>Cloud</span>
              <b>›</b>
              <span>ITR</span>
              <b>›</b>
              <span>…</span>
            </div>
            <h3>Invent an unapproved auto-collapse</h3>
            <p>The component does not decide to replace route levels with an ellipsis menu.</p>
          </article>
        </div>
      </div>
    )
  }

  if (guide === 'stack') {
    return (
      <div className="comparison-stack layout-comparison-stack">
        <div className="comparison-row">
          <article className="comparison-card do-card">
            <p className="comparison-label">Do</p>
            <div className="comparison-preview layout-comparison-preview">
              <StackPreview modes={modes} direction="vertical" fillWidth />
            </div>
            <h3>Let a vertical slot fill its width</h3>
            <p>Use fill width when the children should share the column edge.</p>
          </article>
          <article className="comparison-card dont-card">
            <p className="comparison-label">Don’t</p>
            <div className="comparison-preview layout-comparison-preview">
              <StackPreview modes={modes} direction="vertical" fillWidth fixedChildren />
            </div>
            <h3>Fix child widths when the column should fill</h3>
            <p>Fixed child dimensions still win, so the column edge no longer aligns.</p>
          </article>
        </div>
        <div className="comparison-row">
          <article className="comparison-card do-card">
            <p className="comparison-label">Do</p>
            <div className="comparison-preview layout-comparison-preview">
              <StackPreview modes={{ ...modes, 'Slot gap': 'M' }} direction="vertical" fillWidth />
            </div>
            <h3>Use fill width when column edges should align</h3>
            <p>Vertical children can share the stack width when they support stretch.</p>
          </article>
          <article className="comparison-card dont-card">
            <p className="comparison-label">Don’t</p>
            <div className="comparison-preview layout-comparison-preview layout-overflow-preview">
              <StackPreview modes={{ ...modes, 'Slot gap': 'XL' }} direction="vertical" />
            </div>
            <h3>Use Stack as a catch-all page canvas</h3>
            <p>Stack has no wrap, padding, or overlap semantics for unrelated sections.</p>
          </article>
        </div>
      </div>
    )
  }

  const isHStack = guide === 'hstack'
  return (
    <div className="comparison-stack layout-comparison-stack">
      <div className="comparison-row">
        <article className="comparison-card do-card">
          <p className="comparison-label">Do</p>
          <div className="comparison-preview layout-comparison-preview">
            {isHStack ? <HStackPreview modes={modes} wrap /> : <VStackPreview modes={modes} />}
          </div>
          <h3>{isHStack ? 'Wrap inside a real width boundary' : 'Keep one coherent group together'}</h3>
          <p>{isHStack ? 'The host makes available width visible and the row can continue on a second line.' : 'A single vertical flow keeps hierarchy and rhythm contiguous.'}</p>
        </article>
        <article className="comparison-card dont-card">
          <p className="comparison-label">Don’t</p>
          <div className="comparison-preview layout-comparison-preview layout-overflow-preview">
            {isHStack ? <HStackPreview modes={modes} /> : <VStackPreview modes={{ ...modes, 'Slot gap': 'XL' }} />}
          </div>
          <h3>{isHStack ? 'Let children spill out of the owner' : 'Use a giant gap to separate unrelated sections'}</h3>
          <p>{isHStack ? 'A row without a width constraint can overflow and lose its relationship to the parent.' : 'Spacing cannot repair a missing grouping boundary or unclear content hierarchy.'}</p>
        </article>
      </div>
      <div className="comparison-row">
        <article className="comparison-card do-card">
          <p className="comparison-label">Do</p>
          <div className="comparison-preview layout-comparison-preview">
            {isHStack ? <HStackPreview modes={{ ...modes, Padding: 'None' }} align="Left" /> : <VStackPreview modes={{ ...modes, Padding: 'None' }} />}
          </div>
          <h3>{isHStack ? 'Let the host own the edge inset' : 'Use None when the section owns the inset'}</h3>
          <p>The visible boundary has one clear owner and the content remains aligned.</p>
        </article>
        <article className="comparison-card dont-card">
          <p className="comparison-label">Don’t</p>
          <div className="comparison-preview layout-comparison-preview layout-double-inset-preview">
            {isHStack ? <HStackPreview modes={{ ...modes, Padding: 'Default' }} /> : <VStackPreview modes={{ ...modes, Padding: 'Default' }} />}
          </div>
          <h3>Stack component insets without a reason</h3>
          <p>Nested owners can create an unintended double edge and weaken alignment.</p>
        </article>
      </div>
    </div>
  )
}

function Sources({ guide }: { guide: LayoutGuideKey }) {
  const meta = META[guide]
  return (
    <>
      <div className="sources-grid layout-sources-grid">
        <a href={meta.figmaUrl} target="_blank" rel="noreferrer">
          <span className="source-index">01</span>
          <div>
            <h3>Figma source</h3>
            <p>{meta.figmaSource}</p>
          </div>
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" />
          </svg>
        </a>
        <a href={meta.storybookUrl} target="_blank" rel="noreferrer">
          <span className="source-index">02</span>
          <div>
            <h3>Published Storybook</h3>
            <p>{meta.storybookSource}</p>
          </div>
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" />
          </svg>
        </a>
      </div>
      <div className="verification-note layout-verification-note">
        <span>Checked 15 September 2026</span>
        <p>
          Live layout examples use public exports from jfs-components 0.1.60.
          {guide === 'breadcrumbs'
            ? ' Breadcrumbs previews are code-rendered documentation references built from public leaf primitives because the resolved package does not include Breadcrumbs; use the Storybook link for the shipped runtime.'
            : ' ' + meta.name + ' uses its public package export with token-driven modes; documentation controls change owner configuration, not component internals.'}
        </p>
      </div>
      {guide === 'breadcrumbs' ? <BreadcrumbsGapNote /> : null}
    </>
  )
}

function GuideFooter() {
  return (
    <footer>
      <span>Coin designer documentation</span>
      <a href="#overview">Back to top ↑</a>
    </footer>
  )
}

export function LayoutGuidePage({ guide }: { guide: LayoutGuideKey }) {
  useGuidePageNavigation()

  const meta = META[guide]
  useLayoutEffect(() => {
    const previousTitle = document.title
    document.title = meta.name + ' · Coin designer documentation'
    return () => {
      document.title = previousTitle
    }
  }, [meta.name])

  const [gap, setGap] = useState<Gap>('M')
  const [padding, setPadding] = useState<Padding>('Default')
  const [colorMode, setColorMode] = useState<ColorMode>('Light')
  const [wrap, setWrap] = useState(false)
  const [reverse, setReverse] = useState(false)
  const [align, setAlign] = useState<'Top Left' | 'Left'>('Top Left')
  const [direction, setDirection] = useState<StackLayoutDirection>('vertical')
  const [equalHeight, setEqualHeight] = useState(false)
  const [fillWidth, setFillWidth] = useState(false)

  const modes = useMemo(() => {
    if (guide === 'stack' || guide === 'breadcrumbs') {
      return { 'Slot gap': gap } as Modes
    }
    return {
      'Slot gap': gap,
      Padding: padding,
      'Stack Context': 'Root',
      'Color Mode': 'Light',
    } as Modes
  }, [gap, guide, padding])

  const playgroundModes = useMemo(() => {
    if (guide === 'stack' || guide === 'breadcrumbs') {
      return { 'Slot gap': gap } as Modes
    }
    return {
      'Slot gap': gap,
      Padding: padding,
      'Stack Context': 'Root',
      'Color Mode': colorMode,
    } as Modes
  }, [colorMode, gap, guide, padding])

  const configContent =
    guide === 'hstack' ? <HStackConfig modes={modes} /> :
      guide === 'vstack' ? <VStackConfig modes={modes} /> :
        guide === 'stack' ? <StackConfig modes={modes} /> :
          <BreadcrumbsConfig />

  const anatomy =
    guide === 'hstack' ? <HStackAnatomy modes={modes} /> :
      guide === 'vstack' ? <VStackAnatomy modes={modes} /> :
        guide === 'stack' ? <StackAnatomy modes={modes} /> :
          <BreadcrumbsAnatomy />

  const anatomyIntro =
    guide === 'hstack'
      ? 'See the row, slot, rhythm, and cross-axis behavior in one live example.'
      : guide === 'vstack'
        ? 'See the column, slot, rhythm, and inset in one live example.'
        : guide === 'stack'
          ? 'See the slot, direction, gap, and cross-axis fit that make Stack useful.'
          : 'Read the route from ancestor to current and keep the component secondary to the page heading.'

  const configurationIntro =
    guide === 'hstack'
      ? 'Choose the row rhythm and constraint. Alignment supports the row; it does not replace content hierarchy.'
      : guide === 'vstack'
        ? 'Choose vertical rhythm and inset once. Wrap is meaningful only inside a real height boundary.'
        : guide === 'stack'
          ? 'Set direction and cross-axis behavior for the public slot that owns this Stack.'
          : 'Breadcrumbs has no exposed properties in the inspected Figma source. Configure content hierarchy and let the published component render the path.'

  const stateIntro =
    guide === 'breadcrumbs'
      ? 'The published stories show a default trail, a long trail, and interactive ancestors. Width and route data drive the outcome.'
      : 'Compare default, changed rhythm, host-owned edge, and constrained outcomes without recreating the layout primitive.'

  const contextIntro =
    guide === 'breadcrumbs'
      ? 'Use Breadcrumbs above page content when the route supports backtracking.'
      : guide === 'stack'
        ? 'Use Stack in the slot owned by a public component, where direction and gap carry product meaning.'
        : guide === 'hstack'
          ? 'Use HStack for related siblings that belong on one row or wrap as one group.'
          : 'Use VStack for one coherent vertical group, from heading through supporting detail and next step.'

  const dontIntro =
    guide === 'breadcrumbs'
      ? 'These pairs keep hierarchy readable and leave route behavior to the published component.'
      : guide === 'stack'
        ? 'These pairs keep Stack focused on one public slot and one intentional direction.'
        : 'These pairs keep the layout relationship visible as content and host constraints change.'

  return (
    <div className={classes('site-shell', 'layout-docs', 'layout-docs-' + guide)}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <GuideSidebar active={guide} />
      <main id="main-content" className="content" tabIndex={-1}>
        <GuideMobileBar />
        <MobileComponentNav active={guide} />
        <MobilePageNav />
        <article>
          <section id="overview" className="hero-section anchor-section">
            <div className="hero-copy">
              <p className="breadcrumb">Components / {meta.name}</p>
              <div className="hero-title-row">
                <h1>{meta.name}</h1>
                <span className="public-badge">{guide === 'stack' ? 'Layout anatomy' : 'Public component'}</span>
              </div>
              <p className="hero-lede">{meta.lede}</p>
              <p className="recommendation-label">Usage recommendations</p>
              <div className="hero-links">
                <SourceLink href={meta.figmaUrl}>Open in Figma</SourceLink>
                <SourceLink href={meta.storybookUrl}>View Storybook</SourceLink>
              </div>
            </div>
            <div className="principle-card">
              <span className="principle-number" aria-hidden="true">01</span>
              <p className="eyebrow">Core principle</p>
              <p>{meta.principle}</p>
            </div>
          </section>

          <Playground
            guide={guide}
            modes={playgroundModes}
            gap={gap}
            padding={padding}
            colorMode={colorMode}
            wrap={wrap}
            reverse={reverse}
            align={align}
            direction={direction}
            equalHeight={equalHeight}
            fillWidth={fillWidth}
            setGap={setGap}
            setPadding={setPadding}
            setColorMode={setColorMode}
            setWrap={setWrap}
            setReverse={setReverse}
            setAlign={setAlign}
            setDirection={setDirection}
            setEqualHeight={setEqualHeight}
            setFillWidth={setFillWidth}
          />

          <Section id="anatomy" eyebrow="Anatomy" title={guide === 'breadcrumbs' ? 'A path with a clear endpoint' : meta.name + ' has one job'} intro={anatomyIntro}>
            {anatomy}
          </Section>
          <Section id="configuration" eyebrow="Configuration" title={guide === 'breadcrumbs' ? 'Configuration follows the route' : 'Configure the owner, then read the result'} intro={configurationIntro}>
            {configContent}
          </Section>
          <Section id="states" eyebrow="States" title={guide === 'breadcrumbs' ? 'States follow hierarchy and width' : meta.name + ' responds to its host'} intro={stateIntro}>
            <States guide={guide} modes={modes} />
          </Section>
          <Section
            id="sizing"
            eyebrow="Sizing"
            title="The parent supplies the constraint"
            intro={
              guide === 'breadcrumbs'
                ? 'A Breadcrumbs trail stays in the available parent and wraps when the route is longer than the line.'
                : guide === 'vstack'
                  ? 'VStack wrap is a height outcome. Width alone does not turn a column into a grid.'
                  : guide === 'hstack'
                    ? 'HStack wrap is a width outcome. Keep the parent boundary meaningful before enabling it.'
                    : 'Stack keeps its chosen direction at every width. Responsive intent belongs to the owning public composition.'
            }
          >
            <Sizing guide={guide} modes={modes} />
          </Section>
          <Section
            id="content"
            eyebrow="Content"
            title="Make the relationship visible"
            intro={
              guide === 'hstack'
                ? 'Rows work when siblings are related by one decision or task.'
                : guide === 'vstack'
                  ? 'Columns work when sequence and grouping make the page easier to read.'
                  : guide === 'stack'
                    ? 'Stack works when a public slot has a clear group and direction.'
                    : 'Breadcrumbs works when the route has meaningful ancestors and the current page needs orientation.'
            }
          >
            <Content guide={guide} />
          </Section>
          <Section id="context" eyebrow="In context" title="Place the primitive where the relationship happens" intro={contextIntro}>
            <Context guide={guide} modes={modes} />
          </Section>
          <Section id="dos-donts" eyebrow="Do & Don’ts" title="Protect structure and clarity" intro={dontIntro}>
            <DosDonts guide={guide} modes={modes} />
          </Section>
          <section id="sources" className="doc-section sources-section anchor-section">
            <Header eyebrow="Sources" title="Grounded in the published component">
              The guide separates designer choices from behavior supplied by the public library at runtime.
            </Header>
            <Sources guide={guide} />
          </section>
        </article>
        <GuideFooter />
      </main>
    </div>
  )
}

export function getLayoutGuideFromLocation(): LayoutGuideKey | null {
  if (typeof window === 'undefined') return null
  const component = new URLSearchParams(window.location.search).get('component')
  return component === 'hstack' || component === 'vstack' || component === 'stack' || component === 'breadcrumbs'
    ? component
    : null
}

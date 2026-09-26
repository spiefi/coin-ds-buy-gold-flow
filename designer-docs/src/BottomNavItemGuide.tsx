import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react'
import {
  BottomNav,
  BottomNavItem,
  Card,
  Title,
  type Modes,
} from 'jfs-components'
import {
  ComponentGuideTemplate,
  type GuideSectionSlots,
} from './ComponentGuideTemplate'
import {
  AnatomyKey,
  AnatomyOverlay,
  Readout,
  Segment,
  SourceCards,
  Toggle,
  classes,
  clampPin,
  measureBox,
  storyUrl,
  useAnatomyLayout,
  type AnatomyLayout,
  type AnatomyShape,
} from './GuideParts'

const FIGMA_URL =
  'https://www.figma.com/design/3z7bmhA73Ls7j8Eu4qhYhE/Coin-Components-Library?node-id=306-92'
const STORYBOOK_URL =
  'https://jfs-components-storybook.vercel.app/?path=/docs/components-bottomnavitem--docs'
const STORIES = [
  { label: 'Default story', url: storyUrl('components-bottomnavitem--default') },
  { label: 'With custom icons', url: storyUrl('components-bottomnavitem--with-custom-icons') },
  { label: 'Disabled state', url: storyUrl('components-bottomnavitem--disabled-state') },
  { label: 'BottomNav composition', url: storyUrl('components-bottomnav--default') },
] as const

type ItemState = 'Idle' | 'Active'
type DestinationCount = '3' | '4' | '5'
type Destination = {
  value: string
  label: string
  iconName: string
  subtitle: string
  detail: string
}

const DESTINATIONS: readonly Destination[] = [
  {
    value: 'home',
    label: 'Home',
    iconName: 'ic_home',
    subtitle: 'Your accounts at a glance',
    detail: 'Balances, recent payments, and reminders.',
  },
  {
    value: 'finances',
    label: 'Finances',
    iconName: 'ic_rupee',
    subtitle: 'Money in and out',
    detail: 'Spending by category for this month.',
  },
  {
    value: 'pay',
    label: 'Pay',
    iconName: 'ic_scan_qr_code',
    subtitle: 'Scan or pay a contact',
    detail: 'Scan a QR code or choose a saved contact.',
  },
  {
    value: 'invest',
    label: 'Invest',
    iconName: 'ic_rupee_coin',
    subtitle: 'Funds and SIPs',
    detail: 'Track your SIPs and fund holdings.',
  },
  {
    value: 'explore',
    label: 'Explore',
    iconName: 'ic_search',
    subtitle: 'Find new services',
    detail: 'Browse offers and new services.',
  },
]

const DESTINATION_SETS: Record<DestinationCount, readonly string[]> = {
  '3': ['home', 'pay', 'explore'],
  '4': ['home', 'finances', 'pay', 'explore'],
  '5': ['home', 'finances', 'pay', 'invest', 'explore'],
}

// The Figma set resolves Color Mode Light and Brand Jio Finance. BottomNav
// adds the BottomNavItem / State mode for each item from its value.
const BAR_MODES = { 'Color Mode': 'Light' } as Modes
const IDLE_MODES = { 'Color Mode': 'Light', 'BottomNavItem / State': 'Idle' } as Modes
const ACTIVE_MODES = { 'Color Mode': 'Light', 'BottomNavItem / State': 'Active' } as Modes

function destinations(count: DestinationCount) {
  return DESTINATION_SETS[count].map(
    (value) => DESTINATIONS.find((destination) => destination.value === value)!,
  )
}

function destination(value: string) {
  return DESTINATIONS.find((item) => item.value === value) ?? DESTINATIONS[0]
}

// ---------------------------------------------------------------------------
// Specimens
// ---------------------------------------------------------------------------

function NavBar({
  items,
  value,
  onChange,
  disabledValue,
  interactive = false,
  className,
  frameRef,
}: {
  items: ReadonlyArray<Pick<Destination, 'value' | 'label' | 'iconName'>>
  value: string
  onChange?: (value: string) => void
  disabledValue?: string
  interactive?: boolean
  className?: string
  frameRef?: RefObject<HTMLDivElement | null>
}) {
  return (
    <div
      ref={frameRef}
      className={classes('coin-bottomnav-bar-frame', className)}
      inert={!interactive}
    >
      <BottomNav
        value={value}
        onChange={onChange ? (next) => onChange(String(next)) : undefined}
        modes={BAR_MODES}
      >
        {items.map((item) => (
          <BottomNav.Item
            key={item.value}
            value={item.value}
            label={item.label}
            iconName={item.iconName}
            disabled={item.value === disabledValue}
          />
        ))}
      </BottomNav>
    </div>
  )
}

function StandaloneItem({
  label = 'Home',
  iconName = 'ic_home',
  state = 'Idle',
  disabled = false,
  caption,
}: {
  label?: string
  iconName?: string
  state?: ItemState
  disabled?: boolean
  caption?: string
}) {
  return (
    <figure className="coin-bottomnav-standalone">
      <div className="coin-bottomnav-standalone-item" inert>
        <BottomNavItem
          label={label}
          iconName={iconName}
          modes={state === 'Active' ? ACTIVE_MODES : IDLE_MODES}
          disabled={disabled}
        />
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  )
}

type TabMetrics = { widths: number[]; height: number }

function readTabs(frame: HTMLElement | null): TabMetrics | null {
  if (!frame) return null
  const tabs = Array.from(frame.querySelectorAll<HTMLElement>('[role="tab"]'))
  if (!tabs.length) return null
  return {
    widths: tabs.map((tab) => Math.round(tab.getBoundingClientRect().width * 10) / 10),
    height: Math.round(tabs[0].getBoundingClientRect().height),
  }
}

function useTabMetrics(frameRef: RefObject<HTMLDivElement | null>, key: string) {
  const [metrics, setMetrics] = useState<TabMetrics | null>(null)

  useLayoutEffect(() => {
    const frame = frameRef.current
    if (!frame) return
    let active = true
    const measure = () => {
      if (!active) return
      const next = readTabs(frame)
      if (!next) return
      setMetrics((current) =>
        current && JSON.stringify(current) === JSON.stringify(next) ? current : next,
      )
    }
    const observer =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure)
    observer?.observe(frame)
    const frameId = requestAnimationFrame(measure)
    void document.fonts?.ready.then(measure)
    window.addEventListener('resize', measure)
    return () => {
      active = false
      cancelAnimationFrame(frameId)
      observer?.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [frameRef, key])

  return metrics
}

function formatPx(value: number) {
  return Number.isInteger(value) ? `${value}` : value.toFixed(1)
}

// ---------------------------------------------------------------------------
// Anatomy
// ---------------------------------------------------------------------------

function readItemAnatomy(frame: HTMLDivElement): AnatomyLayout | null {
  const item = frame.querySelector<HTMLElement>('[data-bottomnav-anatomy] [role="tab"]')
  const icon = item?.children[0] as HTMLElement | undefined
  const label = item?.children[1] as HTMLElement | undefined
  if (!item || !icon || !label || !item.offsetWidth) return null

  const frameRect = frame.getBoundingClientRect()
  const width = frameRect.width
  const height = frameRect.height
  const itemBox = measureBox(item, frameRect)
  const iconBox = measureBox(icon, frameRect)
  const labelBox = measureBox(label, frameRect)
  const scale = itemBox.width / item.offsetWidth
  const iconBottom = iconBox.top + iconBox.height
  const labelBottom = labelBox.top + labelBox.height
  const itemRight = itemBox.left + itemBox.width
  const itemBottom = itemBox.top + itemBox.height
  const gap = (labelBox.top - iconBottom) / scale

  const dimX = itemRight + 20
  const tick = (y: number) => `M ${dimX - 4} ${y} H ${dimX + 4}`
  const shapes: AnatomyShape[] = [
    { kind: 'bounds', box: itemBox },
    { kind: 'child', box: iconBox },
    { kind: 'child', box: labelBox },
    {
      kind: 'dimension',
      path: `${tick(iconBox.top)} M ${dimX} ${iconBox.top} V ${iconBottom} ${tick(iconBottom)}`,
      label: formatPx(Math.round(icon.offsetHeight)),
      x: dimX + 10,
      y: iconBox.top + iconBox.height / 2 + 4,
      align: 'start',
    },
    {
      kind: 'dimension',
      path: `M ${dimX} ${iconBottom} V ${labelBox.top} ${tick(labelBox.top)}`,
      label: formatPx(Math.round(gap)),
      x: dimX + 10,
      y: (iconBottom + labelBox.top) / 2 + 4,
      align: 'start',
    },
    {
      kind: 'dimension',
      path: `M ${dimX} ${labelBox.top} V ${labelBottom} ${tick(labelBottom)}`,
      label: formatPx(Math.round(label.offsetHeight)),
      x: dimX + 10,
      y: labelBox.top + labelBox.height / 2 + 4,
      align: 'start',
    },
    {
      kind: 'dimension',
      path: `M ${itemBox.left} ${itemBox.top - 22} V ${itemBox.top - 14} M ${itemBox.left} ${itemBox.top - 18} H ${itemRight} M ${itemRight} ${itemBox.top - 22} V ${itemBox.top - 14}`,
      label: `${formatPx(item.offsetWidth)} × ${formatPx(item.offsetHeight)}`,
      x: itemBox.left + itemBox.width / 2,
      y: itemBox.top - 28,
    },
  ]

  const iconPin = clampPin(itemBox.left - 46, iconBox.top + iconBox.height / 2, width, height)
  const labelPin = clampPin(itemBox.left - 46, labelBox.top + labelBox.height / 2, width, height)
  const itemPin = clampPin(itemBox.left + itemBox.width / 2, itemBottom + 34, width, height)

  return {
    width,
    height,
    shapes,
    pins: [
      { number: 1, ...iconPin, path: `M ${iconPin.x + 11} ${iconPin.y} H ${iconBox.left - 3}` },
      { number: 2, ...labelPin, path: `M ${labelPin.x + 11} ${labelPin.y} H ${labelBox.left - 3}` },
      { number: 3, ...itemPin, path: `M ${itemPin.x} ${itemPin.y - 11} V ${itemBottom + 3}` },
    ],
  }
}

function BottomNavItemAnatomy() {
  const ref = useRef<HTMLDivElement>(null)
  const layout = useAnatomyLayout(ref, readItemAnatomy)
  return (
    <div className="coin-guide-anatomy-stage coin-bottomnav-anatomy-stage" ref={ref}>
      <span className="coin-guide-zoom-note">Enlarged view · 3×</span>
      <div className="coin-bottomnav-anatomy-live" data-bottomnav-anatomy="" inert>
        <BottomNavItem label="Home" iconName="ic_home" modes={ACTIVE_MODES} />
      </div>
      <AnatomyOverlay layout={layout} />
    </div>
  )
}

// Documentation overlay: outlines each rendered tab so the equal share is visible.
function readBarTabs(frame: HTMLDivElement): AnatomyLayout | null {
  const tabs = Array.from(frame.querySelectorAll<HTMLElement>('[role="tab"]'))
  if (!tabs.length) return null
  const frameRect = frame.getBoundingClientRect()
  return {
    width: frameRect.width,
    height: frameRect.height,
    pins: [],
    shapes: tabs.map((tab) => ({ kind: 'child' as const, box: measureBox(tab, frameRect) })),
  }
}

function MeasuredBar({ count }: { count: DestinationCount }) {
  const frameRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const metrics = useTabMetrics(frameRef, count)
  const layout = useAnatomyLayout(overlayRef, readBarTabs)
  const items = destinations(count)
  return (
    <figure className="coin-bottomnav-measured">
      <div className="coin-bottomnav-measured-frame" ref={overlayRef}>
        <NavBar items={items} value="home" frameRef={frameRef} className="is-compact" />
        <AnatomyOverlay layout={layout} />
      </div>
      <figcaption>
        <b>{count} items</b>
        {metrics ? (
          <span>
            each <strong>{formatPx(metrics.widths[0])}</strong> × {metrics.height} px
          </span>
        ) : (
          <span>Measuring…</span>
        )}
      </figcaption>
    </figure>
  )
}

function HugItem({ label, iconName }: { label: string; iconName: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<{ width: number; height: number } | null>(null)

  useLayoutEffect(() => {
    const node = ref.current
    if (!node) return
    const measure = () => {
      const item = node.querySelector<HTMLElement>('[role="tab"]')
      if (!item) return
      const next = { width: item.offsetWidth, height: item.offsetHeight }
      setSize((current) =>
        current && current.width === next.width && current.height === next.height ? current : next,
      )
    }
    const observer =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure)
    observer?.observe(node)
    const frameId = requestAnimationFrame(measure)
    void document.fonts?.ready.then(measure)
    return () => {
      cancelAnimationFrame(frameId)
      observer?.disconnect()
    }
  }, [])

  return (
    <figure className="coin-bottomnav-hug">
      <div className="coin-bottomnav-hug-bounds" ref={ref} inert>
        <BottomNavItem label={label} iconName={iconName} modes={IDLE_MODES} />
      </div>
      <figcaption>{size ? `${size.width} × ${size.height} px` : 'Measuring…'}</figcaption>
    </figure>
  )
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

function AppScreenExample() {
  const [value, setValue] = useState('home')
  const current = destination(value)
  const items = destinations('5')

  return (
    <div className="coin-bottomnav-context">
      <div className="coin-bottomnav-screen-frame">
        <div className="coin-bottomnav-screen-content" aria-live="polite">
          <Title title={current.label} modes={BAR_MODES} />
          <Card variant="slim" modes={BAR_MODES}>
            <Card.Title>{current.subtitle}</Card.Title>
            <Card.SupportText>{current.detail}</Card.SupportText>
          </Card>
        </div>
        <NavBar items={items} value={value} onChange={setValue} interactive />
      </div>
      <p className="coin-guide-caption">
        Choose a destination. BottomNav marks it Active and the screen above changes.
      </p>
    </div>
  )
}

function Comparison({
  kind,
  title,
  description,
  children,
}: {
  kind: 'do' | 'dont'
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <article className={classes('comparison-card', kind === 'do' ? 'do-card' : 'dont-card')}>
      <p className="comparison-label">{kind === 'do' ? 'Do' : 'Don’t'}</p>
      <div className="comparison-preview coin-bottomnav-comparison-preview">{children}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  )
}

function Specimen({
  eyebrow,
  title,
  description,
  children,
  stageClassName,
}: {
  eyebrow?: string
  title: string
  description: ReactNode
  children: ReactNode
  stageClassName?: string
}) {
  return (
    <article className="coin-guide-card">
      {eyebrow ? <p className="coin-guide-card-eyebrow">{eyebrow}</p> : null}
      <div className={classes('coin-guide-card-stage', stageClassName)}>{children}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  )
}

const LONG_LABEL_ITEMS = [
  { value: 'home', label: 'Home', iconName: 'ic_home' },
  { value: 'finances', label: 'Finances', iconName: 'ic_rupee' },
  { value: 'invest', label: 'Investments and savings', iconName: 'ic_rupee_coin' },
  { value: 'explore', label: 'Explore', iconName: 'ic_search' },
]

const SHORT_LABEL_ITEMS = [
  { value: 'home', label: 'Home', iconName: 'ic_home' },
  { value: 'finances', label: 'Finances', iconName: 'ic_rupee' },
  { value: 'invest', label: 'Invest', iconName: 'ic_rupee_coin' },
  { value: 'explore', label: 'Explore', iconName: 'ic_search' },
]

const ICON_ONLY_ITEMS = SHORT_LABEL_ITEMS.map((item) => ({ ...item, label: '' }))

// ---------------------------------------------------------------------------
// Guide
// ---------------------------------------------------------------------------

export function BottomNavItemGuide() {
  const [count, setCount] = useState<DestinationCount>('4')
  const [active, setActive] = useState('home')
  const [payUnavailable, setPayUnavailable] = useState(false)
  const frameRef = useRef<HTMLDivElement>(null)
  const items = destinations(count)
  const selectable = items.filter((item) => !(payUnavailable && item.value === 'pay'))
  const activeValue = selectable.some((item) => item.value === active) ? active : 'home'
  const current = destination(activeValue)
  const metrics = useTabMetrics(frameRef, `${count}|${payUnavailable}`)
  const chooseActive = useCallback((value: string) => setActive(value), [])
  const changePayUnavailable = useCallback((checked: boolean) => {
    setPayUnavailable(checked)
    if (checked) setActive((value) => (value === 'pay' ? 'home' : value))
  }, [])

  const sections: GuideSectionSlots = {
    anatomy: {
      header: 'Anatomy',
      title: 'An icon above a short label',
      description:
        'The item stacks a registry icon over its label. The State mode colors both parts; the label also names the tab.',
      body: (
        <div className="anatomy-card coin-guide-anatomy-card">
          <BottomNavItemAnatomy />
          <ol className="anatomy-list coin-guide-anatomy-list">
            <AnatomyKey number={1} label="Icon">
              A 24 px registry icon. State colors it grey when Idle and gold when Active.
            </AnatomyKey>
            <AnatomyKey number={2} label="Label">
              11 px medium text, 6 px below the icon. On the web it also becomes the tab’s spoken name.
            </AnatomyKey>
            <AnatomyKey number={3} label="Item">
              Hugs its content on its own. Inside BottomNav, every item stretches to an equal share of the bar.
            </AnatomyKey>
          </ol>
        </div>
      ),
    },
    configuration: {
      header: 'Configuration',
      title: 'Choose the icon and label; State comes from the bar',
      description:
        'Figma exposes State, the icon, and the label. In code, the icon and label are properties and State is the BottomNavItem / State mode, which BottomNav sets from its value.',
      body: (
        <div className="coin-guide-card-grid">
          <Specimen
            eyebrow="Icon + label"
            title="One destination per item"
            description="Pair a familiar registry icon with the destination’s name."
          >
            <div className="coin-bottomnav-row">
              <StandaloneItem label="Home" iconName="ic_home" />
              <StandaloneItem label="Pay" iconName="ic_scan_qr_code" />
              <StandaloneItem label="Explore" iconName="ic_search" />
            </div>
          </Specimen>
          <Specimen
            eyebrow="BottomNavItem / State"
            title="Idle or Active"
            description="Active turns the icon gold and darkens the label. Only the current destination should be Active."
          >
            <div className="coin-bottomnav-row">
              <StandaloneItem label="Finances" iconName="ic_rupee" state="Idle" caption="Idle" />
              <StandaloneItem label="Finances" iconName="ic_rupee" state="Active" caption="Active" />
            </div>
          </Specimen>
        </div>
      ),
    },
    states: {
      header: 'States',
      title: 'Idle, Active, and unavailable',
      description:
        'Idle and Active come from the State mode. Disabled is a property: the item fades and stops responding, but keeps its place in the bar.',
      body: (
        <div className="coin-guide-stack">
          <div className="coin-guide-card-grid is-three">
            <Specimen eyebrow="State mode" title="Idle" description="Any destination other than the current one.">
              <StandaloneItem label="Pay" iconName="ic_scan_qr_code" state="Idle" />
            </Specimen>
            <Specimen eyebrow="State mode" title="Active" description="The destination people are on now.">
              <StandaloneItem label="Pay" iconName="ic_scan_qr_code" state="Active" />
            </Specimen>
            <Specimen eyebrow="disabled" title="Unavailable" description="Half opacity. The item cannot be pressed or reached with Tab.">
              <StandaloneItem label="Pay" iconName="ic_scan_qr_code" disabled />
            </Specimen>
          </div>
          <div className="guidance-note">
            <strong>Press, hover, and keyboard focus</strong>
            <p>
              On the web, hover fades an item to 85% opacity and a touch press fades it to 70%. Keyboard focus adds a dark 2 px line under the item alongside the browser’s focus ring. Try them in the live example above.
            </p>
          </div>
        </div>
      ),
    },
    sizing: {
      header: 'Sizing',
      title: 'The item hugs its label; the bar shares its width',
      description:
        'On its own, an item is as wide as its label. BottomNav gives every item the same share of the bar, so fewer items mean wider tap targets.',
      body: (
        <div className="coin-guide-card-grid coin-bottomnav-sizing-grid">
          <Specimen
            eyebrow="Standalone"
            title="Width follows the label"
            description="Both items are 44 px high. The longer label makes Finances wider."
          >
            <div className="coin-bottomnav-row">
              <HugItem label="Home" iconName="ic_home" />
              <HugItem label="Finances" iconName="ic_rupee" />
            </div>
          </Specimen>
          <Specimen
            eyebrow="Inside BottomNav"
            title="Equal shares of the bar"
            description="The same bar width divided by three or five items."
            stageClassName="coin-bottomnav-bars-stage"
          >
            <div className="coin-bottomnav-bars">
              <MeasuredBar count="3" />
              <MeasuredBar count="5" />
            </div>
          </Specimen>
        </div>
      ),
    },
    content: {
      header: 'Content',
      title: 'Name each destination plainly',
      description:
        'The label is both the visible name and, on the web, the spoken name of the tab. Keep it short and specific.',
      body: (
        <div className="content-guidance-grid">
          <article className="content-rule content-rule-featured">
            <span aria-hidden="true">01</span>
            <h3>Use one or two words</h3>
            <p>Home, Finances, Pay, and Explore fit on one line and scan quickly.</p>
            <div className="rule-example coin-bottomnav-rule-example">
              <NavBar items={destinations('4')} value="home" className="is-compact" />
            </div>
          </article>
          <article className="content-rule">
            <span aria-hidden="true">02</span>
            <h3>The label is the spoken name</h3>
            <p>
              The icon is hidden from assistive technology. Add an accessibility label only when the visible label is abbreviated.
            </p>
          </article>
          <article className="content-rule">
            <span aria-hidden="true">03</span>
            <h3>Keep three to five destinations</h3>
            <p>Canonical BottomNav guidance keeps 3–5 items so every tap target stays wide.</p>
          </article>
        </div>
      ),
    },
    context: {
      header: 'In context',
      title: 'Move between top-level destinations',
      description:
        'A public BottomNav holds five BottomNavItems at the bottom of an app screen and keeps exactly one Active.',
      body: <AppScreenExample />,
    },
    'dos-donts': {
      header: 'Do & Don’ts',
      title: 'Protect the label',
      description:
        'The label carries the destination’s name for sight and speech, so shortening or removing it has a visible cost.',
      body: (
        <div className="comparison-stack">
          <div className="comparison-row">
            <Comparison
              kind="do"
              title="Use a short label"
              description="Invest sits on one line and matches the other items."
            >
              <NavBar items={SHORT_LABEL_ITEMS} value="home" className="is-compact" />
            </Comparison>
            <Comparison
              kind="dont"
              title="Write a long label"
              description="“Investments and savings” wraps onto extra lines and pushes that item out of line with the others."
            >
              <NavBar items={LONG_LABEL_ITEMS} value="home" className="is-compact" />
            </Comparison>
          </div>
          <div className="comparison-row">
            <Comparison
              kind="do"
              title="Keep every label"
              description="Each destination has a visible name, which is also its spoken name."
            >
              <NavBar items={SHORT_LABEL_ITEMS} value="finances" className="is-compact" />
            </Comparison>
            <Comparison
              kind="dont"
              title="Remove the labels"
              description="Icons alone must be guessed, and each tab loses its spoken name."
            >
              <NavBar items={ICON_ONLY_ITEMS} value="finances" className="is-compact" />
            </Comparison>
          </div>
        </div>
      ),
    },
    sources: {
      header: 'Sources',
      title: 'Public BottomNavItem, shown in its BottomNav composition',
      description:
        'The guide renders the public jfs-components BottomNavItem on its own and inside the public BottomNav.',
      body: (
        <SourceCards
          figmaUrl={FIGMA_URL}
          figmaDescription="BottomNavItem set, node 306:92 · State, icon, and label"
          storybookUrl={STORYBOOK_URL}
          storybookDescription="BottomNavItem docs and stories; BottomNav composition"
          stories={STORIES}
          checked="Checked 24 September 2026"
        >
          Declared, installed, and npm <code>latest</code> are all <code>jfs-components@0.1.60</code>. Figma’s State variant maps to the <code>BottomNavItem / State</code> mode in code; BottomNav sets it from <code>value</code>. The guide stays in Light mode, matching the Figma context, because the installed Dark tokens resolve the Idle label to orange. On the web, BottomNav ignores its accessibility label, and the Active tab is not exposed as selected.
        </SourceCards>
      ),
    },
  }

  return (
    <ComponentGuideTemplate
      metadata={{
        slug: 'bottomnavitem',
        name: 'Bottom Nav Item',
        summary: 'Show one top-level destination in the bottom navigation bar with an icon and a short label.',
        corePrinciple: 'One destination, one short label. Let BottomNav mark the Active item.',
        figmaUrl: FIGMA_URL,
        storybookUrl: STORYBOOK_URL,
      }}
      playground={
        <>
          <div className="preview-stage coin-bottomnav-preview-stage">
            <div className="coin-bottomnav-phone">
              <div className="coin-bottomnav-phone-screen" aria-live="polite">
                <span>Current screen</span>
                <strong>{current.label}</strong>
              </div>
              <NavBar
                items={items}
                value={activeValue}
                onChange={chooseActive}
                disabledValue={payUnavailable ? 'pay' : undefined}
                frameRef={frameRef}
                className="is-phone"
                interactive
              />
            </div>
            <span className="stage-label">Live Coin BottomNav with BottomNavItems</span>
          </div>
          <div className="controls-panel coin-bottomnav-controls">
            <Segment
              label="Active destination"
              value={activeValue}
              options={selectable.map((item) => item.value)}
              format={(value) => destination(value).label}
              onChange={chooseActive}
            />
            <Segment
              label="Destinations"
              value={count}
              options={['3', '4', '5'] as const}
              onChange={setCount}
            />
            <Toggle label="Pay unavailable" checked={payUnavailable} onChange={changePayUnavailable} />
            <Readout
              title="Rendered items"
              value={
                metrics
                  ? `${current.label} Active · ${items.length - 1} Idle`
                  : 'Measuring…'
              }
            >
              {metrics
                ? `Each item is ${formatPx(metrics.widths[0])} × ${metrics.height} px inside this bar. Press an item, or Tab to it and press Enter.`
                : null}
            </Readout>
          </div>
        </>
      }
      sections={sections}
    />
  )
}

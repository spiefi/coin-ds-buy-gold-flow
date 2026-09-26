import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react'
import { Button, ButtonGroup, Card, IconButton, type Modes } from 'jfs-components'
import {
  ComponentGuideTemplate,
  type GuideSectionSlots,
} from './ComponentGuideTemplate'
import {
  Anatomy,
  Readout,
  Segment,
  Sources,
  byTestId,
  classes,
} from './guide-kit'

const FIGMA_URL =
  'https://www.figma.com/design/3z7bmhA73Ls7j8Eu4qhYhE/Coin-Components-Library?node-id=2018-4119'
const STORYBOOK_URL =
  'https://jfs-components-storybook.vercel.app/?path=/docs/components-buttongroup--docs'
const STORIES = [
  { label: 'Default story', id: 'components-buttongroup--default' },
  { label: 'With icon and buttons', id: 'components-buttongroup--with-icon-and-buttons' },
  { label: 'With modes', id: 'components-buttongroup--with-modes' },
] as const

type GroupSize = 'M' | 'S' | 'XS'
type Emphasis = 'High' | 'Medium' | 'Low'
type Composition = 'icons' | 'mixed' | 'buttons'
type HostWidth = number | 'fill' | 'hug'
type HostChoice = '360 px' | '280 px' | 'Hug'

const COMPOSITIONS: readonly Composition[] = ['icons', 'mixed', 'buttons']
const COMPOSITION_LABELS: Record<Composition, string> = {
  icons: 'Icon actions',
  mixed: 'Icon + buttons',
  buttons: 'Buttons only',
}
const HOST_CHOICES: readonly HostChoice[] = ['360 px', '280 px', 'Hug']

const ICON_ACTIONS = [
  { iconName: 'ic_qr_code', label: 'Scan QR code', short: 'Scan' },
  { iconName: 'ic_photo', label: 'Add photo', short: 'Photo' },
  { iconName: 'ic_share', label: 'Share', short: 'Share' },
] as const

// The Figma master selects Button / Size M, Emphasis Medium, and
// AppearanceBrand Primary in Light mode. ButtonGroup cascades these modes to
// every child; a child's own modes win on conflict.
const REQUEST_MODES = { AppearanceBrand: 'Secondary' } as Modes
const PAY_MODES = { AppearanceBrand: 'Primary' } as Modes
const PAY_HIGH_MODES = { AppearanceBrand: 'Primary', Emphasis: 'High' } as Modes
const PAY_SMALL_MODES = { AppearanceBrand: 'Primary', 'Button / Size': 'S' } as Modes
const CARD_MODES = { 'Color Mode': 'Light' } as Modes

function groupModes(size: GroupSize, emphasis: Emphasis): Modes {
  return {
    'Color Mode': 'Light',
    'Button / Size': size,
    Emphasis: emphasis,
    AppearanceBrand: 'Primary',
  } as Modes
}

type ChildOptions = {
  composition: Composition
  emphasizePay?: boolean
  smallPay?: boolean
  unavailable?: 'request'
  onAction?: (label: string) => void
  /** Adds testIDs so documentation diagrams can find each child. */
  testIDPrefix?: string
}

function childNames(composition: Composition) {
  if (composition === 'icons') return ICON_ACTIONS.map((action) => action.short)
  return composition === 'mixed' ? ['Split', 'Request', 'Pay'] : ['Request', 'Pay']
}

// Children are returned as direct IconButton and Button elements. ButtonGroup
// keeps an IconButton at its intrinsic size by checking the element type, so a
// wrapper component would be stretched like a Button.
function groupChildren({
  composition,
  emphasizePay = false,
  smallPay = false,
  unavailable,
  onAction,
  testIDPrefix,
}: ChildOptions): ReactNode[] {
  const press = (label: string) => (onAction ? () => onAction(label) : undefined)
  const testID = (name: string) => (testIDPrefix ? `${testIDPrefix}-${name}` : undefined)

  if (composition === 'icons') {
    return ICON_ACTIONS.map((action) => (
      <IconButton
        key={action.iconName}
        iconName={action.iconName}
        accessibilityLabel={action.label}
        onPress={press(action.label)}
      />
    ))
  }

  const payModes = smallPay ? PAY_SMALL_MODES : emphasizePay ? PAY_HIGH_MODES : PAY_MODES
  const textActions = [
    <Button
      key="request"
      label="Request"
      modes={REQUEST_MODES}
      disabled={unavailable === 'request'}
      onPress={press('Request')}
      testID={testID('request')}
    />,
    <Button
      key="pay"
      label="Pay"
      modes={payModes}
      onPress={press('Pay')}
      testID={testID('pay')}
    />,
  ]

  if (composition === 'buttons') return textActions

  return [
    <IconButton
      key="split"
      iconName="ic_split"
      accessibilityLabel="Split bill"
      onPress={press('Split bill')}
      testID={testID('split')}
    />,
    ...textActions,
  ]
}

function GroupSpecimen({
  host = 'fill',
  size = 'M',
  emphasis = 'Medium',
  interactive = false,
  strict = false,
  hostRef,
  className,
  ...options
}: ChildOptions & {
  host?: HostWidth
  size?: GroupSize
  emphasis?: Emphasis
  interactive?: boolean
  strict?: boolean
  hostRef?: RefObject<HTMLDivElement | null>
  className?: string
}) {
  const modes = useMemo(() => groupModes(size, emphasis), [size, emphasis])
  return (
    <div
      ref={hostRef}
      className={classes(
        'coin-buttongroup-host',
        host === 'hug' && 'is-hug',
        typeof host === 'number' && 'is-fixed',
        strict && 'is-strict',
        className,
      )}
      style={typeof host === 'number' ? { width: host } : undefined}
      data-buttongroup-host=""
      inert={!interactive}
    >
      <ButtonGroup modes={modes}>{groupChildren(options)}</ButtonGroup>
    </div>
  )
}

type GroupMetrics = { host: number; height: number; children: number[] }

// Fixed-width specimens can be scaled down to fit a narrow screen, so every
// reading is converted back to layout pixels.
function renderedScale(host: HTMLElement) {
  const width = host.getBoundingClientRect().width
  return host.offsetWidth > 0 && width > 0 ? width / host.offsetWidth : 1
}

function readGroupMetrics(host: HTMLElement | null): GroupMetrics | null {
  const group = host?.firstElementChild
  if (!host || !group) return null
  const scale = renderedScale(host)
  const children = Array.from(group.children).map(
    (child) => Math.round((child.getBoundingClientRect().width / scale) * 10) / 10,
  )
  return {
    host: host.offsetWidth,
    height: Math.round(group.getBoundingClientRect().height / scale),
    children,
  }
}

// Scales a fixed-width specimen down when the screen is narrower than the
// specimen, keeping its real layout width. Documentation chrome only.
function FitWidth({
  width,
  showScale = false,
  onScaleChange,
  children,
}: {
  width: number
  showScale?: boolean
  onScaleChange?: (scale: number) => void
  children: ReactNode
}) {
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const [fit, setFit] = useState({ scale: 1, height: 0 })

  useLayoutEffect(() => {
    const outer = outerRef.current
    const inner = innerRef.current
    if (!outer || !inner) return
    const measure = () => {
      const available = outer.clientWidth - 16
      const scale = available > 0 ? Math.min(1, available / width) : 1
      const height = inner.offsetHeight * scale
      setFit((current) =>
        Math.abs(current.scale - scale) < 0.001 && Math.abs(current.height - height) < 0.5
          ? current
          : { scale, height },
      )
    }
    const observer =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure)
    observer?.observe(outer)
    observer?.observe(inner)
    measure()
    void document.fonts?.ready.then(measure)
    return () => observer?.disconnect()
  }, [width])

  const scaled = fit.scale < 0.999
  useLayoutEffect(() => {
    onScaleChange?.(fit.scale)
  }, [fit.scale, onScaleChange])

  return (
    <div className="coin-buttongroup-fit">
      <div
        ref={outerRef}
        className="coin-buttongroup-fit-frame"
        style={scaled ? { height: fit.height } : undefined}
      >
        <div
          ref={innerRef}
          className="coin-buttongroup-fit-inner"
          style={{ width, transform: scaled ? `scale(${fit.scale})` : undefined }}
        >
          {children}
        </div>
      </div>
      {showScale && scaled ? (
        <span className="coin-buttongroup-fit-note">
          Shown at {Math.round(fit.scale * 100)}% to fit this screen
        </span>
      ) : null}
    </div>
  )
}

function useGroupMetrics(hostRef: RefObject<HTMLDivElement | null>, key: string) {
  const [metrics, setMetrics] = useState<GroupMetrics | null>(null)

  useLayoutEffect(() => {
    const host = hostRef.current
    if (!host) return
    let active = true
    const measure = () => {
      if (!active) return
      const next = readGroupMetrics(host)
      if (!next) return
      setMetrics((current) =>
        current && JSON.stringify(current) === JSON.stringify(next) ? current : next,
      )
    }
    const observer =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure)
    observer?.observe(host)
    Array.from(host.firstElementChild?.children ?? []).forEach((child) => observer?.observe(child))
    const frameId = requestAnimationFrame(measure)
    void document.fonts?.ready.then(measure)
    window.addEventListener('resize', measure)
    return () => {
      active = false
      cancelAnimationFrame(frameId)
      observer?.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [hostRef, key])

  return metrics
}

function formatWidth(value: number) {
  return Number.isInteger(value) ? `${value}` : value.toFixed(1)
}

function MeasuredGroup({
  caption,
  ...props
}: Parameters<typeof GroupSpecimen>[0] & { caption?: string }) {
  const hostRef = useRef<HTMLDivElement>(null)
  const key = [
    props.composition,
    props.host,
    props.size,
    props.emphasis,
    props.smallPay,
    props.emphasizePay,
  ].join('|')
  const metrics = useGroupMetrics(hostRef, key)
  const names = childNames(props.composition)

  const specimen = <GroupSpecimen {...props} hostRef={hostRef} />
  return (
    <div className="coin-buttongroup-measured">
      {props.strict && typeof props.host === 'number' ? (
        <FitWidth width={props.host} showScale>
          {specimen}
        </FitWidth>
      ) : (
        specimen
      )}
      <p className="coin-buttongroup-widths">
        {caption ? <b>{caption}</b> : null}
        {metrics ? (
          <span>
            Host <strong>{metrics.host}</strong>
          </span>
        ) : null}
        {metrics
          ? names.map((name, index) => (
              <span key={name}>
                {name} <strong>{formatWidth(metrics.children[index] ?? 0)}</strong>
              </span>
            ))
          : 'Measuring…'}
      </p>
    </div>
  )
}

// A real fixed-width host, scaled down only when the screen is narrower.
function FixedGroup(props: Parameters<typeof GroupSpecimen>[0] & { host: number }) {
  return (
    <FitWidth width={props.host} showScale>
      <GroupSpecimen {...props} strict />
    </FitWidth>
  )
}

function HostRow({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <div className="coin-buttongroup-row">
      <div className="coin-buttongroup-row-copy">
        <p className="coin-guide-card-eyebrow">{eyebrow}</p>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <div className="coin-buttongroup-row-stage">{children}</div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Anatomy
// ---------------------------------------------------------------------------

const ANATOMY_MODES = groupModes('M', 'Medium')
const ANATOMY_ID = 'buttongroup-anatomy'
// ButtonGroup exposes no testID, so its root is the specimen's only child.
const ANATOMY_ROW = ':scope > div'
const ANATOMY_ICON = byTestId(`${ANATOMY_ID}-split`)
const ANATOMY_REQUEST = byTestId(`${ANATOMY_ID}-request`)
const ANATOMY_PAY = byTestId(`${ANATOMY_ID}-pay`)

function ButtonGroupAnatomy() {
  return (
    <Anatomy
      title="Button Group"
      specimenWidth={320}
      scale={1}
      parts={[
        { name: 'Row', note: 'Fills the width its host provides, centers children vertically, and adds no padding or background.', target: ANATOMY_ROW, side: 'left' },
        { name: 'Icon action', note: 'A direct IconButton child keeps its own circular size instead of stretching.', target: ANATOMY_ICON, side: 'top' },
        { name: 'Gap', note: 'One token gap, buttonGroup/gap, separates every pair of neighbors.', between: [ANATOMY_ICON, ANATOMY_REQUEST], side: 'top' },
        { name: 'Text actions', note: 'Every Button child stretches, so the Buttons share the remaining width equally.', target: ANATOMY_REQUEST, side: 'top' },
      ]}
      marks={[
        { kind: 'outline', target: ANATOMY_ROW, variant: 'bounds' },
        { kind: 'outline', target: ANATOMY_ICON, variant: 'child' },
        { kind: 'outline', target: ANATOMY_REQUEST, variant: 'child' },
        { kind: 'outline', target: ANATOMY_PAY, variant: 'child' },
        { kind: 'gap', from: ANATOMY_ICON, to: ANATOMY_REQUEST },
        { kind: 'gap', from: ANATOMY_REQUEST, to: ANATOMY_PAY },
        { kind: 'size', target: ANATOMY_ICON, side: 'bottom' },
        { kind: 'size', target: ANATOMY_REQUEST, side: 'bottom' },
        { kind: 'size', target: ANATOMY_PAY, side: 'bottom' },
      ]}
    >
      <ButtonGroup modes={ANATOMY_MODES}>
        {groupChildren({ composition: 'mixed', testIDPrefix: ANATOMY_ID })}
      </ButtonGroup>
    </Anatomy>
  )
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

function SharedBillExample() {
  const [announcement, setAnnouncement] = useState('Choose how to settle the bill.')
  const modes = useMemo(() => groupModes('M', 'Medium'), [])
  const onAction = useCallback((label: string) => {
    setAnnouncement(`${label} selected.`)
  }, [])

  return (
    <div className="coin-buttongroup-context">
      <div className="coin-buttongroup-context-card">
        <FitWidth width={360} showScale>
          <Card variant="slim" modes={CARD_MODES}>
            <Card.Title>Team lunch</Card.Title>
            <Card.SupportText>₹2,400 · 4 people · your share ₹600</Card.SupportText>
            <ButtonGroup modes={modes}>
              {groupChildren({ composition: 'mixed', emphasizePay: true, onAction })}
            </ButtonGroup>
          </Card>
        </FitWidth>
      </div>
      <p className="coin-buttongroup-context-note" aria-live="polite">{announcement}</p>
    </div>
  )
}

function Specimen({
  title,
  children,
  description,
  eyebrow,
}: {
  title: string
  description: ReactNode
  eyebrow?: string
  children: ReactNode
}) {
  return (
    <article className="coin-guide-card">
      {eyebrow ? <p className="coin-guide-card-eyebrow">{eyebrow}</p> : null}
      <div className="coin-guide-card-stage coin-buttongroup-card-stage">{children}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
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
      <div className="comparison-preview coin-buttongroup-comparison-preview">{children}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  )
}

// ---------------------------------------------------------------------------
// Guide
// ---------------------------------------------------------------------------

function hostFromChoice(choice: HostChoice): HostWidth {
  if (choice === 'Hug') return 'hug'
  return choice === '360 px' ? 360 : 280
}

export function ButtonGroupGuide() {
  const [composition, setComposition] = useState<Composition>('mixed')
  const [size, setSize] = useState<GroupSize>('M')
  const [emphasis, setEmphasis] = useState<Emphasis>('Medium')
  const [hostChoice, setHostChoice] = useState<HostChoice>('360 px')
  const [announcement, setAnnouncement] = useState('Press an action in the live group.')
  const hostRef = useRef<HTMLDivElement>(null)
  const host = hostFromChoice(hostChoice)
  const metrics = useGroupMetrics(
    hostRef,
    [composition, size, emphasis, hostChoice].join('|'),
  )
  const names = childNames(composition)
  const onAction = useCallback((label: string) => {
    setAnnouncement(`${label} pressed.`)
  }, [])

  const sections: GuideSectionSlots = {
    anatomy: {
      header: 'Anatomy',
      title: 'A row that spaces and sizes its children',
      description:
        'ButtonGroup has no surface of its own. It places its children in one row, separates them with a token gap, and decides which children stretch.',
      body: (
        <ButtonGroupAnatomy />
      ),
    },
    configuration: {
      header: 'Configuration',
      title: 'Choose the children; the group lays them out',
      description:
        'ButtonGroup exposes no layout options. The children you place and the modes you set on the group decide what people see.',
      body: (
        <div className="coin-guide-stack">
          <div className="coin-buttongroup-rows">
            <HostRow
              eyebrow="Children"
              title="Icon actions"
              description="Each IconButton keeps its size. The row starts at the leading edge and leaves the rest of the host empty."
            >
              <MeasuredGroup composition="icons" host={360} strict />
            </HostRow>
            <HostRow
              eyebrow="Children"
              title="Icon + buttons"
              description="The icon keeps its size and the two Buttons split what remains."
            >
              <MeasuredGroup composition="mixed" host={360} strict />
            </HostRow>
            <HostRow
              eyebrow="Children"
              title="Buttons only"
              description="Both Buttons stretch to equal halves of the row."
            >
              <MeasuredGroup composition="buttons" host={360} strict />
            </HostRow>
          </div>
          <div className="coin-guide-card-grid">
            <Specimen
              eyebrow="Group modes"
              title="Button / Size M · Emphasis Medium"
              description="The modes selected on the Figma master. Every child inherits them from the group."
            >
              <MeasuredGroup composition="mixed" size="M" emphasis="Medium" host={300} strict />
            </Specimen>
            <Specimen
              eyebrow="Group modes"
              title="Button / Size S · Emphasis High"
              description="Changing the group modes changes every child together: smaller controls and stronger fills."
            >
              <MeasuredGroup composition="mixed" size="S" emphasis="High" host={300} strict />
            </Specimen>
          </div>
        </div>
      ),
    },
    states: {
      header: 'States',
      title: 'State belongs to each child',
      description:
        'ButtonGroup has no enabled, disabled, or selected state of its own. Each child keeps its own disabled, hover, and pressed feedback.',
      body: (
        <div className="coin-guide-card-grid">
          <Specimen
            eyebrow="Default"
            title="All actions available"
            description="Every child resolves the group’s modes and responds on its own."
          >
            <FixedGroup composition="mixed" host={300} />
          </Specimen>
          <Specimen
            eyebrow="Child state"
            title="Request unavailable"
            description="The disabled Button fades to half opacity and ignores presses. It keeps its share of the row, so the layout does not shift."
          >
            <FixedGroup composition="mixed" host={300} unavailable="request" />
          </Specimen>
        </div>
      ),
    },
    sizing: {
      header: 'Sizing',
      title: 'The host sets the width',
      description:
        'ButtonGroup fills the width it receives. IconButtons keep their size and Buttons divide the rest, so a narrow host can shorten labels.',
      body: (
        <div className="coin-buttongroup-rows">
          <HostRow
            eyebrow="360 px host · Size M"
            title="Labels fit"
            description="Each Button has room for its full label."
          >
            <MeasuredGroup composition="mixed" host={360} strict />
          </HostRow>
          <HostRow
            eyebrow="248 px host · Size M"
            title="Request is cut short"
            description="The equal share is narrower than “Request”, so the label ends in an ellipsis."
          >
            <MeasuredGroup composition="mixed" host={248} strict />
          </HostRow>
          <HostRow
            eyebrow="248 px host · Size S"
            title="A smaller size fits"
            description="Button / Size S on the group shrinks every child, so the labels fit again."
          >
            <MeasuredGroup composition="mixed" host={248} size="S" strict />
          </HostRow>
        </div>
      ),
    },
    content: {
      header: 'Content',
      title: 'Short, related actions in a clear order',
      description:
        'Keep a group to a few actions that belong together. End with the action people are most likely to choose.',
      body: (
        <div className="content-guidance-grid">
          <article className="content-rule content-rule-featured">
            <span aria-hidden="true">01</span>
            <h3>End with the primary action</h3>
            <p>Supporting actions come first. Only Pay sets a stronger Emphasis mode, so it stands out.</p>
            <div className="rule-example coin-buttongroup-rule-example">
              <FixedGroup composition="mixed" host={300} emphasizePay />
            </div>
          </article>
          <article className="content-rule">
            <span aria-hidden="true">02</span>
            <h3>Name every icon action</h3>
            <p>
              An IconButton without a label is announced by its icon name, such as “Qr Code”. Specify a task-based label, such as “Scan QR code”, for each icon action.
            </p>
          </article>
          <article className="content-rule">
            <span aria-hidden="true">03</span>
            <h3>Use one or two words</h3>
            <p>Button labels stay on one line. When the share is too narrow, the end of the label is cut off with an ellipsis.</p>
          </article>
        </div>
      ),
    },
    context: {
      header: 'In context',
      title: 'Settle a shared bill',
      description:
        'A Coin Card holds the context. The ButtonGroup keeps split, request, and pay together, with Pay emphasized.',
      body: <SharedBillExample />,
    },
    'dos-donts': {
      header: 'Do & Don’ts',
      title: 'Keep the row readable',
      description:
        'Most problems come from missing width or conflicting modes on individual children.',
      body: (
        <div className="comparison-stack">
          <div className="comparison-row">
            <Comparison
              kind="do"
              title="Give the group a width"
              description="In a 300 px host, both Buttons have room for their labels."
            >
              <FixedGroup composition="mixed" host={300} />
            </Comparison>
            <Comparison
              kind="dont"
              title="Let the group shrink to its content"
              description="Without a host width, the Buttons divide the smallest possible row and “Request” is cut short."
            >
              <GroupSpecimen composition="mixed" host="hug" />
            </Comparison>
          </div>
          <div className="comparison-row">
            <Comparison
              kind="do"
              title="Set the size once on the group"
              description="Every child inherits Button / Size M, so the row keeps one height."
            >
              <FixedGroup composition="buttons" host={260} />
            </Comparison>
            <Comparison
              kind="dont"
              title="Override one child’s size"
              description="Pay’s own Button / Size S wins over the group mode and leaves one short, mismatched action."
            >
              <FixedGroup composition="buttons" host={260} smallPay />
            </Comparison>
          </div>
          <div className="comparison-row">
            <Comparison
              kind="do"
              title="Emphasize one action"
              description="Only Pay sets Emphasis High, so the next step is obvious."
            >
              <FixedGroup composition="mixed" host={300} emphasizePay />
            </Comparison>
            <Comparison
              kind="dont"
              title="Emphasize every action"
              description="With Emphasis High on the group, all three actions compete for attention."
            >
              <FixedGroup composition="mixed" host={300} emphasis="High" />
            </Comparison>
          </div>
        </div>
      ),
    },
    sources: {
      header: 'Sources',
      title: 'Public ButtonGroup, verified behavior',
      description:
        'The guide renders the public jfs-components ButtonGroup with public IconButton and Button children.',
      body: (
        <Sources
          figmaUrl={FIGMA_URL}
          figmaDescription="Button group master, node 2018:4119 · no exposed properties"
          storybookUrl={STORYBOOK_URL}
          storybookDescription="ButtonGroup docs, default, mixed-children, and modes stories"
          stories={STORIES}
          checked="24 September 2026"
        >
          Declared, installed, and npm <code>latest</code> are all <code>jfs-components@0.1.60</code>. The Figma master is a 150 × 42 row of three icon actions with Button / Size M, Emphasis Medium, and AppearanceBrand Primary. The package renders each IconButton at 40 px, so the same row measures 144 × 40. In Storybook, the default story’s third icon (<code>ic_menu</code>) is missing from the icon registry, and the modes story passes a token name that ButtonGroup does not read.
        </Sources>
      ),
    },
  }

  return (
    <ComponentGuideTemplate
      metadata={{
        slug: 'buttongroup',
        name: 'Button Group',
        summary: 'Keep a few related actions in one row with shared spacing and modes.',
        corePrinciple: 'Give the group its width and modes; let only the key action stand out.',
        figmaUrl: FIGMA_URL,
        storybookUrl: STORYBOOK_URL,
      }}
      playground={
        <>
          <div className="preview-stage coin-buttongroup-preview-stage">
            <div className="coin-buttongroup-preview-content">
              {typeof host === 'number' ? (
                <FitWidth width={host} showScale>
                  <GroupSpecimen
                    composition={composition}
                    size={size}
                    emphasis={emphasis}
                    host={host}
                    strict
                    hostRef={hostRef}
                    interactive
                    onAction={onAction}
                  />
                </FitWidth>
              ) : (
                <GroupSpecimen
                  composition={composition}
                  size={size}
                  emphasis={emphasis}
                  host={host}
                  hostRef={hostRef}
                  interactive
                  onAction={onAction}
                />
              )}
              <p className="preview-note" aria-live="polite">{announcement}</p>
            </div>
            <span className="stage-label">Live Coin ButtonGroup</span>
          </div>
          <div className="controls-panel coin-buttongroup-controls">
            <Segment
              label="Children"
              value={composition}
              options={COMPOSITIONS}
              format={(value) => COMPOSITION_LABELS[value]}
              onChange={setComposition}
            />
            <Segment
              label="Button / Size mode"
              value={size}
              options={['M', 'S', 'XS'] as const}
              onChange={setSize}
            />
            <Segment
              label="Emphasis mode"
              value={emphasis}
              options={['High', 'Medium', 'Low'] as const}
              onChange={setEmphasis}
            />
            <Segment
              label="Host width"
              value={hostChoice}
              options={HOST_CHOICES}
              onChange={setHostChoice}
            />
            <Readout
              title="Measured child widths"
              value={
                metrics
                  ? names
                      .map((name, index) => `${name} ${formatWidth(metrics.children[index] ?? 0)}`)
                      .join(' · ')
                  : 'Measuring…'
              }
            >
              {metrics
                ? `Row ${metrics.host} × ${metrics.height} px. IconButtons keep their size; Buttons share the rest.`
                : null}
            </Readout>
          </div>
        </>
      }
      sections={sections}
    />
  )
}

import {
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import {
  Accordion,
  Button,
  IconCapsule,
  ListItem,
  MoneyValue,
  Text,
  type Modes,
} from 'jfs-components'
import {
  ComponentGuideTemplate,
  type GuideSectionSlots,
} from './ComponentGuideTemplate'

const FIGMA_URL =
  'https://www.figma.com/design/3z7bmhA73Ls7j8Eu4qhYhE/Coin-Components-Library?node-id=1291-4846'
const STORYBOOK_URL =
  'https://jfs-components-storybook.vercel.app/?path=/docs/components-accordion--docs'
const STORYBOOK_DEFAULT_URL =
  'https://jfs-components-storybook.vercel.app/iframe.html?id=components-accordion--default&viewMode=story'
const STORYBOOK_CONTAINED_URL =
  'https://jfs-components-storybook.vercel.app/iframe.html?id=components-accordion--contained&viewMode=story'
const STORYBOOK_EXPANDED_URL =
  'https://jfs-components-storybook.vercel.app/iframe.html?id=components-accordion--expanded&viewMode=story'
const STORYBOOK_DISABLED_URL =
  'https://jfs-components-storybook.vercel.app/iframe.html?id=components-accordion--disabled&viewMode=story'
const STORYBOOK_LIST_URL =
  'https://jfs-components-storybook.vercel.app/iframe.html?id=components-accordion--with-list-items&viewMode=story'
const STORYBOOK_GROUP_URL =
  'https://jfs-components-storybook.vercel.app/iframe.html?id=components-accordion--accordion-group&viewMode=story'

type ColorMode = 'Light' | 'Dark'

function classes(...values: Array<string | false | undefined>) {
  return values.filter(Boolean).join(' ')
}

function accordionModes(colorMode: ColorMode): Modes {
  return {
    'Color Mode': colorMode,
    AppearanceBrand: 'Primary',
  } as Modes
}

function primaryButtonModes(colorMode: ColorMode = 'Light'): Modes {
  return {
    'Button / Size': 'M',
    'Button / State': 'Idle',
    'Color Mode': colorMode,
    Context4: 'Button',
    Emphasis: 'High',
    AppearanceBrand: 'Primary',
    'Semantic Intent': 'Brand',
  } as Modes
}

function SmallArrow() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" />
    </svg>
  )
}

function SourceLink({ href, children }: { href: string; children: string }) {
  return (
    <a className="source-link" href={href} target="_blank" rel="noreferrer">
      <span>{children}</span>
      <SmallArrow />
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

function AccordionExample({
  title = 'Accordion title',
  contained = false,
  expanded,
  defaultExpanded = false,
  disabled = false,
  colorMode = 'Light',
  onExpandedChange,
  children,
  disableTruncation = false,
  className,
}: {
  title?: string
  contained?: boolean
  expanded?: boolean
  defaultExpanded?: boolean
  disabled?: boolean
  colorMode?: ColorMode
  onExpandedChange?: (expanded: boolean) => void
  children?: ReactNode
  disableTruncation?: boolean
  className?: string
}) {
  const modes = useMemo(() => accordionModes(colorMode), [colorMode])
  const props = expanded === undefined ? { defaultExpanded } : { expanded }

  return (
    <div
      className={classes('coin-accordion-example', className)}
      data-coin-example="accordion"
    >
      <Accordion
        title={title}
        contained={contained}
        {...props}
        disabled={disabled}
        onExpandedChange={onExpandedChange}
        modes={modes}
        disableTruncation={disableTruncation}
        accessibilityLabel={title}
        style={{ width: '100%' }}
      >
        {children ?? (
          <Text
            text="Supporting details appear here when people need them."
            modes={modes}
          />
        )}
      </Accordion>
    </div>
  )
}

function AccordionText({ text, modes }: { text: string; modes: Modes }) {
  return <Text text={text} modes={modes} />
}

type AnatomyRect = { left: number; top: number; width: number; height: number }
type AnatomyMark = {
  number: number
  target: AnatomyRect
  marker: { left: number; top: number }
}
type AnatomyMetrics = { width: number; height: number; marks: AnatomyMark[] }

const ANATOMY_MARKER_SIZE = 24

function rectRelativeTo(node: Element, frameRect: DOMRect): AnatomyRect {
  const rect = node.getBoundingClientRect()
  return {
    left: rect.left - frameRect.left,
    top: rect.top - frameRect.top,
    width: rect.width,
    height: rect.height,
  }
}

function findExactText(root: Element, text: string) {
  return Array.from(root.querySelectorAll<HTMLElement>('*'))
    .filter((node) => node.textContent?.trim() === text)
    .sort((first, second) => {
      const firstRect = first.getBoundingClientRect()
      const secondRect = second.getBoundingClientRect()
      return firstRect.width * firstRect.height - secondRect.width * secondRect.height
    })[0]
}

function AccordionAnatomy() {
  const modes = useMemo(() => accordionModes('Light'), [])
  const frameRef = useRef<HTMLDivElement>(null)
  const [metrics, setMetrics] = useState<AnatomyMetrics | null>(null)

  useLayoutEffect(() => {
    const frame = frameRef.current
    if (!frame) return

    let active = true

    const measure = () => {
      if (!active) return
      const frameRect = frame.getBoundingClientRect()
      const component = frame.querySelector<HTMLElement>(
        '.coin-accordion-anatomy-component .coin-accordion-example > *',
      )
      const header = component?.querySelector<HTMLElement>('[role="button"]')
      const title = component ? findExactText(component, 'Payment methods') : undefined
      const icons = header ? Array.from(header.querySelectorAll('svg')) : []
      const icon = icons[icons.length - 1]
      const directChildren = component ? Array.from(component.children) : []
      const headerChild = header
        ? directChildren.find((child) => child === header || child.contains(header))
        : undefined
      const headerIndex = headerChild ? directChildren.indexOf(headerChild) : -1
      const content =
        headerIndex >= 0
          ? directChildren.slice(headerIndex + 1).find((child) => {
              const rect = child.getBoundingClientRect()
              return rect.width > 0 && rect.height > 0
            })
          : undefined

      if (!component || !header || !title || !icon || !content) return

      const componentRect = rectRelativeTo(component, frameRect)
      const targets = [
        rectRelativeTo(header, frameRect),
        rectRelativeTo(title, frameRect),
        rectRelativeTo(icon, frameRect),
        rectRelativeTo(content, frameRect),
        {
          left: componentRect.left,
          top: componentRect.top + Math.max(0, componentRect.height - 1),
          width: componentRect.width,
          height: 1,
        },
      ]
      const safeInset = 10
      const clamp = (value: number, max: number) =>
        Math.min(
          Math.max(value, safeInset),
          Math.max(safeInset, max - ANATOMY_MARKER_SIZE - safeInset),
        )
      const desiredMarkers = [
        {
          left: targets[0].left - ANATOMY_MARKER_SIZE - 18,
          top: targets[0].top + targets[0].height / 2 - ANATOMY_MARKER_SIZE / 2,
        },
        {
          left: targets[1].left + targets[1].width / 2 - ANATOMY_MARKER_SIZE / 2,
          top: targets[1].top - ANATOMY_MARKER_SIZE - 18,
        },
        {
          left: targets[2].left + targets[2].width + 18,
          top: targets[2].top + targets[2].height / 2 - ANATOMY_MARKER_SIZE / 2,
        },
        {
          left: targets[3].left + targets[3].width + 18,
          top: targets[3].top + targets[3].height / 2 - ANATOMY_MARKER_SIZE / 2,
        },
        {
          left: targets[4].left - ANATOMY_MARKER_SIZE - 18,
          top: targets[4].top + targets[4].height / 2 - ANATOMY_MARKER_SIZE / 2,
        },
      ]
      const nextMetrics: AnatomyMetrics = {
        width: frameRect.width,
        height: frameRect.height,
        marks: targets.map((target, index) => ({
          number: index + 1,
          target,
          marker: {
            left: clamp(desiredMarkers[index].left, frameRect.width),
            top: clamp(desiredMarkers[index].top, frameRect.height),
          },
        })),
      }
      setMetrics((previous) => {
        if (!previous) return nextMetrics
        const closeEnough = (first: number, second: number) => Math.abs(first - second) < 0.25
        const same =
          closeEnough(previous.width, nextMetrics.width) &&
          closeEnough(previous.height, nextMetrics.height) &&
          previous.marks.length === nextMetrics.marks.length &&
          previous.marks.every((mark, index) => {
            const next = nextMetrics.marks[index]
            return (
              closeEnough(mark.target.left, next.target.left) &&
              closeEnough(mark.target.top, next.target.top) &&
              closeEnough(mark.target.width, next.target.width) &&
              closeEnough(mark.target.height, next.target.height) &&
              closeEnough(mark.marker.left, next.marker.left) &&
              closeEnough(mark.marker.top, next.marker.top)
            )
          })
        return same ? previous : nextMetrics
      })
    }

    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure)
    observer?.observe(frame)
    const animationFrame = requestAnimationFrame(() => {
      measure()
      const component = frame.querySelector<HTMLElement>(
        '.coin-accordion-anatomy-component .coin-accordion-example > *',
      )
      const header = component?.querySelector<HTMLElement>('[role="button"]')
      const title = component ? findExactText(component, 'Payment methods') : undefined
      const icons = header ? Array.from(header.querySelectorAll('svg')) : []
      const icon = icons[icons.length - 1]
      const directChildren = component ? Array.from(component.children) : []
      const headerChild = header
        ? directChildren.find((child) => child === header || child.contains(header))
        : undefined
      const headerIndex = headerChild ? directChildren.indexOf(headerChild) : -1
      const content =
        headerIndex >= 0
          ? directChildren.slice(headerIndex + 1).find((child) => {
              const rect = child.getBoundingClientRect()
              return rect.width > 0 && rect.height > 0
            })
          : undefined
      ;[component, header, title, icon, content].forEach((node) => {
        if (node) observer?.observe(node)
      })
    })
    void document.fonts?.ready.then(measure)
    window.addEventListener('resize', measure)
    return () => {
      active = false
      cancelAnimationFrame(animationFrame)
      observer?.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  return (
    <div ref={frameRef} className="coin-accordion-anatomy-live">
      <div className="coin-accordion-anatomy-component">
        <AccordionExample title="Payment methods" defaultExpanded>
          <AccordionText
            text="Review the payment methods available for this account."
            modes={modes}
          />
        </AccordionExample>
      </div>
      {metrics ? (
        <>
          <svg
            className="coin-accordion-anatomy-leaders"
            viewBox={`0 0 ${metrics.width} ${metrics.height}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {metrics.marks.map((mark) => (
              <line
                key={mark.number}
                x1={mark.marker.left + ANATOMY_MARKER_SIZE / 2}
                y1={mark.marker.top + ANATOMY_MARKER_SIZE / 2}
                x2={mark.target.left + mark.target.width / 2}
                y2={mark.target.top + mark.target.height / 2}
              />
            ))}
          </svg>
          {metrics.marks.map((mark) => (
            <span
              className="coin-accordion-anatomy-pin"
              style={{ left: mark.marker.left, top: mark.marker.top }}
              key={mark.number}
              aria-hidden="true"
            >
              {mark.number}
            </span>
          ))}
        </>
      ) : null}
    </div>
  )
}

function AccordionStateCard({
  label,
  detail,
  defaultExpanded,
  disabled,
  hover,
}: {
  label: string
  detail: string
  defaultExpanded?: boolean
  disabled?: boolean
  hover?: boolean
}) {
  return (
    <article className="state-card coin-accordion-state-card">
      <div className="state-preview coin-accordion-state-preview">
        <AccordionExample
          title={hover ? 'Move pointer over this row' : 'Payment methods'}
          defaultExpanded={defaultExpanded}
          disabled={disabled}
          className="coin-accordion-state-example"
        />
      </div>
      <h3>{label}</h3>
      <p>{detail}</p>
    </article>
  )
}

type AccountRow = {
  title: string
  supportText: string
}

function AccountRows({ modes, rows }: { modes: Modes; rows: readonly AccountRow[] }) {
  return rows.map((row) => (
    <ListItem
      key={`${row.title}-${row.supportText}`}
      layout="Horizontal"
      title={row.title}
      supportText={row.supportText}
      leading={<IconCapsule iconName="ic_card" modes={modes} />}
      trailing={<MoneyValue value="500" currency="₹" modes={modes} />}
      navArrow
      modes={modes}
      accessibilityLabel={`${row.title}, ${row.supportText}`}
      style={{ width: '100%' }}
    />
  ))
}

function ContextExample() {
  const modes = useMemo(() => accordionModes('Light'), [])
  const [paymentsExpanded, setPaymentsExpanded] = useState(true)
  const [banksExpanded, setBanksExpanded] = useState(false)

  return (
    <div className="coin-accordion-context-screen">
      <div className="coin-accordion-context-stack">
        <AccordionExample
          title="Payment Methods"
          expanded={paymentsExpanded}
          onExpandedChange={setPaymentsExpanded}
          colorMode="Light"
        >
          <AccountRows
            modes={modes}
            rows={[
              { title: 'Credit Card', supportText: 'Ending 4242' },
              { title: 'Debit Card', supportText: 'Ending 1234' },
            ]}
          />
        </AccordionExample>
        <AccordionExample
          title="Bank Accounts"
          expanded={banksExpanded}
          onExpandedChange={setBanksExpanded}
          colorMode="Light"
        >
          <AccountRows
            modes={modes}
            rows={[{ title: 'Savings Account', supportText: 'HDFC Bank' }]}
          />
        </AccordionExample>
      </div>
      <p className="coin-accordion-context-status" aria-live="polite">
        Payment Methods: <strong>{paymentsExpanded ? 'open' : 'closed'}</strong> · Bank Accounts:{' '}
        <strong>{banksExpanded ? 'open' : 'closed'}</strong>
      </p>
    </div>
  )
}

export function AccordionGuide() {
  const [colorMode, setColorMode] = useState<ColorMode>('Light')
  const [title, setTitle] = useState('Payment methods')
  const [expanded, setExpanded] = useState(false)
  const [contained, setContained] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [lastAction, setLastAction] = useState('No interaction yet')

  const modes = useMemo(() => accordionModes(colorMode), [colorMode])
  const lightModes = useMemo(() => accordionModes('Light'), [])

  const sections: GuideSectionSlots = {
    anatomy: {
      header: 'Anatomy',
      title: 'A heading opens onto supporting content',
      description:
        'The header makes a clear promise, the indicator shows whether it is open, and the content slot reveals supporting detail when people ask for it.',
      body: (
        <div className="anatomy-card coin-accordion-anatomy-card">
          <div className="anatomy-stage coin-accordion-anatomy-stage">
            <AccordionAnatomy />
          </div>
          <ol className="anatomy-list coin-accordion-anatomy-list">
            <li>
              <b>Header</b>
              <span>The title is the promise people use to decide whether to open the section.</span>
            </li>
            <li>
              <b>Label</b>
              <span>Keep the header short enough to remain scannable in a narrow host.</span>
            </li>
            <li>
              <b>Indicator</b>
              <span>The public component switches between add and minus icons as it opens and closes.</span>
            </li>
            <li>
              <b>Divider</b>
              <span>The component’s bottom border separates the open section from the following content.</span>
            </li>
            <li>
              <b>Content slot</b>
              <span>Put supporting details or related public rows here; keep primary actions visible in the page flow.</span>
            </li>
          </ol>
        </div>
      ),
    },
    configuration: {
      header: 'Configuration',
      title: 'Choose the surface treatment deliberately',
      description:
        'The default treatment is quiet until interaction. Contained keeps the filled header treatment visible so a grouped section can stand apart from its host.',
      body: (
        <div className="coin-accordion-configuration-grid">
          <article className="configuration-block coin-accordion-config-card">
            <p className="eyebrow">Default</p>
            <h3>Let the page carry the surface</h3>
            <div className="coin-accordion-config-preview">
              <AccordionExample title="Payment methods" />
            </div>
            <p>Use the default when the heading can sit comfortably in the surrounding page structure.</p>
          </article>
          <article className="configuration-block coin-accordion-config-card">
            <p className="eyebrow">Contained</p>
            <h3>Keep the group visually together</h3>
            <div className="coin-accordion-config-preview">
              <AccordionExample title="Payment methods" contained />
            </div>
            <p>Use contained when the filled header should keep related supporting content together.</p>
          </article>
        </div>
      ),
    },
    states: {
      header: 'States',
      title: 'Let interaction supply the state',
      description:
        'Expanded, disabled, and hover feedback come from the public component as people interact. Configure the values that describe the product situation and let the runtime derive the visual state.',
      body: (
        <>
          <p className="coin-accordion-static-note">State references · move the pointer over the live hover example.</p>
          <div className="coin-accordion-state-grid">
            <AccordionStateCard
              label="Collapsed"
              detail="The heading is visible while supporting content stays out of the initial scan."
            />
            <AccordionStateCard
              label="Open"
              detail="The content slot is visible after the person asks for more detail."
              defaultExpanded
            />
            <AccordionStateCard
              label="Disabled"
              detail="The section is unavailable until the product condition changes."
              disabled
            />
            <AccordionStateCard
              label="Hover feedback"
              detail="Move the pointer over this public row to observe the package hover treatment."
              hover
            />
          </div>
          <div className="guidance-note coin-accordion-guidance-note">
            <strong>The header responds to interaction.</strong>
            <p>Choose the expanded or disabled condition that reflects the product situation and let the header communicate the result.</p>
          </div>
        </>
      ),
    },
    sizing: {
      header: 'Sizing',
      title: 'Give the host room to tell the story',
      description:
        'The Figma reference is 445px wide. In a product layout, the host supplies width and the component grows with its title and open content.',
      body: (
        <div className="coin-accordion-sizing-grid">
          <article className="coin-accordion-sizing-card">
            <div className="coin-accordion-sizing-host coin-accordion-host-roomy">
              <AccordionExample title="Payment methods" defaultExpanded />
            </div>
            <div className="coin-accordion-sizing-meta">
              <strong>Roomy host</strong>
              <span>Keep the title and content on one clear line when the host has space.</span>
            </div>
          </article>
          <article className="coin-accordion-sizing-card">
            <div className="coin-accordion-sizing-host coin-accordion-host-narrow">
              <AccordionExample
                title="Linked savings accounts and payment sources"
                defaultExpanded
                disableTruncation
              />
            </div>
            <div className="coin-accordion-sizing-meta">
              <strong>Narrow host</strong>
              <span>Allow a long title to wrap when the group name needs more than one line.</span>
            </div>
          </article>
        </div>
      ),
    },
    content: {
      header: 'Content',
      title: 'Use the slot for supporting detail',
      description:
        'The header should tell people what they will find. The open content can add context, related rows, or secondary explanations without hiding the page’s primary task.',
      body: (
        <div className="content-guidance-grid coin-accordion-content-grid">
          <article className="content-rule content-rule-featured">
            <span aria-hidden="true">01</span>
            <h3>Make the promise specific</h3>
            <p>Use a meaningful header and let the body answer the question that header raises.</p>
            <div className="rule-example coin-accordion-rule-example">
              <div className="coin-accordion-content-specimen">
                <AccordionExample title="Payment methods" defaultExpanded colorMode="Light">
                  <AccordionText
                    text="Review the payment methods available for this account."
                    modes={lightModes}
                  />
                </AccordionExample>
              </div>
            </div>
          </article>
          <article className="content-rule">
            <span aria-hidden="true">02</span>
            <h3>Keep related detail together</h3>
            <p>Rows or short explanatory text belong in the content slot when they answer the header’s promise.</p>
          </article>
          <article className="content-rule">
            <span aria-hidden="true">03</span>
            <h3>Keep primary work visible</h3>
            <p>Leave the main task in the page flow when hiding it would block progress or change the decision.</p>
          </article>
        </div>
      ),
    },
    context: {
      header: 'In context',
      title: 'Group related account details',
      description:
        'Two public Accordions can sit together while each keeps its own expanded state. Consumer wiring decides whether one, both, or neither is open.',
      body: <ContextExample />,
    },
    'dos-donts': {
      header: 'Do & Don’ts',
      title: 'Make the hidden detail worth opening',
      description:
        'Clear promises, related content, and visible primary work help a disclosure stay useful without becoming a hiding place.',
      body: (
        <div className="comparison-stack coin-accordion-comparison-stack">
          <div className="comparison-row coin-accordion-comparison-row">
            <article className="comparison-card do-card">
              <p className="comparison-label">Do</p>
              <div className="comparison-preview coin-accordion-comparison-preview">
                <AccordionExample title="Payment methods" />
              </div>
              <h3>Name what people will find</h3>
              <p>A specific promise lets people decide whether opening the section is useful.</p>
            </article>
            <article className="comparison-card dont-card">
              <p className="comparison-label">Don’t</p>
              <div className="comparison-preview coin-accordion-comparison-preview">
                <AccordionExample title="More" />
              </div>
              <h3>Use a heading with no meaning</h3>
              <p>People must open the section before they know whether it contains the detail they need.</p>
            </article>
          </div>
          <div className="comparison-row coin-accordion-comparison-row">
            <article className="comparison-card do-card">
              <p className="comparison-label">Do</p>
              <div className="comparison-preview coin-accordion-comparison-preview">
                <AccordionExample title="Bank accounts" defaultExpanded>
                  <AccordionText
                    text="Savings Account · HDFC Bank"
                    modes={modes}
                  />
                </AccordionExample>
              </div>
              <h3>Keep the content related</h3>
              <p>The open details answer the header’s promise and stay easy to scan.</p>
            </article>
            <article className="comparison-card dont-card">
              <p className="comparison-label">Don’t</p>
              <div className="comparison-preview coin-accordion-comparison-preview">
                <AccordionExample title="Bank accounts" defaultExpanded>
                  <AccordionText
                    text="Support hours, marketing preferences, and unrelated profile reminders."
                    modes={modes}
                  />
                </AccordionExample>
              </div>
              <h3>Mix unrelated information</h3>
              <p>The heading stops helping because the open content answers several different questions.</p>
            </article>
          </div>
          <div className="comparison-row coin-accordion-comparison-row">
            <article className="comparison-card do-card">
              <p className="comparison-label">Do</p>
              <div className="comparison-preview coin-accordion-comparison-preview">
                <div className="coin-accordion-action-example">
                  <AccordionExample title="Payment details" />
                  <Button
                    label="Confirm payment"
                    modes={primaryButtonModes()}
                    accessibilityLabel="Confirm payment"
                  />
                </div>
              </div>
              <h3>Keep primary work visible</h3>
              <p>Use the Accordion for supporting details while the main payment action stays in the page flow.</p>
            </article>
            <article className="comparison-card dont-card">
              <p className="comparison-label">Don’t</p>
              <div className="comparison-preview coin-accordion-comparison-preview">
                <AccordionExample title="Confirm payment">
                  <Button
                    label="Confirm payment"
                    modes={primaryButtonModes()}
                    accessibilityLabel="Confirm payment"
                  />
                </AccordionExample>
              </div>
              <h3>Hide the primary action in the body</h3>
              <p>The button is unavailable until someone expands the section, so the task is harder to complete.</p>
            </article>
          </div>
        </div>
      ),
    },
    sources: {
      header: 'Sources',
      title: 'Grounded in the published component',
      description:
        'This guide records the public Accordion contract, the inspected Figma source, and the published story configurations used by the examples.',
      body: (
        <>
          <div className="sources-grid">
            <a href={FIGMA_URL} target="_blank" rel="noreferrer">
              <span className="source-index">01</span>
              <div>
                <h3>Coin Components Library</h3>
                <p>Accordion component set · node 1291:4846</p>
              </div>
              <SmallArrow />
            </a>
            <a href={STORYBOOK_URL} target="_blank" rel="noreferrer">
              <span className="source-index">02</span>
              <div>
                <h3>Accordion Storybook</h3>
                <p>Default, contained, expanded, disabled, list, and group examples</p>
              </div>
              <SmallArrow />
            </a>
          </div>
          <div className="verification-note">
            <span>Checked 21 September 2026</span>
            <p>
              Examples use public <code>Accordion</code>, <code>ListItem</code>, <code>IconCapsule</code>, <code>MoneyValue</code>, and <code>Text</code> exports from <code>jfs-components</code> 0.1.60. The package registry latest is also 0.1.60. The Accordion derives its state from public props and pointer interaction; the guide does not pass the internal <code>Accordion States</code> mode. The Figma reference includes a 445px header and content-driven open example, while package height follows its children and token padding. React Native Web can apply the package's requested LayoutAnimation immediately; the guide leaves that shipped behavior unchanged.
            </p>
          </div>
          <div className="coin-accordion-source-links">
            <SourceLink href={STORYBOOK_DEFAULT_URL}>Open default story</SourceLink>
            <SourceLink href={STORYBOOK_CONTAINED_URL}>Open contained story</SourceLink>
            <SourceLink href={STORYBOOK_EXPANDED_URL}>Open expanded story</SourceLink>
            <SourceLink href={STORYBOOK_DISABLED_URL}>Open disabled story</SourceLink>
            <SourceLink href={STORYBOOK_LIST_URL}>Open list-item story</SourceLink>
            <SourceLink href={STORYBOOK_GROUP_URL}>Open group story</SourceLink>
          </div>
        </>
      ),
    },
  }

  const resolvedTitle = title.trim() || 'Accordion title'

  return (
    <ComponentGuideTemplate
      metadata={{
        slug: 'accordion',
        name: 'Accordion',
        summary:
          'Reveal supporting details when people need them, while keeping the page easy to scan.',
        corePrinciple: 'Make the header a clear promise about the content inside.',
        figmaUrl: FIGMA_URL,
        storybookUrl: STORYBOOK_URL,
      }}
      playground={
        <>
          <div className={classes('preview-stage', 'coin-accordion-preview-stage', colorMode === 'Dark' && 'is-dark')}>
            <div className="coin-accordion-preview-host">
              <AccordionExample
                title={resolvedTitle}
                colorMode={colorMode}
                contained={contained}
                expanded={expanded}
                disabled={disabled}
                onExpandedChange={(next) => {
                  setExpanded(next)
                  setLastAction(next ? 'Opened' : 'Collapsed')
                }}
              >
                <AccordionText
                  text="Review the payment methods available for this account."
                  modes={modes}
                />
              </AccordionExample>
            </div>
            <p className="preview-note coin-accordion-preview-note" aria-live="polite">
              Last interaction: <strong>{lastAction}</strong>
            </p>
            <span className="stage-label">Live Coin Accordion · {colorMode}</span>
          </div>
          <div className="controls-panel coin-accordion-controls-panel">
            <Segment
              label="Color mode"
              value={colorMode}
              options={['Light', 'Dark'] as const}
              onChange={setColorMode}
            />
            <Segment
              label="Expanded"
              value={expanded ? 'Open' : 'Collapsed'}
              options={['Collapsed', 'Open'] as const}
              onChange={(value) => {
                const next = value === 'Open'
                setExpanded(next)
                setLastAction(next ? 'Opened' : 'Collapsed')
              }}
            />
            <label className="coin-accordion-title-control">
              <span>Header title</span>
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                aria-label="Header title"
                maxLength={70}
              />
            </label>
            <div className="toggle-row coin-accordion-toggle-row">
              <label>
                <input
                  type="checkbox"
                  checked={contained}
                  onChange={(event) => setContained(event.target.checked)}
                />
                <span className="toggle-track" aria-hidden="true" />
                Contained
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={disabled}
                  onChange={(event) => setDisabled(event.target.checked)}
                />
                <span className="toggle-track" aria-hidden="true" />
                Disabled
              </label>
            </div>
            <div className="coin-accordion-readout" aria-live="polite">
              <span>Configured example</span>
              <strong>{expanded ? 'Open' : 'Collapsed'} · {contained ? 'contained' : 'default'}</strong>
              <p>{disabled ? 'The header is unavailable until the product condition changes.' : 'Open the header to reveal the supporting payment details.'}</p>
            </div>
          </div>
        </>
      }
      sections={sections}
    />
  )
}

export function isAccordionLocation() {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).get('component') === 'accordion'
}

export default AccordionGuide

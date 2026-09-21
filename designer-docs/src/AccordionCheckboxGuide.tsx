import {
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import {
  AccordionCheckbox,
  CheckboxGroup,
  CheckboxItem,
  type Modes,
} from 'jfs-components'
import {
  GuideMobileBar,
  GuideSidebar,
  MobileComponentNav,
  MobilePageNav,
  useGuidePageNavigation,
} from './GuideNavigation'

const FIGMA_URL =
  'https://www.figma.com/design/3z7bmhA73Ls7j8Eu4qhYhE/Coin-Components-Library?node-id=4005-2906'
const STORYBOOK_URL =
  'https://jfs-components-storybook.vercel.app/?path=/docs/components-accordioncheckbox--docs'
const STORYBOOK_DEFAULT_URL =
  'https://jfs-components-storybook.vercel.app/iframe.html?id=components-accordioncheckbox--default&viewMode=story'
const STORYBOOK_SELECT_ALL_URL =
  'https://jfs-components-storybook.vercel.app/iframe.html?id=components-accordioncheckbox--controlled-select-all&viewMode=story'

type ColorMode = 'Light' | 'Dark'

const ACCOUNT_LABELS = [
  'Savings • 0245',
  'Current • 1182',
  'Fixed deposit • 9073',
] as const

function classes(...values: Array<string | false | undefined>) {
  return values.filter(Boolean).join(' ')
}

function coinModes(colorMode: ColorMode): Modes {
  return {
    'Color Mode': colorMode,
    'context 10': 'Default',
    'Profile Card Appearance': 'Default',
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

function SectionHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string
  title: string
  children: ReactNode
}) {
  return (
    <header className="section-header">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{children}</p>
    </header>
  )
}

function AccountItems({
  modes,
  values,
  onChange,
  disabled = false,
}: {
  modes: Modes
  values?: readonly boolean[]
  onChange?: (index: number, checked: boolean) => void
  disabled?: boolean
}) {
  return (
    <CheckboxGroup modes={modes} accessibilityLabel="Account choices">
      {ACCOUNT_LABELS.map((label, index) => (
        <CheckboxItem
          key={label}
          checked={values?.[index]}
          onValueChange={onChange ? (checked) => onChange(index, checked) : undefined}
          disabled={disabled}
          modes={modes}
          accessibilityLabel={label}
        >
          {label}
        </CheckboxItem>
      ))}
    </CheckboxGroup>
  )
}

function AccordionExample({
  title = 'Axis Bank',
  subtitle = '3 accounts',
  expanded = false,
  checked = false,
  disabled = false,
  colorMode = 'Light',
  onExpandedChange,
  onCheckedChange,
  children,
  disableTruncation = false,
  className,
}: {
  title?: string
  subtitle?: string
  expanded?: boolean
  checked?: boolean
  disabled?: boolean
  colorMode?: ColorMode
  onExpandedChange?: (expanded: boolean) => void
  onCheckedChange?: (checked: boolean) => void
  children?: ReactNode
  disableTruncation?: boolean
  className?: string
}) {
  const modes = useMemo(() => coinModes(colorMode), [colorMode])
  return (
    <div className={classes('accordion-example', className)} data-coin-example="accordion-checkbox">
      <AccordionCheckbox
        title={title}
        subtitle={subtitle}
        expanded={expanded}
        checked={checked}
        disabled={disabled}
        onExpandedChange={onExpandedChange}
        onCheckedChange={onCheckedChange}
        disableTruncation={disableTruncation}
        modes={modes}
        style={{ width: '100%' }}
      >
        {children ?? <AccountItems modes={modes} />}
      </AccordionCheckbox>
    </div>
  )
}

type AnatomyRect = {
  left: number
  top: number
  width: number
  height: number
}

type AnatomyMark = {
  number: number
  target: AnatomyRect
  marker: { left: number; top: number }
}

type AnatomyMetrics = {
  width: number
  height: number
  marks: AnatomyMark[]
}

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

function unionRects(rects: AnatomyRect[]): AnatomyRect {
  const left = Math.min(...rects.map((rect) => rect.left))
  const top = Math.min(...rects.map((rect) => rect.top))
  const right = Math.max(...rects.map((rect) => rect.left + rect.width))
  const bottom = Math.max(...rects.map((rect) => rect.top + rect.height))
  return { left, top, width: right - left, height: bottom - top }
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

function AnatomyExample() {
  const modes = useMemo(() => coinModes('Light'), [])
  const anatomyRef = useRef<HTMLDivElement>(null)
  const [metrics, setMetrics] = useState<AnatomyMetrics | null>(null)

  useLayoutEffect(() => {
    const frame = anatomyRef.current
    if (!frame) return

    const safeInset = 10
    const clamp = (value: number, max: number) =>
      Math.min(
        Math.max(value, safeInset),
        Math.max(safeInset, max - ANATOMY_MARKER_SIZE - safeInset),
      )

    const measure = () => {
      const frameRect = frame.getBoundingClientRect()
      const component = frame.querySelector<HTMLElement>('.accordion-anatomy-component > *')
      const header = component?.querySelector<HTMLElement>('[role="button"]')
      const checkbox = component?.querySelector<HTMLElement>('[role="checkbox"]')
      const title = component ? findExactText(component, 'Axis Bank') : undefined
      const subtitle = component ? findExactText(component, '3 accounts') : undefined
      const chevrons = header ? Array.from(header.querySelectorAll('svg')) : []
      const chevron = chevrons[chevrons.length - 1]

      if (!component || !header || !checkbox || !title || !subtitle || !chevron) return

      const directChildren = Array.from(component.children)
      const headerChild = directChildren.find((child) => child === header || child.contains(header))
      const headerIndex = headerChild ? directChildren.indexOf(headerChild) : -1
      const afterHeader = headerIndex >= 0 ? directChildren.slice(headerIndex + 1) : []
      const divider = afterHeader.length > 1 ? afterHeader[0] : undefined
      const content = afterHeader.length > 1 ? afterHeader[afterHeader.length - 1] : undefined

      if (!divider || !content) return

      const checkboxRect = rectRelativeTo(checkbox, frameRect)
      const titleRect = unionRects([
        rectRelativeTo(title, frameRect),
        rectRelativeTo(subtitle, frameRect),
      ])
      const chevronRect = rectRelativeTo(chevron, frameRect)
      const dividerRect = rectRelativeTo(divider, frameRect)
      const contentRect = rectRelativeTo(content, frameRect)
      const targetRects = [checkboxRect, titleRect, chevronRect, dividerRect, contentRect]
      const desiredMarkers = [
        {
          left: checkboxRect.left - ANATOMY_MARKER_SIZE - 24,
          top: checkboxRect.top + checkboxRect.height / 2 - ANATOMY_MARKER_SIZE / 2,
        },
        {
          left: titleRect.left + titleRect.width / 2 - ANATOMY_MARKER_SIZE / 2,
          top: titleRect.top - ANATOMY_MARKER_SIZE - 22,
        },
        {
          left: chevronRect.left + chevronRect.width + 22,
          top: chevronRect.top + chevronRect.height / 2 - ANATOMY_MARKER_SIZE / 2,
        },
        {
          left: dividerRect.left - ANATOMY_MARKER_SIZE - 24,
          top: dividerRect.top + dividerRect.height / 2 - ANATOMY_MARKER_SIZE / 2,
        },
        {
          left: contentRect.left + contentRect.width + 24,
          top: contentRect.top + contentRect.height / 2 - ANATOMY_MARKER_SIZE / 2,
        },
      ]

      const nextMetrics: AnatomyMetrics = {
        width: frameRect.width,
        height: frameRect.height,
        marks: targetRects.map((target, index) => ({
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
      const component = frame.querySelector<HTMLElement>('.accordion-anatomy-component > *')
      const header = component?.querySelector<HTMLElement>('[role="button"]')
      const checkbox = component?.querySelector<HTMLElement>('[role="checkbox"]')
      const title = component ? findExactText(component, 'Axis Bank') : undefined
      const subtitle = component ? findExactText(component, '3 accounts') : undefined
      const chevrons = header ? Array.from(header.querySelectorAll('svg')) : []
      const chevron = chevrons[chevrons.length - 1]
      const directChildren = component ? Array.from(component.children) : []
      const headerChild = header
        ? directChildren.find((child) => child === header || child.contains(header))
        : undefined
      const headerIndex = headerChild ? directChildren.indexOf(headerChild) : -1
      const afterHeader = headerIndex >= 0 ? directChildren.slice(headerIndex + 1) : []
      const divider = afterHeader.length > 1 ? afterHeader[0] : undefined
      const content = afterHeader.length > 1 ? afterHeader[afterHeader.length - 1] : undefined
      ;[component, header, checkbox, title, subtitle, chevron, divider, content].forEach((node) => {
        if (node) observer?.observe(node)
      })
    })
    window.addEventListener('resize', measure)
    return () => {
      cancelAnimationFrame(animationFrame)
      observer?.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  return (
    <div ref={anatomyRef} className="accordion-anatomy-live">
      <div className="accordion-anatomy-component">
        <AccordionCheckbox
          title="Axis Bank"
          subtitle="3 accounts"
          expanded
          checked
          modes={modes}
          style={{ width: '100%' }}
        >
          <CheckboxGroup modes={modes} accessibilityLabel="Account choices">
            <CheckboxItem modes={modes}>Savings • 0245</CheckboxItem>
            <CheckboxItem modes={modes}>Current • 1182</CheckboxItem>
            <CheckboxItem modes={modes}>Fixed deposit • 9073</CheckboxItem>
          </CheckboxGroup>
        </AccordionCheckbox>
      </div>
      {metrics ? (
        <>
          <svg
            className="accordion-anatomy-leaders"
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
              className="accordion-callout"
              style={{ left: mark.marker.left, top: mark.marker.top }}
              key={mark.number}
              aria-hidden="true"
            >
              <b>{mark.number}</b>
            </span>
          ))}
        </>
      ) : null}
    </div>
  )
}

function StateCard({
  label,
  detail,
  expanded,
  checked,
  disabled,
}: {
  label: string
  detail: string
  expanded?: boolean
  checked?: boolean
  disabled?: boolean
}) {
  return (
    <article className="state-card accordion-state-card">
      <div className="state-preview accordion-state-preview">
        <AccordionExample
          expanded={expanded}
          checked={checked}
          disabled={disabled}
          className="accordion-state-example"
        />
      </div>
      <h3>{label}</h3>
      <p>{detail}</p>
    </article>
  )
}

function AccountSelectionExample() {
  const modes = useMemo(() => coinModes('Light'), [])
  const [expanded, setExpanded] = useState(true)
  const [selected, setSelected] = useState<boolean[]>([false, false, false])
  const allSelected = selected.every(Boolean)

  const updateChild = (index: number, checked: boolean) => {
    setSelected((current) => current.map((value, itemIndex) => (itemIndex === index ? checked : value)))
  }

  return (
    <div className="context-selection-example">
      <AccordionCheckbox
        title="Axis Bank"
        subtitle="3 accounts"
        expanded={expanded}
        checked={allSelected}
        onExpandedChange={setExpanded}
        onCheckedChange={(checked) => setSelected(ACCOUNT_LABELS.map(() => checked))}
        modes={modes}
        style={{ width: '100%' }}
      >
        <AccountItems modes={modes} values={selected} onChange={updateChild} />
      </AccordionCheckbox>
      <p className="context-selection-note">
        Consumer logic makes the header a select-all control. AccordionCheckbox itself only exposes the parent check and expand events.
      </p>
    </div>
  )
}

export function AccordionCheckboxGuide() {
  useGuidePageNavigation()

  const [expanded, setExpanded] = useState(false)
  const [checked, setChecked] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [colorMode, setColorMode] = useState<ColorMode>('Light')
  const [subtitleVisible, setSubtitleVisible] = useState(true)
  const modes = useMemo(() => coinModes(colorMode), [colorMode])

  useLayoutEffect(() => {
    const previousTitle = document.title
    document.title = 'AccordionCheckbox · Coin designer documentation'
    return () => {
      document.title = previousTitle
    }
  }, [])

  return (
    <div className="site-shell accordion-docs">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <GuideSidebar active="accordioncheckbox" />

      <main id="main-content" className="content" tabIndex={-1}>
        <GuideMobileBar />
        <MobileComponentNav active="accordioncheckbox" />
        <MobilePageNav />

        <article>
          <section id="overview" className="hero-section anchor-section">
            <div className="hero-copy">
              <p className="breadcrumb">Components / AccordionCheckbox</p>
              <div className="hero-title-row">
                <h1>AccordionCheckbox</h1>
                <span className="public-badge">Public component</span>
              </div>
              <p className="hero-lede">
                Group related choices behind a clear heading. People can select the group and open its options independently.
              </p>
              <p className="recommendation-label">Usage recommendations</p>
              <div className="hero-links">
                <SourceLink href={FIGMA_URL}>Open in Figma</SourceLink>
                <SourceLink href={STORYBOOK_URL}>View Storybook</SourceLink>
              </div>
            </div>
            <div className="principle-card">
              <span className="principle-number" aria-hidden="true">01</span>
              <p className="eyebrow">Core principle</p>
              <p>Selecting is not expanding.</p>
            </div>
          </section>

          <section className="playground accordion-playground" aria-labelledby="accordion-playground-title">
            <div className="playground-heading">
              <div>
                <p className="eyebrow">Try it</p>
                <h2 id="accordion-playground-title">Explore the component</h2>
              </div>
              <p>Use the header checkbox and the rest of the header separately to see the two independent interactions.</p>
            </div>
            <div className="playground-grid">
              <div className={classes('preview-stage', 'accordion-preview-stage', colorMode === 'Dark' && 'is-dark')}>
                <div className="accordion-preview-center">
                  <AccordionCheckbox
                    title="Axis Bank"
                    subtitle={subtitleVisible ? '3 accounts' : ''}
                    expanded={expanded}
                    checked={checked}
                    disabled={disabled}
                    onExpandedChange={setExpanded}
                    onCheckedChange={setChecked}
                    modes={modes}
                    style={{ width: '100%' }}
                  >
                    <CheckboxGroup modes={modes} accessibilityLabel="Account choices">
                      <CheckboxItem modes={modes}>Savings • 0245</CheckboxItem>
                      <CheckboxItem modes={modes}>Current • 1182</CheckboxItem>
                      <CheckboxItem modes={modes}>Fixed deposit • 9073</CheckboxItem>
                    </CheckboxGroup>
                  </AccordionCheckbox>
                  <p className="preview-note" aria-live="polite">
                    Group {checked ? 'selected' : 'not selected'} · options {expanded ? 'visible' : 'hidden'}
                  </p>
                </div>
                <span className="stage-label">Live Coin AccordionCheckbox · {colorMode}</span>
              </div>
              <div className="controls-panel accordion-controls-panel">
                <Segment label="Expanded" value={expanded ? 'Open' : 'Collapsed'} options={['Collapsed', 'Open'] as const} onChange={(value) => setExpanded(value === 'Open')} />
                <Segment label="Header checkbox" value={checked ? 'Selected' : 'Unchecked'} options={['Unchecked', 'Selected'] as const} onChange={(value) => setChecked(value === 'Selected')} />
                <Segment label="Color mode" value={colorMode} options={['Light', 'Dark'] as const} onChange={setColorMode} />
                <div className="toggle-row">
                  <label>
                    <input type="checkbox" checked={disabled} onChange={(event) => setDisabled(event.target.checked)} />
                    <span className="toggle-track" aria-hidden="true" />
                    Disabled
                  </label>
                  <label>
                    <input type="checkbox" checked={subtitleVisible} onChange={(event) => setSubtitleVisible(event.target.checked)} />
                    <span className="toggle-track" aria-hidden="true" />
                    Subtitle
                  </label>
                </div>
                <div className="accordion-readout" aria-live="polite">
                  <span>Live state</span>
                  <strong>{checked ? 'Selected' : 'Unchecked'} · {expanded ? 'Open' : 'Collapsed'}</strong>
                  <p>The checkbox changes selection. The header changes expansion.</p>
                </div>
              </div>
            </div>
          </section>

          <section id="anatomy" className="doc-section anchor-section">
            <SectionHeader eyebrow="Anatomy" title="Five parts make the relationship clear">
              The header combines selection and disclosure. The divider and content slot only appear when the group is open.
            </SectionHeader>
            <div className="anatomy-card accordion-anatomy-card">
              <div className="anatomy-stage accordion-anatomy-stage">
                <AnatomyExample />
              </div>
              <ol className="anatomy-list">
                <li><b>Checkbox</b><span>Selects the group. It does not open the content.</span></li>
                <li><b>Title + subtitle</b><span>Names the group and gives a short piece of supporting context.</span></li>
                <li><b>Chevron</b><span>Shows whether the content slot is collapsed or open.</span></li>
                <li><b>Divider</b><span>Separates the header from the options when expanded.</span></li>
                <li><b>Content slot</b><span>Usually contains a public CheckboxGroup of CheckboxItems.</span></li>
              </ol>
            </div>
          </section>

          <section id="configuration" className="doc-section anchor-section">
            <SectionHeader eyebrow="Configuration" title="Choose selection and expansion separately">
              Agree how selecting a group affects its choices before using it in a flow.
            </SectionHeader>
            <div className="accordion-configuration-grid">
              <article className="configuration-block accordion-config-card">
                <p className="eyebrow">Header behavior</p>
                <h3>Two independent choices</h3>
                <div className="accordion-config-example">
                  <AccordionExample expanded checked />
                </div>
                <p>A group can be selected while closed, or open while unselected.</p>
              </article>
              <article className="configuration-block accordion-config-card">
                <p className="eyebrow">Content behavior</p>
                <h3>Group related options</h3>
                <div className="accordion-config-example">
                  <AccordionExample expanded />
                </div>
                <p>Keep related choices together in the content area.</p>
              </article>
            </div>
          </section>

          <section id="states" className="doc-section anchor-section">
            <SectionHeader eyebrow="States" title="State is visible in both controls">
              Compare the stable configured outcomes. The checked and expanded values can change independently while the runtime supplies pressed feedback during interaction.
            </SectionHeader>
            <p className="accordion-static-note">State references · use the playground above for interaction.</p>
            <div className="state-grid accordion-state-grid">
              <StateCard label="Collapsed · unchecked" detail="The group is closed and the header is not selected." />
              <StateCard label="Collapsed · checked" detail="Selection can be visible while the options stay closed." checked />
              <StateCard label="Expanded" detail="The divider and content slot appear after the header." expanded />
              <StateCard label="Disabled" detail="The parent header controls are unavailable until the condition changes." disabled />
            </div>
            <div className="guidance-note">
              <strong>Keep the two state changes separate.</strong>
              <p>When a product needs select-all behavior, connect the parent and child state explicitly in consumer code. Do not imply that checking this component automatically changes its descendants.</p>
            </div>
          </section>

          <section id="sizing" className="doc-section anchor-section">
            <SectionHeader eyebrow="Sizing" title="The host owns the width">
              The Figma reference measures a 445px wide vertical HUG component. In a product layout, the parent supplies the available width and the component grows in height as content wraps or expands.
            </SectionHeader>
            <div className="accordion-sizing-grid">
              <article className="accordion-sizing-card">
                <div className="accordion-sizing-host accordion-host-wide"><AccordionExample title="Axis Bank" subtitle="3 accounts" expanded /></div>
                <div className="accordion-sizing-meta"><strong>Wide host</strong><span>Figma reference measured 445px; observed collapsed 68px · open 179px</span></div>
              </article>
              <article className="accordion-sizing-card">
                <div className="accordion-sizing-host accordion-host-narrow"><AccordionExample title="Longer investment account group" subtitle="3 linked accounts" expanded disableTruncation /></div>
                <div className="accordion-sizing-meta"><strong>Constrained host</strong><span>Allow long labels to wrap when the content decision needs more than one line.</span></div>
              </article>
            </div>
          </section>

          <section id="content" className="doc-section anchor-section">
            <SectionHeader eyebrow="Content" title="Give each level a distinct job">
              The heading identifies the group, the subtitle gives a short count or qualifier, and each row names one choice.
            </SectionHeader>
            <div className="content-guidance-grid accordion-content-grid">
              <article className="content-rule content-rule-featured">
                <span aria-hidden="true">01</span>
                <h3>Make the group scannable</h3>
                <p>Use a meaningful title and a compact subtitle that helps someone decide whether to open the group.</p>
                <div className="rule-example"><AccordionExample title="Axis Bank" subtitle="3 accounts" expanded /></div>
              </article>
              <article className="content-rule"><span aria-hidden="true">02</span><h3>Keep row labels distinct</h3><p>Use the account name and a short identifier so people can tell sibling choices apart.</p></article>
              <article className="content-rule"><span aria-hidden="true">03</span><h3>Keep hierarchy short</h3><p>Use one title, one subtitle, and one label per row. Move longer help text outside the row.</p></article>
            </div>
          </section>

          <section id="context" className="doc-section anchor-section">
            <SectionHeader eyebrow="In context" title="Select accounts as a group">
              Here the group checkbox selects every account. Individual rows can still be changed; opening the group does not change the selection.
            </SectionHeader>
            <div className="context-grid accordion-context-grid">
              <article className="scenario-card choice-scenario">
                <div>
                  <span className="context-label">Account selection</span>
                  <h3>Choose the accounts to include</h3>
                  <p>Open the group to review each account, or use the header checkbox to select all through the surrounding flow.</p>
                </div>
                <AccountSelectionExample />
                <p className="scenario-caption">Select-all is a decision made by the product flow.</p>
              </article>
              <article className="scenario-card accordion-context-note-card">
                <span className="context-label">Decision boundary</span>
                <h3>Make selection behavior visible</h3>
                <dl className="accordion-context-list">
                  <div><dt>Component</dt><dd>Emits separate checked and expanded changes.</dd></div>
                  <div><dt>Consumer</dt><dd>Decides whether parent selection maps to child rows.</dd></div>
                  <div><dt>Rows</dt><dd>Keep their own checked state and labels.</dd></div>
                </dl>
              </article>
            </div>
          </section>

          <section id="dos-donts" className="doc-section anchor-section">
            <SectionHeader eyebrow="Do & Don’ts" title="Protect the group’s meaning">
              Strong names and distinct choices make the disclosure useful before someone interacts with it.
            </SectionHeader>
            <div className="comparison-stack accordion-comparison-stack">
              <div className="comparison-row">
                <article className="comparison-card do-card"><p className="comparison-label">Do</p><div className="comparison-preview accordion-comparison-preview"><AccordionExample title="Axis Bank" subtitle="3 accounts" /></div><h3>Name the group and add a useful qualifier</h3><p>People can predict what is inside before they open it.</p></article>
                <article className="comparison-card dont-card"><p className="comparison-label">Don’t</p><div className="comparison-preview accordion-comparison-preview"><AccordionExample title="Options" subtitle="3 items" /></div><h3>Use a vague heading and unexplained count</h3><p>The group gives no clue about the choice or its consequence.</p></article>
              </div>
              <div className="comparison-row">
                <article className="comparison-card do-card"><p className="comparison-label">Do</p><div className="comparison-preview accordion-comparison-preview"><AccordionExample title="Axis Bank" subtitle="3 accounts" expanded /></div><h3>Give each child row a distinct name</h3><p>Sibling options remain easy to scan after expansion.</p></article>
                <article className="comparison-card dont-card"><p className="comparison-label">Don’t</p><div className="comparison-preview accordion-comparison-preview"><AccordionExample title="Axis Bank" subtitle="3 accounts" expanded><CheckboxGroup modes={coinModes('Light')}><CheckboxItem modes={coinModes('Light')}>Account</CheckboxItem><CheckboxItem modes={coinModes('Light')}>Account</CheckboxItem><CheckboxItem modes={coinModes('Light')}>Account</CheckboxItem></CheckboxGroup></AccordionExample></div><h3>Repeat generic row labels</h3><p>People cannot tell which choice they are selecting.</p></article>
              </div>
            </div>
          </section>

          <section id="sources" className="doc-section sources-section anchor-section">
            <SectionHeader eyebrow="Sources" title="Grounded in the published component">
              The guide separates documented Coin configuration from behavior supplied by the public package at runtime.
            </SectionHeader>
            <div className="sources-grid">
              <a href={FIGMA_URL} target="_blank" rel="noreferrer"><span className="source-index">01</span><div><h3>Coin Components Library</h3><p>Accordion / Checkbox component set · node 4005:2906</p></div><SmallArrow /></a>
              <a href={STORYBOOK_URL} target="_blank" rel="noreferrer"><span className="source-index">02</span><div><h3>AccordionCheckbox Storybook</h3><p>Default, Expanded, Disabled, and Controlled Select All stories</p></div><SmallArrow /></a>
            </div>
            <div className="verification-note">
              <span>Checked 18 September 2026</span>
              <p>Examples use public <code>AccordionCheckbox</code>, <code>CheckboxGroup</code>, and <code>CheckboxItem</code> exports from jfs-components 0.1.60. The npm registry latest is also 0.1.60. The component forwards modes to its slot and exposes separate checked/expanded callbacks; consumer select-all wiring is shown explicitly in context. The public disabled prop disables the parent header controls; pass disabled to nested rows when those rows must also be unavailable. In the local React Native Web preview, open/close changes immediately because the package’s LayoutAnimation request does not produce a smooth transition here; the guide does not shim it. In this web build, checkbox keyboard activation can also toggle expansion; child choices do not respond to Space. This is a known package limitation.</p>
            </div>
            <div className="accordion-source-links"><SourceLink href={STORYBOOK_DEFAULT_URL}>Open default story</SourceLink><SourceLink href={STORYBOOK_SELECT_ALL_URL}>Open controlled select-all story</SourceLink></div>
          </section>
        </article>
        <footer><span>Coin designer documentation</span><a href="#overview">Back to top ↑</a></footer>
      </main>
    </div>
  )
}

export function isAccordionCheckboxLocation() {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).get('component') === 'accordioncheckbox'
}

export default AccordionCheckboxGuide

import {
  useLayoutEffect,
  useMemo,
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
import { Anatomy, Segment, Sources, docsUrl } from './guide-kit'

const FIGMA_URL =
  'https://www.figma.com/design/3z7bmhA73Ls7j8Eu4qhYhE/Coin-Components-Library?node-id=4005-2906'
const STORYBOOK_URL = docsUrl('accordioncheckbox')
const STORYBOOK_STORIES = [
  { label: 'Open default story', id: 'components-accordioncheckbox--default' },
  { label: 'Open controlled select-all story', id: 'components-accordioncheckbox--controlled-select-all' },
] as const

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
  const anatomyModes = useMemo(() => coinModes('Light'), [])

  useLayoutEffect(() => {
    const previousTitle = document.title
    document.title = 'Accordion Checkbox · Coin designer documentation'
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
              <p className="breadcrumb">Components / Accordion Checkbox</p>
              <div className="hero-title-row">
                <h1>Accordion Checkbox</h1>
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
            <Anatomy
              title="Accordion Checkbox"
              specimenWidth={445}
              parts={[
                { name: 'Checkbox', note: 'Selects the group. It does not open the content.', target: '[role="button"] [role="checkbox"]', side: 'left' },
                { name: 'Title + subtitle', note: 'Names the group and gives a short piece of supporting context.', target: '[role="button"] > div > div:last-child', side: 'top', at: 0.1 },
                { name: 'Chevron', note: 'Shows whether the content slot is collapsed or open.', target: '[role="button"] > :last-child', side: 'right' },
                { name: 'Divider', note: 'Separates the header from the options when expanded.', target: '[role="presentation"]', side: 'left' },
                { name: 'Content slot', note: 'Usually contains a public CheckboxGroup of CheckboxItems.', target: '[role="presentation"] + div', side: 'right' },
              ]}
            >
              <AccordionCheckbox
                title="Axis Bank"
                subtitle="3 accounts"
                expanded
                checked
                modes={anatomyModes}
                style={{ width: '100%' }}
              >
                <CheckboxGroup modes={anatomyModes} accessibilityLabel="Account choices">
                  <CheckboxItem modes={anatomyModes}>Savings • 0245</CheckboxItem>
                  <CheckboxItem modes={anatomyModes}>Current • 1182</CheckboxItem>
                  <CheckboxItem modes={anatomyModes}>Fixed deposit • 9073</CheckboxItem>
                </CheckboxGroup>
              </AccordionCheckbox>
            </Anatomy>
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
            <Sources
              checked="18 September 2026"
              figmaUrl={FIGMA_URL}
              figmaDescription="Accordion / Checkbox component set · node 4005:2906"
              storybookUrl={STORYBOOK_URL}
              storybookDescription="Default, Expanded, Disabled, and Controlled Select All stories"
              stories={STORYBOOK_STORIES}
            >
              Examples use public <code>AccordionCheckbox</code>, <code>CheckboxGroup</code>, and <code>CheckboxItem</code> exports from jfs-components 0.1.60. The npm registry latest is also 0.1.60. The component forwards modes to its slot and exposes separate checked/expanded callbacks; consumer select-all wiring is shown explicitly in context. The public disabled prop disables the parent header controls; pass disabled to nested rows when those rows must also be unavailable. In the local React Native Web preview, open/close changes immediately because the package’s LayoutAnimation request does not produce a smooth transition here; the guide does not shim it. In this web build, checkbox keyboard activation can also toggle expansion; child choices do not respond to Space. This is a known package limitation.
            </Sources>
          </section>
        </article>
        <footer><span>Coin designer documentation</span><a href="#overview">Back to top ↑</a></footer>
      </main>
    </div>
  )
}

export default AccordionCheckboxGuide

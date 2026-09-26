import { useMemo, useState, type ReactNode } from 'react'
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
import { Anatomy, Segment, Sources, byTestId } from './guide-kit'

const FIGMA_URL =
  'https://www.figma.com/design/3z7bmhA73Ls7j8Eu4qhYhE/Coin-Components-Library?node-id=1291-4846'
const STORYBOOK_URL =
  'https://jfs-components-storybook.vercel.app/?path=/docs/components-accordion--docs'
const STORYBOOK_STORIES = [
  { label: 'Open default story', id: 'components-accordion--default' },
  { label: 'Open contained story', id: 'components-accordion--contained' },
  { label: 'Open expanded story', id: 'components-accordion--expanded' },
  { label: 'Open disabled story', id: 'components-accordion--disabled' },
  { label: 'Open list-item story', id: 'components-accordion--with-list-items' },
  { label: 'Open group story', id: 'components-accordion--accordion-group' },
] as const

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
  testID,
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
  testID?: string
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
        testID={testID}
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
        <Anatomy
          title="Accordion"
          specimenWidth={360}
          parts={[
            { name: 'Header', note: 'The title is the promise people use to decide whether to open the section.', target: `${byTestId('accordion-anatomy')} > [role="button"]`, side: 'left' },
            { name: 'Label', note: 'Keep the header short enough to remain scannable in a narrow host.', target: `${byTestId('accordion-anatomy')} [role="button"] [dir="auto"]`, side: 'top', at: 0.15 },
            { name: 'Indicator', note: 'The public component switches between add and minus icons as it opens and closes.', target: `${byTestId('accordion-anatomy')} [role="button"] svg`, side: 'right' },
            { name: 'Divider', note: 'The component’s bottom border separates the open section from the following content.', target: byTestId('accordion-anatomy'), side: 'bottom' },
            { name: 'Content slot', note: 'Put supporting details or related public rows here; keep primary actions visible in the page flow.', target: `${byTestId('accordion-anatomy')} > :last-child`, side: 'left' },
          ]}
        >
          <AccordionExample title="Payment methods" defaultExpanded testID="accordion-anatomy">
            <AccordionText
              text="Review the payment methods available for this account."
              modes={lightModes}
            />
          </AccordionExample>
        </Anatomy>
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
        <Sources
          checked="21 September 2026"
          figmaUrl={FIGMA_URL}
          figmaDescription="Accordion component set · node 1291:4846"
          storybookUrl={STORYBOOK_URL}
          storybookDescription="Default, contained, expanded, disabled, list, and group examples"
          stories={STORYBOOK_STORIES}
        >
          Examples use public <code>Accordion</code>, <code>ListItem</code>, <code>IconCapsule</code>, <code>MoneyValue</code>, and <code>Text</code> exports from <code>jfs-components</code> 0.1.60. The package registry latest is also 0.1.60. The Accordion derives its state from public props and pointer interaction; the guide does not pass the internal <code>Accordion States</code> mode. The Figma reference includes a 445px header and content-driven open example, while package height follows its children and token padding. React Native Web can apply the package's requested LayoutAnimation immediately; the guide leaves that shipped behavior unchanged.
        </Sources>
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

export default AccordionGuide

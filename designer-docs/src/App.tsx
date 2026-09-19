import { useMemo, useState } from 'react'
import {
  Button,
  getVariableByName,
  Icon,
  SkeletonGroup,
  type ButtonType,
  type Modes,
} from 'jfs-components'
import {
  getLayoutGuideFromLocation,
  LayoutGuidePage,
} from './LayoutGuides'
import {
  AccordionCheckboxGuide,
  isAccordionCheckboxLocation,
} from './AccordionCheckboxGuide'
import {
  ActionFooterGuide,
  ActionTileGuide,
  AddItemGuide,
  getActionGuideFromLocation,
} from './ActionGuides'
import {
  GuideMobileBar,
  GuideSidebar,
  MobileComponentNav,
  MobilePageNav,
} from './GuideNavigation'

const FIGMA_URL =
  'https://www.figma.com/design/3z7bmhA73Ls7j8Eu4qhYhE/Coin-Components-Library?node-id=3574-181'
const STORYBOOK_URL =
  'https://jfs-components-storybook.vercel.app/?path=/docs/components-button--docs'

type ButtonSize = 'M' | 'S' | 'XS'
type Emphasis = 'High' | 'Medium' | 'Low'
type BrandAppearance = 'Primary' | 'Secondary' | 'Neutral' | 'Tertiary'
type SystemAppearance = 'positive' | 'warning' | 'negative'
type Intent = 'Brand' | 'System'
type InteractiveState = 'Idle' | 'Hover' | 'Pressed' | 'Disabled'
type IconPlacement = 'None' | 'Start' | 'End' | 'Both'

interface ModeOptions {
  size?: ButtonSize
  emphasis?: Emphasis
  intent?: Intent
  appearance?: BrandAppearance | SystemAppearance
  colorMode?: 'Light' | 'Dark'
  state?: InteractiveState
  type?: ButtonType
}

function buttonModes({
  size = 'M',
  emphasis = 'High',
  intent = 'Brand',
  appearance = 'Primary',
  colorMode = 'Light',
  state = 'Idle',
  type = 'default',
}: ModeOptions = {}): Modes {
  const modes: Record<string, string> = {
    'Button / Size': size,
    Emphasis: emphasis,
    'Semantic Intent': intent,
    'Color Mode': colorMode,
    Context4: 'Button',
  }

  if (intent === 'System') {
    modes.AppearanceSystem = appearance as SystemAppearance
  } else {
    modes.AppearanceBrand = appearance as BrandAppearance
  }

  if (type === 'glass') {
    modes['Button type'] = 'glass'
    modes['Button Glass State'] = state
  } else {
    modes['Button / State'] = state
  }

  return modes as Modes
}

interface CoinButtonProps extends ModeOptions {
  label: string
  iconPlacement?: IconPlacement
  disabled?: boolean
  loading?: boolean
  fill?: boolean
  onPress?: () => void
  className?: string
}

function CoinButton({
  label,
  iconPlacement = 'None',
  disabled = false,
  loading = false,
  fill = false,
  onPress,
  className,
  ...options
}: CoinButtonProps) {
  const modes = useMemo(() => buttonModes(options), [options])
  const leadingColor = getVariableByName('button/foreground', modes)
  const leadingSize = getVariableByName('button/icon/size', modes)

  return (
    <div className={className} data-coin-example="button">
      <SkeletonGroup loading={loading}>
        <Button
          label={label}
          type={options.type}
          modes={modes}
          disabled={disabled}
          loading={loading}
          onPress={onPress}
          accessibilityLabel={label}
          style={fill ? { width: '100%' } : undefined}
          leading={
            iconPlacement === 'Start' || iconPlacement === 'Both' ? (
              <Icon
                iconName="ic_download"
                modes={modes}
                color={typeof leadingColor === 'string' ? leadingColor : undefined}
                size={typeof leadingSize === 'number' ? leadingSize : undefined}
                accessibilityElementsHidden
                importantForAccessibility="no"
              />
            ) : undefined
          }
          icon={
            iconPlacement === 'End' || iconPlacement === 'Both'
              ? 'ic_arrow_next'
              : undefined
          }
        />
      </SkeletonGroup>
    </div>
  )
}

interface SegmentedControlProps<T extends string> {
  label: string
  value: T
  options: readonly T[]
  onChange: (value: T) => void
  display?: (value: T) => string
}

function SegmentedControl<T extends string>({
  label,
  value,
  options,
  onChange,
  display = (option) => option,
}: SegmentedControlProps<T>) {
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
            {display(option)}
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

function ButtonGuide() {
  const [label, setLabel] = useState('Continue')
  const [type, setType] = useState<ButtonType>('default')
  const [size, setSize] = useState<ButtonSize>('M')
  const [emphasis, setEmphasis] = useState<Emphasis>('High')
  const [intent, setIntent] = useState<Intent>('Brand')
  const [brandAppearance, setBrandAppearance] =
    useState<BrandAppearance>('Primary')
  const [systemAppearance, setSystemAppearance] =
    useState<SystemAppearance>('positive')
  const [colorMode, setColorMode] = useState<'Light' | 'Dark'>('Light')
  const [iconPlacement, setIconPlacement] =
    useState<IconPlacement>('None')
  const [disabled, setDisabled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [announcement, setAnnouncement] = useState(
    'The preview is ready to try.',
  )

  const appearance =
    intent === 'Brand' ? brandAppearance : systemAppearance
  const previewIsDark = colorMode === 'Dark' || type === 'glass'

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <GuideSidebar active="button" />

      <main id="main-content" className="content">
        <GuideMobileBar />

        <MobileComponentNav active="button" />
        <MobilePageNav />

        <article>
          <section id="overview" className="hero-section anchor-section">
            <div className="hero-copy">
              <p className="breadcrumb">Components / Button</p>
              <div className="hero-title-row">
                <h1>Button</h1>
                <span className="public-badge">Public component</span>
              </div>
              <p className="hero-lede">
                Use Button when one clear action moves someone forward,
                confirms a choice, or completes a task.
              </p>
              <p className="recommendation-label">Usage recommendations</p>
              <div className="hero-links">
                <SourceLink href={FIGMA_URL}>Open in Figma</SourceLink>
                <SourceLink href={STORYBOOK_URL}>View Storybook</SourceLink>
              </div>
            </div>

            <div className="principle-card">
              <span className="principle-number" aria-hidden="true">
                01
              </span>
              <p className="eyebrow">Core principle</p>
              <p>
                Make the action clear before choosing its appearance. The
                label should explain what happens next.
              </p>
            </div>
          </section>

          <section className="playground" aria-labelledby="playground-title">
            <div className="playground-heading">
              <div>
                <p className="eyebrow">Try it</p>
                <h2 id="playground-title">Explore the component</h2>
              </div>
              <p>Hover, press, and change the controls to compare outcomes.</p>
            </div>

            <div className="playground-grid">
              <div
                className={`preview-stage ${previewIsDark ? 'is-dark' : ''} ${
                  type === 'glass' ? 'is-glass-stage' : ''
                }`}
              >
                <div className="stage-orbit orbit-one" aria-hidden="true" />
                <div className="stage-orbit orbit-two" aria-hidden="true" />
                <div className="preview-center">
                  <CoinButton
                    label={label || 'Button'}
                    type={type}
                    size={size}
                    emphasis={emphasis}
                    intent={intent}
                    appearance={appearance}
                    colorMode={colorMode}
                    iconPlacement={iconPlacement}
                    disabled={disabled}
                    loading={loading}
                    onPress={() =>
                      setAnnouncement(`“${label || 'Button'}” was pressed.`)
                    }
                  />
                  <p className="preview-note" aria-live="polite">
                    {announcement}
                  </p>
                </div>
                <span className="stage-label">
                  Live Coin Button · {type === 'default' ? 'Default' : type[0].toUpperCase() + type.slice(1)}
                </span>
              </div>

              <div className="controls-panel">
                <label className="text-control">
                  <span>Label</span>
                  <input
                    value={label}
                    maxLength={32}
                    onChange={(event) => setLabel(event.target.value)}
                    placeholder="Button label"
                  />
                </label>

                <SegmentedControl
                  label="Type"
                  value={type}
                  options={['default', 'fixed', 'glass'] as const}
                  onChange={setType}
                  display={(option) =>
                    option[0].toUpperCase() + option.slice(1)
                  }
                />

                <div className="control-row">
                  <SegmentedControl
                    label="Size"
                    value={size}
                    options={['M', 'S', 'XS'] as const}
                    onChange={setSize}
                  />
                  <SegmentedControl
                    label="Emphasis"
                    value={emphasis}
                    options={['High', 'Medium', 'Low'] as const}
                    onChange={setEmphasis}
                  />
                </div>

                <SegmentedControl
                  label="Intent"
                  value={intent}
                  options={['Brand', 'System'] as const}
                  onChange={setIntent}
                />

                {intent === 'Brand' ? (
                  <SegmentedControl
                    label="Appearance"
                    value={brandAppearance}
                    options={[
                      'Primary',
                      'Secondary',
                      'Neutral',
                      'Tertiary',
                    ] as const}
                    onChange={setBrandAppearance}
                  />
                ) : (
                  <SegmentedControl
                    label="Meaning"
                    value={systemAppearance}
                    options={['positive', 'warning', 'negative'] as const}
                    onChange={setSystemAppearance}
                    display={(option) =>
                      option[0].toUpperCase() + option.slice(1)
                    }
                  />
                )}

                <div className="control-row">
                  <SegmentedControl
                    label="Icon"
                    value={iconPlacement}
                    options={['None', 'Start', 'End'] as const}
                    onChange={setIconPlacement}
                  />
                  <SegmentedControl
                    label="Theme"
                    value={colorMode}
                    options={['Light', 'Dark'] as const}
                    onChange={setColorMode}
                  />
                </div>

                <div className="toggle-row">
                  <label>
                    <input
                      type="checkbox"
                      checked={disabled}
                      onChange={(event) => setDisabled(event.target.checked)}
                    />
                    <span className="toggle-track" aria-hidden="true" />
                    Disabled
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={loading}
                      onChange={(event) => setLoading(event.target.checked)}
                    />
                    <span className="toggle-track" aria-hidden="true" />
                    Loading
                  </label>
                </div>
              </div>
            </div>
          </section>

          <section id="anatomy" className="doc-section anchor-section">
            <SectionHeader eyebrow="Anatomy" title="Four purposeful parts">
              Keep the component simple. The label is required; icons and the
              start slot are supporting tools.
            </SectionHeader>

            <div className="anatomy-card">
              <div className="anatomy-stage">
                <div className="anatomy-button-wrap">
                  <span className="anatomy-callout anatomy-callout-top anatomy-callout-container">
                    <b>1</b> Container
                  </span>
                  <span className="anatomy-callout anatomy-callout-bottom anatomy-callout-start">
                    <b>2</b> Start slot
                  </span>
                  <span className="anatomy-callout anatomy-callout-top anatomy-callout-label">
                    <b>3</b> Label
                  </span>
                  <span className="anatomy-callout anatomy-callout-bottom anatomy-callout-end">
                    <b>4</b> End icon
                  </span>
                  <CoinButton
                    label="Move money"
                    iconPlacement="Both"
                    appearance="Primary"
                  />
                </div>
              </div>
              <ol className="anatomy-list">
                <li>
                  <b>Container</b>
                  <span>Holds the action and resolves its visual treatment.</span>
                </li>
                <li>
                  <b>Start slot</b>
                  <span>Optional. Use for an icon that clarifies the action.</span>
                </li>
                <li>
                  <b>Label</b>
                  <span>Required. Name the outcome in one to three words.</span>
                </li>
                <li>
                  <b>End icon</b>
                  <span>Optional. Use when direction or continuation matters.</span>
                </li>
              </ol>
            </div>
            <p className="anatomy-footnote">
              The start slot and end icon are both available. Most actions only
              need one, and many need neither.
            </p>
          </section>

          <section id="configuration" className="doc-section anchor-section">
            <SectionHeader eyebrow="Configuration" title="Choose type by context">
              Type sets the component’s structure. Appearance and emphasis then
              express hierarchy and meaning.
            </SectionHeader>

            <div className="type-grid">
              <article className="type-card">
                <div className="type-preview">
                  <CoinButton label="Continue" type="default" />
                </div>
                <div>
                  <h3>Default</h3>
                  <p>
                    The standard solid action. It hugs its label or fills its
                    container when the layout asks it to.
                  </p>
                  <span>Use for most actions</span>
                </div>
              </article>
              <article className="type-card">
                <div className="type-preview fixed-preview">
                  <CoinButton label="Review investment details" type="fixed" />
                </div>
                <div>
                  <h3>Fixed</h3>
                  <p>
                    Keeps long content within the system width limit. It remains
                    responsive rather than using a hand-set pixel width.
                  </p>
                  <span>Use for aligned, bounded actions</span>
                </div>
              </article>
              <article className="type-card glass-type-card">
                <div className="type-preview glass-preview">
                  <div className="glass-shape" aria-hidden="true" />
                  <CoinButton
                    label="Explore"
                    type="glass"
                    colorMode="Dark"
                    iconPlacement="End"
                  />
                </div>
                <div>
                  <h3>Glass</h3>
                  <p>
                    A translucent action for rich media or coloured surfaces.
                    Its backdrop is part of the result.
                  </p>
                  <span>Use only over a meaningful backdrop</span>
                </div>
              </article>
            </div>

            <div className="configuration-block">
              <div className="subsection-heading">
                <div>
                  <p className="eyebrow">Visual hierarchy</p>
                  <h3>Appearance and emphasis work together</h3>
                </div>
                <p>
                  Appearance identifies the family. Emphasis decides how loudly
                  the action speaks within that family.
                </p>
              </div>

              <div className="matrix-wrap">
                <div className="matrix-labels" aria-hidden="true">
                  <span />
                  <span>High</span>
                  <span>Medium</span>
                  <span>Low</span>
                </div>
                {(
                  [
                    'Primary',
                    'Secondary',
                    'Neutral',
                    'Tertiary',
                  ] as BrandAppearance[]
                ).map((item) => (
                  <div className="matrix-row" key={item}>
                    <b>{item}</b>
                    {(['High', 'Medium', 'Low'] as Emphasis[]).map((level) => (
                      <div className="matrix-cell" key={level}>
                        <CoinButton
                          label={item}
                          appearance={item}
                          emphasis={level}
                          size="S"
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="meaning-row">
                <div>
                  <h4>System meaning</h4>
                  <p>
                    Reserve these appearances for an outcome with clear
                    positive, warning, or negative meaning.
                  </p>
                </div>
                <div className="meaning-buttons">
                  <CoinButton
                    label="Confirm"
                    intent="System"
                    appearance="positive"
                    size="S"
                  />
                  <CoinButton
                    label="Review"
                    intent="System"
                    appearance="warning"
                    size="S"
                  />
                  <CoinButton
                    label="Remove"
                    intent="System"
                    appearance="negative"
                    size="S"
                  />
                </div>
              </div>
            </div>
          </section>

          <section id="states" className="doc-section anchor-section">
            <SectionHeader eyebrow="States" title="States respond to what is happening">
              Idle, hover, and pressed communicate interaction. Disabled and
              loading communicate availability while content is prepared.
            </SectionHeader>

            <div className="state-grid">
              <article className="state-card">
                <div className="state-preview">
                  <CoinButton label="Continue" state="Idle" />
                </div>
                <h3>Idle</h3>
                <p>Ready for action.</p>
              </article>
              <article className="state-card">
                <div className="state-preview">
                  <CoinButton label="Continue" state="Hover" />
                </div>
                <h3>Hover</h3>
                <p>Appears automatically under a pointer.</p>
              </article>
              <article className="state-card">
                <div className="state-preview">
                  <CoinButton label="Continue" state="Pressed" />
                </div>
                <h3>Pressed</h3>
                <p>Appears while the action is held.</p>
              </article>
              <article className="state-card">
                <div className="state-preview">
                  <CoinButton
                    label="Continue"
                    state="Disabled"
                    disabled
                  />
                </div>
                <h3>Disabled</h3>
                <p>Unavailable until a condition is met.</p>
              </article>
              <article className="state-card">
                <div className="state-preview">
                  <CoinButton label="Continue" loading />
                </div>
                <h3>Loading</h3>
                <p>A shape-preserving skeleton holds the action’s place.</p>
              </article>
            </div>

            <div className="guidance-note">
              <strong>Design the cause, not just the state.</strong>
              <p>
                Hover and pressed happen automatically. Disabled should have a
                clear condition. Use loading while required content is being
                prepared, not as a substitute for transaction progress.
              </p>
            </div>
          </section>

          <section id="sizing" className="doc-section anchor-section">
            <SectionHeader eyebrow="Sizing" title="Match size to prominence and density">
              Size is a deliberate component choice. Width is resolved by the
              layout and available container space.
            </SectionHeader>

            <div className="size-table" role="table" aria-label="Button sizes">
              <div className="size-row size-header" role="row">
                <span role="columnheader">Size</span>
                <span role="columnheader">Example</span>
                <span role="columnheader">Use when</span>
              </div>
              <div className="size-row" role="row">
                <b role="cell">M</b>
                <div role="cell">
                  <CoinButton label="Continue" size="M" />
                </div>
                <p role="cell">The action leads a screen, sheet, or key step.</p>
              </div>
              <div className="size-row" role="row">
                <b role="cell">S</b>
                <div role="cell">
                  <CoinButton label="Continue" size="S" />
                </div>
                <p role="cell">The action sits inside a card or compact group.</p>
              </div>
              <div className="size-row" role="row">
                <b role="cell">XS</b>
                <div role="cell">
                  <CoinButton label="Continue" size="XS" />
                </div>
                <p role="cell">
                  Space is dense and the surrounding touch area stays usable.
                </p>
              </div>
            </div>

            <div className="responsive-pair">
              <article>
                <span className="context-label">Wide container</span>
                <div className="wide-action-example">
                  <div>
                    <b>Transfer summary</b>
                    <p>Keep the action close to the content it completes.</p>
                  </div>
                  <CoinButton label="Continue" />
                </div>
              </article>
              <article>
                <span className="context-label">Narrow container</span>
                <div className="narrow-action-example">
                  <div>
                    <b>Transfer summary</b>
                    <p>The same action can fill the available width.</p>
                  </div>
                  <CoinButton label="Continue" fill />
                </div>
              </article>
            </div>
            <p className="system-note">
              Container width resolves the layout. Designers choose the label,
              hierarchy, and size—not a separate “desktop” or “mobile” Button.
            </p>
          </section>

          <section id="content" className="doc-section anchor-section">
            <SectionHeader eyebrow="Content" title="Name the outcome">
              A person should understand what will happen before pressing the
              button.
            </SectionHeader>

            <div className="content-guidance-grid">
              <article className="content-rule content-rule-featured">
                <span>01</span>
                <h3>Lead with a verb</h3>
                <p>
                  Use clear actions such as “Save details”, “Transfer money”, or
                  “View statement”.
                </p>
                <div className="rule-example">
                  <CoinButton label="Save details" />
                </div>
              </article>
              <article className="content-rule">
                <span>02</span>
                <h3>Keep it short</h3>
                <p>
                  Aim for one to three words. Put explanation beside the button,
                  not inside it.
                </p>
              </article>
              <article className="content-rule">
                <span>03</span>
                <h3>Use icons for meaning</h3>
                <p>
                  Add one only when it improves recognition, direction, or the
                  action’s meaning.
                </p>
              </article>
              <article className="content-rule">
                <span>04</span>
                <h3>Be specific</h3>
                <p>
                  Prefer “Pay ₹500” or “Download report” over a vague “OK” when
                  the outcome can be named.
                </p>
              </article>
            </div>
          </section>

          <section id="context" className="doc-section anchor-section">
            <SectionHeader eyebrow="In context" title="Place the action where the decision happens">
              Use surrounding content to explain the choice. Let the button stay
              concise.
            </SectionHeader>

            <div className="context-grid">
              <article className="scenario-card payment-scenario">
                <div className="scenario-topline">
                  <span>Payment summary</span>
                  <b>₹1,250</b>
                </div>
                <div className="scenario-details">
                  <p>From</p>
                  <strong>JioFinance account</strong>
                  <p>Arrives</p>
                  <strong>Immediately</strong>
                </div>
                <CoinButton label="Pay ₹1,250" fill />
                <p className="scenario-caption">
                  Default · M · full available width
                </p>
              </article>

              <article className="scenario-card choice-scenario">
                <div>
                  <span className="context-label">Comparison action</span>
                  <h3>Everyday plan</h3>
                  <p>Flexible access with no lock-in period.</p>
                </div>
                <div className="choice-actions">
                  <CoinButton
                    label="View details"
                    size="S"
                    emphasis="Low"
                    appearance="Neutral"
                  />
                  <CoinButton label="Choose plan" size="S" type="fixed" />
                </div>
                <p className="scenario-caption">
                  The stronger action carries the decision.
                </p>
              </article>

              <article className="scenario-card media-scenario">
                <div className="media-glow glow-one" aria-hidden="true" />
                <div className="media-glow glow-two" aria-hidden="true" />
                <div className="media-content">
                  <span className="context-label">Rich media surface</span>
                  <h3>Track every goal in one view</h3>
                  <CoinButton
                    label="Explore"
                    type="glass"
                    colorMode="Dark"
                    iconPlacement="End"
                  />
                </div>
                <p className="scenario-caption">Glass · backdrop visible</p>
              </article>
            </div>
          </section>

          <section id="dos-donts" className="doc-section anchor-section">
            <SectionHeader eyebrow="Do & Don’ts" title="Protect clarity and hierarchy">
              These pairs show the common choices that make Button easier—or
              harder—to understand.
            </SectionHeader>

            <div className="comparison-stack">
              <div className="comparison-row">
                <article className="comparison-card do-card">
                  <p className="comparison-label">Do</p>
                  <div className="comparison-preview">
                    <CoinButton label="Transfer money" />
                  </div>
                  <h3>Write a short, verb-led label</h3>
                  <p>The outcome is clear before the action is pressed.</p>
                </article>
                <article className="comparison-card dont-card">
                  <p className="comparison-label">Don’t</p>
                  <div className="comparison-preview constrained-preview">
                    <CoinButton label="Click here to transfer your money now" />
                  </div>
                  <h3>Put the explanation inside the button</h3>
                  <p>Long labels are slower to scan and can truncate.</p>
                </article>
              </div>

              <div className="comparison-row">
                <article className="comparison-card do-card">
                  <p className="comparison-label">Do</p>
                  <div className="comparison-preview action-pair">
                    <CoinButton
                      label="Back"
                      appearance="Neutral"
                      emphasis="Low"
                    />
                    <CoinButton label="Continue" />
                  </div>
                  <h3>Make one action strongest</h3>
                  <p>The hierarchy tells people where to go next.</p>
                </article>
                <article className="comparison-card dont-card">
                  <p className="comparison-label">Don’t</p>
                  <div className="comparison-preview action-pair">
                    <CoinButton label="Back" />
                    <CoinButton label="Continue" />
                  </div>
                  <h3>Give competing actions equal emphasis</h3>
                  <p>Two dominant actions make the choice harder to read.</p>
                </article>
              </div>

              <div className="comparison-row">
                <article className="comparison-card do-card">
                  <p className="comparison-label">Do</p>
                  <div className="comparison-preview footer-preview">
                    <CoinButton label="Confirm payment" fill />
                  </div>
                  <h3>Use Default when a footer action fills the container</h3>
                  <p>The layout owns the width while Button keeps its system shape.</p>
                </article>
                <article className="comparison-card dont-card">
                  <p className="comparison-label">Don’t</p>
                  <div className="comparison-preview footer-preview misfit-preview">
                    <CoinButton label="Confirm payment" type="fixed" fill />
                  </div>
                  <h3>Use Fixed as a substitute for a full-width action</h3>
                  <p>Fixed is bounded by the system and will not behave like Fill.</p>
                </article>
              </div>

              <div className="comparison-row">
                <article className="comparison-card do-card glass-comparison">
                  <p className="comparison-label">Do</p>
                  <div className="comparison-preview useful-glass">
                    <span className="glass-art art-one" aria-hidden="true" />
                    <span className="glass-art art-two" aria-hidden="true" />
                    <CoinButton
                      label="Explore"
                      type="glass"
                      colorMode="Dark"
                    />
                  </div>
                  <h3>Use Glass over a visible backdrop</h3>
                  <p>Translucency has a clear relationship with the surface.</p>
                </article>
                <article className="comparison-card dont-card glass-comparison">
                  <p className="comparison-label">Don’t</p>
                  <div className="comparison-preview empty-glass">
                    <CoinButton label="Explore" type="glass" />
                  </div>
                  <h3>Place Glass on a plain, low-contrast surface</h3>
                  <p>The treatment loses its purpose and can become hard to read.</p>
                </article>
              </div>
            </div>
          </section>

          <section id="sources" className="doc-section sources-section anchor-section">
            <SectionHeader eyebrow="Sources" title="Grounded in the published component">
              This guide separates designer choices from behaviour supplied by
              the product at runtime.
            </SectionHeader>

            <div className="sources-grid">
              <a href={FIGMA_URL} target="_blank" rel="noreferrer">
                <span className="source-index">01</span>
                <div>
                  <h3>Coin Components Library</h3>
                  <p>Button component set · node 3574:181</p>
                </div>
                <SmallArrow />
              </a>
              <a href={STORYBOOK_URL} target="_blank" rel="noreferrer">
                <span className="source-index">02</span>
                <div>
                  <h3>Button Storybook</h3>
                  <p>Published examples and behaviour</p>
                </div>
                <SmallArrow />
              </a>
            </div>

            <div className="verification-note">
              <span>Checked 13 September 2026</span>
              <p>
                Live examples use the public Coin Button from
                jfs-components 0.1.60. Hover and pressed feedback are supplied
                by the component; loading uses its shape-preserving skeleton.
              </p>
            </div>
          </section>
        </article>

        <footer>
          <span>Coin designer documentation</span>
          <a href="#overview">Back to top ↑</a>
        </footer>
      </main>
    </div>
  )
}

function App() {
  const actionGuide = getActionGuideFromLocation()
  if (actionGuide === 'actionfooter') {
    return <ActionFooterGuide />
  }
  if (actionGuide === 'actiontile') {
    return <ActionTileGuide />
  }
  if (actionGuide === 'additem') {
    return <AddItemGuide />
  }
  if (isAccordionCheckboxLocation()) {
    return <AccordionCheckboxGuide />
  }
  const layoutGuide = getLayoutGuideFromLocation()
  return layoutGuide ? <LayoutGuidePage guide={layoutGuide} /> : <ButtonGuide />
}

export default App

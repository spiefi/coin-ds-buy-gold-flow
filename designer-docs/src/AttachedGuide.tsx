import {
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  Attached,
  IconCapsule,
  ListItem,
  MoneyValue,
  type AttachedPosition,
  type Modes,
} from 'jfs-components'
import {
  ComponentGuideTemplate,
  type GuideSectionSlots,
} from './ComponentGuideTemplate'

const FIGMA_URL =
  'https://www.figma.com/design/3z7bmhA73Ls7j8Eu4qhYhE/Coin-Components-Library?node-id=4477-471'
const STORYBOOK_URL =
  'https://jfs-components-storybook.vercel.app/?path=/docs/components-attached--docs'
const POSITIONS: readonly AttachedPosition[] = [
  'top-left',
  'top',
  'top-right',
  'left',
  'center',
  'right',
  'bottom-left',
  'bottom',
  'bottom-right',
]

const lightModes: Modes = { 'Color Mode': 'Light' } as Modes
const mainIconModes: Modes = { ...lightModes, 'Icon Capsule Size': 'M' } as Modes
const badgeIconModes: Modes = { ...lightModes, 'Icon Capsule Size': 'XS' } as Modes

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
  display = (option) => option,
}: {
  label: string
  value: T
  options: readonly T[]
  onChange: (value: T) => void
  display?: (value: T) => string
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
            {display(option)}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

function AttachedMark({
  position = 'bottom-right',
  circular = true,
  showBadge = true,
  badgeSizeMode = 'XS',
  mainIcon = 'ic_cart',
  badgeIcon = 'ic_rupee',
}: {
  position?: AttachedPosition
  circular?: boolean
  showBadge?: boolean
  badgeSizeMode?: 'XS' | 'M'
  mainIcon?: string
  badgeIcon?: string
}) {
  return (
    <Attached
      position={position}
      circular={circular}
      modes={lightModes}
      badge={
        showBadge ? (
          <IconCapsule
            iconName={badgeIcon}
            modes={badgeSizeMode === 'M' ? mainIconModes : badgeIconModes}
            accessibilityLabel="Attached secondary signal"
          />
        ) : undefined
      }
    >
      <IconCapsule
        iconName={mainIcon}
        modes={mainIconModes}
        accessibilityLabel="Main item"
      />
    </Attached>
  )
}

function AttachedAnatomy() {
  return (
    <figure className="coin-attached-anatomy-figure">
      <div className="coin-attached-anatomy-live">
        <div className="coin-attached-anatomy-specimen">
          <div className="coin-attached-anatomy-component"><AttachedMark /></div>
          <svg className="coin-attached-anatomy-leaders" viewBox="0 0 200 130" preserveAspectRatio="none" aria-hidden="true">
            <line x1="48" y1="42" x2="79" y2="56" />
            <line x1="151" y1="74" x2="115" y2="80" />
          </svg>
          <span className="coin-attached-anatomy-pin coin-attached-pin-main">1</span>
          <span className="coin-attached-anatomy-pin coin-attached-pin-badge">2</span>
          <span className="coin-attached-anatomy-label coin-attached-label-main">Main bounds</span>
          <span className="coin-attached-anatomy-label coin-attached-label-badge">Attachment anchor / ring</span>
        </div>
      </div>
      <figcaption>The markers sit beside the fixed specimen and explain the rendered main and badge slots.</figcaption>
    </figure>
  )
}

function PositionGrid({ circular = true }: { circular?: boolean }) {
  return (
    <div className="coin-attached-position-grid">
      {POSITIONS.map((position) => (
        <div className="coin-attached-position-cell" key={position}>
          <AttachedMark position={position} circular={circular} />
          <span>{position}</span>
        </div>
      ))}
    </div>
  )
}

function ContextExample() {
  return (
    <div className="coin-attached-context">
      <ListItem
        layout="Horizontal"
        title="Card payment"
        supportText="Today · Food"
        leading={<AttachedMark />}
        trailing={<MoneyValue value="500" currency="₹" modes={lightModes} accessibilityLabel="500 rupees" />}
        navArrow={false}
        modes={lightModes}
        accessibilityLabel="Card payment, today, food, 500 rupees"
        style={{ width: '100%' }}
      />
      <p className="coin-attached-context-status">A small secondary signal stays attached to the item it qualifies.</p>
    </div>
  )
}

function ComparisonPreview({ kind }: { kind: 'clear' | 'obstructed' | 'room' | 'clipped' | 'compact' | 'competing' }) {
  if (kind === 'room' || kind === 'clipped') {
    return (
      <div className="coin-attached-host">
        <div className={`coin-attached-host-frame ${kind === 'clipped' ? 'is-clipped' : ''}`}>
          <AttachedMark />
        </div>
        {kind === 'clipped' && <span className="coin-attached-host-label">Clipped by host</span>}
      </div>
    )
  }
  return (
    <div className="coin-attached-comparison-mark">
      <AttachedMark
        position={kind === 'obstructed' ? 'center' : 'bottom-right'}
        badgeSizeMode={kind === 'competing' ? 'M' : 'XS'}
        mainIcon={kind === 'compact' ? 'ic_card' : 'ic_cart'}
      />
    </div>
  )
}

function ComparisonPair({
  lesson,
  good,
  bad,
  goodTitle,
  badTitle,
  goodCopy,
  badCopy,
}: {
  lesson: string
  good: 'clear' | 'room' | 'compact'
  bad: 'obstructed' | 'clipped' | 'competing'
  goodTitle: string
  badTitle: string
  goodCopy: string
  badCopy: string
}) {
  return (
    <div className="comparison-row coin-attached-comparison-row">
      <article className="comparison-card do-card">
        <p className="comparison-label">Do</p>
        <div className="comparison-preview coin-attached-comparison-preview">
          <ComparisonPreview kind={good} />
        </div>
        <h3>{goodTitle}</h3>
        <p>{goodCopy}</p>
      </article>
      <article className="comparison-card dont-card">
        <p className="comparison-label">Don’t</p>
        <div className="comparison-preview coin-attached-comparison-preview">
          <ComparisonPreview kind={bad} />
        </div>
        <h3>{badTitle}</h3>
        <p>{badCopy}</p>
      </article>
      <p className="coin-attached-comparison-lesson">{lesson}</p>
    </div>
  )
}

export function AttachedGuide() {
  const [position, setPosition] = useState<AttachedPosition>('bottom-right')
  const [circular, setCircular] = useState(true)
  const [showBadge, setShowBadge] = useState(true)

  const sections: GuideSectionSlots = useMemo(
    () => ({
      anatomy: {
        header: 'Anatomy',
        title: 'A small signal stays attached to its main item',
        description:
          'Attached keeps a subordinate badge connected to the content it qualifies. The badge can straddle an edge or corner without changing the main item’s layout footprint.',
        body: (
          <div className="anatomy-card coin-attached-anatomy-card">
            <div className="anatomy-stage coin-attached-anatomy-stage">
              <AttachedAnatomy />
            </div>
            <ol className="anatomy-list">
              <li><b>Main bounds</b><span>The child in the main slot establishes the size and the visual object people identify first.</span></li>
              <li><b>Attachment</b><span>The badge slot is centered on the selected anchor and can straddle the main edge.</span></li>
              <li><b>Anchor / ring</b><span>Position chooses one of nine anchors; the token ring separates a compact signal from the main mark.</span></li>
              <li><b>Host slack</b><span>Leave whitespace around the composition because the badge can extend beyond the main bounds.</span></li>
            </ol>
          </div>
        ),
      },
      configuration: {
        header: 'Configuration',
        title: 'Choose the anchor and corner relationship',
        description:
          'Use the exposed position choices for where the badge belongs. For diagonal anchors, choose the round child’s edge or its bounding-box corner.',
        body: (
          <div className="coin-attached-configuration-stack">
            <article className="configuration-block coin-attached-config-card">
              <p className="eyebrow">Nine positions</p>
              <h3>Place the signal where it belongs</h3>
              <PositionGrid />
              <p>Use edge or corner anchors when the badge describes the item. A center anchor is reserved for a deliberate overlay.</p>
            </article>
            <article className="configuration-block coin-attached-config-card">
              <p className="eyebrow">Corner geometry</p>
              <h3>Choose the corner anchor</h3>
              <div className="coin-attached-corner-pair">
                <div><AttachedMark circular={false} /><span>Bounding box</span></div>
                <div><AttachedMark circular /><span>Circle edge</span></div>
              </div>
              <p>The child stays a native circular capsule in both examples. Corner projection changes only the badge anchor: use Circle edge for round marks and Bounding box for a square corner relationship.</p>
            </article>
          </div>
        ),
      },
      states: {
        header: 'States',
        title: 'The composition state belongs to its children',
        description:
          'Attached has no loading or disabled state of its own. Show whether a supporting signal is present through its children.',
        body: (
          <div className="coin-attached-state-stack">
            <article className="coin-attached-state-card">
              <div className="coin-attached-state-preview"><AttachedMark /></div>
              <h3>Badge present</h3>
              <p>The secondary signal remains visible while the main item keeps its own identity.</p>
            </article>
            <article className="coin-attached-state-card">
              <div className="coin-attached-state-preview"><AttachedMark showBadge={false} /></div>
              <h3>Badge absent</h3>
              <p>Use the same composition when there is no subordinate status or action to show.</p>
            </article>
          </div>
        ),
      },
      sizing: {
        header: 'Sizing',
        title: 'Make room for the part that overhangs',
        description:
          'The main child owns its intrinsic size. Attached does not grow the layout footprint for the badge, so its host needs enough whitespace for the overhang.',
        body: (
          <div className="coin-attached-sizing-stack">
            <article className="coin-attached-sizing-card">
              <div className="coin-attached-sizing-host is-roomy"><AttachedMark /></div>
              <strong>Roomy host</strong>
              <span>Whitespace keeps the edge signal clear.</span>
            </article>
          </div>
        ),
      },
      content: {
        header: 'Content',
        title: 'Keep the attachment subordinate',
        description:
          'Use a compact, meaningful signal that clarifies the main item. The badge should not carry the primary label or become a second focal point.',
        body: (
          <div className="content-guidance-grid coin-attached-content-grid">
            <article className="content-rule content-rule-featured">
              <span aria-hidden="true">01</span>
              <h3>Make the main item readable first</h3>
              <p>The badge adds a small qualification such as payment type or status while the central mark remains easy to recognize.</p>
              <div className="rule-example"><AttachedMark /></div>
            </article>
            <article className="content-rule"><span aria-hidden="true">02</span><h3>Use a short secondary meaning</h3><p>Choose a familiar icon or small signal that people can understand at a glance.</p></article>
            <article className="content-rule"><span aria-hidden="true">03</span><h3>Reserve the center</h3><p>A centered badge covers the main mark, so use it only when the overlay itself is the intended message.</p></article>
          </div>
        ),
      },
      context: {
        header: 'In context',
        title: 'Attach a qualifier to a real list item',
        description:
          'A payment row keeps the qualifier next to the item it describes.',
        body: <ContextExample />,
      },
      'dos-donts': {
        header: 'Do & Don’ts',
        title: 'Let the signal support the item',
        description:
          'Each comparison shows a visible consequence of treating the attachment as supporting information.',
        body: (
          <div className="comparison-stack coin-attached-comparison-stack">
            <ComparisonPair lesson="The main mark remains the first thing people can identify." good="clear" bad="obstructed" goodTitle="Keep the center clear" badTitle="Cover the main mark" goodCopy="Anchor a small badge to the edge when the main icon carries the identity." badCopy="A centered badge obscures the item it is meant to qualify." />
            <ComparisonPair lesson="The host needs space beyond the main bounds." good="room" bad="clipped" goodTitle="Allow the overhang" badTitle="Clip the host" goodCopy="Leave slack around the composition so the badge can straddle the edge." badCopy="Overflow hidden turns a positioning choice into a visibly cut-off signal." />
            <ComparisonPair lesson="Secondary signals should stay visually lighter than the main item." good="compact" bad="competing" goodTitle="Keep the badge compact" badTitle="Make the badge compete" goodCopy="Use a small, familiar symbol for supporting information." badCopy="An oversized attachment pulls focus away from the main item." />
          </div>
        ),
      },
      sources: {
        header: 'Sources',
        title: 'Grounded in the public attachment contract',
        description:
          'This guide uses the published Attached API, the Coin Components Library node, and the canonical Storybook fixtures.',
        body: (
          <>
            <div className="sources-grid">
              <a href={FIGMA_URL} target="_blank" rel="noreferrer"><span className="source-index">01</span><div><h3>Coin Components Library</h3><p>Attached component set · node 4477:471</p></div><SmallArrow /></a>
              <a href={STORYBOOK_URL} target="_blank" rel="noreferrer"><span className="source-index">02</span><div><h3>Attached Storybook</h3><p>Default, all positions, corner, and capsule badge stories</p></div><SmallArrow /></a>
            </div>
            <div className="verification-note"><span>Checked 22 September 2026</span><p>Examples use public <code>Attached</code> and <code>IconCapsule</code> exports from <code>jfs-components</code> 0.1.60. The package source defaults <code>circular</code> to <code>true</code>, while its JSDoc says <code>false</code>; the guide uses the actual runtime default when omitted and exposes the supported choice. Badge placement waits for layout measurement, and the badge does not expand the parent layout footprint. The capsule story enlarges its children with style dimensions; this guide uses the native Icon Capsule Size modes M and XS so both child capsules keep their component-owned circular geometry.</p></div>
            <div className="coin-attached-source-links"><SourceLink href="https://jfs-components-storybook.vercel.app/iframe.html?id=components-attached--capsule-badge&viewMode=story">Open capsule badge story</SourceLink><SourceLink href="https://jfs-components-storybook.vercel.app/iframe.html?id=components-attached--all-positions&viewMode=story">Open all positions story</SourceLink></div>
          </>
        ),
      },
    }),
    [],
  )

  return (
    <ComponentGuideTemplate
      metadata={{
        slug: 'attached',
        name: 'Attached',
        summary: 'Add a subordinate signal to a main item without altering its footprint.',
        corePrinciple: 'Attachment supports the item, never obscures it.',
        figmaUrl: FIGMA_URL,
        storybookUrl: STORYBOOK_URL,
      }}
      playground={
        <>
          <div className="preview-stage coin-attached-preview-stage">
            <div className="coin-attached-preview-host"><AttachedMark position={position} circular={circular} showBadge={showBadge} /></div>
            <p className="preview-note" aria-live="polite">{showBadge ? `${position} attachment` : 'Main item without a badge'}</p>
            <span className="stage-label">Live Coin Attached · Light</span>
          </div>
          <div className="controls-panel coin-attached-controls-panel">
            <label className="text-control"><span>Anchor position</span><select value={position} onChange={(event) => setPosition(event.target.value as AttachedPosition)}>{POSITIONS.map((option) => <option key={option}>{option}</option>)}</select></label>
            <Segment label="Corner projection" value={circular ? 'Circle edge' : 'Bounding box'} options={['Circle edge', 'Bounding box'] as const} onChange={(value) => setCircular(value === 'Circle edge')} />
            <label className="toggle-row"><input type="checkbox" checked={showBadge} onChange={(event) => setShowBadge(event.target.checked)} /><span className="toggle-track" /> Show badge</label>
            <div className="coin-attached-readout" aria-live="polite"><span>Configured example</span><strong>{position} · {circular ? 'circle edge' : 'bounding box'} anchor</strong><p>The child stays circular; this choice changes the corner anchor.</p></div>
          </div>
        </>
      }
      sections={sections}
    />
  )
}

export default AttachedGuide

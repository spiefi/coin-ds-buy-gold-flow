import { useState } from 'react'
import { Badge, Card, HStack, Icon, SkeletonGroup, Text, type Modes } from 'jfs-components'
import { ComponentGuideTemplate, type GuideSectionSlots } from './ComponentGuideTemplate'
import { GuideAnatomy, GuideDoDont, GuideExampleCard, GuideSegment, GuideSources } from './NewGuideShared'
import glassImage from './assets/bank-hero.png'

const FIGMA = 'https://www.figma.com/design/3z7bmhA73Ls7j8Eu4qhYhE/Coin-Components-Library?node-id=5607-5484'
const STORYBOOK = 'https://jfs-components-storybook.vercel.app/?path=/docs/components-badge--docs'
type Size = 'Medium' | 'Small'
type Intent = 'Brand' | 'System'
type BrandTone = 'Primary' | 'Secondary' | 'Neutral' | 'Tertiary'
type SystemMeaning = 'positive' | 'warning' | 'negative'
type Emphasis = 'High' | 'Medium' | 'Low'
type Treatment = 'Solid' | 'Glass'

function badgeModes({ size = 'Medium', intent = 'Brand', brandTone = 'Primary', systemMeaning = 'positive', emphasis = 'High', treatment = 'Solid' }: {
  size?: Size; intent?: Intent; brandTone?: BrandTone; systemMeaning?: SystemMeaning; emphasis?: Emphasis; treatment?: Treatment
} = {}): Modes {
  return {
    'Color Mode': 'Light',
    'Badge Size': size,
    'Semantic Intent': intent,
    AppearanceBrand: brandTone,
    AppearanceSystem: systemMeaning,
    Emphasis: emphasis,
    Context4: treatment === 'Glass' ? 'Badge/glass' : 'Badge',
  } as Modes
}

function CoinBadge({ label, size, intent, brandTone, systemMeaning, emphasis, treatment = 'Solid', leading = false, loading = false, onPress, testID }: {
  label: string; size?: Size; intent?: Intent; brandTone?: BrandTone; systemMeaning?: SystemMeaning; emphasis?: Emphasis; treatment?: Treatment; leading?: boolean; loading?: boolean; onPress?: () => void; testID?: string
}) {
  const modes = badgeModes({ size, intent, brandTone, systemMeaning, emphasis, treatment })
  return <div className="coin-badge-specimen"><SkeletonGroup loading={loading}><Badge
    label={label} type={treatment === 'Glass' ? 'glass' : 'default'} modes={modes} loading={loading} onPress={onPress} testID={testID}
    leading={leading ? <Icon iconName="ic_card" modes={modes} accessibilityElementsHidden importantForAccessibility="no" /> : undefined}
  /></SkeletonGroup></div>
}

function GlassScene({ children, preview = false }: { children: React.ReactNode; preview?: boolean }) {
  return <div className={`coin-badge-glass-scene${preview ? ' coin-badge-preview-scene' : ''}`} style={{ backgroundImage: `url(${glassImage})` }}>{children}</div>
}

export function BadgeGuide() {
  const [label, setLabel] = useState('New')
  const [treatment, setTreatment] = useState<Treatment>('Solid')
  const [leading, setLeading] = useState(false)
  const [size, setSize] = useState<Size>('Medium')
  const [intent, setIntent] = useState<Intent>('Brand')
  const [brandTone, setBrandTone] = useState<BrandTone>('Primary')
  const [systemMeaning, setSystemMeaning] = useState<SystemMeaning>('positive')
  const [emphasis, setEmphasis] = useState<Emphasis>('High')
  const [actionStatus, setActionStatus] = useState('No detail opened')
  const sections: GuideSectionSlots = {
    anatomy: {
      header: 'Anatomy', title: 'A compact signal',
      description: 'A leading cue, short label, and token-owned surface form one compact message.',
      body: <GuideAnatomy targets={[
        { selector: '[data-testid="badge-anatomy"] > div:first-child', label: 'Leading visual', description: 'Adds a recognizable cue without replacing the words.', anchorX: 0, anchorY: .5, side: 'left' },
        { selector: '[data-testid="badge-anatomy"] [dir="auto"]', label: 'Label', description: 'Names the status or category.', anchorX: .5, anchorY: 0, side: 'top' },
        { selector: '[data-testid="badge-anatomy"]', label: 'Surface', description: 'Groups the message into one compact shape.', anchorX: 1, anchorY: .5, side: 'right' },
      ]}><CoinBadge label="Paid" leading testID="badge-anatomy" /></GuideAnatomy>,
    },
    configuration: {
      header: 'Configuration', title: 'Choose treatment and meaning',
      description: 'Use a solid Badge beside ordinary content. Use glass where the underlying image or surface remains part of the composition.',
      body: <div className="coin-new-stack"><div className="coin-new-example-grid">
        <GuideExampleCard title="Solid"><CoinBadge label="Paid" /></GuideExampleCard>
        <GuideExampleCard title="Glass"><GlassScene><CoinBadge label="Paid" treatment="Glass" /></GlassScene></GuideExampleCard>
      </div><div className="coin-new-example-grid three">
        <GuideExampleCard title="Positive"><CoinBadge label="Paid" intent="System" systemMeaning="positive" /></GuideExampleCard>
        <GuideExampleCard title="Warning"><CoinBadge label="Due today" intent="System" systemMeaning="warning" /></GuideExampleCard>
        <GuideExampleCard title="Negative"><CoinBadge label="Failed" intent="System" systemMeaning="negative" /></GuideExampleCard>
      </div></div>,
    },
    states: {
      header: 'States', title: 'Content, action, and loading',
      description: 'Most badges communicate information. Add an action only when opening related detail is useful. Loading shows that the value is still arriving.',
      body: <div className="coin-new-example-grid three">
        <GuideExampleCard title="Informational"><CoinBadge label="New" /></GuideExampleCard>
        <GuideExampleCard title="Action"><CoinBadge label="View details" onPress={() => setActionStatus('Details opened')} /><p className="coin-new-readout" role="status">{actionStatus}</p></GuideExampleCard>
        <GuideExampleCard title="Loading"><CoinBadge label="Upcoming" loading /></GuideExampleCard>
      </div>,
    },
    sizing: {
      header: 'Sizing', title: 'Content determines the width',
      description: 'Choose the size for the surrounding density. Keep the label short so the Badge remains a compact companion.',
      body: <div className="coin-new-example-grid"><GuideExampleCard title="Small and Medium"><CoinBadge label="New" size="Small" /><CoinBadge label="New" size="Medium" /></GuideExampleCard><GuideExampleCard title="Short and long"><CoinBadge label="Paid" /><CoinBadge label="Payment pending" /></GuideExampleCard></div>,
    },
    content: {
      header: 'Content', title: 'Write the status, not a sentence',
      description: 'Use familiar words. Keep tense and capitalization consistent across the same set.',
      body: <div className="coin-new-content-list"><CoinBadge label="Paid" /><CoinBadge label="Due today" /><CoinBadge label="3 new" /></div>,
    },
    context: {
      header: 'In context', title: 'Keep status beside its subject',
      description: 'Place the compact status next to the item it describes.',
      body: <div className="coin-new-context"><Card variant="slim" modes={{ 'Color Mode': 'Light' } as Modes}><HStack alignVertical="center" justifyHorizontal="space-between" modes={{ 'Color Mode': 'Light' } as Modes}><Text>September payment</Text><CoinBadge label="Paid" intent="System" systemMeaning="positive" /></HStack></Card></div>,
    },
    'dos-donts': {
      header: 'Do & Don’ts', title: 'Make status clear at a glance',
      description: 'Keep labels concise, match their meaning, and establish a clear priority.',
      body: <div className="coin-new-stack">
        <GuideDoDont good={<CoinBadge label="Paid" />} bad={<CoinBadge label="Payment successfully completed" />} goodTitle="Use a short status" badTitle="Avoid a sentence inside the Badge" goodCaption="Keep the status concise." badCaption="Avoid putting the whole explanation inside the Badge." />
        <GuideDoDont good={<div className="coin-new-content-list"><CoinBadge label="Paid" intent="System" systemMeaning="positive" /><CoinBadge label="Failed" intent="System" systemMeaning="negative" /></div>} bad={<div className="coin-new-content-list"><CoinBadge label="Paid" intent="System" systemMeaning="negative" /><CoinBadge label="Failed" intent="System" systemMeaning="positive" /></div>} goodTitle="Match meaning and tone" badTitle="Avoid contradictory signals" goodCaption="Use semantic treatment that agrees with the status." badCaption="Conflicting words and tone make the status harder to trust." />
        <GuideDoDont good={<div className="coin-new-content-list"><CoinBadge label="Failed" intent="System" systemMeaning="negative" emphasis="High" /><CoinBadge label="Archived" brandTone="Neutral" emphasis="Low" /></div>} bad={<div className="coin-new-content-list"><CoinBadge label="Failed" intent="System" systemMeaning="negative" emphasis="High" /><CoinBadge label="Archived" brandTone="Neutral" emphasis="High" /></div>} goodTitle="Reserve strong emphasis" badTitle="Avoid equal emphasis everywhere" goodCaption="Give the status needing attention the strongest emphasis." badCaption="If every status competes, the urgent one is harder to find." />
        <GuideDoDont good={<div className="coin-new-content-list"><CoinBadge label="Paid" /><CoinBadge label="Pending" /><CoinBadge label="Failed" /></div>} bad={<div className="coin-new-content-list"><CoinBadge label="Paid" /><CoinBadge label="Awaiting payment processing" /><CoinBadge label="FAILURE" /></div>} goodTitle="Use a consistent vocabulary" badTitle="Avoid mixed label styles" goodCaption="Keep comparable statuses similar in length and capitalization." badCaption="Mixed wording and capitalization slow scanning." />
      </div>,
    },
    sources: {
      header: 'Sources', title: 'Use the public Badge contract',
      description: 'The guide compares the published designer properties with package behavior and canonical examples.',
      body: <GuideSources figmaUrl={FIGMA} storybookUrl={STORYBOOK} stories={[
        { label: 'Default', id: 'components-badge--default' }, { label: 'Glass', id: 'components-badge--glass' }, { label: 'Interactive', id: 'components-badge--interactive' }, { label: 'Sizes', id: 'components-badge--sizes' }, { label: 'System', id: 'components-badge--system' },
      ]} note={<>Declared, installed, and current registry <code>jfs-components</code> versions are <code>0.1.60</code>. Badge exposes Default and Glass treatments, optional leading content, size and semantic modes, action, and loading. The Figma glass master’s selected Context4 mode could not be resolved from the returned live collection; the package includes <code>Badge/glass</code>. The package currently ignores the supplied <code>accessibilityLabel</code> on Badge; rely on visible text and verify the resulting accessible name for an action.</>} />,
    },
  }

  return <ComponentGuideTemplate metadata={{
    slug: 'badge', name: 'Badge',
    summary: 'Use a Badge to make a short status, category, or count easy to scan beside the content it describes.',
    corePrinciple: 'Say one thing, in a few words. Let the label carry the meaning and use emphasis to establish priority.',
    figmaUrl: FIGMA, storybookUrl: STORYBOOK,
  }} playground={<>
    <div className="preview-stage coin-badge-preview-stage">
      {treatment === 'Glass' ? <GlassScene preview><CoinBadge label={label || 'New'} treatment={treatment} leading={leading} size={size} intent={intent} brandTone={brandTone} systemMeaning={systemMeaning} emphasis={emphasis} /></GlassScene> : <CoinBadge label={label || 'New'} treatment={treatment} leading={leading} size={size} intent={intent} brandTone={brandTone} systemMeaning={systemMeaning} emphasis={emphasis} />}
      <span className="stage-label">Live Coin Badge</span>
    </div>
    <div className="controls-panel">
      <label className="text-control"><span>Label</span><input value={label} onChange={event => setLabel(event.target.value)} maxLength={32} /></label>
      <GuideSegment label="Treatment" value={treatment} options={['Solid', 'Glass']} onChange={setTreatment} />
      <GuideSegment label="Leading icon" value={leading ? 'On' : 'Off'} options={['Off', 'On'] as const} onChange={value => setLeading(value === 'On')} />
      <GuideSegment label="Size" value={size} options={['Medium', 'Small']} onChange={setSize} />
      {treatment === 'Solid' && <GuideSegment label="Intent" value={intent} options={['Brand', 'System']} onChange={setIntent} />}
      {treatment === 'Solid' && (intent === 'Brand' ? <GuideSegment label="Brand tone" value={brandTone} options={['Primary', 'Secondary', 'Neutral', 'Tertiary']} onChange={setBrandTone} /> : <GuideSegment label="System meaning" value={systemMeaning} options={['positive', 'warning', 'negative']} onChange={setSystemMeaning} />)}
      {treatment === 'Solid' && <GuideSegment label="Emphasis" value={emphasis} options={['High', 'Medium', 'Low']} onChange={setEmphasis} />}
    </div>
  </>} sections={sections} />
}

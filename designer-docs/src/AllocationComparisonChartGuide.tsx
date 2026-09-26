import {
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  AllocationComparisonChart,
  Card,
  type AllocationSegment,
  type Modes,
} from 'jfs-components'
import {
  ComponentGuideTemplate,
  type GuideSectionSlots,
} from './ComponentGuideTemplate'
import { Anatomy, Segment, Sources, docsUrl } from './guide-kit'

const FIGMA_URL =
  'https://www.figma.com/design/3z7bmhA73Ls7j8Eu4qhYhE/Coin-Components-Library?node-id=4976-1080'
const STORYBOOK_URL = docsUrl('allocationcomparisonchart')
const ALLOCATION_STORIES = [
  { label: 'Open default story', id: 'components-allocationcomparisonchart--default' },
  { label: 'Open no-baseline story', id: 'components-allocationcomparisonchart--no-baseline' },
]
const CHART_MODES: Modes = {
  'Color Mode': 'Light',
  'Appearance / DataViz': 'Primary',
  'Emphasis / DataViz': 'High',
} as Modes

// AllocationComparisonChart exposes no testID; these follow its public render
// order: legend row, then [role="img"] > bar columns > [value, pillar, label].
const FIRST_COLUMN = '[role="img"] > div:first-child'
const FIRST_PILLAR = `${FIRST_COLUMN} > div:nth-child(2)`

type Preset = 'allocation' | 'current-only'
type Scale = 'auto' | 'fixed'
type AllocationVariant = 'default' | 'rescaled'

function allocationData(preset: Preset, showReference: boolean, showMarker: boolean, longLabels = false, variant: AllocationVariant = 'default'): AllocationSegment[] {
  const labels = longLabels ? ['Small and mid-capital holdings', 'Large-capital holdings', 'Other diversified holdings'] : ['Small & Mid', 'Large', 'Others']
  const values = variant === 'rescaled' ? [90, 7, 3] : [65, 25, 10]
  return [
    { label: labels[0], value: values[0], ...(showReference ? { baseline: 35, showMarker } : {}) },
    { label: labels[1], value: values[1] },
    { label: labels[2], value: values[2] },
  ].map((segment) => preset === 'current-only' ? { ...segment, baseline: undefined, showMarker: undefined } : segment)
}

function AllocationExample({
  preset = 'allocation',
  showReference = true,
  showMarker = true,
  scale = 'fixed',
  height = 154,
  longLabels = false,
  variant = 'default',
  showLegend = true,
}: {
  preset?: Preset
  showReference?: boolean
  showMarker?: boolean
  scale?: Scale
  height?: number
  longLabels?: boolean
  variant?: AllocationVariant
  showLegend?: boolean
}) {
  const data = useMemo(() => allocationData(preset, showReference, showMarker, longLabels, variant), [preset, showReference, showMarker, longLabels, variant])
  return <div className="coin-allocation-chart-example" data-coin-example="allocation-comparison-chart"><AllocationComparisonChart data={data} max={scale === 'fixed' ? 100 : undefined} height={height} showLegend={showLegend} modes={CHART_MODES} accessibilityLabel={`${preset} allocation comparison chart`} style={{ width: '100%' }} /><p className="coin-allocation-chart-scale">{scale === 'fixed' ? 'Shared 0–100 scale' : 'Automatic scale from supplied values'}</p></div>
}

function AllocationAnatomy() {
  return (
    <Anatomy
      title="Allocation Comparison Chart"
      specimenWidth={320}
      scale={1}
      parts={[
        { name: 'Legend', note: 'Current and Recommended explain the two readings when a baseline exists.', target: 'div:has(+ [role="img"])', side: 'top', at: 0.25 },
        { name: 'Current pillar', note: 'The main bar height encodes each supplied value.', target: FIRST_PILLAR, side: 'left', at: 0.1 },
        { name: 'Baseline overlay', note: 'A supplied recommendation overlays the same category from the bottom.', target: `${FIRST_PILLAR} > div:first-child`, side: 'left', at: 0.8 },
        { name: 'Marker', note: 'Keep the dashed callout focused on the first reference unless another marker is needed.', target: '[role="img"] svg', side: 'left' },
        { name: 'Category label', note: 'Use short distinct names that stay readable below the bars.', target: `${FIRST_COLUMN} > div:last-child`, side: 'bottom' },
      ]}
    >
      <AllocationComparisonChart data={allocationData('allocation', true, true)} max={100} height={154} showLegend modes={CHART_MODES} accessibilityLabel="allocation allocation comparison chart" style={{ width: '100%' }} />
    </Anatomy>
  )
}

function ContextExample() {
  return <div className="coin-allocation-context"><Card modes={{ 'Color Mode': 'Light', AppearanceBrand: 'Neutral' } as Modes} style={{ width: '100%' }}><Card.Title>Portfolio allocation</Card.Title><Card.SupportText>Current mix compared with the recommended reference</Card.SupportText><AllocationExample height={138} /></Card><p>Use the chart beside a summary that explains what the categories mean.</p></div>
}

function ComparisonPair({ good, bad, goodTitle, badTitle, goodCopy, badCopy }: { good: ReactNode; bad: ReactNode; goodTitle: string; badTitle: string; goodCopy: string; badCopy: string }) {
  return <div className="comparison-row coin-allocation-comparison-row"><article className="comparison-card do-card"><p className="comparison-label">Do</p><div className="comparison-preview coin-allocation-comparison-preview">{good}</div><h3>{goodTitle}</h3><p>{goodCopy}</p></article><article className="comparison-card dont-card"><p className="comparison-label">Don’t</p><div className="comparison-preview coin-allocation-comparison-preview">{bad}</div><h3>{badTitle}</h3><p>{badCopy}</p></article></div>
}

export function AllocationComparisonChartGuide() {
  const [preset, setPreset] = useState<Preset>('allocation')
  const [showReference, setShowReference] = useState(true)
  const [showMarker, setShowMarker] = useState(true)
  const [scale, setScale] = useState<Scale>('fixed')
  const [height, setHeight] = useState(154)
  const [heightInput, setHeightInput] = useState('154')

  const handleHeightInput = (value: string) => {
    setHeightInput(value)
    const nextHeight = Number(value)
    if (value.trim() !== '' && Number.isFinite(nextHeight) && nextHeight >= 0) {
      setHeight(nextHeight)
    }
  }

  const normalizeHeightInput = () => {
    const nextHeight = Number(heightInput)
    if (heightInput.trim() === '' || !Number.isFinite(nextHeight) || nextHeight < 0) {
      setHeightInput(String(height))
      return
    }
    setHeight(nextHeight)
    setHeightInput(String(nextHeight))
  }

  const sections: GuideSectionSlots = {
    anatomy: { header: 'Anatomy', title: 'Current values and references share one visual scale', description: 'The chart combines a current pillar, optional baseline overlay, legend, marker, and category label. The shared scale lets people compare categories directly.', body: <AllocationAnatomy /> },
    configuration: { header: 'Configuration', title: 'Show the reference only when it answers a question', description: 'Use the data, reference, marker, shared max, and any nonnegative bar-area height to establish a comparison that people can read.', body: <div className="coin-allocation-configuration-stack"><article className="configuration-block coin-allocation-config-card"><p className="eyebrow">With reference</p><h3>Compare current and recommended</h3><AllocationExample showReference showMarker height={154} /><p>A recommended value appears only when the data includes a baseline.</p></article><article className="configuration-block coin-allocation-config-card"><p className="eyebrow">Current only</p><h3>Keep a simple distribution</h3><AllocationExample preset="current-only" showReference={false} showMarker={false} height={154} /><p>Omit the reference when the page only needs current category amounts.</p></article><article className="configuration-block coin-allocation-config-card"><p className="eyebrow">Plot height</p><h3>Give the comparison enough room</h3><AllocationExample height={220} /><p>The default bar area is 154px; choose any nonnegative numeric height when the host needs more or less room. Labels and legend add to the total chart height.</p></article></div> },
    states: { header: 'States', title: 'Let the data decide whether comparison appears', description: 'The chart has no selected or pressed state. Its meaningful visual difference is whether the supplied segments include a baseline and whether the marker is shown.', body: <div className="coin-allocation-state-stack"><article className="coin-allocation-state-card"><p className="eyebrow">Without reference</p><AllocationExample preset="current-only" showReference={false} showMarker={false} /><p>Current bars stand on their own when there is no recommendation.</p></article><article className="coin-allocation-state-card"><p className="eyebrow">With reference</p><AllocationExample showReference showMarker /><p>The legend and first marker explain the additional reading.</p></article></div> },
    sizing: { header: 'Sizing', title: 'Keep bars and labels inside the same host', description: 'The host supplies width, the chart owns the bar width token, and height sets the bar area. 154px is the default; narrow hosts need short category names and a shared scale.', body: <div className="coin-allocation-sizing-stack"><article className="coin-allocation-sizing-card"><div className="coin-allocation-sizing-host is-wide"><AllocationExample height={180} /></div><strong>Wide host</strong><span>Use a consistent max when categories are compared across a summary.</span></article><article className="coin-allocation-sizing-card"><div className="coin-allocation-sizing-host is-narrow"><AllocationExample height={130} /></div><strong>Narrow host</strong><span>Keep labels short enough to sit below their own bars.</span></article></div> },
    content: { header: 'Content', title: 'Name categories and use one shared scale', description: 'Category labels carry meaning below the bar. The legend and values should use the same unit and comparison frame.', body: <div className="content-guidance-grid coin-allocation-content-grid"><article className="content-rule content-rule-featured"><span aria-hidden="true">01</span><h3>Use meaningful categories</h3><p>Short, distinct labels help people map each value to the right category.</p><div className="rule-example"><AllocationExample height={132} /></div></article><article className="content-rule"><span aria-hidden="true">02</span><h3>Explain the reference</h3><p>Keep the recommended legend when a baseline changes the decision.</p></article><article className="content-rule"><span aria-hidden="true">03</span><h3>Keep units consistent</h3><p>Percentages, amounts, or another unit should share one max and format.</p></article></div> },
    context: { header: 'In context', title: 'Place the comparison beside its summary', description: 'A Card can provide the portfolio label and explanation while the chart owns the category comparison.', body: <ContextExample /> },
    'dos-donts': { header: 'Do & Don’ts', title: 'Make the reference and scale easy to trust', description: 'The visual pairs use real chart data and show the consequence of changing the comparison frame.', body: <div className="comparison-stack coin-allocation-comparison-stack"><ComparisonPair good={<AllocationExample scale="fixed" height={140} />} bad={<div className="coin-allocation-two-charts"><AllocationExample scale="auto" height={112} /><AllocationExample scale="auto" variant="rescaled" height={112} /></div>} goodTitle="Use one shared 100 scale" badTitle="Autoscale each chart" goodCopy="A fixed percentage frame makes category heights comparable." badCopy="Separate automatic scales make the same visual height represent different amounts." /><ComparisonPair good={<AllocationExample showReference showMarker height={140} />} bad={<AllocationExample showReference showMarker height={140} showLegend={false} />} goodTitle="Keep the reference legend" badTitle="Hide the explanation" goodCopy="Current and Recommended tell people what the overlay means." badCopy="Without the legend, the second reading becomes ambiguous." /><ComparisonPair good={<AllocationExample height={140} />} bad={<AllocationExample longLabels height={140} />} goodTitle="Use short distinct labels" badTitle="Crowd the categories" goodCopy="Names such as Small & Mid, Large, and Others stay readable." badCopy="Long repeated labels compete with the values and crowd a narrow host." /></div> },
    sources: { header: 'Sources', title: 'Grounded in the public comparison contract', description: 'This guide uses the published AllocationComparisonChart API, the inspected Figma master, and canonical Storybook stories.', body: (
        <Sources
          checked="22 September 2026"
          figmaUrl={FIGMA_URL}
          figmaDescription="Allocation Comparison Chart · node 4976:1080"
          storybookUrl={STORYBOOK_URL}
          storybookDescription="Allocation, current-only, markers, and sizing examples"
          stories={ALLOCATION_STORIES}
        >
          Examples use public <code>AllocationComparisonChart</code> and <code>AllocationSegment</code> exports from <code>jfs-components</code> 0.1.60. Bars and supplied baselines share one max; when max is omitted it is derived from the supplied values. The package source caps each baseline overlay with <code>min(baselineHeight, barHeight)</code>, so a recommendation above the current value is visibly clipped at the current pillar; the guide records that runtime behavior and does not teach it as an independently scaled bar. No custom segment colors are used.
        </Sources>
      ) },
  }

  return <ComponentGuideTemplate metadata={{ slug: 'allocationcomparisonchart', name: 'Allocation Comparison Chart', summary: 'Compare category amounts with a supplied reference.', corePrinciple: 'Use one shared scale so comparison stays honest.', figmaUrl: FIGMA_URL, storybookUrl: STORYBOOK_URL }} playground={<><div className="preview-stage coin-allocation-preview-stage"><div className="coin-allocation-preview-host"><AllocationExample preset={preset} showReference={showReference} showMarker={showMarker} scale={scale} height={height} /></div><span className="stage-label">Live Coin AllocationComparisonChart · Light</span></div><div className="controls-panel coin-allocation-controls-panel"><Segment label="Preset" value={preset} options={['allocation', 'current-only'] as const} onChange={setPreset} format={(value) => value === 'allocation' ? 'Allocation' : 'Current only'} /><Segment label="Scale" value={scale} options={['fixed', 'auto'] as const} onChange={setScale} format={(value) => value === 'fixed' ? 'Fixed 100' : 'Auto'} /><label className="text-control"><span>Bar area height (px)</span><input type="number" value={heightInput} onChange={(event) => handleHeightInput(event.target.value)} onBlur={normalizeHeightInput} step="any" min={0} aria-describedby="allocation-height-help" /><small id="allocation-height-help">Choose a height for the bar area. Labels and legend add to the total height.</small></label><label className="toggle-row"><input type="checkbox" checked={showReference} onChange={(event) => setShowReference(event.target.checked)} /><span className="toggle-track" /> Show reference</label><label className="toggle-row"><input type="checkbox" checked={showMarker} onChange={(event) => setShowMarker(event.target.checked)} /><span className="toggle-track" /> Show marker</label><div className="coin-allocation-readout"><span>Interaction</span><strong>Static comparison</strong><p>Controls update the supplied data; the chart itself has no press state.</p></div></div></>} sections={sections} />
}

export default AllocationComparisonChartGuide

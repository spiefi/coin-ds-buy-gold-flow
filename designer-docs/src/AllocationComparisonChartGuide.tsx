import {
  useLayoutEffect,
  useMemo,
  useRef,
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

const FIGMA_URL =
  'https://www.figma.com/design/3z7bmhA73Ls7j8Eu4qhYhE/Coin-Components-Library?node-id=4976-1080'
const STORYBOOK_URL =
  'https://jfs-components-storybook.vercel.app/?path=/docs/components-allocationcomparisonchart--docs'
const CHART_MODES: Modes = {
  'Color Mode': 'Light',
  'Appearance / DataViz': 'Primary',
  'Emphasis / DataViz': 'High',
} as Modes

type Preset = 'allocation' | 'current-only'
type Scale = 'auto' | 'fixed'
type AllocationVariant = 'default' | 'rescaled'

function SmallArrow() {
  return <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" /></svg>
}

function SourceLink({ href, children }: { href: string; children: string }) {
  return <a className="source-link" href={href} target="_blank" rel="noreferrer"><span>{children}</span><SmallArrow /></a>
}

function Segment<T extends string>({ label, value, options, onChange, display = (option) => option }: { label: string; value: T; options: readonly T[]; onChange: (value: T) => void; display?: (value: T) => string }) {
  return <fieldset className="control-group"><legend>{label}</legend><div className="segmented-control">{options.map((option) => <button key={option} type="button" className={value === option ? 'is-selected' : ''} aria-pressed={value === option} onClick={() => onChange(option)}>{display(option)}</button>)}</div></fieldset>
}

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
  const frameRef = useRef<HTMLDivElement>(null)
  const [metrics, setMetrics] = useState<{
    width: number
    height: number
    marks: Array<{ target: { left: number; top: number; width: number; height: number }; marker: { left: number; top: number } }>
  } | null>(null)

  useLayoutEffect(() => {
    const frame = frameRef.current
    if (!frame) return
    let active = true
    let scheduledFrame = 0
    const markerSize = 24
    const rect = (node: Element, frameRect: DOMRect) => {
      const bounds = node.getBoundingClientRect()
      return {
        left: bounds.left - frameRect.left,
        top: bounds.top - frameRect.top,
        width: bounds.width,
        height: bounds.height,
      }
    }
    const findVisibleText = (root: Element, text: string) => Array.from(root.querySelectorAll<HTMLElement>('*'))
      .filter((node) => node.textContent?.trim() === text && node.getBoundingClientRect().width > 0)
      .sort((first, second) => {
        const firstBounds = first.getBoundingClientRect()
        const secondBounds = second.getBoundingClientRect()
        return firstBounds.width * firstBounds.height - secondBounds.width * secondBounds.height
      })[0]
    const clamp = (value: number, max: number) => Math.min(Math.max(value, 10), Math.max(10, max - markerSize - 10))
    const measure = () => {
      if (!active) return
      const frameRect = frame.getBoundingClientRect()
      const chart = frame.querySelector<HTMLElement>('[role="img"]')
      if (!chart || frameRect.width === 0 || frameRect.height === 0) return
      const firstBar = chart.children[0] as HTMLElement | undefined
      const bar = Array.from(firstBar?.children ?? []).find((child) => {
        const node = child as HTMLElement
        return Boolean(node.querySelector('svg')) || node.getBoundingClientRect().height > 30
      }) as HTMLElement | undefined
      const overlay = bar?.firstElementChild
      const marker = bar?.querySelector('svg')
      const current = bar
      const label = firstBar?.lastElementChild
      const legend = findVisibleText(frame, 'Current')
      const baselineLabel = findVisibleText(frame, '35%')
      if (!firstBar || !bar || !overlay || !marker || !current || !label || !legend || !baselineLabel) return
      const targets = [legend, current, overlay, marker, label].map((node) => rect(node, frameRect))
      const baselineLabelRect = rect(baselineLabel, frameRect)
      const desired = [
        { left: targets[0].left - markerSize - 18, top: targets[0].top + targets[0].height / 2 - markerSize / 2 },
        { left: targets[1].left - markerSize - 18, top: targets[1].top + targets[1].height / 2 - markerSize / 2 },
        { left: targets[2].left + targets[2].width + 18, top: targets[2].top + targets[2].height / 2 - markerSize / 2 },
        { left: baselineLabelRect.left + baselineLabelRect.width + 12, top: baselineLabelRect.top + baselineLabelRect.height / 2 - markerSize / 2 },
        { left: targets[4].left + targets[4].width / 2 - markerSize / 2, top: targets[4].top + targets[4].height + 14 },
      ]
      const next = {
        width: frameRect.width,
        height: frameRect.height,
        marks: targets.map((target, index) => ({
          target,
          marker: { left: clamp(desired[index].left, frameRect.width), top: clamp(desired[index].top, frameRect.height) },
        })),
      }
      setMetrics(next)
    }
    const scheduleMeasure = () => {
      if (scheduledFrame) return
      scheduledFrame = requestAnimationFrame(() => {
        scheduledFrame = 0
        measure()
      })
    }
    const publicExample = frame.querySelector<HTMLElement>('.coin-allocation-anatomy-public-example')
    const mutations = typeof MutationObserver === 'undefined' ? null : new MutationObserver(scheduleMeasure)
    if (publicExample) mutations?.observe(publicExample, { childList: true, characterData: true, subtree: true })
    const resize = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(scheduleMeasure)
    resize?.observe(frame)
    if (publicExample) resize?.observe(publicExample)
    scheduleMeasure()
    void document.fonts?.ready.then(scheduleMeasure)
    window.addEventListener('resize', scheduleMeasure)
    return () => {
      active = false
      if (scheduledFrame) cancelAnimationFrame(scheduledFrame)
      mutations?.disconnect()
      resize?.disconnect()
      window.removeEventListener('resize', scheduleMeasure)
    }
  }, [])

  return <div className="coin-allocation-anatomy-stage"><div ref={frameRef} className="coin-allocation-anatomy-chart-wrap"><div className="coin-allocation-anatomy-public-example"><AllocationExample height={154} /></div>{metrics ? <><svg className="coin-allocation-anatomy-leaders" viewBox={`0 0 ${metrics.width} ${metrics.height}`} preserveAspectRatio="none" aria-hidden="true">{metrics.marks.map((mark, index) => <line key={index} x1={mark.marker.left + 12} y1={mark.marker.top + 12} x2={mark.target.left + mark.target.width / 2} y2={mark.target.top + mark.target.height / 2} />)}</svg>{metrics.marks.map((mark, index) => <span className="coin-allocation-anatomy-mark" style={{ left: mark.marker.left, top: mark.marker.top }} aria-hidden="true" key={index}>{index + 1}</span>)}</> : null}</div><div className="coin-allocation-anatomy-labels" aria-label="Allocation chart anatomy labels"><span><b>1</b> Legend</span><span><b>2</b> Current pillar</span><span><b>3</b> Baseline overlay</span><span><b>4</b> Marker</span><span><b>5</b> Category label</span></div><p className="coin-allocation-anatomy-note">The chart uses one shared scale for every current value and supplied baseline.</p></div>
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
    anatomy: { header: 'Anatomy', title: 'Current values and references share one visual scale', description: 'The chart combines a current pillar, optional baseline overlay, legend, marker, and category label. The shared scale lets people compare categories directly.', body: <div className="anatomy-card coin-allocation-anatomy-card"><div className="anatomy-stage"><AllocationAnatomy /></div><ol className="anatomy-list"><li><b>Legend</b><span>Current and Recommended explain the two readings when a baseline exists.</span></li><li><b>Current pillar</b><span>The main bar height encodes each supplied value.</span></li><li><b>Baseline overlay</b><span>A supplied recommendation overlays the same category from the bottom.</span></li><li><b>Marker</b><span>Keep the dashed callout focused on the first reference unless another marker is needed.</span></li><li><b>Category label</b><span>Use short distinct names that stay readable below the bars.</span></li></ol></div> },
    configuration: { header: 'Configuration', title: 'Show the reference only when it answers a question', description: 'Use the data, reference, marker, shared max, and any nonnegative bar-area height to establish a comparison that people can read.', body: <div className="coin-allocation-configuration-stack"><article className="configuration-block coin-allocation-config-card"><p className="eyebrow">With reference</p><h3>Compare current and recommended</h3><AllocationExample showReference showMarker height={154} /><p>A recommended value appears only when the data includes a baseline.</p></article><article className="configuration-block coin-allocation-config-card"><p className="eyebrow">Current only</p><h3>Keep a simple distribution</h3><AllocationExample preset="current-only" showReference={false} showMarker={false} height={154} /><p>Omit the reference when the page only needs current category amounts.</p></article><article className="configuration-block coin-allocation-config-card"><p className="eyebrow">Plot height</p><h3>Give the comparison enough room</h3><AllocationExample height={220} /><p>The default bar area is 154px; choose any nonnegative numeric height when the host needs more or less room. Labels and legend add to the total chart height.</p></article></div> },
    states: { header: 'States', title: 'Let the data decide whether comparison appears', description: 'The chart has no selected or pressed state. Its meaningful visual difference is whether the supplied segments include a baseline and whether the marker is shown.', body: <div className="coin-allocation-state-stack"><article className="coin-allocation-state-card"><p className="eyebrow">Without reference</p><AllocationExample preset="current-only" showReference={false} showMarker={false} /><p>Current bars stand on their own when there is no recommendation.</p></article><article className="coin-allocation-state-card"><p className="eyebrow">With reference</p><AllocationExample showReference showMarker /><p>The legend and first marker explain the additional reading.</p></article></div> },
    sizing: { header: 'Sizing', title: 'Keep bars and labels inside the same host', description: 'The host supplies width, the chart owns the bar width token, and height sets the bar area. 154px is the default; narrow hosts need short category names and a shared scale.', body: <div className="coin-allocation-sizing-stack"><article className="coin-allocation-sizing-card"><div className="coin-allocation-sizing-host is-wide"><AllocationExample height={180} /></div><strong>Wide host</strong><span>Use a consistent max when categories are compared across a summary.</span></article><article className="coin-allocation-sizing-card"><div className="coin-allocation-sizing-host is-narrow"><AllocationExample height={130} /></div><strong>Narrow host</strong><span>Keep labels short enough to sit below their own bars.</span></article></div> },
    content: { header: 'Content', title: 'Name categories and use one shared scale', description: 'Category labels carry meaning below the bar. The legend and values should use the same unit and comparison frame.', body: <div className="content-guidance-grid coin-allocation-content-grid"><article className="content-rule content-rule-featured"><span aria-hidden="true">01</span><h3>Use meaningful categories</h3><p>Short, distinct labels help people map each value to the right category.</p><div className="rule-example"><AllocationExample height={132} /></div></article><article className="content-rule"><span aria-hidden="true">02</span><h3>Explain the reference</h3><p>Keep the recommended legend when a baseline changes the decision.</p></article><article className="content-rule"><span aria-hidden="true">03</span><h3>Keep units consistent</h3><p>Percentages, amounts, or another unit should share one max and format.</p></article></div> },
    context: { header: 'In context', title: 'Place the comparison beside its summary', description: 'A Card can provide the portfolio label and explanation while the chart owns the category comparison.', body: <ContextExample /> },
    'dos-donts': { header: 'Do & Don’ts', title: 'Make the reference and scale easy to trust', description: 'The visual pairs use real chart data and show the consequence of changing the comparison frame.', body: <div className="comparison-stack coin-allocation-comparison-stack"><ComparisonPair good={<AllocationExample scale="fixed" height={140} />} bad={<div className="coin-allocation-two-charts"><AllocationExample scale="auto" height={112} /><AllocationExample scale="auto" variant="rescaled" height={112} /></div>} goodTitle="Use one shared 100 scale" badTitle="Autoscale each chart" goodCopy="A fixed percentage frame makes category heights comparable." badCopy="Separate automatic scales make the same visual height represent different amounts." /><ComparisonPair good={<AllocationExample showReference showMarker height={140} />} bad={<AllocationExample showReference showMarker height={140} showLegend={false} />} goodTitle="Keep the reference legend" badTitle="Hide the explanation" goodCopy="Current and Recommended tell people what the overlay means." badCopy="Without the legend, the second reading becomes ambiguous." /><ComparisonPair good={<AllocationExample height={140} />} bad={<AllocationExample longLabels height={140} />} goodTitle="Use short distinct labels" badTitle="Crowd the categories" goodCopy="Names such as Small & Mid, Large, and Others stay readable." badCopy="Long repeated labels compete with the values and crowd a narrow host." /></div> },
    sources: { header: 'Sources', title: 'Grounded in the public comparison contract', description: 'This guide uses the published AllocationComparisonChart API, the inspected Figma master, and canonical Storybook stories.', body: <><div className="sources-grid"><a href={FIGMA_URL} target="_blank" rel="noreferrer"><span className="source-index">01</span><div><h3>Coin Components Library</h3><p>Allocation Comparison Chart · node 4976:1080</p></div><SmallArrow /></a><a href={STORYBOOK_URL} target="_blank" rel="noreferrer"><span className="source-index">02</span><div><h3>Allocation Comparison Storybook</h3><p>Allocation, current-only, markers, and sizing examples</p></div><SmallArrow /></a></div><div className="verification-note"><span>Checked 22 September 2026</span><p>Examples use public <code>AllocationComparisonChart</code> and <code>AllocationSegment</code> exports from <code>jfs-components</code> 0.1.60. Bars and supplied baselines share one max; when max is omitted it is derived from the supplied values. The package source caps each baseline overlay with <code>min(baselineHeight, barHeight)</code>, so a recommendation above the current value is visibly clipped at the current pillar; the guide records that runtime behavior and does not teach it as an independently scaled bar. No custom segment colors are used.</p></div><div className="coin-allocation-source-links"><SourceLink href="https://jfs-components-storybook.vercel.app/iframe.html?id=components-allocationcomparisonchart--default&viewMode=story">Open default story</SourceLink><SourceLink href="https://jfs-components-storybook.vercel.app/iframe.html?id=components-allocationcomparisonchart--no-baseline&viewMode=story">Open no-baseline story</SourceLink></div></> },
  }

  return <ComponentGuideTemplate metadata={{ slug: 'allocationcomparisonchart', name: 'Allocation Comparison Chart', summary: 'Compare category amounts with a supplied reference.', corePrinciple: 'Use one shared scale so comparison stays honest.', figmaUrl: FIGMA_URL, storybookUrl: STORYBOOK_URL }} playground={<><div className="preview-stage coin-allocation-preview-stage"><div className="coin-allocation-preview-host"><AllocationExample preset={preset} showReference={showReference} showMarker={showMarker} scale={scale} height={height} /></div><span className="stage-label">Live Coin AllocationComparisonChart · Light</span></div><div className="controls-panel coin-allocation-controls-panel"><Segment label="Preset" value={preset} options={['allocation', 'current-only'] as const} onChange={setPreset} display={(value) => value === 'allocation' ? 'Allocation' : 'Current only'} /><Segment label="Scale" value={scale} options={['fixed', 'auto'] as const} onChange={setScale} display={(value) => value === 'fixed' ? 'Fixed 100' : 'Auto'} /><label className="text-control"><span>Bar area height (px)</span><input type="number" value={heightInput} onChange={(event) => handleHeightInput(event.target.value)} onBlur={normalizeHeightInput} step="any" min={0} aria-describedby="allocation-height-help" /><small id="allocation-height-help">Choose a height for the bar area. Labels and legend add to the total height.</small></label><label className="toggle-row"><input type="checkbox" checked={showReference} onChange={(event) => setShowReference(event.target.checked)} /><span className="toggle-track" /> Show reference</label><label className="toggle-row"><input type="checkbox" checked={showMarker} onChange={(event) => setShowMarker(event.target.checked)} /><span className="toggle-track" /> Show marker</label><div className="coin-allocation-readout"><span>Interaction</span><strong>Static comparison</strong><p>Controls update the supplied data; the chart itself has no press state.</p></div></div></>} sections={sections} />
}

export function isAllocationComparisonChartLocation() {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).get('component') === 'allocationcomparisonchart'
}

export default AllocationComparisonChartGuide

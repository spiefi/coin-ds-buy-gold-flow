import {
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  AreaLineChart,
  Card,
  type ChartPoint,
  type ChartSeries,
  type Modes,
} from 'jfs-components'
import {
  ComponentGuideTemplate,
  type GuideSectionSlots,
} from './ComponentGuideTemplate'
import { Anatomy, Segment, Sources, docsUrl } from './guide-kit'

const FIGMA_URL =
  'https://www.figma.com/design/3z7bmhA73Ls7j8Eu4qhYhE/Coin-Components-Library?node-id=4225-1049'
const STORYBOOK_URL = docsUrl('arealinechart')
const AREA_STORIES = [
  { label: 'Open default story', id: 'components-arealinechart--default' },
  { label: 'Open interactive story', id: 'components-arealinechart--interactive' },
]

// AreaLineChart exposes no testID; these follow its public render order:
// [role="img"] > body > [Y axis, plot column > [plot, X axis]].
const Y_AXIS = '[role="img"] > div > div:first-child'
const PLOT_COLUMN = '[role="img"] > div > div:last-child'

type Preset = 'trend' | 'comparison' | 'forecast'
type Curve = 'linear' | 'monotone'
type ChartScenario = 'normal' | 'mixed' | 'hiddenLegend' | 'longLabels'

const LIGHT_CHART_MODES: Modes = {
  'Color Mode': 'Light',
  'Appearance / DataViz': 'Primary',
  'Emphasis / DataViz': 'High',
} as Modes

function presetData(preset: Preset): { labels: string[]; series: ChartSeries[]; goalPin?: number } {
  if (preset === 'comparison') {
    return {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      series: [
        { key: 'income', label: 'Income', appearance: 'Primary', data: [1, 14, 12, 22, 33, 45] },
        { key: 'spending', label: 'Spending', appearance: 'Secondary', data: [1, 8, 9, 14, 22, 30] },
      ],
    }
  }
  if (preset === 'forecast') {
    const data: ChartPoint[] = [
      { x: 'Apr', y: 22 },
      { x: 'May', y: 28 },
      { x: 'Jun', y: 31 },
      { x: 'Jul', y: 36, projected: true },
      { x: 'Aug', y: 41, projected: true },
    ]
    return { labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug'], series: [{ key: 'balance', label: 'Balance', appearance: 'Primary', data }], goalPin: 2 }
  }
  return {
    labels: ['Apr', 'May', 'Jun'],
    series: [{ key: 'balance', label: 'Balance', appearance: 'Primary', data: [620, 590, 725] }],
    goalPin: 2,
  }
}

function pointValue(point: number | ChartPoint) {
  return typeof point === 'number' ? point : point.y
}

function chartModes(): Modes {
  return LIGHT_CHART_MODES
}

function ChartDataTable({ labels, series }: { labels: string[]; series: ChartSeries[] }) {
  return (
    <details className="coin-area-data-details">
      <summary>View plotted values</summary>
      <table>
        <thead><tr><th scope="col">Series</th>{labels.map((label) => <th scope="col" key={label}>{label}</th>)}</tr></thead>
        <tbody>{series.map((item) => <tr key={String(item.key)}><th scope="row">{item.label}</th>{item.data.map((point, index) => <td key={index}>{pointValue(point)}{typeof point !== 'number' && point.projected ? ' projected' : ''}</td>)}</tr>)}</tbody>
      </table>
    </details>
  )
}

function AreaChartExample({
  preset = 'trend',
  showArea = true,
  showGrid = true,
  showDots = false,
  curve = 'linear',
  height = 218,
  initialActiveIndex = null,
  scenario = 'normal',
  showLegend,
  className,
}: {
  preset?: Preset
  showArea?: boolean
  showGrid?: boolean
  showDots?: boolean
  curve?: Curve
  height?: number
  initialActiveIndex?: number | null
  scenario?: ChartScenario
  showLegend?: boolean
  className?: string
}) {
  const { labels: baseLabels, series: baseSeries, goalPin } = useMemo(() => presetData(preset), [preset])
  const labels = scenario === 'longLabels'
    ? ['January month-end account balance', 'February month-end account balance', 'March month-end account balance', 'April month-end account balance', 'May month-end account balance', 'June month-end account balance'].slice(0, baseLabels.length)
    : baseLabels
  const initialSeries = scenario === 'mixed'
    ? [
        { ...baseSeries[0], key: 'income-rupees', label: 'Income (₹k)' },
        { ...baseSeries[1] ?? baseSeries[0], key: 'conversion-rate', label: 'Conversion (%)', data: [2, 9, 7, 11, 14, 16].slice(0, baseLabels.length) },
      ]
    : baseSeries
  const series = useMemo(() => initialSeries.map((item) => ({ ...item, showArea, showLine: true })), [initialSeries, showArea])
  const [activeIndex, setActiveIndex] = useState<number | null>(initialActiveIndex)
  const selected = activeIndex == null ? null : labels[activeIndex]
  const selectedValues = activeIndex == null
    ? ''
    : series.map((item) => `${item.label ?? 'Series'} ${pointValue(item.data[activeIndex] ?? 0)}k`).join(' · ')

  return (
    <div className={`coin-area-chart-example${className ? ` ${className}` : ''}`} data-coin-example="area-line-chart">
      <AreaLineChart
        series={series}
        xLabels={labels}
        curve={curve}
        height={height}
        showGrid={showGrid}
        showDots={showDots}
        showLegend={showLegend ?? (series.length > 1 && scenario !== 'hiddenLegend')}
        goalPin={goalPin == null ? undefined : { value: `${pointValue(series[0].data[goalPin] ?? 0)}k`, atIndex: goalPin }}
        activeIndex={activeIndex}
        onActiveIndexChange={setActiveIndex}
        interactive
        modes={chartModes()}
        formatY={(value) => `${value}k`}
        formatValue={(value) => `${value}k`}
        accessibilityLabel={`${preset} area line chart`}
        style={{ width: '100%' }}
      />
      <p className="coin-area-selection-readout" aria-live="polite">{selected ? `Selected ${selected}: ${selectedValues}` : 'Select an x-axis point to inspect its values.'}</p>
      <ChartDataTable labels={labels} series={series} />
    </div>
  )
}

function AreaAnatomy() {
  const { labels, series, goalPin } = presetData('trend')
  return (
    <Anatomy
      title="Area Line Chart"
      specimenWidth={320}
      scale={1}
      parts={[
        { name: 'Y axis', note: 'Use one unit and a readable scale so the direction is honest.', target: `${Y_AXIS} > div > :last-child`, side: 'top' },
        { name: 'Plot', note: 'Area and line show the trend; projected points use the dashed treatment. The plot owns pointer and x-axis selection.', target: `${PLOT_COLUMN} > div:first-child`, side: 'right' },
        { name: 'Goal pin', note: 'Use a goal pin to call out a meaningful point, not a decorative maximum.', target: 'svg + div > div', side: 'top' },
        { name: 'X axis', note: 'Keep labels short enough to select and read at the host width.', target: `${PLOT_COLUMN} > div:last-child`, side: 'bottom' },
      ]}
    >
      <AreaLineChart
        series={series.map((item) => ({ ...item, showArea: true, showLine: true }))}
        xLabels={labels}
        curve="linear"
        height={218}
        showGrid
        showDots
        showLegend={false}
        goalPin={goalPin == null ? undefined : { value: `${pointValue(series[0].data[goalPin] ?? 0)}k`, atIndex: goalPin }}
        interactive
        modes={chartModes()}
        formatY={(value) => `${value}k`}
        formatValue={(value) => `${value}k`}
        accessibilityLabel="trend area line chart"
        style={{ width: '100%' }}
      />
    </Anatomy>
  )
}

function ChartCard({ children, title, copy }: { children: ReactNode; title: string; copy: string }) {
  return <article className="coin-area-chart-card"><p className="eyebrow">{title}</p>{children}<p className="coin-area-chart-card-copy">{copy}</p></article>
}

function ContextExample() {
  return (
    <div className="coin-area-context">
      <Card modes={{ 'Color Mode': 'Light', AppearanceBrand: 'Neutral' } as Modes} style={{ width: '100%' }}>
        <Card.Title>Account balance</Card.Title>
        <Card.SupportText>Direction over the last three months</Card.SupportText>
        <AreaChartExample preset="trend" showArea showDots={false} height={168} />
      </Card>
      <p>Use a card or account summary to give the chart a clear unit and decision context.</p>
    </div>
  )
}

function ComparisonPair({
  good,
  bad,
  goodTitle,
  badTitle,
  goodCopy,
  badCopy,
}: {
  good: ReactNode
  bad: ReactNode
  goodTitle: string
  badTitle: string
  goodCopy: string
  badCopy: string
}) {
  return (
    <div className="comparison-row coin-area-comparison-row">
      <article className="comparison-card do-card"><p className="comparison-label">Do</p><div className="comparison-preview coin-area-comparison-preview">{good}</div><h3>{goodTitle}</h3><p>{goodCopy}</p></article>
      <article className="comparison-card dont-card"><p className="comparison-label">Don’t</p><div className="comparison-preview coin-area-comparison-preview">{bad}</div><h3>{badTitle}</h3><p>{badCopy}</p></article>
    </div>
  )
}

export function AreaLineChartGuide() {
  const [preset, setPreset] = useState<Preset>('trend')
  const [showArea, setShowArea] = useState(true)
  const [showGrid, setShowGrid] = useState(true)
  const [showDots, setShowDots] = useState(true)
  const [curve, setCurve] = useState<Curve>('linear')

  const sections: GuideSectionSlots = {
    anatomy: {
      header: 'Anatomy',
      title: 'Direction, comparison, and detail have distinct jobs',
      description: 'The chart combines axes, a plotted series, optional dots, a legend for comparison, and a goal pin when a target matters.',
      body: <AreaAnatomy />,
    },
    configuration: {
      header: 'Configuration',
      title: 'Choose the plot that answers the question',
      description: 'Use the series, area/line, grid, dots, curve, and x-label choices to make a trend or comparison legible.',
      body: <div className="coin-area-configuration-stack"><ChartCard title="Single trend" copy="A single series keeps the direction prominent."><AreaChartExample preset="trend" showArea showDots height={188} /></ChartCard><ChartCard title="Series comparison" copy="A second labelled series adds comparison without hiding the units."><AreaChartExample preset="comparison" showArea showDots={false} height={188} /></ChartCard><ChartCard title="Projected tail" copy="Mark projected points in the data so the chart can distinguish expectation from observed values."><AreaChartExample preset="forecast" showArea={false} showDots height={188} /></ChartCard></div>,
    },
    states: {
      header: 'States',
      title: 'Selection comes from the interaction model',
      description: 'The chart can be unselected or controlled at an active data index. Pointer and x-axis selection update the callback; this guide focuses on trend and selection.',
      body: <div className="coin-area-state-stack"><article className="coin-area-state-card"><p className="eyebrow">Unselected</p><AreaChartExample preset="comparison" showArea showDots={false} height={178} /><p>Keep the plot quiet when no point needs focus.</p></article><article className="coin-area-state-card"><p className="eyebrow">Selected</p><AreaChartExample preset="comparison" showArea showDots height={178} initialActiveIndex={1} /><p>Expose a selected point and its readable series values.</p></article></div>,
    },
    sizing: {
      header: 'Sizing',
      title: 'Give the plot enough width for its labels',
      description: 'The chart owns plot height while the host supplies width. On a narrow host, use shorter labels and fewer points in the same order.',
      body: <div className="coin-area-sizing-stack"><article className="coin-area-sizing-card"><div className="coin-area-sizing-host is-wide"><AreaChartExample preset="comparison" showArea showDots={false} height={190} /></div><strong>Wide host</strong><span>Use full available width when comparing two series.</span></article><article className="coin-area-sizing-card"><div className="coin-area-sizing-host is-narrow"><AreaChartExample preset="trend" showArea showDots height={170} /></div><strong>Bounded mobile host</strong><span>Reduce labels and point count before shrinking the readable chart.</span></article></div>,
    },
    content: {
      header: 'Content',
      title: 'Make units and series names do the reading work',
      description: 'Short x labels, one shared unit, and a visible legend help the chart communicate before a person inspects a point.',
      body: <div className="content-guidance-grid coin-area-content-grid"><article className="content-rule content-rule-featured"><span aria-hidden="true">01</span><h3>Keep the data comparable</h3><p>Use the same unit and scale for series that people need to compare.</p><div className="rule-example"><AreaChartExample preset="comparison" showArea showDots={false} height={146} /></div></article><article className="content-rule"><span aria-hidden="true">02</span><h3>Name every series</h3><p>A legend removes ambiguity when lines overlap or cross.</p></article><article className="content-rule"><span aria-hidden="true">03</span><h3>Offer readable data</h3><p>Keep the visible values available in text when SVG interaction is not enough for the task.</p></article></div>,
    },
    context: {
      header: 'In context',
      title: 'Put a trend beside the decision it informs',
      description: 'A Card can provide the account label and unit context while the chart stays responsible for the plotted data.',
      body: <ContextExample />,
    },
    'dos-donts': {
      header: 'Do & Don’ts',
      title: 'Make direction and comparison legible before detail',
      description: 'The examples use real chart props and show a visible consequence for each choice.',
      body: <div className="comparison-stack coin-area-comparison-stack"><ComparisonPair good={<AreaChartExample preset="comparison" showArea showDots={false} height={148} />} bad={<AreaChartExample preset="comparison" scenario="mixed" showArea showDots={false} height={148} />} goodTitle="Use one shared unit" badTitle="Mix unrelated units" goodCopy="Income and spending share the same scale, so their directions can be compared." badCopy="Income in rupees and conversion rate in percent do not belong on one comparison scale." /><ComparisonPair good={<AreaChartExample preset="comparison" showArea showDots={false} height={148} />} bad={<AreaChartExample preset="comparison" scenario="hiddenLegend" showArea showDots={false} height={148} showLegend={false} />} goodTitle="Label the series" badTitle="Hide the legend" goodCopy="Visible names keep overlapping lines understandable." badCopy="Two lines without labels force people to guess which series they are seeing." /><ComparisonPair good={<AreaChartExample preset="trend" showArea showDots height={148} />} bad={<AreaChartExample preset="trend" scenario="longLabels" className="is-constrained" showArea showDots height={148} />} goodTitle="Use short readable labels" badTitle="Overpack the x axis" goodCopy="A few short labels leave room for the plotted direction and selected values." badCopy="Long repeated labels crowd the axis and hide the trend." /></div>,
    },
    sources: {
      header: 'Sources',
      title: 'Grounded in the public chart contract',
      description: 'This guide uses the published AreaLineChart API, the inspected Figma master, and the canonical Storybook stories.',
      body: (
        <Sources
          checked="22 September 2026"
          figmaUrl={FIGMA_URL}
          figmaDescription="Area Line Chart · node 4225:1049"
          storybookUrl={STORYBOOK_URL}
          storybookDescription="Default, overlap, forecast, and interactive stories"
          stories={AREA_STORIES}
        >
          Examples use public <code>AreaLineChart</code> and its public interaction model from <code>jfs-components</code> 0.1.60. The chart derives a nice tick domain from its data unless y bounds are supplied, and its plot height excludes the x-axis row. Projected points, selected indices, goal pins, curves, grid, dots, and legends are public choices. SVG interaction is keyboard reachable through the public x-axis Pressable in RN Web, but the rendered accessibility tree does not expose full series labels; the guide keeps a visible values table.
        </Sources>
      ),
    },
  }

  return (
    <ComponentGuideTemplate
      metadata={{ slug: 'arealinechart', name: 'Area Line Chart', summary: 'Show a continuous trend and make series comparison legible.', corePrinciple: 'Make direction and comparison legible before detail.', figmaUrl: FIGMA_URL, storybookUrl: STORYBOOK_URL }}
      playground={<><div className="preview-stage coin-area-preview-stage"><div className="coin-area-preview-host"><AreaChartExample preset={preset} showArea={showArea} showGrid={showGrid} showDots={showDots} curve={curve} /></div><span className="stage-label">Live Coin AreaLineChart · Light</span></div><div className="controls-panel coin-area-controls-panel"><Segment label="Preset" value={preset} options={['trend', 'comparison', 'forecast'] as const} onChange={setPreset} format={(value) => value === 'trend' ? 'Trend' : value === 'comparison' ? 'Comparison' : 'Forecast'} /><Segment label="Curve" value={curve} options={['linear', 'monotone'] as const} onChange={setCurve} /><label className="toggle-row"><input type="checkbox" checked={showArea} onChange={(event) => setShowArea(event.target.checked)} /><span className="toggle-track" /> Show area</label><label className="toggle-row"><input type="checkbox" checked={showGrid} onChange={(event) => setShowGrid(event.target.checked)} /><span className="toggle-track" /> Show grid</label><label className="toggle-row"><input type="checkbox" checked={showDots} onChange={(event) => setShowDots(event.target.checked)} /><span className="toggle-track" /> Show dots</label><div className="coin-area-readout"><span>Interaction</span><strong>Point selection</strong><p>Press an x-axis label or plot point to update the readable selected value.</p></div></div></>}
      sections={sections}
    />
  )
}

export default AreaLineChartGuide

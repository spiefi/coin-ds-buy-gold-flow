import { useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  ActionFooter,
  ActionTile,
  Additem,
  Button,
  ButtonGroup,
  FormUpload,
  HStack,
  IconCapsule,
  Stack,
  Text,
  Title,
  VStack,
  type Modes,
  type PickedAsset,
} from 'jfs-components'
import {
  ComponentGuideTemplate,
  type GuideSectionSlots,
} from './ComponentGuideTemplate'
import attachmentSample from './assets/attachment-sample.svg'

type ColorMode = 'Light' | 'Dark'
type FooterLayout = 'Horizontal' | 'Vertical'
type FooterActionCount = '1' | '2'
type AdditemDemoState = 'Empty' | 'Preview' | 'Unavailable'

const ACTION_FOOTER_FIGMA =
  'https://www.figma.com/design/3z7bmhA73Ls7j8Eu4qhYhE/Coin-Components-Library?node-id=2904-8057'
const ACTION_FOOTER_STORYBOOK =
  'https://jfs-components-storybook.vercel.app/?path=/docs/components-actionfooter--docs'
const ACTION_TILE_FIGMA =
  'https://www.figma.com/design/3z7bmhA73Ls7j8Eu4qhYhE/Coin-Components-Library?node-id=1500-13351'
const ACTION_TILE_STORYBOOK =
  'https://jfs-components-storybook.vercel.app/?path=/docs/components-actiontile--docs'
const ADDITEM_FIGMA =
  'https://www.figma.com/design/dSlK8ueQ7wlbyUSZd4f8QO/Coin-Subcomponents'
const ADDITEM_STORYBOOK =
  'https://jfs-components-storybook.vercel.app/?path=/docs/components-additem--docs'

const SAMPLE_ATTACHMENT: PickedAsset = {
  uri: attachmentSample,
  name: 'receipt-september.svg',
  type: 'image/svg+xml',
  width: 160,
  height: 160,
}

function classes(...values: Array<string | false | undefined>) {
  return values.filter(Boolean).join(' ')
}

function footerModes(colorMode: ColorMode): Modes {
  return {
    'Color Mode': colorMode,
    Context: 'Default',
    context5: 'Default',
    'Action Footer Radius': 'False',
  } as Modes
}

function buttonModes(
  colorMode: ColorMode,
  appearance: 'Primary' | 'Secondary' = 'Primary',
): Modes {
  return {
    'Color Mode': colorMode,
    'Button / Size': 'M',
    'Button / State': 'Idle',
    'Semantic Intent': 'Brand',
    AppearanceBrand: appearance,
    Emphasis: 'High',
    Context4: 'Button',
    'Page type': 'MainPage',
  } as Modes
}

function actionTileModes(colorMode: ColorMode): Modes {
  return {
    'Color Mode': colorMode,
    Context: 'Default',
    'Page type': 'MainPage',
    'Semantic Intent': 'Brand',
    AppearanceBrand: 'Primary',
    Emphasis: 'Medium',
    'Icon Capsule Size': 'M',
  } as Modes
}

function additemModes(colorMode: ColorMode = 'Light'): Modes {
  return {
    'Color Mode': colorMode,
    Context: 'Default',
    'Page type': 'MainPage',
    'Semantic Intent': 'Brand',
    AppearanceBrand: 'Neutral',
    Emphasis: 'Low',
    'Icon Capsule Size': 'S',
  } as Modes
}

function surfaceModes(colorMode: ColorMode = 'Light'): Modes {
  return {
    'Color Mode': colorMode,
    Context: 'Default',
    'Page type': 'MainPage',
  } as Modes
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

function SmallArrow() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" />
    </svg>
  )
}

function SourceCards({
  figmaUrl,
  figmaTitle,
  figmaDescription,
  storybookUrl,
  storybookTitle,
  storybookDescription,
  children,
}: {
  figmaUrl: string
  figmaTitle: string
  figmaDescription: string
  storybookUrl: string
  storybookTitle: string
  storybookDescription: string
  children: ReactNode
}) {
  return (
    <>
      <div className="sources-grid">
        <a href={figmaUrl} target="_blank" rel="noreferrer">
          <span className="source-index">01</span>
          <div>
            <h3>{figmaTitle}</h3>
            <p>{figmaDescription}</p>
          </div>
          <SmallArrow />
        </a>
        <a href={storybookUrl} target="_blank" rel="noreferrer">
          <span className="source-index">02</span>
          <div>
            <h3>{storybookTitle}</h3>
            <p>{storybookDescription}</p>
          </div>
          <SmallArrow />
        </a>
      </div>
      <div className="verification-note">
        <span>Checked 19 September 2026</span>
        <p>{children}</p>
      </div>
    </>
  )
}

function SpecimenCard({
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  eyebrow: string
  title: string
  description: string
  children: ReactNode
  className?: string
}) {
  return (
    <article className={classes('action-specimen-card', className)}>
      <p className="eyebrow">{eyebrow}</p>
      <div className="action-specimen-preview">{children}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  )
}

type AnatomyRect = { left: number; top: number; width: number; height: number }
type AnatomyPoint = { left: number; top: number }
type AnatomyMark = { number: number; marker: AnatomyPoint; path: string }
type AnatomyMetrics = {
  width: number
  height: number
  marks: AnatomyMark[]
  decorations?: string[]
}

const ACTION_ANATOMY_MARKER_SIZE = 26

function anatomyRect(node: Element, frameRect: DOMRect): AnatomyRect {
  const rect = node.getBoundingClientRect()
  return {
    left: rect.left - frameRect.left,
    top: rect.top - frameRect.top,
    width: rect.width,
    height: rect.height,
  }
}

function anatomyUnion(rects: AnatomyRect[]): AnatomyRect {
  const left = Math.min(...rects.map((rect) => rect.left))
  const top = Math.min(...rects.map((rect) => rect.top))
  const right = Math.max(...rects.map((rect) => rect.left + rect.width))
  const bottom = Math.max(...rects.map((rect) => rect.top + rect.height))
  return { left, top, width: right - left, height: bottom - top }
}

function findAnatomyText(root: Element, text: string) {
  return Array.from(root.querySelectorAll<HTMLElement>('*'))
    .filter((node) => node.textContent?.trim() === text)
    .sort((first, second) => {
      const firstRect = first.getBoundingClientRect()
      const secondRect = second.getBoundingClientRect()
      return firstRect.width * firstRect.height - secondRect.width * secondRect.height
    })[0]
}

function clampAnatomyMarker(point: AnatomyPoint, width: number, height: number) {
  const inset = 4
  return {
    left: Math.min(Math.max(point.left, inset), width - ACTION_ANATOMY_MARKER_SIZE - inset),
    top: Math.min(Math.max(point.top, inset), height - ACTION_ANATOMY_MARKER_SIZE - inset),
  }
}

function anatomyMetricsMatch(first: AnatomyMetrics | null, second: AnatomyMetrics) {
  if (!first) return false
  const signature = (value: AnatomyMetrics) =>
    JSON.stringify(value, (_key, item) =>
      typeof item === 'number' ? Math.round(item * 10) / 10 : item,
    )
  return signature(first) === signature(second)
}

function useActionAnatomy(
  ref: { current: HTMLDivElement | null },
  read: (frame: HTMLDivElement) => AnatomyMetrics | null,
) {
  const [metrics, setMetrics] = useState<AnatomyMetrics | null>(null)

  useLayoutEffect(() => {
    const frame = ref.current
    if (!frame) return
    let active = true
    const measure = () => {
      const next = read(frame)
      if (next) setMetrics((current) => (anatomyMetricsMatch(current, next) ? current : next))
    }
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure)
    observer?.observe(frame)
    frame
      .querySelectorAll('[data-coin-example], button, [role="img"], img')
      .forEach((node) => observer?.observe(node))
    const frameId = requestAnimationFrame(measure)
    void document.fonts?.ready.then(() => {
      if (active) measure()
    })
    window.addEventListener('resize', measure)
    return () => {
      active = false
      cancelAnimationFrame(frameId)
      observer?.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [read, ref])

  return metrics
}

function ActionAnatomyOverlay({ metrics }: { metrics: AnatomyMetrics | null }) {
  if (!metrics) return null
  return (
    <>
      <svg
        className="action-anatomy-leaders"
        viewBox={`0 0 ${metrics.width} ${metrics.height}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {metrics.decorations?.map((path, index) => <path d={path} key={`decoration-${index}`} />)}
        {metrics.marks.map((mark) => <path d={mark.path} key={mark.number} />)}
      </svg>
      {metrics.marks.map((mark) => (
        <span
          className="action-anatomy-pin"
          style={{ left: mark.marker.left, top: mark.marker.top }}
          key={mark.number}
          aria-hidden="true"
        >
          {mark.number}
        </span>
      ))}
    </>
  )
}

function AnatomyLegendItem({
  number,
  label,
  children,
}: {
  number: number
  label: string
  children: ReactNode
}) {
  return (
    <li>
      <span className="action-anatomy-key" aria-hidden="true">{number}</span>
      <b>{label}</b>
      <span>{children}</span>
    </li>
  )
}

function ActionFooterExample({
  title,
  actionCount = '2',
  layout = 'Horizontal',
  colorMode = 'Light',
  primaryLabel = 'Continue',
  secondaryLabel = 'Back',
  equalPriority = false,
  onAction,
}: {
  title?: string
  actionCount?: FooterActionCount
  layout?: FooterLayout
  colorMode?: ColorMode
  primaryLabel?: string
  secondaryLabel?: string
  equalPriority?: boolean
  onAction?: (label: string) => void
}) {
  const modes = useMemo(() => footerModes(colorMode), [colorMode])
  const primaryModes = useMemo(() => buttonModes(colorMode, 'Primary'), [colorMode])
  const secondaryModes = useMemo(
    () => buttonModes(colorMode, equalPriority ? 'Primary' : 'Secondary'),
    [colorMode, equalPriority],
  )

  const actions = (
    <>
      {actionCount === '2' && (
        <Button
          label={secondaryLabel}
          type="default"
          modes={secondaryModes}
          onPress={() => onAction?.(secondaryLabel)}
          accessibilityLabel={secondaryLabel}
        />
      )}
      <Button
        label={primaryLabel}
        type="default"
        modes={primaryModes}
        onPress={() => onAction?.(primaryLabel)}
        accessibilityLabel={primaryLabel}
      />
    </>
  )

  return (
    <div
      className={classes('coin-action-footer-example', colorMode === 'Dark' && 'is-dark-example')}
      data-coin-example="action-footer"
    >
      <ActionFooter
        title={title}
        modes={modes}
        accessibilityLabel={title ? `${title} actions` : 'Screen actions'}
      >
        {layout === 'Horizontal' ? (
          <ButtonGroup modes={modes}>{actions}</ButtonGroup>
        ) : (
          <Stack layoutDirection="vertical" fillWidth modes={modes}>
            {actions}
          </Stack>
        )}
      </ActionFooter>
    </div>
  )
}

function ActionTileExample({
  label,
  iconName,
  colorMode = 'Light',
  actionable = true,
  onPress,
}: {
  label: string
  iconName: string
  colorMode?: ColorMode
  actionable?: boolean
  onPress?: () => void
}) {
  const modes = useMemo(() => actionTileModes(colorMode), [colorMode])
  return (
    <div data-coin-example="action-tile">
      <ActionTile
        label={label}
        icon={<IconCapsule iconName={iconName} />}
        modes={modes}
        onPress={actionable ? onPress ?? (() => undefined) : undefined}
      />
    </div>
  )
}

function AdditemExample({
  state = 'empty',
  disabled = false,
  removable = true,
  onPress,
  onRemove,
}: {
  state?: 'empty' | 'preview'
  disabled?: boolean
  removable?: boolean
  onPress?: () => void
  onRemove?: () => void
}) {
  return (
    <div data-coin-example="additem">
      <Additem
        state={state}
        imageSource={state === 'preview' ? attachmentSample : undefined}
        onPress={onPress}
        onRemove={state === 'preview' && removable ? onRemove ?? (() => undefined) : undefined}
        modes={additemModes()}
        isDisabled={disabled}
        accessibilityLabel={
          state === 'preview' ? 'Receipt attachment preview' : 'Add an attachment'
        }
      />
    </div>
  )
}

function readFooterAnatomy(frame: HTMLDivElement): AnatomyMetrics | null {
  const component = frame.querySelector<HTMLElement>('[data-coin-example="action-footer"]')
  const title = component ? findAnatomyText(component, 'Confirm payment') : undefined
  const buttons = component ? Array.from(component.querySelectorAll<HTMLElement>('button')) : []
  if (!component || !title || buttons.length < 2) return null

  const frameRect = frame.getBoundingClientRect()
  const surface = anatomyRect(component, frameRect)
  const titleRect = anatomyRect(title, frameRect)
  const actions = anatomyUnion(buttons.map((button) => anatomyRect(button, frameRect)))
  const titleX = titleRect.left + titleRect.width / 2
  const titleY = titleRect.top - 5
  const bracketY = Math.min(surface.top + surface.height - 6, actions.top + actions.height + 9)
  const actionRight = actions.left + actions.width
  const surfaceTargetX = surface.left + 24
  const isNarrow = frameRect.width <= 420
  const titleMarker = clampAnatomyMarker(
    { left: titleX - ACTION_ANATOMY_MARKER_SIZE / 2, top: surface.top - 42 },
    frameRect.width,
    frameRect.height,
  )
  const actionsMarker = clampAnatomyMarker(
    isNarrow
      ? {
          left: surface.left + surface.width - ACTION_ANATOMY_MARKER_SIZE,
          top: surface.top + surface.height + 14,
        }
      : {
          left: surface.left + surface.width + 17,
          top: bracketY - ACTION_ANATOMY_MARKER_SIZE / 2,
        },
    frameRect.width,
    frameRect.height,
  )
  const surfaceMarker = clampAnatomyMarker(
    { left: surfaceTargetX - ACTION_ANATOMY_MARKER_SIZE / 2, top: surface.top + surface.height + 14 },
    frameRect.width,
    frameRect.height,
  )
  const titleMarkerX = titleMarker.left + ACTION_ANATOMY_MARKER_SIZE / 2
  const titleMarkerY = titleMarker.top + ACTION_ANATOMY_MARKER_SIZE / 2
  const actionsMarkerX = actionsMarker.left + ACTION_ANATOMY_MARKER_SIZE / 2
  const actionsMarkerY = actionsMarker.top + ACTION_ANATOMY_MARKER_SIZE / 2
  const surfaceMarkerX = surfaceMarker.left + ACTION_ANATOMY_MARKER_SIZE / 2
  const surfaceMarkerY = surfaceMarker.top + ACTION_ANATOMY_MARKER_SIZE / 2

  return {
    width: frameRect.width,
    height: frameRect.height,
    decorations: [
      `M ${actions.left} ${bracketY - 6} V ${bracketY} H ${actionRight} V ${bracketY - 6}`,
    ],
    marks: [
      {
        number: 1,
        marker: titleMarker,
        path: `M ${titleMarkerX} ${titleMarkerY} V ${titleY - 8} H ${titleX} V ${titleY}`,
      },
      {
        number: 2,
        marker: actionsMarker,
        path: isNarrow
          ? `M ${actionsMarkerX} ${actionsMarkerY} V ${bracketY + 12} H ${actionRight} V ${bracketY}`
          : `M ${actionsMarkerX} ${actionsMarkerY} H ${actionRight + 12} V ${bracketY} H ${actionRight}`,
      },
      {
        number: 3,
        marker: surfaceMarker,
        path: `M ${surfaceMarkerX} ${surfaceMarkerY} H ${surfaceTargetX} V ${surface.top + surface.height + 2}`,
      },
    ],
  }
}

function readTileAnatomy(frame: HTMLDivElement): AnatomyMetrics | null {
  const component = frame.querySelector<HTMLElement>('[data-coin-example="action-tile"]')
  const surface = component?.firstElementChild
  const icon = component?.querySelector<HTMLElement>('[role="img"]')
  const label = component ? findAnatomyText(component, 'Cards') : undefined
  if (!component || !surface || !icon || !label) return null

  const frameRect = frame.getBoundingClientRect()
  const surfaceRect = anatomyRect(surface, frameRect)
  const iconRect = anatomyRect(icon, frameRect)
  const labelRect = anatomyRect(label, frameRect)
  const iconY = iconRect.top + iconRect.height / 2
  const labelY = labelRect.top + labelRect.height / 2
  const boundaryY = surfaceRect.top + surfaceRect.height - 14
  const iconMarker = clampAnatomyMarker(
    { left: surfaceRect.left - 44, top: iconY - ACTION_ANATOMY_MARKER_SIZE / 2 },
    frameRect.width,
    frameRect.height,
  )
  const labelMarker = clampAnatomyMarker(
    { left: surfaceRect.left - 44, top: labelY - ACTION_ANATOMY_MARKER_SIZE / 2 },
    frameRect.width,
    frameRect.height,
  )
  const boundaryMarker = clampAnatomyMarker(
    { left: surfaceRect.left + surfaceRect.width + 17, top: boundaryY - ACTION_ANATOMY_MARKER_SIZE / 2 },
    frameRect.width,
    frameRect.height,
  )

  return {
    width: frameRect.width,
    height: frameRect.height,
    marks: [
      {
        number: 1,
        marker: iconMarker,
        path: `M ${iconMarker.left + ACTION_ANATOMY_MARKER_SIZE / 2} ${iconMarker.top + ACTION_ANATOMY_MARKER_SIZE / 2} H ${iconRect.left - 5}`,
      },
      {
        number: 2,
        marker: labelMarker,
        path: `M ${labelMarker.left + ACTION_ANATOMY_MARKER_SIZE / 2} ${labelMarker.top + ACTION_ANATOMY_MARKER_SIZE / 2} H ${labelRect.left - 5}`,
      },
      {
        number: 3,
        marker: boundaryMarker,
        path: `M ${boundaryMarker.left + ACTION_ANATOMY_MARKER_SIZE / 2} ${boundaryMarker.top + ACTION_ANATOMY_MARKER_SIZE / 2} H ${surfaceRect.left + surfaceRect.width + 2}`,
      },
    ],
  }
}

function readAdditemAnatomy(frame: HTMLDivElement): AnatomyMetrics | null {
  const examples = Array.from(
    frame.querySelectorAll<HTMLElement>('[data-coin-example="additem"]'),
  )
  const emptyCell = examples[0]?.querySelector<HTMLElement>('button')
  const previewCell = examples[1]?.querySelector<HTMLElement>('button')
  const addIcon = emptyCell?.querySelector<SVGElement>('svg')
  const thumbnail = previewCell?.querySelector<HTMLElement>('img')
  const previewButtons = examples[1]
    ? Array.from(examples[1].querySelectorAll<HTMLElement>('button'))
    : []
  const remove = previewButtons[1]
  if (!emptyCell || !previewCell || !addIcon || !thumbnail || !remove) return null

  const frameRect = frame.getBoundingClientRect()
  const emptyRect = anatomyRect(emptyCell, frameRect)
  const previewRect = anatomyRect(previewCell, frameRect)
  const iconRect = anatomyRect(addIcon, frameRect)
  const thumbnailRect = anatomyRect(thumbnail, frameRect)
  const removeRect = anatomyRect(remove, frameRect)
  const cellMarker = clampAnatomyMarker(
    { left: emptyRect.left - 43, top: emptyRect.top + 7 },
    frameRect.width,
    frameRect.height,
  )
  const iconMarker = clampAnatomyMarker(
    {
      left: iconRect.left + iconRect.width / 2 - ACTION_ANATOMY_MARKER_SIZE / 2,
      top: emptyRect.top + emptyRect.height + 17,
    },
    frameRect.width,
    frameRect.height,
  )
  const thumbnailMarker = clampAnatomyMarker(
    {
      left: thumbnailRect.left + 6 - ACTION_ANATOMY_MARKER_SIZE / 2,
      top: previewRect.top + previewRect.height + 17,
    },
    frameRect.width,
    frameRect.height,
  )
  const removeMarker = clampAnatomyMarker(
    {
      left: Math.max(previewRect.left + previewRect.width, removeRect.left + removeRect.width) + 17,
      top: removeRect.top + removeRect.height / 2 - ACTION_ANATOMY_MARKER_SIZE / 2,
    },
    frameRect.width,
    frameRect.height,
  )

  return {
    width: frameRect.width,
    height: frameRect.height,
    marks: [
      {
        number: 1,
        marker: cellMarker,
        path: `M ${cellMarker.left + ACTION_ANATOMY_MARKER_SIZE / 2} ${cellMarker.top + ACTION_ANATOMY_MARKER_SIZE / 2} H ${emptyRect.left - 4}`,
      },
      {
        number: 2,
        marker: iconMarker,
        path: `M ${iconMarker.left + ACTION_ANATOMY_MARKER_SIZE / 2} ${iconMarker.top + ACTION_ANATOMY_MARKER_SIZE / 2} V ${iconRect.top + iconRect.height + 2}`,
      },
      {
        number: 3,
        marker: thumbnailMarker,
        path: `M ${thumbnailMarker.left + ACTION_ANATOMY_MARKER_SIZE / 2} ${thumbnailMarker.top + ACTION_ANATOMY_MARKER_SIZE / 2} V ${thumbnailRect.top + thumbnailRect.height + 4}`,
      },
      {
        number: 4,
        marker: removeMarker,
        path: `M ${removeMarker.left + ACTION_ANATOMY_MARKER_SIZE / 2} ${removeMarker.top + ACTION_ANATOMY_MARKER_SIZE / 2} H ${removeRect.left + removeRect.width + 4}`,
      },
    ],
  }
}

function ActionFooterAnatomy() {
  const ref = useRef<HTMLDivElement>(null)
  const metrics = useActionAnatomy(ref, readFooterAnatomy)
  return (
    <div ref={ref} className="action-anatomy-live action-footer-anatomy-live">
      <div className="action-anatomy-component action-footer-anatomy-component">
        <ActionFooterExample title="Confirm payment" actionCount="2" />
      </div>
      <ActionAnatomyOverlay metrics={metrics} />
    </div>
  )
}

function ActionTileAnatomy() {
  const ref = useRef<HTMLDivElement>(null)
  const metrics = useActionAnatomy(ref, readTileAnatomy)
  return (
    <div ref={ref} className="action-anatomy-live action-tile-anatomy-live">
      <div className="action-anatomy-component action-tile-anatomy-component">
        <ActionTileExample label="Cards" iconName="ic_cards" actionable={false} />
      </div>
      <ActionAnatomyOverlay metrics={metrics} />
    </div>
  )
}

function AdditemAnatomy() {
  const ref = useRef<HTMLDivElement>(null)
  const metrics = useActionAnatomy(ref, readAdditemAnatomy)
  return (
    <div ref={ref} className="action-anatomy-live additem-anatomy-live">
      <div className="action-anatomy-component additem-anatomy-pair">
        <AdditemExample />
        <AdditemExample state="preview" />
      </div>
      <ActionAnatomyOverlay metrics={metrics} />
    </div>
  )
}

function PaymentSummaryExample() {
  const [announcement, setAnnouncement] = useState('Review the payment details.')
  const modes = useMemo(() => surfaceModes(), [])
  return (
    <div className="action-context-screen">
      <div className="action-context-content">
        <VStack modes={modes}>
          <Title
            title="Payment summary"
            subtitle="Review before confirming"
            modes={modes}
            disableTruncation
          />
          <Stack layoutDirection="vertical" fillWidth modes={modes}>
            <HStack justifyHorizontal="space-between" modes={modes}>
              <Text text="To" modes={modes} />
              <Text text="JioMart" modes={modes} />
            </HStack>
            <HStack justifyHorizontal="space-between" modes={modes}>
              <Text text="Amount" modes={modes} />
              <Text text="₹2,499" modes={modes} />
            </HStack>
          </Stack>
        </VStack>
        <p className="action-context-announcement" aria-live="polite">
          {announcement}
        </p>
      </div>
      <ActionFooterExample
        title="Confirm payment"
        actionCount="2"
        onAction={(label) => setAnnouncement(`${label} selected.`)}
      />
    </div>
  )
}

function QuickActionsExample() {
  const [announcement, setAnnouncement] = useState('Choose a destination.')
  const modes = useMemo(() => surfaceModes(), [])
  return (
    <div className="quick-actions-context">
      <HStack wrap alignVertical="flex-start" modes={modes}>
        <ActionTileExample label="Cards" iconName="ic_cards" onPress={() => setAnnouncement('Cards opened.')} />
        <ActionTileExample label="Savings" iconName="ic_savings" onPress={() => setAnnouncement('Savings opened.')} />
        <ActionTileExample label="Payments" iconName="ic_payments" onPress={() => setAnnouncement('Payments opened.')} />
      </HStack>
      <p aria-live="polite">{announcement}</p>
    </div>
  )
}

function ActionableTileStateExample() {
  const [announcement, setAnnouncement] = useState('Ready to open Payments.')
  return (
    <div className="actionable-tile-state">
      <ActionTileExample
        label="Payments"
        iconName="ic_payments"
        onPress={() => setAnnouncement('Payments opened.')}
      />
      <p aria-live="polite">{announcement}</p>
    </div>
  )
}

function FormUploadExample() {
  const [attachments, setAttachments] = useState<PickedAsset[]>([SAMPLE_ATTACHMENT])
  const picker = async () => ({ assets: [SAMPLE_ATTACHMENT] })
  return (
    <div className="form-upload-context">
      <FormUpload
        label="Identity documents"
        supportText="Add a clear image and keep the filename nearby."
        attachments={attachments}
        maxCount={2}
        picker={picker}
        onAttachmentsChange={setAttachments}
        modes={additemModes()}
        accessibilityLabel="Identity document attachments"
        testID="additem-context-upload"
      />
      <p>{attachments.length} of 2 attachments selected</p>
    </div>
  )
}

function ActionFooterPlayground() {
  const [title, setTitle] = useState('Confirm payment')
  const [actionCount, setActionCount] = useState<FooterActionCount>('2')
  const [layout, setLayout] = useState<FooterLayout>('Horizontal')
  const [colorMode, setColorMode] = useState<ColorMode>('Light')
  const [announcement, setAnnouncement] = useState('The footer is ready to try.')

  return (
    <>
      <div className={classes('preview-stage', 'action-footer-preview-stage', colorMode === 'Dark' && 'is-dark')}>
        <div className="footer-playground-host">
          <div className="footer-host-content" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <ActionFooterExample
            title={title.trim() || undefined}
            actionCount={actionCount}
            layout={layout}
            colorMode={colorMode}
            onAction={(label) => setAnnouncement(`${label} selected.`)}
          />
        </div>
        <p className="preview-note action-playground-note" aria-live="polite">
          {announcement}
        </p>
        <span className="stage-label">Live Coin ActionFooter · {colorMode}</span>
      </div>
      <div className="controls-panel">
        <label className="text-control">
          <span>Optional title</span>
          <input
            value={title}
            maxLength={36}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Leave empty to hide"
          />
        </label>
        <Segment label="Actions" value={actionCount} options={['1', '2'] as const} onChange={setActionCount} />
        <Segment label="Child group" value={layout} options={['Horizontal', 'Vertical'] as const} onChange={setLayout} />
        <Segment label="Color mode" value={colorMode} options={['Light', 'Dark'] as const} onChange={setColorMode} />
        <div className="action-control-note">
          <strong>Composition</strong>
          <p>{title.trim() ? 'Title shown' : 'No title'} · {actionCount} action{actionCount === '2' ? 's' : ''} · {layout.toLowerCase()}</p>
        </div>
      </div>
    </>
  )
}

function ActionTilePlayground() {
  const [label, setLabel] = useState('Cards')
  const [iconName, setIconName] = useState('ic_cards')
  const [iconChoice, setIconChoice] = useState('Cards')
  const [colorMode, setColorMode] = useState<ColorMode>('Light')
  const [announcement, setAnnouncement] = useState('Choose the shortcut.')

  const chooseLabel = (choice: string) => setLabel(choice)
  const chooseIcon = (choice: string) => {
    setIconChoice(choice)
    setIconName(
      choice === 'Savings' ? 'ic_savings' : choice === 'Payments' ? 'ic_payments' : 'ic_cards',
    )
  }

  return (
    <>
      <div className={classes('preview-stage', 'action-tile-preview-stage', colorMode === 'Dark' && 'is-dark')}>
        <div className="action-tile-preview-center">
          <ActionTileExample
            label={label}
            iconName={iconName}
            colorMode={colorMode}
            onPress={() => setAnnouncement(`${label} opened.`)}
          />
          <p className="preview-note" aria-live="polite">{announcement}</p>
        </div>
        <span className="stage-label">Live Coin ActionTile · fixed 168 × 90</span>
      </div>
      <div className="controls-panel">
        <Segment label="Label" value={label} options={['Cards', 'Savings', 'Payments'] as const} onChange={chooseLabel} />
        <Segment label="Icon" value={iconChoice} options={['Cards', 'Savings', 'Payments'] as const} onChange={chooseIcon} />
        <Segment label="Color mode" value={colorMode} options={['Light', 'Dark'] as const} onChange={setColorMode} />
        <div className="action-control-note">
          <strong>One destination</strong>
          <p>The label and icon identify the same shortcut. Activate the tile to hear the destination.</p>
        </div>
      </div>
    </>
  )
}

function AdditemPlayground() {
  const [demoState, setDemoState] = useState<AdditemDemoState>('Empty')
  const [announcement, setAnnouncement] = useState('No attachment selected.')
  const picker = async () => ({ assets: [SAMPLE_ATTACHMENT] })

  const chooseState = (state: AdditemDemoState) => {
    setDemoState(state)
    setAnnouncement(
      state === 'Preview'
        ? `${SAMPLE_ATTACHMENT.name} selected.`
        : state === 'Unavailable'
          ? 'Adding an attachment is unavailable.'
          : 'No attachment selected.',
    )
  }

  return (
    <>
      <div className="preview-stage additem-preview-stage">
        <div className="additem-preview-center">
          {demoState === 'Preview' ? (
            <Additem
              state="preview"
              imageSource={attachmentSample}
              onPress={() => setAnnouncement('Attachment preview opened.')}
              onRemove={() => chooseState('Empty')}
              modes={additemModes()}
              accessibilityLabel="Receipt attachment preview"
            />
          ) : (
            <Additem
              state="empty"
              picker={picker}
              onAssetsPicked={(assets) => {
                if (assets.length > 0) chooseState('Preview')
              }}
              modes={additemModes()}
              isDisabled={demoState === 'Unavailable'}
              accessibilityLabel="Add receipt attachment"
            />
          )}
          <div className="additem-file-readout">
            <strong>{demoState === 'Preview' ? SAMPLE_ATTACHMENT.name : 'Receipt attachment'}</strong>
            <span>{demoState === 'Preview' ? 'Image selected' : demoState === 'Unavailable' ? 'Unavailable' : 'No file selected'}</span>
          </div>
          <p className="preview-note" aria-live="polite">{announcement}</p>
        </div>
        <span className="stage-label">Live Coin Additem · fixed 44 × 44</span>
      </div>
      <div className="controls-panel">
        <Segment label="State" value={demoState} options={['Empty', 'Preview', 'Unavailable'] as const} onChange={chooseState} />
        <div className="action-control-note">
          <strong>Local sample</strong>
          <p>Set Empty, then activate the add cell to load the bundled receipt illustration. This loads a bundled example; nothing is uploaded.</p>
        </div>
        <div className="action-control-note is-warning">
          <strong>Remove affordance</strong>
          <p>The public preview overlay is shown as shipped. Its current mouse and keyboard limitation is recorded in Sources.</p>
        </div>
      </div>
    </>
  )
}

const actionFooterSections: GuideSectionSlots = {
  anatomy: {
    header: 'Anatomy',
    title: 'Three parts keep the next step anchored',
    description: 'The optional title, action group, and token-owned surface form one bottom action region.',
    body: (
      <div className="anatomy-card action-anatomy-card">
        <div className="anatomy-stage action-anatomy-stage action-footer-anatomy-stage">
          <ActionFooterAnatomy />
        </div>
        <ol className="anatomy-list">
          <AnatomyLegendItem number={1} label="Title">Optional context above the actions. Omit it when the decision is already clear.</AnatomyLegendItem>
          <AnatomyLegendItem number={2} label="Action group">A public ButtonGroup or Stack owns horizontal or vertical button layout.</AnatomyLegendItem>
          <AnatomyLegendItem number={3} label="Surface">ActionFooter owns background, shadow, padding, radius, and mode resolution.</AnatomyLegendItem>
        </ol>
      </div>
    ),
  },
  configuration: {
    header: 'Configuration',
    title: 'Choose the title and the action grouping',
    description: 'Use a ButtonGroup for a row. Use Stack when the actions need a vertical reading order.',
    body: (
      <div className="action-specimen-grid">
        <SpecimenCard eyebrow="Compact" title="Actions only" description="Keep the surface short when the preceding content already names the decision.">
          <ActionFooterExample actionCount="2" />
        </SpecimenCard>
        <SpecimenCard eyebrow="Explained" title="Title + vertical group" description="Add a short title and stack actions when horizontal space or hierarchy calls for it.">
          <ActionFooterExample title="Confirm payment" actionCount="2" layout="Vertical" />
        </SpecimenCard>
      </div>
    ),
  },
  states: {
    header: 'States',
    title: 'The footer reflects its supplied composition',
    description: 'ActionFooter does not invent disabled, loading, or confirmation states. Configure those on its public child actions and show feedback elsewhere.',
    body: (
      <div className="action-state-grid">
        <SpecimenCard eyebrow="One action" title="Single next step" description="A lone Continue action receives the full available width."><ActionFooterExample actionCount="1" /></SpecimenCard>
        <SpecimenCard eyebrow="Two actions" title="Primary + supporting" description="Back supports the clearly prioritized Continue action."><ActionFooterExample actionCount="2" /></SpecimenCard>
        <SpecimenCard eyebrow="Dark mode" title="Resolved surface" description="The owner receives Dark and cascades it through the composite."><ActionFooterExample title="Confirm payment" colorMode="Dark" /></SpecimenCard>
      </div>
    ),
  },
  sizing: {
    header: 'Sizing',
    title: 'Fill the host width and hug the content height',
    description: 'The Figma reference is 360px wide and 93px high without a title. The host supplies width; title and grouping change the natural height.',
    body: (
      <div className="action-sizing-grid">
        <article className="action-sizing-card">
          <div className="action-size-host footer-size-host"><ActionFooterExample actionCount="2" /></div>
          <h3>360px reference host</h3>
          <p>Horizontal actions fill the surface while the footer hugs its content.</p>
        </article>
        <article className="action-sizing-card">
          <div className="action-size-host footer-size-host is-narrow"><ActionFooterExample title="Confirm payment" layout="Vertical" /></div>
          <h3>Constrained host</h3>
          <p>The composite changes its own height; ActionFooter remains full width.</p>
        </article>
      </div>
    ),
  },
  content: {
    header: 'Content',
    title: 'Make one action unmistakably primary',
    description: 'Use short verb-led labels. Keep confirmation or error feedback in the surrounding flow rather than inside the persistent footer.',
    body: (
      <div className="content-guidance-grid">
        <article className="content-rule content-rule-featured">
          <span aria-hidden="true">01</span><h3>Lead with the decision</h3><p>Use one clear primary action such as Continue or Confirm payment.</p>
          <div className="rule-example action-rule-example"><ActionFooterExample actionCount="2" /></div>
        </article>
        <article className="content-rule"><span aria-hidden="true">02</span><h3>Keep labels short</h3><p>Continue and Back scan faster than sentences that repeat the screen title.</p></article>
        <article className="content-rule"><span aria-hidden="true">03</span><h3>Place feedback outside</h3><p>Show confirmation, validation, or failure near the content that changed.</p></article>
      </div>
    ),
  },
  context: {
    header: 'In context',
    title: 'Confirm a reviewed payment',
    description: 'The public footer follows a short Coin composition and keeps the final decision at the bottom of the host.',
    body: <PaymentSummaryExample />,
  },
  'dos-donts': {
    header: 'Do & Don’ts',
    title: 'Protect the action hierarchy',
    description: 'A strong footer makes the preferred next step visible before someone reads every label.',
    body: (
      <div className="comparison-stack action-comparison-stack">
        <div className="comparison-row action-comparison-row">
          <article className="comparison-card do-card"><p className="comparison-label">Do</p><div className="comparison-preview action-footer-comparison"><ActionFooterExample actionCount="2" /></div><h3>Give Continue clear priority</h3><p>Back stays secondary while Continue carries the next step.</p></article>
          <article className="comparison-card dont-card"><p className="comparison-label">Don’t</p><div className="comparison-preview action-footer-comparison"><ActionFooterExample actionCount="2" equalPriority /></div><h3>Make both actions primary</h3><p>Equal emphasis hides which action advances the decision.</p></article>
        </div>
        <div className="comparison-row action-comparison-row">
          <article className="comparison-card do-card"><p className="comparison-label">Do</p><div className="comparison-preview action-footer-comparison"><ActionFooterExample actionCount="2" layout="Vertical" primaryLabel="Confirm payment" secondaryLabel="Back" /></div><h3>Name the decision</h3><p>Back and Confirm payment describe both outcomes directly.</p></article>
          <article className="comparison-card dont-card"><p className="comparison-label">Don’t</p><div className="comparison-preview action-footer-comparison"><ActionFooterExample actionCount="2" layout="Vertical" primaryLabel="Go" secondaryLabel="Yes" /></div><h3>Use vague action labels</h3><p>Yes and Go make people infer what will happen next.</p></article>
        </div>
        <div className="comparison-row action-comparison-row">
          <article className="comparison-card do-card"><p className="comparison-label">Do</p><div className="comparison-preview action-footer-comparison"><ActionFooterExample title="Confirm payment" actionCount="2" /></div><h3>Keep the title concise</h3><p>A short title adds context without repeating the action.</p></article>
          <article className="comparison-card dont-card"><p className="comparison-label">Don’t</p><div className="comparison-preview action-footer-comparison"><ActionFooterExample title="Continue to continue with the next step of your payment" actionCount="2" /></div><h3>Repeat the instruction</h3><p>A long title slows scanning and duplicates the primary action.</p></article>
        </div>
      </div>
    ),
  },
  sources: {
    header: 'Sources',
    title: 'Public component, verified behavior',
    description: 'The designer guide keeps the Figma reference and package runtime distinct where their bottom spacing differs.',
    body: (
      <SourceCards figmaUrl={ACTION_FOOTER_FIGMA} figmaTitle="Action Footer in Figma" figmaDescription="Public node 2904:8057 · title property, 360px HUG reference" storybookUrl={ACTION_FOOTER_STORYBOOK} storybookTitle="ActionFooter Storybook" storybookDescription="Default, title, 24px padding, and stacked-content stories">
        The public export is jfs-components 0.1.60. Figma’s sample includes 41px bottom spacing; the package defaults to 24px plus an optional safe-area inset. Web renders in normal flow, native pins the footer, and keyboard avoidance remains consumer-owned.
      </SourceCards>
    ),
  },
}

const actionTileSections: GuideSectionSlots = {
  anatomy: {
    header: 'Anatomy',
    title: 'One icon, one label, one boundary',
    description: 'The fixed tile keeps its destination compact. The icon capsule inherits the owner modes supplied to ActionTile.',
    body: (
      <div className="anatomy-card action-anatomy-card">
        <div className="anatomy-stage action-anatomy-stage tile-anatomy-stage">
          <ActionTileAnatomy />
        </div>
        <ol className="anatomy-list">
          <AnatomyLegendItem number={1} label="Icon capsule">Reinforces the destination and receives the owner’s full mode object.</AnatomyLegendItem>
          <AnatomyLegendItem number={2} label="Label">Names one destination with a short, familiar term.</AnatomyLegendItem>
          <AnatomyLegendItem number={3} label="Tile boundary">ActionTile owns the fixed 168 × 90 surface and token-driven styling.</AnatomyLegendItem>
        </ol>
      </div>
    ),
  },
  configuration: {
    header: 'Configuration',
    title: 'Pair the label with the right icon',
    description: 'ActionTile exposes the label and icon slot. Keep both focused on the same destination.',
    body: (
      <div className="action-specimen-grid is-three-up">
        <SpecimenCard eyebrow="Cards" title="Card services" description="Use a card icon for a card destination."><ActionTileExample label="Cards" iconName="ic_cards" actionable={false} /></SpecimenCard>
        <SpecimenCard eyebrow="Savings" title="Savings space" description="Change both the label and its icon together."><ActionTileExample label="Savings" iconName="ic_savings" actionable={false} /></SpecimenCard>
        <SpecimenCard eyebrow="Payments" title="Payment tasks" description="Keep the destination distinct from neighboring shortcuts."><ActionTileExample label="Payments" iconName="ic_payments" actionable={false} /></SpecimenCard>
      </div>
    ),
  },
  states: {
    header: 'States',
    title: 'Static and actionable are the supported forms',
    description: 'Supplying onPress makes the tile actionable. The public API does not expose disabled or loading states, so do not invent them.',
    body: (
      <div className="action-specimen-grid">
        <SpecimenCard eyebrow="Static" title="Display only" description="Without onPress the tile presents the shortcut information without activation."><ActionTileExample label="Cards" iconName="ic_cards" actionable={false} /></SpecimenCard>
        <SpecimenCard eyebrow="Actionable" title="One destination" description="With onPress the whole tile activates the named destination."><ActionableTileStateExample /></SpecimenCard>
      </div>
    ),
  },
  sizing: {
    header: 'Sizing',
    title: 'Keep the public 168 × 90 footprint',
    description: 'ActionTile owns a fixed width and height. Let the surrounding public layout wrap or scroll; do not resize the tile with style patches.',
    body: (
      <div className="action-sizing-grid">
        <article className="action-sizing-card"><div className="action-size-host tile-size-host"><ActionTileExample label="Cards" iconName="ic_cards" actionable={false} /></div><h3>Wide host</h3><p>The tile keeps its intrinsic footprint inside available space.</p></article>
        <article className="action-sizing-card"><div className="action-size-host tile-size-host is-narrow"><ActionTileExample label="Savings" iconName="ic_savings" actionable={false} /></div><h3>Narrow host</h3><p>The host adapts around the tile; the tile itself stays 168 × 90.</p></article>
      </div>
    ),
  },
  content: {
    header: 'Content',
    title: 'Make every shortcut distinct',
    description: 'Short nouns usually work best. Avoid duplicate labels or explanatory sentences that turn a shortcut into a card.',
    body: (
      <div className="content-guidance-grid">
        <article className="content-rule content-rule-featured"><span aria-hidden="true">01</span><h3>One clear destination</h3><p>The icon and short label should describe the same place.</p><div className="rule-example action-rule-example"><ActionTileExample label="Savings" iconName="ic_savings" actionable={false} /></div></article>
        <article className="content-rule"><span aria-hidden="true">02</span><h3>Use compact labels</h3><p>Cards, Savings, and Payments are easy to scan in a group.</p></article>
        <article className="content-rule"><span aria-hidden="true">03</span><h3>Avoid duplicates</h3><p>Each visible tile needs a destination name that distinguishes it from its siblings.</p></article>
      </div>
    ),
  },
  context: {
    header: 'In context',
    title: 'Offer a small set of quick actions',
    description: 'A public HStack owns the responsive group while each fixed tile keeps one destination.',
    body: <QuickActionsExample />,
  },
  'dos-donts': {
    header: 'Do & Don’ts',
    title: 'Keep shortcuts concise and unique',
    description: 'The value of a quick-action group comes from immediate recognition.',
    body: (
      <div className="comparison-stack action-comparison-stack">
        <div className="comparison-row action-comparison-row">
          <article className="comparison-card do-card"><p className="comparison-label">Do</p><div className="comparison-preview action-tile-comparison"><ActionTileExample label="Savings" iconName="ic_savings" actionable={false} /><ActionTileExample label="Payments" iconName="ic_payments" actionable={false} /></div><h3>Use distinct destination names</h3><p>Each tile can be understood before it is activated.</p></article>
          <article className="comparison-card dont-card"><p className="comparison-label">Don’t</p><div className="comparison-preview action-tile-comparison"><ActionTileExample label="More" iconName="ic_cards" actionable={false} /><ActionTileExample label="More" iconName="ic_cards" actionable={false} /></div><h3>Repeat a vague label</h3><p>Duplicate More tiles do not reveal where either shortcut leads.</p></article>
        </div>
        <div className="comparison-row action-comparison-row">
          <article className="comparison-card do-card"><p className="comparison-label">Do</p><div className="comparison-preview action-tile-comparison"><ActionTileExample label="Cards" iconName="ic_cards" actionable={false} /></div><h3>Keep the label short</h3><p>Cards is familiar and easy to scan.</p></article>
          <article className="comparison-card dont-card"><p className="comparison-label">Don’t</p><div className="comparison-preview action-tile-comparison"><ActionTileExample label="Open the place where you manage all your cards" iconName="ic_cards" actionable={false} /></div><h3>Turn the label into a sentence</h3><p>Long instructions overwhelm a compact shortcut.</p></article>
        </div>
        <div className="comparison-row action-comparison-row">
          <article className="comparison-card do-card"><p className="comparison-label">Do</p><div className="comparison-preview action-tile-comparison"><ActionTileExample label="Savings" iconName="ic_savings" actionable={false} /></div><h3>Match icon and destination</h3><p>The savings icon reinforces the Savings label.</p></article>
          <article className="comparison-card dont-card"><p className="comparison-label">Don’t</p><div className="comparison-preview action-tile-comparison"><ActionTileExample label="Savings" iconName="ic_cards" actionable={false} /></div><h3>Pair the label with another destination</h3><p>A cards icon makes the Savings shortcut ambiguous.</p></article>
        </div>
      </div>
    ),
  },
  sources: {
    header: 'Sources',
    title: 'Public component, fixed contract',
    description: 'The guide follows the live Figma instance and the package’s public label, icon, modes, and onPress API.',
    body: (
      <SourceCards figmaUrl={ACTION_TILE_FIGMA} figmaTitle="Action Tile in Figma" figmaDescription="Public node 1500:13351 · 168 × 90 fixed instance" storybookUrl={ACTION_TILE_STORYBOOK} storybookTitle="ActionTile Storybook" storybookDescription="Default, custom-icon, and mode stories">
        The public export is jfs-components 0.1.60. Examples use Primary appearance with Medium emphasis, matching the supplied Storybook reference. ActionTile passes those owner modes to its icon capsule.
      </SourceCards>
    ),
  },
}

const additemSections: GuideSectionSlots = {
  anatomy: {
    header: 'Anatomy',
    title: 'Empty and preview reveal different parts',
    description: 'The 44 × 44 cell keeps the add icon, thumbnail, and optional remove affordance within one fixed boundary.',
    body: (
      <div className="anatomy-card action-anatomy-card">
        <div className="anatomy-stage action-anatomy-stage additem-anatomy-stage">
          <AdditemAnatomy />
        </div>
        <ol className="anatomy-list">
          <AnatomyLegendItem number={1} label="44 × 44 cell">The fixed boundary is the target and visual container.</AnatomyLegendItem>
          <AnatomyLegendItem number={2} label="Add icon">Identifies the empty state as an attachment trigger.</AnatomyLegendItem>
          <AnatomyLegendItem number={3} label="Thumbnail">Confirms which visual asset was selected.</AnatomyLegendItem>
          <AnatomyLegendItem number={4} label="Remove affordance">Appears only when onRemove is supplied for a preview.</AnatomyLegendItem>
        </ol>
      </div>
    ),
  },
  configuration: {
    header: 'Configuration',
    title: 'Supply state, image, and picker behavior explicitly',
    description: 'Empty can call onPress or an injected picker. Preview needs an image source; onRemove is optional.',
    body: (
      <div className="action-specimen-grid is-three-up">
        <SpecimenCard eyebrow="Empty" title="Add trigger" description="Use picker with onAssetsPicked, or wire a platform-specific onPress."><AdditemExample /></SpecimenCard>
        <SpecimenCard eyebrow="Preview" title="Selected asset" description="Supply preview plus imageSource to show what was chosen."><AdditemExample state="preview" /></SpecimenCard>
        <SpecimenCard eyebrow="Preview" title="No remove action" description="Omit onRemove when the selected attachment cannot be cleared here."><AdditemExample state="preview" removable={false} /></SpecimenCard>
      </div>
    ),
  },
  states: {
    header: 'States',
    title: 'Keep empty, preview, and unavailable distinct',
    description: 'These are visibly different outcomes. Unavailable uses the public isDisabled behavior rather than a new visual variant.',
    body: (
      <div className="action-state-grid additem-state-grid">
        <SpecimenCard eyebrow="Empty" title="Ready to add" description="The add icon tells people the cell can accept an attachment."><AdditemExample /></SpecimenCard>
        <SpecimenCard eyebrow="Preview" title="Asset selected" description="A thumbnail confirms the chosen asset and can expose removal."><AdditemExample state="preview" /></SpecimenCard>
        <SpecimenCard eyebrow="Unavailable" title="Action disabled" description="The cell is dimmed and its press behavior is disabled."><AdditemExample disabled /></SpecimenCard>
      </div>
    ),
  },
  sizing: {
    header: 'Sizing',
    title: 'The cell stays 44 × 44',
    description: 'Additem owns its fixed cell. A FormUpload or another public layout owns row gaps, wrapping, and the surrounding label.',
    body: (
      <div className="action-sizing-grid">
        <article className="action-sizing-card"><div className="action-size-host additem-size-host"><AdditemExample /><AdditemExample state="preview" /></div><h3>Attachment row</h3><p>Cells keep the same footprint while the row controls spacing.</p></article>
        <article className="action-sizing-card"><div className="action-size-host additem-size-host is-narrow"><AdditemExample state="preview" /></div><h3>Constrained host</h3><p>The host can wrap around the fixed cell without resizing it.</p></article>
      </div>
    ),
  },
  content: {
    header: 'Content',
    title: 'Name the attachment beside the thumbnail',
    description: 'A 44px image cannot explain itself. Keep a meaningful filename or field label nearby so the selected asset remains understandable.',
    body: (
      <div className="content-guidance-grid">
        <article className="content-rule content-rule-featured"><span aria-hidden="true">01</span><h3>Give the preview context</h3><p>Pair the cell with the field purpose and a readable filename.</p><div className="rule-example action-rule-example additem-labelled-example"><div className="additem-label-row"><AdditemExample state="preview" /><strong>receipt-september.svg</strong></div></div></article>
        <article className="content-rule"><span aria-hidden="true">02</span><h3>Use a useful field label</h3><p>“Identity documents” says more than a generic “Upload.”</p></article>
        <article className="content-rule"><span aria-hidden="true">03</span><h3>Keep state visible</h3><p>Do not use the empty add icon after an asset has been chosen.</p></article>
      </div>
    ),
  },
  context: {
    header: 'In context',
    title: 'Use Additem inside FormUpload',
    description: 'The public composite supplies the field label, support text, attachment row, picker handoff, and controlled attachment list.',
    body: <FormUploadExample />,
  },
  'dos-donts': {
    header: 'Do & Don’ts',
    title: 'Explain what the thumbnail represents',
    description: 'A small preview is evidence of a choice, not a complete label.',
    body: (
      <div className="comparison-stack action-comparison-stack">
        <div className="comparison-row action-comparison-row">
          <article className="comparison-card do-card"><p className="comparison-label">Do</p><div className="comparison-preview additem-comparison"><HStack alignVertical="center" modes={surfaceModes()}><AdditemExample state="preview" /><Text text="Receipt · September" modes={surfaceModes()} /></HStack></div><h3>Keep a meaningful label nearby</h3><p>The attachment remains identifiable even when the image is small.</p></article>
          <article className="comparison-card dont-card"><p className="comparison-label">Don’t</p><div className="comparison-preview additem-comparison"><AdditemExample state="preview" /></div><h3>Show an unexplained thumbnail</h3><p>People cannot confirm what file they selected or why it belongs here.</p></article>
        </div>
        <div className="comparison-row action-comparison-row">
          <article className="comparison-card do-card"><p className="comparison-label">Do</p><div className="comparison-preview additem-comparison"><HStack alignVertical="center" modes={surfaceModes()}><AdditemExample state="preview" /><Text text="Receipt selected" modes={surfaceModes()} /></HStack></div><h3>Keep selected state visible</h3><p>The preview agrees with the nearby status text.</p></article>
          <article className="comparison-card dont-card"><p className="comparison-label">Don’t</p><div className="comparison-preview additem-comparison"><HStack alignVertical="center" modes={surfaceModes()}><AdditemExample /><Text text="Receipt selected" modes={surfaceModes()} /></HStack></div><h3>Pair selected copy with an empty cell</h3><p>The add icon contradicts the nearby selected state.</p></article>
        </div>
        <div className="comparison-row action-comparison-row">
          <article className="comparison-card do-card"><p className="comparison-label">Do</p><div className="comparison-preview additem-comparison"><VStack modes={surfaceModes()}><AdditemExample disabled /><Text text="Complete the required details to add a receipt" modes={surfaceModes()} /></VStack></div><h3>Explain why adding is unavailable</h3><p>A nearby reason tells people what to do next.</p></article>
          <article className="comparison-card dont-card"><p className="comparison-label">Don’t</p><div className="comparison-preview additem-comparison"><AdditemExample disabled /></div><h3>Disable the cell without a reason</h3><p>An unexplained unavailable state leaves people stuck.</p></article>
        </div>
      </div>
    ),
  },
  sources: {
    header: 'Sources',
    title: 'Public export with a source limitation',
    description: 'The package and stories define the usable contract. The matching lower-case Figma subcomponent key was found, but an exact live node was not exposed in the available page context.',
    body: (
      <SourceCards figmaUrl={ADDITEM_FIGMA} figmaTitle="Coin Subcomponents file" figmaDescription="Read-only source file · exact Additem node unresolved" storybookUrl={ADDITEM_STORYBOOK} storybookTitle="Additem Storybook" storybookDescription="Empty, preview, picker, disabled, and all-state stories">
        The public export is jfs-components 0.1.60 and defaults its inner IconCapsule to Neutral, Low, and S. The exact Figma node remains unverified. In this web build the preview remove control did not remove the item with mouse or keyboard activation; the guide keeps the shipped component intact.
      </SourceCards>
    ),
  },
}

export function ActionFooterGuide() {
  return (
    <div className="action-docs action-footer-docs">
      <ComponentGuideTemplate
        metadata={{
          slug: 'actionfooter',
          name: 'Action Footer',
          summary: 'Keep the next step close to the decision.',
          corePrinciple: 'Give one action clear priority.',
          figmaUrl: ACTION_FOOTER_FIGMA,
          storybookUrl: ACTION_FOOTER_STORYBOOK,
        }}
        playground={<ActionFooterPlayground />}
        sections={actionFooterSections}
      />
    </div>
  )
}

export function ActionTileGuide() {
  return (
    <div className="action-docs action-tile-docs">
      <ComponentGuideTemplate
        metadata={{
          slug: 'actiontile',
          name: 'Action Tile',
          summary: 'A compact shortcut to one destination.',
          corePrinciple: 'One icon. One short label. One destination.',
          figmaUrl: ACTION_TILE_FIGMA,
          storybookUrl: ACTION_TILE_STORYBOOK,
        }}
        playground={<ActionTilePlayground />}
        sections={actionTileSections}
      />
    </div>
  )
}

export function AddItemGuide() {
  return (
    <div className="action-docs additem-docs">
      <ComponentGuideTemplate
        metadata={{
          slug: 'additem',
          name: 'Add Item',
          summary: 'Add an attachment and show what was chosen.',
          corePrinciple: 'Keep empty, preview, and unavailable states distinct.',
          figmaUrl: ADDITEM_FIGMA,
          storybookUrl: ADDITEM_STORYBOOK,
        }}
        playground={<AdditemPlayground />}
        sections={additemSections}
      />
    </div>
  )
}

export type ActionGuideSlug = 'actionfooter' | 'actiontile' | 'additem'

export function getActionGuideFromLocation(): ActionGuideSlug | null {
  const slug = new URLSearchParams(window.location.search).get('component')
  return slug === 'actionfooter' || slug === 'actiontile' || slug === 'additem'
    ? slug
    : null
}

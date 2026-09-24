import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import {
  AutoplayControl,
  Card,
  Carousel,
  type Modes,
} from 'jfs-components'
import {
  ComponentGuideTemplate,
  type GuideSectionSlots,
} from './ComponentGuideTemplate'
import {
  AnatomyKey,
  AnatomyOverlay,
  Readout,
  Segment,
  SourceCards,
  Toggle,
  classes,
  clampPin,
  measureBox,
  storyUrl,
  useAnatomyLayout,
  type AnatomyLayout,
  type AnatomyShape,
} from './GuideParts'

const FIGMA_URL =
  'https://www.figma.com/design/3z7bmhA73Ls7j8Eu4qhYhE/Coin-Components-Library?node-id=7522-7658'
const STORYBOOK_URL =
  'https://jfs-components-storybook.vercel.app/?path=/docs/components-autoplaycontrol--docs'
const STORIES = [
  { label: 'Default story', url: storyUrl('components-autoplaycontrol--default') },
  { label: 'Play story', url: storyUrl('components-autoplaycontrol--play') },
  { label: 'Disabled story', url: storyUrl('components-autoplaycontrol--disabled') },
  { label: 'Carousel · Numbered', url: storyUrl('components-carousel--numbered') },
] as const

type ControlState = 'pause' | 'play'

const DARK_MODES = { 'Color Mode': 'Dark' } as Modes

const SLIDES = [
  { title: 'Start a SIP', body: 'Invest as little as ₹100 a month into top mutual funds.' },
  { title: 'Scan & Pay', body: 'Pay any QR code in seconds, right from your home screen.' },
  { title: 'Track expenses', body: 'Get a clear view of where your money goes each month.' },
] as const

function stateMessage(state: ControlState) {
  return state === 'pause'
    ? 'Content is advancing, so the control offers Pause.'
    : 'Content is stopped, so the control offers Play.'
}

// ---------------------------------------------------------------------------
// Anatomy
// ---------------------------------------------------------------------------

function readControlAnatomy(frame: HTMLDivElement): AnatomyLayout | null {
  const pause = frame.querySelector<HTMLElement>('[data-autoplay-anatomy="pause"] > *')
  const play = frame.querySelector<HTMLElement>('[data-autoplay-anatomy="play"] > *')
  const pauseIcon = pause?.firstElementChild as HTMLElement | null | undefined
  const playIcon = play?.firstElementChild as HTMLElement | null | undefined
  if (!pause || !play || !pauseIcon || !playIcon || !pause.offsetWidth) return null

  const frameRect = frame.getBoundingClientRect()
  const width = frameRect.width
  const height = frameRect.height
  const pauseBox = measureBox(pause, frameRect)
  const playBox = measureBox(play, frameRect)
  const pauseIconBox = measureBox(pauseIcon, frameRect)
  const playIconBox = measureBox(playIcon, frameRect)
  const pauseBottom = pauseBox.top + pauseBox.height
  const playBottom = playBox.top + playBox.height
  const dimY = Math.max(pauseBottom, playBottom) + 20

  const shapes: AnatomyShape[] = [
    { kind: 'bounds', box: pauseBox },
    { kind: 'bounds', box: playBox },
    { kind: 'child', box: pauseIconBox },
    { kind: 'child', box: playIconBox },
    {
      kind: 'dimension',
      path: `M ${pauseBox.left} ${dimY - 4} V ${dimY + 4} M ${pauseBox.left} ${dimY} H ${pauseBox.left + pauseBox.width} M ${pauseBox.left + pauseBox.width} ${dimY - 4} V ${dimY + 4}`,
      label: `${pause.offsetWidth} × ${pause.offsetHeight}`,
      x: pauseBox.left + pauseBox.width / 2,
      y: dimY + 18,
    },
    {
      kind: 'dimension',
      path: `M ${playIconBox.left} ${dimY - 4} V ${dimY + 4} M ${playIconBox.left} ${dimY} H ${playIconBox.left + playIconBox.width} M ${playIconBox.left + playIconBox.width} ${dimY - 4} V ${dimY + 4}`,
      label: `icon ${playIcon.offsetWidth}`,
      x: playIconBox.left + playIconBox.width / 2,
      y: dimY + 18,
    },
  ]

  const containerPin = clampPin(pauseBox.left - 42, pauseBox.top + pauseBox.height / 2, width, height)
  const pausePin = clampPin(pauseIconBox.left + pauseIconBox.width / 2, pauseBox.top - 40, width, height)
  const playPin = clampPin(playIconBox.left + playIconBox.width / 2, playBox.top - 40, width, height)

  return {
    width,
    height,
    shapes,
    pins: [
      {
        number: 1,
        ...containerPin,
        path: `M ${containerPin.x + 11} ${containerPin.y} H ${pauseBox.left - 3}`,
      },
      {
        number: 2,
        ...pausePin,
        path: `M ${pausePin.x} ${pausePin.y + 11} V ${pauseIconBox.top - 2}`,
      },
      {
        number: 3,
        ...playPin,
        path: `M ${playPin.x} ${playPin.y + 11} V ${playIconBox.top - 2}`,
      },
    ],
  }
}

function AutoplayControlAnatomy() {
  const ref = useRef<HTMLDivElement>(null)
  const layout = useAnatomyLayout(ref, readControlAnatomy)
  return (
    <div className="coin-guide-anatomy-stage is-dark coin-autoplay-anatomy-stage" ref={ref}>
      <span className="coin-guide-zoom-note">Enlarged view · 2.5×</span>
      <div className="coin-autoplay-anatomy-live" inert>
        <div data-autoplay-anatomy="pause">
          <AutoplayControl state="pause" />
        </div>
        <div data-autoplay-anatomy="play">
          <AutoplayControl state="play" />
        </div>
      </div>
      <AnatomyOverlay layout={layout} />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Specimens
// ---------------------------------------------------------------------------

function StaticControl({
  state = 'pause',
  disabled = false,
  caption,
}: {
  state?: ControlState
  disabled?: boolean
  caption?: string
}) {
  return (
    <figure className="coin-autoplay-specimen">
      <div className="coin-autoplay-specimen-control" inert>
        <AutoplayControl state={state} disabled={disabled} />
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  )
}

function MeasuredHost({ label, className }: { label: string; className: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<string | null>(null)

  useLayoutEffect(() => {
    const node = ref.current
    if (!node) return
    const measure = () => {
      const control = node.firstElementChild as HTMLElement | null
      if (!control) return
      const next = `${control.offsetWidth} × ${control.offsetHeight} px`
      setSize((current) => (current === next ? current : next))
    }
    const observer =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure)
    observer?.observe(node)
    const frameId = requestAnimationFrame(measure)
    return () => {
      cancelAnimationFrame(frameId)
      observer?.disconnect()
    }
  }, [])

  return (
    <figure className="coin-autoplay-host-sample">
      <span>{label}</span>
      <div className={classes('coin-autoplay-host', className)} ref={ref} inert>
        <AutoplayControl state="pause" />
      </div>
      <figcaption>{size ?? 'Measuring…'}</figcaption>
    </figure>
  )
}

function SlideCard({ title, body }: { title: string; body: string }) {
  return (
    <Card variant="slim" modes={DARK_MODES} style={{ minHeight: 188 }}>
      <Card.Title>{title}</Card.Title>
      <Card.SupportText>{body}</Card.SupportText>
    </Card>
  )
}

function SlideshowExample() {
  const [announcement, setAnnouncement] = useState(
    'Slide 1 of 3. Press play to start the slideshow.',
  )
  const onIndexChange = useCallback((index: number) => {
    setAnnouncement(`Slide ${index + 1} of ${SLIDES.length}.`)
  }, [])

  return (
    <div className="coin-autoplay-context">
      <div className="coin-autoplay-carousel-frame">
        <Carousel type="Numbered" autoPlay={false} autoPlayInterval={4000} onIndexChange={onIndexChange}>
          {SLIDES.map((slide) => (
            <Carousel.Item key={slide.title}>
              <SlideCard title={slide.title} body={slide.body} />
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
      <p className="coin-guide-caption" aria-live="polite">{announcement}</p>
    </div>
  )
}

function Specimen({
  eyebrow,
  title,
  description,
  children,
  dark = true,
}: {
  eyebrow?: string
  title: string
  description: ReactNode
  children: ReactNode
  dark?: boolean
}) {
  return (
    <article className="coin-guide-card">
      {eyebrow ? <p className="coin-guide-card-eyebrow">{eyebrow}</p> : null}
      <div className={classes('coin-guide-card-stage', dark && 'is-dark')}>{children}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  )
}

function Comparison({
  kind,
  title,
  description,
  children,
  surface = 'dark',
}: {
  kind: 'do' | 'dont'
  title: string
  description: string
  children: ReactNode
  surface?: 'dark' | 'white'
}) {
  return (
    <article className={classes('comparison-card', kind === 'do' ? 'do-card' : 'dont-card')}>
      <p className="comparison-label">{kind === 'do' ? 'Do' : 'Don’t'}</p>
      <div
        className={classes(
          'comparison-preview coin-autoplay-comparison-preview',
          surface === 'white' ? 'is-white' : 'is-dark',
        )}
      >
        {children}
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  )
}

function PlaybackCard({ state, status }: { state: ControlState; status: string }) {
  return (
    <div className="coin-autoplay-playback">
      <span className="coin-autoplay-playback-status">
        <i aria-hidden="true" />
        {status}
      </span>
      <StaticControl state={state} />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Guide
// ---------------------------------------------------------------------------

export function AutoplayControlGuide() {
  const [state, setState] = useState<ControlState>('pause')
  const [disabled, setDisabled] = useState(false)
  const [announcement, setAnnouncement] = useState('Press the control to switch the consumer state.')

  const onPress = useCallback(() => {
    const next: ControlState = state === 'pause' ? 'play' : 'pause'
    setState(next)
    setAnnouncement(
      next === 'play'
        ? 'Pause pressed. The host stops playback and now offers Play.'
        : 'Play pressed. The host resumes playback and now offers Pause.',
    )
  }, [state])

  const sections: GuideSectionSlots = {
    anatomy: {
      header: 'Anatomy',
      title: 'A fixed circle around one icon',
      description:
        'The control is a single pressable circle. Its state property decides whether the icon is pause or play.',
      body: (
        <div className="anatomy-card coin-guide-anatomy-card">
          <AutoplayControlAnatomy />
          <ol className="anatomy-list coin-guide-anatomy-list">
            <AnatomyKey number={1} label="Container">
              A 36 × 36 circle. Width, height, radius, and the white fill come from Autoplay Control tokens.
            </AnatomyKey>
            <AnatomyKey number={2} label="Pause icon">
              Shown for <code>state="pause"</code>, the default, while content advances.
            </AnatomyKey>
            <AnatomyKey number={3} label="Play icon">
              Shown for <code>state="play"</code>, while content is stopped. Both icons are 24 px and black.
            </AnatomyKey>
          </ol>
        </div>
      ),
    },
    configuration: {
      header: 'Configuration',
      title: 'One property: the action to offer',
      description:
        'state swaps the icon between pause and play. Nothing else changes: tokens fix the circle and its colors in a single mode, and the icon is always 24 px.',
      body: (
        <div className="coin-guide-card-grid">
          <Specimen
            eyebrow='state="pause"'
            title="Pause while content advances"
            description="The default. It tells people a press will stop the slideshow, video, or audio."
          >
            <StaticControl state="pause" />
          </Specimen>
          <Specimen
            eyebrow='state="play"'
            title="Play while content is stopped"
            description="Shown after playback stops. A press should start it again."
          >
            <StaticControl state="play" />
          </Specimen>
        </div>
      ),
    },
    states: {
      header: 'States',
      title: 'Enabled, pressed, and unavailable',
      description:
        'disabled fades the control and ignores presses. Pressed feedback is shown only while a pointer is down.',
      body: (
        <div className="coin-guide-stack">
          <div className="coin-guide-card-grid">
            <Specimen eyebrow="Enabled" title="Ready" description="Full opacity and pressable.">
              <StaticControl state="pause" />
            </Specimen>
            <Specimen eyebrow="disabled" title="Unavailable" description="Half opacity. Presses are ignored and the control leaves the Tab order.">
              <StaticControl state="pause" disabled />
            </Specimen>
          </div>
          <div className="guidance-note">
            <strong>Pressed, hover, and focus</strong>
            <p>
              While pressed, the control drops to 70% opacity. It adds no hover style of its own; keyboard focus shows the browser’s standard focus ring. Try it in the live example above.
            </p>
          </div>
        </div>
      ),
    },
    sizing: {
      header: 'Sizing',
      title: 'Tokens fix the size',
      description:
        'The control does not stretch or shrink with its host. Leave room around the 36 px circle so it is easy to press.',
      body: (
        <div className="coin-autoplay-hosts">
          <MeasuredHost label="48 px square" className="is-square" />
          <MeasuredHost label="160 px strip" className="is-strip" />
          <MeasuredHost label="Full-width media strip" className="is-wide" />
        </div>
      ),
    },
    content: {
      header: 'Content',
      title: 'The icon is the whole message',
      description:
        'The control shows no text. Its icon has to describe what a press will do, and nearby content has to show what is playing.',
      body: (
        <div className="content-guidance-grid">
          <article className="content-rule content-rule-featured">
            <span aria-hidden="true">01</span>
            <h3>Show the action, not the status</h3>
            <p>While slides advance, show pause. When they stop, show play.</p>
            <div className="rule-example coin-autoplay-rule-example">
              <PlaybackCard state="pause" status="Slides advancing" />
            </div>
          </article>
          <article className="content-rule">
            <span aria-hidden="true">02</span>
            <h3>Keep progress visible</h3>
            <p>Carousel’s Numbered type places the control beside NumberPagination, so people can see which slide is showing.</p>
          </article>
          <article className="content-rule">
            <span aria-hidden="true">03</span>
            <h3>Use it for moving content</h3>
            <p>Canonical guidance names video, audio, and slideshow playback as its uses.</p>
          </article>
        </div>
      ),
    },
    context: {
      header: 'In context',
      title: 'Pause and resume a slideshow',
      description:
        'The public Carousel’s Numbered type places AutoplayControl beside NumberPagination. The Carousel owns the timer and swaps the control’s state.',
      body: <SlideshowExample />,
    },
    'dos-donts': {
      header: 'Do & Don’ts',
      title: 'Keep the icon honest and visible',
      description:
        'The control only works when its icon matches what the content is doing and its white circle stands out from the surface.',
      body: (
        <div className="comparison-stack">
          <div className="comparison-row">
            <Comparison
              kind="do"
              title="Show pause while slides advance"
              description="The icon matches what a press will do: stop the slides."
            >
              <PlaybackCard state="pause" status="Slides advancing" />
            </Comparison>
            <Comparison
              kind="dont"
              title="Show play while slides advance"
              description="The play icon suggests the slides are already stopped, so people cannot tell how to pause them."
            >
              <PlaybackCard state="play" status="Slides advancing" />
            </Comparison>
          </div>
          <div className="comparison-row">
            <Comparison
              kind="do"
              title="Place it on media or a dark surface"
              description="The white circle stands out, so the target is easy to find."
            >
              <StaticControl state="pause" />
            </Comparison>
            <Comparison
              kind="dont"
              title="Place it on a white surface"
              description="The white circle disappears, leaving an unbounded glyph with no visible target."
              surface="white"
            >
              <StaticControl state="pause" />
            </Comparison>
          </div>
        </div>
      ),
    },
    sources: {
      header: 'Sources',
      title: 'Public AutoplayControl and its Carousel composition',
      description:
        'The guide renders the public jfs-components AutoplayControl on its own and inside the public Carousel.',
      body: (
        <SourceCards
          figmaUrl={FIGMA_URL}
          figmaDescription="autoplay control set, node 7522:7658 · state pause and play, 36 × 36"
          storybookUrl={STORYBOOK_URL}
          storybookDescription="AutoplayControl docs and stories; Carousel Numbered story"
          stories={STORIES}
          checked="Checked 24 September 2026"
        >
          Declared, installed, and npm <code>latest</code> are all <code>jfs-components@0.1.60</code>. Figma’s state variants match the package’s <code>state</code> property. Storybook asks for an accessibility label, but this package accepts none, so the rendered button has no accessible name; report this before shipping the control on its own. The control has no timer: Carousel’s Numbered type owns autoplay, with a 4-second default interval.
        </SourceCards>
      ),
    },
  }

  return (
    <ComponentGuideTemplate
      metadata={{
        slug: 'autoplaycontrol',
        name: 'Autoplay Control',
        summary: 'Let people pause and resume content that advances on its own, such as a slideshow.',
        corePrinciple: 'Show the action a press will take: pause while content plays, play while it is stopped.',
        figmaUrl: FIGMA_URL,
        storybookUrl: STORYBOOK_URL,
      }}
      playground={
        <>
          <div className="preview-stage is-dark coin-autoplay-preview-stage">
            <div className="coin-autoplay-preview-content">
              <div className="coin-autoplay-live">
                <AutoplayControl state={state} disabled={disabled} onPress={onPress} />
              </div>
              <p className="preview-note" aria-live="polite">{announcement}</p>
            </div>
            <span className="stage-label">Live Coin AutoplayControl</span>
          </div>
          <div className="controls-panel coin-autoplay-controls">
            <Segment
              label="state"
              value={state}
              options={['pause', 'play'] as const}
              onChange={setState}
            />
            <Toggle label="Disabled" checked={disabled} onChange={setDisabled} />
            <Readout title="Consumer state" value={`state="${state}"${disabled ? ' · disabled' : ''}`}>
              {stateMessage(state)} The control has no timer; the host starts and stops playback.
            </Readout>
            <div className="coin-guide-note is-warning">
              <strong>No accessible name</strong>
              <p>This package version cannot label the control, so screen readers announce only “button”. See Sources.</p>
            </div>
          </div>
        </>
      }
      sections={sections}
    />
  )
}

export function isAutoplayControlLocation() {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).get('component') === 'autoplaycontrol'
}

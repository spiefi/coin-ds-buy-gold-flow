import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import {
  Avatar,
  AvatarGroup,
  Card,
  SkeletonGroup,
  type Modes,
} from 'jfs-components'
import {
  ComponentGuideTemplate,
  type GuideSectionSlots,
} from './ComponentGuideTemplate'

const FIGMA_FILE =
  'https://www.figma.com/design/3z7bmhA73Ls7j8Eu4qhYhE/Coin-Components-Library'
const AVATAR_GROUP_FIGMA = `${FIGMA_FILE}?node-id=1366-15672`
const AVATAR_FIGMA = `${FIGMA_FILE}?node-id=1-37658`
const AVATAR_GROUP_STORYBOOK =
  'https://jfs-components-storybook.vercel.app/?path=/docs/components-avatargroup--docs'
const AVATAR_STORYBOOK =
  'https://jfs-components-storybook.vercel.app/?path=/docs/components-avatar--docs'
const AVATAR_GROUP_STORIES = [
  {
    label: 'Default group',
    url: 'https://jfs-components-storybook.vercel.app/iframe.html?id=components-avatargroup--default&viewMode=story',
  },
  {
    label: 'Large size',
    url: 'https://jfs-components-storybook.vercel.app/iframe.html?id=components-avatargroup--large-size&viewMode=story',
  },
  {
    label: 'Custom gap',
    url: 'https://jfs-components-storybook.vercel.app/iframe.html?id=components-avatargroup--custom-gap&viewMode=story',
  },
]
const AVATAR_STORIES = [
  {
    label: 'Image style',
    url: 'https://jfs-components-storybook.vercel.app/iframe.html?id=components-avatar--image&viewMode=story',
  },
  {
    label: 'Monogram style',
    url: 'https://jfs-components-storybook.vercel.app/iframe.html?id=components-avatar--monogram&viewMode=story',
  },
  {
    label: 'Size modes',
    url: 'https://jfs-components-storybook.vercel.app/iframe.html?id=components-avatar--sizes&viewMode=story',
  },
  {
    label: 'Remote image',
    url: 'https://jfs-components-storybook.vercel.app/iframe.html?id=components-avatar--remote-image&viewMode=story',
  },
]

type AvatarSize = 'L' | 'M' | 'S' | 'XS'
type AvatarStyle = 'Image' | 'Monogram'
type Person = { monogram: string }

const PEOPLE: readonly Person[] = [
  { monogram: 'MS' },
  { monogram: 'AK' },
  { monogram: 'LS' },
  { monogram: 'DV' },
  { monogram: 'RN' },
]
const LIGHT_MODES: Modes = { 'Color Mode': 'Light' } as Modes
const AVATAR_SIZES: readonly AvatarSize[] = ['L', 'M', 'S', 'XS']

function avatarModes(size: AvatarSize): Modes {
  return { ...LIGHT_MODES, 'Avatar Size': size } as Modes
}

function avatarGroupModes(size: AvatarSize): Modes {
  return { 'Avatar Size': size } as Modes
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

function GuideAvatar({
  size = 'M',
  style = 'Monogram',
  monogram = 'MS',
  loading = false,
  testID,
}: {
  size?: AvatarSize
  style?: AvatarStyle
  monogram?: string
  loading?: boolean
  testID?: string
}) {
  const modes = useMemo(() => avatarModes(size), [size])

  return (
    <SkeletonGroup loading={loading}>
      <Avatar
        style={style}
        monogram={monogram}
        modes={modes}
        loading={loading}
        testID={testID}
      />
    </SkeletonGroup>
  )
}

function AvatarGroupSpecimen({
  count = 3,
  size = 'M',
  loadingIndex = -1,
  testPrefix,
}: {
  count?: number
  size?: AvatarSize
  loadingIndex?: number
  testPrefix?: string
}) {
  const people = PEOPLE.slice(0, count)
  const modes = useMemo(() => avatarGroupModes(size), [size])
  const prefix = testPrefix ?? 'avatar-group-child-'

  return (
    <div className="coin-avatar-group-specimen">
      <div className="coin-avatar-group-visual" aria-hidden="true">
        <SkeletonGroup loading={loadingIndex >= 0}>
          <AvatarGroup modes={modes} testID={testPrefix ? `${testPrefix}-root` : undefined}>
            {people.map((person, index) => (
              <Avatar
                key={person.monogram}
                style="Monogram"
                monogram={person.monogram}
                loading={index === loadingIndex}
                testID={`${prefix}${index + 1}`}
              />
            ))}
          </AvatarGroup>
        </SkeletonGroup>
      </div>
    </div>
  )
}

type AnatomyMarker = {
  number: number
  left: number
  top: number
  fromX: number
  fromY: number
  toX: number
  toY: number
}

type AnatomyMeasures = {
  width: number
  height: number
  markers: AnatomyMarker[]
}

function useAnatomyMeasures(
  stageRef: RefObject<HTMLDivElement | null>,
  selector: string,
  kind: 'group' | 'avatar-pair',
) {
  const [measures, setMeasures] = useState<AnatomyMeasures>({
    width: 0,
    height: 0,
    markers: [],
  })

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    const measure = () => {
      const stageRect = stage.getBoundingClientRect()
      if (kind === 'avatar-pair') {
        const monogram = stage.querySelector<HTMLElement>('[data-testid="avatar-anatomy-monogram"]')
        const imageFrame = stage.querySelector<HTMLElement>('[data-testid="avatar-anatomy-image"]')
        const image = imageFrame?.querySelector<HTMLElement>('img') ?? imageFrame
        const monogramRect = monogram?.getBoundingClientRect()
        const imageRect = image?.getBoundingClientRect()

        if (monogramRect && imageRect) {
          const monoLeft = monogramRect.left - stageRect.left
          const monoTop = monogramRect.top - stageRect.top
          const monoCenterX = monoLeft + monogramRect.width / 2
          const monoCenterY = monoTop + monogramRect.height / 2
          const imageLeft = imageRect.left - stageRect.left
          const imageTop = imageRect.top - stageRect.top
          const imageCenterX = imageLeft + imageRect.width / 2
          const markers: AnatomyMarker[] = [
            {
              number: 1,
              left: monoLeft - 23,
              top: monoCenterY - 10,
              fromX: monoLeft - 5,
              fromY: monoCenterY,
              toX: monoLeft + 1,
              toY: monoCenterY,
            },
            {
              number: 2,
              left: monoLeft + monogramRect.width + 5,
              top: monoCenterY - 10,
              fromX: monoLeft + monogramRect.width + 5,
              fromY: monoCenterY,
              toX: monoCenterX,
              toY: monoCenterY,
            },
            {
              number: 3,
              left: imageCenterX - 10,
              top: Math.max(6, imageTop - 34),
              fromX: imageCenterX,
              fromY: Math.max(6, imageTop - 34) + 20,
              toX: imageCenterX,
              toY: imageTop + 1,
            },
          ]
          setMeasures({ width: stageRect.width, height: stageRect.height, markers })
        }
        return
      }

      const targets = Array.from(stage.querySelectorAll<HTMLElement>(selector))
      const markers = targets.map((target, index) => {
        const rect = target.getBoundingClientRect()
        const left = rect.left - stageRect.left
        const top = rect.top - stageRect.top
        const centerX = left + rect.width / 2
        const centerY = top + rect.height / 2

        if (index === 1 && targets.length > 1) {
          const firstRect = targets[0].getBoundingClientRect()
          const firstCenterX = firstRect.left - stageRect.left + firstRect.width / 2
          const secondCenterX = centerX
          const seamCenterY = firstRect.top - stageRect.top + firstRect.height / 2
          const firstRadius = firstRect.width / 2
          const secondRadius = rect.width / 2
          const border = Number.parseFloat(window.getComputedStyle(target).borderWidth) || 0
          const renderedScale = target.offsetWidth > 0 ? rect.width / target.offsetWidth : 1
          const secondBorder = border * renderedScale
          const cutoutRadius = secondRadius + secondBorder
          const centerDistance = Math.max(0.001, Math.abs(secondCenterX - firstCenterX))
          const seamOffsetX = (centerDistance * centerDistance + firstRadius * firstRadius - cutoutRadius * cutoutRadius) / (2 * centerDistance)
          const seamOffsetY = Math.sqrt(Math.max(0, firstRadius * firstRadius - seamOffsetX * seamOffsetX))
          const seamX = firstCenterX + seamOffsetX
          const seamY = seamCenterY - seamOffsetY
          const markerSize = kind === 'group' ? 24 : 20
          const markerTop = Math.max(6, seamY - 36)
          return {
            number: index + 1,
            left: seamX - markerSize / 2,
            top: markerTop,
            fromX: seamX,
            fromY: markerTop + markerSize,
            toX: seamX,
            toY: seamY,
          }
        }

        const markerSize = kind === 'group' ? 24 : 20
        const markerTop = Math.max(6, top - 36)
        const markerCenterX = index === 0 ? centerX - 18 : centerX
        return {
          number: index + 1,
          left: markerCenterX - markerSize / 2,
          top: markerTop,
          fromX: markerCenterX,
          fromY: markerTop + markerSize,
          toX: index === 0 ? left + 3 : centerX,
          toY: top + 1,
        }
      })

      setMeasures({
        width: stageRect.width,
        height: stageRect.height,
        markers,
      })
    }

    measure()
    const observer = typeof ResizeObserver === 'undefined'
      ? undefined
      : new ResizeObserver(measure)
    observer?.observe(stage)
    const observedTargets = kind === 'group'
      ? stage.querySelectorAll(selector)
      : stage.querySelectorAll('[data-testid="avatar-anatomy-monogram"], [data-testid="avatar-anatomy-image"]')
    observedTargets.forEach((target) => observer?.observe(target))
    window.addEventListener('resize', measure)

    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [kind, selector, stageRef])

  return measures
}

function AnatomyOverlay({ measures }: { measures: AnatomyMeasures }) {
  return (
    <>
      {measures.width > 0 && measures.height > 0 && (
        <svg
          className="coin-avatar-anatomy-leaders"
          viewBox={`0 0 ${measures.width} ${measures.height}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {measures.markers.map((marker) => (
            <line
              key={marker.number}
              x1={marker.fromX}
              y1={marker.fromY}
              x2={marker.toX}
              y2={marker.toY}
            />
          ))}
        </svg>
      )}
      {measures.markers.map((marker) => (
        <span
          key={marker.number}
          className="coin-avatar-anatomy-marker"
          style={{ left: marker.left, top: marker.top }}
          aria-hidden="true"
        >
          {marker.number}
        </span>
      ))}
    </>
  )
}

function AvatarGroupAnatomy() {
  const stageRef = useRef<HTMLDivElement>(null)
  const measures = useAnatomyMeasures(
    stageRef,
    '[data-testid^="avatar-group-anatomy-child-"]',
    'group',
  )

  return (
    <div className="coin-avatar-anatomy-stage coin-avatar-group-anatomy-stage" ref={stageRef}>
      <span className="coin-avatar-anatomy-zoom-note">Enlarged view · 1.7×</span>
      <div className="coin-avatar-anatomy-live coin-avatar-group-anatomy-live" aria-hidden="true">
        <AvatarGroup modes={avatarGroupModes('M')} testID="avatar-group-anatomy-root">
          {PEOPLE.slice(0, 3).map((person, index) => (
            <Avatar
              key={person.monogram}
              style="Monogram"
              monogram={person.monogram}
              testID={`avatar-group-anatomy-child-${index + 1}`}
            />
          ))}
        </AvatarGroup>
      </div>
      <AnatomyOverlay measures={measures} />
    </div>
  )
}

function AvatarAnatomy() {
  const stageRef = useRef<HTMLDivElement>(null)
  const measures = useAnatomyMeasures(stageRef, '', 'avatar-pair')

  return (
    <div className="coin-avatar-anatomy-stage coin-avatar-single-anatomy-stage" ref={stageRef}>
      <span className="coin-avatar-anatomy-zoom-note">Enlarged view · 1.35×</span>
      <div className="coin-avatar-anatomy-live coin-avatar-anatomy-pair" aria-hidden="true">
        <div className="coin-avatar-anatomy-sample">
          <GuideAvatar size="M" style="Monogram" monogram="MS" testID="avatar-anatomy-monogram" />
          <span>Monogram</span>
        </div>
        <div className="coin-avatar-anatomy-sample">
          <GuideAvatar size="M" style="Image" testID="avatar-anatomy-image" />
          <span>Image</span>
        </div>
      </div>
      <AnatomyOverlay measures={measures} />
    </div>
  )
}

function AvatarGroupCard({
  count = 3,
  size = 'M',
  testPrefix,
}: {
  count?: number
  size?: AvatarSize
  testPrefix?: string
}) {
  return (
    <Card variant="slim" modes={LIGHT_MODES}>
      <div className="coin-avatar-context-card">
        <div>
          <Card.Title>Shared savings</Card.Title>
          <Card.SupportText>People who can view this account</Card.SupportText>
        </div>
        <AvatarGroupSpecimen
          count={count}
          size={size}
          testPrefix={testPrefix}
        />
      </div>
    </Card>
  )
}

function AvatarCard({
  style = 'Monogram',
  monogram = 'MS',
  name = 'Account owner',
}: {
  style?: AvatarStyle
  monogram?: string
  name?: string
}) {
  return (
    <Card variant="slim" modes={LIGHT_MODES}>
      <div className="coin-avatar-context-card coin-avatar-person-card">
        <div className="coin-avatar-person-mark" aria-hidden="true">
          <GuideAvatar
            style={style}
            monogram={monogram}
          />
        </div>
        <div className="coin-avatar-person-copy">
          <Card.Title>{name}</Card.Title>
          <Card.SupportText>Shared savings account</Card.SupportText>
        </div>
      </div>
    </Card>
  )
}

function SourceList({
  figmaUrl,
  storybookUrl,
  stories,
}: {
  figmaUrl: string
  storybookUrl: string
  stories: readonly { label: string; url: string }[]
}) {
  return (
    <>
      <div className="sources-grid">
        <a href={figmaUrl} target="_blank" rel="noreferrer">
          <span className="source-index">01</span>
          <div>
            <h3>Coin Components Library</h3>
            <p>Public component master and exposed properties</p>
          </div>
          <span className="coin-avatar-source-arrow" aria-hidden="true">↗</span>
        </a>
        <a href={storybookUrl} target="_blank" rel="noreferrer">
          <span className="source-index">02</span>
          <div>
            <h3>Canonical Storybook</h3>
            <p>Docs page and public example behavior</p>
          </div>
          <span className="coin-avatar-source-arrow" aria-hidden="true">↗</span>
        </a>
      </div>
      <div className="coin-avatar-story-links">
        {stories.map((story) => (
          <a key={story.label} className="source-link" href={story.url} target="_blank" rel="noreferrer">
            {story.label}
            <span aria-hidden="true">↗</span>
          </a>
        ))}
      </div>
    </>
  )
}

export function AvatarGroupGuide() {
  const [count, setCount] = useState(3)
  const [size, setSize] = useState<AvatarSize>('M')
  const people = PEOPLE.slice(0, count)

  const sections: GuideSectionSlots = {
    anatomy: {
      header: 'Anatomy',
      title: 'Each child keeps its own face in the overlap',
      description:
        'The group layers its child Avatars in order. The last child sits in front, while a cutout keeps the next face visible.',
      body: (
        <div className="anatomy-card coin-avatar-anatomy-card">
          <AvatarGroupAnatomy />
          <ol className="anatomy-list">
            <li><b>First child</b><span>It starts at the back of the visual order and gives the group its first face.</span></li>
            <li><b>Overlap cutout</b><span>The group masks this edge of the first child so the next child’s circle remains clear.</span></li>
            <li><b>Last child</b><span>The final child is drawn in front. Child order therefore changes which face leads.</span></li>
          </ol>
        </div>
      ),
    },
    configuration: {
      header: 'Configuration',
      title: 'Change the shared size or the child content',
      description:
        'Avatar Size belongs to the group mode. The children supply the image or monogram; there is no separate count or gap control.',
      body: (
        <div className="coin-avatar-example-grid">
          <article className="coin-avatar-demo-card">
            <div className="coin-avatar-demo-stage"><AvatarGroupSpecimen count={2} size="L" /></div>
            <h3>Two large Avatars</h3>
            <p>The group places each child in order and keeps one shared owner size.</p>
          </article>
          <article className="coin-avatar-demo-card">
            <div className="coin-avatar-demo-stage"><AvatarGroupSpecimen count={4} size="S" /></div>
            <h3>Four compact Avatars</h3>
            <p>The group mode supplies one size to every child; each Avatar supplies its own image or monogram.</p>
          </article>
        </div>
      ),
    },
    states: {
      header: 'States',
      title: 'Content and loading belong to each Avatar',
      description:
        'Avatar Group does not add a selected, disabled, or loading state. A child can be loading while the others remain visible.',
      body: (
        <div className="coin-avatar-example-grid">
          <article className="coin-avatar-demo-card">
            <div className="coin-avatar-demo-stage"><AvatarGroupSpecimen count={3} size="M" /></div>
            <h3>All Avatars ready</h3>
            <p>The group stays a compact composition of the children it receives.</p>
          </article>
          <article className="coin-avatar-demo-card">
            <div className="coin-avatar-demo-stage"><AvatarGroupSpecimen count={3} size="M" loadingIndex={1} /></div>
            <h3>One child is loading</h3>
            <p>The loading child shows a same-size skeleton while the other Avatar children remain visible.</p>
          </article>
        </div>
      ),
    },
    sizing: {
      header: 'Sizing',
      title: 'The host needs room for every child',
      description:
        'The row grows with its child count. A narrower host does not reduce Avatar Size automatically, so select a supported size that fits.',
      body: (
        <div className="coin-avatar-sizing-grid">
          <article className="coin-avatar-sizing-card">
            <span>Wider host · 196 px</span>
            <div className="coin-avatar-host coin-avatar-host-wide"><AvatarGroupSpecimen count={4} size="M" /></div>
            <strong>M · four children</strong>
          </article>
          <article className="coin-avatar-sizing-card">
            <span>Narrow host · 112 px</span>
            <div className="coin-avatar-host coin-avatar-host-narrow"><AvatarGroupSpecimen count={4} size="S" /></div>
            <strong>S · four children</strong>
          </article>
        </div>
      ),
    },
    content: {
      header: 'Content',
      title: 'Compose the group from Avatar children',
      description:
        'AvatarGroup contains an ordered row of Avatar children. Each child supplies its own image or monogram content.',
      body: (
        <div className="content-guidance-grid coin-avatar-content-grid">
          <article className="content-rule content-rule-featured">
            <span aria-hidden="true">01</span>
            <h3>Use Avatar children</h3>
            <p>The group’s content is the Avatar instances supplied inside it.</p>
            <div className="rule-example coin-avatar-rule-example"><AvatarGroupSpecimen count={3} size="M" /></div>
          </article>
          <article className="content-rule"><span aria-hidden="true">02</span><h3>Choose each child’s content</h3><p>Each Avatar can show its own image or monogram.</p></article>
          <article className="content-rule"><span aria-hidden="true">03</span><h3>Order the children intentionally</h3><p>The last child sits in front in the overlapping group.</p></article>
        </div>
      ),
    },
    context: {
      header: 'In context',
      title: 'Show who can access a shared account',
      description:
        'A public Coin Card can wrap its title, support text, and AvatarGroup in one composition. The group itself contains only its Avatar children.',
      body: (
        <div className="coin-avatar-context-wrap">
          <AvatarGroupCard count={3} size="M" />
          <p className="coin-avatar-context-caption">The Card adds optional context outside the AvatarGroup component.</p>
        </div>
      ),
    },
    'dos-donts': {
      header: 'Do & Don’ts',
      title: 'Respect shared size and host width',
      description:
        'AvatarGroup derives its members from child Avatars. Its owner mode can size them together, and their count determines the row width.',
      body: (
        <div className="comparison-stack coin-avatar-comparison-stack">
          <div className="comparison-row">
            <article className="comparison-card do-card">
              <p className="comparison-label">Do</p>
              <div className="comparison-preview coin-avatar-comparison-preview"><AvatarGroupSpecimen count={3} size="M" /></div>
              <h3>Set one owner size</h3>
              <p>All three children inherit M from AvatarGroup.</p>
            </article>
            <article className="comparison-card dont-card">
              <p className="comparison-label">Don’t</p>
              <div className="comparison-preview coin-avatar-comparison-preview">
                <div className="coin-avatar-override-demo">
                  <MixedAvatarGroup />
                  <span className="coin-avatar-override-note"><b>3</b> Child mode L</span>
                </div>
              </div>
              <h3>Override a child’s size</h3>
              <p>An explicit L child mode takes precedence over the group’s M mode.</p>
            </article>
          </div>
          <div className="comparison-row">
            <article className="comparison-card do-card">
              <p className="comparison-label">Do</p>
              <div className="comparison-preview coin-avatar-comparison-preview">
                <div className="coin-avatar-count-demo">
                  <span className="coin-avatar-host-label">112 px host</span>
                  <div className="coin-avatar-host coin-avatar-host-narrow"><AvatarGroupSpecimen count={3} size="M" /></div>
                </div>
              </div>
              <h3>Fit three M children</h3>
              <p>All three circles stay inside the visible 112 px host.</p>
            </article>
            <article className="comparison-card dont-card">
              <p className="comparison-label">Don’t</p>
              <div className="comparison-preview coin-avatar-comparison-preview">
                <div className="coin-avatar-count-demo">
                  <span className="coin-avatar-host-label">112 px host</span>
                  <div className="coin-avatar-host coin-avatar-host-narrow"><AvatarGroupSpecimen count={5} size="M" /></div>
                </div>
              </div>
              <h3>Overfill a fixed host</h3>
              <p>This five-child row extends past both edges, so the host clips its outer Avatars.</p>
            </article>
          </div>
        </div>
      ),
    },
    sources: {
      header: 'Sources',
      title: 'Follow the public slot and mode contract',
      description:
        'The guide uses the Coin component master, the canonical Storybook examples, and the installed public implementation.',
      body: (
        <>
          <SourceList figmaUrl={AVATAR_GROUP_FIGMA} storybookUrl={AVATAR_GROUP_STORYBOOK} stories={AVATAR_GROUP_STORIES} />
          <div className="verification-note">
            <span>Checked 23 September 2026</span>
            <p>
              The declared and installed <code>jfs-components</code> version is <code>0.1.60</code>; the earlier registry check on 23 September also returned <code>0.1.60</code>. A fresh registry lookup could not be confirmed during recovery because registry DNS was unavailable. Figma’s Avatar Size mode sets L/M/S/XS to 42/36/29/14 px. The public group derives its count from children and uses token-owned overlap; it exposes no count or gap choice. Storybook’s custom-gap example has no gap control. Keep child sizes aligned with the group owner.
            </p>
          </div>
        </>
      ),
    },
  }

  return (
    <ComponentGuideTemplate
      metadata={{
        slug: 'avatargroup',
        name: 'Avatar Group',
        summary: 'Show several people or identities as one compact visual cue.',
        corePrinciple: 'Share one size across the Avatar children.',
        figmaUrl: AVATAR_GROUP_FIGMA,
        storybookUrl: AVATAR_GROUP_STORYBOOK,
      }}
      playground={
        <>
          <div className="preview-stage coin-avatar-preview-stage">
            <div className="coin-avatar-preview-content">
              <AvatarGroupSpecimen count={count} size={size} />
              <p className="preview-note" aria-live="polite">{count} people · Avatar Size {size}</p>
            </div>
            <span className="stage-label">Live Coin AvatarGroup</span>
          </div>
          <div className="controls-panel coin-avatar-controls-panel">
            <Segment label="Avatar Size mode" value={size} options={['L', 'M', 'S'] as const} onChange={setSize} />
            <label className="text-control">
              <span>Child count</span>
              <select value={count} onChange={(event) => setCount(Number(event.target.value))}>
                {[2, 3, 4, 5].map((value) => <option key={value} value={value}>{value} people</option>)}
              </select>
            </label>
            <div className="coin-avatar-readout" aria-live="polite">
              <span>Group content</span>
              <strong>{people.map((person) => person.monogram).join(' · ')}</strong>
              <p>Each Avatar child contributes one visible identity.</p>
            </div>
          </div>
        </>
      }
      sections={sections}
    />
  )
}

function MixedAvatarGroup() {
  const groupModes = avatarGroupModes('M')
  const oversizedChildModes = avatarModes('L')
  return (
    <div className="coin-avatar-group-specimen">
      <div className="coin-avatar-group-visual" aria-hidden="true">
        <AvatarGroup modes={groupModes}>
          <Avatar style="Monogram" monogram="MS" />
          <Avatar style="Monogram" monogram="AK" />
          <Avatar style="Monogram" monogram="LS" modes={oversizedChildModes} />
        </AvatarGroup>
      </div>
    </div>
  )
}

export function AvatarGuide() {
  const [style, setStyle] = useState<AvatarStyle>('Monogram')
  const [size, setSize] = useState<AvatarSize>('M')
  const [monogram, setMonogram] = useState('MS')
  const monogramOptions = size === 'XS'
    ? PEOPLE.slice(0, 3).map((person) => person.monogram.slice(0, 1))
    : PEOPLE.slice(0, 3).map((person) => person.monogram)

  const changeAvatarSize = (nextSize: AvatarSize) => {
    setSize(nextSize)
    setMonogram((current) => {
      if (nextSize === 'XS') return current.slice(0, 1)
      if (current.length > 1) return current
      return PEOPLE.find((person) => person.monogram.startsWith(current))?.monogram ?? current
    })
  }

  const sections: GuideSectionSlots = {
    anatomy: {
      header: 'Anatomy',
      title: 'A circular frame holds an image or initials',
      description:
        'Avatar keeps the outer size and shape while its content style changes. The markers point to the real component instance.',
      body: (
        <div className="anatomy-card coin-avatar-anatomy-card">
          <AvatarAnatomy />
          <ol className="anatomy-list">
            <li><b>Circle and border</b><span>Avatar Size sets the token-owned width and height; its default radius resolves to a circle.</span></li>
            <li><b>Monogram content</b><span>The Monogram style centers the supplied text and uses Avatar label tokens.</span></li>
            <li><b>Image content</b><span>The Image style crops a supplied image source into the same circular frame.</span></li>
          </ol>
        </div>
      ),
    },
    configuration: {
      header: 'Configuration',
      title: 'Choose Image or Monogram',
      description:
        'Style selects which content is rendered. Monogram uses its text property; Image uses imageSource and otherwise shows the package fallback.',
      body: (
        <div className="coin-avatar-example-grid">
          <article className="coin-avatar-demo-card">
            <div className="coin-avatar-demo-stage"><AvatarVisual style="Image" /></div>
            <h3>Image</h3>
            <p>Provide an image source that represents this person. The bundled fallback is only a preview when no source is supplied.</p>
          </article>
          <article className="coin-avatar-demo-card">
            <div className="coin-avatar-demo-stage"><AvatarVisual style="Monogram" monogram="AK" /></div>
            <h3>Monogram</h3>
            <p>Use a short, recognizable set of initials when a portrait is not available.</p>
          </article>
        </div>
      ),
    },
    states: {
      header: 'States',
      title: 'Loading preserves the selected size',
      description:
        'Loading is a runtime state supplied through SkeletonGroup, not a style or size variant. It replaces the identity content with a same-size neutral placeholder.',
      body: (
        <div className="coin-avatar-example-grid">
          <article className="coin-avatar-demo-card">
            <div className="coin-avatar-demo-stage"><AvatarVisual style="Monogram" monogram="MS" /></div>
            <h3>Ready</h3>
            <p>The image or monogram remains inside the chosen Avatar Size.</p>
          </article>
          <article className="coin-avatar-demo-card">
            <div className="coin-avatar-demo-stage"><AvatarVisual style="Monogram" monogram="MS" loading /></div>
            <h3>Loading · neutral placeholder</h3>
            <p>The token-backed Skeleton circle is expected while the image or monogram is unavailable.</p>
          </article>
        </div>
      ),
    },
    sizing: {
      header: 'Sizing',
      title: 'Pick one of the four Avatar Size modes',
      description:
        'The modes resolve to token-owned dimensions. A surrounding card or row can provide room, but it does not stretch Avatar automatically.',
      body: (
        <div className="coin-avatar-size-grid">
          {([
            ['L', '42 px'],
            ['M', '36 px'],
            ['S', '29 px'],
            ['XS', '14 px · one letter'],
          ] as const).map(([sizeMode, dimension]) => (
            <article className="coin-avatar-size-card" key={sizeMode}>
              <div className="coin-avatar-size-preview"><GuideAvatar size={sizeMode} monogram={sizeMode === 'XS' ? 'M' : 'MS'} /></div>
              <strong>{sizeMode === 'XS' ? 'XS · M' : sizeMode}</strong>
              <span>{dimension}</span>
            </article>
          ))}
        </div>
      ),
    },
    content: {
      header: 'Content',
      title: 'Avatar content is an image or monogram text',
      description:
        'Set Style to Image or Monogram, then supply the matching image source or monogram text.',
      body: (
        <div className="content-guidance-grid coin-avatar-content-grid">
          <article className="content-rule content-rule-featured">
            <span aria-hidden="true">01</span>
            <h3>Use monogram text</h3>
            <p>Supply initials for a compact text based identity.</p>
            <div className="rule-example coin-avatar-rule-example"><AvatarVisual style="Monogram" monogram="MS" /></div>
          </article>
          <article className="content-rule"><span aria-hidden="true">02</span><h3>Supply image content</h3><p>Set <code>imageSource</code> to the intended image.</p><div className="coin-avatar-content-sample"><AvatarVisual style="Image" /></div></article>
          <article className="content-rule"><span aria-hidden="true">03</span><h3>Use one letter at XS</h3><p>The XS example shows a single monogram letter.</p><div className="coin-avatar-content-sample"><AvatarVisual style="Monogram" monogram="M" size="XS" /></div></article>
        </div>
      ),
    },
    context: {
      header: 'In context',
      title: 'Identify an account owner at a glance',
      description:
        'A surrounding Card may add a name or role when the layout calls for it; Avatar does not require nearby text.',
      body: (
        <div className="coin-avatar-context-wrap">
          <AvatarCard style="Monogram" monogram="MS" />
          <p className="coin-avatar-context-caption">The Card adds optional context outside Avatar.</p>
        </div>
      ),
    },
    'dos-donts': {
      header: 'Do & Don’ts',
      title: 'Give every identity meaningful content',
      description:
        'The repeated fallback looks like one person even when it is used for several different accounts.',
      body: (
        <div className="comparison-row coin-avatar-comparison-row">
          <article className="comparison-card do-card">
            <p className="comparison-label">Do</p>
            <div className="comparison-preview coin-avatar-comparison-preview">
              <AvatarVisual style="Monogram" monogram="MS" />
              <AvatarVisual style="Monogram" monogram="AK" />
            </div>
            <h3>Use a portrait or clear initials</h3>
            <p>Each Avatar shows its own portrait or monogram content.</p>
          </article>
          <article className="comparison-card dont-card">
            <p className="comparison-label">Don’t</p>
            <div className="comparison-preview coin-avatar-comparison-preview coin-avatar-fallback-pair">
              <AvatarVisual style="Image" />
              <AvatarVisual style="Image" />
            </div>
            <h3>Reuse the built-in fallback for different people</h3>
            <p>Both images resolve to the same bundled fallback and cannot distinguish separate identities.</p>
          </article>
        </div>
      ),
    },
    sources: {
      header: 'Sources',
      title: 'Use the public style, text, image, and size choices',
      description:
        'The guide compares the exposed Figma property with the installed package and the canonical published stories.',
      body: (
        <>
          <SourceList figmaUrl={AVATAR_FIGMA} storybookUrl={AVATAR_STORYBOOK} stories={AVATAR_STORIES} />
          <div className="verification-note">
            <span>Checked 23 September 2026</span>
            <p>
              The declared and installed <code>jfs-components</code> version is <code>0.1.60</code>; the earlier registry check on 23 September also returned <code>0.1.60</code>. A fresh registry lookup could not be confirmed during recovery because registry DNS was unavailable. Figma exposes Image and Monogram plus monogram text; Storybook also demonstrates size and remote-image examples. Supply a person-specific <code>imageSource</code>; the package fallback is only a preview. Loading replaces Avatar content with a neutral, token-backed Skeleton inside an active <code>SkeletonGroup</code>. This version drops its typed accessibility label and keeps role <code>image</code> on the press wrapper, so examples remain non-interactive.
            </p>
          </div>
        </>
      ),
    },
  }

  return (
    <ComponentGuideTemplate
      metadata={{
        slug: 'avatar',
        name: 'Avatar',
        summary: 'Represent one person or account with an image or initials.',
        corePrinciple: 'Use a real image when available; use a short monogram otherwise.',
        figmaUrl: AVATAR_FIGMA,
        storybookUrl: AVATAR_STORYBOOK,
      }}
      playground={
        <>
          <div className="preview-stage coin-avatar-preview-stage">
            <div className="coin-avatar-preview-content">
              <div className="coin-avatar-playground-specimen" aria-hidden="true">
                <GuideAvatar style={style} monogram={monogram} size={size} />
              </div>
              <p className="preview-note" aria-live="polite">
                {style === 'Image' ? 'Image style · bundled fallback preview' : `Monogram ${monogram}`} · Avatar Size {size}
              </p>
            </div>
            <span className="stage-label">Live Coin Avatar</span>
          </div>
          <div className="controls-panel coin-avatar-controls-panel">
            <Segment label="Style" value={style} options={['Image', 'Monogram'] as const} onChange={setStyle} />
            <Segment label="Avatar Size mode" value={size} options={AVATAR_SIZES} onChange={changeAvatarSize} />
            <label className="text-control">
              <span>{size === 'XS' ? 'Monogram letter' : 'Monogram'}</span>
              <select value={monogram} disabled={style !== 'Monogram'} onChange={(event) => setMonogram(event.target.value)}>
                {monogramOptions.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </label>
          </div>
        </>
      }
      sections={sections}
    />
  )
}

function AvatarVisual({
  style,
  monogram = 'MS',
  size = 'M',
  loading = false,
}: {
  style: AvatarStyle
  monogram?: string
  size?: AvatarSize
  loading?: boolean
}) {
  return (
    <div className="coin-avatar-visual" aria-hidden="true">
      <GuideAvatar style={style} monogram={monogram} size={size} loading={loading} />
    </div>
  )
}

export function isAvatarGroupLocation() {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).get('component') === 'avatargroup'
}

export function isAvatarLocation() {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).get('component') === 'avatar'
}

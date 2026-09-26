import { useMemo, useState } from 'react'
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
import { Anatomy, Segment, Sources, Specimen, SpecimenRow, byTestId } from './guide-kit'

const FIGMA_FILE =
  'https://www.figma.com/design/3z7bmhA73Ls7j8Eu4qhYhE/Coin-Components-Library'
const AVATAR_GROUP_FIGMA = `${FIGMA_FILE}?node-id=1366-15672`
const AVATAR_FIGMA = `${FIGMA_FILE}?node-id=1-37658`
const AVATAR_GROUP_STORYBOOK =
  'https://jfs-components-storybook.vercel.app/?path=/docs/components-avatargroup--docs'
const AVATAR_STORYBOOK =
  'https://jfs-components-storybook.vercel.app/?path=/docs/components-avatar--docs'
const AVATAR_GROUP_STORIES = [
  { label: 'Default group', id: 'components-avatargroup--default' },
  { label: 'Large size', id: 'components-avatargroup--large-size' },
  { label: 'Custom gap', id: 'components-avatargroup--custom-gap' },
]
const AVATAR_STORIES = [
  { label: 'Image style', id: 'components-avatar--image' },
  { label: 'Monogram style', id: 'components-avatar--monogram' },
  { label: 'Size modes', id: 'components-avatar--sizes' },
  { label: 'Remote image', id: 'components-avatar--remote-image' },
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
        <Anatomy
          title="Avatar Group"
          parts={[
            { name: 'First child', note: 'It starts at the back of the visual order and gives the group its first face.', target: byTestId('avatar-group-anatomy-child-1'), side: 'top' },
            { name: 'Middle child', note: 'It overlaps the first child and sits behind the last.', target: byTestId('avatar-group-anatomy-child-2'), side: 'top' },
            { name: 'Last child', note: 'The final child is drawn in front. Child order therefore changes which face leads.', target: byTestId('avatar-group-anatomy-child-3'), side: 'top' },
          ]}
        >
          <AvatarGroup modes={avatarGroupModes('M')}>
            {PEOPLE.slice(0, 3).map((person, index) => (
              <Avatar
                key={person.monogram}
                style="Monogram"
                monogram={person.monogram}
                testID={`avatar-group-anatomy-child-${index + 1}`}
              />
            ))}
          </AvatarGroup>
        </Anatomy>
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
        <Sources
          checked="23 September 2026"
          figmaUrl={AVATAR_GROUP_FIGMA}
          figmaDescription="Public component master and exposed properties"
          storybookUrl={AVATAR_GROUP_STORYBOOK}
          storybookDescription="Docs page and public example behavior"
          stories={AVATAR_GROUP_STORIES}
        >
          The declared and installed <code>jfs-components</code> version is <code>0.1.60</code>; the earlier registry check on 23 September also returned <code>0.1.60</code>. A fresh registry lookup could not be confirmed during recovery because registry DNS was unavailable. Figma’s Avatar Size mode sets L/M/S/XS to 42/36/29/14 px. The public group derives its count from children and uses token-owned overlap; it exposes no count or gap choice. Storybook’s custom-gap example has no gap control. Keep child sizes aligned with the group owner.
        </Sources>
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
        <Anatomy
          title="Avatar"
          parts={[
            { name: 'Circle and border', note: 'Avatar Size sets the token-owned width and height; its default radius resolves to a circle.', target: byTestId('avatar-anatomy-monogram'), side: 'left' },
            { name: 'Monogram content', note: 'The Monogram style centers the supplied text and uses Avatar label tokens.', target: `${byTestId('avatar-anatomy-monogram')} [dir="auto"]`, side: 'top' },
            { name: 'Image content', note: 'The Image style crops a supplied image source into the same circular frame.', target: `${byTestId('avatar-anatomy-image')} img`, side: 'top' },
          ]}
        >
          <SpecimenRow>
            <Specimen caption="Monogram">
              <GuideAvatar size="M" style="Monogram" monogram="MS" testID="avatar-anatomy-monogram" />
            </Specimen>
            <Specimen caption="Image">
              <GuideAvatar size="M" style="Image" testID="avatar-anatomy-image" />
            </Specimen>
          </SpecimenRow>
        </Anatomy>
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
        <Sources
          checked="23 September 2026"
          figmaUrl={AVATAR_FIGMA}
          figmaDescription="Public component master and exposed properties"
          storybookUrl={AVATAR_STORYBOOK}
          storybookDescription="Docs page and public example behavior"
          stories={AVATAR_STORIES}
        >
          The declared and installed <code>jfs-components</code> version is <code>0.1.60</code>; the earlier registry check on 23 September also returned <code>0.1.60</code>. A fresh registry lookup could not be confirmed during recovery because registry DNS was unavailable. Figma exposes Image and Monogram plus monogram text; Storybook also demonstrates size and remote-image examples. Supply a person-specific <code>imageSource</code>; the package fallback is only a preview. Loading replaces Avatar content with a neutral, token-backed Skeleton inside an active <code>SkeletonGroup</code>. This version drops its typed accessibility label and keeps role <code>image</code> on the press wrapper, so examples remain non-interactive.
        </Sources>
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


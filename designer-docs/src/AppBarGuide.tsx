import { useMemo, useState, type ReactNode } from 'react'
import { Text as NativeText } from 'react-native'
import {
  AppBar,
  Avatar,
  Button,
  IconButton,
  JioDot,
  Screen,
  Text,
  VStack,
  type Modes,
} from 'jfs-components'
import {
  ComponentGuideTemplate,
  type GuideSectionSlots,
} from './ComponentGuideTemplate'
import { Anatomy, Segment, Sources, byTestId } from './guide-kit'

const FIGMA_URL =
  'https://www.figma.com/design/3z7bmhA73Ls7j8Eu4qhYhE/Coin-Components-Library?node-id=1070-18571'
const STORYBOOK_URL =
  'https://jfs-components-storybook.vercel.app/?path=/docs/components-appbar--docs'
const STORYBOOK_STORIES = [
  { label: 'Open default story', id: 'components-appbar--default' },
  { label: 'Open MainPage story', id: 'components-appbar--main-page' },
  { label: 'Open SubPage story', id: 'components-appbar--sub-page' },
  { label: 'Open long-title story', id: 'components-appbar--sub-page-long-title' },
  { label: 'Open progress story', id: 'components-appbar--sub-page-with-linear-progress' },
] as const

type ColorMode = 'Light' | 'Dark'
type AppBarType = 'MainPage' | 'SubPage'
type ActionName = 'Hello Jio' | 'More options' | 'Go back' | 'Add item'

function classes(...values: Array<string | false | undefined>) {
  return values.filter(Boolean).join(' ')
}

function appBarModes(colorMode: ColorMode, type: AppBarType): Modes {
  return {
    'Color Mode': colorMode,
    Context2: 'AppBar',
    'Page type': type,
  } as Modes
}

function appBarActionModes(colorMode: ColorMode, type: AppBarType): Modes {
  return {
    ...appBarModes(colorMode, type),
    Emphasis: 'Low',
  } as Modes
}

function contentModes(colorMode: ColorMode = 'Light'): Modes {
  return {
    'Color Mode': colorMode,
    'Page type': 'MainPage',
  } as Modes
}

function buttonModes(colorMode: ColorMode = 'Light'): Modes {
  return {
    'Color Mode': colorMode,
    'Page type': 'MainPage',
    'Button / Size': 'S',
    'Button / State': 'Idle',
    'Semantic Intent': 'Brand',
    AppearanceBrand: 'Primary',
    Emphasis: 'High',
    Context4: 'Button',
  } as Modes
}

function ActionButtons({
  modes,
  disabled,
  onAction,
  includeAdd = false,
  includeMore = true,
}: {
  modes: Modes
  disabled?: boolean
  onAction?: (action: ActionName) => void
  includeAdd?: boolean
  includeMore?: boolean
}) {
  return [
    includeAdd ? (
      <IconButton
        key="add-item"
        iconName="ic_add"
        modes={modes}
        disabled={disabled}
        accessibilityLabel="Add item"
        onPress={() => onAction?.('Add item')}
      />
    ) : null,
    <IconButton
      key="hello-jio"
      iconName="ic_hellojio"
      modes={modes}
      disabled={disabled}
      accessibilityLabel="Open Hello Jio"
      onPress={() => onAction?.('Hello Jio')}
    />,
    includeMore ? (
      <IconButton
        key="more-options"
        iconName="ic_more_horizontal"
        modes={modes}
        disabled={disabled}
        accessibilityLabel="More options"
        onPress={() => onAction?.('More options')}
      />
    ) : null,
  ]
}

function TitleText({
  children,
  modes,
  testID,
}: {
  children: ReactNode
  modes?: Modes
  testID?: string
}) {
  return (
    <NativeText
      numberOfLines={1}
      testID={testID}
      style={{
        fontSize: 16,
        fontWeight: 'bold',
        color: modes?.['Color Mode'] === 'Dark' ? '#FFF' : '#000',
      }}
    >
      {children}
    </NativeText>
  )
}

function MainPageStoryExample({ colorMode = 'Light' }: { colorMode?: ColorMode }) {
  const modes = useMemo(() => appBarModes(colorMode, 'MainPage'), [colorMode])
  const actionModes = useMemo(() => appBarActionModes(colorMode, 'MainPage'), [colorMode])

  return (
    <div className="appbar-example appbar-main-page-story-example">
      <AppBar
        type="MainPage"
        leadingSlot={<JioDot modes={modes} />}
        actionsSlot={[
          <IconButton
            key="main-add"
            iconName="ic_add"
            modes={actionModes}
            accessibilityLabel="Add item"
          />,
          <Avatar key="main-avatar" modes={modes} />,
        ]}
        modes={modes}
        accessibilityLabel="App bar"
        style={{ width: '100%' }}
      />
    </div>
  )
}

function AppBarExample({
  type,
  colorMode = 'Light',
  title = 'Page title',
  includeJioDot = false,
  showActions = true,
  includeAdd = false,
  includeMore = true,
  actionsDisabled = false,
  suppliedBack = true,
  onAction,
  className,
}: {
  type: AppBarType
  colorMode?: ColorMode
  title?: string
  includeJioDot?: boolean
  showActions?: boolean
  includeAdd?: boolean
  includeMore?: boolean
  actionsDisabled?: boolean
  suppliedBack?: boolean
  onAction?: (action: ActionName) => void
  className?: string
}) {
  const modes = useMemo(() => appBarModes(colorMode, type), [colorMode, type])
  const actionModes = useMemo(() => appBarActionModes(colorMode, type), [colorMode, type])
  const resolvedTitle = title.trim() || 'Page title'
  const leadingSlot =
    type === 'MainPage' ? (
      includeJioDot ? <JioDot /> : undefined
    ) : suppliedBack ? (
      <IconButton
        iconName="ic_arrow_back"
        modes={actionModes}
        accessibilityLabel="Go back"
        onPress={() => onAction?.('Go back')}
      />
    ) : undefined
  const actionsSlot = showActions
    ? ActionButtons({ modes: actionModes, disabled: actionsDisabled, onAction, includeAdd, includeMore })
    : undefined

  return (
    <div className={classes('appbar-example', className)}>
      <AppBar
        type={type}
        leadingSlot={leadingSlot}
        middleSlot={
          <TitleText modes={modes}>{resolvedTitle}</TitleText>
        }
        actionsSlot={actionsSlot}
        modes={modes}
        accessibilityLabel="App bar"
        style={{ width: '100%' }}
      />
    </div>
  )
}

function AppBarAnatomy() {
  const modes = useMemo(() => appBarModes('Light', 'SubPage'), [])
  const actionModes = useMemo(() => appBarActionModes('Light', 'SubPage'), [])

  return (
    <Anatomy
      title="App Bar"
      specimenWidth={360}
      parts={[
        { name: 'Leading', note: 'Back or a product mark establishes where the page sits in the flow.', target: byTestId('appbar-anatomy-leading'), side: 'left' },
        { name: 'Middle', note: 'The SubPage title stays centered inside the 192px middle slot.', target: byTestId('appbar-anatomy-middle'), side: 'top' },
        { name: 'Actions', note: 'Use a small set of public actions that support the current page.', target: byTestId('appbar-anatomy-actions'), side: 'right' },
      ]}
    >
      <AppBar
        type="SubPage"
        modes={modes}
        middleSlot={
          <TitleText modes={modes} testID="appbar-anatomy-middle">
            Page title
          </TitleText>
        }
        leadingSlot={
          <IconButton
            iconName="ic_arrow_back"
            modes={actionModes}
            accessibilityLabel="Go back"
            testID="appbar-anatomy-leading"
          />
        }
        actionsSlot={[
          <IconButton
            key="anatomy-actions"
            iconName="ic_more_horizontal"
            modes={actionModes}
            accessibilityLabel="More options"
            testID="appbar-anatomy-actions"
          />,
        ]}
        style={{ width: '100%' }}
      />
    </Anatomy>
  )
}

function ContextExample() {
  const [screen, setScreen] = useState<'Overview' | 'Transactions'>('Overview')
  const colorMode: ColorMode = 'Light'
  const barModes = useMemo(() => appBarModes(colorMode, 'SubPage'), [])
  const actionModes = useMemo(() => appBarActionModes(colorMode, 'SubPage'), [])
  const bodyModes = useMemo(() => contentModes(colorMode), [])
  const title = screen === 'Overview' ? 'Overview' : 'Transactions'

  return (
    <div className="appbar-context-screen">
      <Screen modes={bodyModes} style={{ width: '100%', minHeight: 270 }}>
        <AppBar
          type="SubPage"
          modes={barModes}
          leadingSlot={
            <IconButton
              iconName="ic_arrow_back"
              modes={actionModes}
              accessibilityLabel="Go back"
              onPress={() => setScreen('Overview')}
            />
          }
          middleSlot={<TitleText modes={barModes}>{title}</TitleText>}
          actionsSlot={
            <IconButton
              iconName="ic_more_horizontal"
              modes={actionModes}
              accessibilityLabel="More options"
              onPress={() => setScreen('Transactions')}
            />
          }
          style={{ width: '100%' }}
        />
        <VStack
          modes={{ ...bodyModes, Padding: 'Default', 'Slot gap': 'M' } as Modes}
          style={{ width: '100%' }}
        >
          <Text
            text={
              screen === 'Overview'
                ? 'See recent payments and transfers from this page.'
                : 'Review recent payments and transfers before continuing.'
            }
            modes={bodyModes}
          />
          <Button
            label={screen === 'Overview' ? 'Open transactions' : 'Back to overview'}
            modes={buttonModes()}
            onPress={() => setScreen(screen === 'Overview' ? 'Transactions' : 'Overview')}
            accessibilityLabel={screen === 'Overview' ? 'Open transactions' : 'Back to overview'}
          />
        </VStack>
      </Screen>
      <p className="appbar-context-status" aria-live="polite">
        Current page: <strong>{screen}</strong>
      </p>
    </div>
  )
}

export function AppBarGuide() {
  const [type, setType] = useState<AppBarType>('SubPage')
  const [colorMode, setColorMode] = useState<ColorMode>('Light')
  const [title, setTitle] = useState('Page title')
  const [showActions, setShowActions] = useState(true)
  const [showJioDot, setShowJioDot] = useState(true)
  const [actionsDisabled, setActionsDisabled] = useState(false)
  const [lastAction, setLastAction] = useState('No action yet')

  const sections: GuideSectionSlots = {
    anatomy: {
      header: 'Anatomy',
      title: 'Three slots give the bar its hierarchy',
      description:
        'The leading slot orients people, the centered middle slot identifies the page, and the actions slot keeps only relevant actions in reach.',
      body: (
        <AppBarAnatomy />
      ),
    },
    configuration: {
      header: 'Configuration',
      title: 'Choose the page relationship first',
      description:
        'MainPage gives a view its identity. SubPage supplies a back relationship and centers its title independently from the side slots.',
      body: (
        <div className="appbar-configuration-grid">
          <article className="configuration-block appbar-config-card">
            <p className="eyebrow">MainPage</p>
            <h3>Use the canonical MainPage identity</h3>
            <div className="appbar-config-preview">
              <MainPageStoryExample />
            </div>
            <p>The published MainPage story pairs JioDot with low-emphasis add and Avatar actions and leaves the middle slot empty.</p>
          </article>
          <article className="configuration-block appbar-config-card">
            <p className="eyebrow">SubPage</p>
            <h3>Supply an accessible back action</h3>
            <div className="appbar-config-preview">
              <AppBarExample type="SubPage" title="Page title" showActions />
            </div>
            <p>The guide supplies a public IconButton with a Go back label so the leading action has a clear accessible name.</p>
          </article>
        </div>
      ),
    },
    states: {
      header: 'States',
      title: 'State belongs to the child action',
      description:
        'AppBar owns the arrangement. Its IconButton children own enabled and disabled feedback, so the state communicates what is available on this page.',
      body: (
        <>
          <p className="appbar-static-note">Child action references · use the playground above for interaction feedback.</p>
          <div className="appbar-state-grid">
            <article className="state-card appbar-state-card">
              <div className="state-preview appbar-state-preview">
                <AppBarExample type="SubPage" title="Overview" showActions />
              </div>
              <h3>Enabled actions</h3>
              <p>Use the actions slot when the page has a useful next action.</p>
            </article>
            <article className="state-card appbar-state-card">
              <div className="state-preview appbar-state-preview">
                <AppBarExample type="SubPage" title="Overview" showActions actionsDisabled />
              </div>
              <h3>Disabled child</h3>
              <p>Disable a child IconButton when its action is temporarily unavailable.</p>
            </article>
          </div>
          <div className="guidance-note appbar-guidance-note">
            <strong>Availability belongs to each action.</strong>
            <p>Configure the bar type and slots, then configure availability on the public child action that needs it.</p>
          </div>
        </>
      ),
    },
    sizing: {
      header: 'Sizing',
      title: 'The host sets the available width',
      description:
        'AppBar derives its height from its public padding and children. On SubPage, the middle content is centered in a 192px box and clips or truncates when a crowded title has nowhere to go.',
      body: (
        <div className="appbar-sizing-grid">
          <article className="appbar-sizing-card">
            <div className="appbar-size-host appbar-size-host-roomy">
              <AppBarExample type="SubPage" title="Account overview" showActions />
            </div>
            <div className="appbar-sizing-meta">
              <strong>Roomy host</strong>
              <span>Side slots have room while the middle remains centered.</span>
            </div>
          </article>
          <article className="appbar-sizing-card">
            <div className="appbar-size-host appbar-size-host-narrow">
              <AppBarExample
                type="SubPage"
                title="Investments"
                showActions
                includeMore={false}
              />
            </div>
            <div className="appbar-sizing-meta">
              <strong>Narrow host</strong>
              <span>At up to 360px of content width, one focused action leaves room; longer titles or extra actions compete with the side slots.</span>
            </div>
          </article>
        </div>
      ),
    },
    content: {
      header: 'Content',
      title: 'Make the title and actions earn their space',
      description:
        'A short title helps people orient quickly. Each action should support the page they are on and remain understandable from its accessible label.',
      body: (
        <div className="content-guidance-grid appbar-content-grid">
          <article className="content-rule content-rule-featured">
            <span aria-hidden="true">01</span>
            <h3>Keep the title short</h3>
            <p>Use the page name people need to recognize, then move supporting detail into the page body.</p>
            <div className="rule-example appbar-rule-example">
              <AppBarExample type="SubPage" title="Bills" showActions includeMore={false} />
            </div>
          </article>
          <article className="content-rule">
            <span aria-hidden="true">02</span>
            <h3>Prioritize actions</h3>
            <p>Show only the few actions that help someone complete the current task.</p>
          </article>
          <article className="content-rule">
            <span aria-hidden="true">03</span>
            <h3>Name icon actions</h3>
            <p>Use the public IconButton accessibilityLabel so icon-only controls remain discoverable.</p>
          </article>
        </div>
      ),
    },
    context: {
      header: 'In context',
      title: 'Move between related pages with one contract',
      description:
        'The product flow owns navigation state. AppBar presents the current destination and invokes the public child actions supplied by that flow.',
      body: <ContextExample />,
    },
    'dos-donts': {
      header: 'Do & Don’ts',
      title: 'Make the relationship easy to scan',
      description:
        'Use the page title, action count, and page type to make the next destination and its available actions clear.',
      body: (
        <div className="comparison-stack appbar-comparison-stack">
          <div className="comparison-row appbar-comparison-row">
            <article className="comparison-card do-card">
              <p className="comparison-label">Do</p>
              <div className="comparison-preview appbar-comparison-preview">
                <AppBarExample type="SubPage" title="Bills" showActions includeMore={false} />
              </div>
              <h3>Keep the destination concise</h3>
              <p>A short title stays readable in the centered middle slot.</p>
            </article>
            <article className="comparison-card dont-card">
              <p className="comparison-label">Don’t</p>
              <div className="comparison-preview appbar-comparison-preview">
                <AppBarExample
                  type="SubPage"
                  title="Your complete investment dashboard"
                  showActions
                  includeMore={false}
                />
              </div>
              <h3>Put the page brief inside the bar</h3>
              <p>The centered slot clips extra words when a title carries the whole page brief.</p>
            </article>
          </div>
          <div className="comparison-row appbar-comparison-row">
            <article className="comparison-card do-card">
              <p className="comparison-label">Do</p>
              <div className="comparison-preview appbar-comparison-preview">
                <AppBarExample type="SubPage" title="Payments" showActions includeMore={false} />
              </div>
              <h3>Keep actions focused</h3>
              <p>One low-emphasis action leaves the destination and the next step easy to scan.</p>
            </article>
            <article className="comparison-card dont-card">
              <p className="comparison-label">Don’t</p>
              <div className="comparison-preview appbar-comparison-preview">
                <AppBarExample type="SubPage" title="Payments" showActions includeAdd />
              </div>
              <h3>Overcrowd the actions slot</h3>
              <p>Every extra control competes with the few actions that support the current task.</p>
            </article>
          </div>
          <div className="comparison-row appbar-comparison-row">
            <article className="comparison-card do-card">
              <p className="comparison-label">Do</p>
              <div className="comparison-preview appbar-comparison-preview">
                <AppBarExample type="SubPage" title="Payment details" showActions includeMore={false} />
              </div>
              <h3>Use SubPage for a child destination</h3>
              <p>The supplied Go back action makes the relationship to the parent page explicit.</p>
            </article>
            <article className="comparison-card dont-card">
              <p className="comparison-label">Don’t</p>
              <div className="comparison-preview appbar-comparison-preview">
                <MainPageStoryExample />
              </div>
              <h3>Use MainPage identity for a detail view</h3>
              <p>JioDot and an empty middle slot describe a top-level destination, not a child page.</p>
            </article>
          </div>
        </div>
      ),
    },
    sources: {
      header: 'Sources',
      title: 'Grounded in the published component',
      description:
        'This guide separates designer-configurable slots and page types from package behavior that affects sizing and accessibility.',
      body: (
        <Sources
          checked="21 September 2026"
          figmaUrl={FIGMA_URL}
          figmaDescription="App Bar component set · node 1070:18571"
          storybookUrl={STORYBOOK_URL}
          storybookDescription="MainPage, SubPage, long title, and progress examples"
          stories={STORYBOOK_STORIES}
        >
          Examples use the public <code>AppBar</code>, <code>IconButton</code>, <code>JioDot</code>, and <code>Avatar</code> exports plus the published Storybook <code>TitleText</code> fixture for the middle slot. The source fixture uses explicit 16px bold text and a color literal keyed to its Light/Dark mode; this is documented provenance rather than a claim that Figma specifies the typography. Figma and package behavior differ on fixed reference heights and MainPage’s JioDot default; the guide also supplies a named public back action because the package default has no accessible name.
        </Sources>
      ),
    },
  }

  return (
    <ComponentGuideTemplate
      metadata={{
        slug: 'appbar',
        name: 'App Bar',
        summary: 'Keep page identity, navigation and a few relevant actions together at the top of a view.',
        corePrinciple: 'Use the bar to orient people. Keep its title short and its actions focused.',
        figmaUrl: FIGMA_URL,
        storybookUrl: STORYBOOK_URL,
      }}
      playground={
        <>
          <div className={classes('preview-stage', 'appbar-preview-stage', colorMode === 'Dark' && 'is-dark')}>
            <div className="appbar-preview-host">
              <AppBarExample
                type={type}
                colorMode={colorMode}
                title={title}
                includeJioDot={showJioDot}
                showActions={showActions}
                actionsDisabled={actionsDisabled}
                onAction={setLastAction}
              />
            </div>
            <p className="preview-note appbar-preview-note" aria-live="polite">
              Last action: <strong>{lastAction}</strong>
            </p>
            <span className="stage-label">Live Coin App Bar · {type} · {colorMode}</span>
          </div>
          <div className="controls-panel appbar-controls-panel">
            <Segment label="Page type" value={type} options={['MainPage', 'SubPage'] as const} onChange={setType} />
            <Segment label="Color mode" value={colorMode} options={['Light', 'Dark'] as const} onChange={setColorMode} />
            <label className="appbar-title-control">
              <span>Page title</span>
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                aria-label="Page title"
                maxLength={42}
              />
            </label>
            <div className="toggle-row appbar-toggle-row">
              <label>
                <input type="checkbox" checked={showActions} onChange={(event) => setShowActions(event.target.checked)} />
                <span className="toggle-track" aria-hidden="true" />
                Actions
              </label>
              <label>
                <input type="checkbox" checked={showJioDot} onChange={(event) => setShowJioDot(event.target.checked)} disabled={type === 'SubPage'} />
                <span className="toggle-track" aria-hidden="true" />
                MainPage JioDot
              </label>
              <label>
                <input type="checkbox" checked={actionsDisabled} onChange={(event) => setActionsDisabled(event.target.checked)} disabled={!showActions} />
                <span className="toggle-track" aria-hidden="true" />
                Disable actions
              </label>
            </div>
            <div className="appbar-readout" aria-live="polite">
              <span>Configured example</span>
              <strong>{type} · {showActions ? 'actions shown' : 'no actions'}</strong>
              <p>{type === 'SubPage' ? 'The supplied Go back action keeps the leading slot accessible.' : 'MainPage accepts an opt-in JioDot or another leading node.'}</p>
            </div>
          </div>
        </>
      }
      sections={sections}
    />
  )
}

export default AppBarGuide

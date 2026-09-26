import { useState } from 'react'
import { Avatar, BrandChip, Card, VStack, Text, type Modes } from 'jfs-components'
import { ComponentGuideTemplate, type GuideSectionSlots } from './ComponentGuideTemplate'
import { Anatomy, DoDont, ExampleCard, Segment, Sources } from './guide-kit'

const FIGMA = 'https://www.figma.com/design/3z7bmhA73Ls7j8Eu4qhYhE/Coin-Components-Library?node-id=3994-3252'
const STORYBOOK = 'https://jfs-components-storybook.vercel.app/?path=/docs/components-brandchip--docs'
const LIGHT_MODES = { 'Color Mode': 'Light' } as Modes

function Chip({ label, monogram = 'AB', onPress }: { label: string; monogram?: string; onPress?: () => void }) {
  return <div className="coin-brand-chip-specimen"><BrandChip label={label} modes={LIGHT_MODES} avatarSlot={<Avatar style="Monogram" monogram={monogram} />} onPress={onPress} /></div>
}

export function BrandChipGuide() {
  const [labelPreset, setLabelPreset] = useState<'Account' | 'Short'>('Account')
  const [mode, setMode] = useState<'Static' | 'Interactive'>('Static')
  const [playgroundMessage, setPlaygroundMessage] = useState('No account opened')
  const [stateMessage, setStateMessage] = useState('No account opened')
  const currentLabel = labelPreset === 'Account' ? 'Axis Bank • 0245' : 'Axis Bank'
  const sections: GuideSectionSlots = {
    anatomy: {
      header: 'Anatomy', title: 'Identity and identifier',
      description: 'A small avatar and short label form one recognizable account identifier.',
      body: <Anatomy parts={[
        { name: 'Avatar', note: 'Helps recognize the brand.', target: '.coin-brand-chip-specimen > div > div:first-child', side: 'left' },
        { name: 'Label', note: 'Names the account and distinguishes it from similar accounts.', target: '.coin-brand-chip-specimen > div > [dir="auto"]', side: 'top' },
      ]}><Chip label="Axis Bank • 0245" /></Anatomy>,
    },
    configuration: {
      header: 'Configuration', title: 'Choose a recognizable identity',
      description: 'Keep the avatar and label about the same brand. A monogram can provide a clear fallback when an image is unavailable.',
      body: <div className="coin-new-example-grid"><ExampleCard title="Axis Bank"><Chip label="Axis Bank • 0245" monogram="AB" /></ExampleCard><ExampleCard title="Horizon Bank"><Chip label="Horizon Bank • 1182" monogram="HB" /></ExampleCard></div>,
    },
    states: {
      header: 'States', title: 'Read-only or actionable',
      description: 'Use a static chip to identify the current account. Make it actionable only when it opens account detail or a choice.',
      body: <div className="coin-new-example-grid"><ExampleCard title="Static"><Chip label="Axis Bank • 0245" /></ExampleCard><ExampleCard title="Interactive"><Chip label="Axis Bank • 0245" onPress={() => setStateMessage('Account details opened')} /><p className="coin-new-readout" role="status">{stateMessage}</p></ExampleCard></div>,
    },
    sizing: {
      header: 'Sizing', title: 'Keep identifiers compact',
      description: 'The chip grows with its content. Prefer a short brand name and a distinguishing account suffix.',
      body: <div className="coin-new-example-grid"><ExampleCard title="Roomy host"><div className="coin-new-host wide"><Chip label="Axis Bank • 0245" /></div></ExampleCard><ExampleCard title="Narrow host"><div className="coin-new-host narrow"><Chip label="Axis • 0245" /></div></ExampleCard></div>,
    },
    content: {
      header: 'Content', title: 'Distinguish similar accounts',
      description: 'Keep the brand name recognizable. Include the account suffix when more than one account shares the same brand.',
      body: <div className="coin-new-content-list"><Chip label="Axis Bank • 0245" /><Chip label="Axis Bank • 1182" /></div>,
    },
    context: {
      header: 'In context', title: 'Show the account in use',
      description: 'The surrounding composition explains the chip’s role.',
      body: <div className="coin-new-context"><Card variant="slim" modes={LIGHT_MODES}><VStack modes={LIGHT_MODES}><Text>Paying from</Text><Chip label="Axis Bank • 0245" /></VStack></Card></div>,
    },
    'dos-donts': {
      header: 'Do & Don’ts', title: 'Keep identity recognizable and useful',
      description: 'Match the identity, distinguish accounts, and keep the chip focused on identification.',
      body: <div className="coin-new-stack">
        <DoDont good={<div className="coin-new-stack"><Chip label="Axis Bank • 0245" /><Chip label="Axis Bank • 1182" /></div>} bad={<div className="coin-new-stack"><Chip label="Axis Bank" /><Chip label="Axis Bank" /></div>} goodTitle="Use an account suffix" badTitle="Avoid duplicate labels" goodCaption="Include a useful distinguishing detail." badCaption="Avoid identical labels for different accounts." />
        <DoDont good={<Chip label="Axis Bank • 0245" monogram="AB" />} bad={<Chip label="Axis Bank • 0245" monogram="HB" />} goodTitle="Match avatar and label" badTitle="Avoid conflicting identities" goodCaption="Use an avatar or monogram for the brand named in the label." badCaption="A different brand cue creates uncertainty about the account." />
        <DoDont good={<div className="coin-new-host narrow"><Chip label="Axis • 0245" /></div>} bad={<div className="coin-new-host narrow"><Chip label="Axis Bank savings account • 0245" /></div>} goodTitle="Keep the identifier compact" badTitle="Avoid full descriptions" goodCaption="Keep the brand and the distinguishing suffix." badCaption="Long descriptions consume space needed by surrounding content." />
        <DoDont good={<div className="coin-new-stack"><p className="coin-new-readout">Payment complete</p><Chip label="Axis Bank • 0245" monogram="AB" /></div>} bad={<Chip label="Payment complete" monogram="AB" />} goodTitle="Keep status beside the identifier" badTitle="Do not replace identity with status" goodCaption="Use nearby content for the transaction status." badCaption="A status label no longer tells people which account is involved." />
      </div>,
    },
    sources: {
      header: 'Sources', title: 'Use the public identity slot',
      description: 'The guide uses the published Brand Chip component with a consumer-supplied public Avatar.',
      body: <Sources checked="23 September 2026" figmaUrl={FIGMA} storybookUrl={STORYBOOK} stories={[
        { label: 'Default', id: 'components-brandchip--default' }, { label: 'Short label', id: 'components-brandchip--short-label' }, { label: 'Long label', id: 'components-brandchip--long-label' }, { label: 'Monogram avatar', id: 'components-brandchip--with-monogram-avatar' }, { label: 'Remote image', id: 'components-brandchip--with-remote-image' }, { label: 'Interactive', id: 'components-brandchip--interactive' },
      ]}>Declared, installed, and registry <code>jfs-components</code> versions are <code>0.1.60</code>. Figma exposes a Label property and an Avatar at S size. The monogram here is supplied through the public <code>avatarSlot</code>; it is not an automatic image-error fallback. The package supports an optional action but exposes no selected or disabled state. Its label is one line by default; use short identifiers in constrained hosts.</Sources>,
    },
  }

  return <ComponentGuideTemplate metadata={{ slug: 'brandchip', name: 'Brand Chip', summary: 'Use Brand Chip to identify a linked brand or account with an avatar and a short label.', corePrinciple: 'Pair a recognizable identity with just enough text to distinguish it.', figmaUrl: FIGMA, storybookUrl: STORYBOOK }} playground={<>
    <div className="preview-stage"><Chip label={currentLabel} onPress={mode === 'Interactive' ? () => setPlaygroundMessage('Account details opened') : undefined} /><span className="stage-label">Live Coin BrandChip</span></div>
    <div className="controls-panel"><Segment label="Behavior" value={mode} options={['Static', 'Interactive']} onChange={setMode} /><Segment label="Label" value={labelPreset} options={['Account', 'Short']} onChange={setLabelPreset} /><p className="coin-new-readout" role="status">{playgroundMessage}</p></div>
  </>} sections={sections} />
}

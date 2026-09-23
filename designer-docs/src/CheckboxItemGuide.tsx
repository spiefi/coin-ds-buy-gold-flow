import { useState } from 'react'
import { Button, CheckboxItem, VStack, type Modes } from 'jfs-components'
import { ComponentGuideTemplate, type GuideSectionSlots } from './ComponentGuideTemplate'
import { GuideAnatomy, GuideDoDont, GuideExampleCard, GuideSegment, GuideSources } from './NewGuideShared'

const FIGMA = 'https://www.figma.com/design/3z7bmhA73Ls7j8Eu4qhYhE/Coin-Components-Library?node-id=4303-8392'
const STORYBOOK = 'https://jfs-components-storybook.vercel.app/?path=/docs/components-checkboxitem--docs'
const ROW_MODES = { 'Color Mode': 'Light', 'Button / Size': 'XS' } as Modes
type Edge = 'Leading' | 'Trailing'

function Row({ label, checked = false, disabled = false, control = 'Leading', action = false, onValueChange, onAction }: {
  label: string; checked?: boolean; disabled?: boolean; control?: Edge; action?: boolean; onValueChange?: (checked: boolean) => void; onAction?: () => void
}) {
  return <CheckboxItem checked={checked} disabled={disabled} control={control.toLowerCase() as 'leading' | 'trailing'} onValueChange={onValueChange} accessibilityLabel={label} modes={ROW_MODES} endSlot={action ? <Button label="Details" onPress={onAction} /> : undefined}>{label}</CheckboxItem>
}

export function CheckboxItemGuide() {
  const [label, setLabel] = useState('Savings • 0245')
  const [checked, setChecked] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [edge, setEdge] = useState<Edge>('Leading')
  const [action, setAction] = useState(false)
  const [message, setMessage] = useState('No details opened')
  const [accounts, setAccounts] = useState([false, false, false])
  const count = accounts.filter(Boolean).length
  const sections: GuideSectionSlots = {
    anatomy: {
      header: 'Anatomy', title: 'One choice, three regions',
      description: 'The row combines a control, label, and optional supporting action.',
      body: <GuideAnatomy targets={[
        { selector: '.coin-checkbox-item-anatomy [role="checkbox"] [role="checkbox"]', label: 'Control', description: 'Shows whether the option is selected.', anchorY: 0 },
        { selector: '.coin-checkbox-item-anatomy [dir="auto"]', label: 'Label', description: 'Describes the option and uses the remaining row width.', anchorY: 0 },
        { selector: '.coin-checkbox-item-anatomy [role="button"]', label: 'Action', description: 'Opens related information without changing the choice.', anchorY: 0 },
      ]}><div className="coin-checkbox-item-anatomy"><Row label="Savings • 0245" checked action onAction={() => {}} /></div></GuideAnatomy>,
    },
    configuration: {
      header: 'Configuration', title: 'Place the control consistently',
      description: 'Choose the edge that fits the list. Keep that position consistent across neighboring options.',
      body: <div className="coin-new-stack"><div className="coin-new-example-grid">
        <GuideExampleCard title="Leading"><Row label="Savings • 0245" checked /></GuideExampleCard>
        <GuideExampleCard title="Trailing"><Row label="Savings • 0245" checked control="Trailing" /></GuideExampleCard>
      </div><div className="coin-new-example-grid">
        <GuideExampleCard title="Without supporting action"><Row label="Savings • 0245" /></GuideExampleCard>
        <GuideExampleCard title="With Details"><Row label="Savings • 0245" action onAction={() => {}} /></GuideExampleCard>
      </div></div>,
    },
    states: {
      header: 'States', title: 'Selection and availability are independent',
      description: 'A disabled option can retain its selected value. Explain unavailable choices in nearby content when the reason is not obvious.',
      body: <div className="coin-new-example-grid">
        <GuideExampleCard title="Unchecked"><Row label="Savings • 0245" /></GuideExampleCard>
        <GuideExampleCard title="Checked"><Row label="Savings • 0245" checked /></GuideExampleCard>
        <GuideExampleCard title="Disabled, unchecked"><Row label="Savings • 0245" disabled /></GuideExampleCard>
        <GuideExampleCard title="Disabled, checked"><Row label="Savings • 0245" checked disabled /></GuideExampleCard>
      </div>,
    },
    sizing: {
      header: 'Sizing', title: 'The row follows its host',
      description: 'Give the label room to wrap. The row takes the available width; the Checkbox keeps its own size.',
      body: <div className="coin-new-example-grid"><GuideExampleCard title="Host up to 360 px"><div className="coin-new-host wide"><Row label="Send monthly account statements by email" /></div></GuideExampleCard><GuideExampleCard title="Host up to 240 px"><div className="coin-new-host narrow"><Row label="Send monthly account statements by email" /></div></GuideExampleCard></div>,
    },
    content: {
      header: 'Content', title: 'Name the choice clearly',
      description: 'A plain label usually makes the row easiest to understand.',
      body: <div className="coin-new-example-grid"><GuideExampleCard title="Specific"><Row label="Send account updates by email" /></GuideExampleCard><GuideExampleCard title="Vague"><Row label="Enable this" /></GuideExampleCard></div>,
    },
    context: {
      header: 'In context', title: 'Choose the accounts to include',
      description: 'Each account keeps its own selected value.',
      body: <div className="coin-new-context"><VStack modes={ROW_MODES}>{['Savings • 0245', 'Current • 1182', 'Fixed deposit • 9073'].map((name, index) => <Row key={name} label={name} checked={accounts[index]} onValueChange={value => setAccounts(current => current.map((item, i) => i === index ? value : item))} />)}</VStack><p className="coin-new-readout" role="status">{count} of 3 accounts selected</p></div>,
    },
    'dos-donts': {
      header: 'Do & Don’ts', title: 'Keep controls on one edge',
      description: 'A consistent edge makes a list easier to scan.',
      body: <GuideDoDont good={<div className="coin-new-stack"><Row label="Savings • 0245" /><Row label="Current • 1182" /></div>} bad={<div className="coin-new-stack"><Row label="Savings • 0245" /><Row label="Current • 1182" control="Trailing" /></div>} goodTitle="Align the controls" badTitle="Avoid mixed placement" goodCaption="Keep controls on the same edge." badCaption="Avoid making people search for each control." />,
    },
    sources: {
      header: 'Sources', title: 'Use the public row contract',
      description: 'The guide follows the component’s exposed control placement, slot, and state behavior.',
      body: <GuideSources figmaUrl={FIGMA} storybookUrl={STORYBOOK} stories={[
        { label: 'Default', id: 'components-checkboxitem--default' }, { label: 'String label', id: 'components-checkboxitem--string-label' }, { label: 'Custom slot', id: 'components-checkboxitem--custom-slot-content' }, { label: 'End slot', id: 'components-checkboxitem--with-end-slot' }, { label: 'Trailing', id: 'components-checkboxitem--trailing' }, { label: 'Trailing action', id: 'components-checkboxitem--trailing-with-end-slot' }, { label: 'Interactive', id: 'components-checkboxitem--interactive' }, { label: 'Long label', id: 'components-checkboxitem--long-label-truncation' },
      ]} note={<>Declared, installed, and registry <code>jfs-components</code> versions are <code>0.1.60</code>. The row fills its host; the optional end slot defaults to 80 px and swaps edges with the Checkbox. A string label wraps in this version; a story name alone does not imply ellipsis. The row and its nested Checkbox each expose a checkbox role on web. In the local preview, Details did not change selection and pointer or Enter toggled the row; native Space on the focused row did not. This is a current package/web interaction limitation.</>} />,
    },
  }

  return <ComponentGuideTemplate metadata={{ slug: 'checkboxitem', name: 'Checkbox Item', summary: 'Use Checkbox Item for a selectable row with a clear label and, when needed, a supporting action.', corePrinciple: 'Make the whole choice easy to understand and select. Keep supporting actions distinct from the selection.', figmaUrl: FIGMA, storybookUrl: STORYBOOK }} playground={<>
    <div className="preview-stage"><div className="coin-new-host wide"><Row label={label || 'Savings • 0245'} checked={checked} disabled={disabled} control={edge} action={action} onValueChange={setChecked} onAction={() => setMessage('Savings account details opened')} /></div><span className="stage-label">Live Coin CheckboxItem</span></div>
    <div className="controls-panel">
      <label className="text-control"><span>Label</span><input value={label} onChange={event => setLabel(event.target.value)} maxLength={72} /></label>
      <GuideSegment label="Control edge" value={edge} options={['Leading', 'Trailing']} onChange={setEdge} />
      <GuideSegment label="Checked" value={checked ? 'On' : 'Off'} options={['Off', 'On'] as const} onChange={value => setChecked(value === 'On')} />
      <GuideSegment label="Disabled" value={disabled ? 'On' : 'Off'} options={['Off', 'On'] as const} onChange={value => setDisabled(value === 'On')} />
      <GuideSegment label="Supporting action" value={action ? 'On' : 'Off'} options={['Off', 'On'] as const} onChange={value => setAction(value === 'On')} />
      <p className="coin-new-readout" role="status">{message} · {checked ? 'Selected' : 'Not selected'}</p>
    </div>
  </>} sections={sections} />
}

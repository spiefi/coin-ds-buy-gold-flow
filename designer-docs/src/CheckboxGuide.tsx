import { useState } from 'react'
import { Checkbox, CheckboxItem, VStack, type Modes } from 'jfs-components'
import { ComponentGuideTemplate, type GuideSectionSlots } from './ComponentGuideTemplate'
import { GuideAnatomy, GuideDoDont, GuideExampleCard, GuideSegment, GuideSources } from './NewGuideShared'

const FIGMA = 'https://www.figma.com/design/3z7bmhA73Ls7j8Eu4qhYhE/Coin-Components-Library?node-id=886-1552'
const STORYBOOK = 'https://jfs-components-storybook.vercel.app/?path=/docs/components-checkbox--docs'
const LIGHT_MODES = { 'Color Mode': 'Light' } as Modes

function Choice({ label, selected = false, disabled = false, visible = true }: { label: string; selected?: boolean; disabled?: boolean; visible?: boolean }) {
  return <div className="coin-new-row"><Checkbox defaultChecked={selected} disabled={disabled} accessibilityLabel={label} modes={LIGHT_MODES} />{visible && <span>{label}</span>}</div>
}

function LiveChoice({ label, initiallyChecked = false }: { label: string; initiallyChecked?: boolean }) {
  const [checked, setChecked] = useState(initiallyChecked)
  return <div className="coin-new-row"><Checkbox checked={checked} onValueChange={setChecked} accessibilityLabel={label} modes={LIGHT_MODES} /><span>{label}</span></div>
}

export function CheckboxGuide() {
  const [checked, setChecked] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [channels, setChannels] = useState([false, false])
  const sections: GuideSectionSlots = {
    anatomy: {
      header: 'Anatomy', title: 'Selection at a glance',
      description: 'The boundary locates the control. The checkmark makes the selected value explicit.',
      body: <GuideAnatomy targets={[
        { selector: '.coin-checkbox-anatomy [role="checkbox"] > div', label: 'Boundary', description: 'Locates the control in a list or form.', anchorX: .1, anchorY: .05 },
        { selector: '.coin-checkbox-anatomy svg', label: 'Checkmark', description: 'Makes the selected value explicit.', anchorX: .5, anchorY: .1 },
      ]}><div className="coin-checkbox-anatomy"><Checkbox checked accessibilityLabel="Selected example" modes={LIGHT_MODES} /></div></GuideAnatomy>,
    },
    configuration: {
      header: 'Configuration', title: 'Set a value and availability',
      description: 'Selection answers the question; availability controls whether that answer can change.',
      body: <div className="coin-new-example-grid">
        <GuideExampleCard title="Unchecked"><Choice label="Unchecked" /></GuideExampleCard>
        <GuideExampleCard title="Checked"><Choice label="Checked" selected /></GuideExampleCard>
        <GuideExampleCard title="Disabled, unchecked"><Choice label="Disabled, unchecked" disabled /></GuideExampleCard>
        <GuideExampleCard title="Disabled, checked"><Choice label="Disabled, checked" selected disabled /></GuideExampleCard>
      </div>,
    },
    states: {
      header: 'States', title: 'Feedback follows interaction',
      description: 'Hover and focus are temporary feedback. They do not change the saved selection.',
      body: <><div className="coin-new-example-grid"><GuideExampleCard title="Unselected"><LiveChoice label="Unselected" /></GuideExampleCard><GuideExampleCard title="Selected"><LiveChoice label="Selected" initiallyChecked /></GuideExampleCard></div><p className="coin-new-readout">Hover with a pointer or reach the control with Tab to see interaction feedback. The Figma states are Idle, Hover, Focus, Selected, Selected Hover, Focus Selected, Disabled Active, and Disabled.</p></>,
    },
    sizing: {
      header: 'Sizing', title: 'Small control, clear space',
      description: 'Keep the Checkbox at its token-defined size. Use Checkbox Item when the choice needs a label and a larger selectable row.',
      body: <div className="coin-new-example-grid"><GuideExampleCard title="Standalone control"><div className="coin-new-host"><Choice label="Include savings" /></div></GuideExampleCard><GuideExampleCard title="Full-width row"><div className="coin-new-host wide"><CheckboxItem accessibilityLabel="Include savings" modes={LIGHT_MODES}>Include savings</CheckboxItem></div></GuideExampleCard></div>,
    },
    content: {
      header: 'Content', title: 'Every choice needs a name',
      description: 'Use a visible description and a matching accessible name. A bare checkmark does not explain what was selected.',
      body: <div className="coin-new-example-grid"><GuideExampleCard title="Visible meaning"><Choice label="Email me a monthly statement" /></GuideExampleCard><GuideExampleCard title="Isolated mark"><Choice label="Email me a monthly statement" visible={false} /></GuideExampleCard></div>,
    },
    context: {
      header: 'In context', title: 'Select any that apply',
      description: 'Each option keeps its own value. Use a single-choice control when only one answer is allowed.',
      body: <div className="coin-new-context"><VStack modes={LIGHT_MODES}>{['Email updates', 'SMS updates'].map((name, index) => <CheckboxItem key={name} checked={channels[index]} onValueChange={value => setChannels(current => current.map((item, i) => i === index ? value : item))} accessibilityLabel={name} modes={LIGHT_MODES}>{name}</CheckboxItem>)}</VStack><p className="coin-new-readout" role="status">{channels.filter(Boolean).length} channels selected</p></div>,
    },
    'dos-donts': {
      header: 'Do & Don’ts', title: 'Show what each choice means',
      description: 'Visible context helps people recognize the value they are changing.',
      body: <GuideDoDont good={<Choice label="Email me a monthly statement" />} bad={<Choice label="Email me a monthly statement" visible={false} />} goodTitle="Name the choice" badTitle="Avoid an isolated control" goodCaption="Keep the meaning next to the control." badCaption="Avoid a control with no visible explanation." />,
    },
    sources: {
      header: 'Sources', title: 'Follow the public Checkbox states',
      description: 'The guide shows actual value and availability props; pointer and keyboard feedback comes from the component.',
      body: <GuideSources figmaUrl={FIGMA} storybookUrl={STORYBOOK} stories={[
        { label: 'Default', id: 'components-checkbox--default' }, { label: 'Checked', id: 'components-checkbox--checked' }, { label: 'Disabled', id: 'components-checkbox--disabled' }, { label: 'All states', id: 'components-checkbox--all-states' }, { label: 'Interactive', id: 'components-checkbox--interactive' },
      ]} note={<>Declared, installed, and registry <code>jfs-components</code> versions are <code>0.1.60</code>. Figma has eight visual states and 18×18 px masters. The package controls hover and keyboard focus internally; it exposes no state, indeterminate, or size prop. In the local preview pointer and Enter toggled selection, but native Space on the focused control did not; this is a current package/web interaction limitation. HitSlop aims to enlarge touch bounds, but this guide does not claim a measured 44 px web target.</>} />,
    },
  }

  return <ComponentGuideTemplate metadata={{ slug: 'checkbox', name: 'Checkbox', summary: 'Use Checkbox for an independent yes-or-no choice. People can select more than one option in a set.', corePrinciple: 'Keep the selected value separate from hover, focus, and availability. Always make the meaning of the choice clear.', figmaUrl: FIGMA, storybookUrl: STORYBOOK }} playground={<>
    <div className="preview-stage"><div className="coin-new-row"><Checkbox checked={checked} disabled={disabled} onValueChange={setChecked} accessibilityLabel="Include savings account" modes={LIGHT_MODES} /><span>Include savings account</span></div><span className="stage-label">Live Coin Checkbox</span></div>
    <div className="controls-panel"><GuideSegment label="Checked" value={checked ? 'On' : 'Off'} options={['Off', 'On'] as const} onChange={value => setChecked(value === 'On')} /><GuideSegment label="Disabled" value={disabled ? 'On' : 'Off'} options={['Off', 'On'] as const} onChange={value => setDisabled(value === 'On')} /><p className="coin-new-readout" role="status">{checked ? 'Savings account included' : 'Savings account not included'}</p><p className="coin-new-readout">Hover with a pointer or reach the control with Tab to see interaction feedback.</p></div>
  </>} sections={sections} />
}

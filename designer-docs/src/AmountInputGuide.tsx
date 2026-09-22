import {
  useState,
  type ReactNode,
} from 'react'
import {
  AmountInput,
  Card,
  MoneyValue,
  NoteInput,
  type Modes,
} from 'jfs-components'
import {
  ComponentGuideTemplate,
  type GuideSectionSlots,
} from './ComponentGuideTemplate'

const FIGMA_URL =
  'https://www.figma.com/design/3z7bmhA73Ls7j8Eu4qhYhE/Coin-Components-Library?node-id=2217-6259'
const STORYBOOK_URL =
  'https://jfs-components-storybook.vercel.app/?path=/docs/components-amountinput--docs'
const AMOUNT_MODES: Modes = { 'Color Mode': 'Light', Context3: 'Amount Input' } as Modes

type Currency = '₹' | '$'

function SmallArrow() {
  return <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" /></svg>
}

function SourceLink({ href, children }: { href: string; children: string }) {
  return <a className="source-link" href={href} target="_blank" rel="noreferrer"><span>{children}</span><SmallArrow /></a>
}

function Segment<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: readonly T[]; onChange: (value: T) => void }) {
  return <fieldset className="control-group"><legend>{label}</legend><div className="segmented-control">{options.map((option) => <button key={option} type="button" className={value === option ? 'is-selected' : ''} aria-pressed={value === option} onClick={() => onChange(option)}>{option}</button>)}</div></fieldset>
}

function AmountExample({
  value = '500',
  currency = '₹',
  note = '',
  placeholder = 'Add note',
  editable = false,
  hidden = false,
  onValueChange,
  onNoteChange,
  className,
}: {
  value?: string
  currency?: string
  note?: string
  placeholder?: string
  editable?: boolean
  hidden?: boolean
  onValueChange?: (value: string | number) => void
  onNoteChange?: (value: string) => void
  className?: string
}) {
  const [localValue, setLocalValue] = useState(value)
  const [localNote, setLocalNote] = useState(note)
  const resolvedValue = onValueChange ? value : localValue
  const resolvedNote = onNoteChange ? note : localNote
  return <div className={`coin-amount-example${className ? ` ${className}` : ''}`} data-coin-example="amount-input"><AmountInput modes={AMOUNT_MODES} moneyValueSlot={<MoneyValue value={resolvedValue} currency={currency} editable={editable && !hidden} hidden={hidden} onValueChange={(next) => { setLocalValue(String(next)); onValueChange?.(next) }} accessibilityLabel={editable ? 'Edit amount' : undefined} modes={AMOUNT_MODES} />} noteInputSlot={<NoteInput value={resolvedNote} onChangeText={(next) => { setLocalNote(next); onNoteChange?.(next) }} placeholder={placeholder} modes={AMOUNT_MODES} accessibilityLabel="Add note" />} /></div>
}

function AmountAnatomy() {
  return <figure className="coin-amount-anatomy-figure"><div className="coin-amount-anatomy-live"><div className="coin-amount-anatomy-specimen"><div className="coin-amount-anatomy-component"><AmountExample value="500" currency="₹" note="Rent" /></div><svg className="coin-amount-anatomy-leaders" viewBox="0 0 180 120" preserveAspectRatio="none" aria-hidden="true"><line x1="12" y1="32" x2="37" y2="31" /><line x1="96" y1="16" x2="91" y2="31" /><line x1="168" y1="78" x2="95" y2="88" /></svg><span className="coin-amount-anatomy-pin coin-amount-pin-currency">1</span><span className="coin-amount-anatomy-pin coin-amount-pin-value">2</span><span className="coin-amount-anatomy-pin coin-amount-pin-note">3</span></div></div><figcaption>The marks point to the real MoneyValue currency and amount children and the NoteInput slot.</figcaption></figure>
}

function ContextExample() {
  return <div className="coin-amount-context"><Card modes={{ 'Color Mode': 'Light', AppearanceBrand: 'Neutral' } as Modes} style={{ width: '100%' }}><Card.Title>Review transfer</Card.Title><Card.SupportText>Enter the amount and an optional note before sending.</Card.SupportText><AmountExample value="500" currency="₹" placeholder="Add transfer note" editable /></Card><p>A Card gives the entry a task context while AmountInput keeps amount primary.</p></div>
}

function ComparisonPair({ good, bad, goodTitle, badTitle, goodCopy, badCopy }: { good: ReactNode; bad: ReactNode; goodTitle: string; badTitle: string; goodCopy: string; badCopy: string }) {
  return <div className="comparison-row coin-amount-comparison-row"><article className="comparison-card do-card"><p className="comparison-label">Do</p><div className="comparison-preview coin-amount-comparison-preview">{good}</div><h3>{goodTitle}</h3><p>{goodCopy}</p></article><article className="comparison-card dont-card"><p className="comparison-label">Don’t</p><div className="comparison-preview coin-amount-comparison-preview">{bad}</div><h3>{badTitle}</h3><p>{badCopy}</p></article></div>
}

export function AmountInputGuide() {
  const [currency, setCurrency] = useState<Currency>('₹')
  const [value, setValue] = useState('500')
  const [note, setNote] = useState('')
  const [hidden, setHidden] = useState(false)
  const [lastAction, setLastAction] = useState('No edit yet')

  const sections: GuideSectionSlots = {
    anatomy: { header: 'Anatomy', title: 'Amount first, note second', description: 'AmountInput composes MoneyValue with NoteInput. The component passes its context to both children so their tokens resolve together.', body: <div className="anatomy-card coin-amount-anatomy-card"><div className="anatomy-stage"><AmountAnatomy /></div><ol className="anatomy-list"><li><b>Currency</b><span>The currency symbol gives the amount a clear unit.</span></li><li><b>Amount</b><span>MoneyValue is the primary editable value and owns its view/edit behavior.</span></li><li><b>Note</b><span>NoteInput is optional supporting detail that becomes useful when focused or filled.</span></li></ol></div> },
    configuration: { header: 'Configuration', title: 'Use the default children or supply focused slots', description: 'The component exposes two slots and an owning context. Choose the currency and child values through MoneyValue and NoteInput.', body: <div className="coin-amount-configuration-stack"><article className="configuration-block coin-amount-config-card"><p className="eyebrow">Default slots</p><h3>Start with a familiar entry</h3><AmountExample value="500" currency="₹" /><p>Omitted slots fall back to MoneyValue and NoteInput children.</p></article><article className="configuration-block coin-amount-config-card"><p className="eyebrow">Custom slots</p><h3>Adapt the detail to the task</h3><AmountExample value="1000" currency="$" note="Monthly investment" placeholder="Add investment note" editable /><p>Supply children when the entry needs another currency or note wording.</p></article></div> },
    states: { header: 'States', title: 'Let each child own its interaction state', description: 'MoneyValue supplies view and edit behavior through its props. NoteInput responds to focus and controlled text; its internal state is runtime-driven.', body: <div className="coin-amount-state-stack"><article className="coin-amount-state-card"><p className="eyebrow">Money view</p><AmountExample value="500" currency="₹" note="Rent" /><p>Use the quiet view when the amount is not being edited.</p></article><article className="coin-amount-state-card"><p className="eyebrow">Money edit</p><AmountExample value="500" currency="₹" editable note="Rent" /><p>Tap the amount to enter the inline edit behavior.</p></article><article className="coin-amount-state-card"><p className="eyebrow">Note filled</p><AmountExample value="500" currency="₹" note="Utilities" /><p>A short controlled note stays supporting detail.</p></article></div> },
    sizing: { header: 'Sizing', title: 'Respect natural content size', description: 'AmountInput uses the children’s natural size. Currency, amount length, note text, and the owning context affect the rendered width; avoid forcing an unbroken value into a narrow host.', body: <div className="coin-amount-sizing-stack"><article className="coin-amount-sizing-card"><div className="coin-amount-sizing-host is-roomy"><AmountExample value="500" currency="₹" note="Rent" /></div><strong>Roomy host</strong><span>Give the amount and note enough room to stay legible.</span></article><article className="coin-amount-sizing-card"><div className="coin-amount-sizing-host is-narrow"><AmountExample value="500" currency="$" note="Rent" /></div><strong>Narrow host</strong><span>Short content keeps the natural Hug-sized children readable.</span></article></div> },
    content: { header: 'Content', title: 'Make the unit and note easy to understand', description: 'Currency belongs with the amount. Notes add supporting detail and should remain short enough to scan beside the primary value.', body: <div className="content-guidance-grid coin-amount-content-grid"><article className="content-rule content-rule-featured"><span aria-hidden="true">01</span><h3>State the currency</h3><p>Keep the symbol or code visible so the amount does not depend on surrounding copy.</p><div className="rule-example"><AmountExample value="500" currency="₹" note="Rent" /></div></article><article className="content-rule"><span aria-hidden="true">02</span><h3>Keep the note concise</h3><p>Use a short phrase that explains the reason or destination.</p></article><article className="content-rule"><span aria-hidden="true">03</span><h3>Keep precision readable</h3><p>Show the amount precision the decision needs, without an unbroken string that cannot fit.</p></article></div> },
    context: { header: 'In context', title: 'Support a transfer review', description: 'Place the amount entry in a Card or review composition so the person knows what they are completing.', body: <ContextExample /> },
    'dos-donts': { header: 'Do & Don’ts', title: 'Keep amount primary and detail supporting', description: 'The visual pairs use child choices and show the visible consequence of each content choice.', body: <div className="comparison-stack coin-amount-comparison-stack"><ComparisonPair good={<AmountExample value="500" currency="₹" note="Rent" />} bad={<AmountExample value="500" currency="" note="Rent" />} goodTitle="Show the currency" badTitle="Hide the unit" goodCopy="The amount reads as a monetary value immediately." badCopy="Without a currency, the number needs surrounding copy to become meaningful." /><ComparisonPair good={<AmountExample value="500" currency="₹" note="Rent" />} bad={<div className="coin-amount-clipped-example"><AmountExample value="500" currency="₹" note="Rent payment for the apartment and utilities" /></div>} goodTitle="Use a short note" badTitle="Write a note that takes over" goodCopy="A concise reason remains secondary to the amount." badCopy="An oversized note competes with the primary amount and makes the natural width harder to manage." /><ComparisonPair good={<AmountExample value="500.00" currency="$" />} bad={<div className="coin-amount-clipped-example"><AmountExample value="12345678901234567890" currency="$" /></div>} goodTitle="Use readable precision" badTitle="Force an unbroken value" goodCopy="The displayed precision fits the entry’s purpose." badCopy="An unbroken string clips inside a narrow teaching frame; widen the host or choose a meaningful precision." /></div> },
    sources: { header: 'Sources', title: 'Grounded in the public amount-entry contract', description: 'This guide uses the published AmountInput API, the inspected Figma master, and the canonical Storybook fixtures.', body: <><div className="sources-grid"><a href={FIGMA_URL} target="_blank" rel="noreferrer"><span className="source-index">01</span><div><h3>Coin Components Library</h3><p>Amount Input · node 2217:6259</p></div><SmallArrow /></a><a href={STORYBOOK_URL} target="_blank" rel="noreferrer"><span className="source-index">02</span><div><h3>Amount Input Storybook</h3><p>Default and custom slot examples</p></div><SmallArrow /></a></div><div className="verification-note"><span>Checked 22 September 2026</span><p>Examples use public <code>AmountInput</code>, <code>MoneyValue</code>, and <code>NoteInput</code> exports from <code>jfs-components</code> 0.1.60. The owner passes <code>Context3=Amount Input</code> with <code>Color Mode=Light</code> to reproduce the inspected Figma context. Storybook’s default fixture relies on ambient context and renders smaller typography than the Figma parent; the guide labels the owner context choice instead of claiming those defaults are identical. The NoteInput <code>state</code> prop is accepted but unused by the implementation; its visible editing state is focus-driven.</p></div><div className="coin-amount-source-links"><SourceLink href="https://jfs-components-storybook.vercel.app/iframe.html?id=components-amountinput--default&viewMode=story">Open default story</SourceLink><SourceLink href="https://jfs-components-storybook.vercel.app/iframe.html?id=components-amountinput--custom-slots&viewMode=story">Open custom slot story</SourceLink></div></> },
  }

    return <ComponentGuideTemplate metadata={{ slug: 'amountinput', name: 'Amount Input', summary: 'Make monetary entry primary while keeping optional detail close.', corePrinciple: 'Amount first, note second.', figmaUrl: FIGMA_URL, storybookUrl: STORYBOOK_URL }} playground={<><div className="preview-stage coin-amount-preview-stage"><div className="coin-amount-preview-host"><AmountExample value={value} currency={currency} note={note} editable hidden={hidden} onValueChange={(next) => { setValue(String(next)); setLastAction('Amount changed') }} onNoteChange={(next) => { setNote(next); setLastAction('Note changed') }} /></div><p className="preview-note" aria-live="polite">{lastAction}</p><span className="stage-label">Live Coin AmountInput · Context3 Amount Input</span></div><div className="controls-panel coin-amount-controls-panel"><Segment label="Currency" value={currency} options={['₹', '$'] as const} onChange={setCurrency} /><label className="toggle-row"><input type="checkbox" checked={hidden} onChange={(event) => setHidden(event.target.checked)} /><span className="toggle-track" /> Hide amount for privacy</label><p className="coin-amount-control-note">Tap the amount or note in the live example to try the child interactions.</p><div className="coin-amount-readout"><span>Context</span><strong>Amount Input · Light</strong><p>MoneyValue and NoteInput receive the same modes.</p></div></div></>} sections={sections} />
}

export function isAmountInputLocation() {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).get('component') === 'amountinput'
}

export default AmountInputGuide

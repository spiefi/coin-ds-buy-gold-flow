import { AmountInputGuide } from '../AmountInputGuide'
import { defineGuide } from './define'
import { LEGACY_ICONS } from './icons'

export default defineGuide({
  slug: 'amountinput',
  label: 'Amount Input',
  icon: LEGACY_ICONS.amountinput,
  Component: AmountInputGuide,
})

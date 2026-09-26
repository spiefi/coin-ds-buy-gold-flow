import { ButtonGuide } from '../ButtonGuide'
import { defineGuide } from './define'
import { LEGACY_ICONS } from './icons'

export default defineGuide({
  slug: 'button',
  label: 'Button',
  icon: LEGACY_ICONS.button,
  Component: ButtonGuide,
})

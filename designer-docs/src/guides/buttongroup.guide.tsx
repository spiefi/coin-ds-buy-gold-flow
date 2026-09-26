import { ButtonGroupGuide } from '../ButtonGroupGuide'
import { defineGuide } from './define'
import { LEGACY_ICONS } from './icons'

export default defineGuide({
  slug: 'buttongroup',
  label: 'Button Group',
  icon: LEGACY_ICONS.buttongroup,
  Component: ButtonGroupGuide,
})

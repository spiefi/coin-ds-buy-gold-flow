import { CheckboxItemGuide } from '../CheckboxItemGuide'
import { defineGuide } from './define'
import { LEGACY_ICONS } from './icons'

export default defineGuide({
  slug: 'checkboxitem',
  label: 'Checkbox Item',
  icon: LEGACY_ICONS.checkboxitem,
  Component: CheckboxItemGuide,
})

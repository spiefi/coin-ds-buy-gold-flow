import { CheckboxGuide } from '../CheckboxGuide'
import { defineGuide } from './define'
import { LEGACY_ICONS } from './icons'

export default defineGuide({
  slug: 'checkbox',
  label: 'Checkbox',
  icon: LEGACY_ICONS.checkbox,
  Component: CheckboxGuide,
})

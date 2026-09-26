import { AccordionCheckboxGuide } from '../AccordionCheckboxGuide'
import { defineGuide } from './define'
import { LEGACY_ICONS } from './icons'

export default defineGuide({
  slug: 'accordioncheckbox',
  label: 'Accordion Checkbox',
  icon: LEGACY_ICONS.accordioncheckbox,
  Component: AccordionCheckboxGuide,
})

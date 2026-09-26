import { AccordionGuide } from '../AccordionGuide'
import { defineGuide } from './define'
import { LEGACY_ICONS } from './icons'

export default defineGuide({
  slug: 'accordion',
  label: 'Accordion',
  icon: LEGACY_ICONS.accordion,
  Component: AccordionGuide,
})

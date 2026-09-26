import { ActionFooterGuide } from '../ActionGuides'
import { defineGuide } from './define'
import { LEGACY_ICONS } from './icons'

export default defineGuide({
  slug: 'actionfooter',
  label: 'Action Footer',
  icon: LEGACY_ICONS.actionfooter,
  Component: ActionFooterGuide,
})
